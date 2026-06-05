import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Play,
  Users,
  Award,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus,
  CheckCircle,
  XCircle,
  Tv,
  PlusCircle,
  BookOpen,
  ChevronRight,
  RefreshCw,
  Flame,
  ArrowRight,
  AlertCircle,
  BookMarked,
  Layers,
  Sparkle,
  Radio,
  Check,
  RotateCcw,
  Plus
} from "lucide-react";
import { Question, GameSession, Player, BannerCheer, GameStatus } from "./types";
import { MathRenderer } from "./components/MathRenderer";

// Ensure local player uuid persistence
const getOrGenerateUuid = (): string => {
  let id = localStorage.getItem("math_neon_uuid");
  if (!id) {
    id = "p-" + Math.random().toString(36).substring(2, 11);
    localStorage.setItem("math_neon_uuid", id);
  }
  return id;
};

export default function App() {
  const uuid = useMemo(() => getOrGenerateUuid(), []);

  // Global routing/role state
  const [role, setRole] = useState<"SELECT" | "HOST" | "STUDENT">("SELECT");

  // Client socket connection indicators
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Question bank loaded from /api/questions
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  
  // Custom Question Creator Form State
  const [isCreatingCustom, setIsCreatingCustom] = useState<boolean>(false);
  const [customForm, setCustomForm] = useState({
    title: "",
    content: "",
    difficulty: "준킬러" as "준킬러" | "킬러" | "기본",
    options: ["", "", "", "", ""],
    correctAnswer: 0,
    explanation: ""
  });

  // Host dashboard states
  const [isGenerating, setIsGenerating] = useState<string | null>(null); // Original Q Id being used to generate variant
  const [hostActivePin, setHostActivePin] = useState<string | null>(null);
  const [hostSession, setHostSession] = useState<GameSession | null>(null);
  const [podiumData, setPodiumData] = useState<BannerCheer[]>([]);

  // Student gameplay states
  const [studentPin, setStudentPin] = useState<string>("");
  const [studentNickname, setStudentNickname] = useState<string>("");
  const [studentJoined, setStudentJoined] = useState<boolean>(false);
  const [studentSession, setStudentSession] = useState<GameSession | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [studentCheer, setStudentCheer] = useState<string>("");

  // Sound effects / visual micro-feedbacks
  const [lastActionMsg, setLastActionMsg] = useState<string | null>(null);

  // Trigger quick toast message
  const triggerToast = (msg: string) => {
    setLastActionMsg(msg);
    setTimeout(() => {
      setLastActionMsg(null);
    }, 3500);
  };

  // Load question bank on startup
  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/questions");
      if (res.ok) {
        const data = await res.json();
        setQuestions(data);
        // Pre-select seed questions by default to speed up host launch
        if (selectedQuestionIds.length === 0) {
          const seeds = data.filter((q: Question) => q.id.startsWith("seed-")).map((q: Question) => q.id);
          setSelectedQuestionIds(seeds);
        }
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Monitor connection health with standard pinging
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      triggerToast("연결이 일시 해제되었습니다. 세션 복구를 시도 중입니다...");
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // POLLING ENGINE FOR REAL-TIME PLAYERS & HOST STATE
  // Host state sync observer
  useEffect(() => {
    if (!hostActivePin || role !== "HOST") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/game/state/${hostActivePin}`);
        if (res.ok) {
          const sessionData: GameSession = await res.json();
          setHostSession(sessionData);

          // If podium stage is reached, retrieve corresponding cheers & winner stats
          if (sessionData.status === "PODIUM" && podiumData.length === 0) {
            const cheerRes = await fetch(`/api/game/podium-data/${hostActivePin}`);
            if (cheerRes.ok) {
              const cheers: BannerCheer[] = await cheerRes.json();
              setPodiumData(cheers);
            }
          }
        } else if (res.status === 404) {
          triggerToast("진행 중인 세션이 만료되거나 파괴되었습니다.");
          setHostActivePin(null);
          setHostSession(null);
        }
      } catch (err) {
        console.error("Host poll error:", err);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [hostActivePin, role, podiumData.length]);

  // Student state sync observer
  useEffect(() => {
    if (!studentPin || !studentJoined || role !== "STUDENT") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/game/state/${studentPin}`);
        if (res.ok) {
          const sessionData: GameSession = await res.json();
          setStudentSession(sessionData);
          setIsOnline(true);

          const myState = sessionData.players.find(p => p.uuid === uuid);
          if (!myState) {
            // Player lost from active list inexplicably (session wiped/restarted)
            // Rejoin silently
            rejoinStudentSilently();
          } else {
            // Recover or reset choice in perfect state sync
            if (myState.isSubmitted && myState.lastAnswerIndex !== -1) {
              setSelectedChoice(myState.lastAnswerIndex);
            } else if (sessionData.status === "INTRO") {
              setSelectedChoice(null);
            }
          }

          // Fetch personalized cheer when session completes
          if (sessionData.status === "PODIUM" && !studentCheer) {
            const cheerRes = await fetch(`/api/game/podium-data/${studentPin}`);
            if (cheerRes.ok) {
              const cheers: BannerCheer[] = await cheerRes.json();
              const mine = cheers.find(c => c.nickname === studentNickname);
              if (mine) {
                setStudentCheer(mine.cheer);
              } else {
                // Fallback default encouragement
                setStudentCheer(`${studentNickname}님, 수능 수리가 장엄하게 빛나기 위해 함께 달렸습니다. 수고하셨습니다!`);
              }
            }
          }
        } else {
          setIsOnline(false);
        }
      } catch (err) {
        setIsOnline(false);
        console.error("Student poll error:", err);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [studentPin, studentJoined, role, uuid, studentNickname, studentCheer]);

  const rejoinStudentSilently = async () => {
    if (!studentPin || !studentNickname) return;
    try {
      await fetch("/api/game/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: studentPin, nickname: studentNickname, uuid })
      });
    } catch (e) {
      console.error("Rejoin silent failed:", e);
    }
  };

  // AI-powered Variants Creator Logic calling our /api/questions/generate-variant endpoint
  const handleAIGenerateVariant = async (originalId: string) => {
    setIsGenerating(originalId);
    triggerToast("Gemini 3.1 Pro가 문항 구조를 해체하고 수학 변형 문제를 출제하는 중입니다...");
    try {
      const res = await fetch("/api/questions/generate-variant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalQuestionId: originalId })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          triggerToast("수학적 결함이 없는 완벽한 평가원급 준킬러 문항이 적재되었습니다!");
          await fetchQuestions(); // Reload list
        }
      } else {
        const errorData = await res.json();
        triggerToast(`변형 생성 실패: ${errorData.error || "통신 오류 발생"}`);
      }
    } catch (err) {
      console.error("AI variant generation failed", err);
      triggerToast("AI 모델 출제 통신 중 이상이 감지되었습니다. 잠시 후 재시도하세요.");
    } finally {
      setIsGenerating(null);
    }
  };

  // Create new Custom Question manually
  const handleCreateCustomQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customForm.title || !customForm.content) {
      triggerToast("문제 제목과 LaTeX 지문을 작성해 주세요.");
      return;
    }

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customForm)
      });

      if (res.ok) {
        triggerToast("새로운 수능 연습 문항이 출제 은행에 등록되었습니다.");
        setCustomForm({
          title: "",
          content: "",
          difficulty: "준킬러",
          options: ["", "", "", "", ""],
          correctAnswer: 0,
          explanation: ""
        });
        setIsCreatingCustom(false);
        await fetchQuestions();
      } else {
        triggerToast("문항 인덱스 검사 오류가 발생했습니다.");
      }
    } catch (err) {
      console.error("Custom creation err", err);
    }
  };

  // Toggle selection of questions to place in active game quiz set
  const toggleSelectQuestion = (id: string) => {
    if (selectedQuestionIds.includes(id)) {
      setSelectedQuestionIds(selectedQuestionIds.filter(item => item !== id));
    } else {
      setSelectedQuestionIds([...selectedQuestionIds, id]);
    }
  };

  // HOST: Open Room Session
  const handleHostLaunchGame = async () => {
    if (selectedQuestionIds.length === 0) {
      triggerToast("최소 1개 이상의 대결 퀴즈 문항을 수집하세요.");
      return;
    }

    try {
      const res = await fetch("/api/game/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionIds: selectedQuestionIds })
      });

      if (res.ok) {
        const data = await res.json();
        setHostActivePin(data.pin);
        setHostSession(data.session);
        setPodiumData([]); // Clear previous scores
        triggerToast(`게임 PIN [${data.pin}] 방이 개설되었습니다.`);
      } else {
        const err = await res.json();
        triggerToast(err.error || "게임 생성을 실패하였습니다.");
      }
    } catch (e) {
      console.error("Launch game issue", e);
    }
  };

  // HOST: Transition stage control
  const handleAdvanceStage = async (target: GameStatus | "NEXT_QUESTION") => {
    if (!hostActivePin) return;
    try {
      const res = await fetch("/api/game/advance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: hostActivePin, targetStatus: target })
      });

      if (res.ok) {
        const data = await res.json();
        setHostSession(data.session);
      }
    } catch (e) {
      console.error("Advance error", e);
    }
  };

  // STUDENT: Join Battle Room
  const handleStudentJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentPin || studentPin.length !== 6) {
      triggerToast("6자리 PIN 번호를 기입하세요.");
      return;
    }
    if (!studentNickname.trim()) {
      triggerToast("학생 닉네임 또는 수험번호를 명시하세요.");
      return;
    }

    try {
      const res = await fetch("/api/game/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: studentPin, nickname: studentNickname.trim(), uuid })
      });

      if (res.ok) {
        const data = await res.json();
        setStudentJoined(true);
        setRole("STUDENT");
        setSelectedChoice(null);
        setStudentCheer("");
        triggerToast(`${studentNickname}님, 수능 수리 전장에 소환되었습니다!`);
      } else {
        const err = await res.json();
        triggerToast(err.error || "대기방에 진입하지 못했습니다.");
      }
    } catch (err) {
      console.error("Join issue", err);
      triggerToast("네트워크 장애로 대기방 입장에 장애가 생겼습니다.");
    }
  };

  // STUDENT: Answer selection submission
  const handleAnswerSubmit = async (answerIndex: number) => {
    if (!studentPin || !studentJoined || selectedChoice !== null) return;
    setSelectedChoice(answerIndex);

    try {
      const res = await fetch("/api/game/submit-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: studentPin, uuid, answerIndex })
      });

      if (res.ok) {
        triggerToast(`${answerIndex + 1}번을 정답으로 완결 제출했습니다.`);
      } else {
        const err = await res.json();
        triggerToast(err.error || "정답 제출에 지연이 일어났습니다.");
        setSelectedChoice(null); // release lock on fail
      }
    } catch (e) {
      console.error("Submit issue", e);
      triggerToast("제출 통신에 장애가 일어났습니다.");
      setSelectedChoice(null);
    }
  };

  // Derived state math parameters
  const currentHostQuestion: Question | undefined = hostSession?.questions[hostSession.currentQuestionIndex];
  const currentStudentQuestion: Question | undefined = studentSession?.questions[studentSession.currentQuestionIndex];

  // Calculated stats based on answers
  const optionTalies = useMemo(() => {
    if (!hostSession) return [0, 0, 0, 0, 0];
    const tallies = [0, 0, 0, 0, 0];
    hostSession.players.forEach(p => {
      if (p.isSubmitted && p.lastAnswerIndex >= 0 && p.lastAnswerIndex < 5) {
        tallies[p.lastAnswerIndex]++;
      }
    });
    return tallies;
  }, [hostSession]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {lastActionMsg && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 glass-panel px-6 py-3 rounded-full border border-cyan-500/30 text-cyan-400 font-medium text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
          >
            <Sparkles className="w-5 h-5 animate-pulse text-cyan-300" />
            <span>{lastActionMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE FRAME HEADER */}
      <header className="glass-panel border-b border-white/5 py-4 px-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-cyan-500 to-purple-600 p-2.5 rounded-xl border border-cyan-400/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Sparkle className="w-6 h-6 text-cyan-200 animate-spin-slow" />
          </div>
          <div>
            <h1
              onClick={() => {
                // Return home unless active in a matches session
                if (!hostActivePin && !studentJoined) {
                  setRole("SELECT");
                }
              }}
              className="text-2xl font-bold font-display tracking-wider cursor-pointer bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
            >
              NEON MATH
            </h1>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-mono">CSAT High-End AI Arena</p>
          </div>
        </div>

        {/* Global state, and reconnection indicator */}
        <div className="flex items-center gap-3">
          {role === "SELECT" && (
            <span className="hidden md:inline px-3.5 py-1 rounded-full text-xs font-mono font-medium border border-slate-700 bg-slate-900/50 text-slate-400">
              Ver 1.4 Native Core
            </span>
          )}

          {role !== "SELECT" && (
            <div className="flex items-center gap-3">
              {isOnline ? (
                <button
                  className="px-4 py-1.5 rounded-full text-xs font-mono font-bold border border-emerald-500/30 text-emerald-400 bg-emerald-950/40 flex items-center gap-1.5"
                  title="소켓 유지 인디케이터"
                >
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  LIVE CONNECTED
                </button>
              ) : (
                <button
                  onClick={async () => {
                    triggerToast("소켓 복구를 위한 안전지대를 재설정하는 중...");
                    if (role === "STUDENT") {
                      await rejoinStudentSilently();
                    }
                  }}
                  className="px-4 py-1.5 rounded-full text-xs font-mono font-bold border border-rose-500/30 text-rose-400 bg-rose-950/50 animate-pulse flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  RECONNECTING...
                </button>
              )}

              <button
                onClick={() => {
                  if (confirm("정말 현재 세션을 해제하고 초기 가이드 화면으로 돌아가시겠습니까?")) {
                    setRole("SELECT");
                    setStudentJoined(false);
                    setHostActivePin(null);
                    setHostSession(null);
                    setStudentSession(null);
                  }
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-red-950/20 text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-colors"
                id="quit-btn"
              >
                나가기
              </button>
            </div>
          )}
        </div>
      </header>

      {/* CORE CONTAINER PORT PORTAL */}
      <main className="flex-grow flex flex-col p-4 md:p-8 justify-center relative overflow-y-auto">
        
        {/* Ambient background glows */}
        <div className="absolute top-[15%] left-[15%] w-[40vw] h-[40vw] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-[15%] right-[15%] w-[40vw] h-[40vw] bg-purple-500/5 rounded-full blur-[130px] pointer-events-none animate-pulse-slow" style={{ animationDelay: "2s" }} />

        {/* Background Grid Accent overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <AnimatePresence mode="wait">
          
          {/* STATE 0: SELECT ROLE PORTAL */}
          {role === "SELECT" && (
            <motion.div
              key="select-role"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-4xl mx-auto w-full grid md:grid-cols-2 gap-8 z-10"
              id="role-selection"
            >
              {/* CARD A: PLAYER LOGIN GATE */}
              <div className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden group flex flex-col justify-between min-h-[420px] shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors duration-500" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-3 py-1 rounded-full">
                      Student Client
                    </span>
                    <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold font-display tracking-tight text-slate-100 group-hover:text-cyan-300 transition-colors">
                      아레나 참여하기
                    </h2>
                    <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                      교사가 부여한 실시간 대결 6자리 PIN 코드와 닉네임을 사용해 극적인 모의고사에 출사표를 던지세요.
                    </p>
                  </div>

                  <form onSubmit={handleStudentJoin} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400 uppercase tracking-widest block">Room Session PIN</label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="ENTER 6-DIGIT PIN"
                        value={studentPin}
                        onChange={e => setStudentPin(e.target.value.replace(/[^0-9]/g, ""))}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl py-4 px-6 text-center text-3xl font-display tracking-[0.5em] text-cyan-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 transition-all duration-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono text-slate-400 uppercase tracking-widest block">수험생 이름 또는 닉네임</label>
                      <input
                        type="text"
                        maxLength={12}
                        placeholder="김수능 (1등급대기)"
                        value={studentNickname}
                        onChange={e => setStudentNickname(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl py-4 px-6 text-center text-lg text-slate-300 focus:border-cyan-500/40 focus:ring-4 focus:ring-cyan-500/5 transition-all duration-300"
                      />
                    </div>
                  </form>
                </div>

                <div className="pt-6">
                  <button
                    onClick={handleStudentJoin}
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-4.5 rounded-2xl tracking-widest hover:from-purple-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 text-lg"
                    id="student-join-btn"
                  >
                    <span>ENTER THE ARENA</span>
                    <ArrowRight className="w-5 h-5 text-cyan-200" />
                  </button>
                </div>
              </div>

              {/* CARD B: TEACHER SYSTEM PORTAL */}
              <div className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden group flex flex-col justify-between min-h-[420px] shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/10 transition-colors duration-500" />

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase bg-purple-500/10 text-purple-300 border border-purple-500/20 px-3 py-1 rounded-full">
                      Host Controller
                    </span>
                    <Tv className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold font-display tracking-tight text-slate-100 group-hover:text-purple-300 transition-colors">
                      출제 위원 제어 센터
                    </h2>
                    <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                      원본 수능 문제를 고도로 해체하고, Gemini LLM을 통해 100% 수학적 모순이 없는 준킬러 변형 문제를 생산하여 실시간 Kahoot 대회를 생성하세요.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2.5 text-xs text-slate-400">
                      <BookMarked className="w-4.5 h-4.5 text-purple-400 shrink-0" />
                      <span>수능 21번 및 준킬러 문항 라이브러리 탑재</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-400">
                      <Sparkles className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
                      <span>Gemini 3.1 Pro Strict JSON 수학 변형 엔진</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-400">
                      <Users className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                      <span>실시간 순위 등락 계산 및 최고점 시상대 연출</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => {
                      setRole("HOST");
                      fetchQuestions();
                    }}
                    className="w-full bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-purple-300 font-bold py-4.5 rounded-2xl tracking-widest hover:bg-purple-900/10 transition-all flex items-center justify-center gap-2 text-lg"
                    id="host-select-btn"
                  >
                    <span>TEACHER LOG IN</span>
                    <ChevronRight className="w-5 h-5 text-purple-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STATE 1: HOST CONSOLE (DASHBOARD) */}
          {role === "HOST" && !hostActivePin && (
            <motion.div
              key="host-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-8 z-10"
              id="host-dashboard"
            >
              {/* LEFT: Question selector panel (8 columns) */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-white/5">
                  <div>
                    <h3 className="text-xl font-bold font-display uppercase tracking-wider text-cyan-400">MATH QUESTION BANK</h3>
                    <p className="text-xs text-slate-500">실시간 게임 대결에 사용할 수량에 맞추어 문제들을 선택해 주세요.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsCreatingCustom(!isCreatingCustom)}
                      className="px-4 py-2 text-xs font-bold rounded-xl glass-button text-purple-300 hover:text-purple-200 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      직접 수동 출제
                    </button>
                    <button
                      onClick={fetchQuestions}
                      className="p-2 rounded-xl glass-button text-slate-400 hover:text-cyan-400"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question Creator Overlay Forms */}
                <AnimatePresence>
                  {isCreatingCustom && (
                    <motion.form
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      onSubmit={handleCreateCustomQuestion}
                      className="glass-panel p-6 rounded-2xl border border-purple-500/20 space-y-4 overflow-hidden"
                    >
                      <h4 className="text-md font-bold text-slate-200 flex items-center gap-1.5 border-b border-white/5 pb-2">
                        <PlusCircle className="w-5 h-5 text-purple-400" />
                        수동 문항 출제
                      </h4>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 space-y-1.5">
                          <label className="text-xs text-slate-400 block font-mono">문항 타이틀</label>
                          <input
                            type="text"
                            required
                            placeholder="예: 2026 수능 21번 예상 - 수열 극형"
                            value={customForm.title}
                            onChange={e => setCustomForm({ ...customForm, title: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-300"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-slate-400 block font-mono">출제 난이도</label>
                          <select
                            value={customForm.difficulty}
                            onChange={e => setCustomForm({ ...customForm, difficulty: e.target.value as any })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-300"
                          >
                            <option value="기본">기본</option>
                            <option value="준킬러">준킬러</option>
                            <option value="킬러">킬러</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-400 block font-mono">지문 정보(LaTeX 수학 공식 사용 권장: $$...$$)</label>
                        <textarea
                          required
                          rows={4}
                          placeholder="수열 $a_n$ 은 모든 자연수 $n$ 에 대하여 $a_{n+1} = a_n + 2$ 를 만족한다..."
                          value={customForm.content}
                          onChange={e => setCustomForm({ ...customForm, content: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm font-mono text-slate-300 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs text-slate-400 block font-mono">5지선다 보기 및 정답 체크</label>
                        <div className="grid sm:grid-cols-5 gap-2.5">
                          {customForm.options.map((opt, oIdx) => (
                            <div key={`opt-create-${oIdx}`} className="space-y-1">
                              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">보기 {oIdx + 1}</span>
                              <input
                                type="text"
                                required
                                placeholder={`값 ${oIdx + 1}`}
                                value={opt}
                                onChange={e => {
                                  const list = [...customForm.options];
                                  list[oIdx] = e.target.value;
                                  setCustomForm({ ...customForm, options: list });
                                }}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 text-center"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-slate-400">정답 선택지 번호:</span>
                            <div className="flex gap-1.5">
                              {[0, 1, 2, 3, 4].map(idx => (
                                <button
                                  type="button"
                                  key={`correct-answ-${idx}`}
                                  onClick={() => setCustomForm({ ...customForm, correctAnswer: idx })}
                                  className={`w-7 h-7 rounded-lg text-xs font-bold border transition-all ${
                                    customForm.correctAnswer === idx
                                      ? "bg-cyan-500 border-cyan-400 text-slate-950"
                                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                                  }`}
                                >
                                  {idx + 1}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-400 block font-mono">상세 해설 및 증명 공식</label>
                        <input
                          type="text"
                          placeholder="풀이과정 해설을 적으세요"
                          value={customForm.explanation}
                          onChange={e => setCustomForm({ ...customForm, explanation: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-300"
                        />
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsCreatingCustom(false)}
                          className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800"
                        >
                          취소
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-500 shadow-md shadow-purple-900/30"
                        >
                          출제 완료
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Problem Bank cards map */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {questions.length === 0 ? (
                    <div className="glass-panel p-10 text-center rounded-2xl border border-white/5 text-slate-500">
                      가방에 등록된 문제가 아직 없습니다.
                    </div>
                  ) : (
                    questions.map(q => {
                      const isSelected = selectedQuestionIds.includes(q.id);
                      return (
                        <div
                          key={q.id}
                          className={`relative glass-panel p-6 rounded-2xl border transition-all ${
                            isSelected
                              ? "border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.05)] bg-[#0d1c29]/70"
                              : "border-white/5 bg-slate-900/30 hover:border-slate-800"
                          }`}
                        >
                          {/* Card Badge Headers */}
                          <div className="flex justify-between items-start gap-4 pb-3 border-b border-white/5">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectQuestion(q.id)}
                                className="w-4 h-4 text-cyan-500 focus:ring-0 rounded bg-slate-950 border-slate-800 checked:bg-cyan-500 checked:border-cyan-400 cursor-pointer"
                              />
                              <div>
                                <h4 className="font-bold text-slate-200 text-sm md:text-md inline-flex items-center gap-1.5">
                                  {q.title}
                                  {q.isAiGenerated && (
                                    <span className="text-[10px] font-mono tracking-widest bg-cyan-950 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full flex items-center gap-0.5 font-bold uppercase animate-pulse">
                                      <Sparkles className="w-3 h-3 text-cyan-400" />
                                      AI VARIANT
                                    </span>
                                  )}
                                </h4>
                              </div>
                            </div>
                            <span
                              className={`text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full border ${
                                q.difficulty === "킬러"
                                  ? "border-rose-500/30 text-rose-400 bg-rose-550/10"
                                  : q.difficulty === "준킬러"
                                  ? "border-purple-500/30 text-purple-400 bg-purple-550/10"
                                  : "border-slate-700 text-slate-400 bg-slate-900/50"
                              }`}
                            >
                              {q.difficulty}
                            </span>
                          </div>

                          {/* Math 지문 content */}
                          <div className="py-4 select-text">
                            <MathRenderer text={q.content} />
                          </div>

                          {/* options list displays */}
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pb-4">
                            {q.options.map((opt, oIdx) => {
                              const isCorrect = oIdx === q.correctAnswer;
                              return (
                                <div
                                  key={`opt-view-${q.id}-${oIdx}`}
                                  className={`p-2 rounded-xl border text-xs text-center border-dashed ${
                                    isCorrect
                                      ? "border-emerald-500/40 text-emerald-300 bg-emerald-900/10 font-bold"
                                      : "border-white/5 text-slate-400"
                                  }`}
                                >
                                  <span className="opacity-45 block text-[10px] uppercase font-mono">보기 {oIdx + 1}</span>
                                  <span className="truncate">{opt}</span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Explanation wrap block */}
                          {q.explanation && (
                            <div className="bg-slate-950/40 p-3 rounded-xl text-xs text-slate-500 border border-white/5 font-serif mb-4 italic leading-relaxed">
                              해설: {q.explanation}
                            </div>
                          )}

                          {/* Action panel triggers inside specific card items */}
                          <div className="flex justify-between items-center bg-slate-950/20 top-border px-1.5 py-1 rounded-lg">
                            <span className="text-[10px] font-mono text-slate-500">ID: {q.id}</span>

                            {!q.isAiGenerated && (
                              <button
                                type="button"
                                disabled={isGenerating !== null}
                                onClick={() => handleAIGenerateVariant(q.id)}
                                className={`px-4 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1 bg-gradient-to-r from-purple-900/60 to-cyan-900/60 border border-cyan-500/30 text-cyan-300 hover:from-purple-800 hover:to-cyan-800 transition-all ${
                                  isGenerating === q.id ? "cursor-not-allowed opacity-50" : ""
                                }`}
                              >
                                {isGenerating === q.id ? (
                                  <>
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-300" />
                                    <span>AI 출제위원 작동 중...</span>
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:animate-bounce" />
                                    <span>AI 수학 변형생성</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* RIGHT: Selected Quizzes list and Launch panel */}
              <div className="lg:col-span-4 space-y-6">
                <div className="glass-panel p-6 rounded-3xl border border-white/5 text-center min-h-[300px] flex flex-col justify-between shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/5 rounded-full blur-2xl pointer-events-none" />

                  <div className="space-y-4">
                    <div className="bg-cyan-500/10 p-4 rounded-full w-fit mx-auto border border-cyan-500/20">
                      <Layers className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold font-display uppercase tracking-widest text-white">QUIZ SEED SET</h4>
                      <p className="text-xs text-slate-400">선택된 아래 문제 세트들로 실시간 카훗식 경기 세션을 구성합니다.</p>
                    </div>

                    <div className="py-2 border-y border-white/5 max-h-[160px] overflow-y-auto space-y-1.5 pr-1">
                      {selectedQuestionIds.length === 0 ? (
                        <p className="text-xs text-slate-500 italic py-4">선택된 수능 문제가 없습니다</p>
                      ) : (
                        selectedQuestionIds.map(id => {
                          const matched = questions.find(q => q.id === id);
                          return (
                            <div key={`sel-badge-${id}`} className="flex items-center justify-between bg-slate-950/60 p-2.5 rounded-xl border border-white/5 text-xs text-left">
                              <span className="font-bold text-slate-300 truncate max-w-[170px]">{matched?.title || id}</span>
                              <button
                                onClick={() => toggleSelectQuestion(id)}
                                className="text-slate-500 hover:text-red-400 hover:bg-slate-900 p-1 rounded-lg"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="pt-6">
                    <div className="flex justify-between text-xs font-mono text-slate-400 pb-2">
                      <span>선택한 문항 개수:</span>
                      <span className="font-bold text-cyan-400">{selectedQuestionIds.length}개</span>
                    </div>

                    <button
                      onClick={handleHostLaunchGame}
                      disabled={selectedQuestionIds.length === 0}
                      className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-500 text-white font-bold py-4.5 rounded-2xl tracking-widest transition-all text-sm uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                    >
                      <Play className="w-5 h-5 text-cyan-200 fill-current" />
                      <span>개설하기 (OPEN GAME ARENA)</span>
                    </button>
                  </div>
                </div>

                {/* Helpful tips panel */}
                <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-3">
                  <h5 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <AlertCircle className="w-4.5 h-4.5 text-cyan-400" />
                    교사용 가이드라인
                  </h5>
                  <ul className="space-y-2 text-xs text-slate-400 leading-relaxed list-disc list-inside">
                    <li>수동 출제를 한 후 개별 아이템들의 <strong className="text-purple-300">"AI 수학 변형생성"</strong>을 시도해 보세요.</li>
                    <li>Gemini에 의해 생성된 정답과 수식은 수능 시험의 엄격함에 부응하도록 철저히 가공되어 추가됩니다.</li>
                    <li>모의 경기 시작 시, 개설된 PIN Code를 교실 보드에 공유하고 학생들이 입장하면 시작 단추를 누릅니다.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* STATE 2: HOST ACTIVE SESSION VIEW (CONTROL ROOM) */}
          {role === "HOST" && hostActivePin && hostSession && (
            <motion.div
              key="host-game-session"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto w-full space-y-6 z-10"
              id="host-game-session"
            >
              {/* LOBBY OR ROUND HEADERS */}
              <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0_0_30px_rgba(34,211,238,0.05)]">
                <div>
                  <span className="text-xs font-mono uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-3 py-1 rounded-full">
                    Active Game Console (Status: {hostSession.status})
                  </span>
                  <div className="flex items-center gap-1 mt-2.5">
                    <span className="text-slate-400 text-lg font-bold font-display uppercase">ROOM GAME PIN:</span>
                    <h2 className="text-5xl font-extrabold font-display tracking-widest text-cyan-400 neon-glow-cyan bg-slate-950 px-5 py-2 rounded-2xl border border-cyan-500/30">
                      {hostActivePin}
                    </h2>
                  </div>
                </div>

                {/* Question index tracker */}
                {hostSession.status !== "LOBBY" && hostSession.status !== "PODIUM" && (
                  <div className="flex items-center gap-4 bg-slate-950 px-5 py-3 rounded-2xl border border-white/5">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-[10px] text-slate-500 font-mono uppercase uppercase">Current Round</p>
                      <h4 className="font-bold font-display text-lg text-slate-200">
                        Q{hostSession.currentQuestionIndex + 1} of {hostSession.questions.length}
                      </h4>
                    </div>
                  </div>
                )}

                {/* Active Dynamic Progress Actions */}
                <div className="flex items-center gap-3">
                  {hostSession.status === "LOBBY" && (
                    <button
                      onClick={() => handleAdvanceStage("INTRO")}
                      disabled={hostSession.players.length === 0}
                      className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold rounded-2xl text-lg hover:scale-105 active:scale-95 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                      id="start-session-btn"
                    >
                      아레나 시작 (START GAME)
                    </button>
                  )}

                  {hostSession.status === "PLAY" && (
                    <div className="bg-rose-500/10 px-6 py-3 rounded-2xl border border-rose-500/20 flex items-center gap-2 text-rose-400">
                      <Clock className="w-6 h-6 animate-spin text-rose-400" />
                      <span className="font-display font-extrabold text-2xl tracking-tighter">
                        {hostSession.timerSeconds}s
                      </span>
                    </div>
                  )}

                  {hostSession.status === "REVEAL" && (
                    <button
                      onClick={() => handleAdvanceStage("LEADERBOARD")}
                      className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500 active:scale-95 transition-all"
                    >
                      점수판 확인 (SHOW SCOREBOARD)
                    </button>
                  )}

                  {hostSession.status === "LEADERBOARD" && (
                    <button
                      onClick={() => {
                        if (hostSession.currentQuestionIndex >= hostSession.questions.length - 1) {
                          handleAdvanceStage("PODIUM");
                        } else {
                          handleAdvanceStage("NEXT_QUESTION");
                        }
                      }}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-xl active:scale-95 transition-all"
                    >
                      {hostSession.currentQuestionIndex >= hostSession.questions.length - 1
                        ? "시상식 최종 집계 (SHOW PODIUM)"
                        : "다음 문항 이동 (NEXT QUESTION)"}
                    </button>
                  )}

                  {hostSession.status === "PODIUM" && (
                    <button
                      onClick={() => {
                        setHostActivePin(null);
                        setHostSession(null);
                      }}
                      className="px-6 py-3 bg-slate-900 border border-slate-800 text-cyan-400 font-bold rounded-xl hover:bg-slate-800"
                    >
                      게임 끝내고 복귀
                    </button>
                  )}
                </div>
              </div>

              {/* STAGE MAIN INTERFACE VIEWS */}
              <div className="grid lg:grid-cols-12 gap-8">
                {/* Left Panel: Active Participant List (3 columns) */}
                <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                      <Users className="w-4 h-4 text-cyan-400" />
                      참가 유저 ({hostSession.players.length})
                    </h3>
                  </div>

                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                    {hostSession.players.length === 0 ? (
                      <div className="text-center py-12 text-slate-500 text-xs italic">
                        학생들이 PIN {hostActivePin}을 입력하고 들어오길 기다리는 중입니다...
                      </div>
                    ) : (
                      hostSession.players.map((p, idx) => (
                        <div
                          key={`host-p-${p.uuid}`}
                          className={`flex justify-between items-center p-3 rounded-xl border text-sm transition-all duration-300 ${
                            p.isDisconnected
                              ? "bg-slate-950/40 border-dashed border-red-500/20 text-slate-500"
                              : "bg-slate-900/60 border-white/5 text-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-slate-500">#{idx + 1}</span>
                            <span className="font-bold truncate max-w-[150px]">{p.nickname}</span>
                            {p.streak >= 3 && !p.isDisconnected && (
                              <span className="text-xs animate-bounce" title={`${p.streak} 연승중!`}>🔥</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {hostSession.status === "PLAY" && (
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                                  p.isSubmitted
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold"
                                    : "bg-slate-800 text-slate-500 animate-pulse"
                                }`}
                              >
                                {p.isSubmitted ? "SUBMITTED" : "THINKING"}
                              </span>
                            )}
                            <span className="font-mono font-bold text-xs text-cyan-400">{p.score} pts</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right Panel: Main interactive display stage (8 columns) */}
                <div className="lg:col-span-8 glass-panel p-8 rounded-3xl border border-white/5 min-h-[480px] flex flex-col justify-center relative overflow-hidden">
                  
                  {/* SUBSTAGE A: LOBBY INSTRUCTION SCREEN */}
                  {hostSession.status === "LOBBY" && (
                    <div className="text-center space-y-6 py-10">
                      <div className="relative inline-block">
                        <div className="w-16 h-16 bg-cyan-500/10 rounded-full animate-ping absolute inset-0 text-cyan-400" />
                        <div className="w-16 h-16 bg-slate-900 border border-cyan-500/50 rounded-full flex items-center justify-center relative shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                          <Radio className="w-7 h-7 text-cyan-400 animate-pulse" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-3xl font-bold text-cyan-100">학생 접속을 개시하세요</h3>
                        <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
                          학생들의 모바일 또는 PC 기기에서 <strong>NEON MATH</strong>에 접속한 뒤 비밀번호 <span className="text-cyan-300 font-mono font-bold">{hostActivePin}</span>을 치고 들어오도록 배포하세요.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* SUBSTAGE B: INTRO QUESTION BRIEF */}
                  {hostSession.status === "INTRO" && currentHostQuestion && (
                    <div className="text-center space-y-10 py-8 animate-pulse-slow">
                      <span className="text-xs uppercase font-mono tracking-widest text-[#a855f7] bg-purple-950 border border-purple-500/30 px-3 py-1 rounded-full font-bold">
                        Question Countdown Intro
                      </span>
                      <div className="space-y-4">
                        <p className="text-slate-400 text-xs font-mono">ROUND {hostSession.currentQuestionIndex + 1}</p>
                        <h2 className="text-4xl font-extrabold tracking-tight font-display text-white">
                          {currentHostQuestion.title}
                        </h2>
                        <div className="text-sm bg-slate-950 px-4 py-2 text-slate-400 rounded-full w-fit mx-auto border border-white/5">
                          난이도: <strong className="text-purple-400">{currentHostQuestion.difficulty}</strong> | 정답 제한 시간: 180초
                        </div>
                      </div>

                      {/* Giant countdown timer */}
                      <div className="relative w-28 h-28 mx-auto flex items-center justify-center rounded-full bg-slate-900 border-2 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                        <span className="text-5xl font-mono font-extrabold text-[#a855f7] animate-[ping_1s_infinite]">
                          {hostSession.timerSeconds}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* SUBSTAGE C: PLAY SCREEN (THE ACTIVE QUESTION DRAW) */}
                  {hostSession.status === "PLAY" && currentHostQuestion && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center pb-2 border-b border-white/5">
                        <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase">ACTIVE CONTEST</span>
                        <div className="text-xs font-mono text-slate-400 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-cyan-400" />
                          <span>제출 현황: {hostSession.players.filter(p => p.isSubmitted).length} / {hostSession.players.length} 명</span>
                        </div>
                      </div>

                      {/* Line gradient countdown timer bar */}
                      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-rose-500 rounded-full transition-all duration-1000"
                          style={{ width: `${(hostSession.timerSeconds / 180) * 100}%` }}
                        />
                      </div>

                      {/* Gorgeous equation blocks */}
                      <div className="bg-slate-950/80 p-8 rounded-2xl border border-white/10 shadow-inner select-text">
                        <MathRenderer text={currentHostQuestion.content} />
                      </div>

                      {/* Display of choices */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        {currentHostQuestion.options.map((opt, oIdx) => (
                          <div
                            key={`host-opt-${oIdx}`}
                            className="bg-slate-900/60 p-4 rounded-xl border border-white/5 text-sm flex items-center gap-3"
                          >
                            <span className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-mono">
                              {oIdx + 1}
                            </span>
                            <span className="text-slate-300 font-medium">{opt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SUBSTAGE D: ANSWER REVEAL WITH MINIMAL NEON BAR CHART */}
                  {hostSession.status === "REVEAL" && currentHostQuestion && (
                    <div className="space-y-6 py-4">
                      <div className="text-center">
                        <span className="text-xs font-mono tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full">
                          Answer Reveal Analysis
                        </span>
                        <h3 className="text-xl font-bold text-slate-200 mt-2">정답 집계 및 해설</h3>
                      </div>

                      <div className="grid md:grid-cols-12 gap-8 items-center pt-2">
                        {/* Custom Neon vector SVG charts representation (6 cols) */}
                        <div className="md:col-span-7 h-[220px] flex items-end justify-between px-6 pb-2 pt-10 border-b border-l border-white/10 relative">
                          <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">응답자 분포 수</div>
                          {optionTalies.map((val, idx) => {
                            const isCorrect = idx === currentHostQuestion.correctAnswer;
                            const total = optionTalies.reduce((a, b) => a + b, 0) || 1;
                            const percentage = (val / total) * 100;
                            return (
                              <div key={`reveal-bar-${idx}`} className="flex flex-col items-center gap-2 flex-grow mx-2">
                                <span className="text-xs font-mono font-bold text-slate-300">{val}명</span>
                                <div className="w-full relative bg-slate-900 rounded-t-lg overflow-hidden flex items-end min-h-[4px]" style={{ height: `${Math.max(percentage * 1.5, 4)}px` }}>
                                  <div
                                    className={`w-full rounded-t-lg transition-all duration-1000 ${
                                      isCorrect
                                        ? "bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse"
                                        : "bg-slate-800"
                                    }`}
                                  />
                                </div>
                                <span className={`w-6 h-6 rounded-md text-[11px] font-bold flex items-center justify-center ${
                                  isCorrect ? "bg-emerald-500 text-slate-950 font-extrabold" : "bg-slate-900 text-slate-500"
                                }`}>
                                  {idx + 1}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Equation solution sidebar answers */}
                        <div className="md:col-span-5 space-y-4">
                          <div className="bg-emerald-950/30 p-4 rounded-xl border border-emerald-500/30 relative">
                            <h4 className="text-xs uppercase tracking-wider text-emerald-400 font-bold mb-1.5 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              CORRECT ANSWER
                            </h4>
                            <p className="text-slate-100 text-lg font-bold font-mono">
                              보기 {currentHostQuestion.correctAnswer + 1}번 (값: {currentHostQuestion.options[currentHostQuestion.correctAnswer]})
                            </p>
                          </div>

                          <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 text-xs text-slate-400 leading-relaxed max-h-[140px] overflow-y-auto">
                            <strong className="text-slate-200 block mb-1">상세 문제 해설 요약:</strong>
                            {currentHostQuestion.explanation}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUBSTAGE E: LEADERBOARD ROWS TRANSITION WITH SCOREBOARD DELTA */}
                  {hostSession.status === "LEADERBOARD" && (
                    <div className="space-y-5 py-4 w-full">
                      <div className="text-center">
                        <span className="text-xs uppercase font-mono tracking-widest text-cyan-400 bg-cyan-950 border border-cyan-500/20 px-3 py-1 rounded-full">
                          Scoreboard Rankings
                        </span>
                        <h3 className="text-2xl font-bold font-display uppercase tracking-widest text-[#a855f7] neon-glow-purple mt-2">
                          ROUND BOARD
                        </h3>
                      </div>

                      <div className="space-y-2.5 max-w-xl mx-auto pt-2">
                        {hostSession.players.length === 0 ? (
                          <div className="text-center text-slate-600 py-10">출석부 데이터가 비어 있습니다.</div>
                        ) : (
                          [...hostSession.players]
                            .sort((a, b) => b.score - a.score)
                            .slice(0, 5)
                            .map((p, pIdx) => (
                              <div
                                key={`lb-row-${p.uuid}`}
                                className="flex items-center justify-between bg-slate-900/60 border border-white/5 rounded-2xl p-4 transition-all hover:border-purple-500/20"
                              >
                                <div className="flex items-center gap-4">
                                  <span className="font-display font-black text-xl text-slate-400 w-6 text-center">
                                    {pIdx + 1}
                                  </span>
                                  {p.rankChange > 0 && (
                                    <span className="text-emerald-400 flex items-center text-xs font-mono" title="순위 상승!">
                                      <ArrowUp className="w-3.5 h-3.5 animate-bounce inline" />
                                      {p.rankChange}
                                    </span>
                                  )}
                                  {p.rankChange < 0 && (
                                    <span className="text-red-400 flex items-center text-xs font-mono" title="순위 하락">
                                      <ArrowDown className="w-3.5 h-3.5 inline" />
                                      {Math.abs(p.rankChange)}
                                    </span>
                                  )}
                                  {p.rankChange === 0 && <span className="text-xs font-mono text-slate-600 font-bold px-1.5"><Minus className="w-2.5 h-2.5" /></span>}
                                  
                                  <span className="text-md font-bold text-slate-200">{p.nickname}</span>
                                  
                                  {p.streak >= 3 && (
                                    <span className="text-xs bg-purple-950 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full flex items-center gap-0.5 font-bold uppercase animate-[pulse_2s_infinite]">
                                      <Flame className="w-3 h-3 text-[#a855f7]" />
                                      {p.streak} COMBO
                                    </span>
                                  )}
                                </div>
                                <span className="font-mono text-cyan-400 font-extrabold text-lg">{p.score} pts</span>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* SUBSTAGE F: THE FINALE 3D PODIUM REVEAL STAGE */}
                  {hostSession.status === "PODIUM" && (
                    <div className="space-y-6 py-6 text-center w-full">
                      <div className="text-center space-y-1">
                        <span className="text-xs uppercase font-mono tracking-widest text-[#a855f7] bg-purple-950 border border-purple-500/30 px-3 py-1 rounded-full font-bold">
                          The Grand Finale
                        </span>
                        <h2 className="text-4xl font-black font-display bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                          CHAMPIONS PODIUM
                        </h2>
                      </div>

                      {/* Staggered Vertical Podium display lift structure */}
                      <div className="flex items-end justify-center gap-6 min-h-[180px] pt-12 pb-2 max-w-xl mx-auto border-b border-white/5 relative">
                        {/* 2ND PLACE (LEFT) */}
                        {podiumData[1] && (
                          <div className="flex flex-col items-center gap-1.5 w-1/3 animate__animated animate__slideInUp">
                            <span className="text-xs font-bold text-slate-300 truncate max-w-[80px]">{podiumData[1].nickname}</span>
                            <span className="text-[10px] font-mono text-cyan-400">{podiumData[1].score} pts</span>
                            <div className="w-full bg-slate-800 hover:bg-slate-750 border-t border-x border-slate-700/60 rounded-t-xl h-[80px] flex items-center justify-center font-display font-black text-2xl text-slate-400">
                              2
                            </div>
                          </div>
                        )}

                        {/* 1ST PLACE (CENTER) */}
                        {podiumData[0] && (
                          <div className="flex flex-col items-center gap-1.5 w-1/3 animate__animated animate__slideInUp" style={{ animationDelay: "0.2s" }}>
                            <span className="text-amber-400 animate-bounce text-sm">👑</span>
                            <span className="text-md font-extrabold text-amber-300 truncate max-w-[90px]">{podiumData[0].nickname}</span>
                            <span className="text-xs font-mono text-cyan-400">{podiumData[0].score} pts</span>
                            <div className="w-full bg-gradient-to-t from-slate-900 to-amber-950 hover:to-amber-900 border-t-2 border-x border-amber-500 rounded-t-xl h-[120px] flex items-center justify-center font-display font-black text-4xl text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
                              1
                            </div>
                          </div>
                        )}

                        {/* 3RD PLACE (RIGHT) */}
                        {podiumData[2] && (
                          <div className="flex flex-col items-center gap-1.5 w-1/3 animate__animated animate__slideInUp" style={{ animationDelay: "0.4s" }}>
                            <span className="text-xs font-bold text-slate-400 truncate max-w-[80px]">{podiumData[2].nickname}</span>
                            <span className="text-[10px] font-mono text-cyan-400">{podiumData[2].score} pts</span>
                            <div className="w-full bg-slate-900 hover:bg-slate-850 border-t border-x border-slate-800 rounded-t-xl h-[60px] flex items-center justify-center font-display font-black text-xl text-slate-500">
                              3
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Giant cheer speech scroll for outstanding contestants */}
                      {podiumData.length > 0 && (
                        <div className="glass-panel p-5 rounded-2xl max-w-xl mx-auto border border-amber-500/25 bg-[#211603]/40 text-center animate__animated animate__fadeIn">
                          <p className="text-amber-200 text-sm italic font-serif leading-relaxed">
                            "{podiumData[0].cheer}"
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          )}

          {/* STATE 3: STUDENT GAMEPLAY EXPERIENCE */}
          {role === "STUDENT" && studentJoined && (
            <motion.div
              key="student-game-session"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto w-full space-y-6 z-10"
              id="student-game-session"
            >
              {/* STUDENT HUD STATUS BANNER */}
              <div className="glass-panel p-4.5 rounded-2xl border border-white/5 flex justify-between items-center bg-slate-900/40">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center font-bold text-cyan-400 font-mono">
                    S
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-200 leading-none">{studentNickname}</h3>
                    <span className="text-[10px] text-slate-500 font-mono uppercase">Arena Competitor</span>
                  </div>
                </div>

                {studentSession && (
                  <div className="flex items-center gap-4">
                    {studentSession.players.find(p => p.uuid === uuid)?.streak ? (
                      <div className="text-xs bg-purple-950 text-purple-300 border border-purple-500/20 px-3 py-1 rounded-full font-mono font-bold flex items-center gap-0.5 animate-pulse">
                        <Flame className="w-3.5 h-3.5 text-[#a855f7]" />
                        <span>{studentSession.players.find(p => p.uuid === uuid)?.streak} STRAIGHTS</span>
                      </div>
                    ) : null}
                    
                    <div className="text-right">
                      <p className="text-[9px] text-slate-500 font-mono uppercase leading-none">Your Score</p>
                      <h4 className="font-mono font-black text-cyan-400 text-lg">
                        {studentSession.players.find(p => p.uuid === uuid)?.score || 0} pts
                      </h4>
                    </div>
                  </div>
                )}
              </div>

              {/* STAGE RENDERS ACCORDING TO SESSION STATUS */}
              {!studentSession ? (
                <div className="glass-panel p-12 text-center rounded-3xl border border-white/5 space-y-4">
                  <RefreshCw className="w-8 h-8 animate-spin text-cyan-400 mx-auto" />
                  <p className="text-slate-400 text-xs">안전지대 세션을 로드하고 연동하는 중입니다...</p>
                </div>
              ) : (
                <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 min-h-[425px] flex flex-col justify-center relative overflow-hidden">
                  
                  {/* PLAY STAGE TICKER PROGRESS BAR */}
                  {studentSession.status === "PLAY" && (
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-slate-950 w-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-rose-500 transition-all duration-1000"
                        style={{ width: `${(studentSession.timerSeconds / 180) * 100}%` }}
                      />
                    </div>
                  )}

                  {/* LOBBY PHASE */}
                  {studentSession.status === "LOBBY" && (
                    <div className="text-center space-y-6 py-6">
                      <div className="w-16 h-16 bg-cyan-950/40 border border-cyan-500/20 rounded-full flex items-center justify-center mx-auto">
                        <Users className="w-7 h-7 text-cyan-400 animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-2xl font-bold text-slate-200">대기실에서 수기를 가다듬는 중</h3>
                        <p className="text-slate-500 text-xs">호스트(교사)가 수학 결전을 개시하기까지 긴장을 늦추지 마세요.</p>
                      </div>
                      <div className="bg-slate-950 px-5 py-3 rounded-2xl max-w-sm mx-auto flex justify-between items-center border border-white/5">
                        <span className="text-xs font-mono text-slate-400">대기 중인 아레나 PIN</span>
                        <span className="font-display font-extrabold text-cyan-400 text-xl tracking-widest">{studentPin}</span>
                      </div>
                    </div>
                  )}

                  {/* INTROSTAGE COUNTDOWN */}
                  {studentSession.status === "INTRO" && currentStudentQuestion && (
                    <div className="text-center space-y-8 py-6 animate-pulse">
                      <span className="text-xs uppercase font-mono tracking-widest text-[#a855f7] bg-purple-950 px-3 py-1 rounded-full font-bold border border-purple-500/30">
                        ROUND {studentSession.currentQuestionIndex + 1}
                      </span>
                      <div className="space-y-2">
                        <p className="text-xs text-slate-500 font-mono">가장 고도의 추론 문제가 출제 중입니다</p>
                        <h2 className="text-3xl font-extrabold text-slate-100 font-display">
                          {currentStudentQuestion.title}
                        </h2>
                      </div>
                      <div className="w-20 h-20 bg-slate-900 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto text-4xl font-mono text-[#a855f7] animate-ping">
                        {studentSession.timerSeconds}
                      </div>
                    </div>
                  )}

                  {/* ACTIVE QUIZ PLAY */}
                  {studentSession.status === "PLAY" && currentStudentQuestion && (
                    <div className="space-y-6">
                      {/* Subtitle status lines */}
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-slate-500 tracking-wider">CHALLENGE STATEMENT</span>
                        <span className="text-xs font-mono text-rose-400 font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 animate-pulse" />
                          {studentSession.timerSeconds}초 남음
                        </span>
                      </div>

                      {/* Central responsive LaTeX Math content rendering */}
                      <div className="bg-slate-950/80 p-6 rounded-2xl border border-white/10 select-text">
                        <MathRenderer text={currentStudentQuestion.content} />
                      </div>

                      {/* Display of interactive choices buttons */}
                      {selectedChoice !== null ? (
                        <div className="bg-slate-950/40 p-10 border border-dashed border-cyan-500/20 rounded-2xl text-center space-y-4">
                          <CheckCircle className="w-10 h-10 text-cyan-400 animate-bounce mx-auto" />
                          <div className="space-y-1">
                            <h4 className="text-md font-bold text-slate-200">정답을 성공정으로 전송하였습니다</h4>
                            <p className="text-slate-500 text-xs text-slate-400">
                              제출한 선택지: <strong className="text-cyan-400 font-mono font-bold text-md">{selectedChoice + 1}번</strong>
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
                          {currentStudentQuestion.options.map((opt, oIdx) => (
                            <button
                              key={`stu-opt-${oIdx}`}
                              onClick={() => handleAnswerSubmit(oIdx)}
                              className="group glass-button p-4.5 rounded-2xl text-center cursor-pointer relative overflow-hidden flex flex-col justify-between items-center transition-all duration-300 hover:scale-[1.03] active:scale-95"
                            >
                              <span className="w-7 h-7 rounded-xl bg-slate-950 border border-white/10 group-hover:border-cyan-400/40 group-hover:text-cyan-400 text-slate-400 flex items-center justify-center font-bold text-xs font-mono mb-2">
                                {oIdx + 1}
                              </span>
                              <span className="text-slate-300 font-semibold text-sm truncate max-w-[100px]" title={opt}>
                                {opt}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* REVEAL PHASE FOR STUDENT */}
                  {studentSession.status === "REVEAL" && currentStudentQuestion && (
                    <div className="text-center space-y-6 py-6 font-display">
                      {selectedChoice === currentStudentQuestion.correctAnswer ? (
                        <div className="space-y-3">
                          <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
                          <h2 className="text-4xl font-extrabold text-emerald-400 neon-glow-cyan leading-tight uppercase">
                            정답입니다! + {studentSession.players.find(p => p.uuid === uuid)?.lastScoreAdded || 400} PTS
                          </h2>
                          <p className="text-slate-400 text-xs leading-relaxed max-w-sm mx-auto">
                            탁월한 속도와 수식에 대한 기민함이 가산점의 발판이 되었습니다.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <XCircle className="w-16 h-16 text-rose-500 mx-auto animate-shake" />
                          <h2 className="text-3xl font-extrabold text-rose-400 uppercase">
                            아쉬운 오답 🥲
                          </h2>
                          <p className="text-slate-400 text-xs leading-relaxed max-w-sm mx-auto">
                            정답은 {currentStudentQuestion.correctAnswer + 1}번 (값: {currentStudentQuestion.options[currentStudentQuestion.correctAnswer]}) 이었습니다. 해설을 딛고 다음 스테이지에서 승기를 잡으세요!
                          </p>
                        </div>
                      )}

                      <div className="bg-slate-950 p-4 rounded-xl border border-white/5 max-w-md mx-auto text-xs text-slate-400 text-left font-serif leading-relaxed italic">
                        <strong>상세 실전 해설:</strong> {currentStudentQuestion.explanation}
                      </div>
                    </div>
                  )}

                  {/* LEADERBOARD VIEW ON STUDNET DEIVCE */}
                  {studentSession.status === "LEADERBOARD" && (
                    <div className="text-center space-y-6 py-6 w-full font-display">
                      <div className="w-12 h-12 bg-purple-950 border border-purple-500/20 rounded-full flex items-center justify-center mx-auto text-xl">
                        🏆
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-500 text-xs uppercase uppercase">현재 스탠딩</p>
                        <h2 className="text-3xl font-black text-slate-100 font-display uppercase tracking-wider">
                          SCORE BOARD RANKING
                        </h2>
                      </div>

                      {/* Extract my specific ranking details inside active lobby */}
                      {(() => {
                        const sorted = [...studentSession.players].sort((a, b) => b.score - a.score);
                        const myIdx = sorted.findIndex(p => p.uuid === uuid);
                        const myState = sorted[myIdx];

                        if (!myState) return <p className="text-slate-500 text-xs">스탠딩 분석 도중 오류가 감지되었습니다.</p>;

                        return (
                          <div className="bg-slate-900 border border-purple-500/20 max-w-md mx-auto p-6 rounded-2xl space-y-3 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl font-mono" />
                            <div className="flex justify-between items-center">
                              <span className="text-xs uppercase font-mono text-slate-400 block">수험생 석차</span>
                              <span className="font-extrabold text-cyan-400 text-2xl font-display">#{myIdx + 1}위 / {sorted.length}명</span>
                            </div>

                            <div className="flex justify-between items-center text-sm border-t border-white/5 pt-2.5">
                              <span className="text-xs text-slate-450 block">현재 보유 등급 포인트:</span>
                              <span className="font-mono text-slate-200 font-bold">{myState.score} pts</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* PODIUM FINAL RESULTS */}
                  {studentSession.status === "PODIUM" && (
                    <div className="text-center space-y-6 py-6 select-text">
                      <div className="w-16 h-16 bg-amber-950/40 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-3xl">
                        🎓
                      </div>
                      <div className="space-y-2">
                        <span className="text-amber-400 text-xs font-bold font-mono tracking-widest uppercase">Battle Arena Finished</span>
                        <h2 className="text-3xl font-extrabold text-slate-100">최종 대결 시상식</h2>
                        <p className="text-slate-400 text-xs leading-none max-w-xs mx-auto">수능 수학 AI 변형 퀴즈 레이스가 공식 완성되었습니다!</p>
                      </div>

                      {studentCheer && (
                        <div className="bg-[#211603]/60 p-5 rounded-2xl max-w-md mx-auto border border-amber-500/30 font-serif italic text-sm text-amber-200 leading-relaxed shadow-lg shadow-amber-500/5">
                          "{studentCheer}"
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* CORE FOOTER BRAND */}
      <footer className="py-4 text-center text-[10px] font-mono text-slate-600 tracking-wider">
        <span>© 2026 CSAT NEON CHALLENGE CO. ALL RIGHTS RESERVED.</span>
      </footer>
    </div>
  );
}
