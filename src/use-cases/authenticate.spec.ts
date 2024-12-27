import { expect, describe, it } from 'vitest';
import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './erros/invalid-credentials-error';

describe('authenticate use case', () => {
	it('should be able to authenticate', async () => {
		const usersRepository = new InMemoryUsersRepository();
		const sut = new AuthenticateUseCase(usersRepository);

		await usersRepository.create({
			name: 'Jhon Doe',
			email: 'jhondoe@example.com',
			password_hash: await hash('123456789', 6),
		});

		const { user } = await sut.execute({
			email: 'jhondoe@example.com',
			password: '123456789',
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it('should not be able to authenticate with wrong email', async () => {
		const usersRepository = new InMemoryUsersRepository();
		const sut = new AuthenticateUseCase(usersRepository);

		await expect(() =>
			sut.execute({
				email: 'jhondoesntexist@example.com',
				password: '123456789',
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it('should not be able to authenticate with wrong password', async () => {
		const usersRepository = new InMemoryUsersRepository();
		const sut = new AuthenticateUseCase(usersRepository);

		await usersRepository.create({
			name: 'Jhon Doe',
			email: 'jhondoe@example.com',
			password_hash: await hash('123456789', 6),
		});

		await expect(() =>
			sut.execute({
				email: 'jhondoe@example.com',
				password: '12345678910',
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});
