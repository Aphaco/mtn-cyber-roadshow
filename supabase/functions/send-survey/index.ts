import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, X-Client-Info',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  try {
    console.log('=== SMSOnlineGH Function Invoked ===')

    // 1. Check auth
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. Parse request body
    const { guestId } = await req.json()
    console.log('Guest ID received:', guestId)

    if (!guestId) {
      return new Response(
        JSON.stringify({ error: 'Guest ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 3. Get SMSOnlineGH credentials from environment
    const username = Deno.env.get('SMSONLINE_USERNAME')
    const password = Deno.env.get('SMSONLINE_PASSWORD')
    const sender = Deno.env.get('SMSONLINE_SENDER') || 'CyberRdShow'

    console.log('Environment check:', {
      username: !!username,
      password: !!password,
      sender: sender
    })

    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: 'SMSOnlineGH credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 4. Connect to Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // 5. Get guest details
    console.log('Fetching guest from Supabase...')
    const { data: guest, error: guestError } = await supabaseClient
      .from('guests')
      .select(`phone, survey_token, locations (name)`)
      .eq('id', guestId)
      .single()

    if (guestError || !guest) {
      console.error('Supabase error:', guestError)
      return new Response(
        JSON.stringify({ error: 'Guest not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Guest found:', { phone: guest.phone, location: guest.locations?.name })

    // 6. Format phone number
    let phone = guest.phone.replace(/\D/g, '')
    // SMSOnlineGH accepts both local and international format
    if (phone.startsWith('0')) {
      // Keep local format - SMSOnlineGH accepts this
      console.log('Using local phone format:', phone)
    } else if (!phone.startsWith('233')) {
      phone = '233' + phone
    }
    console.log('Formatted phone:', phone)

    // 7. Build survey link
    const surveyToken = guest.survey_token || guest.id
    const surveyUrl = `https://yourdomain.com/survey/${surveyToken}`
    const locationName = guest.locations?.name || 'the roadshow'
    const messageText = `Hi! Thanks for visiting our ${locationName} roadshow. Please take 2 minutes to complete our survey: ${surveyUrl}`

    console.log('Sending SMS via SMSOnlineGH...')

    // 8. Build the API request with proper parameters
    const apiUrl = 'http://api.smsonlinegh.com/sendsms.php'
    const params = new URLSearchParams({
      user: username,
      password: password,
      sender: sender,
      message: messageText,
      destination: phone,
      type: '0'  // 0 = normal SMS, 1 = flash SMS
    })

    console.log('Sending to:', phone)
    console.log('Full URL:', `${apiUrl}?${params.toString()}`)

    // 9. Send the SMS
    const response = await fetch(`${apiUrl}?${params.toString()}`, {
      method: 'GET'
    })

    const responseText = await response.text()
    console.log('SMSOnlineGH response:', responseText)

    // 10. Check response
    // Success response format: 1400@BATCH_ID
    // Failure: 1401@Error message or 1402@Error
    if (!responseText.startsWith('1400@')) {
      const errorMsg = responseText.split('@')[1] || 'Unknown error'
      console.error('SMSOnlineGH error:', errorMsg)
      throw new Error(`SMS failed: ${errorMsg}`)
    }

    // 11. Update guest record
    await supabaseClient
      .from('guests')
      .update({
        sms_status: 'sent',
        sms_sent_at: new Date().toISOString(),
      })
      .eq('id', guestId)

    console.log('✅ SMS sent successfully!')

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Survey sent via SMSOnlineGH!',
        response: responseText
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('❌ Function error:', error.message)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})