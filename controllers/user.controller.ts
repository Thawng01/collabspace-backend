import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const createNewUser = async (req: Request, res: Response) => {
    try {
        const { name, email, avatar, password } = req.body
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                avatar
            }
        })

        const token = jwt.sign({ id: user.id, email: user.email }, 'secret_key')

        res.send(token)
    } catch (error) {

    }
}

// logged in user info
export const getMe = async (req: Request, res: Response) => {
    try {
        const user = res.locals.user
        const userInfo = await prisma.user.findFirst({
            where: { id: user.id },
            select: {
                id: true,
                name: true, email: true, avatar: true, createdAt: true, updatedAt: true
            }
        })

        if (!userInfo) return res.status(404).send("No user found with the given email.")
        res.send(userInfo)
    } catch (error) {
        return res.status(500).send("Something went wrong.")
    }
}

// update name and email
export const updateInfo = async (req: Request, res: Response) => {
    try {

        const { name, email } = req.body
        await prisma.user.update({
            where: { id: req.params.id },
            data: {
                name,
                email
            }
        })

        res.send("Successfully updated.")
    } catch (error) {
        return res.status(500).send("Something went wrong.")
    }
}

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const me = res.locals.user
        const users = await prisma.user.findMany({
            where: { NOT: { id: me.id } },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true
            }
        })

        res.send(users)
    } catch (error) {
        return res.status(500).send("Something went wrong.")
    }
}

export const updatePassword = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const { password, newPassword } = req.body

        const userInfo = await prisma.user.findFirst({
            where: {
                id
            }
        })

        if (!userInfo) return res.status(400).send("No user found with the given ID.")

        const validPassword = await bcrypt.compare(password, userInfo.password)
        if (!validPassword) return res.status(400).send("Invalid password.")

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        await prisma.user.update({
            where: { id },
            data: {
                password: hashedPassword
            }
        })

        res.send("Successfully updated.")
    } catch (error) {
        return res.status(500).send("Something went wrong.")
    }
}