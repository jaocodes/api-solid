import type { CheckInsRepository } from '@/repositories/check-ins-repository'
import type { CheckIn } from '@prisma/client'
interface GetMetricsUsersUseCaseRequest {
    userId: string
}

interface GetMetricsUsersUseCaseResponse {
    checkInsCount: number
}

export class GetMetricsUsersUseCase {
    constructor(private checkInsRepository: CheckInsRepository) {}
    async execute({
        userId,
    }: GetMetricsUsersUseCaseRequest): Promise<GetMetricsUsersUseCaseResponse> {
        const checkInsCount =
            await this.checkInsRepository.countByUserId(userId)

        return { checkInsCount }
    }
}
