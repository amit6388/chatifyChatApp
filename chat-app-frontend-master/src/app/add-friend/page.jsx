"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import { createRoom, getUsers } from "@/apis";
import { useSocketContext } from "@/context/SocketContext";
import { getAuth, logOutAuth } from "@/store/slices/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { BsArrowLeft } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function Page() {
  const auth = useSelector(getAuth);
  const dispatch = useDispatch()
  const [checkAdd,setCheckAdd]=useState('')
  const [users, setUsers] = useState([]);
  const {disconnectSocket}=useSocketContext()
  const router = useRouter();
  useEffect(() => {
    if (auth) {
      getUsers(auth?.access)
        .then((res) => {
          setUsers(res.data.data);
        })
        .catch((err) => {
          toast.warning("Something went wrong");
        });
    }
  }, [checkAdd]);

  const addFrined = (user) => {
    if (auth?.access) {
      const data = {
        from: auth?._id,
        to: user?._id,
        friendname:user?.username
      };
      createRoom(auth?.access, data)
        .then((res) => {
          toast.success("Now be a friend go and chat together");
          setCheckAdd(Math.round())
          
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const LogoutUser=()=>{
    if(confirm("Are you sure want to logout this session ?")){
      dispatch(logOutAuth())
      disconnectSocket()
      router.push('/')
    }
  }
  return (
    <div className="row mt-4">
      <div className="col-md-1"></div>
      <div className="col-md-10">
        <h5 className="text-center text-success alert alert-success">
          All Users
        </h5>
        <div className="d-flex justify-content-between">

        <button
          className="btn btn-info text-white fw-bold mb-3"
          onClick={() => {
            router.push("/chat");
          }}
          >
          {" "}
          <BsArrowLeft size={20} /> Chat
        </button>
        <button className="btn btn-danger text-white fw-bold mb-3" onClick={LogoutUser}> <BiLogOut size={20}/>  Logout </button>
          </div>
        <table className="table table-bordered text-center">
          <thead>
            <tr>
              <th>Sr no.</th>
              <th>Username</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((data, index) => {
              return (
                <>
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{data.username}</td>
                    <td>{data.email}</td>
                    <td>{data.mobile}</td>
                    <td>
                      <span
                        className="btn btn-success"
                        onClick={() => {
                          addFrined(data);
                        }}
                      >
                        Add Friend
                      </span>
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="col-md-1"></div>
    </div>
  );
}
