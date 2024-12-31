import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { CreateAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('create check-in (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to create a check-in', async () => {
        const { token } = await CreateAndAuthenticateUser(app)

        const createdGym = await prisma.gym.create({
            data: {
                title: 'javascript gym',
                description: 'some description',
                phone: '5591999999999',
                latitude: -1.3039917,
                longitude: -47.8900467,
            },
        })

        const response = await request(app.server)
            .post(`/gyms/${createdGym.id}/check-in`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                latitude: -1.3039917,
                longitude: -47.8900467,
            })

        expect(response.statusCode).toEqual(201)
    })
})
