import axios from "axios";
import { CreateUserModel, UserModel } from "./models";

export function getUsers() {
  return axios.get<UserModel[]>(`${process.env.REACT_APP_API_ENDPOINT}/user`);
}

export function createUser(data: CreateUserModel) {
  return axios.post<UserModel>(`${process.env.REACT_APP_API_ENDPOINT}/user`, data);
}

export function deleteUser(id: string) {
  return axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/user/${id}`);
}
