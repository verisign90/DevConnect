import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTracker } from "meteor/react-meteor-data";
import { Notices, Studys } from "/imports/api/collections";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";

export default () => {
  const navigate = useNavigate();
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);

  const toggleMyPageMenu = () => {
    setIsMyPageOpen((prev) => !prev);
  };

  //읽지 않은 알림 개수, 모집중/시작인 문서 개수 추적
  const { user, readFalseCount, studyCount } = useTracker(() => {
    const user = Meteor.user();
    if (!user) {
      return { user: null, readFalseCount: 0 };
    }

    //Notices 컬렉션에서 읽지 않은 알림 개수 가져오기
    const readFalseCount = Notices.find({
      userId: user._id,
      read: false,
    }).count();

    //Studys 컬렉션에서 모집중, 시작인 문서 개수 가져오기
    const studyCount = Studys.find({
      userId: user._id,
      status: { $in: ["모집중", "시작"] },
    }).count();

    return { user, readFalseCount, studyCount };
  });

  //url 경로가 변할 때마다 마이페이지 버튼 표시
  // useEffect(() => {
  //   setIsMyPageOpen(false);
  // }, [location.pathname]);

  //모집글을 3개 이상 작성했을 경우 더 이상 작성 불가
  const handleClick = (e) => {
    console.log("handleClick, studyCount: ", studyCount);
    const study = Studys.find({
      userId: user._id,
      status: { $in: ["모집중", "시작"] },
    }).fetch();
    console.log(study);

    if (studyCount >= 3) {
      e.preventDefault();
      alert("프로젝트 모집글은 3개까지만 작성할 수 있습니다");
      navigate("/");
    }
  };

  return (
    <Disclosure as="nav" className="bg-white shadow">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 justify-between">
          <div className="flex">
            <div className="-ml-2 mr-2 flex items-center md:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                <Bars3Icon
                  aria-hidden="true"
                  className="block size-6 group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden size-6 group-data-[open]:block"
                />
              </DisclosureButton>
            </div>
            <div className="flex shrink-0 items-center">
              <img
                alt="Your Company"
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900"
              >
                프로젝트 목록조회
              </Link>
              <Link
                to="/join"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                회원가입
              </Link>
              <Link
                to="/write"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                모집글 작성
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {/* <div className="shrink-0">
              <button
                type="button"
                onClick={toggleMyPageMenu}
                className="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <PlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
                마이페이지
              </button>
            </div> */}
            <div className="hidden md:ml-4 md:flex md:shrink-0 md:items-center">
              <button
                type="button"
                className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <BellIcon aria-hidden="true" className="size-12" />
                {readFalseCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {readFalseCount}
                  </span>
                )}
              </button>
              <Menu as="div" className="relative ml-3">
                <MenuButton className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  {user?.profile?.image && (
                    <img
                      alt=""
                      src={user?.profile?.image}
                      className="h-16 w-16 rounded-full"
                    />
                  )}
                </MenuButton>
                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
                  <MenuItem>
                    <Link
                      to="/myProfile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      내 프로필
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      to="/myList"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      내 프로젝트
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={() => {
                        Meteor.logout();
                        navigate("/login");
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      로그아웃
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </Disclosure>
  );
};
