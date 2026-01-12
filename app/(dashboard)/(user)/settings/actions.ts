'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Database } from '@/lib/types/database'

const profileSchema = z.object({
    fullName: z.string().optional(),
    phoneNumber: z.string().optional(),
    locale: z.enum(['en', 'no', 'se', 'dk']).optional(),
})

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        fullName: formData.get('fullName'),
        phoneNumber: formData.get('phoneNumber'),
        locale: formData.get('locale'),
    }

    // Parse and validate
    const validatedData = profileSchema.parse(rawData)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Unauthorized')
    }

    const { error } = await supabase
        .from('profiles')
        .update({
            full_name: validatedData.fullName,
            phone_number: validatedData.phoneNumber,
            locale: validatedData.locale as Database['public']['Enums']['locale_type'],
        })
        .eq('id', user.id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/settings')
}
