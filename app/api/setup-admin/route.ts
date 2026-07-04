import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Admin credentials
const ADMIN_EMAIL = 'admin@belajarbahasainggris.com'
const ADMIN_PASSWORD = '@@Asdf1290##'
const ADMIN_NAME = 'Admin'

export async function GET(request: Request) {
  try {
    // Check if admin already exists in database
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', ADMIN_EMAIL)
      .single()

    if (checkError && !checkError.message.includes('no rows')) {
      console.error('Error checking admin:', checkError)
    }

    if (existingUser) {
      return NextResponse.json(
        { 
          message: 'Admin sudah ada',
          email: ADMIN_EMAIL,
          password: '*** (rahasia)'
        },
        { status: 200 }
      )
    }

    // Create admin in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      options: {
        data: {
          name: ADMIN_NAME,
        },
      },
    })

    if (authError) {
      // If user already exists in auth
      if (authError.status === 400) {
        // Try to get the user from auth
        const { data: { user }, error: userError } = await supabase.auth.getUserById(ADMIN_EMAIL)
        
        if (userError || !user) {
          return NextResponse.json(
            { 
              message: 'Admin sudah ada di auth tetapi tidak di database',
              error: authError.message
            },
            { status: 400 }
          )
        }
        
        // Insert into database
        const { error: dbError } = await supabase
          .from('users')
          .insert([
            {
              id: user.id,
              name: ADMIN_NAME,
              email: ADMIN_EMAIL,
              level: 'C2',
            },
          ])

        if (dbError) {
          return NextResponse.json(
            { 
              message: 'Gagal menambahkan admin ke database',
              error: dbError.message
            },
            { status: 500 }
          )
        }

        return NextResponse.json(
          { 
            message: 'Admin sudah ada di auth, ditambahkan ke database',
            email: ADMIN_EMAIL,
            password: '*** (rahasia)'
          },
          { status: 200 }
        )
      }
      
      throw new Error(authError.message)
    }

    if (!authData.user) {
      throw new Error('Failed to create admin user')
    }

    // Insert admin into database
    const { error: dbError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          name: ADMIN_NAME,
          email: ADMIN_EMAIL,
          level: 'C2',
        },
      ])

    if (dbError) {
      console.error('Error inserting admin:', dbError)
      return NextResponse.json(
        { 
          message: 'Admin dibuat di auth tetapi gagal di database',
          error: dbError.message
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Admin berhasil dibuat',
        email: ADMIN_EMAIL,
        password: '*** (rahasia)',
        name: ADMIN_NAME,
        level: 'C2'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Setup admin error:', error)
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : 'Terjadi kesalahan saat setup admin',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}
