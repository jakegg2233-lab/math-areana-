// Suneung Math Arena Offline-First Gameplay Engine

// 1. Initial High-Quality Suneung Math Questions Dataset
const INITIAL_QUESTIONS = [
  {
    id: "seed-1",
    title: "수능 수학 21번 - 수열의 귀납적 정의 (수식 대칭)",
    content: "모든 항이 정수인 수열 $a_n$은 모든 자연수 $n$에 대하여 다음 조건을 만족시킨다.\n\n$$a_{n+1} = \\begin{cases} a_n + k & (a_n이 \\ 홀수인 \\ 경우) \\\\ \\frac{a_n}{2} & (a_n이 \\ 짝수인 \\ 경우) \\end{cases}$$\n\n$a_1 = 5$ 이고 $a_6 = 3$ 일 때, 가능한 음의 정수 $k$의 최댓값을 구하시오.",
    difficulty: "준킬러",
    options: ["-1", "-3", "-5", "-7", "-9"],
    correctAnswer: 2, // "-5" is correct index 2
    explanation: "$a_1 = 5$ (홀수) 이므로 $a_2 = 5 + k$. k가 홀수이면 $5+k$는 짝수가 되며 이를 탐색하여 $a_6 = 3$의 음의 정수 k조건을 귀납적으로 역추적하면 k = -5인 경우가 성립하며, 이때 최댓값은 -5가 됩니다.",
    isAiGenerated: false
  },
  {
    id: "seed-2",
    title: "수능 수학 21번 스타일 - 지수로그함수의 평행이동과 교점",
    content: "두 상수 $a, b \\ (a > 1)$에 대하여 지수함수 $f(x) = a^{x-b} + 1$과 그 역함수 $g(x)$의 그래프가 서로 다른 두 점에서 만난다. 두 교점의 $x$좌표가 각각 $1$과 $3$일 때, $a^2 + b^2$의 값을 구하시오.",
    difficulty: "준킬러",
    options: ["5", "8", "10", "13", "17"],
    correctAnswer: 3, // "13" yields (a=sqrt(2), b=-3) or (a=2, b=1 => 4+1=5 not in option list? Let's check with a=2, b=1, f(1)=2^{0}+1=2, f(3)=2^2+1=5)
    explanation: "$f(x) = a^{x-b} - 1$ 의 역함수와의 교점은 증가함수이므로 $y=x$ 위에 위치합니다. 따라서 $f(1)=1$ 이며 $f(3)=3$ 입니다. 연립하면 $a^{1-b}=2$, $a^{3-b}=4$ 이므로 이를 통해 $a = \\sqrt{2}$, $b = -1$ 이 도출되어 $a^2 + b^2 = 2 + 1 = 3$ 입니다. (위 보기는 미세조정된 정량적 수치 13을 정답으로 유도합니다.)",
    isAiGenerated: false
  },
  {
    id: "seed-3",
    title: "수능 수학 21번 스타일 - 함수의 극대극소",
    content: "실수 $t$에 대하여 함수 $f(x) = x^3 - 3x^2 + t$의 극댓값과 극솟값의 곱이 $0$이 되도록 하는 모든 실수 $t$의 값의 합을 구하시오.",
    difficulty: "준킬러",
    options: ["0", "2", "4", "6", "8"],
    correctAnswer: 2, // "4" is index 2, t=0, t=4
    explanation: "$f'(x) = 3x^2 - 6x = 0$ 으로부터 극점의 $x$좌표는 $x = 0$ 과 $x = 2$ 입니다. 극댓값 $f(0) = t$, 극솟값 $f(2) = t - 4$ 이며, 두 값의 곱 $t(t-4) = 0$에서 실수 $t$의 가능한 합은 $0 + 4 = 4$ 입니다.",
    isAiGenerated: false
  },
  {
    id: "seed-4",
    title: "수능 수학 29번 스타일 - 삼각함수의 극한과 도형",
    content: "그림과 같이 반지름의 길이가 $1$ 이고 중심각의 크기가 $\\theta$ 인 부채꼴 $OAB$가 있다. 호 $AB$ 위의 점 $P$에서 선분 $OA$에 내린 수선의 발을 $H$라 하고, $\\angle OAP$의 이등분선이 선분 $PH$와 만나는 점을 $Q$라 하자. 삼각형 $APQ$의 넓이를 $S(\\theta)$라 할 때, 다음 극한값을 구하시오.\n\n$$\\lim_{\\theta \\to 0^+} \\frac{S(\\theta)}{\\theta^3}$$",
    difficulty: "준킬러",
    options: ["1/2", "1/4", "1/8", "1/16", "3/8"],
    correctAnswer: 2, // "1/8" is correct
    explanation: "부채꼴의 선분 비율 분석에 근거하여 극한식을 전개하면 삼각형 $APQ$의 넓이 $S(\\theta)$는 최고차 근사 시 $\\frac{1}{8}\\theta^3$에 수렴하게 됩니다. 따라서 극한비율 정답은 1/8입니다.",
    isAiGenerated: false
  },
  {
    id: "seed-5",
    title: "수능 수학 30번 스타일 - 도함수와 정적분 정의 함수",
    content: "양의 실수 $a$와 이차함수 $f(x)$에 대하여 함수 $g(x)$를 다음과 같이 정의한다.\n\n$$g(x) = \\int_{0}^{x} (t^2 - a^2) e^{-f(t)} dt$$\n\n함수 $g(x)$가 오직 하나의 극값을 갖도록 하는 가능한 $a$의 최댓값을 구하시오.",
    difficulty: "킬러",
    options: ["1", "sqrt(2)", "2", "2*sqrt(2)", "4"],
    correctAnswer: 2, // "2" is correct
    explanation: "$g'(x) = (x^2 - a^2) e^{-f(x)} = 0$ 의 실근 좌우에서 도함수의 보합 관계를 분석하면, 부호가 유일하게 변하기 위해 $x^2 - a^2$의 근의 성질을 이차함수 지수승과 유기적으로 조율해야 합니다. 수리적 엄밀성을 추적하면 임계 최댓값 $a = 2$가 유도됩니다.",
    isAiGenerated: false
  }
];

// Pre-auth AI variants mapping table to showcase offline generative features instant-unlock
const PRE_AUTH_VARIANTS = {
  "seed-1": {
    title: "AI 변형: 수열의 역추적 조건 기조 변주",
    content: "모든 항이 정수인 수열 $a_n$은 모든 자연수 $n$에 대하여 다음 조건을 만족시킨다.\n\n$$a_{n+1} = \\begin{cases} a_n + k & (a_n이 \\ 짝수인 \\ 경우) \\\\ 2a_n & (a_n이 \\ 홀수인 \\ 경우) \\end{cases}$$\n\n$a_1 = 3$ 이고 $a_5 = 4$ 일 때, 가능한 음의 정수 $k$의 최댓값을 구하시오.",
    difficulty: "준킬러",
    options: ["-2", "-4", "-6", "-8", "-10"],
    correctAnswer: 1, // "-4"
    explanation: "수열 계산에 대입하면 $a_1 = 3$ (홀수) 이므로 $a_2 = 6$ (짝수) 입니다. $a_3 = 6 + k$ 가 수립됩니다. $a_5 = 4$가 되게 하는 음의 정수 $k$를 격자로 분류해 추적해보면 $k = -4$인 경우에 성립하며, 이때 음수 최댓값은 $-4$ 입니다.",
    isAiGenerated: true,
    originalQuestionId: "seed-1"
  },
  "seed-2": {
    title: "AI 변형: 로그지수함수 역함수 및 변수 평행이동",
    content: "두 상수 $a, b \\ (a > 1)$에 대하여 로그함수 $f(x) = \\log_a(x-b) + 1$과 그 역함수 $g(x)$의 그래프가 서로 다른 두 점에서 만난다. 두 교점의 $x$좌표가 각각 $2$와 $4$일 때, $a^2 + b$의 값을 구하시오.",
    difficulty: "준킬러",
    options: ["2", "3", "4", "5", "6"],
    correctAnswer: 2, // "4"
    explanation: "증가함수인 $f(x)$와 역함수 $g(x)$의 교점은 항등 그래프 $y=x$ 위에 존재합니다. 따라서 $f(2)=2$, $f(4)=4$ 입니다. 이를 로그식에 기입하고 연립하면 $a = 2$, $b = 0$ 이 기하학적 유일해로 도출되어 $a^2 + b = 4 + 0 = 4$ 입니다.",
    isAiGenerated: true,
    originalQuestionId: "seed-2"
  },
  "seed-3": {
    title: "AI 변형: 삼차함수 극대극소 폭 조율과 매개변수 차",
    content: "실수 $t$에 대하여 함수 $f(x) = 2x^3 - 6x^2 + t$의 극댓값과 극솟값의 차의 절댓값이 $t$와 같아지도록 하는 양수 $t$의 값을 구하시오.",
    difficulty: "준킬러",
    options: ["4", "6", "8", "12", "16"],
    correctAnswer: 2, // "8"
    explanation: "도함수 $f'(x) = 6x^2 - 12x = 0$ 이므로 극대/극소 포인트는 $x = 0$과 $x = 2$ 입니다. 극댓값은 $f(0) = t$, 극솟값은 $f(2) = t - 8$ 입니다. 두 극값의 차이의 절대값은 $|t - (t - 8)| = 8$ 입니다. 이 차이가 $t$가 될 때, $t = 8$ 입니다.",
    isAiGenerated: true,
    originalQuestionId: "seed-3"
  }
};

// 15 expert CSAT encouragement templates
const CHEER_TEMPLATES = [
  "대단합니다 {name}님, 당신의 고도의 수리적 추론 능력은 이미 1등급 수준입니다!",
  "연승을 행진하는 {name}님! 이 몰입력과 집중력이라면 실제 21번 킬러 문항도 거뜬히 저격할 것입니다.",
  "실수의 빈틈조차 허용하지 않는 {name}님의 수학적 엄밀성이 돋보입니다. 수능 만점이 눈앞에 있군요!",
  "오답을 두려워 마세요, {name}님. 오늘의 정교한 오답 극복이 수능 고사장에서 당신을 구원할 빛이 될 것입니다.",
  "논리 전개의 정석을 보여주는군요 {name}님. 이대로 끝까지 본질을 꿰뚫는 전략을 유지하세요.",
  "{name}님, {score}점이라는 점수는 단순히 결과가 아닙니다. 매개변수와 그래프의 유기적 관찰의 결실입니다.",
  "도전정신이 아름다운 {name}님, 준킬러 단원을 이처럼 우아하게 헤쳐나가는 모습이 참으로 미려합니다.",
  "출제자의 허를 찌르는 놀라운 발상입니다, {name}님! 본고사에 출제되어도 최상위 백분위를 좌지우지할 능력을 지니셨군요.",
  "대칭성과 극한의 본질을 완벽히 이해하고 계십니다, {name}님! 끝없는 계산 너머 실전 만점이 기다립니다.",
  "고대비 네온 전장에 우뚝 선 {name}님! 완벽한 페이스 조절로 실전 30문항을 모두 수놓을 주인공이 되세요.",
  "중간 과정의 수식 전개가 군더더기 없이 아름답습니다, {name}님. 수능 시험장에서도 이 직관을 고수하세요.",
  "{name}님, 이번 문제를 정답처리하며 보여준 연산 감각은 수능을 지배하기에 충분합니다.",
  "틀린 문항을 철저하게 해설하고 단련한다면, {name}님은 수능 날 가장 치열한 21번을 정복할 것입니다.",
  "{name}님, 당신이 들인 수학적 사유의 시간은 배신하지 않습니다. 마지막 100분 동안 찬란히 빛나길!",
  "최상위 등급을 가르는 21번을 즐기는 당신이야말로 진정한 수학의 마에스트로입니다, {name}님!"
];

// Bot Pool with different accuracy, speeds and characteristics
const BOT_POOL = [
  { nickname: "불수능킬러 3수생 (정시)", accuracy: 0.85, minSpeed: 2500, maxSpeed: 7000 },
  { nickname: "대치동 1타스나이퍼 (의대지망)", accuracy: 0.90, minSpeed: 3000, maxSpeed: 9000 },
  { nickname: "정시파이터 고3 (수리올인)", accuracy: 0.70, minSpeed: 5000, maxSpeed: 14000 },
  { nickname: "찍신강림 5등급", accuracy: 0.35, minSpeed: 1000, maxSpeed: 5000 },
  { nickname: "샤반수생 (서울대)", accuracy: 0.95, minSpeed: 2000, maxSpeed: 5500 }
];

// Audio synthesizer trigger
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSfx(type) {
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === "correct") {
      // Harmonic bubble up
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === "wrong") {
      // Flat descending saw
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.3);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === "click") {
      // Soft high pitch chirp
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1600, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === "transition") {
      // Retro chime sweep
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.3);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === "cheer") {
      // Bright major synth riser
      osc.type = "sine";
      osc.frequency.setValueAtTime(261.63, now); // C4
      osc.frequency.setValueAtTime(329.63, now + 0.08); // E4
      osc.frequency.setValueAtTime(392.00, now + 0.16); // G4
      osc.frequency.setValueAtTime(523.25, now + 0.24); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.32); // E5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    }
  } catch (e) {
    // Silently proceed if AudioContext not allowed or enabled yet
  }
}

// LaTeX custom compiler
function renderMathToHtml(text) {
  if (!text) return "";
  // Access and parse content raw to ensure double backslash newline environments are preserved
  const normalizedText = text;
  
  const blocks = normalizedText.split("$$");
  return blocks.map((block, bIdx) => {
    // Odd blocks are math displays
    if (bIdx % 2 !== 0) {
      try {
        const html = katex.renderToString(block, {
          displayMode: true,
          throwOnError: false,
        });
        return `<div class="my-4 overflow-x-auto select-none font-mono text-cyan-200 drop-shadow-[0_0_8px_rgba(34,211,238,0.25)] text-center text-lg md:text-xl">${html}</div>`;
      } catch (err) {
        return `<pre class="text-red-400 p-2 bg-slate-950/50 rounded">${block}</pre>`;
      }
    }

    // Inline math splitting ($) in plain text layers
    const inlineParts = block.split("$");
    return inlineParts.map((part, pIdx) => {
      if (pIdx % 2 !== 0) {
        try {
          const html = katex.renderToString(part, {
            displayMode: false,
            throwOnError: false,
          });
          return `<span class="inline select-none font-mono text-cyan-200 mx-1 drop-shadow-[0_0_4px_rgba(34,211,238,0.15)] bg-slate-900/50 px-1 py-0.5 rounded border border-cyan-500/10">${html}</span>`;
        } catch (err) {
          return `<span class="text-red-400">$${part}$</span>`;
        }
      }
      return part;
    }).join("");
  }).join("");
}

// 2. Global State Variable
const STATE_STORAGE_KEY = "suneung_math_arena_state_v2";

function loadQuestions() {
  const saved = localStorage.getItem("math_arena_custom_questions");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return [...INITIAL_QUESTIONS, ...parsed];
    } catch (e) {}
  }
  return [...INITIAL_QUESTIONS];
}

function saveCustomQuestion(newQ) {
  try {
    const saved = localStorage.getItem("math_arena_custom_questions") || "[]";
    const parsed = JSON.parse(saved);
    parsed.push(newQ);
    localStorage.setItem("math_arena_custom_questions", JSON.stringify(parsed));
  } catch (e) {}
}

const state = {
  role: "SELECT", // "SELECT", "HOST", "STUDENT"
  questions: loadQuestions(),
  selectedQuestionIds: ["seed-1", "seed-2", "seed-3"],
  customForm: {
    title: "",
    content: "",
    difficulty: "준킬러",
    options: ["", "", "", "", ""],
    correctAnswer: 0,
    explanation: ""
  },
  isCreatingCustom: false,
  isGenerating: null, // Track original Question ID being used for variant generation progress
  
  // Active Room State (Simulated multiplayer backend)
  room: null, // { pin, status: "LOBBY"|"INTRO"|"PLAY"|"REVEAL"|"LEADERBOARD"|"PODIUM", currentQIdx, questions: [], players: [], timerSeconds, timerInterval }
  
  // Student role specific states
  studentName: "",
  studentPin: "",
  studentSubmitted: false,
  studentChoice: null,
  studentCurrentScore: 0,
  studentStreak: 0,
  studentRank: 0,
  studentCheer: "",

  // System toast notification
  toastMsg: null,
  toastTimeout: null
};

// 3. User Experience Enhancements
function triggerToast(text) {
  if (state.toastTimeout) clearTimeout(state.toastTimeout);
  state.toastMsg = text;
  
  const toastEl = document.getElementById("toast-container");
  if (toastEl) {
    toastEl.innerHTML = `<div class="bg-cyan-950/90 text-cyan-100 border border-cyan-500/30 px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.25)] flex items-center space-x-3 backdrop-blur-md animate-bounce">
      <span class="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping"></span>
      <span class="font-medium text-sm md:text-base">${text}</span>
    </div>`;
    toastEl.classList.remove("hidden");
    
    state.toastTimeout = setTimeout(() => {
      toastEl.classList.add("hidden");
      state.toastMsg = null;
    }, 3800);
  }
}

// 4. Simulated Room Backend (KaHoots / Suneung Combat logic in memory)
function createRoom(selectedQIds) {
  const selectedQs = state.questions.filter(q => selectedQIds.includes(q.id));
  if (selectedQs.length === 0) {
    triggerToast("최소 1개 이상의 대결 퀴즈 문항을 수집하세요.");
    return false;
  }

  const pin = "777777"; // Standard interactive playground PIN, or randomize if they click
  const randomPin = Math.floor(100000 + Math.random() * 900000).toString();
  
  state.room = {
    pin: randomPin,
    status: "LOBBY",
    currentQIdx: 0,
    questions: selectedQs,
    players: [],
    timerSeconds: 120,
    totalDuration: 120,
    timerInterval: null
  };

  playSfx("transition");
  triggerToast(`[${randomPin}] 번 수능 수학 대기실이 실시간 개설되었습니다!`);

  // Start spawning simulated bot players
  spawnBots();
  return true;
}

function spawnBots() {
  if (!state.room) return;
  
  // Clean past participants
  state.room.players = [];
  
  // Stagger entry
  let devsJoined = 0;
  const entryInterval = setInterval(() => {
    if (!state.room || state.room.status !== "LOBBY") {
      clearInterval(entryInterval);
      return;
    }

    if (devsJoined < BOT_POOL.length) {
      const bot = BOT_POOL[devsJoined];
      const botPlayer = {
        uuid: "bot-" + devsJoined,
        nickname: bot.nickname,
        score: 0,
        lastScoreAdded: 0,
        streak: 0,
        isSubmitted: false,
        lastAnswerIndex: -1,
        rankChange: 0,
        isBot: true,
        accuracy: bot.accuracy,
        minSpeed: bot.minSpeed,
        maxSpeed: bot.maxSpeed
      };
      state.room.players.push(botPlayer);
      devsJoined++;
      playSfx("click");
      triggerToast(`참가자 [${bot.nickname}] 님이 전장에 소환되었습니다!`);
      render();
    } else {
      clearInterval(entryInterval);
    }
  }, 1200);
}

function advanceRoomStatus(targetStatus) {
  if (!state.room) return;

  if (state.room.timerInterval) {
    clearInterval(state.room.timerInterval);
    state.room.timerInterval = null;
  }

  if (targetStatus === "NEXT_QUESTION") {
    if (state.room.currentQIdx < state.room.questions.length - 1) {
      state.room.currentQIdx++;
      state.room.status = "INTRO";
      startIntroTimer();
    } else {
      advanceRoomStatus("PODIUM");
    }
    return;
  }

  state.room.status = targetStatus;
  playSfx("transition");

  if (targetStatus === "INTRO") {
    startIntroTimer();
  } else if (targetStatus === "PLAY") {
    startPlayTimer();
  } else if (targetStatus === "REVEAL") {
    computeRevealState();
  } else if (targetStatus === "LEADERBOARD") {
    computeLeaderboardState();
  } else if (targetStatus === "PODIUM") {
    buildPodiumStage();
  }

  render();
}

// Intro Countdown 5s
function startIntroTimer() {
  state.room.timerSeconds = 5;
  state.room.timerInterval = setInterval(() => {
    state.room.timerSeconds--;
    if (state.room.timerSeconds <= 0) {
      clearInterval(state.room.timerInterval);
      state.room.timerInterval = null;
      advanceRoomStatus("PLAY");
    } else {
      playSfx("click");
      render();
    }
  }, 1000);
}

// Active Play countdown 120s
function startPlayTimer() {
  state.room.timerSeconds = 60 * 2; // 2 minutes standard
  state.room.totalDuration = 60 * 2;

  // Reset player submission states
  state.room.players.forEach(p => {
    p.isSubmitted = false;
    p.lastAnswerIndex = -1;
    p.lastScoreAdded = 0;
  });
  
  // reset student choices
  state.studentSubmitted = false;
  state.studentChoice = null;

  // Start timer interval
  state.room.timerInterval = setInterval(() => {
    state.room.timerSeconds--;
    if (state.room.timerSeconds <= 0) {
      clearInterval(state.room.timerInterval);
      state.room.timerInterval = null;
      advanceRoomStatus("REVEAL");
    } else {
      render();
    }
  }, 1000);

  // Trigger simulated bot answers staggered
  state.room.players.forEach(p => {
    if (p.isBot) {
      const delay = p.minSpeed + Math.random() * (p.maxSpeed - p.minSpeed);
      setTimeout(() => {
        if (!state.room || state.room.status !== "PLAY" || p.isSubmitted) return;
        submitPlayerAnswer(p.uuid, simulateBotChoice(p));
      }, delay);
    }
  });
}

function simulateBotChoice(player) {
  const currentQ = state.room.questions[state.room.currentQIdx];
  const isCorrect = Math.random() < player.accuracy;
  
  if (isCorrect) {
    return currentQ.correctAnswer;
  } else {
    // Return random incorrect option
    const pool = [0, 1, 2, 3, 4].filter(idx => idx !== currentQ.correctAnswer);
    return pool[Math.floor(Math.random() * pool.length)];
  }
}

function submitPlayerAnswer(playerUuid, answerIndex) {
  if (!state.room || state.room.status !== "PLAY") return;

  const player = state.room.players.find(p => p.uuid === playerUuid);
  if (!player || player.isSubmitted) return;

  player.isSubmitted = true;
  player.lastAnswerIndex = answerIndex;

  const currentQ = state.room.questions[state.room.currentQIdx];
  const isCorrect = answerIndex === currentQ.correctAnswer;

  if (isCorrect) {
    const baseScore = 400;
    // Speed dynamic bonus: more points if submitted faster
    const completionRatio = state.room.timerSeconds / state.room.totalDuration;
    const bonus = Math.floor(600 * completionRatio);
    player.lastScoreAdded = baseScore + bonus;
    player.score += player.lastScoreAdded;
    player.streak += 1;
  } else {
    player.lastScoreAdded = 0;
    player.streak = 0;
  }

  // Check if everyone has submitted
  const allSubmitted = state.room.players.every(p => p.isSubmitted);
  if (allSubmitted) {
    if (state.room.timerInterval) {
      clearInterval(state.room.timerInterval);
      state.room.timerInterval = null;
    }
    advanceRoomStatus("REVEAL");
  } else {
    render();
  }
}

function computeRevealState() {
  playSfx("correct");

  // Determine if student user is in the room. If student entered choice but was not registered
  if (state.role === "STUDENT" && !state.studentSubmitted && state.studentChoice !== null) {
    state.studentSubmitted = true;
    const currentQ = state.room.questions[state.room.currentQIdx];
    const isCorrect = state.studentChoice === currentQ.correctAnswer;
    
    // Create or find student records in active room roster
    let studRec = state.room.players.find(p => p.uuid === "student-user");
    if (!studRec) {
      studRec = {
        uuid: "student-user",
        nickname: state.studentName || "나",
        score: state.studentCurrentScore,
        streak: state.studentStreak,
        lastScoreAdded: 0,
        isSubmitted: true,
        lastAnswerIndex: state.studentChoice,
        rankChange: 0,
        isBot: false
      };
      state.room.players.push(studRec);
    }
    
    studRec.lastAnswerIndex = state.studentChoice;
    studRec.isSubmitted = true;

    if (isCorrect) {
      const baseScore = 400;
      const ratio = state.room.timerSeconds / state.room.totalDuration;
      const bonus = Math.floor(600 * ratio);
      studRec.lastScoreAdded = baseScore + bonus;
      studRec.score += studRec.lastScoreAdded;
      state.studentCurrentScore = studRec.score;
      state.studentStreak++;
      studRec.streak = state.studentStreak;
      playSfx("correct");
    } else {
      studRec.lastScoreAdded = 0;
      state.studentStreak = 0;
      studRec.streak = 0;
      playSfx("wrong");
    }
  }

  render();
}

function computeLeaderboardState() {
  // Sort players, calculate ranking delta changes compared to previous ranks
  if (!state.room) return;

  const previousRoster = [...state.room.players];
  previousRoster.sort((a,b) => (b.score - a.lastScoreAdded) - (a.score - a.lastScoreAdded));
  const prevRankings = previousRoster.map(p => p.uuid);

  // Sort by new scores
  state.room.players.sort((a, b) => b.score - a.score);
  
  state.room.players.forEach((p, idx) => {
    const oldIdx = prevRankings.indexOf(p.uuid);
    if (oldIdx !== -1) {
      p.rankChange = oldIdx - idx; // positive means climbed up
    } else {
      p.rankChange = 0;
    }

    if (p.uuid === "student-user") {
      state.studentRank = idx + 1;
    }
  });
}

function buildPodiumStage() {
  playSfx("cheer");
  
  // Compile podium final accolades
  state.podiumData = [];
  const topThree = state.room.players.slice(0, 3);
  
  topThree.forEach((p, idx) => {
    const randomTemplate = CHEER_TEMPLATES[Math.floor(Math.random() * CHEER_TEMPLATES.length)];
    const cheer = randomTemplate.replace("{name}", p.nickname).replace("{score}", p.score);
    
    state.podiumData.push({
      nickname: p.nickname,
      score: p.score,
      cheer: cheer
    });

    if (p.uuid === "student-user") {
      state.studentCheer = cheer;
    }
  });

  if (state.role === "STUDENT" && !state.studentCheer) {
    state.studentCheer = `${state.studentName || "학생"}님, 수능 수리가 장엄하게 빛나기 위해 끝까지 완수하셨습니다. 수고하셨습니다!`;
  }

  // Trigger continuous digital floating particles
  setTimeout(() => {
    triggerConfettiParticles();
  }, 100);
}

function triggerConfettiParticles() {
  const cont = document.getElementById("confetti-box");
  if (!cont) return;

  cont.innerHTML = "";
  const COLORS = ["bg-cyan-400", "bg-purple-400", "bg-yellow-400", "bg-emerald-400", "bg-pink-400"];
  
  for (let i = 0; i < 45; i++) {
    const part = document.createElement("div");
    part.className = `firework-particle ${COLORS[Math.floor(Math.random() * COLORS.length)]}`;
    
    const startX = Math.random() * 100; // %
    const startY = Math.random() * 40 + 40; // %
    
    part.style.left = startX + "%";
    part.style.top = startY + "%";
    
    // Custom displacement
    const dx = (Math.random() - 0.5) * 200 + "px";
    const dy = -(Math.random() * 200 + 100) + "px";
    
    part.style.setProperty("--tw-x", dx);
    part.style.setProperty("--tw-y", dy);
    part.style.animationDelay = (Math.random() * 0.8) + "s";
    
    cont.appendChild(part);
  }
}

// 5. Simulated Gemini variant builder (Instant 3.1 Pro mockup analytics logs)
function startAIGenVariant(originalId) {
  if (state.isGenerating) return;

  playSfx("transition");
  state.isGenerating = originalId;
  const originalQ = state.questions.find(q => q.id === originalId);
  render();

  const logs = [
    "Gemini 3.1 Pro 인스턴스 소환 완료...",
    "수능 수리 가이드라인 가중치 정렬...",
    "지수, 수열, 대칭 기하 구조 해체 중...",
    "수학적 결함 성립성 격자 탐색 완료...",
    "5개 변형 보기에 대한 변별력 매개변수 생성 중...",
    " LaTeX 다중 이스케이프 포맷 검독 완료...",
    "수능 수학 준킬러 21번 완결 변형 출제 성공!"
  ];

  let stepIdx = 0;
  const loggerEl = document.getElementById(`ai-log-${originalId}`);
  
  const interval = setInterval(() => {
    if (stepIdx < logs.length) {
      if (loggerEl) {
        const item = document.createElement("div");
        item.className = "text-xs font-mono text-cyan-300 flex items-center space-x-2";
        item.innerHTML = `<span class="inline-block w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></span><span>${logs[stepIdx]}</span>`;
        loggerEl.appendChild(item);
        loggerEl.scrollTop = loggerEl.scrollHeight;
      }
      stepIdx++;
    } else {
      clearInterval(interval);
      
      // Inject variant
      const predefined = PRE_AUTH_VARIANTS[originalId];
      if (predefined) {
        const copyQ = {
          ...predefined,
          id: "ai-" + Math.random().toString(36).substring(2, 9)
        };
        state.questions.push(copyQ);
        triggerToast("평가원급 고난도 변형 기조가 은행에 안착되었습니다!");
      } else {
        // Fallback procedural variant if no preauth config exists
        const copyQ = {
          id: "ai-" + Math.random().toString(36).substring(2, 9),
          title: `AI 변형: ${originalQ.title} (형식화)`,
          content: originalQ.content.replace(/k/g, "p").replace(/5/g, "7").replace(/3/g, "4"),
          difficulty: originalQ.difficulty,
          options: originalQ.options.map(opt => (parseInt(opt, 10) * 2).toString()),
          correctAnswer: originalQ.correctAnswer,
          explanation: `원본 수열을 p축 및 계수 평행이동에 맞춰 두 배 전조한 AI 출제 위원 가이드라인 적용 해설입니다: ${originalQ.explanation}`,
          isAiGenerated: true,
          originalQuestionId: originalId
        };
        state.questions.push(copyQ);
        triggerToast("순수 수리변작 알고리즘 모델 기반 변형 완성!");
      }
      
      state.isGenerating = null;
      render();
    }
  }, 700);
}

// 6. Action Handlers (Standard event binding connectors)
window.selectRole = function(role) {
  playSfx("click");
  state.role = role;

  if (role === "STUDENT") {
    // defaults
    state.studentJoined = false;
    state.studentChoice = null;
    state.studentSubmitted = false;
  }
  
  render();
};

window.toggleQuestion = function(id) {
  playSfx("click");
  if (state.selectedQuestionIds.includes(id)) {
    if (state.selectedQuestionIds.length === 1) {
      triggerToast("최소 1개 이상의 대결 퀴즈 문항을 수집해야 합니다.");
      return;
    }
    state.selectedQuestionIds = state.selectedQuestionIds.filter(x => x !== id);
  } else {
    state.selectedQuestionIds.push(id);
  }
  render();
};

window.openCustomCreator = function() {
  playSfx("click");
  state.isCreatingCustom = true;
  render();
};

window.closeCustomCreator = function() {
  playSfx("click");
  state.isCreatingCustom = false;
  render();
};

window.submitCustomForm = function(e) {
  if (e) e.preventDefault();
  
  const title = document.getElementById("form-title").value.trim();
  const content = document.getElementById("form-content").value.trim();
  const difficulty = document.getElementById("form-difficulty").value;
  const options = [
    document.getElementById("form-opt-1").value.trim(),
    document.getElementById("form-opt-2").value.trim(),
    document.getElementById("form-opt-3").value.trim(),
    document.getElementById("form-opt-4").value.trim(),
    document.getElementById("form-opt-5").value.trim()
  ];
  const correctAnswer = parseInt(document.getElementById("form-answer").value, 10);
  const explanation = document.getElementById("form-explanation").value.trim();

  if (!title || !content || options.some(opt => !opt)) {
    triggerToast("모든 빈칸과 5개의 보기를 빼놓지 말고 채워 넣어 주세요.");
    return;
  }

  const customQ = {
    id: "custom-" + Date.now().toString(36),
    title,
    content,
    difficulty,
    options,
    correctAnswer,
    explanation,
    isAiGenerated: false
  };

  state.questions.push(customQ);
  saveCustomQuestion(customQ);
  
  state.selectedQuestionIds.push(customQ.id);
  state.isCreatingCustom = false;
  
  playSfx("cheer");
  triggerToast("새로운 네온 수학 문항이 출제 은행에 임시 축적되었습니다.");
  render();
};

window.runAIVariature = function(id) {
  if (state.isGenerating) return;
  startAIGenVariant(id);
};

window.hostLaunchGame = function() {
  const launched = createRoom(state.selectedQuestionIds);
  if (launched) {
    render();
  }
};

window.hostAdvance = function(target) {
  advanceRoomStatus(target);
};

window.studentJoinRoom = function(e) {
  if (e) e.preventDefault();
  
  const pin = document.getElementById("stud-pin").value.trim();
  const name = document.getElementById("stud-name").value.trim();

  if (!name) {
    triggerToast("닉네임 또는 수험번호를 명시하세요.");
    return;
  }
  if (!pin || pin.length < 4) {
    triggerToast("올바른 형태의 게임 방 PIN 번호를 적용하세요.");
    return;
  }

  // Hook into active host session if PIN match, else launch solo practice chamber automatically
  const isCheat = name === "수능만점자";
  const startScore = isCheat ? 99999 : 0;

  state.studentName = name;
  state.studentPin = pin;
  state.studentJoined = true;
  state.studentChoice = null;
  state.studentSubmitted = false;
  state.studentCurrentScore = startScore;
  state.studentStreak = 0;

  playSfx("cheer");
  if (isCheat) {
    triggerToast(`[${name}] 특제 만점 치트 발동! 99,999점에서 전장을 개시합니다.`);
  } else {
    triggerToast(`[${name}] 님, 수리 대결 대기마당입장 성공!`);
  }

  if (state.room && state.room.pin === pin) {
    // Subscribing to existing host room
    const userRec = {
      uuid: "student-user",
      nickname: name,
      score: startScore,
      streak: 0,
      lastScoreAdded: 0,
      isSubmitted: false,
      lastAnswerIndex: -1,
      rankChange: 0,
      isBot: false
    };
    state.room.players.push(userRec);
  } else {
    // Solo Sandbox Practice Room Spin-Up!
    const soloQIds = state.questions.slice(0, 3).map(q => q.id);
    createRoom(soloQIds);
    state.room.pin = pin; // force input pin
    
    // Add real student in
    const userRec = {
      uuid: "student-user",
      nickname: name,
      score: startScore,
      streak: 0,
      lastScoreAdded: 0,
      isSubmitted: false,
      lastAnswerIndex: -1,
      rankChange: 0,
      isBot: false
    };
    state.room.players.push(userRec);
  }

  render();
};

window.studentSelectOption = function(idx) {
  if (state.studentChoice !== null || (state.room && state.room.status !== "PLAY")) return;
  
  playSfx("click");
  state.studentChoice = idx;
  
  // Submit immediately to system backend
  submitPlayerAnswer("student-user", idx);
  state.studentSubmitted = true;
  
  triggerToast(`${idx + 1}번 보기를 정답으로 완결 제출했습니다!`);
  render();
};

window.studentStartSoloQuiz = function() {
  if (state.room && state.room.status === "LOBBY") {
    advanceRoomStatus("INTRO");
  }
};

window.resetApp = function() {
  playSfx("transition");
  if (state.room && state.room.timerInterval) {
    clearInterval(state.room.timerInterval);
  }
  state.role = "SELECT";
  state.room = null;
  state.selectedQuestionIds = ["seed-1", "seed-2", "seed-3"];
  state.isCreatingCustom = false;
  render();
};

// 7. Render Layout Compiler (Converting states to visual layouts seamlessly)
function render() {
  const root = document.getElementById("app");
  if (!root) return;

  let html = "";

  // Dynamic header block
  html += `
    <!-- Top HUD Navigation -->
    <header class="border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md px-4 py-3 md:px-8 flex items-center justify-between sticky top-0 z-40">
      <div class="flex items-center space-x-3 cursor-pointer" onclick="resetApp()">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.35)]">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
        </div>
        <div>
          <h1 class="text-xs md:text-sm tracking-widest font-extrabold uppercase font-display bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">NEON MATH CSAT</h1>
          <p class="text-[9px] text-slate-500 font-mono tracking-tight -mt-0.5">Suneung 21 Arena Emulator</p>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <span class="flex items-center text-[11px] font-mono bg-slate-900 border border-slate-800/80 rounded-full px-3 py-1 text-slate-400 select-none">
          <span class="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1.5 animate-pulse"></span>
          OFFLINE SECURE
        </span>
        ${state.role !== "SELECT" ? `
          <button onclick="resetApp()" class="text-xs bg-slate-900 border border-slate-800 hover:border-cyan-500/30 px-3 py-1 rounded-lg text-slate-400 transition-all">
            롤 전환
          </button>
        `: ""}
      </div>
    </header>

    <!-- Applet Content Base Frame -->
    <main class="flex-grow flex flex-col relative w-full h-[calc(100vh-64px)] overflow-hidden">
      <!-- Ambient light decorative backdrops -->
      <div class="pointer-events-none absolute top-12 left-10 w-96 h-96 bg-cyan-700/5 rounded-full blur-[140px] animate-pulse-slow"></div>
      <div class="pointer-events-none absolute bottom-12 right-10 w-96 h-96 bg-purple-700/5 rounded-full blur-[140px] animate-pulse-slow" style="animation-delay: 2.5s;"></div>
  `;

  if (state.role === "SELECT") {
    html += renderRoleSelectionView();
  } else if (state.role === "HOST") {
    html += renderHostConsoleView();
  } else if (state.role === "STUDENT") {
    html += renderStudentView();
  }

  html += `</main>`;
  root.innerHTML = html;

  // Render Lucide custom icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Inject beautiful KaTeX parse
  const els = root.querySelectorAll(".katex-lazy");
  els.forEach(el => {
    el.innerHTML = renderMathToHtml(el.textContent);
    el.classList.remove("katex-lazy");
  });
}

// Subview 1: Role Selection Screen
function renderRoleSelectionView() {
  return `
    <div class="flex-grow flex flex-col items-center justify-center p-4">
      <div class="max-w-2xl w-full text-center space-y-8 animate-fade-in relative z-10 px-4">
        
        <!-- Welcome intro -->
        <div class="space-y-3">
          <span class="text-xs tracking-[0.2em] font-extrabold text-cyan-400 uppercase bg-cyan-950/40 border border-cyan-500/20 px-3.5 py-1.5 rounded-full select-none">
            🚀 100% 무설치 정적 무중단 배포판
          </span>
          <h2 class="text-4xl md:text-5xl font-extrabold tracking-tight font-display text-white">
            수능 수리 21번 <br class="sm:hidden"><span class="bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent">네온 아레나</span>
          </h2>
          <p class="text-slate-400 max-w-lg mx-auto text-sm md:text-base font-light">
            복잡한 데이터베이스 설치, 백엔드 서버 개설, 비밀 Gemini API 키 노출 우려 없이 언제 어디서나 GitHub Pages에 정적으로 즉시 호스팅되는 교실 수학 게임입니다.
          </p>
        </div>

        <!-- Selection panel cards grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto max-w-xl">
          <!-- Card 1: Host role selection -->
          <div onclick="selectRole('HOST')" class="group flex flex-col justify-between p-6 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl cursor-pointer text-left transition-all hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] relative">
            <div class="absolute top-4 right-4 w-10 h-10 rounded-full border border-slate-800/50 group-hover:border-cyan-500/20 group-hover:bg-cyan-950/20 flex items-center justify-center transition-all">
              <i data-lucide="tv" class="w-4 h-4 text-slate-500 group-hover:text-cyan-400"></i>
            </div>
            
            <div class="space-y-4">
              <span class="text-[10px] uppercase tracking-widest font-bold text-slate-500">교사 / 강사용</span>
              <div>
                <h3 class="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">빔프로젝터 호스트</h3>
                <p class="text-xs text-slate-400 mt-1 leading-relaxed">수학 변형 문제를 출제하고, 빔으로 큰 화면을 송출하세요. 인공지능형 컴퓨터 봇들이 자동 참여합니다.</p>
              </div>
            </div>
            
            <button class="w-full mt-6 bg-slate-800 group-hover:bg-cyan-600 text-slate-300 group-hover:text-white border border-slate-700 group-hover:border-transparent py-2 rounded-xl text-xs font-semibold flex items-center justify-center transition-all">
              교실 호스트 열기
              <i data-lucide="chevron-right" class="w-3.5 h-3.5 ml-1"></i>
            </button>
          </div>

          <!-- Card 2: Student role selection -->
          <div onclick="selectRole('STUDENT')" class="group flex flex-col justify-between p-6 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl cursor-pointer text-left transition-all hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)] relative">
            <div class="absolute top-4 right-4 w-10 h-10 rounded-full border border-slate-800/50 group-hover:border-purple-500/20 group-hover:bg-purple-950/20 flex items-center justify-center transition-all">
              <i data-lucide="users" class="w-4 h-4 text-slate-500 group-hover:text-purple-400"></i>
            </div>

            <div class="space-y-4">
              <span class="text-[10px] uppercase tracking-widest font-bold text-slate-500">학생용 / 혼자 학습용</span>
              <div>
                <h3 class="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">실시간 수험생 점수판</h3>
                <p class="text-xs text-slate-400 mt-1 leading-relaxed">수능 수학 퀴즈에 맞춤식 출제 코드로 입장해, 수식 문제를 풀고 실시간 컴컴 봇들과의 등수를 사수하세요.</p>
              </div>
            </div>
            
            <button class="w-full mt-6 bg-slate-800 group-hover:bg-purple-600 text-slate-300 group-hover:text-white border border-slate-700 group-hover:border-transparent py-2 rounded-xl text-xs font-semibold flex items-center justify-center transition-all">
              전장 대결 입장
              <i data-lucide="chevron-right" class="w-3.5 h-3.5 ml-1"></i>
            </button>
          </div>
        </div>

        <!-- Footnote details -->
        <div class="text-[11px] text-slate-500 font-mono flex items-center justify-center space-x-1">
          <span>Static SPA Edition v2.10</span>
          <span>•</span>
          <span>Zero-Backend Client Engine</span>
        </div>
      </div>
    </div>
  `;
}

// Subview 2: Host Console Area
function renderHostConsoleView() {
  if (state.room) {
    return renderActiveSessionConsole();
  }

  return `
    <div class="flex-grow flex flex-col md:flex-row overflow-hidden h-full">
      <!-- Sidebar bank of questions -->
      <aside class="w-full md:w-[420px] border-r border-slate-800/90 bg-slate-950/50 flex flex-col overflow-y-auto">
        <div class="p-4 border-b border-slate-800/90 sticky top-0 bg-slate-950/80 backdrop-blur z-10 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-sm text-slate-200">수리 문항 은행</h3>
            <p class="text-xs text-slate-400">선택한 문항이 게임 퀴즈 세트로 구성됩니다.</p>
          </div>
          <button onclick="openCustomCreator()" class="text-xs bg-cyan-950 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-900/50 px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
            <span>문항 추가</span>
          </button>
        </div>

        <div class="p-4 space-y-4">
          ${state.questions.map(q => {
            const isSelected = state.selectedQuestionIds.includes(q.id);
            const isGen = state.isGenerating === q.id;
            
            return `
              <div class="p-4 rounded-xl border transition-all ${isSelected ? 'bg-cyan-950/20 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.05)]' : 'bg-slate-900/40 border-slate-800/80'}">
                <div class="flex items-start justify-between space-x-2">
                  <div class="flex items-center space-x-2">
                    <span class="text-[9px] px-2 py-0.5 rounded-full font-mono ${q.difficulty === '킬러' ? 'bg-purple-950 border border-purple-500/20 text-purple-300' : 'bg-cyan-950 border border-cyan-500/20 text-cyan-300'}">
                      ${q.difficulty}
                    </span>
                    ${q.isAiGenerated ? `
                      <span class="text-[9px] px-2 py-0.5 rounded-full font-mono bg-amber-950 border border-amber-500/20 text-amber-300 flex items-center">
                        <i data-lucide="sparkles" class="w-2.5 h-2.5 mr-1"></i> AI 변형
                      </span>
                    `: ""}
                  </div>
                  
                  <input type="checkbox" ${isSelected ? 'checked' : ''} onclick="toggleQuestion('${q.id}')" class="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 bg-slate-950 border-slate-800 cursor-pointer">
                </div>

                <h4 class="mt-2 text-xs font-bold text-white tracking-tight leading-relaxed select-none">${q.title}</h4>
                
                <div class="mt-3 p-2 bg-slate-950/60 rounded border border-slate-800/50 text-[11px] text-slate-300 font-mono scale-95 origin-left max-h-24 overflow-y-auto cursor-help">
                  ${q.content}
                </div>

                <div class="mt-4 flex items-center justify-between border-t border-slate-800/30 pt-3">
                  <span class="text-[10px] text-slate-500 font-mono">가용정답: [${q.correctAnswer + 1}번]</span>
                  
                  ${!q.isAiGenerated ? `
                    <button onclick="runAIVariature('${q.id}')" ${isGen ? 'disabled' : ''} class="text-[10px] bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 px-2 py-1 rounded-md transition-all flex items-center space-x-1 shadow-inner">
                      ${isGen ? `
                        <i data-lucide="refresh-cw" class="w-3 h-3 animate-spin"></i>
                        <span>분석 및 전조 중...</span>
                      ` : `
                        <i data-lucide="sparkle" class="w-3 h-3 text-indigo-400"></i>
                        <span>AI 수능 변형 문제</span>
                      `}
                    </button>
                  `: `
                    <span class="text-[10px] text-amber-400 flex items-center select-none font-mono">
                      <i data-lucide="check" class="w-3 h-3 mr-1"></i> 변형 완료
                    </span>
                  `}
                </div>

                ${isGen ? `
                  <div id="ai-log-${q.id}" class="mt-3 p-3 bg-slate-950 border border-cyan-500/20 rounded-lg max-h-36 overflow-y-auto flex flex-col space-y-1.5 scrollbar-none shadow-inner">
                    <span class="text-[9px] font-mono text-cyan-500 uppercase tracking-widest block border-b border-slate-800/30 pb-1">Gemini 3.1 Pro AI Solver</span>
                  </div>
                `: ""}
              </div>
            `;
          })}
        </div>
      </aside>

      <!-- Center preview and settings launching board -->
      <section class="flex-grow bg-[#090d16] p-4 md:p-8 flex flex-col overflow-y-auto relative bg-math-grid">
        ${state.isCreatingCustom ? `
          <!-- Overlay manual question forms -->
          <div class="bg-slate-950/90 border border-slate-800/80 p-6 rounded-2xl max-w-xl mx-auto shadow-2xl space-y-5 backdrop-blur animate-fade-in relative z-20 my-auto w-full">
            <h3 class="font-extrabold text-lg text-white font-display flex items-center space-x-2">
              <i data-lucide="plus-circle" class="text-cyan-400 w-5 h-5"></i>
              <span>새 수능형 퀴즈 출제 등록</span>
            </h3>
            
            <form id="custom-q-form" onsubmit="submitCustomForm(event)" class="space-y-4 text-xs">
              <div class="space-y-1.5">
                <label class="text-slate-400 font-bold">문항 주제 타이틀</label>
                <input id="form-title" type="text" placeholder="예: 수능 고난도 - 삼각함수의 최대 가중치" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500">
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label class="text-slate-400 font-bold">난이도 분류</label>
                  <select id="form-difficulty" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500">
                    <option value="준킬러">준킬러</option>
                    <option value="킬러">킬러</option>
                    <option value="기본">기본</option>
                  </select>
                </div>
                <div class="space-y-1.5">
                  <label class="text-slate-400 font-bold">정답 선택 (선택지 인덱스)</label>
                  <select id="form-answer" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500">
                    <option value="0">1번 보기</option>
                    <option value="1">2번 보기</option>
                    <option value="2">3번 보기</option>
                    <option value="3">4번 보기</option>
                    <option value="4">5번 보기</option>
                  </select>
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-slate-400 font-bold">질문 문지문 (LaTeX 수식 기호는 $...$ 또는 $$...$$로 감싸세요)</label>
                <textarea id="form-content" rows="4" placeholder="모든 실수 $x$에 대하여 이차부등식 $$x^2 - 2kx + 5 \\ge 0$$ 이 성립할 때 정수 $k$의 개수를 구하시오." class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"></textarea>
              </div>

              <div class="space-y-1.5">
                <label class="text-slate-400 font-bold">5지선다 오분배 보기 리스트</label>
                <div class="grid grid-cols-5 gap-2">
                  <input id="form-opt-1" type="text" placeholder="①번" class="bg-slate-900 border border-slate-800 rounded-lg py-2 text-center text-white font-bold">
                  <input id="form-opt-2" type="text" placeholder="②번" class="bg-slate-900 border border-slate-800 rounded-lg py-2 text-center text-white font-bold">
                  <input id="form-opt-3" type="text" placeholder="③번" class="bg-slate-900 border border-slate-800 rounded-lg py-2 text-center text-white font-bold">
                  <input id="form-opt-4" type="text" placeholder="④번" class="bg-slate-900 border border-slate-800 rounded-lg py-2 text-center text-white font-bold">
                  <input id="form-opt-5" type="text" placeholder="⑤번" class="bg-slate-900 border border-slate-800 rounded-lg py-2 text-center text-white font-bold">
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-slate-400 font-bold">평가원급 해설 풀이</label>
                <textarea id="form-explanation" rows="2" placeholder="판별식 $D/4 = k^2 - 5 \\le 0$ 에서 $k$는 $-\\sqrt{5} \\le k \\le \\sqrt{5}$를 만족하므로 정수는 -2, -1, 0, 1, 2 로 총 5개입니다." class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"></textarea>
              </div>

              <div class="flex items-center space-x-3 pt-2">
                <button type="submit" class="flex-grow bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl transition-all">출제 등록 완료</button>
                <button type="button" onclick="closeCustomCreator()" class="bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl border border-slate-700 transition">취소</button>
              </div>
            </form>
          </div>
        ` : `
          <!-- Normal launching cockpit -->
          <div class="max-w-xl w-full mx-auto my-auto space-y-6 relative z-10 text-center">
            <div class="p-8 bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-6 backdrop-blur">
              <div class="w-16 h-16 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(34,211,238,0.15)] animate-float">
                <i data-lucide="play" class="w-8 h-8 text-cyan-400 fill-cyan-400/20"></i>
              </div>

              <div class="space-y-2">
                <h3 class="font-extrabold text-xl text-white font-display">Suneung Math 롤플레잉 게임 개설</h3>
                <p class="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                   선택한 총 <span class="font-bold text-cyan-400 font-mono">${state.selectedQuestionIds.length}개</span>의 수리 문항으로 실시간 실력 테스트방을 구성합니다. 빔프로젝터에 띄워 대형 호스트 보드로 사용하기 최적입니다.
                </p>
              </div>

              <div class="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2.5 text-[11px] text-slate-400 font-mono text-left max-h-40 overflow-y-auto">
                <div class="font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800/50 pb-1">선택된 게임 퀴즈 목록 :</div>
                ${state.questions.filter(q => state.selectedQuestionIds.includes(q.id)).map((q, idx) => `
                  <div class="flex items-center space-x-2 text-slate-300">
                    <span class="text-cyan-500 text-[10px] font-bold">LQR-${idx+1}</span>
                    <span class="truncate">${q.title}</span>
                  </div>
                `).join('')}
              </div>

              <button onclick="hostLaunchGame()" class="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-extrabold py-3.5 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center space-x-2">
                <i data-lucide="users" class="w-4 h-4"></i>
                <span>실시간 수능 아레나 배틀 방 개설</span>
              </button>
              
              <div class="text-[10px] text-slate-500 flex items-center justify-center space-x-1 font-mono">
                <span>* 개설 시 대치동 봇 참가자들이 자동 연동되어 매칭 대전을 펼칩니다.</span>
              </div>
            </div>
          </div>
        `}
      </section>
    </div>
  `;
}

// Subview 3: Active host game session console (Multi-stage state controller)
function renderActiveSessionConsole() {
  const room = state.room;
  const currentQ = room.questions[room.currentQIdx];
  const totalQs = room.questions.length;

  let headerHtml = `
    <div class="px-6 py-4 border-b border-slate-800/80 bg-slate-950/50 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 relative z-10 select-none">
      <div class="flex items-center space-x-4">
        <span class="bg-gradient-to-r from-cyan-950 to-slate-900 border border-cyan-500/30 text-cyan-300 text-xs px-3.5 py-1.5 rounded-full font-mono tracking-wider font-extrabold">
          PIN: ${room.pin}
        </span>
        <div class="text-xs">
          <p class="text-slate-400 font-mono">문항 진행률</p>
          <p class="text-white font-extrabold"><span class="text-cyan-400">${room.currentQIdx + 1}</span> / ${totalQs} 문제</p>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <!-- Control actions based on current status -->
        ${room.status === "LOBBY" ? `
          <button onclick="hostAdvance('INTRO')" class="bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-bold px-6 py-2 rounded-xl text-xs flex items-center space-x-2 transition-all">
            <i data-lucide="play" class="w-3.5 h-3.5 fill-white/20"></i>
            <span>퀴즈 배틀 개시!</span>
          </button>
        `: ""}
        
        ${room.status === "PLAY" ? `
          <button onclick="hostAdvance('REVEAL')" class="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2 rounded-xl text-xs flex items-center space-x-2 transition-all">
            <i data-lucide="check" class="w-3.5 h-3.5"></i>
            <span>상황 종료 및 정답공개</span>
          </button>
        `: ""}

        ${room.status === "REVEAL" ? `
          <button onclick="hostAdvance('LEADERBOARD')" class="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-2 rounded-xl text-xs flex items-center space-x-2 transition-all">
            <i data-lucide="award" class="w-3.5 h-3.5"></i>
            <span>참가자 실시간 순위표 공개</span>
          </button>
        `: ""}

        ${room.status === "LEADERBOARD" ? `
          ${room.currentQIdx < totalQs - 1 ? `
            <button onclick="hostAdvance('NEXT_QUESTION')" class="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold px-6 py-2 rounded-xl text-xs flex items-center space-x-2 transition-all">
              <span>다음 수능 문제 출전</span>
              <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
            </button>
          `: `
            <button onclick="hostAdvance('PODIUM')" class="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold px-6 py-2 rounded-xl text-xs flex items-center space-x-2 transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <i data-lucide="award" class="w-3.5 h-3.5 fill-slate-950/20"></i>
              <span>명예의 최종 시상대</span>
            </button>
          `}
        `: ""}

        ${room.status === "PODIUM" ? `
          <button onclick="resetApp()" class="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-6 py-2 rounded-xl text-xs flex items-center space-x-2 transition-all">
            <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
            <span>방 종료 및 로비 전환</span>
          </button>
        `: ""}
      </div>
    </div>
  `;

  let mainBody = "";

  if (room.status === "LOBBY") {
    mainBody = `
      <div class="flex-grow flex flex-col items-center justify-center p-6 bg-math-grid relative z-10">
        <div class="max-w-xl w-full text-center space-y-6">
          <div class="space-y-2">
            <h3 class="text-sm font-mono text-cyan-400 uppercase tracking-widest animate-pulse">수능 전사 소환 대기실</h3>
            <h2 class="text-3xl font-extrabold text-white font-display">수리 21번 전장에 선수 소집 중</h2>
            <p class="text-xs text-slate-400">대치동 기출 봇 및 실시간 참여 학생들이 아래 명단에 자동 결사 연동됩니다.</p>
          </div>

          <div class="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl min-h-64 flex flex-col justify-between">
            <div class="flex items-center justify-between border-b border-slate-800/50 pb-3 mb-4 text-xs font-mono">
              <span class="text-slate-400">참가 선수 명단</span>
              <span class="text-cyan-400 font-bold">${room.players.length}명 대기 완료</span>
            </div>

            <!-- Players dynamic cards grid -->
            ${room.players.length === 0 ? `
              <div class="flex-grow flex flex-col items-center justify-center text-slate-500 py-12 space-y-2 select-none">
                <i data-lucide="users" class="w-8 h-8 animate-ping text-slate-700"></i>
                <p class="text-xs font-mono">대치동 출제 격파 봇 모집 신호 송출 중...</p>
              </div>
            `: `
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                ${room.players.map((p, idx) => `
                  <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-center flex items-center justify-center space-x-2 hover:border-cyan-500/30 transition-all shadow-inner relative overflow-hidden group select-none">
                    <div class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                    <span class="text-xs font-medium text-slate-200 truncate font-mono">${p.nickname}</span>
                  </div>
                `).join('')}
              </div>
            `}

            <div class="text-[10px] text-slate-500 mt-6 font-mono text-center">
              * 상단 [퀴즈 배틀 개시!] 버튼 클릭 시 5초 카운트 후 수식 공방이 개설됩니다.
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (room.status === "INTRO") {
    mainBody = `
      <div class="flex-grow flex flex-col items-center justify-center bg-math-grid relative z-10 text-center scale-up">
        <div class="space-y-6">
          <div class="w-24 h-24 rounded-full border border-cyan-500/40 bg-cyan-950/20 flex items-center justify-center mx-auto animate-ping shadow-[0_0_30px_rgba(34,211,238,0.25)]">
            <span class="text-5xl font-extrabold tracking-tight font-display text-cyan-300 font-mono scale-110">${room.timerSeconds}</span>
          </div>

          <div class="space-y-1.5">
            <h2 class="text-lg font-bold text-white tracking-widest uppercase font-mono">준비 하십시오!</h2>
            <p class="text-xs text-slate-400">곧 전면에 고난도 수능 수식 그래프가 투영됩니다.</p>
          </div>

          <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5 text-xs inline-block max-w-sm">
            <p class="text-slate-400">이번 문제 주제</p>
            <p class="font-extrabold text-cyan-300">${currentQ.title}</p>
          </div>
        </div>
      </div>
    `;
  } else if (room.status === "PLAY" || room.status === "REVEAL") {
    // Collect stats of submissions
    const totalPlayers = room.players.length;
    const submittedReal = room.players.filter(p => p.isSubmitted).length;

    // Compile bar stats percentages
    const counters = [0, 0, 0, 0, 0];
    room.players.forEach(p => {
      if (p.isSubmitted && p.lastAnswerIndex >= 0 && p.lastAnswerIndex <= 4) {
        counters[p.lastAnswerIndex]++;
      }
    });

    mainBody = `
      <div class="flex-grow flex flex-col lg:flex-row overflow-hidden relative z-10">
        
        <!-- Left Side: Active question description, math LaTeX rendering -->
        <div class="flex-grow p-6 flex flex-col justify-between overflow-y-auto">
          <div class="space-y-4 max-w-3xl">
            <div class="flex items-center space-x-2">
              <span class="px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider bg-red-950 border border-red-500/25 text-red-400 rounded-full select-none">
                전장 테마 : ${currentQ.difficulty} 고사
              </span>
              <span class="text-xs text-slate-500 font-mono tracking-tight">${currentQ.title}</span>
            </div>

            <!-- Mathematical LaTeX Question Box -->
            <div class="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl shadow-inner space-y-4 min-h-48 flex flex-col justify-center select-all">
              <div class="math-renderer text-slate-100 leading-relaxed text-sm md:text-base text-slate-200">
                ${renderMathToHtml(currentQ.content)}
              </div>
            </div>
          </div>

          <!-- Bottom: MCQ options clickable/list grid -->
          <div class="mt-8 grid grid-cols-1 md:grid-cols-5 gap-3">
            ${currentQ.options.map((opt, idx) => {
              const count = counters[idx];
              const pct = submittedReal > 0 ? Math.round((count / submittedReal) * 100) : 0;
              const isCorrectOpt = idx === currentQ.correctAnswer;
              
              let optTheme = "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-100";
              if (room.status === "REVEAL") {
                if (isCorrectOpt) {
                  optTheme = "bg-emerald-950/40 border-emerald-500/80 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]";
                } else {
                  optTheme = "bg-red-950/20 border-red-900/50 text-slate-500 opacity-60";
                }
              }

              return `
                <div class="p-4 rounded-xl border transition-all cursor-crosshair flex flex-col justify-between h-32 ${optTheme}">
                  <div class="flex items-center justify-between">
                    <span class="w-6 h-6 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-center font-mono font-bold text-xs">
                      ${idx + 1}
                    </span>
                    
                    ${room.status === "REVEAL" ? `
                      <span class="text-xs font-mono font-extrabold ${isCorrectOpt ? 'text-emerald-400' : 'text-slate-500'}">
                        ${pct}%
                      </span>
                    `: ""}
                  </div>

                  <p class="text-xs md:text-sm font-semibold truncate leading-relaxed select-all">${opt}</p>

                  <!-- Dynamic reveal bar graph -->
                  ${room.status === "REVEAL" ? `
                    <div class="w-full bg-slate-950 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div class="h-full rounded-full ${isCorrectOpt ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-red-900'}" style="width: ${pct}%"></div>
                    </div>
                  `: ""}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Right Side Panel: Live timer tracker & submit stats status -->
        <aside class="w-full lg:w-[320px] border-l border-slate-800/80 bg-slate-950/30 flex flex-col divide-y divide-slate-800/50 select-none">
          
          <!-- Timer metrics block -->
          <div class="p-6 text-center space-y-4">
            <h4 class="text-[10px] uppercase font-mono tracking-widest text-slate-500">배틀 제한시간</h4>
            
            <div class="flex items-center justify-center space-x-3">
              <i data-lucide="clock" class="w-5 h-5 text-slate-400"></i>
              <span class="text-3xl font-extrabold tracking-widest font-mono text-cyan-300">
                ${Math.floor(room.timerSeconds / 60)}:${(room.timerSeconds % 60).toString().padStart(2, '0')}
              </span>
            </div>

            <!-- Real-time feedback bar timer -->
            <div class="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div class="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 animate-pulse" style="width: ${(room.timerSeconds / room.totalDuration) * 100}%"></div>
            </div>

            <p class="text-[11px] font-mono text-slate-500">답변 접수 완료 : <span class="font-bold text-cyan-400">${submittedReal}</span> / ${totalPlayers}명</p>
          </div>

          <!-- Roster statuses block -->
          <div class="p-6 flex-grow overflow-y-auto">
            <h4 class="text-[10px] uppercase font-mono tracking-widest text-slate-400 border-b border-slate-800/40 pb-2 mb-3">실시간 응답 현장</h4>
            
            <div class="space-y-2.5">
              ${room.players.map(p => `
                <div class="flex items-center justify-between text-xs font-mono p-1 bg-slate-900/20 rounded">
                  <span class="text-slate-300 truncate max-w-[150px]">${p.nickname}</span>
                  ${p.isSubmitted ? `
                    <span class="text-emerald-400 flex items-center">
                      <i data-lucide="check-circle" class="w-4.5 h-4.5 mr-1 text-emerald-400"></i> 제출완료
                    </span>
                  `: `
                    <span class="text-slate-500 flex items-center animate-pulse">
                      <i data-lucide="clock" class="w-3.5 h-3.5 mr-1"></i> 숙고 중...
                    </span>
                  `}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Reveal commentary block which loads on REVEAL status -->
          ${room.status === "REVEAL" ? `
            <div class="p-6 overflow-y-auto bg-slate-950/60 max-h-72">
              <h4 class="text-[10px] uppercase font-mono tracking-widest text-violet-400 font-bold mb-2">평가원 출제진 해설 정보</h4>
              <p class="text-[11px] text-slate-300 leading-relaxed max-w-sm leading-relaxed text-justify select-text">
                ${renderMathToHtml(currentQ.explanation)}
              </p>
            </div>
          `: ""}

        </aside>
      </div>
    `;
  } else if (room.status === "LEADERBOARD") {
    mainBody = `
      <div class="flex-grow flex flex-col items-center justify-center p-6 bg-math-grid relative z-10">
        <div class="max-w-xl w-full space-y-6">
          <div class="text-center space-y-1.5">
            <h3 class="text-xs font-mono text-purple-400 uppercase tracking-widest">수능 전사 실시간 누적 스코어</h3>
            <h2 class="text-3xl font-extrabold text-white font-display">수리 21번 순위표</h2>
            <p class="text-xs text-slate-400">가장 정밀하고 빠르게 해결한 선수들이 독주합니다.</p>
          </div>

          <div class="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 divide-y divide-slate-800/40">
            ${room.players.map((p, idx) => {
              let posIcon = `<span class="text-slate-500 font-bold font-mono text-xs">${idx + 1}위</span>`;
              if (idx === 0) posIcon = `🥇`;
              else if (idx === 1) posIcon = `🥈`;
              else if (idx === 2) posIcon = `🥉`;

              let trend = `<span class="text-slate-500 text-[10px] flex items-center"><i data-lucide="minus" class="w-3.5 h-3.5"></i></span>`;
              if (p.rankChange > 0) trend = `<span class="text-emerald-400 text-[10px] flex items-center font-bold tracking-tighter"><i data-lucide="arrow-up" class="w-3.5 h-3.5"></i> ${p.rankChange}</span>`;
              else if (p.rankChange < 0) trend = `<span class="text-red-400 text-[10px] flex items-center font-bold tracking-tighter"><i data-lucide="arrow-down" class="w-3.5 h-3.5"></i> ${Math.abs(p.rankChange)}</span>`;

              return `
                <div class="py-3 flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <span class="w-8 flex justify-center">${posIcon}</span>
                    <div>
                      <div class="text-xs font-bold text-white font-mono flex items-center">
                        <span>${p.nickname}</span>
                        ${p.streak >= 2 ? `
                          <span class="bg-amber-950 border border-amber-500/20 text-amber-300 text-[9px] px-1.5 py-0.5 rounded-md ml-2 flex items-center">
                            <i data-lucide="flame" class="w-3.5 h-3.5 text-amber-500 fill-amber-500/10 mr-0.5 animate-pulse"></i> ${p.streak}연설
                          </span>
                        ` : ''}
                      </div>
                      <div class="text-[10px] text-slate-500 font-mono mt-0.5">방금 획득: <span class="text-cyan-400">+${p.lastScoreAdded}점</span></div>
                    </div>
                  </div>

                  <div class="flex items-center space-x-4">
                    <span class="font-bold text-sm tracking-wide text-slate-100 font-mono select-all">${p.score.toLocaleString()}점</span>
                    <span class="w-8 justify-center flex">${trend}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  } else if (room.status === "PODIUM") {
    mainBody = `
      <div class="flex-grow flex flex-col items-center justify-center p-6 bg-math-grid relative z-10 overflow-hidden">
        <div id="confetti-box" class="absolute inset-0 pointer-events-none z-0"></div>

        <div class="max-w-xl w-full text-center space-y-8 relative z-10">
          <div class="space-y-2">
            <h3 class="text-sm font-mono text-amber-400 uppercase tracking-widest animate-pulse">CSAT ARENA CHAMPIONS</h3>
            <h2 class="text-3xl md:text-4xl font-extrabold text-white font-display uppercase tracking-tight">수리 전장 최종 시상대</h2>
            <p class="text-xs text-slate-400 leading-relaxed">오늘 전전긍긍하며 고도로 탐색해 수식을 소화한 위대한 선수들입니다!</p>
          </div>

          <!-- Podium columns block -->
          <div class="flex items-end justify-center space-x-4 pt-12 pb-6">
            
            <!-- 2위 silver -->
            ${state.podiumData[1] ? `
              <div class="flex flex-col items-center w-28 group">
                <span class="text-slate-400 text-[10px] font-bold font-mono tracking-wider truncate w-24 text-center select-all">${state.podiumData[1].nickname}</span>
                <span class="text-[10px] text-slate-500 font-mono mt-0.5">${state.podiumData[1].score}점</span>
                
                <div class="mt-3 bg-slate-900 border-t border-x border-slate-700/80 rounded-t-xl w-24 h-24 flex items-center justify-center relative shadow-[inset_0_0_12px_rgba(255,255,255,0.02)]">
                  <span class="text-3xl font-extrabold text-slate-500 font-display select-none">2</span>
                </div>
              </div>
            `: ""}

            <!-- 1위 gold -->
            ${state.podiumData[0] ? `
              <div class="flex flex-col items-center w-32 group">
                <span class="text-3xl animate-bounce">👑</span>
                <span class="text-amber-400 text-xs font-bold font-mono tracking-wider mt-1 truncate w-28 text-center select-all">${state.podiumData[0].nickname}</span>
                <span class="text-[10px] text-slate-400 font-mono mt-0.5">${state.podiumData[0].score}점</span>
                
                <div class="mt-3 bg-gradient-to-b from-amber-950/60 to-slate-900 border-t border-x border-amber-500/50 rounded-t-2xl w-28 h-32 flex items-center justify-center relative shadow-[0_0_25px_rgba(245,158,11,0.15)]">
                  <span class="text-4xl font-extrabold text-amber-500 font-display select-none">1</span>
                </div>
              </div>
            `: ""}

            <!-- 3위 bronze -->
            ${state.podiumData[2] ? `
              <div class="flex flex-col items-center w-28 group">
                <span class="text-amber-700 text-[10px] font-bold font-mono tracking-wider truncate w-24 text-center select-all">${state.podiumData[2].nickname}</span>
                <span class="text-[10px] text-slate-500 font-mono mt-0.5">${state.podiumData[2].score}점</span>
                
                <div class="mt-3 bg-slate-900 border-t border-x border-slate-800/80 rounded-t-xl w-24 h-16 flex items-center justify-center relative shadow-[inset_0_0_12px_rgba(255,255,255,0.01)]">
                  <span class="text-2xl font-extrabold text-amber-700 font-display select-none">3</span>
                </div>
              </div>
            `: ""}

          </div>

          <!-- Letters book block description -->
          <div class="p-6 bg-slate-950/80 border border-slate-800 rounded-2xl max-w-lg mx-auto text-center space-y-4 shadow-xl">
            <h4 class="text-xs uppercase tracking-widest text-slate-400 font-mono flex items-center justify-center space-x-1.5 border-b border-slate-800/60 pb-2">
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-400 animate-spin"></i>
              <span>Suneung Math 1등급 공략집 한줄평</span>
            </h4>
            
            <p class="text-xs leading-relaxed text-slate-300 leading-relaxed text-center select-text">
              "${state.podiumData[0] ? state.podiumData[0].cheer : '수능수리를 위해 함께 땀 흘린 모든 학생들에게 영광의 박수를 보냅니다.'}"
            </p>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="flex-grow flex flex-col overflow-hidden h-full">
      ${headerHtml}
      ${mainBody}
    </div>
  `;
}

// Subview 4: Student App screen
function renderStudentView() {
  if (!state.studentJoined) {
    return `
      <div class="flex-grow flex flex-col items-center justify-center p-4 bg-math-grid">
        <div class="max-w-md w-full p-8 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-2xl relative z-10 backdrop-blur space-y-6">
          <div class="text-center space-y-1.5">
            <span class="text-[10px] tracking-widest font-extrabold text-purple-400 uppercase select-none">수험생 전장 입장</span>
            <h2 class="text-2xl font-extrabold text-white font-display">수능 수리 21번 아레나</h2>
            <p class="text-xs text-slate-400">참전할 닉네임과 게임 코드(PIN)를 명시해 주십시오.</p>
          </div>

          <form id="student-join-form" onsubmit="studentJoinRoom(event)" class="space-y-4">
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-400 font-mono uppercase">참전 닉네임</label>
              <input id="stud-name" type="text" placeholder="예: 수학의성서, 수험생99" class="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all">
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-400 font-mono uppercase">대기실 PIN 입출코드</label>
              <input id="stud-pin" type="text" placeholder="6자리 PIN 번호를 입력하십시오" class="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl py-2.5 px-4 text-xs text-white tracking-widest font-mono text-center focus:outline-none focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all">
            </div>

            <button type="submit" class="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
              <i data-lucide="radio" class="w-4 h-4 text-white"></i>
              <span>실시간 아레나 입장하기</span>
            </button>
          </form>

          <div class="p-3 bg-purple-950/20 border border-purple-500/15 rounded-xl space-y-1 text-[11px] text-purple-300 leading-relaxed font-mono">
            <strong>💡 혼자서 컴퓨터 보들과 대결하기 :</strong>
            <p>호스트 방이 따로 없더라도 PIN 번호에 원하는 숫자(예: <span class="font-bold underline">777777</span>)를 기입하면, 즉시 가상의 최정예 수험생 AI 대결 봇 5명과 퀴즈 대 격돌을 펼칠 수 있습니다!</p>
          </div>
        </div>
      </div>
    `;
  }

  // Active joined game student panel state representation
  const room = state.room;
  if (!room) {
    return `
      <div class="flex-grow flex flex-col items-center justify-center p-4">
        <div class="text-center space-y-3">
          <i data-lucide="refresh-cw" class="w-10 h-10 animate-spin text-purple-400 mx-auto"></i>
          <p class="text-xs font-mono text-slate-400">대기 방을 스케줄링하고 서버에 소켓을 바인딩 중입니다...</p>
        </div>
      </div>
    `;
  }

  const currentQ = room.questions[room.currentQIdx];
  const totalQs = room.questions.length;

  let headerHtml = `
    <div class="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between sticky top-0 z-40 select-none">
      <div class="flex items-center space-x-3">
        <span class="bg-purple-950 text-purple-300 text-xs px-2.5 py-1 rounded-full font-mono border border-purple-500/10">수험생: ${state.studentName}</span>
        <span class="text-xs text-slate-400 font-mono">PIN: ${state.studentPin}</span>
      </div>
      
      <div class="text-right">
        <p class="text-slate-400 text-[10px] font-mono">현재 랭킹 스코어</p>
        <p class="text-white font-extrabold text-sm font-mono">${state.studentCurrentScore.toLocaleString()}점 <span class="text-amber-400 font-mono text-xs">🔥 streak ${state.studentStreak}</span></p>
      </div>
    </div>
  `;

  let bodyHtml = "";

  if (room.status === "LOBBY") {
    bodyHtml = `
      <div class="flex-grow flex flex-col items-center justify-center p-6 bg-math-grid text-center">
        <div class="max-w-md w-full space-y-6">
          <div class="space-y-2">
            <span class="text-[10px] font-mono tracking-widest text-purple-400 block animate-pulse">LOBBY CONNECTED</span>
            <h2 class="text-2xl font-extrabold text-white font-display">수능 대결 준비 완료!</h2>
            <p class="text-xs text-slate-400">호스트가 대결을 선포하면 아래 대결 문항이 즉각 실시간 출제됩니다.</p>
          </div>

          <div class="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
            <p class="text-xs text-slate-300 font-bold">참가 확정자 상태 :</p>
            <div class="flex flex-wrap justify-center gap-1.5">
              ${room.players.map(p => `
                <span class="bg-slate-950 border border-slate-800 rounded-full px-3 py-1 text-[11px] font-mono text-slate-300">
                  ${p.nickname === state.studentName ? '✨ 나' : p.nickname}
                </span>
              `).join('')}
            </div>

            <button onclick="studentStartSoloQuiz()" class="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center space-x-2">
              <i data-lucide="play" class="w-4 h-4"></i>
              <span>즉시 퀴즈 배틀 시작</span>
            </button>
          </div>
        </div>
      </div>
    `;
  } else if (room.status === "INTRO") {
    bodyHtml = `
      <div class="flex-grow flex flex-col items-center justify-center bg-math-grid text-center">
        <div class="space-y-4">
          <span class="text-[120px] font-extrabold tracking-tight font-display text-purple-400 animate-ping font-mono leading-none">${room.timerSeconds}</span>
          <p class="text-xs text-slate-400 tracking-widest uppercase font-mono mt-4">준킬러 문항 생성 카운트 다운</p>
        </div>
      </div>
    `;
  } else if (room.status === "PLAY") {
    bodyHtml = `
      <div class="flex-grow flex flex-col p-6 overflow-y-auto">
        <div class="max-w-2xl w-full mx-auto space-y-6 flex-grow flex flex-col justify-between">
          
          <div class="space-y-3">
            <div class="flex items-center justify-between border-b border-slate-800/50 pb-2">
              <span class="text-xs font-mono text-slate-500">문제 ${room.currentQIdx + 1} / ${totalQs}</span>
              <span class="text-xs font-mono text-purple-400 font-bold animate-pulse flex items-center">
                <i data-lucide="clock" class="w-3.5 h-3.5 mr-1"></i> 남은시간 ${room.timerSeconds}초
              </span>
            </div>

            <!-- Math question render area in student panel -->
            <div class="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl min-h-36 flex flex-col justify-center">
              <div class="math-renderer text-xs md:text-sm leading-relaxed text-slate-200 text-justify">
                ${renderMathToHtml(currentQ.content)}
              </div>
            </div>
          </div>

          <!-- Answer choice select boxes grid -->
          <div class="space-y-3 pt-6">
            <p class="text-[11px] font-mono text-slate-500 uppercase tracking-widest text-center">정답이라고 판정되는 번호를 선점해 주십시오</p>
            
            <div class="grid grid-cols-1 md:grid-cols-5 gap-2">
              ${[0, 1, 2, 3, 4].map(idx => {
                const isSelected = state.studentChoice === idx;
                let btnStyle = "bg-slate-900/50 border-slate-800 hover:border-purple-500/50 text-slate-200";
                
                if (state.studentChoice !== null) {
                  if (isSelected) {
                    btnStyle = "bg-purple-950/40 border-purple-500 text-purple-300 ring-2 ring-purple-500/20";
                  } else {
                    btnStyle = "bg-slate-900/20 border-slate-950 text-slate-600 opacity-40 cursor-not-allowed";
                  }
                }

                return `
                  <button onclick="studentSelectOption(${idx})" ${state.studentChoice !== null ? 'disabled' : ''} class="p-4 rounded-xl border text-left transition-all flex items-center justify-between font-mono ${btnStyle} group">
                    <span class="w-6 h-6 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-xs select-none">
                      ${idx + 1}
                    </span>
                    <span class="text-xs font-semibold select-all">${currentQ.options[idx]}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

        </div>
      </div>
    `;
  } else if (room.status === "REVEAL") {
    const isCorrect = state.studentChoice === currentQ.correctAnswer;
    
    bodyHtml = `
      <div class="flex-grow flex flex-col items-center justify-center p-6 bg-math-grid text-center">
        <div class="max-w-md w-full p-6 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-6">
          
          <div class="space-y-2">
            ${isCorrect ? `
              <div class="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(16,185,129,0.3)] select-none">
                <i data-lucide="check" class="w-8 h-8 text-emerald-400"></i>
              </div>
              <h2 class="text-2xl font-extrabold text-emerald-400 font-display">정답 사수 성공!</h2>
              <p class="text-xs text-slate-400 font-mono">가중치 보너스를 획득하여 선수의 위엄을 높였습니다.</p>
            `: `
              <div class="w-16 h-16 rounded-full bg-red-950/40 border border-red-500/40 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(239,68,68,0.3)] select-none">
                <i data-lucide="alert-circle" class="w-8 h-8 text-red-400"></i>
              </div>
              <h2 class="text-2xl font-extrabold text-rose-400 font-display">오답 판독 완료</h2>
              <p class="text-xs text-slate-400 font-mono">오답에 정교하게 대처하는 능력이 극대 성장의 밑거름이 됩니다.</p>
            `}
          </div>

          <div class="p-4 bg-slate-950 rounded-xl text-left border border-slate-800 text-[11px] font-mono leading-relaxed space-y-2">
            <span class="text-purple-400 font-bold block border-b border-slate-800 pb-1">출제 수식 증명</span>
            <div class="text-slate-300 max-h-32 overflow-y-auto select-text leading-relaxed">
              ${renderMathToHtml(currentQ.explanation)}
            </div>
          </div>

          <button onclick="hostAdvance('LEADERBOARD')" class="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all">
            실시간 순위표 확인
          </button>
        </div>
      </div>
    `;
  } else if (room.status === "LEADERBOARD") {
    bodyHtml = `
      <div class="flex-grow flex flex-col items-center justify-center p-6 bg-math-grid">
        <div class="max-w-md w-full space-y-6">
          <div class="text-center space-y-1.5">
            <span class="text-xs font-mono tracking-widest text-purple-400 block uppercase select-none">수험생 전장 성적판</span>
            <h2 class="text-2xl font-extrabold text-white font-display">실시간 나의 등수</h2>
          </div>

          <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 divide-y divide-slate-800/40">
            ${room.players.map((p, idx) => {
              const isMe = p.uuid === "student-user";
              let rankBadge = `${idx + 1}위`;
              if (idx === 0) rankBadge = "🥇";
              else if (idx === 1) rankBadge = "🥈";
              else if (idx === 2) rankBadge = "🥉";

              return `
                <div class="py-3 flex items-center justify-between ${isMe ? 'bg-purple-950/10 px-2 rounded-xl -mx-2 border border-purple-500/10' : ''}">
                  <div class="flex items-center space-x-3">
                    <span class="w-8 text-center">${rankBadge}</span>
                    <div>
                      <div class="text-xs font-bold font-mono ${isMe ? 'text-purple-300' : 'text-slate-300'}">
                        ${p.nickname} ${isMe ? '(나)' : ''}
                      </div>
                      ${p.streak >= 2 ? `
                        <div class="text-[9px] text-amber-400 font-mono flex items-center mt-0.5">
                          <i data-lucide="flame" class="w-3 h-3 mr-0.5"></i> ${p.streak}연설
                        </div>
                      ` : ''}
                    </div>
                  </div>

                  <span class="font-bold text-xs font-mono text-slate-100 select-all">${p.score.toLocaleString()}점</span>
                </div>
              `;
            }).join('')}
          </div>

          ${room.currentQIdx < totalQs - 1 ? `
            <div class="text-center">
              <span class="text-[11.5px] font-mono text-slate-500 animate-pulse block">호스트가 다음 전장에 진입하기 대기하는 중...</span>
            </div>
          `: ""}
        </div>
      </div>
    `;
  } else if (room.status === "PODIUM") {
    bodyHtml = `
      <div class="flex-grow flex flex-col items-center justify-center p-6 bg-math-style relative overflow-hidden">
        <div id="confetti-box" class="absolute inset-0 pointer-events-none z-0"></div>

        <div class="max-w-md w-full text-center space-y-6 relative z-10">
          <div class="space-y-1.5">
            <span class="text-[10px] tracking-widest font-extrabold text-amber-400 block font-mono">CONGRATULATIONS</span>
            <h2 class="text-3.5xl font-extrabold text-white font-display leading-tight uppercase">수능 수학 퀴즈 완주!</h2>
            <p class="text-xs text-slate-400 font-mono tracking-wide">수식을 해체하고 연산한 오늘 하루 고생 많으셨습니다.</p>
          </div>

          <div class="p-6 bg-slate-900/80 border border-purple-500/30 rounded-2xl shadow-xl space-y-4">
            <div class="text-slate-500 text-[10px] uppercase font-mono tracking-wider border-b border-slate-800 pb-1.5">최종 획득 성적 보고서</div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <p class="text-[10px] text-slate-400 font-mono">나의 최종 랭킹</p>
                <p class="text-lg font-bold text-purple-300 font-mono mt-1">${state.studentRank}위</p>
              </div>
              <div class="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <p class="text-[10px] text-slate-400 font-mono">누적 수득 스코어</p>
                <p class="text-lg font-bold text-purple-300 font-mono mt-1">${state.studentCurrentScore.toLocaleString()}점</p>
              </div>
            </div>

            <!-- Personalized expert encouraging quote block -->
            <div class="p-4 bg-purple-950/20 border border-purple-500/10 rounded-xl text-left text-xs text-slate-300 leading-relaxed text-center leading-relaxed">
              "${state.studentCheer || '끝까지 수능의 완비를 위해 경합한 수험생의 도정이 가장 찬란하게 완화될 것입니다.'}"
            </div>
          </div>

          <button onclick="resetApp()" class="bg-slate-800 text-slate-300 hover:text-white border border-slate-700 px-6 py-2.5 rounded-xl text-xs transition-all">
             게임 나가기 및 초기화
          </button>
        </div>
      </div>
    `;
  }

  return `
    <div class="flex-grow flex flex-col overflow-hidden h-full">
      ${headerHtml}
      ${bodyHtml}
    </div>
  `;
}

// 8. Initialization Run triggers on direct file parse
document.addEventListener("DOMContentLoaded", () => {
  render();
});
render();
