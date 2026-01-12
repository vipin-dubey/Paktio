'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import QRCode from 'qrcode'

export default function MFAActivation() {
    const [step, setStep] = useState(1)
    const [factorId, setFactorId] = useState('')
    const [qrCodeUrl, setQrCodeUrl] = useState('')
    const [secret, setSecret] = useState('')
    const [error, setError] = useState('')
    const [verificationCode, setVerificationCode] = useState('')

    const supabase = createClient()

    const startEnrollment = useCallback(async () => {
        setError('')
        const { data, error } = await supabase.auth.mfa.enroll({
            factorType: 'totp',
        })

        if (error) {
            setError(error.message)
            return
        }

        setFactorId(data.id)
        setSecret(data.totp.secret)

        try {
            const url = await QRCode.toDataURL(data.totp.uri)
            setQrCodeUrl(url)
            setStep(2)
        } catch (err) {
            setError('Failed to generate QR code')
        }
    }, [supabase])

    const verifyCode = async () => {
        setError('')

        // 1. Create a challenge
        const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
            factorId,
        })

        if (challengeError) {
            setError(challengeError.message)
            return
        }

        // 2. Verify the challenge
        const { data, error: verifyError } = await supabase.auth.mfa.verify({
            factorId,
            challengeId: challenge.id,
            code: verificationCode,
        })

        if (verifyError) {
            setError(verifyError.message)
            return
        }

        setStep(3)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const val = e.target.value
        if (!/^\d*$/.test(val)) return

        const currentCode = verificationCode.split('')
        currentCode[index] = val
        const newCode = currentCode.join('')

        setVerificationCode(newCode)

        // Auto-focus next input
        if (val && index < 5) {
            const nextInput = document.getElementById(`digit-${index + 1}`)
            nextInput?.focus()
        }
    }

    // Helper to sync from the separated inputs to the state string
    const getDigit = (index: number) => {
        return verificationCode[index] || ''
    }

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-muted shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Enable Multi-Factor Auth</h2>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                    {error}
                </div>
            )}

            {step === 1 && (
                <div className="space-y-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Secure your Paktio account with an authenticator app (e.g. Google Authenticator, Authy).
                    </p>
                    <div className="aspect-square bg-muted flex items-center justify-center rounded-xl font-mono text-xs overflow-hidden">
                        <div className="text-center p-4">
                            Click below to generate your unique QR code
                        </div>
                    </div>
                    <button
                        onClick={startEnrollment}
                        className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:opacity-90 transition-all"
                    >
                        Start Setup
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6">
                    <p className="text-sm text-muted-foreground mb-4">Scan this code with your authenticator app.</p>

                    <div className="flex justify-center mb-4">
                        {qrCodeUrl && <img src={qrCodeUrl} alt="MFA QR Code" className="w-48 h-48" />}
                    </div>

                    <p className="text-xs text-center text-muted-foreground mb-4 font-mono select-all">
                        Secret: {secret}
                    </p>

                    <p className="text-sm text-muted-foreground mb-4">Enter the 6-digit code from your app.</p>
                    <div className="flex gap-2 justify-center">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                            <input
                                key={i}
                                id={`digit-${i}`}
                                type="text"
                                maxLength={1}
                                value={getDigit(i)}
                                onChange={(e) => handleInputChange(e, i)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Backspace' && !getDigit(i) && i > 0) {
                                        document.getElementById(`digit-${i - 1}`)?.focus()
                                    }
                                }}
                                className="w-12 h-12 text-center border border-muted rounded-lg font-bold text-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                            />
                        ))}
                    </div>
                    <button
                        disabled={verificationCode.length !== 6}
                        onClick={verifyCode}
                        className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Verify & Activate
                    </button>
                    <button
                        onClick={() => setStep(1)}
                        className="w-full text-sm text-muted-foreground hover:text-foreground mt-2"
                    >
                        Cancel
                    </button>
                </div>
            )}

            {step === 3 && (
                <div className="text-center space-y-4 py-8">
                    <div className="text-4xl text-green-500">✓</div>
                    <h3 className="font-bold">MFA Activated</h3>
                    <p className="text-sm text-muted-foreground">Your account is now more secure.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-muted text-foreground px-4 py-2 rounded-lg text-sm"
                    >
                        Done
                    </button>
                </div>
            )}
        </div>
    )
}
