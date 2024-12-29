import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from './erros/max-distance-error'
import { MaxNumberOfCheckInsError } from './erros/max-number-of-check-in-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('check-in use case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        sut = new CheckInUseCase(checkInsRepository, gymsRepository)

        await gymsRepository.create({
            id: 'gym-id',
            title: 'Js GYM',
            description: 'Academia dos devs',
            latitude: -1.3041416,
            longitude: -47.8901497,
            phone: '',
        })

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to check in', async () => {
        const { checkIn } = await sut.execute({
            gymId: 'gym-id',
            userId: 'user-id',
            userLatitude: -1.3041416,
            userLongitude: -47.8901497,
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice on the same day', async () => {
        vi.setSystemTime(new Date(2024, 11, 27, 10, 0, 0))

        await sut.execute({
            gymId: 'gym-id',
            userId: 'user-id',
            userLatitude: -1.3041416,
            userLongitude: -47.8901497,
        })

        vi.setSystemTime(new Date(2024, 11, 27, 20, 0, 0))

        await expect(() =>
            sut.execute({
                gymId: 'gym-id',
                userId: 'user-id',
                userLatitude: -1.3041416,
                userLongitude: -47.8901497,
            }),
        ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
    })

    it('should be able to check in twice but in diferent days', async () => {
        vi.setSystemTime(new Date(2024, 11, 26, 10, 0, 0))

        await sut.execute({
            gymId: 'gym-id',
            userId: 'user-id',
            userLatitude: -1.3041416,
            userLongitude: -47.8901497,
        })

        vi.setSystemTime(new Date(2024, 11, 27, 20, 0, 0))

        const { checkIn } = await sut.execute({
            gymId: 'gym-id',
            userId: 'user-id',
            userLatitude: -1.3041416,
            userLongitude: -47.8901497,
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in at a gym that is too far away', async () => {
        gymsRepository.items.push({
            id: 'gym-id-2',
            title: 'Js GYM',
            description: 'Academia dos devs',
            latitude: new Decimal(-1.2989978),
            longitude: new Decimal(-47.8943014),
            phone: '',
        })

        await expect(() =>
            sut.execute({
                gymId: 'gym-id-2',
                userId: 'user-id',
                userLatitude: -1.3041416,
                userLongitude: -47.8901497,
            }),
        ).rejects.toBeInstanceOf(MaxDistanceError)
    })
})
