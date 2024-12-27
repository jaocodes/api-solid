import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './erros/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('authenticate use case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUseCase(usersRepository)
    })

    it('should be able to authenticate', async () => {
        await usersRepository.create({
            name: 'Jhon Doe',
            email: 'jhondoe@example.com',
            password_hash: await hash('123456789', 6),
        })

        const { user } = await sut.execute({
            email: 'jhondoe@example.com',
            password: '123456789',
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should not be able to authenticate with wrong email', async () => {
        await expect(() =>
            sut.execute({
                email: 'jhondoesntexist@example.com',
                password: '123456789',
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should not be able to authenticate with wrong password', async () => {
        await usersRepository.create({
            name: 'Jhon Doe',
            email: 'jhondoe@example.com',
            password_hash: await hash('123456789', 6),
        })

        await expect(() =>
            sut.execute({
                email: 'jhondoe@example.com',
                password: '12345678910',
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})
