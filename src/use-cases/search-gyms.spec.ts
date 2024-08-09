import { InMemmoryGymsRepository } from '@/in-memory/in-memory-gyms-repository'
import { expect, test, describe, beforeEach } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'

// TESTES UNITARIOS

// variavies para todos tests usando o beforeEach
let gymsRepository: InMemmoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemmoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  test('should be able to seach for gyms', async () => {
    await gymsRepository.create({
      title: 'JavaScript Gym',
      phone: null,
      description: null,
      latitude: -24.0123935,
      longitude: -46.4104784,
    })

    await gymsRepository.create({
      title: 'TypeScript Gym',
      phone: null,
      description: null,
      latitude: -24.0123935,
      longitude: -46.4104784,
    })

    const { gyms } = await sut.execute({
      query: 'Java',
      page: 1,
    })
    expect(gyms).toHaveLength(1)

    expect(gyms).toEqual([expect.objectContaining({ title: 'JavaScript Gym' })])
  })

  test('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JavaScript Gym ${i}`,
        phone: null,
        description: null,
        latitude: -24.0123935,
        longitude: -46.4104784,
      })
    }

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)

    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym 21' }),
      expect.objectContaining({ title: 'JavaScript Gym 22' }),
    ])
  })
})
