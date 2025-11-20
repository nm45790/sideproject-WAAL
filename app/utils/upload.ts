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

export const uploadFile = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // 토큰 가져오기
    const accessToken = tokenManager.getAccessToken();
    const baseURL = process.env.NEXT_PUBLIC_API_URL || "";
    const targetUrl = `${baseURL}/api/v1/s3/upload`;

    console.log("🚀 파일 업로드 시작 (프록시 사용):", {
      targetUrl,
      hasToken: !!accessToken,
      fileName: file.name,
      fileSize: file.size,
    });

    // 프록시를 통한 업로드
    formData.append("url", targetUrl);

    const headers: Record<string, string> = {};
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch("/api/proxy", {
      method: "POST",
      headers,
      body: formData,
    });

    console.log("📡 업로드 응답:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ 업로드 실패:", {
        status: response.status,
        statusText: response.statusText,
        errorText,
      });
      throw new Error(
        `Upload failed: ${response.status} ${response.statusText}`,
      );
    }

    const data: UploadResponse = await response.json();
    console.log("✅ 업로드 성공:", data);

    if (data.code !== 200) {
      throw new Error(`Upload failed with code: ${data.code}`);
    }

    return data.data.s3Key;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};
