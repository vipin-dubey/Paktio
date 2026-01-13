import { signup } from '../actions'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SignupForm } from '@/components/auth/signup-form'

export default async function SignupPage() {
    // Check if user is already logged in
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        redirect('/dashboard')
    }

    return (
        <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-foreground">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        Join the future of character-level collaborative agreements.
                    </p>
                </div>
                <SignupForm />
                <div className="text-center">
                    <a href="/login" className="text-sm font-medium text-primary hover:underline">
                        Already have an account? Sign in
                    </a>
                </div>
            </div>
        </div>
    )
}
