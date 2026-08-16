import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { findUserByEmail, saveCurrentUser } from "../../lib/storage";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (!password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    const user = findUserByEmail(email.trim());

    if (!user) {
      alert("가입되지 않은 이메일입니다.");
      return;
    }

    if (user.password !== password) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    saveCurrentUser(user);

    navigate("/home");
  };

  return (
    <main className="min-h-dvh bg-white px-5 pt-[calc(40px+env(safe-area-inset-top))] pb-[calc(40px+env(safe-area-inset-bottom))] text-[#191919]">
      <div className="mx-auto flex min-h-[calc(100dvh-80px)] w-full max-w-[390px] flex-col">
        <Link
          to="/"
          className="text-center text-[28px] font-bold leading-[36px] tracking-[-0.02em]"
        >
          LOGO
        </Link>

        <section className="mt-[80px]">
          <h1 className="text-[28px] font-bold leading-[36px] tracking-[-0.02em]">
            로그인
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mt-[40px] flex flex-col gap-[16px]"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-[8px] block text-[14px] leading-[20px] tracking-[-0.01em]"
              >
                이메일
              </label>

              <input
                id="email"
                type="email"
                placeholder="이메일을 입력해주세요."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-[52px] w-full rounded-xl border border-transparent bg-[#F5F5F5] px-[10px] text-[16px] leading-[24px] tracking-[-0.01em] outline-none placeholder:text-[#888888] focus:border-[#888888]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-[8px] block text-[14px] leading-[20px] tracking-[-0.01em]"
              >
                비밀번호
              </label>

              <input
                id="password"
                type="password"
                placeholder="비밀번호를 입력해주세요."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-[52px] w-full rounded-xl border border-transparent bg-[#F5F5F5] px-[10px] text-[16px] leading-[24px] tracking-[-0.01em] outline-none placeholder:text-[#888888] focus:border-[#888888]"
              />
            </div>

            <button
              type="submit"
              className="mt-[16px] flex h-[52px] w-full items-center justify-center rounded-xl bg-[#3478F6] text-[16px] font-semibold leading-[24px] text-white"
            >
              로그인
            </button>
          </form>

          <div className="mt-[20px] flex items-center justify-center gap-[10px] text-[14px] leading-[20px]">
            <span className="text-[#555555]">아직 계정이 없으신가요?</span>

            <Link to="/signup" className="text-[#3478F6]">
              회원가입
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
