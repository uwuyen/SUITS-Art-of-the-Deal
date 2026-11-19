/* =====================================================================
   data.js  —  ALL CONTENT LIVES HERE (no logic).
   Edit this file to: change season text, character bios, wardrobe names,
   DIALOGUE, scene backgrounds, or add whole new scenes.
   Everything is exposed as ONE global (window.SUITS_DATA) so app.js can
   destructure it without "already been declared" errors.
   ===================================================================== */
window.SUITS_DATA = {

  /* ---- Homepage background (put your image at this path) ---- */
  HERO_BG: 'assets/backgrounds/home/home-bg.jpg',

  /* ---- Seasons: [year, title, description] ---- */
  SEASONS: [
    [2011, 'The Pilot Gambit', 'Mike joins Pearson Hardman with a secret.'],
    [2012, 'Pressure Rises',   'The secret tests every loyalty.'],
    [2013, 'Fault Lines',      'The firm fractures from within.'],
    [2014, 'Rebuilding',       'New names on the door.'],
    [2015, 'Power Plays',      'Old rivals, new alliances.'],
    [2016, 'Consequences',     'Past choices come due.'],
    [2017, 'Reinvention',      'A different firm emerges.'],
    [2018, 'Legacy',           'The partners face their history.'],
    [2019, 'The Last Deal',    'Closing the final file.']
  ],

  /* ---- Characters (id must match the portrait file names) ---- */
  C: {
    harvey:  { n: 'Harvey Specter',  t: 'Senior Partner',      bio: 'The firm’s closer. Confident, loyal, fiercely private.', rel: 'Mike, Donna, Jessica' },
    mike:    { n: 'Mike Ross',       t: 'Associate',           bio: 'A gifted mind with a photographic memory and a secret.', rel: 'Harvey, Rachel, Donna' },
    jessica: { n: 'Jessica Pearson', t: 'Managing Partner',    bio: 'Commanding, strategic, uncompromising.',                rel: 'Harvey, Louis, Donna' },
    donna:   { n: 'Donna Paulsen',   t: 'Executive Assistant', bio: 'Sees everything before it happens.',                     rel: 'Harvey, Jessica, Rachel' },
    louis:   { n: 'Louis Litt',      t: 'Partner',             bio: 'Meticulous, volatile, desperate for respect.',           rel: 'Harvey, Mike, Jessica' },
    rachel:  { n: 'Rachel Zane',     t: 'Paralegal',           bio: 'Brilliant, driven, determined to earn her place.',       rel: 'Mike, Louis, Donna' }
  },

  /* ---- Wardrobe names. Index 0 = default. Index 1-3 use files  <id>_outfit1_<expression>  etc. ---- */
  OUT: {
    harvey:  ['Signature charcoal', 'Navy & steel', 'Black & black', 'Grey & brass'],
    jessica: ['Signature ink', 'Wine suit', 'Black tailored', 'Cream suit']
  },

  /* ---- SCENES ----------------------------------------------------------
     id      unique letter/word
     s, e    season number, episode number
     et, t   episode title, scene title
     ch      characters present (a character only sees scenes they are in)
     d       short description shown on the Scenes page
     bg      scene background image (placeholder is shown until the file exists)
     L       DIALOGUE, in order:  [ speakerId, 'line of text', 'expression' ]
             expression is optional: neutral | smirk | serious | angry |
             surprised | sad | happy | thinking
     ------------------------------------------------------------------- */
  SC: [
    {
      id: 'a', s: 1, e: 1, et: 'Pilot', t: 'The Associate Mandate',
      ch: ['jessica', 'harvey'],
      d: 'Jessica reminds Harvey he still has no associate.',
      bg: 'assets/backgrounds/scene/s01e02.jpg',
      L: [
        ['jessica', 'Harvey, we need to talk about your associate.', 'thinking'],
        ['harvey',  'I don’t need one. I work better alone.', 'serious'],
        ['jessica', 'That wasn’t a request. The firm expects you to hire one.','serious'],
        ['harvey',  'Fine. I’ll find someone good.', 'smirk'],
        ['jessica', 'Make sure they’re the best. You’re accountable for them.','happy']
      ]
    },
    {
      id: 'b', s: 1, e: 1, et: 'Pilot', t: 'The Interview',
      ch: ['harvey', 'mike'],
      d: 'Mike meets Harvey and talks his way into a job.',
      bg: 'assets/backgrounds/scene/s01e01.png',
      L: [
        ['harvey', "Unfortunately, we only hire from Harvard. And you, not only did not go to Harvard Law School, you haven't even gone to any law school.", 'neutral'],
        ['mike',   "What if I told you I consume knowledge like no one you've ever met and I've actually passed the bar?", 'smirk'],
        ['harvey', "I'd say you're full of crap.", 'smirk'],
        ['mike',   "That's a BarBri Legal Handbook right there, right? Open it up. Read me something. Anything.", 'neutral'],
        ['harvey', "Civil liability associated with agency is based on several factors, including-", 'thinking'],
        ['mike',   'Including the deviation of the agent from his path, the reasonable inference of agency on behalf of the plaintiff, and the nature of the damages themselves.', 'thinking'],
        ['harvey', 'How did you know that?', 'surprised'],
        ['mike',   "I learned it. When I studied. For the bar.", 'happy'],
        ['harvey', "How can you know all that?", 'thinking'],
        ['mike', 'I told you. I like to read. And once I read something, I understand it, and once I understand it, I never forget it.', 'neutral'],
        ['harvey', "I'm inclined to give you a shot but what if I decide to go another way?", 'thinking'],
        ['mike',  "I'd say that's fair. Sometimes I like to hang out with people who aren't that bright. You know, just to see how the other half lives.", 'smirk'],
        ['harvey', "Move over. I'm emailing the firm I just found our next associate.", 'happy'],
      ]
    }
  ]
};
