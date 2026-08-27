/**
 * capsule-stories.js
 * -----------------------------------------------------------------------------
 * Content for the gashapon (capsule toy) machine in the "Beyond Work" section.
 *
 * ▸ EDIT THIS FILE ONLY — no story text lives anywhere else.
 * ▸ Every story below is a PLACEHOLDER. Replace `title`, `story` and `meta`
 *   with your own writing. Keep `id` unique, keep `category` + `color` as-is.
 * ▸ Add as many stories per category as you like; the machine picks randomly
 *   and shows unseen ones first.
 *
 * Story shape:
 *   {
 *     id:       unique number or string (used to remember what's been opened)
 *     category: one of the six labels in capsuleCategories below
 *     color:    "pink" | "orange" | "yellow" | "green" | "cyan" | "blue"
 *     title:    short headline on the card
 *     story:    2–4 sentences. Keep it under ~360 characters so the card breathes.
 *     meta:     optional tiny line at the bottom (place, year, mood…)
 *   }
 *
 * Colour ↔ category mapping (matches the painted capsules):
 *   pink   → Hobbies                orange → Embarrassing Stories
 *   yellow → MBTI                   green  → Strengths Test
 *   cyan   → Failures               blue   → Values Ranking
 */

window.capsuleCategories = [
  { label: "Hobbies", color: "pink", blurb: "Things I love and enjoy." },
  { label: "Embarrassing Stories", color: "orange", blurb: "Awkward but funny moments." },
  { label: "MBTI", color: "yellow", blurb: "My personality type and how I think." },
  { label: "Strengths Test", color: "green", blurb: "My CliftonStrengths." },
  { label: "Failures", color: "cyan", blurb: "Things I failed at and learned from." },
  { label: "Values Ranking", color: "blue", blurb: "What matters most to me." },
];

window.capsuleStories = [
  /* ---------------------------------------------------------------- HOBBIES */
  {
    id: 1,
    category: "Hobbies",
    color: "pink",
    title: "Four Years of Frisbee",
    story:
      "I joined an ultimate frisbee team knowing nothing except that everyone looked like they were having fun. Four years later I still can't throw a perfect hammer, but I've learned that showing up every week matters more than being the best player on the field.",
    meta: "Placeholder story · replace me",
  },
  {
    id: 2,
    category: "Hobbies",
    color: "pink",
    title: "Cooking Without a Recipe",
    story:
      "Weekends usually end with me improvising dinner from whatever survived the week in the fridge. Roughly one in three attempts is genuinely good, which — as an actuary — I've decided is an acceptable loss ratio.",
    meta: "Placeholder story · replace me",
  },

  /* ------------------------------------------------ EMBARRASSING STORIES */
  {
    id: 3,
    category: "Embarrassing Stories",
    color: "orange",
    title: "The Calculator Incident",
    story:
      "I walked into a final exam carrying a calculator that wasn't allowed. One small piece of hardware, one zero, one failed course. I now read every set of rules twice — which, honestly, is a useful habit for anyone who wants to work in regulated products.",
    meta: "Placeholder story · replace me",
  },
  {
    id: 4,
    category: "Embarrassing Stories",
    color: "orange",
    title: "Presenting to a Muted Mic",
    story:
      "I delivered four confident minutes of a group presentation before realising my microphone had never been on. My team let me finish. I've checked the mute button before every single call since.",
    meta: "Placeholder story · replace me",
  },

  /* ------------------------------------------------------------------- MBTI */
  {
    id: 5,
    category: "MBTI",
    color: "yellow",
    title: "The Planner in the Room",
    story:
      "My results usually land somewhere around INFJ–INTJ, and the part that rings true is the planning. I like knowing the shape of a project before I start, and I get uneasy when a deadline has no structure behind it.",
    meta: "Placeholder story · replace me",
  },
  {
    id: 6,
    category: "MBTI",
    color: "yellow",
    title: "Quiet, Not Shy",
    story:
      "People often read me as quiet in the first meeting. I'm usually listening for what the actual problem is. By the second meeting I normally have opinions — and a spreadsheet.",
    meta: "Placeholder story · replace me",
  },

  /* --------------------------------------------------------- STRENGTHS TEST */
  {
    id: 7,
    category: "Strengths Test",
    color: "green",
    title: "Learner",
    story:
      "CliftonStrengths put Learner near the top, and six years of actuarial study is probably evidence enough. I enjoy the part of a new topic where nothing makes sense yet — that's when it's most interesting.",
    meta: "Placeholder story · replace me",
  },
  {
    id: 8,
    category: "Strengths Test",
    color: "green",
    title: "Responsibility",
    story:
      "If I say I'll deliver something, I deliver it. On group projects I'm usually the one tracking what's still outstanding two days before the deadline — not because I want to lead, but because I can't relax until it's done.",
    meta: "Placeholder story · replace me",
  },

  /* ---------------------------------------------------------------- FAILURES */
  {
    id: 9,
    category: "Failures",
    color: "cyan",
    title: "A 39/40 and a Fail",
    story:
      "The project scored 39 out of 40 and was kept as an exemplar. The final exam went to zero, and the course went with it. Both things are true at once, and learning to hold them together was the actual lesson.",
    meta: "Placeholder story · replace me",
  },
  {
    id: 10,
    category: "Failures",
    color: "cyan",
    title: "The Model That Didn't Work",
    story:
      "I spent two weeks building a model that turned out to be answering the wrong question. Throwing it away hurt. Asking better questions at the start of a project is the habit that came out of it.",
    meta: "Placeholder story · replace me",
  },

  /* ---------------------------------------------------------- VALUES RANKING */
  {
    id: 11,
    category: "Values Ranking",
    color: "blue",
    title: "What Matters Most",
    story:
      "I used to think success was mostly about achievement. Over time I've moved peace of mind to the top of the list — I do better work when I'm not running on anxiety, and I'd like to keep it that way.",
    meta: "Placeholder story · replace me",
  },
  {
    id: 12,
    category: "Values Ranking",
    color: "blue",
    title: "Persistence Over Talent",
    story:
      "I'm not the fastest learner in the room and I stopped pretending otherwise a while ago. What I can offer is turning up again the next day, and the day after that. So far it has been enough.",
    meta: "Placeholder story · replace me",
  },
];
