import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { CreateAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('search gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to fetch a search for a list of gyms', async () => {
        const { token } = await CreateAndAuthenticateUser(app, true)

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'javascript gym',
                description: 'some description',
                phone: '5591999999999',
                latitude: -1.3039917,
                longitude: -47.8900467,
            })

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'typescript gym',
                description: 'some description',
                phone: '5591999999999',
                latitude: -1.3039917,
                longitude: -47.8900467,
            })

        const response = await request(app.server)
            .get('/gyms/search')
            .query({ query: 'javascript' })
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'javascript gym',
            }),
        ])
    })
})
