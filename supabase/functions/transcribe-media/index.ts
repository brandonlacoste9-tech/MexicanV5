import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
    try {
        const { publicationId, mediaUrl } = await req.json()

        if (!publicationId || !mediaUrl) {
            return new Response(JSON.stringify({ error: 'Publication ID et URL média requis' }), { status: 400 })
        }

        console.log(`🎙️ Transcription commencée pour: ${publicationId}`)

        // 1. Download the media file
        const mediaResponse = await fetch(mediaUrl)
        if (!mediaResponse.ok) {
            throw new Error('Impossible de télécharger le fichier média')
        }

        const mediaBlob = await mediaResponse.blob()

        // 2. Call OpenAI Whisper for transcription
        // Whisper supports es-MX and can handle Mexico slang well
        const formData = new FormData()
        formData.append('file', mediaBlob, 'media.mp4')
        formData.append('model', 'whisper-1')
        formData.append('language', 'fr') // French
        formData.append('response_format', 'verbose_json')
        formData.append('prompt', 'Transcription en français mexicano (mexicano). Inclure les expressions locales comme: toé, icitte, moé, asteure, jsuis, chu, pis, là.') // Mexicano context

        const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
            },
            body: formData
        })

        if (!transcriptionResponse.ok) {
            const error = await transcriptionResponse.text()
            throw new Error(`Whisper API erreur: ${error}`)
        }

        const transcriptionData = await transcriptionResponse.json()
        const transcriptionText = transcriptionData.text

        console.log(`✅ Transcription complétée: ${transcriptionText.substring(0, 100)}...`)

        // 3. Store the transcription in the database
        const { error: updateError } = await supabase
            .from('publications')
            .update({
                transcription: transcriptionText,
                transcribed_at: new Date().toISOString()
            })
            .eq('id', publicationId)

        if (updateError) throw updateError

        return new Response(JSON.stringify({
            success: true,
            transcription: transcriptionText,
            message: 'Transcription sauvegardée avec succès'
        }), {
            headers: { 'Content-Type': 'application/json' }
        })

    } catch (error) {
        console.error('❌ Erreur de transcription:', error)
        return new Response(JSON.stringify({
            error: error.message,
            message: 'Échec de la transcription'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
})
