import fastify from 'fastify'
import { userRoutes } from './http/controllers/users/routes'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import { gymsRoutes } from './http/controllers/gyms/routes'

export const app = fastify()

app.register(fastifyJwt, {
    secret: env.SUPER_SECRET_JWT,
})

app.register(userRoutes)
app.register(gymsRoutes)

app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
        return reply
            .status(400)
            .send({ message: 'Validation error', issues: error.format() })
    }

    if (env.NODE_ENV !== 'prod') {
        console.error(error)
    } else {
        // TODO: tratar para uma ferramenta de logs externa
    }
    return reply.status(500).send({ message: 'Internal server error' })
})
