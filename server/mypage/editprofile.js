import { Meteor } from "meteor/meteor";

Meteor.methods({
  //이름, 기술스택, 사진 변경을 서버에 반영
  updateProfile: (profileData, userId) => {
    console.log(profileData);
    console.log(userId);
    const data = {};

    if (profileData.username) {
      data.username = profileData.username;
    }
    if (profileData.profile.techStack) {
      data["profile.techStack"] = profileData.profile.techStack;
    }
    if (profileData.profile.image) {
      data["profile.image"] = profileData.profile.image;
    }
    console.log(data);

    try {
      Meteor.users.update(
        {
          _id: userId,
        },
        { $set: data }
      );
    } catch (err) {
      console.error("서버 updateProfile 에러: ", err);
    }
  },
});
