import { tokenManager } from "./cookies";

interface UploadResponse {
  code: number;
  data: {
    s3Key: string;
    originalFileName: string;
    contentType: string;
    fileSize: number;
    presignedUrl: string;
  };
}

/**
 * 이미지 파일을 압축하여 용량을 줄입니다
 */
const compressImage = async (
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1920,
  quality: number = 0.8,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    // 이미지 파일이 아니면 원본 반환
    if (!file.type.startsWith("image/")) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Canvas 생성
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // 비율 유지하면서 리사이징
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // 이미지 그리기
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context not available"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Blob으로 변환
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to compress image"));
              return;
            }

            // 원본 파일명 유지
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          file.type,
          quality,
        );
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
};

export interface UploadResult {
  s3Key: string;
  presignedUrl: string;
}

export const uploadFile = async (file: File): Promise<UploadResult> => {
  try {
    // 이미지 파일인 경우 압축
    let fileToUpload = file;
    if (file.type.startsWith("image/")) {
      try {
        fileToUpload = await compressImage(file);
      } catch {
        // 압축 실패 시 원본 파일 사용
        fileToUpload = file;
      }
    }

    const formData = new FormData();
    formData.append("file", fileToUpload);

    // 토큰 가져오기
    const accessToken = tokenManager.getAccessToken();
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "";
    const targetUrl = `${baseURL}/api/v1/s3/upload`;
    const isProduction = process.env.NODE_ENV === "production";

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    let response: Response;

    if (isProduction) {
      // production: 프록시를 통한 업로드
      formData.append("url", targetUrl);
      response = await fetch("/api/proxy", {
        method: "POST",
        headers,
        body: formData,
      });
    } else {
      // development: 직접 업로드
      response = await fetch(targetUrl, {
        method: "POST",
        headers,
        body: formData,
      });
    }

    if (!response.ok) {
      throw new Error(
        `Upload failed: ${response.status} ${response.statusText}`,
      );
    }

    const data: UploadResponse = await response.json();

    if (data.code !== 200) {
      throw new Error(`Upload failed with code: ${data.code}`);
    }

    return {
      s3Key: data.data.s3Key,
      presignedUrl: data.data.presignedUrl,
    };
  } catch (error) {
    throw error;
  }
};
