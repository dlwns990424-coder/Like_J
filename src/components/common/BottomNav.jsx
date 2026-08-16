import { CircleUserRound, Home, Map } from "lucide-react";

import { NavLink } from "react-router-dom";

export default function BottomNav() {
  const navItems = [
    {
      path: "/home",
      label: "홈",
      icon: Home,
    },
    {
      path: "/map",
      label: "지도",
      icon: Map,
    },
    {
      path: "/mypage",
      label: "마이페이지",
      icon: CircleUserRound,
    },
  ];

  return (
    <nav
      className="
        fixed
        bottom-[calc(20px+env(safe-area-inset-bottom))]
        left-1/2
        z-50
        flex
        w-[calc(100%-40px)]
        max-w-[350px]
        -translate-x-1/2
        items-center
        justify-between
        rounded-[20px]
        bg-[#F5F5F5]/80
        px-[30px]
        py-[10px]
        shadow-lg
        backdrop-blur-md
      "
    >
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex h-[48px] w-[80px] flex-col items-center justify-center gap-[2px] text-[12px] leading-[18px] ${
                isActive ? "text-[#3478F6]" : "text-[#888888]"
              }`
            }
          >
            <Icon size={22} strokeWidth={1.5} />

            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
