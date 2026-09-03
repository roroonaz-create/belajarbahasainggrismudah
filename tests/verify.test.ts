import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { supabaseMock } = vi.hoisted(() => {
  const builder: any = {}
  builder.select = vi.fn(() => builder)
  builder.eq = vi.fn(() => builder)
  builder.insert = vi.fn(() => builder)
  builder.single = vi.fn()

  return {
    supabaseMock: {
      auth: {
        getUser: vi.fn(),
      },
      from: vi.fn(() => builder),
    },
  }
})

vi.mock('@/lib/supabase', () => ({
  supabase: supabaseMock,
  default: supabaseMock,
}))

import { GET } from '../app/api/auth/verify/route'

const dbUser = {
  id: 'u1',
  name: 'Budi',
  email: 'budi@example.com',
  level: 'A1',
  created_at: '2024-01-01T00:00:00Z',
}

const get = (headers?: Record<string, string>) =>
  GET(new Request('http://localhost/api/auth/verify', { headers }))

beforeEach(() => {
  vi.clearAllMocks()
  supabaseMock.auth.getUser.mockResolvedValue({ data: { user: dbUser }, error: null })
  supabaseMock.from().single.mockResolvedValue({ data: dbUser, error: null })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('GET /api/auth/verify', () => {
  it('returns 401 when no token is provided', async () => {
    const res = await get()

    expect(res.status).toBe(401)
    expect(await res.json()).toEqual({ message: 'Token tidak ditemukan' })
  })

  it('returns 401 for an invalid token', async () => {
    supabaseMock.auth.getUser.mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'JWT expired' },
    })

    const res = await get({ authorization: 'Bearer expired-token' })

    expect(res.status).toBe(401)
    expect(await res.json()).toEqual({ message: 'Token tidak valid' })
  })

  it('returns 401 when the token resolves to no user', async () => {
    supabaseMock.auth.getUser.mockResolvedValueOnce({ data: { user: null }, error: null })

    const res = await get({ authorization: 'Bearer some-token' })

    expect(res.status).toBe(401)
    expect(await res.json()).toEqual({ message: 'Token tidak valid' })
  })

  it('returns 404 when the user row is missing from the database', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    supabaseMock.from().single.mockResolvedValueOnce({
      data: null,
      error: { message: 'no rows found' },
    })

    const res = await get({ authorization: 'Bearer some-token' })

    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ message: 'User tidak ditemukan' })
  })

  it('returns the mapped user for a valid token, stripping the Bearer prefix', async () => {
    const res = await get({ authorization: 'Bearer token-123' })

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      user: {
        id: 'u1',
        name: 'Budi',
        email: 'budi@example.com',
        level: 'A1',
        createdAt: '2024-01-01T00:00:00Z',
      },
    })
    expect(supabaseMock.auth.getUser).toHaveBeenCalledWith('token-123')
  })
})
