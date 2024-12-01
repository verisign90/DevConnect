import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home.jsx";
import NotFound from "./NotFound.jsx";
import Nav from "./Nav.jsx";
import { useTracker } from "meteor/react-meteor-data";

import Login from "./User/Login.jsx";
import Join from "./User/Join.jsx";
import Password from "./User/Password.jsx";

import EditProfile from "./MyPage/EditProfile.jsx";

import Write from "./Project/Write.jsx";
import Detail from "./Project/Detail.jsx";

export const App = () => {
  //로그인 사용자 데이터 도착 전에 화면이 렌더링되지 않도록 로딩 페이지 적용
  const { loggingIn, user } = useTracker(() => ({
    //사용자가 로그인 중인지 확인. 로그인 중이면 true.
    loggingIn: Meteor.loggingIn(),
    user: Meteor.user(),
  }));

  //사용자가 로그인 중이면 표시. 로그인 처리가 완료되기 전까지 표시됨
  if (loggingIn) {
    return <div>... loading</div>;
  }

  //로그인하지 않은 사용자가 볼 수 있는 페이지
  if (!user) {
    return (
      <Router>
        <Nav />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/detail/:id" element={<Detail />} />
        </Routes>
      </Router>
    );
  }

  //로그인된 사용자가 볼 수 있는 페이지
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="*" element={<NotFound />}></Route>

        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/resetPassword/:token" element={<Password />} />
        <Route path="/resetPassword" element={<Password />} />

        <Route path="/editProfile" element={<EditProfile />} />

        <Route path="/write" element={<Write />} />
        <Route path="/write/:id" element={<Write />} />
        <Route path="/detail/:id" element={<Detail />} />
      </Routes>
    </Router>
  );
};
