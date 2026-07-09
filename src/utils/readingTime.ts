export function getReadingTime(text: string): number {
  const cleanText = text.trim();
  if (!cleanText) return 0;
  
  // Count English words (space/punctuation boundaries)
  const englishWordsMatch = cleanText.match(/[a-zA-Z0-9'-]+/g);
  const englishWords = englishWordsMatch ? englishWordsMatch.length : 0;
  
  // Remove English words to isolate Thai characters
  const thaiText = cleanText
    .replace(/[a-zA-Z0-9'-]+/g, '')
    .replace(/\s+/g, '');
    
  // Thai reading speed: roughly 450 characters/min
  const thaiTime = thaiText.length / 450;
  
  // English reading speed: 200 words/min
  const englishTime = englishWords / 200;
  
  const totalTime = Math.ceil(englishTime + thaiTime);
  return Math.max(1, totalTime);
}
