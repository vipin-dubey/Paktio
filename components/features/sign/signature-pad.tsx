'use client'

import { useRef, useState, useEffect } from 'react'
import { Eraser, PenTool } from 'lucide-react'

interface SignaturePadProps {
    onSave: (signatureDataUrl: string) => void
    onClear: () => void
}

export function SignaturePad({ onSave, onClear }: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [isEmpty, setIsEmpty] = useState(true)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set high DPI support
        const dpr = window.devicePixelRatio || 1
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        ctx.scale(dpr, dpr)

        // Base styles
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 2

        // Event listeners for resize
        const handleResize = () => {
            const tempContent = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const newRect = canvas.getBoundingClientRect()
            canvas.width = newRect.width * dpr
            canvas.height = newRect.height * dpr
            ctx.scale(dpr, dpr)
            ctx.putImageData(tempContent, 0, 0)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true)
        setIsEmpty(false)
        draw(e)
    }

    const stopDrawing = () => {
        setIsDrawing(false)
        if (canvasRef.current) {
            onSave(canvasRef.current.toDataURL('image/png'))
        }
    }

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return

        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!canvas || !ctx) return

        const rect = canvas.getBoundingClientRect()
        let x, y

        if ('touches' in e) {
            x = e.touches[0].clientX - rect.left
            y = e.touches[0].clientY - rect.top
        } else {
            x = e.nativeEvent.offsetX
            y = e.nativeEvent.offsetY
        }

        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(x, y)
    }

    const clear = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!canvas || !ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.beginPath()
        setIsEmpty(true)
        onClear()
    }

    return (
        <div className="space-y-4">
            <div className="relative group">
                <div className="absolute top-4 left-4 flex items-center gap-2 text-muted-foreground/40 pointer-events-none group-focus-within:opacity-0 transition-opacity">
                    <PenTool className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Sign here with finger or mouse</span>
                </div>

                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseMove={draw}
                    onMouseOut={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchEnd={stopDrawing}
                    onTouchMove={draw}
                    className="w-full h-48 border-2 border-dashed border-muted rounded-xl bg-white cursor-crosshair touch-none shadow-inner transition-colors focus-within:border-primary/50"
                />

                <button
                    type="button"
                    onClick={clear}
                    className="absolute bottom-4 right-4 text-xs h-8 px-3 flex items-center gap-1.5 text-muted-foreground hover:text-destructive bg-white/50 hover:bg-white rounded-lg transition-all border border-transparent hover:border-muted shadow-sm"
                >
                    <Eraser className="w-3.5 h-3.5" />
                    Clear Signature
                </button>
            </div>

            {isEmpty && (
                <p className="text-[10px] text-amber-600 font-medium animate-pulse text-center">
                    Please provide your signature to proceed
                </p>
            )}
        </div>
    )
}
