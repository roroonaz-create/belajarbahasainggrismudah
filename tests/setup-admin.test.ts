import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { supabaseMock } = vi.hoisted(() => {
  const builder: any = {}
  builder.select = vi.fn(() => builder)
  builder.eq = vi.fn(() => builder)
  builder.insert = vi.fn(() => builder)
  builder.single = vi.fn()
  builder.error = null

  return {
    supabaseMock: {
      auth: {
        signUp: vi.fn(),
        signInWithPassword: vi.fn(),
      },
      from: vi.fn(() => builder),
    },
  }
})

// Route modules import getSupabase; provide it through the shared factory.
vi.mock('@/lib/supabase', () => ({
  getSupabase: vi.fn(() => supabaseMock),
  default: supabaseMock,
}))

import { GET } from '../app/api/setup-admin/route'

const ADMIN_EMAIL = 'admin@belajarbahasainggris.com'

const get = () => GET(new Request('http://localhost/api/setup-admin'))

beforeEach(() => {
  vi.clearAllMocks()
  supabaseMock.from().error = null
  supabaseMock.auth.signUp.mockResolvedValue({ data: { user: { id: 'a1' } }, error: null })
  supabaseMock.auth.signInWithPassword.mockResolvedValue({
    data: { user: { id: 'a1', email: ADMIN_EMAIL } },
    error: null,
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('GET /api/setup-admin', () => {
  it('returns 500 when Supabase is not configured', async () => {
    const { getSupabase } = await import('@/lib/supabase')
    vi.mocked(getSupabase).mockReturnValueOnce(null as never)

    const res = await get()

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ message: 'Supabase belum dikonfigurasi' })
  })

  it('returns the existing admin without exposing the password', async () => {
    supabaseMock.from().single.mockResolvedValueOnce({
      data: { id: 'a1', email: ADMIN_EMAIL },
      error: null,
    })

    const res = await get()

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      message: 'Admin sudah ada',
      email: ADMIN_EMAIL,
      password: '*** (rahasia)',
    })
    expect(supabaseMock.auth.signUp).not.toHaveBeenCalled()
  })

  it('creates the admin and user row when none exists', async () => {
    supabaseMock.from().single.mockResolvedValueOnce({
      data: null,
      error: { message: '0 rows returned' },
    })

    const res = await get()

    expect(res.status).toBe(201)
    expect(await res.json()).toEqual({
      message: 'Admin berhasil dibuat',
      email: ADMIN_EMAIL,
      password: '*** (rahasia)',
      name: 'Admin',
      level: 'C2',
    })
    expect(supabaseMock.from().insert).toHaveBeenCalledWith([
      { id: 'a1', name: 'Admin', email: ADMIN_EMAIL, level: 'C2' },
    ])
  })

  it('recovers an auth-existing admin by inserting the database row', async () => {
    supabaseMock.from().single.mockResolvedValueOnce({
      data: null,
      error: { message: '0 rows returned' },
    })
    supabaseMock.auth.signUp.mockResolvedValueOnce({
      data: { user: null },
      error: { status: 400, message: 'User already registered' },
    })
    supabaseMock.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: { id: 'a1', email: ADMIN_EMAIL } },
      error: null,
    })

    const res = await get()

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      message: 'Admin sudah ada di auth, ditambahkan ke database',
      email: ADMIN_EMAIL,
      password: '*** (rahasia)',
    })
  })

  it('returns 400 when the admin exists in auth but cannot be fetched', async () => {
    supabaseMock.from().single.mockResolvedValueOnce({
      data: null,
      error: { message: '0 rows returned' },
    })
    supabaseMock.auth.signUp.mockResolvedValueOnce({
      data: { user: null },
      error: { status: 400, message: 'User already registered' },
    })
    supabaseMock.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'not found' },
    })

    const res = await get()

    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({
      message: 'Admin sudah ada di auth tetapi tidak di database',
      error: 'User already registered',
    })
  })

  it('returns 500 when auth succeeds but the database insert fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    supabaseMock.from().single.mockResolvedValueOnce({
      data: null,
      error: { message: '0 rows returned' },
    })
    supabaseMock.from().error = { message: 'constraint violation' }

    const res = await get()

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({
      message: 'Admin dibuat di auth tetapi gagal di database',
      error: 'constraint violation',
    })
  })

  it('returns 500 for any other auth signup error', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    supabaseMock.from().single.mockResolvedValueOnce({
      data: null,
      error: { message: '0 rows returned' },
    })
    supabaseMock.auth.signUp.mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'auth provider unavailable' },
    })

    const res = await get()

    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ message: 'auth provider unavailable' })
  })
})
