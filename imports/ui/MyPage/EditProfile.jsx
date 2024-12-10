import React, { useState, useRef, useEffect } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { useParams } from "react-router-dom";
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
  const [nameCheck, setNameCheck] = useState(false);
  const [nameModify, setNameModify] = useState(false);
  const [photoModify, setPhotoModify] = useState(false);
  const [techStackModify, setTechStackModify] = useState(false);
  const { userId } = useParams();

  //현재 로그인한 사용자의 이름, 기술스택 추적
  const { username, techStack, userFile, isLoading } = useTracker(() => {
    const user = Meteor.user(); //현재 로그인된 유저 데이터
    console.log("Files: ", Files);
    const userFile = Files.findOne({ userId: user._id });
    console.log("userFile: ", userFile);

    return {
      username: user?.username,
      techStack: user?.profile.techStack,
      userFile: userFile,
      isLoading: !user,
    };
  });

  //사용자의 기술스택이 변할 때마다 myStack 업데이트
  useEffect(() => {
    if (techStack && myStack.length === 0) {
      setMyStack(techStack);
    }
  }, []);

  useEffect(() => {
    console.log("미리보기 url 변경", previewUrl);
  }, [previewUrl]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  //사용자가 선택한 파일에 대한 미리보기 url 설정
  const fileChange = (e) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      const file = e.currentTarget.files[0];
      setSelectFile(file);
      setPreviewUrl(URL.createObjectURL(file));

      console.log("선택한 파일: ", file);
      console.log("미리보기 url: ", URL.createObjectURL(file));

      setPhotoModify(true);
    }
  };

  //프로필 저장
  const saveProfile = () => {
    const profileData = {};

    if (nameModify && name) {
      profileData.username = name;
    }

    if (techStackModify && myStack.length > 0) {
      profileData.profile = { techStack: myStack };
    }

    if (photoModify && selectFile) {
      //파일을 서버에 저장하고 업로드 진행 상태를 추적할 수 있는 upload 이벤트 리스너 반환
      const upload = Files.insert(
        {
          file: selectFile,
          //파일을 동적으로 chunk로 나누어 업로드(대용량 파일 업로드 시 성능 향상)
          chunkSize: "dynamic",
          meta: {
            userId: Meteor.userId(),
          },
        },
        false //파일 업로드 비동기 처리
      );

      // 업로드 시작
      upload.on("start", function () {
        console.log("업로드 시작");
      });

      // 업로드 완료
      upload.on("end", function (err, fileObj) {
        if (err) {
          console.error("파일 업로드 end 에러: ", err);
        } else {
          console.log("파일이 업로드되었습니다");
          console.log("fileObj: ", fileObj);
          //fileObj 파일 업로드 완료 후 생성되는 객체
          //link() fileObj에 대한 공개 url 생성
          const fileLink = Files.link(fileObj);

          profileData.profile = { image: fileLink };
          Meteor.call(
            "updateProfile",
            profileData,
            Meteor.user()._id,
            (err) => {
              if (err) {
                console.error("updateProfile 에러: ", err);
              } else {
                alert("프로필이 업데이트 되었습니다");
              }
            }
          );
        }
      });

      // 실제 파일 업로드 프로세스 비동기로 시작
      upload.start();
    } else {
      //이름/기술스택/사진 변경을 서버에 반영
      Meteor.call(
        "updateProfile",
        profileData,
        Meteor.user()._id,
        (err, rlt) => {
          if (err) {
            console.error("updateProfile 에러: ", err);
          } else {
            alert("프로필이 업데이트 되었습니다");
          }
        }
      );
    }
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
      setTechStackModify(true);
    }
  };

  //기술스택 삭제
  const removeStack = (stack) => {
    setMyStack(myStack.filter((st) => st !== stack));
    setTechStackModify(true);
  };

  //이름 중복확인
  const checkName = () => {
    if (!name) {
      alert("이름을 입력해 주세요");
      return;
    }

    Meteor.call("checkName", name, (err, isExist) => {
      if (err) {
        console.error("프로필 수정 checkName 실패: ", err);
        return;
      }

      if (isExist) {
        alert("이미 사용 중인 이름입니다");
      } else {
        alert("사용 가능한 이름입니다");
        setNameCheck(true);
        setNameModify(true);
      }
    });
  };

  return (
    <>
      <h2>프로필 수정</h2>
      <h3>사진 변경</h3>
      {userFile ? (
        <div style={{ marginBottom: "20px" }}>
          <img
            src={userFile.link()}
            style={{
              width: "300px",
              height: "300px",
              borderRadius: "50%", //모서리 둥글게
              objectFit: "cover", //비율 유지하면서 완전히 채움
              border: "2px solid #ddd",
            }}
          />
        </div>
      ) : previewUrl ? (
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
      <button onClick={checkName}>중복확인</button>
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
      <br />
      {myStack.map((stack) => (
        <span key={stack} style={{ marginRight: "10px" }}>
          {stack}
          <button onClick={() => removeStack(stack)}>X</button>
        </span>
      ))}
      <br />
      <button onClick={saveProfile}>프로필저장</button>
    </>
  );
};

export default EditProfile;
