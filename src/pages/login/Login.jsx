import { useState } from "react";
import { getUsers, saveCurrentUser } from "../../lib/storage";

export default function Login() {
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

    const users = getUsers();

    const matchedUser = users.find(
      (user) => user.email === email.trim() && user.password === password,
    );

    if (!matchedUser) {
      alert("이메일 또는 비밀번호가 일치하지 않습니다.");
      return;
    }

    saveCurrentUser(matchedUser);

    console.log("로그인 성공:", matchedUser);
  };

  return (
    <form onSubmit={handleSubmit}>
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

      <button type="submit">로그인</button>
    </form>
  );
}
