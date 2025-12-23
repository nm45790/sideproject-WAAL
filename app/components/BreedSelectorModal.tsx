"use client";

import { useState } from "react";
import Icons from "./Icons";
import { filterBySearch } from "../utils/search";
import { breeds } from "../constants/breeds";

interface BreedSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBreed: string;
  onBreedSelect: (breed: string) => void;
}

export default function BreedSelectorModal({
  isOpen,
  onClose,
  selectedBreed,
  onBreedSelect,
}: BreedSelectorModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // 초성 검색 지원
  const filteredBreeds = filterBySearch(breeds, searchTerm, (breed) => breed);

  const handleBreedClick = (breed: string) => {
    onBreedSelect(breed);
    onClose();
    setSearchTerm("");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-white"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 헤더 영역 */}
      <div className="bg-white">
        {/* 닫기 버튼 */}
        <div className="pt-[45px] px-5">
          <button
            onClick={onClose}
            className="p-[18px] w-[57px] h-[57px] flex items-center justify-center -ml-[18px]"
          >
            <Icons.Prev className="w-[26px] h-[22px]" />
          </button>
        </div>

        {/* 검색 입력 */}
        <div className="px-5 mt-[7px] mb-[28px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="견종을 선택해주세요"
            className="w-full h-[59px] border border-[#d2d2d2] rounded-[7px] px-5 text-[16px] font-medium outline-none placeholder:text-[#b4b4b4]"
          />
        </div>
      </div>

      {/* 견종 리스트 */}
      <div
        className="px-5 overflow-y-auto"
        style={{ height: "calc(100vh - 280px)" }}
      >
        <div className="bg-white rounded-[10px]">
          {filteredBreeds.length > 0 ? (
            filteredBreeds.map((breed) => (
              <button
                key={breed}
                onClick={() => handleBreedClick(breed)}
                className="w-full flex items-center px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                <p
                  className={`text-[16px] font-bold ${
                    breed === selectedBreed
                      ? "text-[#3f55ff]"
                      : "text-[#8e8e8e]"
                  }`}
                >
                  {breed}
                </p>
              </button>
            ))
          ) : (
            <div className="py-10 text-center">
              <p className="text-[16px] text-[#8e8e8e]">검색 결과가 없습니다</p>
            </div>
          )}
        </div>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-5 py-[25px]">
        <button
          onClick={onClose}
          disabled={!selectedBreed}
          className={`w-full h-[59px] rounded-[7px] flex items-center justify-center transition-colors ${
            selectedBreed
              ? "bg-[#3f55ff] cursor-pointer"
              : "bg-[#f0f0f0] cursor-not-allowed"
          }`}
        >
          <span className="font-semibold text-[16px] text-white">다음</span>
        </button>
      </div>
    </div>
  );
}
