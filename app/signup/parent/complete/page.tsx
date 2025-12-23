"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import MainContainer from "../../../components/MainContainer";
import { authService } from "../../../utils/auth";
import { useSignupStore } from "../../../store/signupStore";

export default function ParentCompletePage() {
  const router = useRouter();
  const { isParentOnboardingCompleted } = useSignupStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userInfo = authService.getCurrentUserInfo();

  // 접근권한 체크 및 토큰 갱신
  useEffect(() => {
    // 온보딩 완료 여부 체크
    if (!isParentOnboardingCompleted()) {
      alert("잘못된 접근입니다.");
      router.push("/");
      return;
    }

    // 사용자 정보가 있는 경우에만 토큰 갱신 (로그인 상태인 경우)
    if (userInfo) {
      // 완료 후 토큰 갱신하여 최신 role 정보 가져오기
      const refreshUserInfo = async () => {
        setIsRefreshing(true);
        try {
          const refreshResult = await authService.refreshToken();
          if (refreshResult.success) {
            console.log("✅ 토큰 갱신 성공 - role 업데이트됨");
          } else {
            console.log("⚠️ 토큰 갱신 실패 - 로그아웃 후 재로그인 필요");
            // 토큰 갱신 실패 시 로그아웃하고 로그인 페이지로 이동
            authService.logout();
            return;
          }
        } catch (error) {
          console.error("토큰 갱신 오류:", error);
          // 오류 발생 시 로그아웃하고 로그인 페이지로 이동
          authService.logout();
          return;
        } finally {
          setIsRefreshing(false);
        }
      };

      refreshUserInfo();
    }
  }, [router, userInfo, isParentOnboardingCompleted]);

  const handleStart = async () => {
    // 사용자 정보가 있는 경우 토큰 갱신 시도
    if (userInfo) {
      const refreshResult = await authService.refreshToken();

      if (refreshResult.success) {
        // 갱신 성공 시 보호자 메인 페이지로 이동
        window.location.href = "/parent";
      } else {
        // 갱신 실패 시 로그아웃하고 로그인 페이지로 이동
        alert("사용자 정보를 업데이트하기 위해 다시 로그인해주세요.");
        authService.logout();
      }
    } else {
      // 로그인하지 않은 경우 그냥 이동
      router.push("/parent");
    }
  };

  return (
    <MainContainer>
      <div className="bg-white w-full min-h-dvh flex flex-col px-5">
        {/* 상단 progress indicator */}
        <div className="flex justify-center pt-[111px]">
          <div className="bg-[#030d51] h-[10px] rounded-[200px] w-[20px]" />
        </div>

        {/* 이미지 */}
        <div className="mt-[51px] w-full flex justify-start">
          <div className="h-[309px] rounded-[7px] w-[335px] relative overflow-hidden">
            <Image
              src="/images/강아지 등록(완료)_img.png"
              alt="강아지 등록 완료"
              width={335}
              height={309}
              className="h-[108.41%] w-full object-cover"
            />
          </div>
        </div>

        {/* 텍스트 영역 */}
        <div className="mt-[33px] flex flex-col items-center">
          {/* 제목 */}
          <h1 className="text-[25px] font-bold text-[#363e4a] text-center">
            댕댕이 등록 완료
          </h1>

          {/* 설명 */}
          <p className="text-[16px] font-medium text-[#6e7783] text-center mt-[16px]">
            지금 바로 왈을 시작해요!
          </p>
        </div>

        {/* 시작하기 버튼 */}
        <div className="mt-[92px] pb-8">
          <button
            onClick={handleStart}
            className="w-full h-[59px] bg-[#3f55ff] hover:bg-[#3646e6] rounded-[7px] flex items-center justify-center transition-colors"
          >
            <span className="font-semibold text-[16px] text-white">
              시작하기
            </span>
          </button>
        </div>
      </div>
    </MainContainer>
  );
}
