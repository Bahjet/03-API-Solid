import { Environment } from 'vitest'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL) // pegando a url do Banco e dividindo em um objeto
  url.searchParams.set('schema', schema) // substituindo o schema da url pelo schema do parametro da função

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    const schema = randomUUID()
    const databaseURL = generateDatabaseURL(schema)

    process.env.DATABASE_URL = databaseURL

    execSync('npx prisma migrate deploy') // usamos o deploy no lugar do dev,por querermos criar o banco de dados com a nova url e não comparar com as migrates

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )
        await prisma.$disconnect()
      },
    }
  },
}
