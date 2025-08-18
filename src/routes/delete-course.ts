import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { courses } from "../database/schema.ts";
import { db } from "../database/client.ts";
import z from "zod";
import { eq } from "drizzle-orm";

export const deleteCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete('/courses/:id', {
    schema: {
      tags:['Courses'],
      summary: 'Delete a course',
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
        }).describe('Curso deletado com sucesso!'),
        404: z.null().describe('Course not found.')
      }
    }
  }, async (req, res) => {
    const courseId = req.params.id
    const thisCourse = await db.select().from(courses).where(eq(courses.id, courseId))

    await db.delete(courses).where(eq(courses.id, courseId))
  
    if (thisCourse.length > 0) {
      return { course: thisCourse[0] }
    }
  
    return res.status(404).send()
  })
}