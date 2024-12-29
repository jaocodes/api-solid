import type { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { authenticate } from './controllers/authenticate'
import { getProfile } from './controllers/profile'
import { verifyJWT } from './middleware/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
    app.post('/users', register)
    app.post('/sessions', authenticate)

    // rotas autenticadas
    app.get('/me', { onRequest: [verifyJWT] }, getProfile)
}
