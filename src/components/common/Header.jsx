import { ArrowLeft, X } from "lucide-react";

export default function Header({
  left,
  right,
  onBack,
  onClose,
  showBack = false,
  showClose = false,
}) {
  return (
    <header
      className="
        fixed
        top-0
        left-1/2
        z-50
        w-full
        max-w-[390px]
        -translate-x-1/2
        bg-white
        pt-[env(safe-area-inset-top)]
      "
    >
      <div className="flex h-[60px] items-center justify-between border-b border-[#D9D9D9] px-5">
        <div className="flex min-w-[40px] items-center justify-start">
          {left}

          {showBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex h-[40px] w-[40px] items-center justify-center"
            >
              <ArrowLeft size={24} strokeWidth={1.5} />
            </button>
          )}
        </div>

        <div className="flex min-w-[40px] items-center justify-end">
          {right}

          {showClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-[40px] w-[40px] items-center justify-center"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
