import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { users } from "../database/schema.ts";
import { sign } from 'jsonwebtoken'
import { db } from "../database/client.ts";
import z from "zod";
import { eq } from "drizzle-orm";
import { verify } from "argon2";

export const loginRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/sessions', {
    schema: {
      tags:['Auth'],
      summary: 'Login',
      body: z.object({
        email: z.email(),
        password: z.string(),
      }),
      response: {
        200: z.object({ token: z.string() }),
        400: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      }
    }
  }, async (req, res) => {
    const { email, password } = req.body
    
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))

    if (result.length === 0) {
        return res.status(404).send({ message: 'Credenciais inválidas.' })
    }

    const user = result[0]

    const doesPasswordsMatch = await verify(user.password, password)

    if (!doesPasswordsMatch) {
        return res.status(400).send({ message: 'Credenciais inválidas.' })
    }
    
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET must be set.')
    }

    const token = sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET)
  
    return res.status(200).send({ token })
  })
}