// Date prototyping
Date.prototype.addSeconds = function (s) {
  const date = new Date(this.getTime()); // 원본을 복사
  date.setSeconds(date.getSeconds() + s);
  return date;
};

Date.prototype.addMinutes = function (m) {
  const date = new Date(this.getTime());
  date.setMinutes(date.getMinutes() + m);
  return date;
};

Date.prototype.addHours = function (h) {
  const date = new Date(this.getTime());
  date.setHours(date.getHours() + h);
  return date;
};

Date.prototype.addDates = function (d) {
  //현재 Date 객체의 시간을 밀리초 단위로 반환해서 new Date()
  const date = new Date(this.getTime());
  //getDate 1~31일 반환 setDate date 객체 업데이트
  date.setDate(date.getDate() + d);
  return date;
};

Date.prototype.addMonths = function (month) {
  const date = new Date(this.getTime());
  date.setMonth(date.getMonth() + month);
  return date;
};

Date.prototype.addYears = function (year) {
  const date = new Date(this.getTime());
  date.setFullYear(date.getFullYear() + year);
  return date;
};

Date.prototype.clone = function () {
  return new Date(this.getTime());
};

// 년-월 (YYYY-MM)
Date.prototype.toStringYM = function () {
  return `${this.getFullYear()}-${String(this.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
};

// 년-월-일 (YYYY-MM-DD)
Date.prototype.toStringYMD = function () {
  return `${this.getFullYear()}-${String(this.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(this.getDate()).padStart(2, "0")}`;
};

// 년.월.일 (YYYY.MM.DD)
Date.prototype.toStringYMDdot = function () {
  return `${this.getFullYear()}.${String(this.getMonth() + 1).padStart(
    2,
    "0"
  )}.${String(this.getDate()).padStart(2, "0")}`;
};

// 월-일 시:분 (MM-DD HH:mm)
Date.prototype.toStringMDHM = function () {
  return `${String(this.getMonth() + 1).padStart(2, "0")}-${String(
    this.getDate()
  ).padStart(2, "0")} ${String(this.getHours()).padStart(2, "0")}:${String(
    this.getMinutes()
  ).padStart(2, "0")}`;
};

// 월-일 (MM-DD)
Date.prototype.toStringMD = function () {
  return `${String(this.getMonth() + 1).padStart(2, "0")}-${String(
    this.getDate()
  ).padStart(2, "0")}`;
};

// 시:분:초 (HH:mm:ss)
Date.prototype.toStringHMS = function () {
  return `${String(this.getHours()).padStart(2, "0")}:${String(
    this.getMinutes()
  ).padStart(2, "0")}:${String(this.getSeconds()).padStart(2, "0")}`;
};

// 시 (HH)
Date.prototype.toStringH = function () {
  return `${String(this.getHours()).padStart(2, "0")}`;
};

// 분 (mm)
Date.prototype.toStringM = function () {
  return `${String(this.getMinutes()).padStart(2, "0")}`;
};

// 시:분 (HH:mm)
Date.prototype.toStringHM = function () {
  return `${String(this.getHours()).padStart(2, "0")}:${String(
    this.getMinutes()
  ).padStart(2, "0")}`;
};

// 년-월-일 시:분:초 (YYYY-MM-DD HH:mm:ss)
Date.prototype.toStringYMDHMS = function () {
  return `${this.getFullYear()}-${String(this.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(this.getDate()).padStart(2, "0")} ${String(
    this.getHours()
  ).padStart(2, "0")}:${String(this.getMinutes()).padStart(2, "0")}:${String(
    this.getSeconds()
  ).padStart(2, "0")}`;
};

// 년-월-일_시:분:초 (YYYY-MM-DD_HH:mm:ss)
Date.prototype.toStringYMD_HMS = function () {
  return `${this.getFullYear()}-${String(this.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(this.getDate()).padStart(2, "0")}_${String(
    this.getHours()
  ).padStart(2, "0")}:${String(this.getMinutes()).padStart(2, "0")}:${String(
    this.getSeconds()
  ).padStart(2, "0")}`;
};

// 문자열에서 Date 객체 생성 (YYYY-MM-DD HH:mm:ss)
Date.prototype.toDateFromString = function (_str) {
  const [datePart, timePart] = _str.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour = 0, minute = 0, second = 0] = timePart
    ? timePart.split(":").map(Number)
    : [];
  return new Date(year, month - 1, day, hour, minute, second);
};

// Helper function for shuffling
function shuffleArray(array) {
  const arr = array.slice(); // Create a copy to avoid mutating the original array
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Get a single random element or an array of random elements
Array.prototype.random = function (N, M) {
  //js의 모든 배열 객체에 random() 추가
  if (typeof N === "number") {
    if (typeof M === "number") {
      //N과 M 모두 제공하면 N과 M 사이 개수의 무작위 요소 반환
      const count = Math.floor(Math.random() * (M - N)) + N;
      return shuffleArray(this).slice(0, count);
    } else {
      //N만 제공하면 N개의 무작위 요소 반환
      return shuffleArray(this).slice(0, N);
    }
  } else {
    //매개변수 없이 호출하면 단일 무작위 요소 반환
    return this[Math.floor(Math.random() * this.length)];
  }
};

//start <= x < end까지의 값을 담은 배열 생성
Array.range = function (start, end) {
  if (typeof start !== "number" || typeof end !== "number") {
    throw new TypeError("Both start and end must be numbers");
  }

  if (start >= end) {
    throw new RangeError("Start must be less than end");
  }

  return Array.from({ length: end - start }, (_, i) => start + i);
};

// Shuffle array in place
Array.prototype.shuffle = function () {
  for (let i = this.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [this[i], this[j]] = [this[j], this[i]];
  }
  return this;
};
