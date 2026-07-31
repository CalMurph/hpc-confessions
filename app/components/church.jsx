'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ChurchPage() {
    const router = useRouter()
    const [isEntering, setIsEntering] = useState(true)
    const [isLeaving, setIsLeaving] = useState(false)

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setIsEntering(false)
        })

        return () => cancelAnimationFrame(frame)
    }, [])

    function handleConfessionalClick() {
        setIsLeaving(true)
        setTimeout(() => {
            router.push('/confession')
        }, 1000)
    }

    return (
        <div className="relative font-eagle h-screen overflow-hidden bg-[url('/church_nave.png')] bg-cover bg-center">
          <button
    type="button"
    aria-label="Enter the confessional"
    onClick={handleConfessionalClick}
    className="absolute left-[71%] top-[55%] h-24 w-24 cursor-pointer rounded-full border border-white/60 bg-white/30 shadow-[0_0_30px_rgba(255,255,255,0.8)] transition hover:scale-110 hover:bg-white/50 hover:shadow-[0_0_30px_rgba(255,255,255,1)] duration-1000 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD700]"
/>
            <div
                className={`pointer-events-none fixed inset-0 z-50 bg-black transition-opacity duration-[1500ms] ${
                    isEntering || isLeaving ? 'opacity-100' : 'opacity-0'
                }`}
            />
        </div>
    )
}
