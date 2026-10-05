/* Shared logic: used by both popup.js and content.js */

const QM_SUPABASE_URL = "https://htjjpxmcmixhejmobxkh.supabase.co";
// Public anon key from QuizMagic's own JavaScript bundle.
// Their frontend sends this with every request; it is not a secret.
const QM_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ampweG1jbWl4aGVqbW9ieGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNDc0NzEsImV4cCI6MjA2ODYyMzQ3MX0." +
  "V6SsyKBjsbHUaqv1J55xefInYmTGbJGAlJdi-vtINKw";

const QM_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/** Extract the session code from a quizmagic.io/session/<code> URL. */
function qmExtractShareId(url) {
  const m = String(url || "").match(/quizmagic\.io\/session\/([A-Za-z0-9]+)/);
  return m ? m[1] : null;
}

/** Normalize question text for order-independent matching. */
function qmNormText(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Fetch all questions + correct answers for a session.
 * This is the exact request the participant page makes when it loads —
 * the server includes the correct answer ("answer": "D") on every question.
 * No login, nothing is submitted. Works even with every restriction on
 * (shuffled questions/options, timer, anti-cheat) because those are all
 * enforced client-side; the API still returns the full answer key.
 *
 * IMPORTANT when options are shuffled (randomize_options): the option
 * LETTERS refer to the original stored order, not the shuffled display
 * order. Always match by correctText, never by letter.
 */
async function qmFetchAnswers(shareId) {
  const res = await fetch(
    `${QM_SUPABASE_URL}/rest/v1/rpc/get_quiz_session_safe`,
    {
      method: "POST",
      headers: {
        apikey: QM_ANON_KEY,
        Authorization: `Bearer ${QM_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_share_id: shareId }),
    }
  );
  if (!res.ok) throw new Error("Request failed (HTTP " + res.status + ")");
  const data = await res.json();
  if (!data || !data.length)
    throw new Error("Session not found or inactive: " + shareId);

  const quiz = data[0];
  const questions = (quiz.quiz_questions || []).map((q, i) => {
    const options = q.options || [];
    const letter = (q.answer || "").trim().toUpperCase();
    const idx =
      letter.length === 1 && letter >= "A" && letter <= "Z"
        ? letter.charCodeAt(0) - 65
        : -1;
    return {
      n: i + 1,
      type: q.type || "multiple choice",
      question: q.question || "",
      options,
      correctOption: letter || null,
      correctText:
        idx >= 0 && idx < options.length ? options[idx] : null,
    };
  });

  return {
    title: quiz.quiz_title || "Quiz",
    shareId,
    fetchedAt: Date.now(),
    randomizeQuestions: !!quiz.randomize_questions,
    randomizeOptions: !!quiz.randomize_options,
    questions,
  };
}

/** Build a lookup: normalized question text -> answer. Order-independent. */
function qmBuildAnswerMap(result) {
  const map = {};
  result.questions.forEach((q) => {
    map[qmNormText(q.question)] = {
      n: q.n,
      correctOption: q.correctOption,
      correctText: q.correctText,
    };
  });
  return map;
}

/* ---------- 5-minute cache (chrome.storage.local) ---------- */

function qmCacheKey(shareId) {
  return "qm_cache_" + shareId;
}

async function qmGetCached(shareId) {
  try {
    const obj = await chrome.storage.local.get(qmCacheKey(shareId));
    const entry = obj[qmCacheKey(shareId)];
    if (entry && Date.now() - entry.ts < QM_CACHE_TTL_MS) return entry.result;
  } catch (e) {
    /* storage unavailable — fall through to live fetch */
  }
  return null;
}

async function qmSetCached(shareId, result) {
  try {
    await chrome.storage.local.set({
      [qmCacheKey(shareId)]: { ts: Date.now(), result },
    });
  } catch (e) {
    /* ignore */
  }
}

/** Fetch with cache; pass force=true to re-fetch (Re-fetch button). */
async function qmGetAnswers(shareId, force) {
  if (!force) {
    const cached = await qmGetCached(shareId);
    if (cached) return { result: cached, fromCache: true };
  }
  const result = await qmFetchAnswers(shareId);
  await qmSetCached(shareId, result);
  return { result, fromCache: false };
}
