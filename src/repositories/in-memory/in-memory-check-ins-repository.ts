import type { CheckIn, Prisma } from '@prisma/client'
import type { CheckInsRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryCheckInsRepository implements CheckInsRepository {
    public items: CheckIn[] = []

    async findByUserIdOnDate(userId: string, date: Date) {
        const checkIn = this.items.find((item) => {
            const onSameDay =
                item.created_at.getFullYear() === date.getFullYear() &&
                item.created_at.getMonth() === date.getMonth() &&
                item.created_at.getDate() === date.getDate()

            return item.user_id === userId && onSameDay
        })
        if (!checkIn) return null

        return checkIn
    }

    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = {
            id: randomUUID(),
            user_id: data.user_id,
            gym_id: data.gym_id,
            validated_at: data.validated_at
                ? new Date(data.validated_at)
                : null,
            created_at: new Date(),
        }

        this.items.push(checkIn)
        return checkIn
    }

    async findManyByUserId(userId: string, page: number) {
        const checkIns = this.items
            .filter((item) => item.user_id === userId)
            .slice((page - 1) * 20, page * 20)

        return checkIns
    }

    async findById(id: string) {
        const checkIn = this.items.find((item) => item.id === id)
        if (!checkIn) return null
        return checkIn
    }

    async countByUserId(userId: string) {
        const checkInsCount = this.items.filter(
            (item) => item.user_id === userId,
        ).length

        return checkInsCount
    }

    async save(checkIn: CheckIn) {
        const checkInIndex = this.items.findIndex(
            (item) => item.id === checkIn.id,
        )

        if (checkInIndex >= 0) {
            this.items[checkInIndex] = checkIn
        }

        return checkIn
    }
}
