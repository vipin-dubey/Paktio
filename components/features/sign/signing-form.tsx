'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { submitSignature } from '@/app/(regional)/sign/actions'
import { validateAndSendOTP } from '@/app/(regional)/sign/[contractId]/actions'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { SignaturePad } from './signature-pad'

import type { Signature } from '@/lib/types/database'

interface SigningFormProps {
    contractId: string
    intendedEmail?: string
    user?: User | null
    existingSignature?: Signature | null
}

export default function SigningForm({ contractId, intendedEmail, user: initialUser, existingSignature }: SigningFormProps) {
    const [user, setUser] = useState<User | null>(initialUser || null)
    // Check for client-side session updates (fixes magic link redirect loop)
    useEffect(() => {
        const supabase = createClient()

        // 1. Check current session immediately
        supabase.auth.getUser().then(({ data }) => {
            if (data?.user) {
                setUser(data.user)
            }
        })

        // 2. Listen for auth changes (e.g. after magic link processing)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(session.user)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const [step, setStep] = useState<'email' | 'otp' | 'sign'>('email')
    const [email, setEmail] = useState(intendedEmail || user?.email || '')

    // ... existing email matching logic ...

    // Signer information fields
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [ssn, setSsn] = useState('')
    const [address, setAddress] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [city, setCity] = useState('')
    const [signatureImage, setSignatureImage] = useState('')

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [otpAttempts, setOtpAttempts] = useState(0)

    // Validate that user can only sign with the intended email
    const isEmailLocked = !!intendedEmail

    // If user is already authenticated, skip email verification
    // This happens when:
    // 1. Contract owner clicks "Sign this contract" from history page (already logged in)
    // 2. External signer returns from magic link (authenticated via callback)
    useEffect(() => {
        if (user && user.email && !existingSignature) {
            // If there's an intended email, verify it matches (case-insensitive)
            if (intendedEmail && user.email.toLowerCase() === intendedEmail.toLowerCase()) {
                setStep('sign')
            } else if (!intendedEmail) {
                // No intended email means contract owner signing their own contract
                setStep('sign')
            }
        }
    }, [user, intendedEmail, existingSignature])

    const handleSendOTP = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // Server-side validation: checks if email is authorized and sends OTP to the correct email
            await validateAndSendOTP(contractId, email)

            setOtpAttempts(prev => prev + 1)
            setStep('otp')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send OTP')
        } finally {
            setLoading(false)
        }
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // Validate age
            const birthDate = new Date(dateOfBirth)
            const today = new Date()
            let age = today.getFullYear() - birthDate.getFullYear()
            const m = today.getMonth() - birthDate.getMonth()
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--
            }

            if (age < 18 || age > 110) {
                throw new Error('You must be between 18 and 110 years old to sign this contract.')
            }

            await submitSignature(contractId, {
                email,
                firstName,
                lastName,
                phoneNumber,
                dateOfBirth,
                ssn,
                address,
                postalCode,
                city,
                signatureImage
            })
            setSuccess(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit signature')
        } finally {
            setLoading(false)
        }
    }

    // Show "already signed" message only if they signed BEFORE this session (not just now)
    if (existingSignature && !success) {
        return (
            <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">You&apos;ve Already Signed This Contract</h3>
                <p className="text-muted-foreground mb-4">
                    Signed on {existingSignature?.signed_at ? new Date(existingSignature.signed_at).toLocaleString() : 'N/A'}
                </p>
                {user && (
                    <Link
                        href="/dashboard"
                        className="inline-block bg-foreground text-background px-6 py-3 rounded-lg text-sm font-bold hover:opacity-90 transition-all"
                    >
                        Return to Dashboard
                    </Link>
                )}
            </div>
        )
    }

    if (success) {
        // Show email verification badge only if user went through the magic link flow
        const wentThroughEmailVerification = intendedEmail && user?.email === intendedEmail

        return (
            <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Contract Signed Successfully! 🎉</h3>
                <p className="text-muted-foreground mb-2">Your signature has been recorded and verified.</p>
                {wentThroughEmailVerification && (
                    <p className="text-sm text-green-600 mb-4">✓ Email verified via secure link</p>
                )}
                <p className="text-sm text-muted-foreground mt-4 mb-8">You can now safely close this page.</p>

                {user && (
                    <Link
                        href="/dashboard"
                        className="inline-block bg-foreground text-background px-6 py-3 rounded-lg text-sm font-bold hover:opacity-90 transition-all"
                    >
                        Return to Dashboard
                    </Link>
                )}
            </div>
        )
    }

    if (step === 'email') {
        const isMismatch = user && intendedEmail && user.email?.toLowerCase() !== intendedEmail.toLowerCase()

        return (
            <form onSubmit={handleSendOTP} className="space-y-4">
                {isMismatch && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                        <p className="font-bold text-amber-800 text-sm mb-1">⚠️ Wrong Account</p>
                        <ul className="text-xs text-amber-700 space-y-1">
                            <li>You are logged in as: <strong>{user?.email}</strong></li>
                            <li>Contract sent to: <strong>{intendedEmail}</strong></li>
                        </ul>
                        <p className="text-xs text-amber-600 mt-2">
                            Please sign out or use the link sent to {intendedEmail}.
                        </p>
                    </div>
                )}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-800">
                        🔒 To sign this contract, we&apos;ll send a verification link to your email address.
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
                    className="w-full bg-foreground text-background px-6 py-4 rounded-xl text-sm sm:text-lg font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl disabled:opacity-50"
                >
                    {loading ? 'Sending...' : 'Verify Email'}
                </button>
            </form>
        )
    }

    if (step === 'otp') {
        return (
            <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-green-800 mb-2">
                        ✉️ We&apos;ve sent a verification link to <strong>{email}</strong>
                    </p>
                    <p className="text-xs text-green-700">
                        Please check your email and click the link to verify your email address and continue signing.
                    </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        After clicking the link in your email, you&apos;ll be redirected back here to complete the signature.
                    </p>
                </div>
                {otpAttempts >= 2 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                        <p className="font-medium mb-1">Haven&apos;t received the email?</p>
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
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-800 flex items-center justify-between sm:justify-start gap-2">
                    <span className="flex items-center gap-2">
                        <span className="sm:inline hidden">✓ Email verified:</span>
                        <strong>{email}</strong>
                    </span>
                    <span className="sm:hidden font-bold text-lg">✓</span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="firstName" className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                        First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-[#F9F9F8] border border-stone-300 rounded-xl focus:ring-1 focus:ring-primary text-sm transition-all"
                        placeholder="John"
                    />
                </div>

                <div>
                    <label htmlFor="lastName" className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                        Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-[#F9F9F8] border border-stone-300 rounded-xl focus:ring-1 focus:ring-primary text-sm transition-all"
                        placeholder="Doe"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="phoneNumber" className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-[#F9F9F8] border border-stone-300 rounded-xl focus:ring-1 focus:ring-primary text-sm transition-all"
                        placeholder="+47 123 45 678"
                    />
                </div>

                <div>
                    <label htmlFor="dateOfBirth" className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                        Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="dateOfBirth"
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        required
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                        min={new Date(new Date().setFullYear(new Date().getFullYear() - 110)).toISOString().split('T')[0]}
                        className="w-full px-4 py-3 bg-[#F9F9F8] border border-stone-300 rounded-xl focus:ring-1 focus:ring-primary text-sm transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="ssn" className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                        Social Security Number <span className="text-muted-foreground text-[8px] tracking-normal lowercase">(Optional)</span>
                    </label>
                    <input
                        id="ssn"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={ssn}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d*$/.test(val)) setSsn(val);
                        }}
                        className="w-full px-4 py-3 bg-[#F9F9F8] border border-stone-300 rounded-xl focus:ring-1 focus:ring-primary text-sm transition-all"
                        placeholder="123456789"
                    />
                </div>

                <div>
                    <label htmlFor="address" className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                        Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-[#F9F9F8] border border-stone-300 rounded-xl focus:ring-1 focus:ring-primary text-sm transition-all"
                        placeholder="Street name and number"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="postalCode" className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                        Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="postalCode"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={postalCode}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d*$/.test(val)) setPostalCode(val);
                        }}
                        required
                        className="w-full px-4 py-3 bg-[#F9F9F8] border border-stone-300 rounded-xl focus:ring-1 focus:ring-primary text-sm transition-all"
                        placeholder="0123"
                    />
                </div>

                <div>
                    <label htmlFor="city" className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                        City <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-[#F9F9F8] border border-stone-300 rounded-xl focus:ring-1 focus:ring-primary text-sm transition-all"
                        placeholder="Oslo"
                    />
                </div>
            </div>

            <div className="pt-6 border-t border-muted mt-6 flex flex-col items-center w-full">
                <div className="w-full md:max-w-md">
                    <label className="block text-sm font-semibold mb-4 text-foreground/80">
                        Finger/Mouse Signature <span className="text-red-500">*</span>
                    </label>
                    <SignaturePad
                        onSave={(data) => setSignatureImage(data)}
                        onClear={() => setSignatureImage('')}
                    />
                </div>
            </div>


            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading || !signatureImage || !firstName || !lastName || !phoneNumber || !dateOfBirth || !address || !postalCode || !city}
                className="w-full bg-foreground text-background px-6 py-4 rounded-xl text-sm sm:text-lg font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl disabled:opacity-50 active:scale-[0.98]"
            >
                {loading ? 'Signing...' : 'Sign and Accept Agreement'}
            </button>
        </form>
    )
}
