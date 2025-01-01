import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import request from 'supertest'
export async function CreateAndAuthenticateUser(
    app: FastifyInstance,
    isAdmin = false,
) {
    await prisma.user.create({
        data: {
            name: 'naoentendi',
            email: 'eagora@example.com',
            password_hash: await hash('12345678910', 6),
            role: isAdmin ? 'ADMIN' : 'MEMBER',
        },
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
