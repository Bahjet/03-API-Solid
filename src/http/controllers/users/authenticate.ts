import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    // Dependency Inversion Principle (principio da inversão de independencia )
    // isolando o banco, facilitando caso troque para outro banco

    const authenticateUseCase = makeAuthenticateUseCase() // factory pattern

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })
    // nunca coloque dados sensiveis como senha ou email no JWT

    const token = await reply.jwtSign(
      { role: user.role },
      {
        sign: {
          sub: user.id,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      { role: user.role },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        // refreshToken nome do cookie , dados do refresh token(outro jwt com maior validade)
        path: '/', // path: rotas que terão acesso ao cookie ('/' todas rotas tem acesso)
        secure: true, // informa que o nosso cookie será encriptado com HTTPs fazendo com que o front não consiga identificar de forma clara
        sameSite: true, // esse cookie só vai ser acessivel dentro do mesmo dominio (site)
        httpOnly: true, // limita o acesso apenas ao back entre requisições e respostas, não salva nada no browser
      })
      .status(200)
      .send({
        token,
      })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
