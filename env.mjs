import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        STRIPE_SECRET_KEY: z.string().optional(),
        RESEND_API_KEY: z.string().optional(),
        SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
    },
    client: {
        NEXT_PUBLIC_SITE_URL: z.string().min(1),
        NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    },
    runtimeEnv: {
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    },
    onValidationError: (issues) => {
        console.error("❌ Invalid environment variables:");
        issues.forEach(issue => {
            console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
        });
        throw new Error("Invalid environment variables. Check server logs for details.");
    },
    emptyStringAsUndefined: true,
});
