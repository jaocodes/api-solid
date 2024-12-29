import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { MaxDistanceError } from './erros/max-distance-error'
import { MaxNumberOfCheckInsError } from './erros/max-number-of-check-in-error'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('fetch nearby gyms use case', () => {
    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new FetchNearbyGymsUseCase(gymsRepository)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to search nearby gyms', async () => {
        await gymsRepository.create({
            title: 'Near Gym',
            description: 'Academia próxima',
            latitude: -1.2989978,
            longitude: -47.8943014,
            phone: '',
        })

        await gymsRepository.create({
            title: 'Far Gym',
            description: 'Academia distante',
            latitude: -1.2115482,
            longitude: -47.9257222,
            phone: '',
        })

        const { gyms } = await sut.execute({
            userLatitude: -1.2989978,
            userLongitude: -47.8943014,
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
    })
})
