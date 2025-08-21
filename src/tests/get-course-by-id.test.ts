import { expect, test } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { makeCourse } from './factories/make-course.ts'
import { makeAuthenticatedUser } from './factories/make-user.ts'

test('get course by id success', async () => {
    await server.ready()

    const course = await makeCourse()
    const { token } = await makeAuthenticatedUser()

    const response = await request(server.server)
        .get(`/courses/${course.id}`)
        .set('Authorization', token)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
        course: {
            id: expect.any(String),
            title: expect.any(String),
            description: null,
        }
    })
})

test('return 404 for non existing courses', async () => {
    await server.ready()

    const { token } = await makeAuthenticatedUser()

    const response = await request(server.server)
        .get(`/courses/a7f7a0d3-0df7-4a63-95e0-72e0efbe9b84`)
        .set('Authorization', token)

    expect(response.status).toEqual(404)
})