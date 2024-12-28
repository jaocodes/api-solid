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
}
