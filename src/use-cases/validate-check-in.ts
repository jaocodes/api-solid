import type { CheckInsRepository } from '@/repositories/check-ins-repository'
import type { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from './erros/resource-not-found-error'
import { getDistanceInMinutesBetweenDates } from '@/utils/get-minute-distante-between-dates'
import { LateCheckInValidationError } from './erros/late-check-in-validation-error'

interface ValidateCheckInUseCaseRequest {
    checkInId: string
}

interface ValidateCheckInUseCaseResponse {
    checkIn: CheckIn
}

export class ValidateCheckInUseCase {
    constructor(private CheckInsRepository: CheckInsRepository) {}
    async execute({
        checkInId,
    }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
        const checkIn = await this.CheckInsRepository.findById(checkInId)

        if (!checkIn) throw new ResourceNotFoundError()

        const distanceInMinutesFromCheckCreation =
            getDistanceInMinutesBetweenDates(checkIn.created_at, new Date())

        if (distanceInMinutesFromCheckCreation > 20)
            throw new LateCheckInValidationError()

        checkIn.validated_at = new Date()

        return { checkIn }
    }
}
