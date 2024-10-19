/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
/* eslint-disable react/no-unescaped-entities */
import MessageContainer from "@/components/MessageContainer";
import SideList from "@/components/SideList";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import { FaUserGroup } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, logOutAuth } from "@/store/slices/auth";
import { useSocketContext } from "@/context/SocketContext";

export default function page() {
  const router = useRouter();
  const auth = useSelector(getAuth)
  const { setSocketConnection,socket, disconnectSocket} = useSocketContext();
  const dispatch = useDispatch();
  useEffect(() => {
    if (auth?.access && !socket) {
      setSocketConnection(auth);
    }
  }, []);
  const LogoutUser = () => {
    if (confirm("Are you sure want to logout this session ?")) {
      dispatch(logOutAuth());
      disconnectSocket()
      router.push("/");
    }
  };
  return (
    <div className="row main-chat">
      <div className="col-md-1"></div>
      <div className="col-md-10">
        <div>
          <h3 className="text-success text-center alert alert-success text-uppercase">
            Add Friend And Let's Start Chat
          </h3>
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-info text-white fw-bold mb-3"
              onClick={() => {
                router.push("/add-friend");
              }}
            >
              {" "}
              <BsArrowLeft size={20} /> Add friends
            </button>
            <button
              className="btn btn-info text-white fw-bold mb-3"
              onClick={() => {
                router.push("/group");
              }}
            >
              {" "}
              <FaUserGroup size={20} /> Create group
            </button>
            <button
              className="btn btn-danger text-white fw-bold mb-3"
              onClick={LogoutUser}
            >
              {" "}
              <BiLogOut size={20} /> Logout{" "}
            </button>
          </div>
          <div className="chat-container">
            <div className="row">
              <div className="col-md-3 m-0 p-0">
                <SideList />
              </div>
              <div className="col-md-9 m-0 p-0">
                <MessageContainer />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-1"></div>
    </div>
  );
}
