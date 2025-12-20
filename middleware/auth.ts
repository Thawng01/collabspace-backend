import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('x-auth-token')
    if (!token) return res.status(401).send("Access denied. No token provided.")

    try {
        const decoded = jwt.verify(token, 'secret_key')
        res.locals.user = decoded
        next()
    } catch (error) {
        return res.status(400).send("Invalid token.")
    }
}