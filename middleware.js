import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export function middleware(request) {
  const url = request.nextUrl.clone()
  const response = NextResponse.next()
  
  // Cek apakah user sudah memiliki ID
  const userId = request.cookies.get('user_id')?.value
  
  if (!userId) {
    // Generate ID baru
    const newUserId = `usr_${uuidv4().replace(/-/g, '').substring(0, 12)}`
    
    // Set cookie untuk user_id
    response.cookies.set('user_id', newUserId, {
      maxAge: 60 * 60 * 24 * 30, // 30 hari
      path: '/',
      sameSite: 'lax',
      httpOnly: false
    })
    
    // Set cookie untuk tracking data
    const trackingData = {
      id: newUserId,
      firstVisit: new Date().toISOString(),
      source: request.headers.get('referer') || 'direct',
      userAgent: request.headers.get('user-agent')?.substring(0, 100) || ''
    }
    
    response.cookies.set('tracking_data', JSON.stringify(trackingData), {
      maxAge: 60 * 60 * 24 * 7, // 7 hari
      path: '/',
      sameSite: 'lax'
    })
    
    // Log tracking (bisa diganti dengan API call)
    console.log('New user tracked:', newUserId)
  }
  
  // Tambahkan header untuk keamanan
  response.headers.set('X-User-ID', userId || 'new-user')
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}
