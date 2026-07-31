"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "../archive/book.module.css";

export default function Archive() {
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [turning, setTurning] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const pageTurnSound = useRef(null);

  const router = useRouter();

  useEffect(() => {
    loadConfessions();
  }, []);

  useEffect(() => {
    pageTurnSound.current = new Audio("/page-turn.mp3");
    pageTurnSound.current.volume = 0.6;
  }, []);

  async function loadConfessions() {
    try {
      const res = await fetch("http://10.151.0.93/confessions", {
        cache: "no-store",
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      // Oldest first
      setConfessions(data.sort((a, b) => a.id - b.id));
    } catch {
      setError("The Book of Confessions could not be opened.");
    } finally {
      setLoading(false);
    }
  }
  function playPageTurnSound() {
    if (!pageTurnSound.current) return;

    pageTurnSound.current.currentTime = 0;
    pageTurnSound.current.play().catch(() => {});
  }

  function nextPage() {
    if (turning || page >= confessions.length - 1) return;

    setTurning(true);

    playPageTurnSound();

    setTimeout(() => {
      setPage((p) => p + 1);
    }, 350);

    setTimeout(() => {
      setTurning(false);
    }, 900);
  }

  function previousPage() {
    if (turning || page === 0) return;

    setTurning(true);

    playPageTurnSound();

    setTimeout(() => {
      setPage((p) => p - 1);
    }, 350);

    setTimeout(() => {
      setTurning(false);
    }, 900);
  }

  async function absolve(id) {
    if (!confirm("Strike this confession from the Book?")) return;

    setDeleting(true);

    try {
      const res = await fetch(`http://10.151.0.93/confessions/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      const updated = confessions.filter((c) => c.id !== id);

      setConfessions(updated);

      if (page >= updated.length && updated.length > 0) {
        setPage(updated.length - 1);
      }
    } catch {
      alert("The confession resisted absolution.");
    } finally {
      setDeleting(false);
    }
  }

  const confession = confessions[page];

  return (
    <main className="min-h-screen bg-[#17100b] flex items-center justify-center p-8 overflow-hidden">
      {/* candlelight */}
      <div
        className="
          absolute
          inset-0
          pointer-events-none
          bg-[radial-gradient(circle_at_center,rgba(255,210,120,0.18),transparent_55%)]
        "
      />

      {loading && (
        <h1 className="text-4xl text-amber-200 font-eagle">
          Opening the sacred ledger...
        </h1>
      )}

      {error && <h1 className="text-4xl text-red-300 font-eagle">{error}</h1>}

      {!loading && confession && (
        <>
          <div className={styles.scene}>
            <div className={styles.book}>
              <div className={styles.leftPage}>
                <h1
                  className="
                    font-eagle
                    text-5xl
                    text-center
                    pt-16
                    text-[#5d3318]
                  "
                >
                  Book of Confessions
                </h1>

                <div className="text-center text-7xl text-[#7a4c28] mt-12">
                  ❦
                </div>

                <p className="text-center italic text-xl mt-12">
                  Page {page + 1}
                </p>

                <p className="text-center mt-4 text-sm">
                  Of {confessions.length} recorded confessions
                </p>
              </div>

              {/* spine */}
              <div
                className="
                  absolute
                  left-1/2
                  top-0
                  h-full
                  w-6
                  -translate-x-1/2
                  rounded-full
                  bg-[#2f1c11]
                  shadow-inner
                "
              />

              <div
                className={`
                  ${styles.rightPage}
                `}
              />

              <div
                className={`
                  ${styles.rightPage}
                  ${turning ? styles.turn : ""}
                  ${deleting ? styles.fade : ""}
                `}
              >
                <div className="h-full flex flex-col">
                  <h2 className="font-eagle text-4xl mb-6 text-[#5d3318]">
                    Confession
                  </h2>

                  <p className="italic text-xl leading-9">
                    “{confession.confession}”
                  </p>

                  <hr className="my-8 border-amber-700" />

                  <h2 className="font-eagle text-4xl mb-4 text-[#5d3318]">
                    Penance
                  </h2>

                  <p className="text-xl leading-9 flex-grow">
                    {confession.pennance}
                  </p>

                  <button
                    onClick={() => absolve(confession.id)}
                    className="
                      mt-8
                      rounded
                      bg-[#7d2e17]
                      px-5
                      py-3
                      text-amber-100
                      hover:bg-[#9d3b1e]
                    "
                  >
                    Strike from the Record
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 flex items-center gap-8">
            <button
              onClick={() => router.push("/church")}
              className="
                rounded
                bg-[#4c2b18]
                px-6
                py-3
                text-amber-100
                hover:bg-[#6b3d22]
              "
            >
              ◀ Back to Church
            </button>
            <button
              onClick={previousPage}
              disabled={page === 0}
              className="
                rounded
                bg-[#4c2b18]
                px-6
                py-3
                text-amber-100
                disabled:opacity-30
              "
            >
              ◀ Previous
            </button>

            <div className="font-eagle text-3xl text-amber-200">
              {page + 1} / {confessions.length}
            </div>

            <button
              onClick={nextPage}
              disabled={page === confessions.length - 1}
              className="
                rounded
                bg-[#4c2b18]
                px-6
                py-3
                text-amber-100
                disabled:opacity-30
              "
            >
              Next ▶
            </button>
          </div>
        </>
      )}
    </main>
  );
}
