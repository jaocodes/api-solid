import type { FastifyInstance } from 'fastify'
import request from 'supertest'
export async function CreateAndAuthenticateUser(app: FastifyInstance) {
    await request(app.server).post('/users').send({
        name: 'naoentendi',
        email: 'eagora@example.com',
        password: '12345678910',
    })

    const responseAuthenticate = await request(app.server)
        .post('/sessions')
        .send({
            email: 'eagora@example.com',
            password: '12345678910',
        })

    const { token } = responseAuthenticate.body

    return { token }
}
