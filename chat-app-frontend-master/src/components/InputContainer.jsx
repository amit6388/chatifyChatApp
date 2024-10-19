"use client";
import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import { RiSendPlaneFill } from "react-icons/ri";
import { BsEmojiSmileFill, BsUpload } from "react-icons/bs";
import Picker from "emoji-picker-react";
import { useCurrentChatContext } from "@/context/CurrentChatContext";
import { useSelector } from "react-redux";
import { getAuth } from "@/store/slices/auth";
import { FaUpload } from "react-icons/fa6";
export default function InputContainer({
  handleSendmsg,
  setFileData,
  fileData,
  setMsg,
  msg,
  setEditMsgId,
  editMsgId,
  handleEditMsg,
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { currentChat } = useCurrentChatContext();
  const auth = useSelector(getAuth);
  const handleEmojiClick = (emoji) => {
    setMsg((msg) => msg + emoji.emoji);
  };
  const sendChat = (event) => {
    event.preventDefault();
    if (currentChat) {
      if (editMsgId) {
        handleEditMsg(msg);
      } else {
        if ((msg && msg.length > 0) || fileData !== null) {
          const data = {
            msg: msg,
            roomId: currentChat?._id,
            username: auth.username,
            file: fileData,
          };
          handleSendmsg(data);
          setMsg("");
        }
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileData(file);
  };

  const handleEditStatus = () => {
    if (editMsgId) {
      setMsg("");
    }
    setEditMsgId("");
  };
  return (
    <div className="input-container">
      <div className="emoji">
        {showEmojiPicker && (
          <Picker
            className="emoji-picker-react"
            onEmojiClick={handleEmojiClick}
          />
        )}
        <BsEmojiSmileFill
          size={30}
          onClick={() => {
            setShowEmojiPicker(!showEmojiPicker);
          }}
        />
      </div>
      <div className="form" onSubmit={sendChat}>
        <form action="" className="d-flex gap-2">
          <input
            name="message"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="form-control "
            onFocus={() => {
              setShowEmojiPicker(false);
            }}
            onBlur={handleEditStatus}
            autoFocus={editMsgId ? true : false} // Use the autoFocus attribute
            key={editMsgId ? "editing" : "non-editing"}
          />
          <div className="send-icon">
            <button type="submit">
              <RiSendPlaneFill size={30} />
            </button>
          </div>
          <div className="send-icon">
            <label>
              <FaUpload size={30} style={{ cursor: "pointer" }} />
              <input
                type="file"
                className="d-none"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </form>
      </div>
    </div>
  );
}
