import type { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { hash } from 'bcryptjs';
import { RegisterUseCase } from '@/use-cases/register';
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository';

export async function register(request: FastifyRequest, reply: FastifyReply) {
	const registerBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(8),
	});

	const { name, email, password } = registerBodySchema.parse(request.body);

	try {
		const prismaUsersRepository = new PrismaUsersRepository();
		const registerUseCase = new RegisterUseCase(prismaUsersRepository);

		await registerUseCase.execute({ name, email, password });
	} catch (error) {
		return reply.status(409).send();
	}

	return reply.status(201).send({ message: 'User created successfully' });
}
