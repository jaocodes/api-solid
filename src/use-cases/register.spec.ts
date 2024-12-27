import { expect, describe, it, beforeEach } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './erros/user-already-exists-error';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe('register use case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new RegisterUseCase(usersRepository);
	});

	it('should be able to register', async () => {
		const { user } = await sut.execute({
			name: 'Jhon Doe',
			email: 'jhondoe@example.com',
			password: '123456789',
		});

		expect(user.id).toEqual(expect.any(String));
	});

	// a senha do usuário deve ser hasheada ao se registrar
	it('should hash user password upon registration', async () => {
		const { user } = await sut.execute({
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
		const email = 'jhondoe@example.com';

		await sut.execute({
			name: 'Jhon Doe',
			email,
			password: '123456789',
		});

		await expect(() =>
			sut.execute({
				name: 'Jhon Doe',
				email,
				password: '123456789',
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});
