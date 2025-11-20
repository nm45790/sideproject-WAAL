import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, method = "POST", data, headers = {} } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // 실제 API URL 구성
    const apiUrl = url.startsWith("http")
      ? url
      : `${process.env.API_URL || process.env.NEXT_PUBLIC_API_URL}${url}`;

    console.log(`[API Proxy] ${method} ${apiUrl}`);

    // 프록시 요청 실행
    const response = await fetch(apiUrl, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    // 응답 데이터 파싱
    const responseData = await response.json();

    // 응답 헤더 복사
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });

    // 상태 코드와 함께 응답 반환
    return NextResponse.json(responseData, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[API Proxy Error]", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

// GET, PUT, PATCH, DELETE 등 다른 메서드도 지원
export async function GET(request: NextRequest) {
  return handleRequest(request, "GET");
}

export async function PUT(request: NextRequest) {
  return handleRequest(request, "PUT");
}

export async function PATCH(request: NextRequest) {
  return handleRequest(request, "PATCH");
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request, "DELETE");
}

async function handleRequest(request: NextRequest, method: string) {
  try {
    // URL 쿼리 파라미터에서 실제 API URL 가져오기
    const searchParams = request.nextUrl.searchParams;
    const targetUrl = searchParams.get("url");

    if (!targetUrl) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 },
      );
    }

    // 실제 API URL 구성
    const apiUrl = targetUrl.startsWith("http")
      ? targetUrl
      : `${process.env.API_URL || process.env.NEXT_PUBLIC_API_URL}${targetUrl}`;

    console.log(`[API Proxy] ${method} ${apiUrl}`);

    // 요청 헤더 복사
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      if (
        !key.startsWith("host") &&
        !key.startsWith("connection") &&
        !key.startsWith("content-length")
      ) {
        headers.set(key, value);
      }
    });

    // 프록시 요청 실행
    const response = await fetch(apiUrl, {
      method,
      headers,
      body: method !== "GET" ? await request.text() : undefined,
    });

    // 응답 데이터 파싱
    const responseData = await response.json();

    // 응답 반환
    return NextResponse.json(responseData, {
      status: response.status,
    });
  } catch (error) {
    console.error("[API Proxy Error]", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
