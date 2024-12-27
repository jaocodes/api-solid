import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { test, expect, describe, it } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './erros/user-already-exists';

describe('register use case', () => {
	it('should be able to register', async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(usersRepository);

		const { user } = await registerUseCase.execute({
			name: 'Jhon Doe',
			email: 'jhondoe@example.com',
			password: '123456789',
		});

		expect(user.id).toEqual(expect.any(String));
	});

	// a senha do usuário deve ser hasheada ao se registrar
	it('should hash user password upon registration', async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(usersRepository);

		const { user } = await registerUseCase.execute({
			name: 'Jhon Doe',
			email: 'jhondoe@example.com',
			password: '123456789',
		});

		const isPasswordCorrectHashed = await compare(
			'123456789',
			user.password_hash,
		);

		expect(isPasswordCorrectHashed).toBe(true);
	});

	it('should not allow registration of users with the same email', async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(usersRepository);

		const email = 'jhondoe@example.com';

		await registerUseCase.execute({
			name: 'Jhon Doe',
			email,
			password: '123456789',
		});

		await expect(() =>
			registerUseCase.execute({
				name: 'Jhon Doe',
				email,
				password: '123456789',
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});
