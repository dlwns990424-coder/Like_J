import { Link } from "react-router-dom";

export default function NewTripSection() {
  return (
    <section className="mt-[48px] flex h-[300px] flex-col justify-end bg-[#D9D9D9] px-5 pb-[30px]">
      <h2 className="text-[28px] font-bold leading-[36px] tracking-[-0.02em] text-white">
        다음 여행을 계획하세요
      </h2>

      <Link
        to="/trip-create"
        className="mt-[16px] w-fit rounded-full bg-[#3478F6] px-[10px] py-[6px] text-[16px] font-semibold leading-[24px] text-white"
      >
        새 여행 계획 만들기
      </Link>
    </section>
  );
}
