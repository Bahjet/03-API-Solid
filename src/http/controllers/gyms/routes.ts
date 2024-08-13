import { FastifyInstance } from 'fastify'

import { verifyJWT } from '../../middleWares/verify-jwt'

import { search } from './search'
import { nearby } from './nearby'
import { create } from './create'
import { verifyUserRole } from '@/http/middleWares/verify-user-role'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/gyms/search', search)
  app.get('/gyms/nearby', nearby)

  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create) // RBAC role-based access control DELIMITAR PAPEL(ROLE)
}
