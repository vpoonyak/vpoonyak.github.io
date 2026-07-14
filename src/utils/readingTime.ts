// Strip markdown/HTML syntax so only actual prose counts toward reading time —
// otherwise callout <div>s, links, tables, and emphasis markers get counted as
// characters/words to "read".
function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1 ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1 ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*_]{3,}\s*$/gm, ' ')
    .replace(/\|/g, ' ')
    .replace(/^[ \t]*[-*+][ \t]+/gm, '')
    .replace(/^\d+\.\s+/gm, '');
}

export function getReadingTime(text: string): number {
  const cleanText = stripMarkdown(text).trim();
  if (!cleanText) return 0;

  // Count English words (space/punctuation boundaries)
  const englishWordsMatch = cleanText.match(/[a-zA-Z0-9'-]+/g);
  const englishWords = englishWordsMatch ? englishWordsMatch.length : 0;

  // Remove English words to isolate Thai characters
  const thaiText = cleanText
    .replace(/[a-zA-Z0-9'-]+/g, '')
    .replace(/\s+/g, '');

  // Thai has no inter-word spaces, so we estimate by character count instead
  // of word count. Average Thai word length is ~4.5 characters, so at the
  // same 200 wpm baseline used for English below, that's ~900 characters/min.
  const thaiTime = thaiText.length / 900;

  // English reading speed: 200 words/min
  const englishTime = englishWords / 200;

  const totalTime = Math.ceil(englishTime + thaiTime);
  return Math.max(1, totalTime);
}
