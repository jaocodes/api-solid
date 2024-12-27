import type { User, Prisma } from '@prisma/client'
import type { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
    async findById(id: string) {
        const user = this.items.find((item) => item.id === id)
        if (!user) return null
        return user
    }
    public items: User[] = []

    async findByEmail(email: string) {
        const user = this.items.find((item) => item.email === email)

        if (!user) return null
        return user
    }
    async create(data: Prisma.UserCreateInput) {
        const user = {
            id: 'user-1',
            name: data.name,
            email: data.email,
            created_at: new Date(),
            password_hash: data.password_hash,
        }

        this.items.push(user)
        return user
    }
}
