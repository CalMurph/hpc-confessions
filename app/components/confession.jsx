'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ConfessionPage() {
    const router = useRouter()

    const [confession, setConfession] = useState('')
    const [isEntering, setIsEntering] = useState(true)
    const [isLeaving] = useState(false)

    const [confessed, setConfessed] = useState(false)
    const [penance, setPenance] = useState('')
    const [quote, setQuote] = useState('')


    



    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setIsEntering(false)
        })

        return () => cancelAnimationFrame(frame)
    }, [])

    useEffect(() => {
        async function getSacredQuote() {
            try {
                const res = await fetch("https://labs.bible.org/api/?passage=random&type=json&formatting=plain")
                const data = await res.json()
                const verse = data[0]

                setQuote(`${verse.text} - ${verse.bookname} ${verse.chapter}:${verse.verse}`)
            } catch (error) {
                console.error(error)
                setQuote('The truth waits in silence.')
            }
        }

        getSacredQuote()
    }, [])

    function handleRepent() {
        router.push("/church")
    }

    async function handleConfessionalClick() {

        setConfessed(true);

        const payload = {
            "text": confession
        }
        try {
            const res = await fetch("http://10.151.0.93/confessions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })

            const data = await res.json()

            console.log(data)
            setPenance(data.pennance || data.penance)


        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="relative font-eagle h-screen text-[#FFD700] overflow-hidden bg-[url('/interior.png')] bg-cover bg-center">
            <div className="h-screen flex items-center justify-center">

                {!confessed && (

                    <div className="flex flex-col h-w-90 mt-24">



                        <textarea
                            value={confession}
                            placeholder="Share your confession here, child..."
                            onChange={(event) => setConfession(event.target.value)}
                            className="h-40 rounded-lg w-90 border border-[#FFD700] border-2 bg-[#210B05]/95 p-2 drop-shadow-2xl shadow-2xl focus:outline-none"
                        />

                        <button
                            onClick={handleConfessionalClick}
                            className="self-end mt-6 border bg-[#301934] transition hover:-translate-y-1 shadow-2xl drop-shadow-2xl ease-in-ease-out duration-1200 cursor-pointer border-[#FFD700] text-[#FFD700] p-1 rounded-lg">
                            Confess
                        </button>
                    </div>

                )}

                {confessed && !penance && (

                     <div className="flex justify-center backdrop-blur-xs items-center w-150">



                        <h2
                            
                         
                        
                            className="flex items-center  h-full text-center text-5xl p-2 drop-shadow-2xl text-[#D4D2D2] shadow-2xl focus:outline-none"
                        >{quote || 'Seeking a sacred word...'}</h2>

                       
                    </div>


                )}

                 {penance && (

                    <div className="flex justify-center items-center backdrop-blur-xs rounded-lg flex-col w-5xl">



                        <h2
                            
                         
                        
                            className="flex items-center h-full  text-center text-5xl p-2 drop-shadow-2xl rounded-full text-[#D4D2D2] shadow-2xl focus:outline-none"
                        >{penance || 'Seeking a sacred word...'}</h2>

                         <button
                         onClick={handleRepent} 
                         className='mt-5 p-2 border rounded-full bg-[#301934] cursor-pointer transition hover:-translate-y-1 duration-1000'>
                            Repent</button>

                       

                       
                    </div>
                    
                        
                    )



                    }

            </div>
            <div
                className={`pointer-events-none fixed inset-0 z-50 bg-black transition-opacity duration-[2000ms] ${isEntering || isLeaving ? 'opacity-100' : 'opacity-0'
                    }`}

                   


            />
        </div>
    )
}
