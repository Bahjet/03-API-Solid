import { FastifyInstance } from 'fastify'
import { verifyUserRole } from '@/http/middleWares/verify-user-role'
import { verifyJWT } from '../../middleWares/verify-jwt'
import { create } from './create'
import { validate } from './validate'
import { history } from './history'
import { metrics } from './metrics'

export async function checkInRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/check-ins/history', history)
  app.get('/check-ins/metrics', metrics)

  app.post('/gyms/:gymId/check-ins', create)

  app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] }, // RBAC role-based access control DELIMITAR PAPEL(ROLE)
    validate,
  )
}
