import { Meteor } from "meteor/meteor";
import { Studys, StudyUsers } from "/imports/api/collections";

Meteor.methods({
  //모집글 작성 후 작성자를 승인된 참여자로 설정
  insert: (data, userId) => {
    //유효성 검사 메시지에서 사용될 필드 이름
    const fieldName = {
      title: "제목",
      onOff: "모임형태",
      location: "지역",
      memberCount: "총 참여 인원 수",
      techStack: "기술스택",
      score: "요구역량",
      content: "내용",
    };

    //유효성 검사 시 누락되면 안 되는 필드
    const requireFields = [
      "title",
      "onOff",
      "memberCount",
      "techStack",
      "score",
      "content",
    ];

    if (data.onOff !== "온라인") {
      if (!data.location.city || !data.location.gubun) {
        throw new Meteor.Error("missingField", `지역을 선택해 주세요`);
      }
    }

    //유효성 검사 메시지
    requireFields.forEach((field) => {
      if (!data[field] || (field === "techStack" && data[field].length === 0)) {
        throw new Meteor.Error(
          "missingField",
          `${fieldName[field]}은(는) 필수 입력 항목입니다`
        );
      }
    });

    const studyId = Studys.insert({
      ...data,
      status: "모집중",
      views: 0,
      createdAt: new Date(),
    });

    StudyUsers.insert({
      studyId: studyId,
      userId: userId,
      status: "승인",
    });

    return studyId;
  },

  //모집글 가져오기
  select: (id) => {
    return Studys.findOne({ _id: id });
  },

  //글 수정
  update: (id, data) => {
    const study = Studys.find({ _id: id });

    return Studys.update({ _id: id }, { $set: { ...data } });
  },
});
