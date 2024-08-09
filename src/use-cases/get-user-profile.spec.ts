import { expect, test, describe, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemmoryUsersRepository } from '@/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

// TESTES UNITARIOS

let usersRepository: InMemmoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemmoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })
  // testando perfil de usuario
  test('should be able to get user profile', async () => {
    // sut = system under test (nomeclatura dada a principal variavel para fazer o test)

    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({ userId: createdUser.id })

    expect(user.name).toEqual('John Doe')
  })

  test('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({ userId: 'non-existing-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
