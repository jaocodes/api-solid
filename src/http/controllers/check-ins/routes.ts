import type { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middleware/verify-jwt'
import { create } from './create'
import { validate } from './validate'
import { history } from './history'
import { metrics } from './metrics'
import { verifyUserRole } from '@/http/middleware/verify-user-role'

export async function checkInsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    app.get('/check-ins/history', history)
    app.get('/check-ins/metrics', metrics)
    app.post('/gyms/:gymId/check-in', create)
    app.patch(
        '/check-ins/:checkInId/validate',
        { onRequest: verifyUserRole('ADMIN') },
        validate,
    )
}
