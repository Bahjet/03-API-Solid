import { InMemmoryGymsRepository } from '@/in-memory/in-memory-gyms-repository'
import { expect, test, describe, beforeEach } from 'vitest'
import { CreateGymUseCase } from './create-gym'

// TESTES UNITARIOS

// variavies para todos tests usando o beforeEach
let gymsRepository: InMemmoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemmoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  test('should be able to create a gym', async () => {
    const { gym } = await sut.execute({
      title: 'JavaScript Gym',
      latitude: -24.0123935,
      longitude: -46.4104784,
      phone: null,
      description: null,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
