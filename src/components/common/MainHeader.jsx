import { Link } from "react-router-dom";

import { Search } from "lucide-react";
import Header from "./Header";
export default function MainHeader() {
  return (
    <Header
      left={
        <Link to="/home">
          <img
            className="w-[100px]"
            src={`${import.meta.env.BASE_URL}img/logo/logo.png`}
            alt="Logo"
          />
        </Link>
      }
      right={
        <Link
          to="/map"
          className="
                click-scale-sm
                flex
                flex-col
                items-center
                text-[#555555]
              "
        >
          <Search size={22} strokeWidth={1.5} />

          <span
            className="
                  text-[12px]
                  leading-[18px]
                "
          >
            도시검색
          </span>
        </Link>
      }
    />
  );
}
