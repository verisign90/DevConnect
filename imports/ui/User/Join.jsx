import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";

//회원가입
const Join = () => {
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

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("backend");
  const [myStack, setMyStack] = useState([]);
  const [nameCheck, setNameCheck] = useState(false); //중복확인 했는지 여부
  const navigate = useNavigate();

  //selectbox에서 선택한 기술스택을 중복되지 않게 myStack에 추가
  const selectStack = (e) => {
    const select = e.target.value;

    if (select && !myStack.includes(select)) {
      setMyStack([...myStack, select]);
    }
  };

  //선택한 기술스택 삭제
  const deleteStack = (stack) => {
    setMyStack(myStack.filter((st) => st !== stack));
  };

  //이름 중복확인
  const checkName = () => {
    if (!name) {
      alert("이름을 입력해 주세요");
      return;
    }

    Meteor.call("checkName", name, (err, isExist) => {
      if (err) {
        console.error(err);
        alert("서버 에러가 발생했습니다");
        return;
      }

      if (isExist) {
        alert("이미 사용 중인 이름입니다");
      } else {
        alert("사용 가능한 이름입니다");
        setNameCheck(true);
      }
    });
  };

  //회원가입
  const join = (e) => {
    e.preventDefault();

    if (!nameCheck) {
      alert("이름 중복확인을 해주세요");
      return;
    }

    if (myStack.length === 0) {
      alert("기술스택을 최소 1개 선택해 주세요");
      return;
    }

    const user = {
      username: name,
      password: password,
      email: email,
      profile: {
        role: role,
        techStack: myStack,
        image: null,
        score: {
          manner: 3,
          mentoring: 3,
          passion: 3,
          communication: 3,
          time: 3,
        },
      },
    };
    Accounts.createUser(user);
    alert("가입되었습니다");
    navigate("/");
  };

  return (
    <div className="flex min-h-full flex-1 max-w-6xl mx-auto">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img
              className="h-10 w-auto"
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
              alt="DevConnect"
            />
            <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-gray-900">
              DevConnect
            </h2>
            <p className="mt-2 text-base/6 text-gray-500">
              나의 성장 메이트 DevConnect에서
              <br />
              <a
                href="#"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                다양한 학습의 기회를 얻으세요
              </a>
            </p>
          </div>

          <div className="mt-10">
            <form onSubmit={join} className="space-y-6">
              <div>
                {/* <label
                  htmlFor="name"
                  className="block text-lg font-medium leading-6 text-gray-900"
                >
                  이름
                </label> */}
                <div className="mt-2 flex items-center gap-x-2">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름을 입력해 주세요"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <button
                    type="button"
                    onClick={checkName}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 whitespace-nowrap"
                  >
                    중복확인
                  </button>
                </div>
              </div>

              <div>
                {/* <label
                  htmlFor="password"
                  className="block text-lg font-medium leading-6 text-gray-900"
                >
                  비밀번호
                </label> */}
                <div className="mt-2">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력해 주세요"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                {/* <label
                  htmlFor="email"
                  className="block text-lg font-medium leading-6 text-gray-900"
                >
                  이메일
                </label> */}
                <div className="mt-2">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일을 입력해 주세요"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                {/* <label className="text-lg font-medium leading-6 text-gray-900">
                  역할
                </label> */}
                <div className="mt-2 flex justify-between">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="backend"
                      name="role"
                      checked={role === "backend"}
                      onChange={() => setRole("backend")}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 text-base">백엔드</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="frontend"
                      name="role"
                      checked={role === "frontend"}
                      onChange={() => setRole("frontend")}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2">프론트엔드</span>
                  </label>
                </div>
              </div>

              <div>
                {/* <label
                  htmlFor="stack"
                  className="block text-lg font-medium leading-6 text-gray-900"
                >
                  기술스택
                </label> */}
                <div className="mt-2">
                  <select
                    id="stack"
                    onChange={selectStack}
                    value=""
                    disabled={myStack.length === 5}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option value="" disabled className="text-gray-900">
                      기술스택 (최대 5개 선택)
                    </option>
                    {stackList.map((stack) => (
                      <option key={stack} value={stack}>
                        {stack}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {myStack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {myStack.map((stack) => (
                    <span
                      key={stack}
                      className="inline-flex items-center rounded-md bg-indigo-100 px-2 py-1 text-sm font-medium text-indigo-700"
                    >
                      {stack}
                      <button
                        onClick={() => deleteStack(stack)}
                        className="ml-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:bg-indigo-500 focus:text-white focus:outline-none"
                      >
                        <span className="sr-only">Remove {stack}</span>
                        <svg
                          className="h-2 w-2"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 8 8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeWidth="1.5"
                            d="M1 1l6 6m0-6L1 7"
                          />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-base font-medium leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  회원가입
                </button>
              </div>
            </form>

            <div className="mt-10">
              <div className="relative">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-white px-6 text-gray-900">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <a
                  href="#"
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                >
                  <svg
                    className="h-5 w-5"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                      fill="#34A853"
                    />
                  </svg>
                  <span className="text-sm font-semibold leading-6">
                    Google
                  </span>
                </a>

                <a
                  href="#"
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                >
                  <svg
                    className="h-5 w-5 fill-[#24292F]"
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-semibold leading-6">
                    GitHub
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
          alt=""
        />
      </div>
    </div>
  );
};

export default Join;
