import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface SearchGymsUseCaseRequest {
  query: string // nome da academia, usamos query caso mande mais dados no futuro
  page: number
}

interface SearchGymsUseCaseResponse {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return { gyms }
  }
}
