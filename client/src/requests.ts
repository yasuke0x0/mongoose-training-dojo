import axios from "axios";
import {CreateUserModel, UserModel} from "./models";

export function getUsers(filters: { name: string, age: string, email: string }) {
    const filled_filter: any = {}
    Object.entries(filters).map(([key, value]) => {
        if (value.length > 0) filled_filter[key] = value
    })
    const url = new URL(`${process.env.REACT_APP_API_ENDPOINT}/user`);

    console.log(filled_filter)
    const params = new URLSearchParams(filled_filter);
    url.search = params.toString()

    console.log('good')
    return axios.get<UserModel[]>(url.toString());
}

export function createUser(data: CreateUserModel) {
    return axios.post<UserModel>(`${process.env.REACT_APP_API_ENDPOINT}/user`, data);
}

export function updateUser(id: string, data: CreateUserModel) {
    return axios.put<UserModel>(`${process.env.REACT_APP_API_ENDPOINT}/user/${id}`, data);
}

export function deleteUser(id: string) {
    return axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/user/${id}`);
}
