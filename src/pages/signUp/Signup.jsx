import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ConfirmModal from "../../components/common/ConfirmModal";

import { findUserByEmail, saveUser } from "../../lib/storage";

export default function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  // ====================
  // Nickname
  // ====================

  const isNameTooLong = name.length > 12;

  // ====================
  // Submit
  // ====================

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = name.trim();

    // ====================
    // Nickname
    // ====================

    if (!trimmedName) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    if (trimmedName.length > 12) {
      return;
    }

    // ====================
    // Email
    // ====================

    if (!email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }

    // ====================
    // Password
    // ====================

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(password)) {
      alert("비밀번호는 영문과 숫자를 포함하여 8자 이상 입력해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // ====================
    // Existing User
    // ====================

    const existingUser = findUserByEmail(email.trim());

    if (existingUser) {
      alert("이미 가입된 이메일입니다.");
      return;
    }

    // ====================
    // User
    // ====================

    const user = {
      id: crypto.randomUUID(),
      name: trimmedName,
      email: email.trim(),
      password,
    };

    saveUser(user);

    setIsCompleteModalOpen(true);
  };

  // ====================
  // Complete
  // ====================

  const handleCompleteConfirm = () => {
    setIsCompleteModalOpen(false);

    navigate("/login");
  };

  return (
    <>
      <main className="min-h-dvh bg-white px-5 pt-[calc(40px+env(safe-area-inset-top))] pb-[calc(40px+env(safe-area-inset-bottom))] text-[#191919]">
        <div className="mx-auto w-full max-w-[390px]">
          {/* ====================
              Logo
          ==================== */}

          <Link to="/" className="click-scale block ">
            <img
              className="w-[180px] m-auto my-0"
              src="../../img/logo/logo.png"
              alt="Logo"
            />
          </Link>

          {/* ====================
              Sign Up
          ==================== */}

          <section className="mt-[80px]">
            <h1 className="text-[28px] font-bold leading-[36px] tracking-[-0.02em]">
              회원가입
            </h1>

            <form
              onSubmit={handleSubmit}
              className="mt-[40px] flex flex-col gap-[16px]"
            >
              {/* ====================
                  Nickname
              ==================== */}

              <div>
                <label
                  htmlFor="name"
                  className="mb-[8px] block text-[14px] leading-[20px] tracking-[-0.01em]"
                >
                  닉네임
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="닉네임을 입력해주세요."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="off"
                  className={`
                    h-[52px]
                    w-full
                    rounded-xl
                    border
                    bg-[#F5F5F5]
                    px-[10px]
                    text-[16px]
                    leading-[24px]
                    tracking-[-0.01em]
                    outline-none
                    placeholder:text-[#888888]

                    ${
                      isNameTooLong
                        ? "border-[#E5484D]"
                        : "border-transparent focus:border-[#888888]"
                    }
                  `}
                />

                {isNameTooLong ? (
                  <p className="mt-[6px] text-[12px] leading-[18px] text-[#E5484D]">
                    12글자까지 작성해주세요.
                  </p>
                ) : (
                  <p className="mt-[6px] text-[12px] leading-[18px] text-[#888888]">
                    최대 12글자까지 입력할 수 있습니다.
                  </p>
                )}
              </div>

              {/* ====================
                  Email
              ==================== */}

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

              {/* ====================
                  Password
              ==================== */}

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
                  placeholder="영문, 숫자 포함 8자 이상"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-[52px] w-full rounded-xl border border-transparent bg-[#F5F5F5] px-[10px] text-[16px] leading-[24px] tracking-[-0.01em] outline-none placeholder:text-[#888888] focus:border-[#888888]"
                />
              </div>

              {/* ====================
                  Password Confirm
              ==================== */}

              <div>
                <label
                  htmlFor="passwordConfirm"
                  className="mb-[8px] block text-[14px] leading-[20px] tracking-[-0.01em]"
                >
                  비밀번호 확인
                </label>

                <input
                  id="passwordConfirm"
                  type="password"
                  placeholder="비밀번호를 다시 입력해주세요."
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="h-[52px] w-full rounded-xl border border-transparent bg-[#F5F5F5] px-[10px] text-[16px] leading-[24px] tracking-[-0.01em] outline-none placeholder:text-[#888888] focus:border-[#888888]"
                />
              </div>

              {/* ====================
                  Sign Up Button
              ==================== */}

              <button
                type="submit"
                className="click-scale mt-[16px] flex h-[52px] w-full items-center justify-center rounded-xl bg-[#3478F6] text-[16px] font-semibold leading-[24px] text-white"
              >
                회원가입
              </button>
            </form>

            {/* ====================
                Login
            ==================== */}

            <div className="mt-[20px] flex items-center justify-center gap-[10px] text-[14px] leading-[20px]">
              <span className="text-[#555555]">이미 계정이 있으신가요?</span>

              <Link to="/login" className="click-scale text-[#3478F6]">
                로그인
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* ====================
          Complete Modal
      ==================== */}

      <ConfirmModal
        isOpen={isCompleteModalOpen}
        title="회원가입 완료"
        message="회원가입이 완료되었습니다."
        confirmText="확인"
        onConfirm={handleCompleteConfirm}
      />
    </>
  );
}
