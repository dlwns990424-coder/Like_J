import { FileText } from "lucide-react";

export default function ScheduleMemo({ memo, onClick }) {
  const hasMemo = Boolean(memo?.trim());

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        click-scale
        mt-[8px]
        flex
        min-h-[38px]
        w-full
        items-center
        gap-[8px]
        rounded-lg
        bg-[#F5F5F5]
        px-[10px]
        py-[8px]
        text-left
      "
    >
      <FileText
        size={16}
        strokeWidth={1.5}
        className={`
          shrink-0

          ${hasMemo ? "text-[#555555]" : "text-[#888888]"}
        `}
      />

      <span
        className={`
          min-w-0
          flex-1
          truncate
          text-[12px]
          leading-[18px]

          ${hasMemo ? "text-[#555555]" : "text-[#888888]"}
        `}
      >
        {hasMemo ? memo : "간단한 메모를 작성해보세요."}
      </span>
    </button>
  );
}
