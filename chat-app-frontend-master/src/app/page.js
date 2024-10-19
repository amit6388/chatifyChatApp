"use client";
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import "../styles/register.css";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { loginUser } from "@/apis";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loginAuth } from "@/store/slices/auth";
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup";
export default function Page() {
  const [passwordVisiblity, setPasswordVisiblity] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch()
  const formSchema = Yup.object().shape({
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
  })
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

  const LoginUser = (data) => {
    loginUser(data)
      .then((res) => {
        toast.success(res.data.message);
        dispatch(loginAuth(res.data.data));
        router.push('/chat')
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
          Login Here !
        </h2>
        <div className="register p-5">
          <form onSubmit={handleSubmit(LoginUser)}>
            <div className="form-group mb-2">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                {...register("email")}
                placeholder="Enter Your email.."
              />
              <span className="text-danger">{errors?.email?.message}</span>
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
               <span className="text-danger">{errors?.password?.message}</span>
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
                value="Login"
              />
              <span style={{ cursor: "pointer" }}>
                Don't  have an account ?{" "}
                <b
                  onClick={() => {
                    router.push("/register");
                  }}
                >
                  Register Here
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
