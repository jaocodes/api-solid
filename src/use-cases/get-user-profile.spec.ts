import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './erros/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('get user profile use case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new GetUserProfileUseCase(usersRepository)
    })

    it('should be able to return a user profile', async () => {
        const createdUser = await usersRepository.create({
            name: 'Jhon Doe',
            email: 'jhondoe@example.com',
            password_hash: await hash('123456789', 6),
        })

        const { user } = await sut.execute({
            userId: createdUser.id,
        })

        expect(user.name).toEqual(createdUser.name)
    })

    it('should be able to return a user profile', async () => {
        await expect(() =>
            sut.execute({
                userId: 'non-existed-user-id',
            }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })
})
