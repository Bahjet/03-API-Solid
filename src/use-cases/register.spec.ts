import { expect, test, describe, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemmoryUsersRepository } from '@/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

// TESTES UNITARIOS

// variavies para todos tests usando o beforeEach
let usersRepository: InMemmoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemmoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  test('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoddde@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  test('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoddde@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      // compare função do bcryptjs que compara senha com o hash dela
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  test('should not be able to register with same email twice', async () => {
    const email = 'johndoe@example.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    await expect(() =>
      // rejects trabalha com promise então precisa colocar uma await no expect
      sut.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
