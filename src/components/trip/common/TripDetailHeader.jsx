import { Home, Trash2 } from "lucide-react";

export default function TripDetailHeader({ title, isSolid, onHome, onDelete }) {
  return (
    <header
      className={`
        fixed
        top-0
        left-1/2
        z-50
        w-full
        max-w-[390px]
        -translate-x-1/2
        pt-[env(safe-area-inset-top)]
        transition-colors
        duration-300
        ease-out

        ${isSolid ? "bg-white" : "bg-transparent"}
      `}
    >
      <div className="relative flex h-[60px] items-center justify-between px-5">
        {/* ====================
            Home
        ==================== */}

        <button
          type="button"
          onClick={onHome}
          aria-label="홈으로 이동"
          className={`
            relative
            z-10
            flex
            h-[40px]
            w-[40px]
            items-center
            justify-center
            transition-colors
            duration-300
            ease-out

            ${isSolid ? "text-[#191919]" : "text-white"}
          `}
        >
          <Home size={22} strokeWidth={1.5} />
        </button>

        {/* ====================
            Title
        ==================== */}

        <div
          className="
            pointer-events-none
            absolute
            top-1/2
            left-1/2
            w-[calc(100%-120px)]
            -translate-x-1/2
            -translate-y-1/2
          "
        >
          <p
            className={`
              w-full
              truncate
              text-center
              text-[16px]
              font-semibold
              leading-[24px]
              tracking-[-0.02em]
              text-[#191919]
              transition-opacity
              duration-300
              ease-out

              ${isSolid ? "opacity-100" : "opacity-0"}
            `}
          >
            {title}
          </p>
        </div>

        {/* ====================
            Delete
        ==================== */}

        <button
          type="button"
          onClick={onDelete}
          aria-label="여행 삭제"
          className={`
            relative
            z-10
            flex
            h-[40px]
            w-[40px]
            items-center
            justify-center
            transition-colors
            duration-300
            ease-out

            ${isSolid ? "text-[#191919]" : "text-white"}
          `}
        >
          <Trash2 size={20} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
