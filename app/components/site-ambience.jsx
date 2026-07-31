'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function SiteAmbience() {
       const pathname = usePathname()
    const audioRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)

       const showToggle = pathname !== '/'
    

    const playAmbience = useCallback(async function playAmbience() {
        if (!audioRef.current) return
        if (isPlaying) return

        try {
            await audioRef.current.play()
            setIsPlaying(true)
        } catch (error) {
            console.error(error)
        }
    }, [isPlaying])

    async function toggleAmbience() {
        if (!audioRef.current) return

        if (isPlaying) {
            audioRef.current.pause()
            setIsPlaying(false)
            return
        }

        await playAmbience()
    }

    useEffect(() => {
        window.addEventListener('start-ambience', playAmbience)

        return () => {
            window.removeEventListener('start-ambience', playAmbience)
        }
    }, [playAmbience])

    return (
       <>
            <audio ref={audioRef} src="/ambience.mp3" loop preload="auto" />

            {showToggle && (
                <button
                    type="button"
                    onClick={toggleAmbience}
                    className="fixed bottom-4 left-4 z-40 cursor-pointer rounded-lg border border-[#FFD700] bg-[#301934]/90 px-3 py-2 font-eagle text-sm text-[#FFD700] shadow-2xl"
                >
                    {isPlaying ? 'Sound On' : 'Sound Off'}
                </button>
            )}
        </>
    )
}
