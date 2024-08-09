import { expect, test, describe, beforeEach } from 'vitest'
import { InMemmoryCheckInsRepository } from '@/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics'

// TESTES UNITARIOS

// variavies para todos tests usando o beforeEach
let checkInsRepository: InMemmoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemmoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  test('Should be able to get check-ins count from metrics', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
