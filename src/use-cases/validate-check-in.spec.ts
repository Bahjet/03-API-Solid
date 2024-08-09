import { afterEach, expect, test, describe, beforeEach, vi } from 'vitest'
import { InMemmoryCheckInsRepository } from '@/in-memory/in-memory-check-ins-repository'

import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

// TESTES UNITARIOS

// variavies para todos tests usando o beforeEach
let checkInsRepository: InMemmoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemmoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({ checkInId: createdCheckIn.id })

    expect(checkIn.validated_at).toEqual(expect.any(Date))

    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  test('should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  test('should not be able to validate an inexistent check-in', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40)) // utc-3 daqui para frente é essa data

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21 // 21 minutos em milesegundos
    vi.advanceTimersByTime(twentyOneMinutesInMs) // avançando o tempo 21 minutos da data atual

    await expect(() =>
      sut.execute({ checkInId: createdCheckIn.id }),
    ).rejects.toBeInstanceOf(Error)
  })
})
