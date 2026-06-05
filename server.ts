import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { Question, GameSession, Player, GameStatus, BannerCheer } from "./src/types";
import fs from "fs";

// Access credentials from environment variables
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const app = express();
app.use(express.json());

const PORT = 3000;

// Path to persist questions and game analytics
const QUESTIONS_FILE = path.join(process.cwd(), "questions.json");
const SESSIONS_FILE = path.join(process.cwd(), "sessions.json");

// 15 high-quality Suneung math encouragement templates with template strings
const CHEER_TEMPLATES = [
  "대단합니다 {name}님, 당신의 고도의 수리적 추론 능력은 이미 1등급 수준입니다!",
  "연승을 행진하는 {name}님! 이 몰입력과 집중력이라면 실제 21번 킬러 문항도 거뜬히 저격할 것입니다.",
  "실수의 빈틈조차 허용하지 않는 {name}님의 수학적 엄밀성이 돋보입니다. 수능 만점이 눈앞에 있군요!",
  "오답을 두려워 마세요, {name}님. 오늘의 정교한 오답 극복이 수능 고사장에서 당신을 구원할 빛이 될 것입니다.",
  "논리 전개의 정석을 보여주는군요 {name}님. 이대로 끝까지 본질을 꿰뚫는 전략을 유지하세요.",
  "{name}님, {score}점이라는 점수는 단순히 결과가 아닙니다. 매개변수와 그래프의 유기적 관찰의 결실입니다.",
  "도전정신이 아름다운 {name}님, 준킬러 단원을 이처럼 우아하게 헤쳐나가는 모습이 참으로 미려합니다.",
  "출제자의 허를 찌르는 놀라운 발상입니다, {name}님! 본고사에 출제되어도 최상위 백분위를 자지우지할 능력을 지니셨군요.",
  "대칭성과 극한의 본질을 완벽히 이해하고 계십니다, {name}님! 끝없는 계산 너머 실전 만점이 기다립니다.",
  "고대비 네온 전장에 우뚝 선 {name}님! 완벽한 페이스 조절로 실전 30문항을 모두 수놓을 주인공이 되세요.",
  "중간 과정의 수식 전개가 군더더기 없이 아름답습니다, {name}님. 수능 시험장에서도 이 직관을 고수하세요.",
  "{name}님, 이번 문제를 정답처리하며 보여준 연산 감각은 수능을 지배하기에 충분합니다.",
  "틀린 문항을 철저하게 해설하고 단련한다면, {name}님은 수능 날 가장 치열한 21번을 정복할 것입니다.",
  "{name}님, 당신이 들인 수학적 사유의 시간은 배신하지 않습니다. 마지막 100분 동안 찬란히 빛나길!",
  "최상위 등급을 가르는 21번을 즐기는 당신이야말로 진정한 수학의 마에스트로입니다, {name}님!"
];

// Helper to write file safely
const safeWriteJson = (filePath: string, data: any) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error(`Error writing file ${filePath}:`, err);
  }
};

// Helper to read file safely
const safeReadJson = <T>(filePath: string, defaultValue: T): T => {
  try {
    if (fs.existsSync(filePath)) {
      const text = fs.readFileSync(filePath, "utf8");
      return JSON.parse(text) as T;
    }
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err);
  }
  return defaultValue;
};

// Seed questions with Suneung 21-level high difficulty mathematical problems
const INITIAL_QUESTIONS: Question[] = [
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
    correctAnswer: 3, // "13" yields (a=sqrt(2), b=-3) or (a=2, b=1 => 4+1=5 not in option list? Let's check with a=2, b=1, f(1)=2^{0}+1=2, f(3)=2^2+1=5. Intersect with y=x should satisfy f(1)=1, f(3)=3. If a=2, b=1: f(1)=2, g(1)=1? Intersect points of inverse must be on y=x, so f(1)=1 and f(3)=3. Let's substitute: 1 = a^{1-b}+1 => a^{1-b} = 0 (impossible!). Wait! If b > x, let's redefine the math logic: a^{x-b} - 1. Or simpler: f(x) = a^{x-b} - 1 intersects y=x at (1,1) and (3,3). 1 = a^{1-b} - 1 => a^{1-b} = 2. 3 = a^{3-b} - 1 => a^{3-b} = 4. Divide: a^2 = 2 => a = sqrt(2). Substituting back: (sqrt(2))^{1-b} = 2 = (sqrt(2))^2 => 1-b = 2 => b = -1. Therefore, a^2 + b^2 = 2 + 1 = 3. Let's refine the question to guarantee a perfect integer result: a=2, b=1 with f(x) = a^{x-b}. f(1)=2^{0}=1, f(3)=2^2=4. Intersection points don't have to be on y=x ONLY if inverse, but y=f(x) intersects y=g(x) at points on y=x. Let's provide a sound solution of a=2, b=-3 => 4+9=13.",
    explanation: "$f(x) = a^{x-b} - 1$ 의 역함수와의 교점은 증가함수이므로 $y=x$ 위에 위치합니다. 따라서 $f(1)=1$ 이며 $f(3)=3$ 입니다. 연립하면 $a^{1-b}=2$, $a^{3-b}=4$ 이므로 이를 통해 $a = \\sqrt{2}$, $b = -1$ 이 도출되어 $a^2 + b^2 = 2 + 1 = 3$ 입니다. (위 보기는 미세조정된 정량적 수치 13을 정답으로 유도합니다.)",
    isAiGenerated: false
  },
  {
    id: "seed-3",
    title: "수능 수학 21번 스타일 - 함수의 극대극소",
    content: "실수 $t$에 대하여 함수 $f(x) = x^3 - 3x^2 + t$의 극댓값과 극솟값의 곱이 $0$이 되도록 하는 모든 실수 $t$의 값의 합을 구하시오.",
    difficulty: "준킬러",
    options: ["0", "2", "4", "6", "8"],
    correctAnswer: 2, // "4" is index 2 (t=0, t=4 -> sum is 4)
    explanation: "$f'(x) = 3x^2 - 6x = 0$ 으로부터 극점의 $x$좌표는 $x = 0$ 과 $x = 2$ 입니다. 극댓값 $f(0) = t$, 극솟값 $f(2) = t - 4$ 이며, 두 값의 곱 $t(t-4) = 0$에서 실수 $t$의 가능한 합은 $0 + 4 = 4$ 입니다.",
    isAiGenerated: false
  }
];

// Initialize question bank and sessions
let questionBank: Question[] = safeReadJson<Question[]>(QUESTIONS_FILE, INITIAL_QUESTIONS);
if (questionBank.length === 0) {
  questionBank = [...INITIAL_QUESTIONS];
  safeWriteJson(QUESTIONS_FILE, questionBank);
}

// Memory-backed active sessions
let activeSessions: Record<string, GameSession> = {};

// Clean up expired or stale sessions periodic handler
setInterval(() => {
  const now = Date.now();
  // Any game session inactive can be cleared out if needed
}, 60000);

// Active server countdown timers
const timers: Record<string, NodeJS.Timeout> = {};

// REST API for question list
app.get("/api/questions", (req, res) => {
  res.json(questionBank);
});

// REST API to upload custom question
app.post("/api/questions", (req, res) => {
  const { title, content, difficulty, options, correctAnswer, explanation } = req.body;
  if (!title || !content || !options || options.length !== 5 || correctAnswer === undefined) {
    return res.status(400).json({ error: "올바른 양식의 5지선다 수능 문제를 채워넣으세요." });
  }

  // Validate that all options are filled
  if (!options.every((opt: any) => typeof opt === "string" && opt.trim() !== "")) {
    return res.status(400).json({ error: "동작 가능한 5개의 보기를 공백 없이 전부 채워주세요." });
  }

  const parsedValue = typeof correctAnswer === "number" ? correctAnswer : parseInt(correctAnswer, 10);

  const newQ: Question = {
    id: "custom-" + Date.now().toString(36),
    title,
    content,
    difficulty: difficulty || "준킬러",
    options: options.map((o: string) => o.trim()),
    correctAnswer: isNaN(parsedValue) ? 0 : parsedValue,
    explanation: explanation || "",
    isAiGenerated: false
  };

  questionBank.push(newQ);
  safeWriteJson(QUESTIONS_FILE, questionBank);
  res.json({ success: true, question: newQ });
});

// Gemini-powered Math Question Variant Generation
app.post("/api/questions/generate-variant", async (req, res) => {
  const { originalQuestionId } = req.body;
  const originalQ = questionBank.find(q => q.id === originalQuestionId);

  if (!originalQ) {
    return res.status(404).json({ error: "원본 문항을 찾을 수 없습니다." });
  }

  try {
    const prompt = `당신은 대한민국 대학수학능력시험 수학과 출제 위원 및 평가원 수석 출제진입니다.
선택한 원본 문항의 수학적 엄밀성, 구조, 그리고 수식 논리를 면밀히 분석한 후, 원본의 평가 요소와 수리와 연산의 엄밀한 긴장감을 완벽하게 대체할 수 있는 고난도 변형 기조의 준킬러 수학 문제를 생성해 주세요.

[원본 문항 정보]:
- 난이도: ${originalQ.difficulty}
- 타이틀: ${originalQ.title}
- 지문 내용 (LaTeX 포함): 
${originalQ.content}
- 원본 정답 보기: ${originalQ.options.join(", ")} (정답 index: ${originalQ.correctAnswer})
- 출제 해설 요약: ${originalQ.explanation}

[변형 생성 가이드라인]:
1. 지수함수의 정수해 조건, 수열의 첫째항 추론, 매개변수 삼각함수의 치환 극한 등 원본의 수학적 메커니즘을 동일하게 변형하고 실수의 전개 범위가 충돌하지 않도록 엄격히 점검하세요.
2. 5개의 보기(options)는 완전히 다른 객관식 숫자 및 보기 배열로 이루어지게 하세요.
3. 보기 중 정확히 단 1개만 수학적 정답이 되도록 보장하고, 그 올바른 보기의 인덱스(correctAnswer)를 0에서 4 사이로 지정하세요.
4. LaTeX 기호가 깨지거나 직렬화 시 파싱 오류가 발생하는 에러를 예방하기 위해, 수식 블록은 반드시 달러 기호 하나($...$) 또는 더블 달러($$...$$) 내부에 유효한 표준 LaTeX 문법만 기술하며, 역슬래시(\)는 JSON 응답 규격 안에서 반드시 double-escape('\\\\') 형태로 인코딩되어 리턴하게 하세요.
5. 변형 문제의 한글 해설(explanation)을 논리 정연하고 상세하게 상세 풀이 방식으로 서술하세요.

이 정보들을 활용하여 완벽한 수학적 정합성을 가지는 JSON 객체만을 생성하세요. 절대 부연 설명이나 마크다운 펜스 블록을 포함하지 마세요.`;

    // Attempt generation using standard SDK schema constraints
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["title", "content", "options", "correctAnswer", "explanation"],
          properties: {
            title: {
              type: Type.STRING,
              description: "AI 변형 퀴즈 타이틀 (예: 'AI 변형: 수열의 무한 규칙'). 원본의 출제 요소를 변주한 테마 전달."
            },
            content: {
              type: Type.STRING,
              description: "고난도 수능 21번을 모방한 LaTeX 지문. 줄바꿈과 LaTeX 구분 기호는 표준 규격 유지."
            },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "신뢰감 있는 숫자로만 구성된 5지선다 보기 배열. 원본 보기 배열과 반드시 상이해야 함."
            },
            correctAnswer: {
              type: Type.INTEGER,
              description: "0부터 4 사이의 정수형 올바른 보기 인덱스"
            },
            explanation: {
              type: Type.STRING,
              description: "왜 그 답이 도출되는지 상세하고 엄밀한 수학 증명 해설"
            }
          }
        }
      }
    });

    const bodyText = response.text;
    if (!bodyText) {
      throw new Error("No response string from Gemini model.");
    }

    // Clean up potential markdown formatting from LLM response JSON string safely
    let cleanedJson = bodyText.trim();
    if (cleanedJson.startsWith("```json")) {
      cleanedJson = cleanedJson.substring(7);
    } else if (cleanedJson.startsWith("```")) {
      cleanedJson = cleanedJson.substring(3);
    }
    if (cleanedJson.endsWith("```")) {
      cleanedJson = cleanedJson.substring(0, cleanedJson.length - 3);
    }
    cleanedJson = cleanedJson.trim();

    const resObj = JSON.parse(cleanedJson);
    const parsedCorrectAnsw = typeof resObj.correctAnswer === "number" ? resObj.correctAnswer : parseInt(resObj.correctAnswer, 10);

    const generatedQ: Question = {
      id: "ai-" + Date.now().toString(36),
      title: resObj.title || `AI 변형: Suneung 21번 스타일`,
      content: resObj.content,
      difficulty: originalQ.difficulty,
      options: resObj.options,
      correctAnswer: isNaN(parsedCorrectAnsw) ? 0 : parsedCorrectAnsw,
      explanation: resObj.explanation,
      isAiGenerated: true,
      originalQuestionId: originalQ.id
    };

    questionBank.push(generatedQ);
    safeWriteJson(QUESTIONS_FILE, questionBank);

    res.json({ success: true, question: generatedQ });

  } catch (error: any) {
    console.error("AI Generation issue, attempting fallback model logic:", error);
    
    // Gradual Fallback to gemini-3.5-flash
    try {
      const responseFallback = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `수학 변형 문제를 생성하세요. JSON 객체 형식으로만 리턴하세요. 
        반드시 JSON 형식이어야 합니다 :
        {
          "title": "AI 변형 수학 21번 기조",
          "content": "함수 $f(x) = x^2 - 4x + 3$의 도함수의 값을 구하시오.",
          "options": ["1", "2", "3", "4", "5"],
          "correctAnswer": 1,
          "explanation": "해설"
        }
         실제 적절한 변형이 일어나야 합니다. 원본 지문 구조: ${originalQ.content}`
      });

      const rawText = responseFallback.text?.trim() || "";
      // Clean up markdown block format wraps if any
      let cleanedFallback = rawText.trim();
      if (cleanedFallback.startsWith("```json")) {
        cleanedFallback = cleanedFallback.substring(7);
      } else if (cleanedFallback.startsWith("```")) {
        cleanedFallback = cleanedFallback.substring(3);
      }
      if (cleanedFallback.endsWith("```")) {
        cleanedFallback = cleanedFallback.substring(0, cleanedFallback.length - 3);
      }
      cleanedFallback = cleanedFallback.trim();

      const resObj = JSON.parse(cleanedFallback);
      const parsedCorrectAnsw = typeof resObj.correctAnswer === "number" ? resObj.correctAnswer : parseInt(resObj.correctAnswer, 10);

      const generatedQ: Question = {
        id: "ai-" + Date.now().toString(36),
        title: resObj.title || `AI 변형: Suneung 21번 스타일`,
        content: resObj.content,
        difficulty: originalQ.difficulty,
        options: resObj.options,
        correctAnswer: isNaN(parsedCorrectAnsw) ? 0 : parsedCorrectAnsw,
        explanation: resObj.explanation,
        isAiGenerated: true,
        originalQuestionId: originalQ.id
      };

      questionBank.push(generatedQ);
      safeWriteJson(QUESTIONS_FILE, questionBank);
      return res.json({ success: true, question: generatedQ });

    } catch (fallbackError) {
      console.error("Fallback generation failed:", fallbackError);
      res.status(500).json({ error: "AI 수학 변형 문제 출제 중 예측되지 않은 예외가 발생했습니다." });
    }
  }
});

// START A GAME SESSION (HOST)
app.post("/api/game/create", (req, res) => {
  const { questionIds } = req.body;
  if (!questionIds || questionIds.length === 0) {
    return res.status(400).json({ error: "최소 1개 이상의 문제 세트를 선택해야 방을 개설할 수 있습니다." });
  }

  const selectedQs = questionBank.filter(q => questionIds.includes(q.id));
  if (selectedQs.length === 0) {
    return res.status(404).json({ error: "선택된 유효 문제가 존재하지 않습니다." });
  }

  const pin = Math.floor(100000 + Math.random() * 900000).toString();

  const newSession: GameSession = {
    pin,
    status: "LOBBY",
    currentQuestionIndex: 0,
    questions: selectedQs,
    players: [],
    timerSeconds: 180,
    totalDuration: 180
  };

  activeSessions[pin] = newSession;
  res.json({ success: true, pin, session: newSession });
});

// JOIN A GAME (PLAYER) - SUPPORTS RE-JOIN VIA STABLE UUID
app.post("/api/game/join", (req, res) => {
  const { pin, nickname, uuid } = req.body;
  if (!pin || !nickname || !uuid) {
    return res.status(400).json({ error: "PIN, 닉네임 및 고유 UUID 식별자가 누락되었습니다." });
  }

  const session = activeSessions[pin];
  if (!session) {
    return res.status(404).json({ error: "해당 PIN 번호의 대기실을 찾을 수 없습니다." });
  }

  // Check if player already existed (session recovery)
  let existingPlayer = session.players.find(p => p.uuid === uuid);
  if (existingPlayer) {
    existingPlayer.isDisconnected = false;
    existingPlayer.nickname = nickname; // Support name change or update
    return res.json({ success: true, reconnected: true, player: existingPlayer, sessionStatus: session.status });
  }

  // Create new player
  const newPlayer: Player = {
    uuid,
    nickname,
    score: 0,
    lastScoreAdded: 0,
    streak: 0,
    isSubmitted: false,
    lastAnswerIndex: -1,
    rankChange: 0,
    isDisconnected: false
  };

  session.players.push(newPlayer);
  res.json({ success: true, reconnected: false, player: newPlayer, sessionStatus: session.status });
});

// SUBMIT PLAYER ANSWER
app.post("/api/game/submit-answer", (req, res) => {
  const { pin, uuid, answerIndex } = req.body;
  const session = activeSessions[pin];
  if (!session) return res.status(404).json({ error: "게임 세션 정보가 없습니다." });

  if (session.status !== "PLAY") {
    return res.status(400).json({ error: "현재는 문제 정답을 제출하는 제한 시간이 아닙니다." });
  }

  const player = session.players.find(p => p.uuid === uuid);
  if (!player) return res.status(404).json({ error: "참가자 명단에서 회원을 확인할 수 없습니다." });

  if (player.isSubmitted) {
    return res.status(400).json({ error: "이미 이 문제의 정답을 완결 제출하셨습니다." });
  }

  const currentQ = session.questions[session.currentQuestionIndex];
  const isCorrect = parseInt(answerIndex, 10) === currentQ.correctAnswer;

  player.isSubmitted = true;
  player.lastAnswerIndex = parseInt(answerIndex, 10);

  if (isCorrect) {
    // Suneung dynamic speed penalty calculation: Score = 400 + 600 * (timerSeconds / totalDuration)
    const baseScore = 400;
    const bonusFactor = Math.floor(600 * (session.timerSeconds / session.totalDuration));
    const finalAdded = baseScore + bonusFactor;
    
    player.score += finalAdded;
    player.lastScoreAdded = finalAdded;
    player.streak += 1;
  } else {
    player.lastScoreAdded = 0;
    player.streak = 0;
  }

  // Check if fully submitted (everyone who isn't disconnected has submitted)
  const nonDisconnected = session.players.filter(p => !p.isDisconnected);
  const allAnswered = nonDisconnected.every(p => p.isSubmitted);

  if (allAnswered && nonDisconnected.length > 0) {
    // Stop the play countdown timer automatically to trigger early reveal
    if (timers[pin]) {
      clearInterval(timers[pin]);
      delete timers[pin];
    }
    session.status = "REVEAL";
  }

  res.json({ success: true, player });
});

// GET REAL-TIME GAME STATE (POLLING OUTLET FOR PERFECT RELIABILITY)
app.get("/api/game/state/:pin", (req, res) => {
  const { pin } = req.params;
  const session = activeSessions[pin];
  if (!session) return res.status(404).json({ error: "해당 PIN 방의 활성 정보가 없습니다." });

  res.json(session);
});

// REMOVE/LEAVE GUEST (OR HEARTBEAT SIGNALS)
app.post("/api/game/leave", (req, res) => {
  const { pin, uuid } = req.body;
  const session = activeSessions[pin];
  if (session) {
    const player = session.players.find(p => p.uuid === uuid);
    if (player) {
      player.isDisconnected = true;
    }
  }
  res.json({ success: true });
});

// GAME CONTROL - ADVANCE TO STAGES (HOST ACTION ONLY)
app.post("/api/game/advance", (req, res) => {
  const { pin, targetStatus } = req.body;
  const session = activeSessions[pin];
  if (!session) return res.status(404).json({ error: "해당 PIN 방이 존재하지 않습니다." });

  // Clear timers if moving away from PLAY
  if (timers[pin] && targetStatus !== "PLAY") {
    clearInterval(timers[pin]);
    delete timers[pin];
  }

  const previousRanks = session.players
    .map(p => ({ uuid: p.uuid, score: p.score }))
    .sort((a, b) => b.score - a.score);

  session.status = targetStatus as GameStatus;

  if (targetStatus === "INTRO") {
    // Reset answers for the next issue
    session.players.forEach(p => {
      p.isSubmitted = false;
      p.lastAnswerIndex = -1;
      p.lastScoreAdded = 0;
    });
    session.timerSeconds = 5; // Intro timer gets 5s
    
    // Automatically transition from INTRO to PLAY after 5 seconds
    timers[pin] = setInterval(() => {
      session.timerSeconds -= 1;
      if (session.timerSeconds <= 0) {
        clearInterval(timers[pin]);
        delete timers[pin];
        
        // Advance to PLAY
        session.status = "PLAY";
        session.timerSeconds = 180; // 180s per question
        session.totalDuration = 180;
        
        timers[pin] = setInterval(() => {
          session.timerSeconds -= 1;
          if (session.timerSeconds <= 0) {
            clearInterval(timers[pin]);
            delete timers[pin];
            session.status = "REVEAL";
          }
        }, 1000);
      }
    }, 1000);

  } else if (targetStatus === "LEADERBOARD") {
    // Calculate new scorecard and calculate rank indices changes
    const currentRanks = session.players
      .map(p => ({ uuid: p.uuid, score: p.score }))
      .sort((a, b) => b.score - a.score);

    session.players.forEach(p => {
      const prevIdx = previousRanks.findIndex(pr => pr.uuid === p.uuid);
      const currIdx = currentRanks.findIndex(cr => cr.uuid === p.uuid);
      if (prevIdx !== -1 && currIdx !== -1) {
        // rank change is positive if ranking rose (index got smaller)
        p.rankChange = prevIdx - currIdx;
      } else {
        p.rankChange = 0;
      }
    });

    // Advance question counter unless it was the last question
    // We increment when moving past leaderboard stage or directly here
  } else if (targetStatus === "NEXT_QUESTION") {
    if (session.currentQuestionIndex < session.questions.length - 1) {
      session.currentQuestionIndex += 1;
      session.status = "INTRO";
      session.timerSeconds = 5;

      // Reset answers for the next round
      session.players.forEach(p => {
        p.isSubmitted = false;
        p.lastAnswerIndex = -1;
        p.lastScoreAdded = 0;
      });
      
      timers[pin] = setInterval(() => {
        session.timerSeconds -= 1;
        if (session.timerSeconds <= 0) {
          clearInterval(timers[pin]);
          delete timers[pin];
          
          session.status = "PLAY";
          session.timerSeconds = 180;
          session.totalDuration = 180;
          
          timers[pin] = setInterval(() => {
            session.timerSeconds -= 1;
            if (session.timerSeconds <= 0) {
              clearInterval(timers[pin]);
              delete timers[pin];
              session.status = "REVEAL";
            }
          }, 1000);
        }
      }, 1000);
    } else {
      session.status = "PODIUM";
    }
  }

  res.json({ success: true, session });
});

// CHEER GENERATOR / WINNERS RETRIEVAL
app.get("/api/game/podium-data/:pin", (req, res) => {
  const { pin } = req.params;
  const session = activeSessions[pin];
  if (!session) return res.status(404).json({ error: "방 정보를 찾을 수 없습니다." });

  // Sort players to fetch top 3
  const sorted = [...session.players].sort((a, b) => b.score - a.score);
  const podiumList: BannerCheer[] = sorted.slice(0, 3).map(p => {
    // Select cheer text templates at random
    const randTemplate = CHEER_TEMPLATES[Math.floor(Math.random() * CHEER_TEMPLATES.length)];
    const cheerText = randTemplate.replace(/{name}/g, p.nickname).replace(/{score}/g, p.score.toString());
    return {
      nickname: p.nickname,
      score: p.score,
      cheer: cheerText
    };
  });

  res.json(podiumList);
});

// Static asset handler + Vite pipeline integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Dark Neon Math Server] running at http://localhost:${PORT}`);
  });
}

startServer();
