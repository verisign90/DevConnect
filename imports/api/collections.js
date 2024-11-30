import { Mongo } from "meteor/mongo";
import { FilesCollection } from "meteor/ostrio:files";

//export const LinksCollection = new Mongo.Collection('links');
export const UserScores = new Mongo.Collection("userScores");
export const Studys = new Mongo.Collection("studys");

export const Files = new FilesCollection({
  //FilesCollection 파일 업로드 기능을 제공하는 컬렉션
  collectionName: "files",
  allowClientCode: false, //서버에서만 파일 업로드 처리 가능
  //파일 업로드 되기 전 실행
  onBeforeUpload(file) {
    //파일 유효성 검사(10mb 이하, i 대소문자 구분하지 않고 png/jpg/jpeg 허용)
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true; //업로드 허용
    }
    return "10MB 이하의 이미지 파일(png, jpg, jpeg)만 업로드 가능합니다.";
  },
});
