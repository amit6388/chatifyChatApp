/* eslint-disable @next/next/no-img-element */
import { getAuth } from "@/store/slices/auth";
import React from "react";
import { useSelector } from "react-redux";
export default function Welcome() {
const auth = useSelector(getAuth)
  return (
    <div className="welcome">
      <img src="image/robot.gif" alt="" />
      <h1>
        Welcome, <span>{ auth.username}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </div>
  );
}