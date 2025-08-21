import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { courses } from "../database/schema.ts";
import { db } from "../database/client.ts";
import z from "zod";
import { checkRequestJWT } from "./hooks/check-request-jwt.ts";
import { checkUserRole } from "./hooks/check-user-role.ts";

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
  server.post('/courses', {
    preHandler: [
      checkRequestJWT,
      checkUserRole('manager'),
    ],
    schema: {
      tags:['Courses'],
      summary: 'Create a course',
      body: z.object({
        title: z.string().min(5, 'Titulo precisa de, no mínimo, 5 caracteres.')
      }),
      response: {
        201: z.object({ courseId: z.uuid() }).describe('Curso criado com sucesso!')
      }
    }
  }, async (req, res) => {
    const courseTitle = req.body.title
    
    const result = await db
      .insert(courses)
      .values({ title: courseTitle })
      .returning()
  
    return res.status(201).send({ courseId: result[0].id })
  })
}