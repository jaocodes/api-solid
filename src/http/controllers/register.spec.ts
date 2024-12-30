import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('register (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to register', async () => {
        const response = await request(app.server).post('/users').send({
            name: 'naoentendi',
            email: 'eagora@example.com',
            password: '12345678910',
        })

        expect(response.statusCode).toEqual(201)
    })
})
