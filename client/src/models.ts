import moment from "moment";

export interface UserModel {
    _id: string
    name: string,
    age: number
    email: string
    createdAt: moment.Moment
    updatedAt: moment.Moment
}

export interface CreateUserModel{
    name: string,
    age: number,
    email: string
}