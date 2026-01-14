import { tokenManager } from "./cookies";

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  requireAuth?: boolean;
}

class ApiClient {
  private baseURL: string;
  private useProxy: boolean;
  private isRefreshing = false;
  private refreshPromise: Promise<{
    success: boolean;
    shouldLogout: boolean;
  }> | null = null;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "";
    // production 환경일 때만 프록시 사용
    this.useProxy = process.env.NODE_ENV === "production";
    
    // 개발 환경에서만 로그 출력
    if (process.env.NODE_ENV === "development") {
      console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
      console.log("NODE_ENV:", process.env.NODE_ENV);
      console.log("Current baseURL:", this.baseURL);
      console.log("Using Proxy:", this.useProxy);
    }
    
    if (!this.baseURL) {
      if (process.env.NODE_ENV === "development") {
        console.warn("NEXT_PUBLIC_API_URL이 설정되지 않았습니다.");
      }
    }
  }

  /**
   * 토큰 갱신
   */
  private async refreshToken(): Promise<{
    success: boolean;
    shouldLogout: boolean;
  }> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performTokenRefresh();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<{
    success: boolean;
    shouldLogout: boolean;
  }> {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        console.warn("리프레시 토큰이 없습니다.");
        return { success: false, shouldLogout: true };
      }

      console.log("🔄 토큰 갱신 시도");

      let response: Response;
      if (this.useProxy) {
        // 프록시를 통한 요청
        response = await fetch("/api/proxy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: `${this.baseURL}/api/v1/auth/refresh`,
            method: "POST",
            data: { refreshToken },
          }),
        });
      } else {
        // 직접 요청
        response = await fetch(`${this.baseURL}/api/v1/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });
      }

      // 401, 403: 리프레시 토큰 만료 또는 무효 -> 로그아웃 필요
      if (response.status === 401 || response.status === 403) {
        console.error("❌ 리프레시 토큰 만료 또는 무효 - 로그아웃 필요");
        return { success: false, shouldLogout: true };
      }

      // 다른 에러: 네트워크 오류 등 -> 로그아웃 불필요
      if (!response.ok) {
        console.error(
          "⚠️ 토큰 갱신 실패 (일시적 오류 가능): HTTP",
          response.status,
        );
        return { success: false, shouldLogout: false };
      }

      const result = await response.json();
      console.log("토큰 갱신 응답:", result);

      // API 응답 구조: { code: 1073741824, data: { accessToken, refreshToken } }
      const data = result.data;

      if (data?.accessToken) {
        tokenManager.setAccessToken(data.accessToken);
        console.log("✅ AccessToken 갱신 성공");

        // 새로운 리프레시 토큰이 있다면 업데이트
        if (data.refreshToken) {
          tokenManager.setRefreshToken(data.refreshToken);
          console.log("✅ RefreshToken 갱신 성공");
        }

        return { success: true, shouldLogout: false };
      }

      console.error("⚠️ 응답에 accessToken이 없습니다:", data);
      return { success: false, shouldLogout: false };
    } catch (error) {
      console.error("⚠️ 토큰 갱신 중 예외 발생 (네트워크 오류):", error);
      // 네트워크 오류는 로그아웃하지 않음
      return { success: false, shouldLogout: false };
    }
  }

  /**
   * HTTP 요청 실행
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const { headers = {}, body, requireAuth = true, ...restOptions } = options;

    const url = `${this.baseURL}${endpoint}`;

    // 헤더 설정
    const requestHeaders = {
      "Content-Type": "application/json",
      ...headers,
    } as Record<string, string>;

    // 인증이 필요한 경우 토큰 추가
    if (requireAuth) {
      let accessToken = tokenManager.getAccessToken();

      // accessToken이 없으면 refreshToken으로 갱신 시도
      if (!accessToken) {
        console.log("🔄 AccessToken이 없어서 refreshToken으로 갱신 시도");
        const refreshResult = await this.refreshToken();
        if (refreshResult.success) {
          accessToken = tokenManager.getAccessToken();
        } else if (refreshResult.shouldLogout) {
          // 리프레시 토큰이 만료된 경우에만 로그아웃
          console.error("❌ 리프레시 토큰 만료 - 로그인 필요");
          tokenManager.clearTokens();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return {
            success: false,
            error: "인증이 만료되었습니다. 다시 로그인해주세요.",
            statusCode: 401,
          };
        } else {
          // 일시적 오류인 경우 에러만 반환 (로그아웃 X)
          console.warn("⚠️ 토큰 갱신 일시 실패 - 재시도 가능");
          return {
            success: false,
            error: "일시적인 오류가 발생했습니다. 다시 시도해주세요.",
            statusCode: 503,
          };
        }
      }

      if (accessToken) {
        requestHeaders["Authorization"] = `Bearer ${accessToken}`;
      }
    }

    // 요청 옵션 구성
    const requestOptions: RequestInit = {
      ...restOptions,
      headers: requestHeaders as HeadersInit,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include", // 쿠키 자동 전송 (SSE 호환성)
    };

    try {
      let response: Response;

      if (this.useProxy) {
        // 프록시를 통한 요청
        response = await fetch("/api/proxy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: url,
            method: requestOptions.method || "GET",
            data: body,
            headers: requestHeaders,
          }),
        });
      } else {
        // 직접 요청
        response = await fetch(url, requestOptions);
      }

      // 401 에러 처리 (토큰 만료)
      if (response.status === 401 && requireAuth) {
        console.log("🔐 401 에러 발생 - 토큰 갱신 시도");
        const refreshResult = await this.refreshToken();

        if (refreshResult.success) {
          // 토큰 갱신 성공 시 원래 요청 재시도
          console.log("✅ 토큰 갱신 성공 - 원래 요청 재시도");
          const newAccessToken = tokenManager.getAccessToken();
          if (newAccessToken) {
            requestHeaders.Authorization = `Bearer ${newAccessToken}`;

            let retryResponse: Response;
            if (this.useProxy) {
              // 프록시를 통한 재시도
              retryResponse = await fetch("/api/proxy", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  url: url,
                  method: requestOptions.method || "GET",
                  data: body,
                  headers: requestHeaders,
                }),
              });
            } else {
              // 직접 재시도
              retryResponse = await fetch(url, {
                ...requestOptions,
                headers: requestHeaders as HeadersInit,
                credentials: "include",
              });
            }

            return this.parseResponse<T>(retryResponse);
          }
        } else if (refreshResult.shouldLogout) {
          // 리프레시 토큰이 만료된 경우에만 로그아웃
          console.error("❌ 리프레시 토큰 만료 - 로그인 페이지로 이동");
          tokenManager.clearTokens();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }

          return {
            success: false,
            error: "인증이 만료되었습니다. 다시 로그인해주세요.",
            statusCode: 401,
          };
        } else {
          // 일시적 오류인 경우 에러만 반환 (로그아웃 X)
          console.warn("⚠️ 토큰 갱신 일시 실패 - 원래 401 에러 반환");
          return {
            success: false,
            error: "일시적인 오류가 발생했습니다. 다시 시도해주세요.",
            statusCode: 503,
          };
        }
      }

      return this.parseResponse<T>(response);
    } catch (error) {
      console.error("API 요청 실패:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "네트워크 오류가 발생했습니다.",
      };
    }
  }

  /**
   * 응답 파싱
   */
  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data,
          statusCode: response.status,
        };
      } else {
        const errorMessage =
          data.message || data.error || "서버 오류가 발생했습니다.";

        // 401(인증 오류)과 403(권한 오류)은 alert을 띄우지 않음 (자동 로그인 처리됨)
        if (
          response.status !== 401 &&
          response.status !== 403 &&
          typeof window !== "undefined"
        ) {
          alert(errorMessage);
        }

        return {
          success: false,
          error: errorMessage,
          statusCode: response.status,
        };
      }
    } catch (error) {
      console.error("응답 파싱 중 오류가 발생했습니다:", error);
      const errorMessage = "응답 파싱 중 오류가 발생했습니다.";

      if (typeof window !== "undefined") {
        alert(errorMessage);
      }

      return {
        success: false,
        error: errorMessage,
        statusCode: response.status,
      };
    }
  }

  // HTTP 메서드별 헬퍼 함수들
  async get<T>(
    endpoint: string,
    options?: Omit<RequestOptions, "method">,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, "method" | "body">,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: "POST", body });
  }

  async put<T>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, "method" | "body">,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: "PUT", body });
  }

  async patch<T>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, "method" | "body">,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: "PATCH", body });
  }

  async delete<T>(
    endpoint: string,
    options?: Omit<RequestOptions, "method">,
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: "DELETE" });
  }
}

// 싱글톤 인스턴스
export const apiClient = new ApiClient();

// 편의를 위한 단축 함수들
export const api = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, "method">) =>
    apiClient.get<T>(endpoint, options),

  post: <T>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => apiClient.post<T>(endpoint, body, options),

  put: <T>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => apiClient.put<T>(endpoint, body, options),

  patch: <T>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => apiClient.patch<T>(endpoint, body, options),

  delete: <T>(endpoint: string, options?: Omit<RequestOptions, "method">) =>
    apiClient.delete<T>(endpoint, options),
};
