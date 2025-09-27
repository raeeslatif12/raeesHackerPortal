import React, { useState, useEffect, useRef } from "react";
import NavBar from "./NavBar";

export default function HackingAgeCalculator() {
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [logLines, setLogLines] = useState([]);
  const [percent, setPercent] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [sealedAge, setSealedAge] = useState(null);
  const [countValue, setCountValue] = useState(0);
  const intervalRef = useRef(null);

  const messages = [
    "[0x01] initializing secure compute kernel...",
    "[0x02] mounting virtual CPU clusters...",
    "[0x03] injecting entropy to RNG...",
    "[0x04] parsing user input payload...",
    "[0x05] applying neural heuristics...",
    "[0x06] establishing satellite link (low-latency)...",
    "[0x07] verifying global timestamp ledger...",
    "[0x08] running parallel fault-tolerance checks...",
    "[0x09] swapping to quantum fallback core...",
    "[0x0A] cross-referencing with archived telemetry...",
    "[0x0B] integrity checksum OK.",
    "[0x0C] encrypting ephemeral results...",
    "[0x0D] syncing to backup node / replication...",
    "[0x0E] running final convergence routine...",
    "[0x0F] flushing caches and sealing output...",
  ];

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Enter" && !loading) handleCalculate();
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [age, loading]);

  const handleCalculate = (deep = false) => {
    if (!age) return alert("Please enter your age first!");
    setLoading(true);
    setFinished(false);
    setLogLines([]);
    setPercent(0);
    setCurrentStepIndex(0);
    setModalOpen(false);
    setSealedAge(null);
    setCountValue(0);

    let idx = 0;
    const total = messages.length;
    const baseDelay = deep ? 600 : 700;

    intervalRef.current = setInterval(() => {
      setLogLines((prev) => [...prev, messages[idx]]);
      idx++;
      setCurrentStepIndex(idx);
      setPercent(Math.min(100, Math.floor((idx / total) * 100)));

      if (idx >= total) {
        clearInterval(intervalRef.current);
        setTimeout(() => {
          const inputNum = Number(age);
          let result = Number.isFinite(inputNum) ? inputNum : 0;

          if (deep) {
            const bonus = Math.floor(
              Math.max(5, result * (0.2 + Math.random() * 1.2))
            );
            result += bonus;
          }

          result = Math.max(0, Math.floor(result));

          setLogLines((prev) => [
            ...prev,
            `>> OUTPUT >> Calculated Age (sealed): ${result}`,
            `>> SIGNATURE >> NEXUS-AGE-0xFF`,
          ]);
          setPercent(100);
          setFinished(true);
          setLoading(false);
          setSealedAge(result);
          setModalOpen(true);
          animateCount(result);
        }, 1000);
      }
    }, baseDelay);
  };

  function animateCount(target) {
    setCountValue(0);
    const dur = 1200;
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / dur);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setCountValue(Math.floor(ease * target));
      if (t < 1) requestAnimationFrame(step);
      else setCountValue(target);
    }
    requestAnimationFrame(step);
  }

  const handleClose = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setLoading(false);
    setFinished(false);
    setLogLines([]);
    setPercent(0);
    setCurrentStepIndex(0);
    setModalOpen(false);
    setSealedAge(null);
    setCountValue(0);
  };

  return (
    <>
      <NavBar />
      <div className="relative min-h-screen bg-black p-6 flex items-center justify-center">
        <div className="max-w-4xl w-full space-y-6 px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-mono text-emerald-400">
              NEXUS • AGE NODE
            </h1>
            <div className="text-sm text-emerald-200 font-mono">
              status: {loading ? (finished ? "sealed" : "running") : "idle"}
            </div>
          </div>

          <div className="bg-gray-900 border border-emerald-800 shadow-xl rounded-2xl p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-3 md:items-center mb-4">
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="flex-1 bg-transparent placeholder:emerald-600 text-emerald-200 font-mono px-4 py-3 rounded-lg border border-emerald-700/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex gap-2 md:gap-3 flex-wrap">
                <button
                  onClick={() => handleCalculate(false)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg shadow-inner transition disabled:opacity-50"
                  disabled={loading}
                >
                  START
                </button>
                <button
                  onClick={() => handleCalculate(true)}
                  className="px-4 py-2 bg-violet-500 hover:bg-violet-400 text-white font-semibold rounded-lg shadow transition disabled:opacity-50"
                  disabled={loading}
                >
                  DEEP HACK
                </button>
                <button
                  onClick={() => setAge("")}
                  className="px-3 py-2 bg-emerald-900/20 hover:bg-emerald-900/10 text-emerald-200 rounded-lg"
                >
                  CLEAR
                </button>
                <button
                  onClick={handleClose}
                  className="px-3 py-2 bg-rose-700/90 hover:bg-rose-600 text-white rounded-lg"
                >
                  CANCEL
                </button>
              </div>
            </div>

            <div className="relative mt-2 bg-black border border-emerald-800 rounded-lg p-3 text-emerald-300 font-mono">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-900 mb-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-rose-500 rounded-full"></span>
                  <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
                  <span className="w-3 h-3 bg-emerald-400 rounded-full"></span>
                  <span className="ml-3 text-emerald-200">NODE // PROCESS</span>
                </div>
                <div className="text-emerald-200">
                  uptime: 00:{String(currentStepIndex).padStart(2, "0")}
                </div>
              </div>

              <div className="h-48 overflow-y-auto pr-2 text-sm">
                {logLines.length === 0 && (
                  <div className="text-emerald-400/60">&gt; awaiting input</div>
                )}
                {logLines.map((line, i) => (
                  <div
                    key={i}
                    className={`${
                      i === logLines.length - 1 && loading
                        ? "text-yellow-300"
                        : ""
                    }`}
                  >
                    {line}
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <div className="w-full h-3 bg-emerald-900/20 rounded-md border border-emerald-800 overflow-hidden">
                  <div
                    className="h-3 bg-emerald-400/95"
                    style={{
                      width: `${percent}%`,
                      transition: "width 500ms linear",
                    }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-emerald-200">
                  <div>progress</div>
                  <div>{percent}%</div>
                </div>
              </div>
            </div>

            <div className="mt-3 text-sm text-emerald-300/60 font-mono">
              Tip: Use <span className="text-emerald-200">DEEP HACK</span> for
              amplified sealed age.
            </div>
          </div>
        </div>

        {/* Modal popup */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />
            <div className="relative max-w-md w-full bg-gray-900 border border-emerald-700 rounded-xl p-5 shadow-2xl">
              <div className="text-xs text-emerald-200 font-mono">
                NEXUS • SEALED PAYLOAD
              </div>
              <div className="mt-3 text-3xl font-mono font-bold text-emerald-300">
                {countValue}
                <span className="text-sm ml-2 text-emerald-200">
                  yrs (sealed)
                </span>
              </div>
              <div className="mt-3 text-sm text-slate-400">
                signature:{" "}
                <span className="text-emerald-300 font-mono">
                  NEXUS-AGE-0xFF
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setModalOpen(false);
                    handleCalculate(true);
                  }}
                  className="px-3 py-2 bg-violet-500 text-white rounded-lg"
                >
                  DEEP HACK AGAIN
                </button>
                <button
                  onClick={() =>
                    navigator.clipboard?.writeText(
                      String(sealedAge ?? countValue)
                    )
                  }
                  className="px-3 py-2 bg-emerald-600 text-black rounded-lg font-semibold"
                >
                  COPY
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-2 bg-emerald-900/20 text-emerald-200 rounded-lg"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
