"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import { createGroup,  getAllUsers } from "@/apis";
import { getAuth, logOutAuth } from "@/store/slices/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { BsArrowLeft } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function Page() {
  const auth = useSelector(getAuth);
  const dispatch = useDispatch();
  const [checkAdd, setCheckAdd] = useState("");
  const [users, setUsers] = useState([]);
  const [userGorup, setUserGroup] = useState([]);
  const [group, setGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const router = useRouter();
  useEffect(() => {
    if (auth) {
      getAllUsers(auth?.access)
        .then((res) => {
          setUsers(res.data.data);
        })
        .catch((err) => {
          toast.warning("Something went wrong");
        });
    }
  }, [checkAdd]);

  const makeGroup = (value, data) => {
    if (value) {
      setUserGroup([...userGorup, data]);
    } else {
      setUserGroup(
        userGorup.filter((id) => {
          return id !== data;
        })
      );
    }
  };

  const makeGroupRoom = (e) => {
    e.preventDefault()
    if (auth?.access) {
      const data = {
        groupName:groupName,
        users: [... userGorup,auth?._id]
      };
      createGroup(auth?.access, data)
        .then((res) => {
          toast.success("Now be a friend go and chat together");
          setCheckAdd(Math.round());
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleGroup = () => {
    if (userGorup.length >= 2) {
      setGroup(true);
    } else {
      toast.warning("Please Select aleast 2 or more users to make a group");
    }
  };

  const LogoutUser = () => {
    if (confirm("Are you sure want to logout this session ?")) {
      dispatch(logOutAuth());
      router.push("/");
    }
  };
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
          <button
            className="btn btn-danger text-white fw-bold mb-3"
            onClick={LogoutUser}
          >
            {" "}
            <BiLogOut size={20} /> Logout{" "}
          </button>
        </div>
        <div className="row">
          <div className="col-md-9">
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
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              makeGroup(e.target.checked, data._id);
                            }}
                            name="group"
                          />
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                {!group || userGorup.length < 2 ? (
                  <button className="btn btn-success" onClick={handleGroup}>
                    Create Group
                  </button>
                ) : (
                  <>
                    <br />
                    <form onSubmit={makeGroupRoom}>
                      <label htmlFor="">Group Name:</label>
                      <input
                        type="text"
                        name="groupName"
                        className="form-control mb-3"
                        placeholder="Enter group name"
                        required
                        onChange={(e)=>{setGroupName(e.target.value)}}
                      />
                      <input
                        type="submit"
                        value="Add Group"
                        className="btn btn-success"
                      />
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-1"></div>
    </div>
  );
}
