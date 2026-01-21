'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle2, X } from 'lucide-react'

interface RegisterInterestFormProps {
    dict: any
    onClose?: () => void
}

export function RegisterInterestForm({ dict, onClose }: RegisterInterestFormProps) {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const subject = encodeURIComponent('Paktio Interest Registration')
        const body = encodeURIComponent(`Email: ${email}\n\nMessage:\n${message}`)
        window.location.href = `mailto:support@paktio.com?subject=${subject}&body=${body}`

        setIsSubmitted(true)
    }

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-background border border-muted/50 p-8 rounded-2xl shadow-2xl text-center space-y-4 max-w-md w-full relative"
            >
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
                <div className="flex justify-center">
                    <CheckCircle2 className="w-16 h-16 text-primary" />
                </div>
                <h3 className="text-2xl font-black tracking-tight uppercase">{dict.marketing.interestForm.success}</h3>
                <p className="text-muted-foreground italic">
                    {dict.marketing.interestForm.description}
                </p>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background border border-muted/50 p-8 rounded-2xl shadow-2xl max-w-md w-full relative text-left"
        >
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            )}
            <div className="space-y-6">
                <div>
                    <h3 className="text-2xl font-black tracking-tighter uppercase">{dict.marketing.interestForm.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 italic">
                        {dict.marketing.interestForm.description}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-primary">
                            {dict.marketing.interestForm.email}
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-muted/30 border border-muted focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 outline-none transition-all font-medium"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="message" className="text-xs font-black uppercase tracking-widest text-primary">
                            {dict.marketing.interestForm.message}
                        </label>
                        <textarea
                            id="message"
                            required
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            className="w-full bg-muted/30 border border-muted focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 outline-none transition-all font-medium resize-none"
                            placeholder={dict.marketing.interestForm.placeholder}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-foreground text-background py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg text-lg"
                    >
                        <Send className="w-5 h-5" />
                        {dict.marketing.interestForm.send}
                    </button>
                </form>
            </div>
        </motion.div>
    )
}
