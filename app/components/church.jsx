"use client";

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaChevronLeft } from "react-icons/fa";

export default function ChurchPage() {
  const router = useRouter();
  const [isEntering, setIsEntering] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsEntering(false);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  function handleConfessionalClick() {
    setIsLeaving(true);
    setTimeout(() => {
      router.push("/confession");
    }, 1000);
  }

   function handleArchiveClick() {
    setIsLeaving(true);
    setTimeout(() => {
      router.push("/archive");
    }, 1000);
  }

    function handleExit() {
         setIsLeaving(true)
        setTimeout(() => {
            router.push('/')
        }, 1000)

    }

    return (
        <div className="relative font-eagle text-[#FFD700] h-screen overflow-hidden bg-[url('/church_nave.png')] bg-cover bg-center">
               <button
                                     onClick={handleExit} 
                                     className='mt-5 flex flex-inline items-center gap-2 opacity-[0.5] hover:opacity-[1] absolute top-4 left-4 p-2 px-4 border rounded-full bg-[#301934] text-xl cursor-pointer transition hover:-translate-y-1 duration-1000'>
                                       <FaChevronLeft/> Leave Mass</button>
          <button
    type="button"
    aria-label="Enter the confessional"
    onClick={handleConfessionalClick}
    className="absolute left-[71%] top-[55%] h-24 w-24 cursor-pointer rounded-full border border-white/60 bg-white/30 shadow-[0_0_30px_rgba(255,255,255,0.8)] transition hover:scale-110 hover:bg-white/50 hover:shadow-[0_0_30px_rgba(255,255,255,1)] duration-1000 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD700]"
/>
   <button
        type="button"
        aria-label="Another location"
        onClick={handleArchiveClick}
        className="absolute left-[25%] top-[50%] h-24 w-24 cursor-pointer rounded-full border border-white/60 bg-white/30 shadow-[0_0_30px_rgba(255,255,255,0.8)] transition hover:scale-110 hover:bg-white/50 hover:shadow-[0_0_30px_rgba(255,255,255,1)] duration-1000 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD700]"
      />
            <div
                className={`pointer-events-none fixed inset-0 z-50 bg-black transition-opacity duration-[1500ms] ${
                    isEntering || isLeaving ? 'opacity-100' : 'opacity-0'
                }`}
            />
        </div>
    )
}