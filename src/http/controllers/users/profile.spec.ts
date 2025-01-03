import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { CreateAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('profile (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to get a user profile', async () => {
        const { token } = await CreateAndAuthenticateUser(app)

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
