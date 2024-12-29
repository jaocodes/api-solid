import type { Prisma, CheckIn } from '@prisma/client'
import type { CheckInsRepository } from '../check-ins-repository'
import { prisma } from '@/lib/prisma'

export class PrismaCheckInsRepository implements CheckInsRepository {
    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = await prisma.checkIn.create({ data: data })
        return checkIn
    }
    async findByUserIdOnDate(userId: string, date: Date) {
        const startOfTheDay = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
        )
        const endOfTheDay = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() + 1,
        )
        const checkIn = await prisma.checkIn.findFirst({
            where: {
                user_id: userId,
                created_at: { gte: startOfTheDay, lt: endOfTheDay },
            },
        })

        return checkIn
    }
    async findManyByUserId(userId: string, page: number) {
        const checkIns = await prisma.checkIn.findMany({
            where: { user_id: userId },
            take: 20,
            skip: (page - 1) * 20,
        })

        return checkIns
    }
    async countByUserId(userId: string) {
        const count = await prisma.checkIn.count({ where: { user_id: userId } })

        return count
    }
    async findById(id: string) {
        const checkIn = await prisma.checkIn.findUnique({ where: { id } })

        return checkIn
    }
    async save(data: CheckIn) {
        const checkIn = await prisma.checkIn.update({
            where: { id: data.id },
            data: data,
        })

        return checkIn
    }
}
