import type { FastifyRequest, FastifyReply } from 'fastify'
import { getAuthenticatedUserFromRequest } from '../../utils/get-authenticated-user-from-request'

export function checkUserRole(role: 'student' | 'manager') {
    return async function (req: FastifyRequest, res: FastifyReply) {
        const user = getAuthenticatedUserFromRequest(req)
    
        if (user.role !== role) {
            return res.status(401).send()
        }
    }
}