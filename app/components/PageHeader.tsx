"use client";

import { useRouter } from "next/navigation";
import Icons from "./Icons";

interface PageHeaderProps {
  title?: string;
  variant?: "back" | "close";
  onBack?: () => void;
}

export default function PageHeader({
  title,
  variant = "back",
  onBack,
}: PageHeaderProps) {
  const router = useRouter();
  const handleGoBack = onBack || (() => router.back());

  return (
    <div
      className={`relative flex items-center pt-10 sm:pt-[45px] ${
        title ? "justify-center" : ""
      }`}
    >
      <button
        onClick={handleGoBack}
        className={`p-3 sm:p-[18px] w-12 h-12 sm:w-[57px] sm:h-[57px] flex items-center justify-center -ml-3 sm:-ml-[18px] ${
          title ? "absolute left-0" : ""
        }`}
      >
        {variant === "close" ? (
          <Icons.Close className="w-4 h-4 sm:w-[17px] sm:h-[17px] text-gray-900" />
        ) : (
          <Icons.Prev className="w-5 h-5 sm:w-[26px] sm:h-[22px]" />
        )}
      </button>
      {title && (
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-7 sm:leading-[30px]">
          {title}
        </h1>
      )}
    </div>
  );
}
