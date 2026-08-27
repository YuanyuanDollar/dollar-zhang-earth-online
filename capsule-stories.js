/**
 * capsule-stories.js
 * -----------------------------------------------------------------------------
 * Content for the gashapon (capsule toy) machine in the "Beyond Work" section.
 *
 * ▸ EDIT THIS FILE ONLY — no story text lives anywhere else.
 * ▸ The card renderer shows whichever fields exist and skips the rest, so a
 *   story can be a single paragraph or a full ranked list.
 *
 * -----------------------------------------------------------------------------
 * STORY SHAPE — every field except id / category / color / title is optional
 * -----------------------------------------------------------------------------
 *   id        unique number or string (remembers what has been opened)
 *   category  must match a label in capsuleCategories below
 *   color     "pink" | "orange" | "yellow" | "green" | "cyan" | "blue"
 *   title     headline on the card
 *   teaser    one line under the title, set in italics
 *   story     a string, or an array of strings (one per paragraph)
 *   list      a numbered ranking — ["A", "B"] or [{ label, text }]
 *   sections  numbered blocks — [{ heading, text }] where text is a string
 *             or an array of strings
 *   quoteLead small lead-in line above the quote
 *   quote     a pulled-out line, shown on tinted paper
 *   outro     closing paragraph(s) after the list / sections
 *   takeaway  one short line in a highlighted strip (e.g. a lesson learnt)
 *   note      a warm closing block — { heading, text }
 *   image     OPTIONAL personal photo, shown as a small taped-in print:
 *               image: "./images/beyond-work/ultimate.jpg"
 *             or, with a handwritten caption underneath:
 *               image: {
 *                 src: "./images/beyond-work/ultimate.jpg",
 *                 alt: "Our team after the final",
 *                 caption: "Xiamen, 2023"
 *               }
 *             Use a relative path starting with "./" so it still works when the
 *             site is served from a sub-folder. Put the files in
 *             images/beyond-work/. Personal photos only — no stock images.
 *   meta      tiny footer line (place, year, mood…)
 *
 * Rendering order: teaser → story → list → sections → quote → outro →
 *                  takeaway → note → image → meta
 *
 * A card looks complete with or without a photo, so you can add images later
 * one story at a time.
 */

window.capsuleCategories = [
  { label: "Hobbies", color: "pink", blurb: "Things I love and enjoy." },
  {
    label: "Life Creator",
    color: "orange",
    blurb: "Small things I make and experiment with.",
    // Reserved — stories to be written later
    // (Peninsula Tin Box · Flower · Photo · other small creative experiments)
    comingSoon: true,
  },
  { label: "MBTI", color: "yellow", blurb: "My personality type and how I think." },
  { label: "Strengths", color: "green", blurb: "What I'm good at, and how I found out." },
  { label: "Failures", color: "cyan", blurb: "Things I failed at and learned from." },
  { label: "Values Ranking", color: "blue", blurb: "What matters most to me." },
];

window.capsuleStories = [
  /* ---------------------------------------------------------------- HOBBIES */
  {
    id: "hobbies-ultimate",
    category: "Hobbies",
    color: "pink",
    title: "5 Years of Ultimate",
    teaser: "The sport that unexpectedly woke up my competitive side.",
    story: [
      "Before I found Ultimate, I was probably the person who cared least about competition. Winning a game or beating someone to prove I was better never really mattered to me.",
      "That made me pretty chill and easy-going — but maybe a little too willing to give up.",
      "Ultimate changed that.",
      "Thanks to my teammates, I slowly discovered how much I actually wanted to win, how hard I could fight for something, and how responsible I could feel for a team.",
      "Turns out, my competitive side was just sleeping. 🥏",
    ],
    // image: { src: "./images/beyond-work/ultimate.jpg", alt: "", caption: "" },
  },
  {
    id: "hobbies-tennis",
    category: "Hobbies",
    color: "pink",
    title: "1 Year of Tennis",
    teaser: "Want to challenge a left-handed player? That's me. Kind of.",
    story: [
      "Want to challenge a left-handed player?",
      "That's me!",
      "Well… technically I'm right-handed. 😌",
      "I just somehow ended up learning tennis with my left hand.",
    ],
    // image: { src: "./images/beyond-work/tennis.jpg", alt: "", caption: "" },
  },

  /* ------------------------------------------------------------------- MBTI */
  {
    id: "mbti-enfp",
    category: "MBTI",
    color: "yellow",
    title: "ENFP — But Not All the Time",
    teaser:
      "I love people, possibilities and adventure — but sometimes I'm the quietest person in the room.",
    story: [
      "I'm an ENFP.",
      "I love exploring life's possibilities, having fun with friends, trying new things, and usually looking at situations from a positive angle.",
      "But I also really enjoy being alone. And strangely, I can sometimes become the quietest person in a crowded room.",
      "So maybe I'm not the constantly energetic ENFP stereotype.",
    ],
    quoteLead: "My favourite belief about life is:",
    quote:
      "Life is a game. You can keep exploring who you want to become and what kind of life you want to create.",
    outro: "And I'm also a Sagittarius. ♐️",
    // image: { src: "./images/beyond-work/mbti.jpg", alt: "", caption: "" },
  },

  /* -------------------------------------------------------------- STRENGTHS */
  {
    id: "strengths-child",
    category: "Strengths",
    color: "green",
    title: "What Was I Good at as a Child?",
    teaser: "Apparently, some parts of your personality show up much earlier than you realise.",
    story: [
      "I once asked my family: “What did I seem unusually good at when I was little?”",
      "Their answers were surprisingly consistent.",
      "I was good at asking questions — especially questions that were deeper than expected and not always easy to answer.",
      "I was also very sensitive to the atmosphere around me. I could often notice quickly when someone felt uncomfortable, unhappy, or left out.",
      "And even as a child, I had quite clear boundaries: I knew what was mine to decide, while trying to stay respectful of other people's choices.",
      "Apparently, some parts of your personality show up much earlier than you realise.",
    ],
    // image: { src: "./images/beyond-work/childhood.jpg", alt: "", caption: "" },
  },
  {
    id: "strengths-clifton",
    category: "Strengths",
    color: "green",
    title: "My CliftonStrengths",
    teaser:
      "Responsibility, relationships, consistency and understanding people sit surprisingly high on my list.",
    list: [
      "Responsibility",
      "Relator",
      "Consistency",
      "Influence",
      "Individualization",
      "Intellection",
      "Input / Knowledge",
      "Restorative",
      "Harmony",
      "Belief",
    ],
    outro:
      "I care deeply about people and commitments, but I also like understanding why people think differently, finding patterns beneath the surface, and turning ideas into something that can actually influence the world around me.",
    // image: { src: "./images/beyond-work/cliftonstrengths.jpg", alt: "", caption: "" },
  },

  /* --------------------------------------------------------------- FAILURES */
  {
    id: "failures-girls-ultimate",
    category: "Failures",
    color: "cyan",
    title: "The Girls' Ultimate Club That Didn't Work",
    teaser: "A good intention doesn't automatically mean you've identified a real need.",
    story: [
      "I don't feel particularly bad about failure. Actually, I hope I make more mistakes — as long as I learn something from them.",
      "One of mine started when I got permission to use a football field in Xiamen and tried to create a non-profit girls-only Ultimate pickup club.",
      "At the time, I felt that the local Ultimate community wasn't giving girls enough opportunities to play, so I thought: why not create one myself?",
      "It didn't work. There weren't enough girls who actually wanted a girls-only session, the time I chose wasn't convenient for the target players, and overall demand was much lower than I had assumed.",
      "The biggest lesson? Having a good intention doesn't automatically mean you've identified a real need.",
      "Next time, I'll talk to the people I'm designing something for before I start building it. Otherwise, I might just be solving a problem that only exists in my own imagination.",
    ],
    takeaway: "Good intention ≠ real demand",
    // image: { src: "./images/beyond-work/ultimate-club.jpg", alt: "", caption: "" },
  },

  /* ---------------------------------------------------------- VALUES RANKING */
  {
    id: "values-ranking",
    category: "Values Ranking",
    color: "blue",
    title: "What Matters Most to Me",
    teaser:
      "Health → Relationships → Growth & Impact → Adventure & Creation → Aesthetic Appreciation",
    sections: [
      {
        heading: "Health",
        text: "Good health is the foundation that allows me to give 100% of myself to everything else I care about.",
      },
      {
        heading: "Relationships",
        text: "My family and friends are some of the biggest sources of happiness in my life. Achievements matter much less to me if I have nobody meaningful to share them with.",
      },
      {
        heading: "Growth & Meaningful Impact",
        text: [
          "I want to keep becoming a better version of myself. And somewhere deep inside, I'm also afraid of living a life that leaves absolutely no positive trace on the world.",
          "I don't need to change the whole world — but I would like my existence to make something, somewhere, a little better.",
        ],
      },
      {
        heading: "Adventure & Creation",
        text: [
          "Just as I need continuous growth, I also need novelty. I don't want my world to become completely predictable or stagnant.",
          "I want to explore, experiment, build things and occasionally do something simply because I've never done it before.",
        ],
      },
      {
        heading: "Aesthetic Appreciation",
        text: "Beauty matters to me more than it probably needs to. A beautiful space, an interesting design, good music, an unexpected colour combination or even a nicely plated meal can make an ordinary day feel much more vivid.",
      },
    ],
    note: {
      heading: "❤️ My Favourite Life Supporters",
      text: [
        "And one thing doesn't really belong in a ranking: my family and my friends.",
        "Thank you for supporting almost every strange idea, experiment, decision, and adventure I've had. I LOVE U!!! ❤️",
      ],
    },
    // image: { src: "./images/beyond-work/family.jpg", alt: "", caption: "" },
  },

  /* ------------------------------------------------------------ LIFE CREATOR
     Reserved for later — Peninsula Tin Box, Flower, Photo, and other small
     creative experiments. Add stories here with:
       category: "Life Creator", color: "orange"
     Until then the orange capsule stays out of the draw and the legend shows
     it as "coming soon".
  ------------------------------------------------------------------------- */
];
