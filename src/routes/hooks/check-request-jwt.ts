import type { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

type JWTPayload = {
    sub: string,
    role: 'student' | 'manager',
}

export async function checkRequestJWT(req: FastifyRequest, res: FastifyReply){
    const token = req.headers.authorization

    if (!token) {
        return res.status(401).send()
    }

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET must be set.')
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload
    
         req.user = payload

    } catch {
        return res.status(401).send()
    }
}