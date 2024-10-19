/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import InputContainer from "./InputContainer";
import { SendMessage, deleteMessage, getMessage, updateMessage } from "@/apis";
import { useSelector } from "react-redux";
import { getAuth } from "@/store/slices/auth";
import { toast } from "react-toastify";
import { useCurrentChatContext } from "@/context/CurrentChatContext";
import Welcome from "./Welcome";
import { useSocketContext } from "@/context/SocketContext";
import SocketEvents from "@/Constants/SocketEvent";
import { RxCross2 } from "react-icons/rx";
import { FaEdit, FaFileAlt } from "react-icons/fa";
import { copyTextMessage, getMediaType } from "@/helpers/messageHelper";
import Image from "next/image";
import { FileIcon, defaultStyles } from "react-file-icon";
import { saveAs } from "file-saver";
import { Dropdown } from "react-bootstrap";
import { FaCopy, FaTrash } from "react-icons/fa6";
export default function MessageContainer() {
  const [fileData, setFileData] = useState(null);
  const auth = useSelector(getAuth);
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState();
  const { currentChat, selected } = useCurrentChatContext();
  const [deleteMsgId, setDeleteMsgId] = useState("");
  const { socket } = useSocketContext();
  const [msg, setMsg] = useState("");
  const [editMsgId, setEditMsgId] = useState("");
  const [msgIndex, setMessageIndex] = useState("");
  const [editData, setEditData] = useState("");
  const [showDropdownbtn, setShowDropdownbtn] = useState({
    index: "",
    status: false,
  });
  const { SEND_MESSAGE, MESSAGE, DELETE_MESSAGE, EDIT_MESSAGE } = SocketEvents;
  const scrollRef = useRef();

  // download files
  const downloadFile = (url, name) => {
    saveAs(url, name);
  };

  useEffect(() => {
    if (currentChat && auth?.access) {
      const data = { roomId: currentChat?._id };
      getMessage(auth?.access, data)
        .then((res) => {
          setMessages(res.data.data);
        })
        .catch((err) => {
          toast.warning("Something went wrong");
        });
    }
    setMsg("");
    setMessageIndex("");
    setEditData("");
    setEditMsgId("");
  }, [currentChat]);
  const handleSendmsg = (data) => {
    if (auth?.access) {
      if (data.file !== null) {
        setFileData(null);
      }
      SendMessage(auth?.access, data)
        .then((res) => {
          // console.log(res);
          const data = {
            id: res.data.data._id,
            msg: res.data.data.message.text,
            roomId: res.data.data.roomId,
            username: res.data.data.username,
            file: res.data.data.file,
            filename: res.data.data.filename,
          };
          socket.emit(SEND_MESSAGE, data);
          const msgs = [...messages];
          msgs.push({
            fromSelf: true,
            id: data.id,
            message: data.msg,
            roomId: data.roomId,
            username: data.username,
            file: data.file,
            filename: data.filename,
          });
          setMessages(msgs);
          setFileData(null);
        })
        .catch((err) => {
          toast.warning("Something went wrong");
        });
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on(MESSAGE, (data) => {
        setArrivalMessage({
          fromSelf: false,
          id: data.id,
          message: data.msg,
          roomId: data.roomId,
          username: data.username,
          file: data.file,
          filename: data.filename,
        });
      });

      socket.on(DELETE_MESSAGE, (data) => {
        setDeleteMsgId(data.msgId);
      });
      socket.on(EDIT_MESSAGE, (data) => {
        setEditData(data);
      });

      return () => {
        socket.off(DELETE_MESSAGE);
        socket.off(EDIT_MESSAGE);
      };
    }
  }, [socket]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  useEffect(() => {
    deleteMsgId &&
      setMessages(
        messages.filter((item) => {
          return item.id != deleteMsgId;
        })
      );
  }, [deleteMsgId]);

  useEffect(() => {
    if (editData) {
      const msgs = [...messages];
      msgs[editData.msgIndex].message = editData.msg;
      setMessages(msgs);
    }
  }, [editData]);

  const handleDeleteMsg = (id) => {
    deleteMessage(auth?.access, id)
      .then((res) => {
        setMessages(
          messages.filter((item) => {
            return item.id !== id;
          })
        );
        const data = { roomId: currentChat?._id, msgId: id };
        socket.emit(DELETE_MESSAGE, data);
      })
      .catch((err) => {
        toast.warning("Something went wrong");
      });
  };

  const setEditmsg = (id, msg, index) => {
    setMsg(msg);
    setEditMsgId(id);
    setMessageIndex(index);
  };

  const handleEditMsg = (message) => {
    const data = { msg: message };
    updateMessage(auth?.access, editMsgId, data)
      .then((res) => {
        console.log(res.data.data);
        const msgs = [...messages];
        msgs[msgIndex].message = message;
        const socketData = {
          roomId: currentChat?._id,
          msgIndex: msgIndex,
          msg: message,
        };
        socket.emit(EDIT_MESSAGE, socketData);
        setMessages(msgs);
        setEditMsgId("");
        setMessageIndex("");
        setMsg("");
      })
      .catch((err) => {
        toast.warning("Something went wrong");
      });
  };
  return (
    <div className="message-box">
      {fileData !== null && (
        <div className={fileData == null ? "file-box" : "file-box-animation"}>
          <p className="text-end px-2 py-1 m-0">
            <RxCross2
              style={{ cursor: "pointer" }}
              onClick={() => {
                setFileData(null);
              }}
            />
          </p>

          <p className="text-center fw-bold">
            <FaFileAlt size={30} /> {fileData?.name}
          </p>
        </div>
      )}

      {selected ? (
        <>
          <div className="box">
            {messages.map((msg, index) => {
              return (
                <>
                  {currentChat._id == msg.roomId && (
                    <div
                      className={`messages gap-1 m-0 ${
                        msg.fromSelf ? "sended" : "recieved"
                      }`}
                      ref={scrollRef}
                    >
                      {msg.fromSelf && (
                        <Dropdown
                          onMouseEnter={() => {
                            setShowDropdownbtn({ index: index, status: true });
                          }}
                          onMouseLeave={() => {
                            setShowDropdownbtn({ index: index, status: false });
                          }}
                        >
                          <Dropdown.Toggle
                            as="div"
                            id="dropdown-custom-components"
                            className={
                              showDropdownbtn.index == index &&
                              showDropdownbtn.status == true &&
                              "dropdown-show"
                            }
                          ></Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() => {
                                handleDeleteMsg(msg.id);
                              }}
                            >
                              <FaTrash size={15} /> delete
                            </Dropdown.Item>
                            <Dropdown.Item
                              disabled={msg.file == null ? false : true}
                              onClick={() => {
                                setEditmsg(msg.id, msg.message, index);
                              }}
                            >
                              <FaEdit /> edit
                            </Dropdown.Item>
                            <Dropdown.Item
                              disabled={msg.file == null ? false : true}
                              onClick={() => {
                                copyTextMessage(msg.message);
                              }}
                            >
                              <FaCopy /> copy
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      )}

                      {(msg.message !== null || msg.file !== null) && (
                        <div
                          className="content"
                          onMouseEnter={() => {
                            setShowDropdownbtn({ index: index, status: true });
                          }}
                          onMouseLeave={() => {
                            setShowDropdownbtn({ index: index, status: false });
                          }}
                        >
                          {!msg.fromSelf && (
                            <small className="text-secondary">
                              {msg.username} :{" "}
                            </small>
                          )}
                          {msg.file !== null && (
                            <>
                              {getMediaType(msg?.filename) == "IMAGE" ? (
                                <div className="p-2">
                                  <Image
                                    alt=""
                                    src={msg.file}
                                    width={200}
                                    height={200}
                                    sizes="100vw"
                                    className="img-fluid"
                                    style={{
                                      borderRadius: "10px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      downloadFile(msg.file, msg.filename);
                                    }}
                                  />
                                </div>
                              ) : getMediaType(msg?.filename) == "VIDEO" ? (
                                <div className="p-2">
                                  <video
                                    src={msg.file}
                                    controls
                                    height="200px"
                                    width="200px"
                                    className="img-fluid"
                                    onClick={() => {
                                      downloadFile(msg.file, msg.filename);
                                    }}
                                    style={{ cursor: "pointer" }}
                                  ></video>
                                </div>
                              ) : (
                                <div className="file-upload py-2">
                                  <h6>{msg.filename}</h6>
                                  <FileIcon
                                    extension={msg.filename.split(".")[1]}
                                    {...defaultStyles[
                                      msg.filename.split(".")[1]
                                    ]}
                                    labelColor="red"
                                  />
                                  <hr />
                                  <div className="text-center">
                                    <span
                                      className="btn btn-success"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => {
                                        downloadFile(msg.file, msg.filename);
                                      }}
                                    >
                                      Download
                                    </span>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                          {msg.message !== null && (
                            <p className="p-0 m-0">{msg.message}</p>
                          )}
                        </div>
                      )}
                      {!msg.fromSelf && (
                        <Dropdown
                          onMouseEnter={() => {
                            setShowDropdownbtn({ index: index, status: true });
                          }}
                          onMouseLeave={() => {
                            setShowDropdownbtn({ index: index, status: false });
                          }}
                        >
                          <Dropdown.Toggle
                            className={
                              showDropdownbtn.index == index &&
                              showDropdownbtn.status == true &&
                              "dropdown-show"
                            }
                          ></Dropdown.Toggle>

                          <Dropdown.Menu>
                            {/* <Dropdown.Item>
                              <FaTrash size={15} /> delete
                            </Dropdown.Item>
                            <Dropdown.Item >
                              <FaEdit /> edit
                            </Dropdown.Item> */}
                            <Dropdown.Item
                              disabled={msg.file == null ? false : true}
                              onClick={() => {
                                copyTextMessage(msg.message);
                              }}
                            >
                              <FaCopy /> copy
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </div>
                  )}
                </>
              );
            })}
          </div>
          <InputContainer
            handleSendmsg={handleSendmsg}
            setFileData={setFileData}
            fileData={fileData}
            msg={msg}
            setMsg={setMsg}
            setEditMsgId={setEditMsgId}
            editMsgId={editMsgId}
            handleEditMsg={handleEditMsg}
          />
        </>
      ) : (
        <Welcome />
      )}
    </div>
  );
}
