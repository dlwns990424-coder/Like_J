import { useState } from "react";
import { findUserByEmail, saveUser } from "../../lib/storage";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    if (!email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(password)) {
      alert("비밀번호는 영문과 숫자를 포함하여 8자 이상 입력해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const existingUser = findUserByEmail(email);

    if (existingUser) {
      alert("이미 가입된 이메일입니다.");
      return;
    }

    const user = {
      name: name.trim(),
      email: email.trim(),
      password,
    };

    saveUser(user);

    console.log("회원가입 완료:", user);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="이름을 입력해주세요."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="이메일을 입력해주세요."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="비밀번호를 입력해주세요."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="비밀번호를 다시 입력해주세요."
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
      />

      <button type="submit">회원가입</button>
    </form>
  );
}
