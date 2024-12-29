import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('search gyms use case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new SearchGymsUseCase(gymsRepository)
    })

    it('should be able to search for gyms', async () => {
        await gymsRepository.create({
            title: 'Javascript Gym',
            description: null,
            phone: null,
            latitude: -1.3041416,
            longitude: -47.8901497,
        })
        await gymsRepository.create({
            title: 'Python Gym',
            description: null,
            phone: null,
            latitude: -1.3041416,
            longitude: -47.8901497,
        })

        const { gyms } = await sut.execute({
            query: 'Python',
            page: 1,
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([expect.objectContaining({ title: 'Python Gym' })])
    })

    it('should be able to fetch a pagineted search gyms', async () => {
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `Javascript Gym ${i}`,
                description: null,
                phone: null,
                latitude: -1.3041416,
                longitude: -47.8901497,
            })
        }

        const { gyms } = await sut.execute({
            query: 'Javascript',
            page: 2,
        })

        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Javascript Gym 21' }),
            expect.objectContaining({ title: 'Javascript Gym 22' }),
        ])
    })
})
