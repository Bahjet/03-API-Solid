import { InMemmoryGymsRepository } from '@/in-memory/in-memory-gyms-repository'
import { expect, test, describe, beforeEach } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

// TESTES UNITARIOS

// variavies para todos tests usando o beforeEach
let gymsRepository: InMemmoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemmoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  test('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      // academia proxima
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -24.0123935,
      longitude: -46.4104784,
    })

    await gymsRepository.create({
      // academia longe
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -23.1037787,
      longitude: -47.2224998,
    })

    const { gyms } = await sut.execute({
      userLatitude: -24.0123935,
      userLongitude: -46.4104784,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
