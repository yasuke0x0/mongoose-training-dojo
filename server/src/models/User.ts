import mongoose from "mongoose";
import {addressSchema} from "./Address";

const userSchema = new mongoose.Schema({
    name: String,
    age: {
        type: Number,
        min: 1,
        validate: {
            validator: (v: number) => v <= 150,
            message: (props: any) => `${props.value} years old may not be possible ...`
        }
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    },
    bestFriend: mongoose.SchemaTypes.ObjectId,
    hobbies: [String],
    address: addressSchema
})

const UserModel = mongoose.model('User', userSchema)

export default UserModel
