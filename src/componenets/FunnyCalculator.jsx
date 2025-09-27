import React, { useState, useRef, useEffect } from "react";

const MatrixEffect = () => {
  useEffect(() => {
    const canvas = document.getElementById("matrixCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let rafId;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const letters = "01@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff66";
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <canvas id="matrixCanvas" className="w-full h-full block" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.00) 0%, rgba(0,0,0,0.02) 50%, rgba(255,255,255,0.00) 100%)] bg-repeat-y opacity-10"></div>
    </div>
  );
};

const HackingCalculator = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [logLines, setLogLines] = useState([]);
  const [percent, setPercent] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showFinalPopup, setShowFinalPopup] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const intervalRef = useRef(null);

  const BASE_MESSAGES = [
    "[0x01] booting secure math kernel...",
    "[0x02] loading parser modules...",
    "[0x03] injecting entropy to RNG...",
    "[0x04] validating expression tokens...",
    "[0x05] optimizing compute graph...",
    "[0x06] spinning up parallel cores...",
    "[0x07] syncing with telemetry array...",
    "[0x08] running ML sanity checks...",
    "[0x09] applying chaos mitigation...",
    "[0x0A] sealing ephemeral results...",
    "[0x0B] final integrity check...",
    "[0x0C] encrypting output payload...",
    "[0x0D] broadcasting checksum to ledger...",
    "[0x0E] flushing caches and sealing...",
    "[0x0F] operation complete.",
  ];

  const getShuffledMessages = () => {
    const arr = [...BASE_MESSAGES];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    const last = arr.find((s) => s.includes("operation complete")) || null;
    const filtered = arr.filter((s) => s !== last);
    return [...filtered, last].filter(Boolean);
  };

  const beep = (freq = 800, duration = 80) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01);
      setTimeout(() => {
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);
        o.stop(ctx.currentTime + 0.03);
        ctx.close();
      }, duration);
    } catch (e) {}
  };

  const [glitchKey, setGlitchKey] = useState(0);
  const triggerGlitch = () => setGlitchKey((k) => k + 1);

  const startCalc = () => {
    if (!input) return alert("Please enter expression first!");

    setLoading(true);
    setFinished(false);
    setShowFinalPopup(false);
    setLogLines([]);
    setPercent(0);
    setCurrentStepIndex(0);
    setFinalResult(null);

    const messages = getShuffledMessages();
    let idx = 0;
    const total = messages.length;
    intervalRef.current = setInterval(() => {
      setLogLines((prev) => [...prev, messages[idx]]);
      beep(600 + Math.random() * 600, 60);
      idx++;
      setCurrentStepIndex(idx);
      setPercent(Math.min(100, Math.floor((idx / total) * 100)));

      if (Math.random() > 0.85) triggerGlitch();

      if (idx >= total) {
        clearInterval(intervalRef.current);
        setTimeout(() => {
          //
          try {
            const real = eval(input);
            const err = Math.random() < 0.6 ? 1 : 2;
            const wrong = Math.random() < 0.5 ? real + err : real - err;
            setFinalResult(wrong);
            setLogLines((prev) => [
              ...prev,
              `>> OUTPUT >> computed payload: ${wrong}`,
            ]);
            setPercent(100);
            setFinished(true);

            triggerGlitch();
            setTimeout(() => {
              beep(1100, 160);
              setLoading(false);
              setShowFinalPopup(true);
            }, 700);
          } catch (e) {
            setFinalResult("INVALID");
            setLogLines((prev) => [...prev, `❌ ERROR: Invalid Expression`]);
            setFinished(true);
            setTimeout(() => {
              beep(400, 160);
              setLoading(false);
              setShowFinalPopup(true);
            }, 700);
          }
        }, 950);
      }
    }, 520);
  };

  const cancelProcess = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setLoading(false);
    setFinished(false);
    setLogLines([]);
    setPercent(0);
    setCurrentStepIndex(0);
    setShowFinalPopup(false);
    setFinalResult(null);
  };

  const closePopup = () => {
    setShowFinalPopup(false);
    setFinished(false);
    setLogLines([]);
    setPercent(0);
    setCurrentStepIndex(0);
    setFinalResult(null);
    setInput("");
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const buttons = [7, 8, 9, "/", 4, 5, 6, "*", 1, 2, 3, "-", 0, ".", "+", "="];

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-black text-emerald-300">
      <MatrixEffect />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent, rgba(0,0,0,0.25))] opacity-30 -z-0"></div>

      <div className="relative z-20 w-full max-w-4xl p-6">
        <div className="flex items-center justify-between mb-4 px-2">
          <h1 className="font-mono text-2xl text-emerald-300 select-none">
            ⟡ NEXUS • CALC
          </h1>
          <div className="text-sm font-mono text-slate-400">
            status:{" "}
            <span className="text-emerald-200">
              {loading ? (finished ? "finalizing" : "running") : "idle"}
            </span>
          </div>
        </div>

        {!showFinalPopup && (
          <div
            className={`mx-auto rounded-2xl border border-emerald-800 bg-[#001216cc] p-6 shadow-2xl backdrop-blur`}
          >
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-4">
              <input
                type="text"
                placeholder="Enter expression e.g. 12+3*2"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="flex-1 bg-[#001217] text-emerald-200 placeholder:emerald-500 font-mono px-4 py-3 rounded-lg border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <div className="flex gap-3">
                <button
                  onClick={startCalc}
                  disabled={loading}
                  className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg font-semibold disabled:opacity-60"
                >
                  RUN
                </button>
                <button
                  onClick={() => setInput("")}
                  disabled={loading}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg"
                >
                  CLR
                </button>
                <button
                  onClick={cancelProcess}
                  disabled={!loading}
                  className="px-4 py-3 bg-rose-700 hover:bg-rose-600 rounded-lg text-white"
                >
                  ABORT
                </button>
              </div>
            </div>

            {loading ? (
              <div className="relative bg-[#001216] border border-emerald-800 rounded-lg p-4 text-emerald-200 font-mono">
                <button
                  onClick={cancelProcess}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-rose-700 hover:bg-rose-600 text-white font-bold"
                >
                  ×
                </button>

                <div className="flex items-center justify-between pb-3 border-b border-emerald-900 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-rose-500 rounded-full" />
                    <span className="w-3 h-3 bg-amber-400 rounded-full" />
                    <span className="w-3 h-3 bg-emerald-400 rounded-full" />
                    <span className="ml-3 text-xs text-emerald-200">
                      PROC • NODE
                    </span>
                  </div>
                  <div className="text-xs text-emerald-200">
                    uptime: 00:{String(currentStepIndex).padStart(2, "0")}
                  </div>
                </div>

                <div className="h-44 overflow-y-auto pr-2">
                  {logLines.map((l, i) => (
                    <div
                      key={i}
                      className={`text-sm ${
                        i === logLines.length - 1 && !finished
                          ? "text-yellow-300"
                          : ""
                      }`}
                    >
                      {l}
                    </div>
                  ))}

                  {!finished && (
                    <div className="text-sm text-yellow-300 mt-1">
                      <span className="inline-block w-3 h-4 align-middle mr-1 animate-pulse">
                        ▌
                      </span>
                      awaiting next instruction...
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <div className="w-full h-3 bg-slate-800 rounded-md border border-slate-700 overflow-hidden">
                    <div
                      className="h-3 bg-emerald-400/90"
                      style={{
                        width: `${percent}%`,
                        transition: "width 450ms linear",
                      }}
                    />
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-400">
                  LOG STREAM • connection stable
                </div>
              </div>
            ) : (
              <>
                <div className="bg-[#001117] rounded-lg p-3 text-right text-2xl font-mono mb-4 h-20 flex items-center justify-end text-emerald-300 border border-slate-700">
                  {input || "0"}
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {buttons.map((btn) => (
                    <button
                      key={btn}
                      onClick={() => {
                        if (btn === "=") startCalc();
                        else setInput((p) => p + btn.toString());
                      }}
                      className={`${
                        btn === "="
                          ? "bg-emerald-500 text-black"
                          : "bg-[#072023] text-emerald-200"
                      } py-3 rounded-lg font-mono text-xl shadow-inner hover:scale-[1.02] transition`}
                    >
                      {btn}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setInput("");
                      setFinalResult(null);
                    }}
                    className="col-span-4 bg-rose-700 text-white py-3 rounded-lg font-mono"
                  >
                    CLEAR
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {showFinalPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6">
            <div className="relative w-full max-w-4xl bg-[#001217] border border-emerald-700 rounded-2xl p-8 animate-finalPopup">
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center rounded-full bg-rose-700 hover:bg-rose-600 text-white text-2xl font-bold"
              >
                ×
              </button>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-rose-500 rounded-full" />
                  <div className="w-4 h-4 bg-amber-400 rounded-full" />
                  <div className="w-4 h-4 bg-emerald-400 rounded-full" />
                  <div className="ml-4 text-sm text-emerald-300 font-mono">
                    NEXUS • PAYLOAD
                  </div>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  secure session • encrypted
                </div>
              </div>

              <div className="text-center py-12">
                <div className="text-sm text-emerald-200 font-mono mb-2">
                  FINAL PAYLOAD
                </div>

                {/* glitching big number */}
                <div className="relative inline-block">
                  <div
                    className={`big-result text-8xl sm:text-9xl font-extrabold tracking-tight text-emerald-300 font-mono`}
                    data-key={glitchKey}
                  >
                    {finalResult === "INVALID" ? "INVALID" : finalResult}
                  </div>
                  {/* layered glitch copies */}
                  <div className="big-result-copy left-copy">{finalResult}</div>
                  <div className="big-result-copy right-copy">
                    {finalResult}
                  </div>
                </div>

                <div className="mt-4 text-lg text-amber-300 font-semibold">
                  Result (sealed)
                </div>

                <div className="mt-6 text-xs text-slate-400 font-mono">
                  signature:{" "}
                  <span className="text-emerald-200">NEXUS-CALC-0x01</span> •
                  timestamp:{" "}
                  <span className="text-emerald-200">
                    {new Date().toLocaleString()}
                  </span>
                </div>

                <div className="mt-8 flex gap-3 justify-center">
                  <button
                    onClick={() =>
                      navigator.clipboard
                        ?.writeText(String(finalResult))
                        .catch(() => {})
                    }
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-black rounded-lg font-semibold"
                  >
                    COPY
                  </button>
                  <button
                    onClick={closePopup}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
                  >
                    DONE
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Inline CSS for glitch / shake */}
      <style>{`
        @keyframes glitch-anim {
          0% { transform: translate(0,0); opacity:1; }
          20% { transform: translate(-6px, -2px) skew(-2deg); opacity:0.95;}
          40% { transform: translate(4px, 2px) skew(2deg); opacity:0.9;}
          60% { transform: translate(-2px, 1px) skew(-1deg); opacity:0.95;}
          80% { transform: translate(2px, -1px) skew(1deg); opacity:0.98;}
          100% { transform: translate(0,0); opacity:1;}
        }
        .big-result { position: relative; z-index: 3; text-shadow: 0 6px 30px rgba(0,255,150,0.06); }
        .big-result-copy { position: absolute; top:0; left:0; right:0; bottom:0; z-index:2; pointer-events:none; font-size: inherit; font-weight: inherit; display:flex; align-items:center; justify-content:center; opacity:0; }
        .big-result-copy.left-copy {
          color: rgba(255,0,60,0.65);
          clip-path: inset(0 60% 0 0);
          transform: translate(-4px, -2px);
        }
        .big-result-copy.right-copy {
          color: rgba(0,150,255,0.65);
          clip-path: inset(0 0 0 60%);
          transform: translate(4px, 2px);
        }
        /* trigger glitch by changing data-key (re-render) */
        .big-result[data-key] + .big-result-copy.left-copy,
        .big-result[data-key] + .big-result-copy.right-copy {
          animation: glitch-anim 700ms linear;
          opacity: 1;
        }
        /* final popup entrance shake */
        .animate-finalPopup { animation: popupIn 650ms cubic-bezier(.2,.9,.2,1); }
        @keyframes popupIn {
          0% { transform: translateY(-12px) scale(.98); opacity:0; filter: blur(6px); }
          60% { transform: translateY(6px) scale(1.01); opacity:1; filter: blur(0); }
          100% { transform: translateY(0) scale(1); opacity:1; filter: none; }
        }
      `}</style>
    </div>
  );
};

export default HackingCalculator;
