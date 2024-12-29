import type { CheckInsRepository } from '@/repositories/check-ins-repository'
import type { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from './erros/resource-not-found-error'

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

        checkIn.validated_at = new Date()

        return { checkIn }
    }
}
