// HackingHome.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import FunnyAgeCalculator from "./FunnyAgeCalculator";
import FunnyCalculator from "./FunnyCalculator";

export default function HackingHome() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [previewComponent, setPreviewComponent] = useState(null);
  const [previewMeta, setPreviewMeta] = useState(null);
  const [isRunningCommands, setIsRunningCommands] = useState(false);
  const [commandLog, setCommandLog] = useState([]);
  const [expandedPreview, setExpandedPreview] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // For title typing animation
  const inputRef = useRef(null);
  const titleRef = useRef(null);
  const terminalRef = useRef(null);

  const projects = [
    {
      id: "funny-age",
      title: "FunnyAgeCalculator",
      description: "Age calculator with a playful UI and helpful tips.",
      route: "/funny-age",
      component: FunnyAgeCalculator,
      tags: ["age", "react", "ui"],
    },
    {
      id: "funny-calc",
      title: "FunnyCalculator",
      description: "Fun calculator with animations and keyboard shortcuts.",
      route: "/funny-calculator",
      component: FunnyCalculator,
      tags: ["calculator", "react", "keyboard"],
    },
    {
      id: "funny-Weather",
      title: "FunnyWeather",
      description: "Fun calculator with animations and keyboard shortcuts.",
      route: "/funny-weather",
      component: FunnyCalculator,
      tags: ["calculator", "react", "keyboard"],
    },
  ];

  // Initialize results and focus
  useEffect(() => {
    setResults(projects);
    if (inputRef.current) inputRef.current.focus();
  }, []); // run once on mount

  // Global keyboard shortcuts & arrow navigation when search focused
  useEffect(() => {
    const onKey = (e) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current && inputRef.current.focus();
        return;
      }

      // Only run arrow navigation when the search input is focused and there are result elements
      if (document.activeElement === inputRef.current) {
        const projectElements = document.querySelectorAll(
          "[data-project-index]"
        );
        if (projectElements.length === 0) return;

        // Find an element that currently has focus (could be the input) or hovered
        let currentIndex = -1;
        projectElements.forEach((el, idx) => {
          if (el === document.activeElement) currentIndex = idx;
        });

        if (e.key === "ArrowDown") {
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % projectElements.length;
          const nextEl = projectElements[nextIndex];
          nextEl && nextEl.focus();
          nextEl &&
            nextEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          const prevIndex =
            (currentIndex - 1 + projectElements.length) %
            projectElements.length;
          const prevEl = projectElements[prevIndex];
          prevEl && prevEl.focus();
          prevEl &&
            prevEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } else if (e.key === "Enter" && currentIndex >= 0) {
          e.preventDefault();
          const proj = results[currentIndex];
          proj && handlePreviewClick(proj);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [results]);

  // Typing animation for the title (runs once)
  useEffect(() => {
    if (!titleRef.current) return;
    const titleText = "RAEES' HACKPORTAL";
    titleRef.current.textContent = "";
    let i = 0;
    setIsTyping(true);
    const typeInterval = setInterval(() => {
      if (i < titleText.length) {
        titleRef.current.textContent += titleText[i];
        i++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, 100);
    return () => clearInterval(typeInterval);
  }, []);

  // Filter projects based on query
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setResults(projects);
      return;
    }
    const filtered = projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.join(" ").toLowerCase().includes(q)
    );
    setResults(filtered);
  }, [query]);

  // Auto-scroll terminal when commandLog updates
  useEffect(() => {
    if (!terminalRef.current) return;
    terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [commandLog]);

  // Run fancy commands and then show preview
  async function runCommandsThenPreview(proj) {
    if (isRunningCommands) return;
    setIsRunningCommands(true);
    setCommandLog([]);
    setPreviewComponent(null);
    setPreviewMeta(null);
    setExpandedPreview(true);

    const cmds = [
      `> [HACKPORTAL] Initializing sandbox for ${proj.title}...`,
      "> [LOADER] Loading UI modules... [STATUS: GREEN]",
      "> [INJECTOR] Injecting playful scripts... [BREACH: SUCCESS]",
      "> [COMPILER] Compiling preview bundle... [HASH: VERIFIED]",
      "> [RUNTIME] Starting preview engine... [ALERT: LIVE]",
      "> [SCAN] No threats detected. Rendering interface...",
      `> [RENDER] Executing ${proj.title} in isolated viewport... [SECURE]`,
    ];

    try {
      for (let i = 0; i < cmds.length; i++) {
        if (!isRunningCommands) break;
        // refined pace
        await new Promise((res) => setTimeout(res, 250 + i * 200));
        setCommandLog((prev) => [...prev, cmds[i]]);
        // also log to browser console for debugging
        // eslint-disable-next-line no-console
        console.log("[TERMINAL]", cmds[i]);
      }

      if (isRunningCommands) {
        setPreviewMeta({ title: proj.title, description: proj.description });
        // set the preview component safely as a renderable component
        setPreviewComponent(
          () => (props) => React.createElement(proj.component, props || {})
        );
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error running commands:", err);
      setCommandLog((prev) => [...prev, `> [ERROR] ${String(err)}`]);
    } finally {
      setIsRunningCommands(false);
    }
  }

  function handlePreviewClick(proj) {
    runCommandsThenPreview(proj);
  }

  function handleOpenFull(proj) {
    navigate(proj.route);
  }

  function closePreview() {
    setIsRunningCommands(false);
    setCommandLog([]);
    setPreviewComponent(null);
    setPreviewMeta(null);
    setExpandedPreview(false);
  }

  const suggestions = results.length > 0 ? results.slice(0, 3) : [];

  return (
    <div className="min-h-screen bg-black text-green-200 font-mono relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 -z-10 opacity-20 bg-gradient-to-b from-black via-[#001a0f] to-black animate-[matrix_15s_linear_infinite]" />
      <div className="absolute inset-0 -z-10 opacity-8 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,255,0,0.05)_0),linear-gradient(to_right,transparent_50%,rgba(0,255,0,0.05)_0)] animate-[scanline_3s_linear_infinite]" />
      <div className="absolute inset-0 -z-10 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full opacity-30 animate-[float_6s_ease-in-out_infinite]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-green-500 opacity-30 animate-[glitch_1.5s_ease-in-out_infinite] animate-delay-500" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500 opacity-15 animate-[glitch_2s_ease-in-out_infinite_reverse]" />
        <div className="absolute top-0 right-0 w-px h-full bg-green-400 opacity-10 animate-[scan-vertical_5s_linear_infinite]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="relative">
            <h1
              ref={titleRef}
              className={`text-4xl md:text-5xl font-extrabold text-green-300 tracking-widest bg-clip-text bg-gradient-to-r from-green-400 via-green-300 to-green-500 animate-[glitch_2s_ease-in-out_infinite] relative overflow-hidden ${
                isTyping ? "border-r-2 border-green-500 animate-pulse" : ""
              }`}
              style={{ minHeight: isTyping ? "0" : "auto" }}
            />
            <p className="text-sm text-green-200/80 mt-1 animate-pulse">
              [ACCESS GRANTED] Neon hacking-style project hub — click Preview or
              Open Full. Ctrl+K to search. Arrow keys to navigate results.
            </p>
          </div>

          <div className="w-full md:w-auto mt-2 md:mt-0 flex gap-3">
            <div className="relative">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="> Search projects, tags or keywords — try 'calculator' [ENTER TO EXECUTE]"
                className="w-full md:w-[420px] bg-black/50 border border-green-800/60 rounded-lg px-4 py-3 text-green-100 placeholder-green-500 outline-none shadow-[0_0_10px_rgba(0,255,120,0.1)] focus:ring-2 focus:ring-green-600 focus:shadow-[0_0_20px_rgba(0,255,120,0.3)] transition-all duration-300"
              />
              {query && suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-1 bg-black/90 border border-green-800/60 rounded-lg shadow-[0_0_15px_rgba(0,255,120,0.2)] z-20 max-h-48 overflow-auto">
                  {suggestions.map((s, idx) => (
                    <div
                      key={s.id}
                      data-project-index={idx}
                      tabIndex={0}
                      onClick={() => handlePreviewClick(s)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handlePreviewClick(s);
                      }}
                      className="px-4 py-2 text-sm text-green-200 hover:bg-green-900/30 cursor-pointer border-b border-green-900/30 last:border-b-0 transition-colors duration-200 flex items-center gap-2"
                    >
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      {s.title}{" "}
                      <span className="text-green-400 text-xs">
                        [{s.tags[0]}]
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-green-500 animate-pulse">
                _
              </div>
            </div>

            <button
              onClick={() => {
                setQuery("");
                inputRef.current && inputRef.current.focus();
              }}
              className="px-4 py-2 rounded-md border border-green-700/70 text-green-200 text-sm hover:bg-green-900/30 hover:shadow-[0_0_15px_rgba(0,255,120,0.2)] transition-all duration-200 group hover:animate-pulse"
            >
              [CLEAR]
            </button>
          </div>
        </header>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects */}
          <section
            className={expandedPreview ? "lg:col-span-1" : "lg:col-span-2"}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-green-200 border-l-4 border-green-500 pl-2 animate-pulse">
                [PROJECTS]
              </h2>
              <div className="text-sm text-green-400">
                {results.length} result(s) [LOADED]
              </div>
            </div>

            <div
              className={
                expandedPreview
                  ? "grid grid-cols-1 gap-4"
                  : "grid grid-cols-1 sm:grid-cols-2 gap-4"
              }
            >
              {(results.length ? results : projects).map((p, idx) => (
                <div key={p.id} className="group" data-project-index={idx}>
                  <div
                    tabIndex={0}
                    className="p-4 rounded-lg border border-green-800/60 bg-[#000a05]/80 hover:scale-105 transform transition-all duration-300 cursor-pointer hover:shadow-[0_0_25px_rgba(0,255,120,0.2)] hover:border-green-600/80 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-green-500"
                    onClick={() => handlePreviewClick(p)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handlePreviewClick(p);
                    }}
                    aria-label={`Project ${p.title}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(0,255,0,0.1)_50%,transparent_70%)] opacity-0 group-hover:opacity-100 animate-[shimmer_2s_linear_infinite] transition-opacity duration-300" />
                    <div className="relative flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-green-100 relative">
                          {p.title}
                        </h3>
                        <p className="text-xs text-green-400 mt-1">
                          {p.tags.join(" • ")}
                        </p>
                      </div>
                      <div className="text-xs text-green-500 group-hover:text-green-300 transition-colors duration-200">
                        #{p.id.toUpperCase()}
                      </div>
                    </div>

                    <p className="text-sm text-green-200/80 mt-3 relative z-10">
                      {p.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 relative z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenFull(p);
                        }}
                        className="px-3 py-1 rounded border border-green-800/60 text-green-300 text-sm hover:bg-green-900/40 hover:shadow-[0_0_15px_rgba(0,255,120,0.3)] transition-all duration-200"
                      >
                        [OPEN FULL]
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreviewClick(p);
                        }}
                        className="px-3 py-1 rounded bg-gradient-to-r from-green-700/40 to-green-600/30 border border-green-700/50 text-green-100 text-sm hover:shadow-[0_0_20px_rgba(0,255,120,0.5)] hover:bg-green-700/50 transition-all duration-200 relative overflow-hidden group/btn animate-pulse"
                      >
                        [PREVIEW]{" "}
                        <span className="group-hover/btn:ml-1 transition-all">
                          ▸
                        </span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          try {
                            navigator.clipboard?.writeText(
                              window.location.origin + p.route
                            );
                            // eslint-disable-next-line no-console
                            console.log(
                              "Copied route:",
                              window.location.origin + p.route
                            );
                          } catch (err) {
                            // eslint-disable-next-line no-console
                            console.error("Copy failed:", err);
                          }
                        }}
                        className="px-3 py-1 rounded border border-green-800/60 text-green-300 text-sm hover:bg-green-900/20 hover:shadow-[0_0_10px_rgba(0,255,120,0.1)] transition-all duration-200"
                        title="Copy route"
                      >
                        [LINK]
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Preview */}
          <aside
            className={expandedPreview ? "lg:col-span-2" : "lg:col-span-1"}
          >
            <div className="p-3 rounded border border-green-900/50 bg-[#000a05]/80 min-h-[480px] overflow-hidden shadow-[0_0_30px_rgba(0,255,120,0.15)] relative">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm text-green-300 font-semibold border-l-2 border-green-500 pl-1 animate-pulse">
                    [LIVE PREVIEW TERMINAL]
                  </div>
                  <div className="text-xs text-green-400 flex items-center gap-2">
                    {previewMeta
                      ? `${previewMeta.title} — ${previewMeta.description}`
                      : "[IDLE] No preview loaded. Click Preview to initialize."}
                    <span className="w-1 h-1 bg-green-500 rounded-full animate-ping" />
                  </div>
                </div>

                {previewComponent && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        // open preview in a simple fullscreen overlay (optional)
                        window.open(
                          window.location.origin +
                            (previewMeta?.title === "FunnyAgeCalculator"
                              ? "/funny-age"
                              : "/funny-calculator"),
                          "_blank"
                        );
                      }}
                      className="px-3 py-1 rounded border border-green-700/60 text-green-200 text-sm hover:bg-green-900/30 transition-all duration-200"
                    >
                      [OPEN IN NEW TAB]
                    </button>

                    <button
                      onClick={closePreview}
                      className="px-3 py-1 rounded bg-red-800/40 border border-red-700/50 text-red-200 text-sm hover:shadow-[0_0_20px_rgba(255,0,0,0.4)] hover:bg-red-800/60 transition-all duration-200 animate-pulse"
                    >
                      [ABORT MISSION]
                    </button>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-md border border-green-700/40 bg-[#000a05]/90 min-h-[320px] relative overflow-hidden">
                {/* Terminal + preview area */}
                <div
                  ref={terminalRef}
                  className="h-full overflow-auto text-green-200 font-mono text-xs space-y-1 p-2"
                >
                  {commandLog.length === 0 && !previewComponent && (
                    <div className="text-green-400">
                      [TERMINAL IDLE] No commands yet. Click a project's PREVIEW
                      to run the terminal.
                    </div>
                  )}

                  {commandLog.map((line, idx) => (
                    <div key={idx} className="whitespace-pre-wrap">
                      {line}
                    </div>
                  ))}

                  {/* Show loading spinner text when commands are running */}
                  {isRunningCommands && (
                    <div className="mt-3 text-green-300 text-sm">
                      [RUNNING] Executing steps... Please wait.
                    </div>
                  )}

                  {/* Render preview component after commands finish */}
                  {previewComponent && !isRunningCommands && (
                    <div className="mt-4 p-2 border-t border-green-700/30">
                      {(() => {
                        try {
                          // Render the preview component. If it throws, we catch and show an error
                          const Preview = previewComponent;
                          return <Preview />;
                        } catch (err) {
                          // eslint-disable-next-line no-console
                          console.error("Preview render error:", err);
                          return (
                            <div className="text-red-500">
                              [ERROR] Failed to render preview. Check console
                              for details.
                            </div>
                          );
                        }
                      })()}
                    </div>
                  )}

                  {/* If preview failed to render and previewComponent is null, show iframe fallback */}
                  {!previewComponent && previewMeta && !isRunningCommands && (
                    <div className="mt-4 p-2 border-t border-green-700/30 text-sm text-green-300">
                      [FALLBACK] Preview component not available. You can open
                      the project with "OPEN FULL" or try again.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
