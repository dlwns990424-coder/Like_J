import { useState } from "react";

import { ChevronDown, StickyNote } from "lucide-react";

import { updateTrip } from "../../../lib/storage";

export default function TripMemo({ trip }) {
  const [memo, setMemo] = useState(trip.memo || "");

  const handleBlur = () => {
    updateTrip(trip.id, {
      memo,
    });
  };

  return (
    <section>
      <div className="flex items-center gap-[6px]">
        <ChevronDown size={20} strokeWidth={1.5} />

        <h2 className="text-[18px] font-semibold leading-[26px] tracking-[-0.01em]">
          메모
        </h2>
      </div>

      <div className="mt-[12px] flex h-[38px] w-full items-center gap-[10px] rounded-xl bg-[#F5F5F5] px-[10px]">
        <StickyNote
          size={18}
          strokeWidth={1.5}
          className="shrink-0 text-[#888888]"
        />

        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          onBlur={handleBlur}
          placeholder="간단한 메모를 작성해보세요."
          className="h-full w-full bg-transparent text-[14px] leading-[20px] outline-none placeholder:text-[#888888]"
        />
      </div>
    </section>
  );
}
