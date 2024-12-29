import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ResourceNotFoundError } from './erros/resource-not-found-error'
import { LateCheckInValidationError } from './erros/late-check-in-validation-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('validate check-in use case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new ValidateCheckInUseCase(checkInsRepository)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to validate a check in', async () => {
        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        })

        const { checkIn } = await sut.execute({
            checkInId: createdCheckIn.id,
        })

        expect(checkIn.validated_at).toEqual(expect.any(Date))
        expect(checkInsRepository.items[0].validated_at).toEqual(
            expect.any(Date),
        )
    })

    it('should not be able to validate an unexistent check-in', async () => {
        expect(() =>
            sut.execute({
                checkInId: 'inexistent-check-in-id',
            }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })

    it('should not be able to validate a check-in after 20 minutes of its creation', async () => {
        vi.setSystemTime(new Date(2024, 11, 29, 13, 41))
        const createdCheckIn = await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01',
        })
        const twentyOneMinutesInMiliseconds = 1000 * 60 * 21
        vi.advanceTimersByTime(twentyOneMinutesInMiliseconds)

        await expect(() =>
            sut.execute({
                checkInId: createdCheckIn.id,
            }),
        ).rejects.toBeInstanceOf(LateCheckInValidationError)
    })
})
