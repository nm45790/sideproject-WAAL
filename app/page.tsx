"use client";

import { useEffect } from "react";
import MainContainer from "./components/MainContainer";
import { useRouter } from "next/navigation";
import { authService } from "./utils/auth";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  // 로그인 상태 체크
  useEffect(() => {
    const checkAndRedirect = async () => {
      let userInfo = authService.getCurrentUserInfo();
      const { tokenManager } = await import("./utils/cookies");
      const hasAccessToken = !!tokenManager.getAccessToken();
      const hasRefreshToken = !!tokenManager.getRefreshToken();
      console.log(userInfo?.role);

      console.log("🔍 [메인 페이지] 토큰 상태:", {
        hasAccessToken,
        hasRefreshToken,
        hasUserInfo: !!userInfo,
      });

      // 1. 액세스 토큰 + user_info 있으면 바로 리다이렉트
      if (userInfo && hasAccessToken) {
        console.log("✅ [조건1] 토큰과 사용자 정보 있음 - 자동 이동");
        redirectByRole(userInfo.role);
        return;
      }

      // 2. 액세스 토큰 있고 user_info 없으면 → 토큰에서 role 추출해서 자동 로그인
      if (!userInfo && hasAccessToken) {
        console.log(
          "🔄 [조건2] 토큰은 있지만 user_info 없음 - 토큰에서 정보 추출",
        );
        const tokenInfo = authService.getUserInfoFromToken();
        if (tokenInfo) {
          console.log(
            "✅ 토큰에서 role 추출 성공 - 자동 이동:",
            tokenInfo.role,
          );
          redirectByRole(tokenInfo.role);
          return;
        }
      }

      // 3. 액세스 토큰 없고 리프레시 토큰만 있으면 → 토큰 갱신 후 user_info 확인
      if (!hasAccessToken && hasRefreshToken) {
        console.log("🔄 [조건3] 리프레시 토큰만 있음 - 토큰 갱신 시도");
        const refreshResult = await authService.refreshToken();

        if (refreshResult.success) {
          console.log("✅ 토큰 갱신 성공");

          // 갱신 후 쿠키에서 user_info 확인
          userInfo = authService.getCurrentUserInfo();
          console.log("🔍 쿠키에서 user_info 확인:", userInfo);

          if (userInfo) {
            console.log("✅ user_info 있음 - 자동 이동");
            redirectByRole(userInfo.role);
            return;
          } else {
            console.error("❌ user_info 없음 - 로그인 필요");
            authService.logout();
          }
        } else {
          console.error("❌ 토큰 갱신 실패 - 로그인 필요");
          authService.logout();
        }
      }
    };

    const redirectByRole = (role: string) => {
      if (role === "USER") {
        router.push("/parent");
      } else if (role === "ACADEMY") {
        router.push("/academy");
      } else if (role === "TEMP") {
        router.push("/signup/role");
      } else if (role === "TEMP_ACADEMY") {
        router.push("/signup/academy/onboarding");
      } else if (role === "TEMP_USER") {
        router.push("/signup/parent/onboarding");
      }
    };

    checkAndRedirect();
  }, [router]);

  return (
    <div className="w-full min-h-screen">
      {/* 메인 콘텐츠 */}
      <div className="w-full flex justify-center min-h-screen">
        <MainContainer>
          <div className="bg-white w-full min-h-screen flex flex-col px-5">
            {/* 상단 여백 - Figma 기준 108px, 작은 화면/가로 모드에서는 비율로 조정 */}
            <div className="h-[10vh] min-h-[48px] max-h-[108px] sm:h-[108px]" />

            {/* 타이틀 - Figma: text-[20px] */}
            <div className="font-bold leading-normal text-[#363e4a] text-[20px]">
              <p className="mb-0">반려견 케어스페이스</p>
              <p>예약·관리 플랫폼</p>
            </div>

            {/* 서브타이틀 - Figma 기준 58px 간격, 작은 화면에서는 비율로 조정 */}
            <p
              className="font-medium leading-normal text-[#858585] text-[13px] sm:mt-[58px]"
              style={{ marginTop: "clamp(24px, 5vh, 58px)" }}
            >
              유치원, 호텔, 놀이방 등 다양한 공간을 한 곳에서 간편하게
            </p>

            {/* 이미지 - Figma 기준 85px 간격, 작은 화면에서는 비율로 조정 */}
            <div
              className="w-full flex-shrink-0 sm:mt-[85px]"
              style={{ marginTop: "clamp(24px, 7vh, 85px)" }}
            >
              <div className="aspect-[335/309] rounded-[7px] w-full max-w-[335px] sm:max-w-full relative overflow-hidden">
                <Image
                  src="/images/로그인 및 회원가입_img.png"
                  alt="login_and_signup_img"
                  width={335}
                  height={309}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* 하단 버튼 영역 - Figma 기준 91px 간격, 작은 화면에서는 비율로 조정 */}
            <div
              className="mt-auto pb-8 flex flex-col items-center w-full flex-shrink-0 sm:pt-[91px]"
              style={{ paddingTop: "clamp(32px, 8vh, 91px)" }}
            >
              {/* 로그인 버튼 - Figma: w-[335px], h-[59px] */}
              <button
                className="bg-[#3f55ff] h-[59px] rounded-[7px] w-full max-w-[335px] flex items-center justify-center cursor-pointer hover:bg-[#3646e6] transition-colors"
                onClick={() => router.push("/login")}
              >
                <span className="font-semibold leading-normal text-[16px] text-center text-nowrap text-white">
                  왈 아이디로 로그인
                </span>
              </button>

              {/* 회원가입 링크 - Figma 기준 20px 간격 */}
              <button
                className="mt-[20px] border-[#363e4a] border-[0px_0px_1px] border-solid flex items-center justify-center cursor-pointer"
                onClick={() => router.push("/signup/terms")}
              >
                <span className="font-semibold leading-[16px] text-[#363e4a] text-[16px] text-center text-nowrap">
                  왈 아이디로 회원가입
                </span>
              </button>
            </div>
          </div>
        </MainContainer>
      </div>
    </div>
  );
}
