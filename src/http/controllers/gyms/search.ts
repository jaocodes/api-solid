import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function search(request: FastifyRequest, reply: FastifyReply) {
    const searchGymBodySchema = z.object({
        page: z.coerce.number().min(1).default(1),
        query: z.string(),
    })

    const { page, query } = searchGymBodySchema.parse(request.body)

    const searchGymsUseCase = makeSearchGymsUseCase()
    const { gyms } = await searchGymsUseCase.execute({
        page,
        query,
    })

    return reply.status(200).send({ gyms })
}