'use client'

import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'

export default function ChatSupport() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-primary text-primary-foreground p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
                >
                    <MessageCircle className="w-6 h-6" />
                </button>
            ) : (
                <div className="w-80 h-96 bg-white border border-muted rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
                    <div className="p-4 bg-muted/5 border-b border-muted flex justify-between items-center">
                        <div>
                            <p className="text-sm font-bold">Paktio Support</p>
                            <p className="text-[10px] text-primary uppercase font-black tracking-widest">Always Online</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 p-4 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="p-4 bg-primary/10 rounded-full">
                            <MessageCircle className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">How can we help today?</p>
                            <p className="text-xs text-muted-foreground mt-2">Our legal engineering team is ready to assist you.</p>
                        </div>
                        <button className="w-full bg-foreground text-background py-2 rounded-lg text-sm font-bold hover:opacity-90">
                            Start Chat
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
