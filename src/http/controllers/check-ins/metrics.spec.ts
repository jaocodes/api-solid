import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { CreateAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('metrics check-in (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to get check-ins metrics', async () => {
        const { token } = await CreateAndAuthenticateUser(app)

        const user = await prisma.user.findFirstOrThrow()

        const createdGym = await prisma.gym.create({
            data: {
                title: 'javascript gym',
                description: 'some description',
                phone: '5591999999999',
                latitude: -1.3039917,
                longitude: -47.8900467,
            },
        })

        const checkIns = await prisma.checkIn.createMany({
            data: [
                { gym_id: createdGym.id, user_id: user.id },
                { gym_id: createdGym.id, user_id: user.id },
            ],
        })

        const response = await request(app.server)
            .get('/check-ins/metrics')
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.checkInsCount).toEqual(2)
    })
})
