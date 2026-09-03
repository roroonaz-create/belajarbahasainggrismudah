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
        signUp: vi.fn(),
      },
      from: vi.fn(() => builder),
    },
  }
})

// Route modules import getSupabase; provide it through the shared factory.
vi.mock('@/lib/supabase', () => ({
  getSupabase: () => supabaseMock,
  default: supabaseMock,
}))

import { POST } from '../app/api/auth/register/route'

const dbUser = {
  id: 'u1',
  name: 'Budi',
  email: 'budi@example.com',
  level: 'A1',
  created_at: '2024-01-01T00:00:00Z',
}

const post = (body: unknown) =>
  POST(
    new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  )

const signUpSuccess = {
  data: { user: { id: 'u1', email: 'budi@example.com' } },
  error: null,
}

beforeEach(() => {
  vi.clearAllMocks()
  supabaseMock.auth.signUp.mockResolvedValue(signUpSuccess)
  supabaseMock.from().single.mockResolvedValue({ data: dbUser, error: null })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('POST /api/auth/register', () => {
  it('rejects a name shorter than 2 characters with 400', async () => {
    const res = await post({ name: 'B', email: 'budi@example.com', password: 'secret123' })

    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ message: 'Nama harus minimal 2 karakter' })
  })

  it('rejects an invalid email with 400', async () => {
    const res = await post({ name: 'Budi', email: 'not-an-email', password: 'secret123' })

    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ message: 'Email tidak valid' })
  })

  it('rejects a password shorter than 6 characters with 400', async () => {
    const res = await post({ name: 'Budi', email: 'budi@example.com', password: '12345' })

    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ message: 'Password harus minimal 6 karakter' })
  })

  it('maps an already-registered email to 400', async () => {
    supabaseMock.auth.signUp.mockResolvedValueOnce({
      data: { user: null },
      error: { status: 400, message: 'User already registered' },
    })

    const res = await post({ name: 'Budi', email: 'budi@example.com', password: 'secret123' })

    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ message: 'Email sudah terdaftar' })
  })

  it('returns 500 with the raw message for other auth errors', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    supabaseMock.auth.signUp.mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'email provider unavailable' },
    })

    const res = await post({ name: 'Budi', email: 'budi@example.com', password: 'secret123' })

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ message: 'email provider unavailable' })
  })

  it('returns 500 when sign-up succeeds without a user', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    supabaseMock.auth.signUp.mockResolvedValueOnce({ data: { user: null }, error: null })

    const res = await post({ name: 'Budi', email: 'budi@example.com', password: 'secret123' })

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ message: 'Failed to create user' })
  })

  it('still returns 201 with a local fallback user when the database insert fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    supabaseMock.from().single.mockResolvedValueOnce({
      data: null,
      error: { message: 'insert failed' },
    })

    const res = await post({ name: 'Budi', email: 'budi@example.com', password: 'secret123' })

    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.user).toMatchObject({
      id: 'u1',
      name: 'Budi',
      email: 'budi@example.com',
      level: 'A1',
    })
    expect(typeof body.user.createdAt).toBe('string')
    expect(body.message).toBe('User created but failed to insert into database')
  })

  it('returns 201 with the database user on success', async () => {
    const res = await post({ name: 'Budi', email: 'budi@example.com', password: 'secret123' })

    expect(res.status).toBe(201)
    expect(await res.json()).toEqual({
      user: {
        id: 'u1',
        name: 'Budi',
        email: 'budi@example.com',
        level: 'A1',
        createdAt: '2024-01-01T00:00:00Z',
      },
    })
    expect(supabaseMock.from().insert).toHaveBeenCalledWith([
      { id: 'u1', name: 'Budi', email: 'budi@example.com', level: 'A1' },
    ])
  })
})
