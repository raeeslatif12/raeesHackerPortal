import React, { useEffect, useRef, useState } from "react";
import NavBar from "./NavBar";

export default function FunnyWeatherHackerWithCommands() {
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [deep, setDeep] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [funnyMessage, setFunnyMessage] = useState("");
  const [logLines, setLogLines] = useState([]);
  const [percent, setPercent] = useState(0);
  const [seedEmoji, setSeedEmoji] = useState("🌤️");
  const [showCursor, setShowCursor] = useState(true);

  const logRef = useRef(null);
  const typeRef = useRef(null);
  const queueRef = useRef([]);

  // Pakistan cities
  const pakistanCities = [
    "Karachi",
    "Lahore",
    "Islamabad",
    "Rawalpindi",
    "Peshawar",
    "Quetta",
    "Multan",
    "Faisalabad",
    "Gujranwala",
    "Hyderabad",
    "Sukkur",
    "Bahawalpur",
    "Sargodha",
    "Sialkot",
    "Sahiwal",
    "Sheikhupura",
    "Kasur",
    "Okara",
    "Khanewal",
    "Vehari",
    "Larkana",
    "Dera Ismail Khan",
    "Nawabshah",
    "Mirpur Khas",
    "Jacobabad",
    "Shikarpur",
    "Bhawalnagar",
    "Gojra",
    "Tando Allahyar",
    "Tando Mohammad Khan",
    "Khairpur",
    "Kotli",
    "Muzaffarabad",
    "Gilgit",
    "Skardu",
    "Hunza",
    "Chilas",
    "Chitral",
    "Mardan",
    "Charsadda",
    "Swabi",
    "Nowshera",
    "Dera Ghazi Khan",
    "Rahim Yar Khan",
    "Sadiqabad",
    "Muzaffargarh",
    "Jhang",
    "Toba Tek Singh",
    "Mandi Bahauddin",
    "Gujrat",
    "Narowal",
    "Burewala",
    "Tarwhal",
    "Kharian",
    "Hafizabad",
    "Pakpattan",
    "Khanpur",
    "Kallar Kahar",
    "Chunian",
    "Attock",
    "Jhelum",
    "Gujar Khan",
    "Kot Addu",
    "Bannu",
    "Kohat",
    "Hangu",
    "Tank",
    "Mingora (Swat)",
    "Kohistan",
    "Sialkot Cantonment",
    "Gwadar",
    "Turbat",
    "Khuzdar",
    "Sibi",
    "Dadu",
    "Thatta",
    "Badin",
  ].sort();

  const baseMessages = [
    "[0x01] booting weather node...",
    "[0x02] attaching packet sniffer to atmosphere...",
    "[0x03] warming up faux-sun emitter...",
    "[0x04] decrypting cloud-formation signatures...",
    "[0x05] cross-referencing historical leaks...",
    "[0x06] injecting comedy payload...",
    "[0x07] compiling final forecast signature...",
    "[0x08] sealing with NEXUS-WEATHER-0xBAD",
  ];

  const deepExtras = [
    "[0xDE1] quantum drizzle amplifier engaged...",
    "[0xDE2] stirring microclimate caches...",
    "[0xDE3] humorous bias matrix applied...",
  ];

  // blinking cursor
  useEffect(() => {
    const t = setInterval(() => setShowCursor((s) => !s), 420);
    return () => clearInterval(t);
  }, []);

  // scroll log auto
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logLines]);

  function flashLog(msg) {
    setLogLines((p) => [...p, msg]);
  }

  function randomEmoji() {
    const arr = ["🌤️", "☀️", "🌧️", "⛈️", "🌪️", "🌈", "❄️", "🌦️", "🌬️"];
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function hashCode(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return h;
  }

  async function simpleType(text, onUpdate) {
    return new Promise((resolve) => {
      let buffer = "",
        pos = 0;
      typeRef.current = setInterval(() => {
        buffer += text[pos] ?? "";
        onUpdate(buffer + (showCursor ? "▌" : ""));
        pos++;
        if (pos >= text.length) {
          clearInterval(typeRef.current);
          typeRef.current = null;
          onUpdate(text);
          resolve();
        }
      }, Math.max(15, 30 - (deep ? 8 : 0)));
    });
  }

  function cancelHack() {
    if (typeRef.current) clearInterval(typeRef.current);
    queueRef.current = [];
    setLoading(false);
    setModalOpen(false);
    setPercent(0);
    flashLog(">> OP >> operation cancelled.");
  }

  function runFromInput() {
    const raw = city.trim();
    if (raw.toLowerCase().startsWith("x=")) {
      const cmds = raw
        .slice(2)
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean);
      if (cmds.length === 0) {
        alert("x= ke baad command dalen!");
        return;
      }
      startCommandQueue(cmds);
    } else {
      startHack();
    }
  }

  async function startCommandQueue(cmds) {
    setLoading(true);
    setModalOpen(false);
    setPercent(0);
    setLogLines([]);
    setFunnyMessage("");
    setSeedEmoji(randomEmoji());

    queueRef.current = cmds.map((c, i) => ({ id: i + 1, text: `x>${c}()` }));

    for (let i = 0; i < queueRef.current.length; i++) {
      const item = queueRef.current[i];
      await simpleType(item.text, (txt) => {
        setLogLines((prev) => {
          const copy = [...prev];
          if (copy.length === 0 || !copy[copy.length - 1].startsWith("CMD>"))
            copy.push("CMD>" + txt);
          else copy[copy.length - 1] = "CMD>" + txt;
          return copy;
        });
      });
      await new Promise((r) => setTimeout(r, deep ? 350 : 700));
      setLogLines((prev) => [...prev, `>> EXEC >> ${item.text} -> OK`]);
      setPercent(Math.floor(((i + 1) / queueRef.current.length) * 100));
    }

    setTimeout(() => {
      setModalOpen(true);
      setLoading(false);
      const msg = "Go outside and see weather ";
      setFunnyMessage(msg);
      flashLog(">> QUEUE >> all commands executed.");
      setPercent(100);
    }, 500);
  }

  async function startHack() {
    const targetCity = selectedCity || city;
    if (!targetCity) {
      alert("Select or type city!");
      return;
    }
    setLoading(true);
    setModalOpen(false);
    setLogLines([]);
    setPercent(0);
    setFunnyMessage("");
    setSeedEmoji(randomEmoji());

    const msgs = [...baseMessages];
    if (deep) msgs.splice(3, 0, ...deepExtras);
    msgs.push(`[--] target city: ${targetCity}`);
    msgs.push("[--] awaiting finalization...");

    for (let i = 0; i < msgs.length; i++) {
      await simpleType(msgs[i], (txt) => setLogLines((prev) => [...prev, txt]));
      setPercent(Math.floor(((i + 1) / msgs.length) * 100));
      await new Promise((r) => setTimeout(r, deep ? 700 : 1000));
    }

    setTimeout(() => {
      const msg = "Go outside and see weather " + seedEmoji + " 😂";
      setFunnyMessage(msg);
      setModalOpen(true);
      setLoading(false);
      flashLog(`>> OUTPUT >> ${msg}`);
      setPercent(100);
    }, 500);
  }

  function downloadLogs() {
    const blob = new Blob([logLines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `weather-hack-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyLogs() {
    try {
      await navigator.clipboard.writeText(logLines.join("\n"));
      flashLog(">> OP >> logs copied.");
    } catch {
      flashLog(">> ERR >> cannot copy.");
    }
  }

  return (
    <>
      <NavBar />
      <div className="relative min-h-screen bg-black text-emerald-200 p-6 flex items-center justify-center overflow-hidden">
        <div className="max-w-5xl w-full space-y-6 z-10 px-4 sm:px-6">
          <h1 className="text-2xl font-mono text-emerald-300">
            NEXUS • WEATHER HACK
          </h1>

          <div className="bg-gray-900 border border-emerald-800 rounded-2xl p-4 md:p-6 relative">
            <div className="flex gap-2 mb-4">
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setCity("");
                }}
                className="bg-[#101828] font-mono px-3 py-2 rounded-lg border border-emerald-700/30 focus:outline-none"
              >
                <option value="">— pick a Pakistan city —</option>
                {pakistanCities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={city}
                placeholder="Type city or x=cmd1;cmd2"
                onChange={(e) => {
                  setCity(e.target.value);
                  setSelectedCity("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") runFromInput();
                }}
                autoFocus
                className="flex-1 bg-transparent font-mono px-3 py-2 rounded-lg border border-emerald-700/30 focus:outline-none"
              />
              <button
                onClick={runFromInput}
                disabled={loading}
                className="px-4 py-2 bg-emerald-500 text-black rounded-lg"
              >
                RUN
              </button>
              <button
                onClick={() => setDeep((s) => !s)}
                className={`px-3 py-2 rounded-lg ${
                  deep ? "bg-violet-500" : "bg-emerald-900/20"
                }`}
              >
                {deep ? "DEEP ON" : "DEEP OFF"}
              </button>
              <button
                onClick={cancelHack}
                className="px-3 py-2 bg-rose-700/90 text-white rounded-lg"
              >
                CANCEL
              </button>
            </div>

            {/* Terminal + Progress */}
            <div className="relative flex flex-col bg-black border border-emerald-800 rounded-lg p-2 h-72 font-mono text-emerald-300">
              <div ref={logRef} className="flex-1 overflow-y-auto px-2">
                {logLines.length === 0 ? (
                  <div className="text-emerald-400/60">
                    &gt; awaiting input — press Enter
                  </div>
                ) : (
                  logLines.slice(-30).map((line, i) => (
                    <div key={i} className="flex gap-2 py-0.5">
                      <div className="w-8 text-xs text-emerald-500">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="text-sm">{line}</div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-2 h-2 w-full bg-emerald-900/20 rounded overflow-hidden border border-emerald-800">
                <div
                  className="h-2 bg-emerald-400/95"
                  style={{
                    width: `${percent}%`,
                    transition: "width 450ms linear",
                  }}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-3 flex justify-between text-xs">
              <div className="flex gap-2">
                <button
                  onClick={copyLogs}
                  className="px-3 py-1 bg-emerald-700/30 rounded-md font-mono"
                >
                  COPY LOGS
                </button>
                <button
                  onClick={downloadLogs}
                  className="px-3 py-1 bg-emerald-700/30 rounded-md font-mono"
                >
                  SAVE LOGS
                </button>
              </div>
              <div className="text-emerald-400/60">seed: {seedEmoji}</div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />
            <div className="relative max-w-lg w-full bg-gradient-to-b from-gray-900 to-gray-800 border border-emerald-700 rounded-2xl p-6 shadow-2xl">
              <div className="text-xs text-emerald-200 font-mono">
                NEXUS • WEATHER PAYLOAD
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="text-6xl animate-[pop_600ms]">{seedEmoji}</div>
                <div>
                  <div className="text-3xl font-mono font-bold text-emerald-300">
                    {funnyMessage}
                  </div>
                  <div className="mt-2 text-sm text-emerald-200/70">
                    for:{" "}
                    <span className="font-mono text-emerald-100">
                      {selectedCity || city}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setDeep(true);
                    startHack();
                  }}
                  className="px-4 py-2 bg-violet-500 text-black rounded-lg"
                >
                  DEEP AGAIN
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(funnyMessage);
                    flashLog(">> OP >> message copied.");
                  }}
                  className="px-3 py-2 bg-emerald-600 text-black rounded-lg"
                >
                  COPY MESSAGE
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

        <style>{`
          @keyframes pop {0%{transform:scale(0.8);opacity:0;}60%{transform:scale(1.05);opacity:1;}100%{transform:scale(1);}}
          .animate-[pop_600ms]{animation:pop 600ms forwards;}
        `}</style>
      </div>
    </>
  );
}
