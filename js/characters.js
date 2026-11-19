/* =====================================================================
   characters.js  —  WHERE THE PORTRAIT FILES ARE AND HOW THEY ARE NAMED.
   No image data lives in code any more (the old 1 MB base64 "ART" block,
   tint() and paint() are gone).

   FILE NAMING (inside assets/characters/emotions/):
     default outfit :  harvey.png            (neutral)
                       harvey_smirk.png      harvey_angry.png ...
     outfits 1-3    :  harvey_outfit1.png    harvey_outfit1_smirk.png ...
   Expressions: neutral smirk serious angry surprised sad happy thinking
   Only Harvey and Jessica have _outfitN files.

   If your files are named differently, change file() below — it is the
   ONLY place names are built.
   ===================================================================== */
window.CHARACTERS = {

  DIR: 'assets/characters/emotions/',

  /* Extensions to try, in order. PNG first because PNG keeps the
     transparent background (JPG cannot — it shows a navy rectangle behind
     the sprite in the scene player). Delete 'png' if you only use JPG. */
  EXT: ['png', 'jpg'],

  /* Build one file name (without extension) */
  file(id, ex, outfit) {
    return this.DIR + id + (outfit > 0 ? '_outfit' + outfit : '') + (ex && ex !== 'neutral' ? '_' + ex : '');
  },

  /* Ordered list of URLs to try. Falls back so nothing ever breaks:
     outfit+expression -> default outfit+expression -> default neutral */
  sources(id, ex = 'neutral', outfit = 0) {
    const names = [];
    if (outfit > 0) names.push(this.file(id, ex, outfit));
    names.push(this.file(id, ex, 0));
    if (ex !== 'neutral') names.push(this.file(id, 'neutral', 0));
    return names.flatMap(n => this.EXT.map(e => n + '.' + e));
  }
};
