import { X } from "lucide-react";

export default function SelectCard({ name, subName, imageUrl, onRemove }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#D9D9D9] bg-white">
      {/* 이미지 */}
      <div className="relative h-[320px] w-full bg-[#F5F5F5]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[14px] leading-[20px] text-[#888888]">
            대표 이미지가 없어요
          </div>
        )}

        {/* 선택 취소 */}
        <button
          type="button"
          onClick={onRemove}
          aria-label="선택 취소"
          className="
            click-scale
            absolute
            top-[12px]
            right-[12px]
            z-10
            flex
            h-[40px]
            w-[40px]
            items-center
            justify-center
            rounded-full
            bg-white
            text-[#555555]
          "
        >
          <X size={24} strokeWidth={1.7} />
        </button>
      </div>

      {/* 여행지 이름 */}
      <div className="flex flex-col items-center justify-center px-[16px] py-[10px] text-center">
        <p className="text-[16px] font-semibold leading-[24px] tracking-[-0.02em]">
          {name}
        </p>

        {subName && (
          <p className="mt-[2px] text-[13px] leading-[18px] text-[#888888]">
            {subName}
          </p>
        )}
      </div>
    </div>
  );
}
