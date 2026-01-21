'use client'

import { useState } from 'react'
import { RegisterInterestForm } from './register-interest-form'
import { AnimatePresence, motion } from 'framer-motion'

export function ComingSoonCta({ dict }: { dict: any }) {
    const [showInterestForm, setShowInterestForm] = useState(false)

    return (
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
                onClick={() => setShowInterestForm(true)}
                className="bg-foreground text-background px-10 py-4 rounded-xl text-lg font-bold hover:opacity-90 transition-all shadow-xl"
            >
                {dict.marketing.hero.registerInterest}
            </button>

            <AnimatePresence>
                {showInterestForm && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-background/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowInterestForm(false)}
                            className="absolute inset-0"
                        />
                        <RegisterInterestForm
                            dict={dict}
                            onClose={() => setShowInterestForm(false)}
                        />
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
