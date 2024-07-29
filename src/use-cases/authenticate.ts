import { UsersRepository } from '@/repositories/users-repository'

interface AuthenticateUseCaseRequest {}

export class AuthenticateUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute() {}
}
