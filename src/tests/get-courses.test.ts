import { expect, test } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { faker } from '@faker-js/faker'
import { makeCourse } from './factories/make-course.ts'
import { randomUUID } from 'crypto'
import { makeEnrollment } from './factories/make-enrollments.ts'

test('get course by id success', async () => {
    await server.ready()

    const titleId = randomUUID()

    const course = await makeCourse(titleId)
    const enrollment = await makeEnrollment(course.id)

    const response = await request(server.server)
        .get(`/courses?search=${titleId}`)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
        total: 1,
        courses: [
            {
                id: expect.any(String),
                title: titleId,
                enrollments: 1,
            }
        ]
    })
})