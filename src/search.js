export function matchesSearch(screenshot, query) {
  const fields = [screenshot.name, screenshot.category, screenshot.note].map((value) => (value || '').toLowerCase());
  if (fields.some((value) => value.includes(query))) return true;
  const words = query.match(/[\p{L}\p{N}]+/gu) || [];
  const candidates = fields.join(' ').match(/[\p{L}\p{N}]+/gu) || [];
  return words.length > 0 && words.every((word) => candidates.some((candidate) => isCloseMatch(word, candidate)));
}

export function searchScore(screenshot, query) {
  const name = (screenshot.name || '').toLowerCase();
  const category = (screenshot.category || '').toLowerCase();
  const note = (screenshot.note || '').toLowerCase();
  if (name === query) return 0;
  if (name.startsWith(query)) return 1;
  if (name.includes(query)) return 2;
  if (category.includes(query)) return 3;
  if (note.includes(query)) return 4;
  return 5;
}

export function getHighlightRanges(value, query) {
  const ranges = [];
  const terms = query.trim().split(/\s+/).filter(Boolean);

  terms.forEach((term) => {
    const matcher = new RegExp(escapeRegExp(term), 'ig');
    let match;
    let foundLiteral = false;
    while ((match = matcher.exec(value)) !== null) {
      ranges.push({ start: match.index, end: match.index + match[0].length });
      foundLiteral = true;
    }
    if (foundLiteral || term.length < 5) return;

    const approximate = [...value.matchAll(/[\p{L}\p{N}]+/gu)]
      .find((token) => isCloseMatch(term.toLowerCase(), token[0].toLowerCase()));
    if (approximate && approximate.index !== undefined) {
      ranges.push({ start: approximate.index, end: approximate.index + approximate[0].length });
    }
  });

  return ranges
    .sort((a, b) => a.start - b.start)
    .reduce((merged, range) => {
      const previous = merged[merged.length - 1];
      if (previous && range.start <= previous.end) previous.end = Math.max(previous.end, range.end);
      else merged.push({ ...range });
      return merged;
    }, []);
}

function isCloseMatch(word, candidate) {
  if (candidate.includes(word)) return true;
  if (word.length < 5 || Math.abs(word.length - candidate.length) > 1) return false;
  if (word.length === candidate.length) {
    const mismatches = [];
    for (let index = 0; index < word.length; index += 1) {
      if (word[index] !== candidate[index]) mismatches.push(index);
    }
    if (mismatches.length === 2 && mismatches[1] === mismatches[0] + 1
      && word[mismatches[0]] === candidate[mismatches[1]]
      && word[mismatches[1]] === candidate[mismatches[0]]) return true;
  }

  let row = Array.from({ length: candidate.length + 1 }, (_, index) => index);
  for (let i = 1; i <= word.length; i += 1) {
    const next = [i];
    for (let j = 1; j <= candidate.length; j += 1) {
      next[j] = Math.min(next[j - 1] + 1, row[j] + 1, row[j - 1] + (word[i - 1] === candidate[j - 1] ? 0 : 1));
    }
    if (Math.min(...next) > 1) return false;
    row = next;
  }
  return row[candidate.length] <= 1;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
