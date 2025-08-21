import { expect, test } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { makeCourse } from './factories/make-course.ts'
import { randomUUID } from 'crypto'
import { makeEnrollment } from './factories/make-enrollments.ts'
import { makeAuthenticatedUser, makeUser } from './factories/make-user.ts'
import { sign } from 'jsonwebtoken'

test('get courses success', async () => {
    await server.ready()

    const titleId = randomUUID()

    const { token } = await makeAuthenticatedUser('manager')

    const course = await makeCourse(titleId)
    const enrollment = await makeEnrollment(course.id)

    const response = await request(server.server)
        .get(`/courses?search=${titleId}`)
        .set('Authorization', token)

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