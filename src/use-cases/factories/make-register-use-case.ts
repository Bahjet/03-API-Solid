import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '../register'
// Factory Pattner
export function makeRegisterUseCase() {
  // Dependency Inversion Principle (principio da inversão de independencia )
  // isolando o banco, facilitando caso troque para outro banco
  const usersRepository = new PrismaUsersRepository()

  const registerUseCase = new RegisterUseCase(usersRepository)

  return registerUseCase
}
