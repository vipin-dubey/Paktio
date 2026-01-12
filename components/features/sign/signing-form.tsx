'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { submitSignature } from '@/app/(regional)/sign/actions'
import { validateAndSendOTP } from '@/app/(regional)/sign/[contractId]/actions'

interface SigningFormProps {
    contractId: string
    intendedEmail?: string
}

export default function SigningForm({ contractId, intendedEmail }: SigningFormProps) {
    const [step, setStep] = useState<'email' | 'otp' | 'sign'>('email')
    const [email, setEmail] = useState(intendedEmail || '')
    const [otp, setOtp] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [otpAttempts, setOtpAttempts] = useState(0)

    // Validate that user can only sign with the intended email
    const isEmailLocked = !!intendedEmail

    const handleSendOTP = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // Server-side validation: checks if email is authorized and sends OTP to the correct email
            const result = await validateAndSendOTP(contractId, email)

            setOtpAttempts(prev => prev + 1)
            setStep('otp')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send OTP')
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: 'email'
            })

            if (error) throw error

            setStep('sign')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid OTP')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            await submitSignature(contractId, name, email)
            setSuccess(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit signature')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Agreement Signed Successfully!</h3>
                <p className="text-muted-foreground mb-1">Your signature has been recorded and verified.</p>
                <p className="text-sm text-green-600">✓ Email verified via OTP</p>
            </div>
        )
    }

    if (step === 'email') {
        return (
            <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-800">
                        🔒 To sign this contract, we'll send a verification link to your email address.
                    </p>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email Address {isEmailLocked && <span className="text-xs text-muted-foreground">(Required for this contract)</span>}
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => !isEmailLocked && setEmail(e.target.value)}
                        required
                        readOnly={isEmailLocked}
                        className={`w-full px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${isEmailLocked ? 'bg-muted/20 cursor-not-allowed' : ''}`}
                        placeholder="Enter your email"
                    />
                    {isEmailLocked && (
                        <p className="text-xs text-muted-foreground mt-1">
                            This contract must be signed with the email address it was sent to.
                        </p>
                    )}
                </div>
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-foreground text-background px-10 py-4 rounded-xl text-lg font-bold hover:opacity-90 transition-all shadow-xl disabled:opacity-50"
                >
                    {loading ? 'Sending...' : 'Send Verification Link'}
                </button>
            </form>
        )
    }

    if (step === 'otp') {
        return (
            <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-green-800 mb-2">
                        ✉️ We've sent a verification link to <strong>{email}</strong>
                    </p>
                    <p className="text-xs text-green-700">
                        Please check your email and click the link to verify your email address and continue signing.
                    </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        After clicking the link in your email, you'll be redirected back here to complete the signature.
                    </p>
                </div>
                {otpAttempts >= 2 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                        <p className="font-medium mb-1">Haven't received the email?</p>
                        <p>Please check your spam folder. The email is sent to the address this contract was sent to.</p>
                    </div>
                )}
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => handleSendOTP()}
                        disabled={loading}
                        className="flex-1 bg-foreground text-background px-6 py-3 rounded-lg text-sm font-bold hover:opacity-90 disabled:opacity-50"
                    >
                        Resend Link
                    </button>
                    <button
                        type="button"
                        onClick={() => setStep('email')}
                        className="flex-1 border border-muted px-6 py-3 rounded-lg text-sm font-medium hover:bg-muted/10"
                    >
                        ← Change Email
                    </button>
                </div>
            </div>
        )
    }


    // step === 'sign'
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-800">
                    ✓ Email verified: <strong>{email}</strong>
                </p>
            </div>
            <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name
                </label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your full name"
                />
            </div>
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-foreground text-background px-10 py-4 rounded-xl text-lg font-bold hover:opacity-90 transition-all shadow-xl disabled:opacity-50"
            >
                {loading ? 'Signing...' : 'Sign and Accept Agreement'}
            </button>
        </form>
    )
}
