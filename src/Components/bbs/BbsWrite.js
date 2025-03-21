import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";

import "../../css/bbswrite.css";

const API_BASE_URL = process.env.REACT_APP_API_URL; // 환경 변수 사용

function BbsWrite() {
  const { auth, setAuth } = useContext(AuthContext);
  const { headers, setHeaders } = useContext(HttpHeadersContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]); // 파일 목록 상태 추가

  const changeTitle = (event) => {
    setTitle(event.target.value);
  };
  const changeContent = (event) => {
    setContent(event.target.value);
  };

  const handleChangeFile = (event) => {
    const selectedFiles = Array.from(event.target.files).slice(0, 5);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  /* 파일 업로드 */
  const fileUpload = async (boardId) => {
    console.log("업로드할 파일 목록:", files);
    const fd = new FormData();
    files.forEach((file) => fd.append("file", file));

    await axios
      .post(`${API_BASE_URL}/board/${boardId}/file/upload`, fd, {
        headers: headers,
      })
      .then((resp) => {
        console.log("[file.js] fileUpload() success :D");
        console.log(resp.data);
        alert("파일 업로드 성공 :D");
      })
      .catch((err) => {
        console.log("[FileData.js] fileUpload() error :<");
        console.log(err);
      });
  };

  /* [POST /bbs]: 게시글 작성 */
  const createBbs = async () => {
    const req = { title: title, content: content };

    await axios
      .post(`${API_BASE_URL}/board/write`, req, { headers: headers })
      .then((resp) => {
        console.log("[BbsWrite.js] createBbs() success :D");
        console.log(resp.data);
        const boardId = resp.data.boardId;
        console.log("boardId:", boardId);
        fileUpload(boardId);

        alert("새로운 게시글을 성공적으로 등록했습니다 :D");
        navigate(`/bbsdetail/${resp.data.boardId}`);
      })
      .catch((err) => {
        console.log("[BbsWrite.js] createBbs() error :<");
        console.log(err);
      });
  };

  useEffect(() => {
    setHeaders({
      Authorization: `Bearer ${localStorage.getItem("bbs_access_token")}`,
    });

    if (!auth) {
      alert("로그인 한 사용자만 게시글을 작성할 수 있습니다 !");
      navigate(-1);
    }
  }, []);

  return (
    <div>
      <table className="table">
        <tbody>
          <tr>
            <th className="table-primary">작성자</th>
            <td>
              <input
                type="text"
                className="form-control"
                value={localStorage.getItem("id")}
                size="50px"
                readOnly
              />
            </td>
          </tr>
          <tr>
            <th className="table-primary">제목</th>
            <td>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={changeTitle}
                size="50px"
              />
            </td>
          </tr>
          <tr>
            <th className="table-primary">내용</th>
            <td>
              <textarea
                className="form-control"
                value={content}
                onChange={changeContent}
                rows="10"
              ></textarea>
            </td>
          </tr>
          <tr>
            <th className="table-primary">파일</th>
            <td>
              {files.map((file, index) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <p>
                    <strong>FileName:</strong> {file.name}
                  </p>
                  <button
                    className="delete-button"
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                  >
                    x
                  </button>
                </div>
              ))}
              {files.length < 5 && (
                <div>
                  <input
                    type="file"
                    name="file"
                    onChange={handleChangeFile}
                    multiple="multiple"
                  />
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="my-5 d-flex justify-content-center">
        <button className="btn btn-outline-secondary" onClick={createBbs}>
          <i className="fas fa-pen"></i> 등록하기
        </button>
      </div>
    </div>
  );
}

export default BbsWrite;
