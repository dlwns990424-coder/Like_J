export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "확인",
  onConfirm,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[999]
        flex
        items-center
        justify-center
        bg-black/40
        px-5
      "
    >
      <div
        className="
          w-full
          max-w-[350px]
          rounded-2xl
          bg-white
          px-[20px]
          pt-[24px]
          pb-[16px]
          shadow-xl
        "
      >
        <h2 className="text-center text-[18px] font-semibold leading-[26px] tracking-[-0.02em] text-[#191919]">
          {title}
        </h2>

        {message && (
          <p className="mt-[10px] text-center text-[14px] leading-[20px] text-[#555555]">
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={onConfirm}
          className="
            click-scale
            mt-[24px]
            flex
            h-[48px]
            w-full
            items-center
            justify-center
            rounded-xl
            bg-[#3478F6]
            text-[16px]
            font-semibold
            leading-[24px]
            text-white
          "
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}
