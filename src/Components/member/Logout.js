import { useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthProvider";

function Logout() {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("bbs_access_token");
    localStorage.removeItem("id");

    alert(auth + "님, 성공적으로 로그아웃 됐습니다 🔒");

    // 상태를 즉시 변경하는 것이 아니라 비동기적으로 업데이트
    setTimeout(() => {
      setAuth(null);
      navigate("/");
    }, 100); // 약간의 지연을 두어 상태 변경 반영 후 페이지 이동
  };

  useEffect(() => {
    logout();
  }, []); // 빈 배열을 넣어 한 번만 실행되도록 설정

  return null; // UI가 필요하지 않으므로 아무것도 렌더링하지 않음
}

export default Logout;
