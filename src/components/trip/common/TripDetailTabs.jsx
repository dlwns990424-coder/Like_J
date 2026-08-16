const tabs = [
  {
    id: "prepare",
    label: "여행 준비",
  },
  {
    id: "schedule",
    label: "일정",
  },
  {
    id: "expense",
    label: "지출",
  },
];

export default function TripDetailTabs({
  activeTab,
  onChange,
  top,
  animateTop,
  duration,
}) {
  return (
    <nav
      className={`
        fixed
        left-1/2
        z-40
        grid
        h-[48px]
        w-full
        max-w-[390px]
        -translate-x-1/2
        grid-cols-3
        bg-white
        px-5

        ${animateTop ? "transition-[top] ease-in-out" : ""}
      `}
      style={{
        top,
        transitionDuration: animateTop ? `${duration}ms` : "0ms",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`
            relative
            h-[48px]
            text-[16px]
            font-semibold
            leading-[24px]
            transition-colors
            duration-200

            ${activeTab === tab.id ? "text-[#3478F6]" : "text-[#888888]"}
          `}
        >
          {tab.label}

          {activeTab === tab.id && (
            <span
              className="
                absolute
                bottom-0
                left-0
                h-[2px]
                w-full
                bg-[#3478F6]
              "
            />
          )}
        </button>
      ))}
    </nav>
  );
}
