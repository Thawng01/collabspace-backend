import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const user = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (!user) return res.status(400).send("No user found with the given email")

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) return res.status(400).send("Invalid credentials.")

        const token = jwt.sign({ id: user.id, email: user.email }, "secret_key")

        return res.send(token)
    } catch (error) {

    }
}