"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaCross } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa";

import verses from "./verses.json";

const CONTENT_FADE_MS = 700;
const PAGE_FADE_MS = 2000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function ConfessionPage() {
  const router = useRouter();

  const [confession, setConfession] = useState("");
  const [isEntering, setIsEntering] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [confessed, setConfessed] = useState(false);
  const [penance, setPenance] = useState("");
  const [quote, setQuote] = useState("");
  const [showQuote, setShowQuote] = useState(true);

  const getSacredQuote = useCallback(async function getSacredQuote() {
    try {
      const verse = verses[Math.floor(Math.random() * verses.length)];

      setQuote(
        `${verse.text} - ${verse.bookname} ${verse.chapter}:${verse.verse}`,
      );
    } catch (error) {
      console.error(error);
      setQuote("The truth waits in silence.");
    }
  }, []);

  const refreshQuote = useCallback(
    async function refreshQuote() {
      setShowQuote(false);
      await sleep(CONTENT_FADE_MS);
      await getSacredQuote();
      setShowQuote(true);
    },
    [getSacredQuote],
  );

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsEntering(false);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!confessed || penance) return;

    const interval = setInterval(() => {
      refreshQuote();
    }, 10000);

    return () => clearInterval(interval);
  }, [confessed, penance, refreshQuote]);

  async function handleRepent() {
    setIsLeaving(true);
    await sleep(PAGE_FADE_MS);
    router.push("/church");
  }

  async function handleConfessionalClick() {
    if (isSubmitting) return;

    setIsSubmitting(true);
    const payload = {
      text: confession,
    };

    const penanceRequest = fetch("http://10.151.0.93:81/confessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((res) => res.json());

    setShowContent(false);
    await sleep(CONTENT_FADE_MS);
    setConfessed(true);
    refreshQuote();
    setShowContent(true);

    try {
      const data = await penanceRequest;

      console.log(data);
      setShowContent(false);
      await sleep(CONTENT_FADE_MS);
      setPenance(data.pennance || data.penance || "No penance received.");
      setShowContent(true);
    } catch (error) {
      console.error(error);
      setShowContent(false);
      await sleep(CONTENT_FADE_MS);
      setPenance("The penance could not be received.");
      setShowContent(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative font-eagle h-screen text-[#FFD700] overflow-hidden bg-[url('/interior.png')] bg-cover bg-center">
      <button
        onClick={handleRepent}
        className="mt-5 flex flex-inline items-center gap-2 opacity-[0.5] hover:opacity-[1] absolute top-4 left-4 p-2 px-4 border rounded-full bg-[#301934] text-xl cursor-pointer transition hover:-translate-y-1 duration-1000"
      >
        <FaChevronLeft /> Return to Mass
      </button>
      <div className="h-screen flex items-center justify-center">
        <div
          className={`transition-opacity duration-[700ms] ${showContent ? "opacity-100" : "opacity-0"}`}
        >
          {!confessed && (
            <div className="flex flex-col w-90 mt-24">
              <textarea
                value={confession}
                placeholder="Share your confession here, child..."
                onChange={(event) => setConfession(event.target.value)}
                className="h-40 rounded-lg w-90 border border-[#FFD700] border-2 bg-[#210B05]/95 p-2 drop-shadow-2xl shadow-2xl focus:outline-none"
              />

              <button
                onClick={handleConfessionalClick}
                disabled={isSubmitting}
                className="self-end mt-6 p-1 border bg-[#301934] transition hover:-translate-y-1 shadow-2xl drop-shadow-2xl ease-in-ease-out duration-1200 cursor-pointer border-[#FFD700] text-[#FFD700] p-1 rounded-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                Confess
              </button>
            </div>
          )}

          {confessed && !penance && (
            <>
              <div className="flex justify-center backdrop-blur-xs rounded-lg items-center w-250">
                <h2
                  className={`flex items-center h-full text-center text-5xl p-2 drop-shadow-2xl text-[#D4D2D2] shadow-2xl transition-opacity duration-[700ms] focus:outline-none ${
                    showQuote ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {quote || "Seeking a sacred word..."}
                </h2>
              </div>

              <div className="absolute bottom-18 left-0 right-0 flex justify-center">
                <h2 className="text-center text-2xl p-2 drop-shadow-2xl text-[#D4D2D2] shadow-2xl focus:outline-none">
                  The Priest is thinking of your penance ...
                </h2>
              </div>
            </>
          )}

          {penance && (
            <div className="flex justify-center items-center backdrop-blur-xs rounded-lg flex-col w-5xl">
              <h2 className="flex items-center h-full  text-center text-5xl p-2 drop-shadow-2xl rounded-full text-[#D4D2D2] shadow-2xl focus:outline-none">
                {penance || "Seeking a sacred word..."}
              </h2>

              <button
                onClick={handleRepent}
                className="mt-5 p-2 px-4 flex flex-inline gap-2 items-center border rounded-full bg-[#301934] text-3xl cursor-pointer transition hover:-translate-y-1 duration-1000"
              >
                Repent <FaCross />{" "}
              </button>
            </div>
          )}
        </div>
      </div>
      <div
        className={`pointer-events-none fixed inset-0 z-50 bg-black transition-opacity duration-[2500ms] ${
          isEntering || isLeaving ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
