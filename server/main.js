import { Meteor } from "meteor/meteor";
import "./init.js";

import "./user/join.js";

import "./mypage/editprofile.js";
import "./mypage/leader.js";
import "./mypage/studyuserlist.js";
import "./mypage/evaluate.js";
import "./mypage/notice.js";

import "./project/write.js";
import "./project/detail.js";

//Meteor가 실행될 때 자동으로 호출되는 함수. 초기 설정할 때 유용. (환경변수/DB연결/외부 API 설정)
Meteor.startup(() => {
  //process.env 노드에서 환경변수 다룰 때 사용
  //mail_url 이메일 전송 시 사용하는 환경변수
  process.env.MAIL_URL =
    "smtps://aplint0109@gmail.com:bfbvexltskgleeoh@smtp.gmail.com:465";
});

//서버에서 클라이언트에 allUserEmails 구독 발행
Meteor.publish("allUserEmails", function () {
  return Meteor.users.find({}, { fields: { "emails.address": 1, profile: 1 } });
});
