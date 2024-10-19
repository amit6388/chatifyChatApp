/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import SocketEvents from "@/Constants/SocketEvent";
import { getRooms } from "@/apis";
import { useCurrentChatContext } from "@/context/CurrentChatContext";
import { useSocketContext } from "@/context/SocketContext";
import { getAuth } from "@/store/slices/auth";
import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function SideList() {
  const [rooms, setRooms] = useState([]);
  const { socket } = useSocketContext();
  const { ADDROOM} = SocketEvents;
  const { changeChat,setSelectedIndex,selectedIndex,selected,setSelected}=useCurrentChatContext()
  const auth = useSelector(getAuth);
  useEffect(() => {
    if (auth?.access) {
      getRooms(auth?.access)
        .then((res) => {
          setRooms(res.data.data);
        })
        .catch((err) => {
          toast.warning("Something went wrong");
        });
    }
  }, []);

  const handleJoinRoom = (room)=>{
    socket.emit(ADDROOM, room?._id);
  }
  return (
    <>
      <div className={selected ? "side-list active" : "side-list"}>
        <div className="list">
          {rooms.map((data, index) => {
            return (
              <>
                <div
                key={index}
                  className={
                    selected && selectedIndex == index ? "list-body active mb-3" : "list-body mb-3"
                  }
                  onClick={() => {
                    setSelected(selected && selectedIndex == index ? false : true);
                    setSelectedIndex(index)
                    changeChat(data)
                    handleJoinRoom(data)
                  }}
                >
                  <Avatar
                    round={true}
                    name={data.roomname}
                    size={40}
                    textSizeRatio={2.5}
                    style={{ cursor: "pointer" }}
                  />
                  <h5>{data.roomname}</h5>
                </div>
              </>
            );
          })}
        </div>
        <div className="current-user">
          <Avatar
            round={true}
            name={auth?.username}
            size={40}
            textSizeRatio={2.5}
            style={{ cursor: "pointer" }}
          />
          <h4>{auth?.username}</h4>
        </div>
      </div>
    </>
  );
}
