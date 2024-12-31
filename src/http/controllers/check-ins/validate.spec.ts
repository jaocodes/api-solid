import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { CreateAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('validate check-in (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to validate a check-in', async () => {
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

        let checkIn = await prisma.checkIn.create({
            data: { gym_id: createdGym.id, user_id: user.id },
        })
        const response = await request(app.server)
            .patch(`/check-ins/${checkIn.id}/validate`)
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.statusCode).toEqual(204)

        checkIn = await prisma.checkIn.findUniqueOrThrow({
            where: { id: checkIn.id },
        })

        expect(checkIn.validated_at).toEqual(expect.any(Date))
    })
})
