import { expect, test, describe, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemmoryUsersRepository } from '@/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

// TESTES UNITARIOS

let usersRepository: InMemmoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemmoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  test('should be able to authenticate', async () => {
    // sut = system under test (nomeclatura dada a principal variavel para fazer o test)

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  test('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  test('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '1258687',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
