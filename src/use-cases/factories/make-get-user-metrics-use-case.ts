import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { GetMetricsUsersUseCase } from '../get-user-metrics'

export function makeGetUserMetricsUseCase() {
    const checkInsRepository = new PrismaCheckInsRepository()
    const useCase = new GetMetricsUsersUseCase(checkInsRepository)

    return useCase
}
