import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <main className="min-h-dvh bg-white px-5 pt-[calc(40px+env(safe-area-inset-top))] pb-[calc(40px+env(safe-area-inset-bottom))] text-[#191919]">
      <div className="mx-auto flex min-h-[calc(100dvh-80px)] w-full max-w-[390px] flex-col">
        <h1 className="text-center text-[28px] font-bold leading-[36px] tracking-[-0.02em]">
          LOGO
        </h1>

        <div className="mt-[48px] h-[320px] w-full rounded-xl bg-[#D9D9D9]" />

        <section className="mt-[28px] text-center">
          <h2 className="text-[24px] font-bold leading-[32px] tracking-[-0.02em]">
            나만의 여행을 계획하고 기록하세요
          </h2>

          <p className="mt-[16px] text-[16px] font-normal leading-[24px] tracking-[-0.01em] text-[#555555]">
            일정부터 이동 동선, 지출과 기록까지
            <br />
            한곳에서 관리해보세요.
          </p>
        </section>

        <div className="mt-auto">
          <Link
            to="/signup"
            className="flex h-[52px] w-full items-center justify-center rounded-xl bg-[#3478F6] text-[16px] font-semibold leading-[24px] text-white"
          >
            회원가입
          </Link>

          <div className="mt-[16px] flex items-center justify-center gap-[10px] text-[14px] leading-[20px]">
            <span className="text-[#555555]">이미 계정이 있으신가요?</span>

            <Link to="/login" className="text-[#3478F6]">
              로그인
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
