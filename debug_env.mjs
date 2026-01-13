
import dotenv from 'dotenv';
import { z } from 'zod';
import { createEnv } from "@t3-oss/env-nextjs";

dotenv.config({ path: '.env.local' });

try {
    const env = createEnv({
        server: {
            STRIPE_SECRET_KEY: z.string().optional(),
            RESEND_API_KEY: z.string().optional(),
            SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
        },
        client: {
            NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
            NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
        },
        runtimeEnv: {
            STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
            RESEND_API_KEY: process.env.RESEND_API_KEY,
            SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
            NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
            NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        },
        onValidationError: (issues) => {
            console.log('VALIDATION_ISSUES:', JSON.stringify(issues, null, 2));
            throw new Error('Validation failed');
        }
    });
    console.log('Environment is valid');
} catch (e) {
    console.log('Caught error');
}
