import React, { useState, useRef } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Files } from "/imports/api/collections";

//프로필 수정
const EditProfile = () => {
  //기술스택 목록
  const stackList = [
    "Java",
    "NodeJS",
    "Kotlin",
    "Mysql",
    "MongoDB",
    "Python",
    "Oracle",
    "AWS",
    "Spring",
    "Azure",
    "NextJS",
    "Kubernetes",
    "Javascript",
    "Flutter",
    "Docker",
    "Typescript",
    "Swift",
    "Django",
    "React",
    "ReactNative",
  ];

  const [selectFile, setSelectFile] = useState(null); //선택된 파일
  const [previewUrl, setPreviewUrl] = useState(null); //선택된 파일의 미리보기 url
  const fileInputRef = useRef(null);
  const [name, setName] = useState("");
  const [myStack, setMyStack] = useState([]);

  //현재 로그인한 사용자의 username 추적
  const username = useTracker(() => {
    const user = Meteor.user(); //현재 로그인된 유저 데이터
    return user.username;
  });

  //사용자가 선택한 파일에 대한 미리보기 url 설정
  const fileChange = (e) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      const file = e.currentTarget.files[0];
      setSelectFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  //파일 업로드
  const fileUpload = () => {
    if (!selectFile) {
      alert("선택한 파일이 없습니다");
      return;
    }

    //파일을 서버에 저장하고 업로드 진행 상태를 추적할 수 있는 upload 이벤트 리스너 반환
    const upload = Files.insert(
      {
        file: selectFile,
        //파일을 동적으로 chunk로 나누어 업로드(대용량 파일 업로드 시 성능 향상)
        chunkSize: "dynamic",
      },
      false //파일 업로드 비동기 처리
    );

    //업로드 시작
    upload.on("start", function () {
      console.log("업로드 시작");
    });

    //업로드 완료
    upload.on("end", function (err, fileObj) {
      if (err) {
        console.error("파일 업로드 end 에러: ", err);
      } else {
        alert("파일이 업로드되었습니다");
      }
    });

    //실제 파일 업로드 프로세스 시작
    upload.start();
  };

  //사진 업로드 버튼 클릭 시, input type="file" 클릭됨
  const clickFileInput = () => {
    fileInputRef.current.click();
  };

  //selectbox에서 선택한 기술스택을 중복되지 않게 myStack에 추가
  const selectStack = (e) => {
    const select = e.target.value;

    if (select && !myStack.includes(select)) {
      setMyStack([...myStack, select]);
    }
  };

  return (
    <>
      <h2>프로필 수정</h2>
      <h3>사진 변경</h3>
      {previewUrl ? (
        <div style={{ marginBottom: "20px" }}>
          <img
            src={previewUrl}
            style={{
              width: "300px",
              height: "300px",
              borderRadius: "50%", //모서리 둥글게
              objectFit: "cover", //비율 유지하면서 완전히 채움
              border: "2px solid #ddd",
            }}
          />
        </div>
      ) : (
        <div
          style={{
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            backgroundColor: "#f0f0f0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "2px solid #ddd",
          }}
        ></div>
      )}
      <input
        type="file"
        onChange={fileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      <button onClick={clickFileInput}>사진업로드</button>
      <hr />

      <h3>이름 변경</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={username}
      />
      <button>중복확인</button>
      <hr />

      <h3>기술스택 변경</h3>
      <label>
        <select onChange={selectStack} value="" disabled={myStack.length === 5}>
          <option value="" disabled>
            기술스택 (최대 5개 선택)
          </option>
          {stackList.map((stack) => (
            <option key={stack} value={stack}>
              {stack}
            </option>
          ))}
        </select>
      </label>
      {myStack.map((stack) => (
        <span key={stack} style={{ marginRight: "10px" }}>
          {stack}
        </span>
      ))}
      <br />
      <button onClick={fileUpload}>프로필저장</button>
    </>
  );
};

export default EditProfile;
