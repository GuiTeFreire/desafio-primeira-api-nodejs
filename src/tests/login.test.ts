import { expect, test } from 'vitest'
import request from 'supertest'
import { server } from '../app.ts'
import { makeUser } from './factories/make-user.ts'
import { sign } from 'jsonwebtoken'

test('login success', async () => {
    await server.ready()

    const { user, passwordBeforeHash } = await makeUser()

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET must be set.')
    }

    const token = sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET)

    const response = await request(server.server)
        .post('/sessions')
        .set('Content-Type', 'application/json')
        .send({
            email: user.email,
            password: passwordBeforeHash,
        })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({ token })
})

test('return 404 for non existing email', async () => {
    await server.ready()

    const { passwordBeforeHash } = await makeUser()

    const response = await request(server.server)
        .post(`/sessions`)
        .set('Content-Type', 'application/json')
        .send({
            email: 'maria@gmail.com',
            password: passwordBeforeHash,
        })

    expect(response.status).toEqual(404)
})

test('return 400 for invalid password', async () => {
    await server.ready()

    const { user } = await makeUser()

    const response = await request(server.server)
        .post(`/sessions`)
        .set('Content-Type', 'application/json')
        .send({
            email: user.email,
            password: '12432',
        })

    expect(response.status).toEqual(400)
})