import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { CreateAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('nearby gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to fetch a search for a list of nearby gyms', async () => {
        const { token } = await CreateAndAuthenticateUser(app)

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Near Gym',
                description: 'Academia próxima',
                latitude: -1.2989978,
                longitude: -47.8943014,
                phone: '',
            })

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Far Gym',
                description: 'Academia distante',
                latitude: -1.2115482,
                longitude: -47.9257222,
                phone: '',
            })

        const response = await request(app.server)
            .get('/gyms/nearby')
            .query({
                latitude: -1.2989978,
                longitude: -47.8943014,
            })
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({ title: 'Near Gym' }),
        ])
    })
})
