import {Request, Response} from "express";
import User from "../models/User";

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
        res.status(400).json({
            message: 'Something went wrong while creating the user.'
        })
    }
}

export async function deleteUserController(req: Request, res: Response) {
    const {id} = req.params
    const user = await User.findByIdAndDelete(id)

    return res.json(user)
}

export async function updateUserController(req: Request, res: Response) {
    const {id} = req.params
    const payload: { age: number, name: string, email: string } = req.body

    const updatedUser = await User.findByIdAndUpdate(id, {
        age: payload.age,
        name: payload.name,
        email: payload.email
    }, {
        new: true
    }).exec()

    console.log(updatedUser)
    res.json(updatedUser)


}

export async function getUsersController(req: Request, res: Response) {
    let filters: any = {}
    if(req.query.age) filters['age'] = {$gte: req.query.age}
    if(req.query.name) filters['name'] = {$regex: req.query.name}
    if(req.query.email) filters['email'] = {$regex: req.query.email}
    console.log(filters)

    const users = await User.find(filters)
    console.log(users.length)

    res.json(users)
}