import { makeGetUserProfile } from '@/use-cases/factories/make-get-user-profile-use-case'
import type { FastifyRequest, FastifyReply } from 'fastify'

export async function getProfile(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify()

    const getUserProfile = makeGetUserProfile()

    const { user } = await getUserProfile.execute({ userId: request.user.sub })

    return reply
        .status(200)
        .send({ user: { ...user, password_hash: undefined } })
}
