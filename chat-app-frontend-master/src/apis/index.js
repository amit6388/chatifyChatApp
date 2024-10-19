import axios from "axios";
export async function createUser(data) {
  return axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/v1/add-user`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
export async function loginUser(data) {
  return axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/v1/login-user`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
export async function getUsers(token) {
  return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/v1/get-user`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
}
export async function getAllUsers(token) {
  return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/v1/get-all-user`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
}
export async function createRoom(token,data) {
  return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/create-room`,data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
}
export async function createGroup(token,data) {
  return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/create-group`,data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
}

export async function getRooms(token) {
  return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get-rooms`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
}
export async function SendMessage(token,data) {
  return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/send-msg`, data,{
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + token,
    },
  });
}
export async function getMessage(token,data) {
  return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/get-msg`, data,{
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
}
export async function deleteMessage(token,id) {
  return axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/delete-msg/${id}`,{
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
}
export async function updateMessage(token,id,data) {
  return axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/update-msg/${id}`,data,{
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
}