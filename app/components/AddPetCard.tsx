"use client";

import { useRouter } from "next/navigation";
import { useSignupStore } from "../store/signupStore";

export default function AddPetCard() {
  const router = useRouter();
  const { setIsAddingPet, resetPetData } = useSignupStore();

  const handleAddPet = () => {
    // 강아지 추가 모드 설정 및 데이터 초기화
    setIsAddingPet(true);
    resetPetData();
    // info 페이지로 이동
    router.push("/signup/parent/info");
  };

  return (
    <button
      onClick={handleAddPet}
      data-card
      className="bg-white rounded-lg sm:rounded-[7px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)] w-[280px] sm:w-[315px] min-h-[400px] sm:min-h-[458px] flex-shrink-0 snap-center flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
    >
      {/* + 아이콘을 십자가 형태로 표시 */}
      <div className="relative w-[60px] h-[60px]">
        {/* 세로 선 */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[3px] h-[60px] bg-[#d2d2d2] rounded-full" />
        {/* 가로 선 */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[60px] h-[3px] bg-[#d2d2d2] rounded-full" />
      </div>
    </button>
  );
}

