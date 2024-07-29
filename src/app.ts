import fastify from 'fastify'
import { appRoutes } from './http/routes'
import { ZodError } from 'zod'
import { env } from './env'

export const app = fastify()

app.register(appRoutes)

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
    // TODO Here we should log to an external tool like DataDog/NewRelic/Sentry ferramentas de monitoramento, podendo avisar sobre erros
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
