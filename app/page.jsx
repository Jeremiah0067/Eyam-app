'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Shield, Skull, RefreshCw, Play, Pause, ChevronRight, BookOpen,
  Users, AlertTriangle, CheckCircle, Clock, FileText, Map,
  Lock, Unlock, Star, BarChart3, Eye, EyeOff, Send, Award, Flame,
  Maximize, Minimize2
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const PERSONAS = [
  {
    name: 'Elizabeth Hancock',
    role: 'Mother of Six',
    status: 'Working Class',
    motive: 'Keep her children alive at all costs — morality yields to maternal instinct.',
    accent: 'rose',
    icon: '👩‍👧',
    historical: 'Elizabeth Hancock buried six of her seven children and her husband within eight days in August 1666. She carried each body to the field herself, unable to get help from terrified neighbours.',
  },
  {
    name: 'Thomas Sydall',
    role: 'Wealthy Merchant',
    status: 'Upper Class',
    motive: 'Has the means to flee to London; terrified of losing his fortune and his life.',
    accent: 'amber',
    icon: '🏦',
    historical: 'Several wealthier Eyam residents did attempt to leave before the quarantine was agreed. Mompesson had to rely on moral persuasion — he had no legal power to stop anyone.',
  },
  {
    name: 'William Mompesson',
    role: 'Village Rector',
    status: 'Clergy',
    motive: 'Driven by religious duty and civic sacrifice — the many outweigh the few.',
    accent: 'blue',
    icon: '⛪',
    historical: 'Mompesson\'s wife Catherine died of plague in August 1666. He survived and continued to minister to the dying until the epidemic ended. He is buried in Eyam churchyard.',
  },
  {
    name: 'Alexander Hadfield',
    role: 'Young Blacksmith',
    status: 'Skilled Tradesman',
    motive: 'Relies on community trade; deeply suspicious of authority and top-down orders.',
    accent: 'emerald',
    icon: '⚒️',
    historical: 'Tradesmen in Eyam faced economic ruin from the quarantine. Supplies were left at the boundary stones but demand for their skilled work collapsed entirely for over a year.',
  },
];

const EVIDENCE = [
  {
    id: 'e1',
    title: 'Parish Death Register',
    type: 'Document',
    icon: '📜',
    unlocksAt: 0,
    content: 'September 7, 1665 — George Viccars, tailor, buried. The first recorded death. His landlady Mary Cooper buried three weeks later. Her son Edward Cooper, buried October 22.',
    relevance: 'This is how it began — a bolt of cloth from London carrying infected fleas.',
  },
  {
    id: 'e2',
    title: 'Map of Eyam Village',
    type: 'Map',
    icon: '🗺️',
    unlocksAt: 0,
    content: 'Eyam sits in a limestone valley in the Peak District. The nearest towns — Sheffield to the north, Bakewell to the south — were within a day\'s walk. The boundary stones were placed at every road out of the village.',
    relevance: 'Geography mattered enormously. Eyam was naturally isolated — the quarantine reinforced what nature had partly already done.',
  },
  {
    id: 'e3',
    title: 'Mompesson\'s Letter to Earl of Devonshire',
    type: 'Primary Source',
    icon: '✉️',
    unlocksAt: 1,
    content: '"I have prevailed with them to consent to a most heroic resolution, never to attempt the flight which might have been so fatal to the country; to stay within our own limits. The Earl hath promised to supply us with necessaries."',
    relevance: 'Mompesson had no legal authority. He persuaded. The Earl of Devonshire arranged food drops at the boundary — Eyam\'s lifeline.',
  },
  {
    id: 'e4',
    title: 'The Boundary Stone (Coolstone)',
    type: 'Artefact',
    icon: '🪨',
    unlocksAt: 1,
    content: 'Six holes were drilled into the Coolstone at the village boundary. Coins were placed in the holes filled with vinegar — it was believed the acid would kill the contagion on the money. Outsiders left food; villagers left payment.',
    relevance: 'This was a remarkably sophisticated infection-control system for 1666. The logic — disinfecting currency — was medically sound even if the science wasn\'t fully understood.',
  },
  {
    id: 'e5',
    title: 'Elizabeth Hancock\'s Account',
    type: 'Oral History',
    icon: '👩‍👧',
    unlocksAt: 2,
    content: 'Elizabeth buried her husband John and six of her children in the field adjacent to her farm — Riley Field — over eight days in August 1666. Unable to get help, she dragged each body herself. She survived alone.',
    relevance: 'The human cost of the quarantine was devastating and unequal. Entire families were wiped out. Survival often came down to luck, not virtue.',
  },
  {
    id: 'e6',
    title: 'Defoe\'s Account (1722)',
    type: 'Secondary Source',
    icon: '📖',
    unlocksAt: 2,
    content: '"Two hundred and sixty villagers perished out of three hundred and fifty. The plague did not cross the boundary stone. Eyam was remembered — and is remembered still — as an act of collective heroism without precedent in English history."',
    relevance: 'Defoe wrote 56 years later. History constructed the heroic narrative. But did the people of Eyam see themselves as heroes — or simply as people trying to survive?',
  },
];

const ETHICS_FRAMEWORKS = {
  utilitarian: {
    name: 'Utilitarian',
    philosopher: 'Jeremy Bentham / John Stuart Mill',
    color: 'blue',
    icon: '⚖️',
    verdictA: 'The total quarantine maximises overall welfare — 260 die inside Eyam, but potentially tens of thousands are saved in the northern towns. A utilitarian supports Option A decisively.',
    verdictB: 'Exempting women and children feels compassionate but risks spreading the plague. A strict utilitarian would oppose this — the maths of suffering points to total quarantine.',
    verdictFinalA: 'The outcome justifies the decision. 260 deaths prevented a potential epidemic killing many thousands. The utilitarian calculus supports Eyam\'s sacrifice.',
    verdictFinalB: 'The utilitarian is uncomfortable here. The outcome was good, but was the process the only way to achieve it? Could fewer have died with better information?',
  },
  kantian: {
    name: 'Kantian',
    philosopher: 'Immanuel Kant',
    color: 'purple',
    icon: '🧠',
    verdictA: 'Kant\'s Categorical Imperative asks: could we universalise this rule? "All villages must quarantine themselves during plague" — arguably yes. But using people as mere means to save others violates the humanity formula.',
    verdictB: 'Kant would approve of protecting women and children if it stems from genuine duty — but would question whether the exceptions are motivated by true moral principle or mere sentiment.',
    verdictFinalA: 'Kant struggles here. The heroic narrative feels right, but he would ask: did the villagers truly choose freely, or were they coerced by social and religious pressure? Genuine moral worth requires truly free choice.',
    verdictFinalB: 'Kant finds this more honest. Acknowledging the moral cost of instrumentalising human life — even for good ends — aligns with his insistence on human dignity as an end in itself.',
  },
  buddhist: {
    name: 'Buddhist',
    philosopher: 'The First & Second Precepts',
    color: 'amber',
    icon: '☸️',
    verdictA: 'The First Precept (do not take life) is complex here — enforcing quarantine does not take life directly, but knowingly traps people where they will die. A Buddhist might see this as an act of metta (loving-kindness) toward the wider community.',
    verdictB: 'Compassion (karuna) for the vulnerable — women and children — aligns with Buddhist values. But creating a two-tier system raises questions about equanimity (upekkha) — should some lives matter more?',
    verdictFinalA: 'Buddhism would honour the selflessness of the sacrifice — anatta (no-self) expressed communally. But it would mourn the suffering (dukkha) as real and not to be minimised in the name of legacy.',
    verdictFinalB: 'Buddhism would respect this dissent. Questioning whether suffering can be justified by outcome reflects Buddhist suspicion of attachment to results — including the attachment to being remembered as heroic.',
  },
};

// Branching checkpoint system — choices at CP1 affect CP2 options
const CHECKPOINTS = [
  {
    id: 1,
    timestamp: 135,
    label: 'The First Death',
    timeLabel: '2:15',
    source: '"George Viccars, tailor, received a box of moist cloth from London. Within four days, he was dead of the pestilence. His landlady, Mary Cooper, then fell ill."',
    sourceAuthor: '— Parish Records, Eyam, September 1665',
    prompt: 'You notice early symptoms in your household. The cart road south is unguarded tonight. Do you flee under cover of darkness — or report the sickness to the rector and isolate?',
    discussion: [
      'At what point does self-preservation become morally wrong?',
      'Does your persona\'s social class change what is "right" for them here?',
      'How would a Buddhist respond using the First Precept?',
    ],
    debateMinutes: 3,
    choices: [
      {
        label: 'Flee the village immediately',
        description: 'Leave tonight before any quarantine. Your family may survive — but you carry the risk.',
        effect: { village: -10, national: -30 },
        consequence: 'Your flight spreads fear. Two families in the next town show symptoms within a week.',
        historicallyAccurate: false,
        unlocksEvidence: ['e1', 'e2'],
        branchTag: 'fled',
      },
      {
        label: 'Self-isolate and report to authorities',
        description: 'Seal your household. Inform Rector Mompesson. Accept whatever comes.',
        effect: { village: -20, national: +25 },
        consequence: 'Your honesty allows early warning. Your sacrifice is noted in the parish register.',
        historicallyAccurate: true,
        unlocksEvidence: ['e1', 'e2'],
        branchTag: 'stayed',
      },
    ],
  },
  {
    id: 2,
    timestamp: 330,
    label: 'The Boundary Line',
    timeLabel: '5:30',
    source: '"Rector Mompesson proposed a cordon marked by boundary stones. No one may cross outward. Supplies shall be left at the perimeter; payment placed in vinegar-filled holes in the stone."',
    sourceAuthor: '— Letter from Mompesson to the Earl of Devonshire, 1666',
    prompt: 'The rector calls a village meeting. He asks every man, woman and child to agree voluntarily to total quarantine — knowing many will die inside.',
    promptBranch: {
      fled: 'You fled at Checkpoint 1. You hear news of the quarantine from a distance. Do you return to support your community — or stay away, knowing your return might spread the disease further?',
      stayed: 'You stayed and isolated at Checkpoint 1. Now Mompesson asks for total quarantine. You\'ve already sacrificed once. Can you commit to this too?',
    },
    discussion: [
      'Does any leader have the moral right to ask this of their community?',
      'Compare this to COVID-19 lockdowns — what is similar? What is different?',
      'From your persona\'s perspective — do you trust Mompesson? Why?',
    ],
    debateMinutes: 4,
    choices: [
      {
        label: 'Enforce total quarantine — no exceptions',
        description: 'Support Mompesson fully. The boundary holds for every person.',
        effect: { village: -30, national: +35 },
        consequence: 'The plague is contained. The northern towns are saved. But 260 of your 350 neighbours will not survive the year.',
        historicallyAccurate: true,
        unlocksEvidence: ['e3', 'e4'],
        branchTag: 'strict',
        lockedIfBranch: null,
      },
      {
        label: 'Create exceptions for women and children',
        description: 'Argue that the healthy — especially children — should be permitted to leave.',
        effect: { village: +15, national: -25 },
        consequence: 'Some families escape. But three asymptomatic carriers cross the boundary. Sheffield reports new cases by autumn.',
        historicallyAccurate: false,
        unlocksEvidence: ['e3', 'e4'],
        branchTag: 'exceptions',
        lockedIfBranch: 'fled',
        lockedReason: 'You fled in Checkpoint 1. You have no moral standing to argue for exceptions — the community no longer trusts your judgement.',
      },
    ],
  },
  {
    id: 3,
    timestamp: 525,
    label: 'The Aftermath & Legacy',
    timeLabel: '8:45',
    source: '"Two hundred and sixty villagers perished out of three hundred and fifty. The plague did not cross the boundary stone into the northern towns. Eyam was remembered — and is remembered still — as an act of collective heroism."',
    sourceAuthor: '— Daniel Defoe, A Journal of the Plague Year, 1722',
    prompt: 'History calls Eyam heroic. But you have lived inside it. Through your persona\'s eyes — was this sacrifice worth it?',
    discussion: [
      'Does the outcome justify the process? Is this consequentialist thinking?',
      'Would Eyam be remembered differently if the plague had crossed the boundary anyway?',
      'Write one sentence your persona would say at a neighbour\'s graveside.',
    ],
    debateMinutes: 5,
    choices: [
      {
        label: 'Declare the sacrifice a heroic success',
        description: 'The greater good was served. History will honour Eyam. The dead are martyrs, not victims.',
        effect: { village: 0, national: 0 },
        consequence: 'You stand by the decision. Centuries later your village becomes a pilgrimage site. The boundary stones still stand.',
        historicallyAccurate: true,
        unlocksEvidence: ['e5', 'e6'],
        isFinal: true,
        verdictKey: 'A',
      },
      {
        label: 'Argue the human cost was too cruel to justify',
        description: 'No authority has the right to sentence people to death, even for the many.',
        effect: { village: 0, national: 0 },
        consequence: 'You dissent. History disagrees — but your argument echoes in every ethics classroom that studies Eyam.',
        historicallyAccurate: false,
        unlocksEvidence: ['e5', 'e6'],
        isFinal: true,
        verdictKey: 'B',
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function clamp(v, min = 0, max = 100) { return Math.max(min, Math.min(max, v)); }

function extractYouTubeId(input) {
  if (!input) return null;
  const s = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s; // already a bare video ID
  const match = s.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

const ACCENT = {
  rose:    { border: 'border-rose-700',    bg: 'bg-rose-900/30',    text: 'text-rose-300',    bar: 'bg-rose-500',    btn: 'bg-rose-700 hover:bg-rose-600' },
  amber:   { border: 'border-amber-700',   bg: 'bg-amber-900/30',   text: 'text-amber-300',   bar: 'bg-amber-500',   btn: 'bg-amber-700 hover:bg-amber-600' },
  blue:    { border: 'border-blue-700',    bg: 'bg-blue-900/30',    text: 'text-blue-300',    bar: 'bg-blue-500',    btn: 'bg-blue-700 hover:bg-blue-600' },
  emerald: { border: 'border-emerald-700', bg: 'bg-emerald-900/30', text: 'text-emerald-300', bar: 'bg-emerald-500', btn: 'bg-emerald-700 hover:bg-emerald-600' },
  purple:  { border: 'border-purple-700',  bg: 'bg-purple-900/30',  text: 'text-purple-300',  bar: 'bg-purple-500',  btn: 'bg-purple-700 hover:bg-purple-600' },
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function MetricBar({ label, value, colorClass, icon }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-400 flex items-center gap-1">{icon}{label}</span>
        <span className="text-xs font-bold text-slate-200">{value}%</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${colorClass}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function DebateTimer({ minutes, onComplete }) {
  const [secs, setSecs] = useState(minutes * 60);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (running && secs > 0) {
      ref.current = setInterval(() => setSecs(s => { if (s <= 1) { clearInterval(ref.current); onComplete(); return 0; } return s - 1; }), 1000);
    }
    return () => clearInterval(ref.current);
  }, [running, secs]);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  const pct = ((minutes * 60 - secs) / (minutes * 60)) * 100;
  return (
    <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> Debate Timer — {minutes} min</span>
        <div className="flex gap-2">
          <button onClick={() => setRunning(r => !r)} className={`text-xs px-3 py-1 rounded-lg font-semibold transition-colors ${running ? 'bg-red-700 hover:bg-red-600 text-white' : 'bg-emerald-700 hover:bg-emerald-600 text-white'}`}>
            {running ? 'Pause' : secs === minutes * 60 ? 'Start Debate' : 'Resume'}
          </button>
          <button onClick={() => { setSecs(minutes * 60); setRunning(false); clearInterval(ref.current); }} className="text-xs px-2 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300">Reset</button>
        </div>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden mb-2">
        <div className={`h-full rounded-full transition-all duration-1000 ${secs < 30 ? 'bg-red-500' : secs < 60 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }} />
      </div>
      <p className={`text-center font-mono text-2xl font-bold ${secs < 30 ? 'text-red-400' : secs < 60 ? 'text-amber-400' : 'text-emerald-400'}`}>{m}:{s.toString().padStart(2, '0')}</p>
    </div>
  );
}

function EthicsPanel({ verdictKey, checkpointId }) {
  const [open, setOpen] = useState(null);
  const isCheckpoint = checkpointId < 3;
  return (
    <div className="mt-4 space-y-2">
      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" /> Ethics Framework Analysis</p>
      {Object.entries(ETHICS_FRAMEWORKS).map(([key, fw]) => {
        const verdict = isCheckpoint
          ? (verdictKey === 'A' ? fw.verdictA : fw.verdictB)
          : (verdictKey === 'A' ? fw.verdictFinalA : fw.verdictFinalB);
        const ac = ACCENT[fw.color] || ACCENT.blue;
        return (
          <div key={key} className={`border rounded-lg overflow-hidden ${ac.border}`}>
            <button onClick={() => setOpen(o => o === key ? null : key)} className={`w-full flex items-center justify-between px-3 py-2 ${ac.bg} text-left`}>
              <span className={`text-xs font-semibold flex items-center gap-2 ${ac.text}`}><span>{fw.icon}</span>{fw.name} — {fw.philosopher}</span>
              <ChevronRight className={`w-3 h-3 ${ac.text} transition-transform ${open === key ? 'rotate-90' : ''}`} />
            </button>
            {open === key && <div className="px-3 py-2 text-xs text-slate-300 leading-relaxed bg-slate-900/60">{verdict}</div>}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECKPOINT MODAL
// ─────────────────────────────────────────────────────────────────────────────

function CheckpointModal({ checkpoint, persona, onChoice, branchTag, classVotes, onClassVote }) {
  const [phase, setPhase] = useState('source'); // source | debate | choice | result
  const [selected, setSelected] = useState(null);
  const [debateDone, setDebateDone] = useState(false);
  const ac = ACCENT[persona.accent];
  const promptText = checkpoint.promptBranch?.[branchTag] || checkpoint.prompt;

  const handleChoice = (idx) => {
    if (selected !== null) return;
    const ch = checkpoint.choices[idx];
    if (ch.lockedIfBranch && ch.lockedIfBranch === branchTag) return;
    setSelected(idx);
    onClassVote(checkpoint.id, idx);
    setPhase('result');
    setTimeout(() => onChoice(ch), 2200);
  };

  const phases = ['source', 'debate', 'choice', 'result'];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full my-4 shadow-2xl">

        {/* Header */}
        <div className="bg-red-950/70 border-b border-red-900/40 px-5 py-3 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-400 w-4 h-4" />
            <div>
              <p className="text-xs text-red-400 font-semibold uppercase tracking-widest">Checkpoint {checkpoint.id} — {checkpoint.timeLabel}</p>
              <h2 className="text-base font-bold text-white">{checkpoint.label}</h2>
            </div>
          </div>
          {/* Phase stepper */}
          <div className="flex gap-1">
            {['📜','💬','⚔️','✓'].map((icon, i) => (
              <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${i <= phases.indexOf(phase) ? 'bg-red-700 text-white' : 'bg-slate-700 text-slate-500'}`}>{icon}</div>
            ))}
          </div>
        </div>

        <div className="p-5 space-y-4">

          {/* PHASE: SOURCE */}
          {phase === 'source' && (
            <>
              <div className="bg-amber-950/40 border border-amber-800/40 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Primary Source Evidence</span>
                </div>
                <p className="text-amber-100 text-sm italic leading-relaxed font-serif">{checkpoint.source}</p>
                <p className="text-amber-600/70 text-xs mt-2">{checkpoint.sourceAuthor}</p>
              </div>
              <div className={`border rounded-xl p-4 ${ac.border} ${ac.bg}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{persona.icon}</span>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${ac.text}`}>{persona.name} — Your Perspective</span>
                </div>
                <p className="text-slate-200 text-sm leading-relaxed">{promptText}</p>
              </div>
              <button onClick={() => setPhase('debate')} className="w-full bg-red-800 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">
                Start Class Debate →
              </button>
            </>
          )}

          {/* PHASE: DEBATE */}
          {phase === 'debate' && (
            <>
              <DebateTimer minutes={checkpoint.debateMinutes} onComplete={() => setDebateDone(true)} />
              <div className="bg-slate-800/60 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Google Meet Discussion Questions</span>
                </div>
                <ul className="space-y-2">
                  {checkpoint.discussion.map((q, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-300">
                      <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => setPhase('choice')}
                disabled={!debateDone}
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-red-800 hover:bg-red-700 text-white"
              >
                {debateDone ? 'Make Your Decision →' : 'Debate must finish before deciding'}
              </button>
            </>
          )}

          {/* PHASE: CHOICE */}
          {phase === 'choice' && (
            <>
              {/* Class vote tally */}
              {classVotes[checkpoint.id] && Object.keys(classVotes[checkpoint.id]).length > 0 && (
                <div className="bg-slate-800/60 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider flex items-center gap-1"><BarChart3 className="w-3 h-3" /> Class Verdict Board</p>
                  <div className="flex gap-2">
                    {checkpoint.choices.map((c, i) => {
                      const votes = classVotes[checkpoint.id]?.[i] || 0;
                      const total = Object.values(classVotes[checkpoint.id] || {}).reduce((a, b) => a + b, 0);
                      const pct = total > 0 ? Math.round(votes / total * 100) : 0;
                      return (
                        <div key={i} className="flex-1 bg-slate-700/60 rounded-lg p-2 text-center">
                          <p className="text-xs text-slate-300 font-semibold">{String.fromCharCode(65 + i)}</p>
                          <p className="text-xl font-bold text-white">{pct}%</p>
                          <p className="text-xs text-slate-500">{votes} vote{votes !== 1 ? 's' : ''}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Make your decision</p>
              {checkpoint.choices.map((c, i) => {
                const locked = c.lockedIfBranch && c.lockedIfBranch === branchTag;
                return (
                  <button
                    key={i}
                    onClick={() => !locked && handleChoice(i)}
                    disabled={locked}
                    className={`w-full text-left rounded-xl p-4 transition-all duration-200 group border ${
                      locked
                        ? 'bg-slate-800/40 border-slate-700 opacity-50 cursor-not-allowed'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-600 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full border border-slate-500 group-hover:border-white flex items-center justify-center flex-shrink-0 mt-0.5">
                        {locked ? <Lock className="w-3 h-3 text-slate-500" /> : <span className="text-xs font-bold text-slate-400 group-hover:text-white">{String.fromCharCode(65 + i)}</span>}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-white text-sm">{c.label}</p>
                          {c.historicallyAccurate && <span className="text-xs bg-emerald-900/60 text-emerald-400 border border-emerald-700/50 px-1.5 py-0.5 rounded-full">Historically accurate</span>}
                        </div>
                        <p className="text-slate-400 text-xs mt-1 leading-relaxed">{locked ? c.lockedReason : c.description}</p>
                        {!locked && (
                          <div className="flex gap-3 mt-2">
                            <span className={`text-xs font-semibold ${c.effect.village >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>Village {c.effect.village >= 0 ? '+' : ''}{c.effect.village}%</span>
                            <span className={`text-xs font-semibold ${c.effect.national >= 0 ? 'text-blue-400' : 'text-red-400'}`}>National {c.effect.national >= 0 ? '+' : ''}{c.effect.national}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </>
          )}

          {/* PHASE: RESULT */}
          {phase === 'result' && selected !== null && (
            <>
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-600">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Your Decision: {checkpoint.choices[selected].label}</span>
                </div>
                <p className="text-slate-300 text-sm italic leading-relaxed">"{checkpoint.choices[selected].consequence}"</p>
                {checkpoint.choices[selected].historicallyAccurate
                  ? <p className="text-emerald-400 text-xs mt-2 font-semibold">✓ This matches what Eyam villagers actually did.</p>
                  : <p className="text-amber-400 text-xs mt-2 font-semibold">✗ This differs from the historical record.</p>}
              </div>
              <EthicsPanel verdictKey={checkpoint.choices[selected].isFinal ? checkpoint.choices[selected].verdictKey : (selected === 0 ? 'A' : 'B')} checkpointId={checkpoint.id} />
              <p className="text-slate-600 text-xs text-center">Returning to the documentary…</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TUTOR DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

function TutorDashboard({ decisions, journals, persona, villageSurvival, nationalSafety, accuracyScore, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-amber-700/50 rounded-2xl max-w-2xl w-full my-4 shadow-2xl">
        <div className="bg-amber-950/60 border-b border-amber-800/40 px-5 py-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-amber-300">Tutor Dashboard — Session Summary</h2>
          </div>
          <button onClick={onClose} className="text-xs text-slate-500 hover:text-white bg-slate-800 px-3 py-1 rounded-lg">Close</button>
        </div>
        <div className="p-5 space-y-5">
          {/* Student overview */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-red-400">{villageSurvival}%</p>
              <p className="text-xs text-slate-400 mt-1">Village Survival</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-blue-400">{nationalSafety}%</p>
              <p className="text-xs text-slate-400 mt-1">National Safety</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-amber-400">{accuracyScore}/3</p>
              <p className="text-xs text-slate-400 mt-1">Historical Accuracy</p>
            </div>
          </div>

          {/* Persona played */}
          <div className="bg-slate-800 rounded-xl p-3">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Persona Played</p>
            <p className="text-sm font-semibold text-white">{persona.icon} {persona.name} — {persona.role}</p>
            <p className="text-xs text-slate-400 italic mt-1">"{persona.motive}"</p>
          </div>

          {/* Decisions */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Decision Log</p>
            {decisions.length === 0 && <p className="text-slate-600 text-sm italic">No decisions recorded yet.</p>}
            {decisions.map((d, i) => (
              <div key={i} className="border-l-2 border-red-800 pl-3 mb-3">
                <p className="text-xs text-red-400 font-semibold">{d.checkpoint}</p>
                <p className="text-sm text-white font-medium">{d.choice}</p>
                <p className="text-xs text-slate-500 italic">"{d.consequence}"</p>
                <span className={`text-xs font-semibold ${d.accurate ? 'text-emerald-400' : 'text-amber-400'}`}>{d.accurate ? '✓ Historically accurate' : '✗ Differs from historical record'}</span>
              </div>
            ))}
          </div>

          {/* Journal entries */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">Persona Journal Entries</p>
            {Object.keys(journals).length === 0 && <p className="text-slate-600 text-sm italic">No journal entries recorded yet.</p>}
            {Object.entries(journals).map(([cpId, entry]) => (
              <div key={cpId} className="bg-slate-800/60 rounded-lg p-3 mb-2">
                <p className="text-xs text-slate-500 mb-1">After Checkpoint {cpId}</p>
                <p className="text-sm text-slate-300 italic">"{entry}"</p>
              </div>
            ))}
          </div>

          <button onClick={() => window.print()} className="w-full bg-amber-800 hover:bg-amber-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">
            Print / Save Summary
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INTRO / BRIEFING SCREEN
// ─────────────────────────────────────────────────────────────────────────────

function IntroScreen({ persona, personaIdx, setPersonaIdx, onStart }) {
  const ac = ACCENT[persona.accent];

  const HOW_IT_WORKS = [
    { icon: <Play className="w-4 h-4" />, title: 'Watch', text: 'A short documentary about the 1665–66 Eyam plague quarantine plays automatically.' },
    { icon: <AlertTriangle className="w-4 h-4" />, title: 'Pause at checkpoints', text: 'Three times, the video stops itself at a key moment and shows you a real historical source.' },
    { icon: <Clock className="w-4 h-4" />, title: 'Debate first', text: 'A short countdown timer gives you and your class time to discuss the discussion questions before deciding — no rushing to the button.' },
    { icon: <Users className="w-4 h-4" />, title: 'Decide in character', text: 'You choose how your persona responds. Your earlier choices can open or close options later — the story branches.' },
    { icon: <Star className="w-4 h-4" />, title: 'See the ethics', text: 'After each decision, see how a Utilitarian, a Kantian, and a Buddhist thinker would judge what you chose.' },
    { icon: <FileText className="w-4 h-4" />, title: 'Journal & evidence', text: 'Write a short in-character reflection after each checkpoint, and unlock real historical documents as you go.' },
    { icon: <Award className="w-4 h-4" />, title: 'Get your verdict', text: 'At the end, see your Village Survival and National Safety scores, your historical accuracy score, and the class-wide verdict board.' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center px-4 py-10">
      <div className="max-w-2xl w-full">

        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Skull className="w-6 h-6 text-red-500" />
            <h1 className="font-bold text-white text-2xl tracking-tight">Eyam 1665</h1>
          </div>
          <p className="text-slate-400 text-sm">The Boundary Stone Dilemma — Interactive Documentary & Ethics Simulator</p>
        </div>

        {/* What this is */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-4">
          <p className="text-slate-300 text-sm leading-relaxed">
            In 1665, plague reached the English village of Eyam. Rather than flee, the village agreed to seal itself off completely — no one in, no one out — to stop the disease spreading to nearby towns. Roughly three in four villagers died. Here, you'll live through that decision from inside the village, as a real historical figure, and decide for yourself whether it was the right thing to do.
          </p>
        </div>

        {/* How it works */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">How it works</h2>
          <div className="space-y-3">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-slate-400">
                  {step.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{step.title}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Persona picker */}
        <div className={`border rounded-2xl p-5 mb-6 ${ac.border} ${ac.bg}`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-semibold uppercase tracking-wider ${ac.text}`}>Choose who you'll play</span>
            <button onClick={() => setPersonaIdx(i => (i + 1) % PERSONAS.length)} className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
              <RefreshCw className="w-3 h-3" /> Re-roll
            </button>
          </div>
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl">{persona.icon}</span>
            <div>
              <h2 className="font-bold text-white text-base">{persona.name}</h2>
              <p className={`text-xs font-medium ${ac.text}`}>{persona.role} — {persona.status}</p>
            </div>
          </div>
          <p className="text-sm text-slate-300 italic leading-relaxed mb-3">"{persona.motive}"</p>
          <div className="grid grid-cols-2 gap-2">
            {PERSONAS.map((p, i) => (
              <button key={i} onClick={() => setPersonaIdx(i)} className={`flex items-center gap-2 px-2 py-2 rounded-lg text-xs transition-colors ${i === personaIdx ? 'bg-slate-700 text-white' : 'bg-slate-900/40 text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
                <span>{p.icon}</span><span className="font-medium truncate">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        <button onClick={onStart} className="w-full bg-red-800 hover:bg-red-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
          Begin the Simulation <ChevronRight className="w-4 h-4" />
        </button>
        <p className="text-center text-xs text-slate-600 mt-3">You can switch persona later from the sidebar too.</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function EyamSimulator() {
  const [started, setStarted]             = useState(false);
  const [personaIdx, setPersonaIdx]       = useState(0);
  const [villageSurvival, setVillageSurvival] = useState(100);
  const [nationalSafety, setNationalSafety]   = useState(50);
  const [activeCheckpoint, setActiveCheckpoint] = useState(null);
  const [completedIds, setCompletedIds]   = useState(new Set());
  const [isPlaying, setIsPlaying]         = useState(false);
  const [currentTime, setCurrentTime]     = useState(0);
  const [playerReady, setPlayerReady]     = useState(false);
  const [videoId, setVideoId]             = useState('-nbmEAlCvcQ'); // "The Plague Village" documentary — swap via the loader UI if it ever fails
  const [loadError, setLoadError]         = useState(false);
  const [videoInput, setVideoInput]       = useState('');
  const [finalVerdict, setFinalVerdict]   = useState(null);
  const [decisions, setDecisions]         = useState([]);
  const [branchTag, setBranchTag]         = useState(null);
  const [unlockedEvidence, setUnlockedEvidence] = useState(['e1', 'e2']);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [journals, setJournals]           = useState({});
  const [journalDraft, setJournalDraft]   = useState('');
  const [classVotes, setClassVotes]       = useState({});
  const [tutorOpen, setTutorOpen]         = useState(false);
  const [tutorPwd, setTutorPwd]           = useState('');
  const [tutorUnlocked, setTutorUnlocked] = useState(false);
  const [sideTab, setSideTab]             = useState('persona'); // persona | evidence | journal | votes
  const [accuracyScore, setAccuracyScore] = useState(0);

  const ytRef   = useRef(null);
  const timerRef= useRef(null);
  const loadTimeoutRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [theaterMode, setTheaterMode] = useState(false);
  const persona = PERSONAS[personaIdx];

  // Theater mode is plain CSS overlay (not the browser's native Fullscreen API),
  // so it can never hide the checkpoint popup behind it and never needs an
  // async exit call that might fail. Escape key backs out of it too.
  useEffect(() => {
    if (!theaterMode) return;
    const onKey = (e) => { if (e.key === 'Escape') setTheaterMode(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [theaterMode]);

  const toggleTheaterMode = () => setTheaterMode(t => !t);

  // Creates (or re-creates) the YouTube player for a given video ID.
  // If it isn't ready within 7s, or YouTube reports an error, we surface
  // a visible error + a box to paste a different video — instead of
  // spinning on "Loading documentary..." forever.
  function createPlayer(id) {
    if (ytRef.current?.destroy) { try { ytRef.current.destroy(); } catch (e) {} }
    clearTimeout(loadTimeoutRef.current);
    setPlayerReady(false);
    setLoadError(false);

    ytRef.current = new window.YT.Player('yt-player', {
      videoId: id,
      playerVars: { controls: 0, modestbranding: 1, rel: 0, enablejsapi: 1 },
      events: {
        onReady: () => { clearTimeout(loadTimeoutRef.current); setPlayerReady(true); },
        onStateChange: (e) => setIsPlaying(e.data === window.YT.PlayerState.PLAYING),
        onError: () => { clearTimeout(loadTimeoutRef.current); setLoadError(true); },
      },
    });

    loadTimeoutRef.current = setTimeout(() => {
      setPlayerReady(ready => { if (!ready) setLoadError(true); return ready; });
    }, 7000);
  }

  const handleLoadNewVideo = () => {
    const id = extractYouTubeId(videoInput);
    if (!id) return;
    setVideoId(id);
    setVideoInput('');
    createPlayer(id);
  };

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT?.Player) { createPlayer(videoId); return; }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => createPlayer(videoId);
    return () => { window.onYouTubeIframeAPIReady = null; clearTimeout(loadTimeoutRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (ytRef.current?.getCurrentTime) {
        const t = Math.floor(ytRef.current.getCurrentTime());
        setCurrentTime(t);
        for (const cp of CHECKPOINTS) {
          if (!completedIds.has(cp.id) && t >= cp.timestamp && t < cp.timestamp + 3) {
            ytRef.current.pauseVideo();
            setTheaterMode(false);
            setActiveCheckpoint(cp);
            break;
          }
        }
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [completedIds]);

  const handlePlay = () => {
    if (ytRef.current) isPlaying ? ytRef.current.pauseVideo() : ytRef.current.playVideo();
  };

  const handleChoice = useCallback((choice) => {
    setVillageSurvival(v => clamp(v + choice.effect.village));
    setNationalSafety(v => clamp(v + choice.effect.national));
    setBranchTag(choice.branchTag || branchTag);
    if (choice.historicallyAccurate) setAccuracyScore(s => s + 1);
    setUnlockedEvidence(prev => [...new Set([...prev, ...(choice.unlocksEvidence || [])])]);
    setDecisions(d => [...d, {
      checkpoint: activeCheckpoint.label,
      choice: choice.label,
      consequence: choice.consequence,
      accurate: choice.historicallyAccurate,
    }]);
    if (choice.isFinal) setFinalVerdict(choice);
    setCompletedIds(s => new Set([...s, activeCheckpoint.id]));
    setActiveCheckpoint(null);
    setTimeout(() => { if (ytRef.current && !choice.isFinal) ytRef.current.playVideo(); }, 600);
  }, [activeCheckpoint, branchTag]);

  const handleClassVote = (cpId, choiceIdx) => {
    setClassVotes(v => ({
      ...v,
      [cpId]: { ...(v[cpId] || {}), [choiceIdx]: ((v[cpId] || {})[choiceIdx] || 0) + 1 },
    }));
  };

  const saveJournal = (cpId) => {
    if (!journalDraft.trim()) return;
    setJournals(j => ({ ...j, [cpId]: journalDraft.trim() }));
    setJournalDraft('');
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const allEvidence = EVIDENCE.filter(e => unlockedEvidence.includes(e.id));

  if (!started) {
    return (
      <IntroScreen
        persona={persona}
        personaIdx={personaIdx}
        setPersonaIdx={setPersonaIdx}
        onStart={() => setStarted(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">

      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Skull className="w-4 h-4 text-red-500" />
                <h1 className="font-bold text-white text-sm tracking-tight">Eyam 1665: The Boundary Stone Dilemma</h1>
              </div>
              <p className="text-xs text-slate-600 ml-6">Interactive Documentary & Ethics Simulator</p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <MetricBar label="Village Survival" value={villageSurvival} colorClass="bg-red-500" icon={<Skull className="w-3 h-3 text-red-400" />} />
              <MetricBar label="National Safety" value={nationalSafety} colorClass="bg-blue-500" icon={<Shield className="w-3 h-3 text-blue-400" />} />
              <button onClick={() => setTutorOpen(true)} className="flex items-center gap-1 text-xs text-slate-500 hover:text-amber-400 transition-colors">
                <Eye className="w-3 h-3" /> Tutor
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-5 grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* LEFT: VIDEO */}
        <div className="lg:col-span-2 space-y-4">

          <div
            ref={videoContainerRef}
            className={theaterMode
              ? 'fixed inset-0 z-40 bg-black flex items-center justify-center p-2 sm:p-6'
              : 'relative rounded-xl overflow-hidden bg-black aspect-video shadow-2xl border border-slate-800'}
          >
            <div id="yt-player" className={theaterMode ? 'w-full h-full max-w-6xl max-h-full aspect-video' : 'w-full h-full'} />
            {loadError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900 p-5">
                <div className="text-center max-w-xs w-full">
                  <AlertTriangle className="w-7 h-7 text-amber-400 mx-auto mb-2" />
                  <p className="text-slate-200 text-sm font-semibold mb-1">Video didn't load</p>
                  <p className="text-slate-500 text-xs mb-3">Paste a YouTube link (or just the video ID) to swap it in — no redeploy needed.</p>
                  <div className="flex gap-2">
                    <input
                      value={videoInput}
                      onChange={e => setVideoInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleLoadNewVideo(); }}
                      placeholder="https://youtube.com/watch?v=..."
                      className="flex-1 min-w-0 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white placeholder-slate-600 outline-none focus:border-red-600"
                    />
                    <button onClick={handleLoadNewVideo} className="bg-red-700 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg font-semibold flex-shrink-0">Load</button>
                  </div>
                </div>
              </div>
            ) : !playerReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-slate-400 text-xs">Loading documentary…</p>
                </div>
              </div>
            )}
            {theaterMode && (
              <button
                onClick={toggleTheaterMode}
                className="absolute top-3 right-3 flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 px-3 py-2 rounded-lg text-xs font-semibold transition-colors border border-slate-700"
              >
                <Minimize2 className="w-3.5 h-3.5" /> Exit Theater Mode (Esc)
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-3 flex-wrap">
            <button onClick={handlePlay} disabled={!playerReady} className="flex items-center gap-2 bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button onClick={toggleTheaterMode} disabled={!playerReady} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 px-3 py-2 rounded-lg text-sm font-semibold transition-colors border border-slate-700">
              {theaterMode ? <Minimize2 className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              {theaterMode ? 'Exit Theater Mode' : 'Theater Mode'}
            </button>
            <span className="text-xs text-slate-400 font-mono">{formatTime(currentTime)}</span>
            <div className="flex gap-2 flex-wrap">
              {CHECKPOINTS.map(cp => (
                <span key={cp.id} className={`text-xs px-2 py-1 rounded-full font-medium border ${completedIds.has(cp.id) ? 'bg-emerald-900/50 text-emerald-400 border-emerald-700' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                  {completedIds.has(cp.id) ? '✓' : '○'} {cp.timeLabel}
                </span>
              ))}
            </div>
          </div>

          {/* Decision Log */}
          {decisions.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1"><FileText className="w-3 h-3" /> Decision Log</h3>
              <div className="space-y-3">
                {decisions.map((d, i) => (
                  <div key={i} className="border-l-2 border-red-800 pl-3">
                    <p className="text-xs text-red-400 font-semibold">{d.checkpoint}</p>
                    <p className="text-sm text-slate-200 font-medium">{d.choice}</p>
                    <p className="text-xs text-slate-500 italic">"{d.consequence}"</p>
                    <span className={`text-xs font-semibold ${d.accurate ? 'text-emerald-400' : 'text-amber-400'}`}>{d.accurate ? '✓ Historical' : '✗ Counterfactual'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Final verdict */}
          {finalVerdict && (
            <div className="bg-amber-950/40 border border-amber-700/50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-amber-300">Session Complete — Final Verdict</h3>
              </div>
              <p className="text-amber-100 text-sm italic leading-relaxed mb-4">"{finalVerdict.consequence}"</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-slate-900/60 rounded-lg p-3 text-center"><p className="text-2xl font-bold text-red-400">{villageSurvival}%</p><p className="text-xs text-slate-400 mt-1">Village Survival</p></div>
                <div className="bg-slate-900/60 rounded-lg p-3 text-center"><p className="text-2xl font-bold text-blue-400">{nationalSafety}%</p><p className="text-xs text-slate-400 mt-1">National Safety</p></div>
                <div className="bg-slate-900/60 rounded-lg p-3 text-center"><p className="text-2xl font-bold text-amber-400">{accuracyScore}/3</p><p className="text-xs text-slate-400 mt-1">Historical accuracy</p></div>
              </div>
              <EthicsPanel verdictKey={finalVerdict.verdictKey} checkpointId={3} />
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-4">

          {/* Sidebar tabs */}
          <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
            {[['persona','👤'],['evidence','🔍'],['journal','📓'],['votes','📊']].map(([t, ic]) => (
              <button key={t} onClick={() => setSideTab(t)} className={`flex-1 flex flex-col items-center py-1.5 rounded-lg text-xs font-medium transition-colors ${sideTab === t ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                <span className="text-base">{ic}</span>
                <span className="capitalize text-[10px] mt-0.5">{t}</span>
              </button>
            ))}
          </div>

          {/* PERSONA TAB */}
          {sideTab === 'persona' && (
            <>
              <div className={`border rounded-xl p-4 ${ACCENT[persona.accent].border} ${ACCENT[persona.accent].bg}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${ACCENT[persona.accent].text}`}>Your Persona</span>
                  <button onClick={() => setPersonaIdx(i => (i + 1) % PERSONAS.length)} className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
                    <RefreshCw className="w-3 h-3" /> Re-roll
                  </button>
                </div>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{persona.icon}</span>
                  <div>
                    <h2 className="font-bold text-white text-base">{persona.name}</h2>
                    <p className={`text-xs font-medium ${ACCENT[persona.accent].text}`}>{persona.role}</p>
                    <p className="text-xs text-slate-400">{persona.status}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-300 italic leading-relaxed mb-3">"{persona.motive}"</p>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1 font-semibold">HISTORICAL RECORD</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{persona.historical}</p>
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">Switch Persona</p>
                {PERSONAS.map((p, i) => (
                  <button key={i} onClick={() => setPersonaIdx(i)} className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs transition-colors mb-1 ${i === personaIdx ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
                    <span>{p.icon}</span><span className="font-medium">{p.name}</span><span className="text-slate-600">— {p.role}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* EVIDENCE TAB */}
          {sideTab === 'evidence' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1"><BookOpen className="w-3 h-3" /> Evidence Dossier ({allEvidence.length}/{EVIDENCE.length} unlocked)</h3>
              <div className="space-y-2">
                {EVIDENCE.map(ev => {
                  const unlocked = unlockedEvidence.includes(ev.id);
                  return (
                    <div key={ev.id}>
                      <button
                        onClick={() => unlocked && setSelectedEvidence(selectedEvidence?.id === ev.id ? null : ev)}
                        className={`w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all ${unlocked ? 'bg-slate-800 border-slate-700 hover:border-slate-500 cursor-pointer' : 'bg-slate-800/30 border-slate-800 cursor-not-allowed opacity-40'}`}
                      >
                        <span className="text-lg">{ev.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-200 truncate">{ev.title}</p>
                          <p className="text-xs text-slate-500">{ev.type}</p>
                        </div>
                        {unlocked ? <Unlock className="w-3 h-3 text-emerald-500 flex-shrink-0" /> : <Lock className="w-3 h-3 text-slate-600 flex-shrink-0" />}
                      </button>
                      {selectedEvidence?.id === ev.id && unlocked && (
                        <div className="bg-amber-950/30 border border-amber-800/30 rounded-lg p-3 mt-1">
                          <p className="text-xs text-amber-200 italic leading-relaxed mb-2">"{ev.content}"</p>
                          <p className="text-xs text-amber-600/80"><span className="font-semibold text-amber-500">Relevance:</span> {ev.relevance}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* JOURNAL TAB */}
          {sideTab === 'journal' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1"><FileText className="w-3 h-3" /> Persona Journal</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">Write in character as {persona.name} after each checkpoint. These entries are saved for your tutor.</p>
              {Object.entries(journals).map(([cpId, entry]) => (
                <div key={cpId} className="border-l-2 border-slate-600 pl-3 mb-3">
                  <p className="text-xs text-slate-500 mb-1">After Checkpoint {cpId}</p>
                  <p className="text-xs text-slate-300 italic">"{entry}"</p>
                </div>
              ))}
              {completedIds.size > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-slate-400 mb-1 font-semibold">New entry — as {persona.name}:</p>
                  <textarea
                    value={journalDraft}
                    onChange={e => setJournalDraft(e.target.value)}
                    placeholder={`"As ${persona.name}, I feel..."`}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-600 resize-none outline-none focus:border-slate-500 min-h-[90px]"
                  />
                  <button
                    onClick={() => saveJournal(completedIds.size)}
                    disabled={!journalDraft.trim()}
                    className="mt-2 w-full flex items-center justify-center gap-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white py-2 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Send className="w-3 h-3" /> Save Entry
                  </button>
                </div>
              )}
              {completedIds.size === 0 && <p className="text-slate-600 text-xs italic text-center py-4">Complete Checkpoint 1 to unlock your journal.</p>}
            </div>
          )}

          {/* CLASS VOTES TAB */}
          {sideTab === 'votes' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1"><BarChart3 className="w-3 h-3" /> Class Verdict Board</h3>
              {CHECKPOINTS.map(cp => {
                const votes = classVotes[cp.id];
                const total = votes ? Object.values(votes).reduce((a, b) => a + b, 0) : 0;
                return (
                  <div key={cp.id} className="mb-4">
                    <p className="text-xs text-slate-500 font-semibold mb-2">{cp.label}</p>
                    {cp.choices.map((c, i) => {
                      const v = votes?.[i] || 0;
                      const pct = total > 0 ? Math.round(v / total * 100) : 0;
                      return (
                        <div key={i} className="mb-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-400 truncate pr-2">{String.fromCharCode(65+i)}: {c.label}</span>
                            <span className="text-xs text-slate-300 font-bold flex-shrink-0">{pct}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-500 ${i === 0 ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">{v} vote{v !== 1 ? 's' : ''}</p>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              {/* Manual vote buttons for teacher use */}
              <div className="border-t border-slate-800 pt-3 mt-3">
                <p className="text-xs text-slate-600 mb-2">Add class votes manually:</p>
                {CHECKPOINTS.map(cp => (
                  <div key={cp.id} className="mb-2">
                    <p className="text-xs text-slate-500 mb-1">{cp.label}</p>
                    <div className="flex gap-2">
                      {cp.choices.map((c, i) => (
                        <button key={i} onClick={() => handleClassVote(cp.id, i)} className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 py-1 rounded-lg transition-colors">
                          +1 {String.fromCharCode(65+i)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500" /> Session Progress</h3>
            {CHECKPOINTS.map(cp => (
              <div key={cp.id} className="flex items-center gap-3 mb-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${completedIds.has(cp.id) ? 'bg-emerald-600' : 'bg-slate-700'}`}>
                  {completedIds.has(cp.id) ? <CheckCircle className="w-3.5 h-3.5 text-white" /> : <span className="text-xs text-slate-400">{cp.id}</span>}
                </div>
                <div>
                  <p className={`text-xs font-medium ${completedIds.has(cp.id) ? 'text-emerald-400' : 'text-slate-300'}`}>{cp.label}</p>
                  <p className="text-xs text-slate-600">{cp.timeLabel}</p>
                </div>
              </div>
            ))}
            <div className="mt-3 pt-3 border-t border-slate-800">
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 rounded-full transition-all duration-500" style={{ width: `${(completedIds.size / CHECKPOINTS.length) * 100}%` }} />
              </div>
              <p className="text-xs text-slate-600 mt-1 text-right">{completedIds.size}/{CHECKPOINTS.length} checkpoints</p>
            </div>
          </div>
        </div>
      </div>

      {/* CHECKPOINT MODAL */}
      {activeCheckpoint && (
        <CheckpointModal
          checkpoint={activeCheckpoint}
          persona={persona}
          onChoice={handleChoice}
          branchTag={branchTag}
          classVotes={classVotes}
          onClassVote={handleClassVote}
        />
      )}

      {/* TUTOR DASHBOARD */}
      {tutorOpen && !tutorUnlocked && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-700/50 rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-4 h-4 text-amber-400" />
              <h2 className="font-bold text-amber-300">Tutor Access</h2>
            </div>
            <input
              type="password"
              value={tutorPwd}
              onChange={e => setTutorPwd(e.target.value)}
              placeholder="Enter tutor password"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-amber-600 mb-3"
              onKeyDown={e => { if (e.key === 'Enter' && tutorPwd === 'enabled') setTutorUnlocked(true); }}
            />
            <div className="flex gap-2">
              <button onClick={() => { if (tutorPwd === 'enabled') setTutorUnlocked(true); }} className="flex-1 bg-amber-700 hover:bg-amber-600 text-white py-2 rounded-lg text-sm font-semibold transition-colors">Unlock</button>
              <button onClick={() => { setTutorOpen(false); setTutorPwd(''); }} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 rounded-lg text-sm transition-colors">Cancel</button>
            </div>
            <p className="text-xs text-slate-600 text-center mt-2">Password: enabled</p>
          </div>
        </div>
      )}

      {tutorOpen && tutorUnlocked && (
        <TutorDashboard
          decisions={decisions}
          journals={journals}
          persona={persona}
          villageSurvival={villageSurvival}
          nationalSafety={nationalSafety}
          accuracyScore={accuracyScore}
          onClose={() => { setTutorOpen(false); setTutorUnlocked(false); setTutorPwd(''); }}
        />
      )}
    </div>
  );
}
