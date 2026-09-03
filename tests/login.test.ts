import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Hoisted mock so the route module under test receives this fake Supabase client.
const { supabaseMock } = vi.hoisted(() => {
  // Fluent query builder: from().select().eq().single() and from().insert().select().single()
  const builder: any = {}
  builder.select = vi.fn(() => builder)
  builder.eq = vi.fn(() => builder)
  builder.insert = vi.fn(() => builder)
  builder.single = vi.fn()
  builder.error = null

  return {
    supabaseMock: {
      auth: {
        signInWithPassword: vi.fn(),
      },
      from: vi.fn(() => builder),
    },
  }
})

vi.mock('@/lib/supabase', () => ({
  supabase: supabaseMock,
  default: supabaseMock,
}))

import { POST } from '../app/api/auth/login/route'

const dbUser = {
  id: 'u1',
  name: 'Budi',
  email: 'budi@example.com',
  level: 'A1',
  created_at: '2024-01-01T00:00:00Z',
}

const post = (body: unknown) =>
  POST(
    new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: typeof body === 'string' ? body : JSON.stringify(body),
    })
  )

const signInSuccess = {
  data: { user: dbUser, session: { access_token: 'token-123' } },
  error: null,
}

beforeEach(() => {
  vi.clearAllMocks()
  supabaseMock.auth.signInWithPassword.mockResolvedValue(signInSuccess)
  supabaseMock.from().single.mockResolvedValue({ data: dbUser, error: null })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('POST /api/auth/login', () => {
  it('rejects an invalid email with 400', async () => {
    const res = await post({ email: 'not-an-email', password: 'secret123' })

    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ message: 'Email tidak valid' })
  })

  it('rejects a missing password with 400', async () => {
    const res = await post({ email: 'budi@example.com', password: '' })

    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ message: 'Password harus diisi' })
  })

  it('returns 500 for a malformed JSON body', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const res = await post('this is not json')

    expect(res.status).toBe(500)
    expect(typeof (await res.json()).message).toBe('string')
  })

  it('maps invalid login credentials to a 401 with the localized message', async () => {
    supabaseMock.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { status: 400, message: 'Invalid login credentials' },
    })

    const res = await post({ email: 'budi@example.com', password: 'wrong-password' })

    expect(res.status).toBe(401)
    expect(await res.json()).toEqual({ message: 'Email atau password salah' })
  })

  it('maps a not-found account to 404', async () => {
    supabaseMock.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { status: 404, message: 'User not found' },
    })

    const res = await post({ email: 'ghost@example.com', password: 'secret123' })

    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ message: 'User tidak ditemukan' })
  })

  it('falls back to 401 with the raw message for other auth errors', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    supabaseMock.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'rate limited' },
    })

    const res = await post({ email: 'budi@example.com', password: 'secret123' })

    expect(res.status).toBe(401)
    expect(await res.json()).toEqual({ message: 'rate limited' })
  })

  it('returns 404 when sign-in succeeds without a user', async () => {
    supabaseMock.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: null,
    })

    const res = await post({ email: 'budi@example.com', password: 'secret123' })

    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ message: 'User tidak ditemukan' })
  })

  it('returns 404 when the user row is missing from the database', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    supabaseMock.from().single.mockResolvedValueOnce({
      data: null,
      error: { message: 'no rows found' },
    })

    const res = await post({ email: 'budi@example.com', password: 'secret123' })

    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ message: 'User data tidak ditemukan' })
  })

  it('returns the mapped user and access token on success', async () => {
    const res = await post({ email: 'budi@example.com', password: 'secret123' })

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      user: {
        id: 'u1',
        name: 'Budi',
        email: 'budi@example.com',
        level: 'A1',
        createdAt: '2024-01-01T00:00:00Z',
      },
      token: 'token-123',
    })
    expect(supabaseMock.from).toHaveBeenCalledWith('users')
    expect(supabaseMock.from().eq).toHaveBeenCalledWith('email', 'budi@example.com')
  })
})
