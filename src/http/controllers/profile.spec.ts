import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('profile (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to get a user profile', async () => {
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

        const responseProfile = await request(app.server)
            .get('/me')
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(responseProfile.statusCode).toEqual(200)
        expect(responseProfile.body.user).toEqual(
            expect.objectContaining({
                email: 'eagora@example.com',
            }),
        )
    })
})
