import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { test, expect, describe, it } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';

describe('register use case', () => {
	// a senha do usuário deve ser hasheada ao se registrar
	it('should hash user password upon registration', async () => {
		const registerUseCase = new RegisterUseCase({
			async create(data) {
				return {
					id: 'user-1',
					name: data.name,
					email: data.email,
					created_at: new Date(),
					password_hash: data.password_hash,
				};
			},
			async findByEmail(email) {
				return null;
			},
		});

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
});
