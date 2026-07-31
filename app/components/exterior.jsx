'use client'

import { useRouter } from "next/navigation"
import { useRef, useState } from "react"

export default function ChurchPage() {
    const router = useRouter()
    const [isLeaving, setIsLeaving] = useState(false)
        const audioRef = useRef(null)

   

    function handleConfessionalClick() {
        setIsLeaving(true)
        window.dispatchEvent(new Event('start-ambience'))
        
        if (!audioRef.current) {
            audioRef.current = new Audio('/openDoor.mp3')
        }

        audioRef.current.play().catch(console.error)

        setTimeout(() => {
            
            router.push('/church')
        }, 1000)
    }

    return (
        <div className="flex justify-center font-eagle h-screen overflow-hidden bg-[url('/exterior1.png')] bg-cover bg-center">
            <div className="flex justify-center items-center mt-110">
            <button
                type="button"
                
                onClick={handleConfessionalClick}
                className="flex justify-center border-[#FFD700] text-[#FFD700] px-20 py-4 bg-[#301934] text-2xl items-center cursor-pointer rounded-full border transition hover:-translate-y-3 duration-1700"
            >Enter</button>
            </div>
            <div
                className={`pointer-events-none fixed inset-0 z-50 bg-black transition-opacity duration-[1500ms] ${
                    isLeaving ? 'opacity-100' : 'opacity-0'
                }`}
            />
        </div>
    )
}
