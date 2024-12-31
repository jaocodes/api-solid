import type { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
import { getProfile } from './profile'
import { verifyJWT } from '../../middleware/verify-jwt'
import { refresh } from './refresh'

export async function userRoutes(app: FastifyInstance) {
    app.post('/users', register)
    app.post('/sessions', authenticate)
    app.patch('/token/refresh', refresh)

    // rotas autenticadas
    app.get('/me', { onRequest: [verifyJWT] }, getProfile)
}
