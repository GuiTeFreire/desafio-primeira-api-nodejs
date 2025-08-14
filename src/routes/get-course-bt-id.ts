import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { courses } from "../database/schema";
import { db } from "../database/client";
import z from "zod";
import { eq } from "drizzle-orm";

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/courses/:id', {
    schema: {
      tags:['Courses'],
      summary: 'Get a course by id',
      params: z.object({
        id: z.uuid(),
      }),
      response: {
        200: z.object({
          course: z.object({
            id: z.uuid(),
            title: z.string(),
            description: z.string().nullable()
          })
        }),
        404: z.null().describe('Course not found.')
      }
    }
  }, async (req, res) => {
    const courseId = req.params.id
  
    const result = await db.select().from(courses).where(eq(courses.id, courseId))
  
    if (result.length > 0) {
      return { course: result[0] }
    }
  
    return res.status(404).send()
  })
}