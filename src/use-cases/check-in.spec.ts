import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('check-in use case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new CheckInUseCase(checkInsRepository)
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to check in', async () => {
        const { checkIn } = await sut.execute({
            gymId: 'gym-id',
            userId: 'user-id',
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice on the same day', async () => {
        vi.setSystemTime(new Date(2024, 11, 27, 10, 0, 0))

        await sut.execute({
            gymId: 'gym-id',
            userId: 'user-id',
        })

        vi.setSystemTime(new Date(2024, 11, 27, 20, 0, 0))

        await expect(() =>
            sut.execute({
                gymId: 'gym-id',
                userId: 'user-id',
            }),
        ).rejects.toBeInstanceOf(Error)
    })

    it('should be able to check in twice but in diferent days', async () => {
        vi.setSystemTime(new Date(2024, 11, 26, 10, 0, 0))

        await sut.execute({
            gymId: 'gym-id',
            userId: 'user-id',
        })

        vi.setSystemTime(new Date(2024, 11, 27, 20, 0, 0))

        const { checkIn } = await sut.execute({
            gymId: 'gym-id',
            userId: 'user-id',
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })
})
