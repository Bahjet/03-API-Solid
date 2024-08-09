import { UsersRepository } from '@/repositories/users-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { compare } from 'bcryptjs'
import { User } from '@prisma/client'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUseCaseResponse = {
  user: User
}

export class AuthenticateUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    // buscar o usúario no banco pelo e-mail
    // comparar se a senha salva no banco bate com a senhad o parametro
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    // Boolean => "is" "has" "does"
    const doesPasswordMatches = await compare(password, user.password_hash)

    if (doesPasswordMatches === false) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}
