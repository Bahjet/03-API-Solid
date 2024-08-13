import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  // validar o usuario, sem o 'Authorization: Bearer token' usando os cooking da requisição vendo se existe e se é valido(tempo de validade)
  await request.jwtVerify({ onlyCookie: true })

  const { role } = request.user
  console.log(role)
  const token = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
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
}
