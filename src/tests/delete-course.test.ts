import { expect, test } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { makeCourse } from './factories/make-course.ts'

test('delete course success', async () => {
    await server.ready()

    const course = await makeCourse()

    const response = await request(server.server)
        .delete(`/courses/${course.id}`)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
        course: {
            id: expect.any(String),
            title: expect.any(String),
            description: null,
        }
    })
})

test('return 404 for non existing course', async () => {
    await server.ready()

    const response = await request(server.server)
        .delete(`/courses/a7f7a0d3-0df7-4a63-95e0-72e0efbe9b84`)

    expect(response.status).toEqual(404)
})