import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { courses, enrollments } from "../database/schema.ts";
import { db } from "../database/client.ts";
import z from "zod";
import { and, asc, eq, ilike, SQL } from "drizzle-orm";
import { count } from "drizzle-orm";
import { checkRequestJWT } from "./hooks/check-request-jwt.ts";
import { checkUserRole } from "./hooks/check-user-role.ts";

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get('/courses', {
    preHandler: [
      checkRequestJWT,
      checkUserRole('manager'),
    ],
    schema: {
      tags:['Courses'],
      summary: 'Get all courses',
      querystring: z.object({
        search: z.string().optional(),
        orderBy: z.enum(['id', 'title']).optional().default('title'),
        page: z.coerce.number().optional().default(1),
      }),
      response: {
        200: z.object({
          courses: z.array(z.object({
            id: z.uuid(),
            title: z.string(),
            enrollments: z.number(),
          })),
          total: z.number(),
        })
      }
    }
  }, async (req, res) => {
    const { search, orderBy, page } = req.query

    const conditions: SQL[] = []

    if (search) {
      conditions.push(ilike(courses.title, `%${search}%`))
    }

    const [result, total] = await Promise.all([
      db
      .select({
        id: courses.id,
        title: courses.title,
        enrollments: count(enrollments.id),
      })
      .from(courses)
      .leftJoin(enrollments, eq(enrollments.courseId, courses.id))
      .orderBy(asc(courses[orderBy]))
      .offset((page - 1) * 2)
      .limit(10)
      .where(and(...conditions))
      .groupBy(courses.id),
      db.$count(courses, and(...conditions)),
    ])    
  
    return res.send({ courses: result, total })
  })
}