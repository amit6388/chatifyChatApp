"use client";
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import "../../styles/register.css";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createUser } from "@/apis";
import { useDispatch } from "react-redux";
import { loginAuth } from "@/store/slices/auth";
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup";
export default function Page() {
  const [passwordVisiblity, setPasswordVisiblity] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const formSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username must be required *")
      .min(2, "please enter valid user name*"),
    email: Yup.string()
      .required("email is required*")
      .email("please enter valid email"),
    password: Yup.string()
      .required("password is mandatory*")
      .min(8, "password must be at 8 char long*")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit"
      ),
    mobile: Yup.string()
      .required("mobile number is required*")
      .matches(
        /^\d{10}$/,
        "Invalid phone number. Please enter a 10-digit number."
      ),
  });
  
  const formResolver = {
    mode:"onChange",
    resolver: yupResolver(formSchema)
  }
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm(formResolver);

  const registerUser = (data) => {
    createUser(data)
      .then((res) => {
        dispatch(loginAuth(res.data.data));
        router.push("/add-friend");
        reset();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="row mt-5">
      <div className="col-md-3"></div>
      <div className="col-md-6">
        <h2 className="text-center text-success alert alert-success">
          Register Here !
        </h2>
        <div className="register p-5">
          <form onSubmit={handleSubmit(registerUser)}>
            <div className="form-group mb-2">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                name="username"
                placeholder="Enter Your name.."
                {...register("username")}
              />
              <span class="text-danger">{errors?.username?.message}</span>
            </div>
            <div className="form-group mb-2">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                {...register("email")}
                placeholder="Enter Your email.."
              />
              <span class="text-danger">{errors?.email?.message}</span>
            </div>
            <div className="form-group mb-2">
              <label>Mobile</label>
              <input
                type="tel"
                className="form-control"
                name="mobile"
                maxLength={10}
                {...register("mobile")}
                placeholder="Enter Your mobile.."
              />
              <span class="text-danger">{errors?.mobile?.message}</span>
            </div>
            <div className="form-group" style={{ position: "relative" }}>
              <label>Password</label>
              <input
                type={passwordVisiblity ? "text" : "password"}
                className="form-control"
                name="password"
                {...register("password")}
                placeholder="Enter Your password.."
              />
              <span class="text-danger">{errors?.password?.message}</span>
              <span
                className="visiblePassword"
                onClick={() => {
                  setPasswordVisiblity(passwordVisiblity ? false : true);
                }}
              >
                {passwordVisiblity ? "Hide" : "Show"}
              </span>
            </div>
            <div className="form-group mt-1 text-center">
              <input
                type="Submit"
                className="btn btn-outline-success form-control my-3"
                value="Register"
              />
              <span style={{ cursor: "pointer" }}>
                Do you have an account ?{" "}
                <b
                  onClick={() => {
                    router.push("/");
                  }}
                >
                  Login Here
                </b>
              </span>
            </div>
          </form>
        </div>
      </div>
      <div className="col-md-3"></div>
    </div>
  );
}
