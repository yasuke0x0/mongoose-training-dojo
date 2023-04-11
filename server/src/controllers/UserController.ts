import {Request, Response} from "express";
import User from "../models/User";
import Deck from "../models/Deck";

export async function createUserController(req: Request, res: Response) {
    const payload: { age: number, name: string, email: string } = req.body

    const newUser = new User({
        age: payload.age,
        name: payload.name,
        email: payload.email,
        createdAt: new Date(),
        updatedAt: new Date(),
        address: {
            street: '8 rue berht',
            city: 'Toulouse'
        }
    })

    try {
        const createdUser = await newUser.save()
        res.json(createdUser);
    } catch (e: any) {
        console.error(e.message)
        return res.status(400).json({
            message: 'Something went wrong while creating the user.'
        })
    }
}

export async function deleteUserController(req: Request, res: Response){
    const {id} = req.params
    const user = await User.findByIdAndDelete(id)

    res.json(user)
}
export async function getUsersController(req: Request, res: Response) {
    const users = await User.find()

    res.json(users)
}