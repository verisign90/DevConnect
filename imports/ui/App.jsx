import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home.jsx";
import NotFound from "./NotFound.jsx";
import Nav from "./Nav.jsx";
import PostDetail from "./PostDetail.jsx";
import { useTracker } from "meteor/react-meteor-data";

import Login from "./User/Login";
import Join from "./User/Join";

export const App = () => {
  //로그인 사용자 데이터 도착 전에 화면이 렌더링되지 않도록 로딩 페이지 적용
  useTracker(() => {
    //사용자가 로그인 중인지 확인. 로그인 중이면 true.
    return [Meteor.loggingIn()];
  });

  //사용자가 로그인 중이면 표시. 로그인 처리가 완료되기 전까지 표시됨
  if (Meteor.loggingIn()) {
    return <div>... loading</div>;
  }

  <Router>
    <Nav />
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route
        path="/postDetail/:_id"
        element={<PostDetail></PostDetail>}
      ></Route>
      <Route path="*" element={<NotFound />}></Route>

      <Route path="/login" element={<Login />} />
      <Route path="/join" element={<Join />} />
    </Routes>
  </Router>;
};
