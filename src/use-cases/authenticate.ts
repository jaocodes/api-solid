import type { UsersRepository } from '@/repositories/users-repository'
import { InvalidCredentialsError } from './erros/invalid-credentials-error'
import { compare } from 'bcryptjs'
import type { User } from '@prisma/client'

interface AuthenticateUseCaseRequest {
    email: string
    password: string
}

interface AuthenticateUseCaseResponse {
    user: User
}

export class AuthenticateUseCase {
    constructor(private userepository: UsersRepository) {}
    async execute({
        email,
        password,
    }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
        const user = await this.userepository.findByEmail(email)

        if (!user) {
            throw new InvalidCredentialsError()
        }
        const doesPasswordMatches = await compare(password, user.password_hash)
        if (!doesPasswordMatches) {
            throw new InvalidCredentialsError()
        }

        return { user }
    }
}
