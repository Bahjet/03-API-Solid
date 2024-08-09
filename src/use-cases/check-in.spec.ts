import { afterEach, expect, test, describe, beforeEach, vi } from 'vitest'
import { InMemmoryCheckInsRepository } from '@/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemmoryGymsRepository } from '@/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

// TESTES UNITARIOS

// variavies para todos tests usando o beforeEach
let checkInsRepository: InMemmoryCheckInsRepository
let gymsRepository: InMemmoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemmoryCheckInsRepository()
    gymsRepository = new InMemmoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Javascript Gym',
      description: '',
      phone: '',
      latitude: -24.0123935,
      longitude: -46.4104784,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -24.0123935,
      userLongitude: -46.4104784,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  test('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -24.0123935,
      userLongitude: -46.4104784,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -24.0123935,
        userLongitude: -46.4104784,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  test('should be able to check in twice but in the different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -24.0123935,
      userLongitude: -46.4104784,
    }) // -24.0123935,-46.4104784

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0)) // alterando a data do sistema para criar em outro horario

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -24.0123935,
      userLongitude: -46.4104784,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  test('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Javascript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-24.08259),
      longitude: new Decimal(-46.599571),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -24.0123935,
        userLongitude: -46.4104784,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
