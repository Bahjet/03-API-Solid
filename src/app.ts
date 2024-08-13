import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import { usersRoutes } from './http/controllers/users/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { checkInRoutes } from './http/controllers/check-ins/routes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: { cookieName: 'refreshToken', signed: false },
  sign: { expiresIn: '10m' },
})

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInRoutes)
app.register(fastifyCookie)

// função de erros globais
app.setErrorHandler((error, _request, reply) => {
  // caso não use algum parametro basta adicionar _ por exemplo _request ou substituir penas por _
  if (error instanceof ZodError) {
    // erro de validação (zod)
    return reply
      .status(400)
      .send({ massage: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    // mostrando os error no console para facilitar o tratamento
    console.error(error)
  } else {
    // TO DO Here we should log to an external tool like DataDog/NewRelic/Sentry ferramentas de monitoramento, podendo avisar sobre erros
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
