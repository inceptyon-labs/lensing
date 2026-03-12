const PLUGIN_ID = 'word-of-day-server';
const DATA_BUS_CHANNEL = 'word-of-day.data';
const FEED_URL = 'https://www.merriam-webster.com/wotd/feed/rss2';
// ── RSS Parsing ──────────────────────────────────────────────────────────────
function extractTag(xml, tag) {
    const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
    return match ? match[1].trim() : '';
}
function extractCdata(str) {
    const match = str.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
    return match ? match[1] : str;
}
function stripHtml(html) {
    return html.replace(/<[^>]*>/g, '');
}
function decodeEntities(str) {
    return str
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/&#149;/g, '•')
        .replace(/&#\d+;/g, (m) => String.fromCharCode(parseInt(m.slice(2, -1))));
}
function parseWotdFeed(xml) {
    // Get the first <item> from the RSS feed
    const itemMatch = xml.match(/<item[^>]*>([\s\S]*?)<\/item>/i);
    if (!itemMatch)
        return null;
    const itemXml = itemMatch[1];
    const rawTitle = decodeEntities(extractCdata(extractTag(itemXml, 'title')));
    const rawDesc = decodeEntities(extractCdata(extractTag(itemXml, 'description')));
    const pubDate = extractCdata(extractTag(itemXml, 'pubDate'));
    // Title format: "Merriam-Webster's Word of the Day for March 11 is: besotted"
    const wordMatch = rawTitle.match(/is:\s*(\S+)/i);
    const word = wordMatch ? wordMatch[1] : rawTitle.split(':')[0].trim();
    // Description format uses bullet separators (&#149;):
    // "besotted • \bih-SAH-tud\ • adjective\n Definition text... See the entry > Examples: ..."
    const descText = stripHtml(rawDesc).replace(/&#149;/g, '•').trim();
    // Extract part of speech from the bullet-separated header
    let partOfSpeech = '';
    const posMatch = descText.match(/•\s*(noun|verb|adjective|adverb|pronoun|preposition|conjunction|interjection)\b/i);
    if (posMatch) {
        partOfSpeech = posMatch[1].toLowerCase();
    }
    // Extract just the definition: starts after the header line, ends before "See the entry"
    // The header line ends after the part of speech
    let definition = '';
    const lines = descText.split('\n').map(l => l.trim()).filter(Boolean);
    // Skip the first line (word • pronunciation • pos), grab definition lines
    // until we hit "See the entry", "Examples:", or "Did you know?"
    let capturing = false;
    for (const line of lines) {
        if (!capturing) {
            // Start capturing after the header line with the part of speech
            if (posMatch && line.includes(posMatch[0])) {
                // Definition may be on the same line after the POS
                const afterPos = line.slice(line.indexOf(posMatch[0]) + posMatch[0].length).trim();
                if (afterPos)
                    definition = afterPos;
                capturing = true;
                continue;
            }
            // If no POS match, start from second line
            if (lines.indexOf(line) > 0) {
                capturing = true;
            }
        }
        if (capturing) {
            if (/^(See the entry|Examples?:|Did you know\?)/i.test(line))
                break;
            if (line.startsWith('"') || line.startsWith('\u201C'))
                break; // quote = example
            definition += (definition ? ' ' : '') + line;
        }
    }
    // Clean up definition
    definition = definition.replace(/\s+/g, ' ').trim();
    // Remove trailing "See the entry >" if it slipped through
    definition = definition.replace(/\s*See the entry.*$/i, '').trim();
    if (!definition) {
        definition = descText.split(/See the entry|Examples?:|Did you know\?/i)[0].trim();
    }
    // Parse date
    let date;
    if (pubDate) {
        const d = new Date(pubDate);
        date = d.toISOString().slice(0, 10);
    }
    else {
        date = new Date().toISOString().slice(0, 10);
    }
    return {
        word,
        partOfSpeech,
        definition,
        date,
        lastUpdated: Date.now(),
    };
}
// ── Factory ──────────────────────────────────────────────────────────────────
export function createWordOfDayServer(options) {
    const { dataBus, fetchFn } = options;
    const effectiveFetch = (fetchFn ?? fetch);
    let lastData = null;
    let closed = false;
    const updateListeners = [];
    const errorListeners = [];
    function notifyUpdate(data) {
        for (const cb of [...updateListeners]) {
            try {
                cb(data);
            }
            catch { /* isolate */ }
        }
    }
    function notifyError(message) {
        for (const cb of [...errorListeners]) {
            try {
                cb(message);
            }
            catch { /* isolate */ }
        }
    }
    async function refresh() {
        if (closed)
            return;
        // Skip if we already have today's word
        if (lastData) {
            const today = new Date().toISOString().slice(0, 10);
            if (lastData.date === today)
                return;
        }
        let response;
        try {
            response = await effectiveFetch(FEED_URL);
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            notifyError(`Word of the Day fetch failed: ${msg}`);
            return;
        }
        if (!response.ok) {
            notifyError(`Word of the Day feed error: ${response.status ?? 'unknown'}`);
            return;
        }
        let xml;
        try {
            xml = await response.text();
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            notifyError(`Word of the Day body read failed: ${msg}`);
            return;
        }
        const parsed = parseWotdFeed(xml);
        if (!parsed) {
            notifyError('Word of the Day: failed to parse RSS feed');
            return;
        }
        lastData = parsed;
        dataBus.publish(DATA_BUS_CHANNEL, PLUGIN_ID, parsed);
        notifyUpdate(parsed);
    }
    return {
        refresh,
        getData() {
            return lastData ? { ...lastData } : null;
        },
        onUpdate(callback) {
            updateListeners.push(callback);
            return () => {
                const idx = updateListeners.indexOf(callback);
                if (idx !== -1)
                    updateListeners.splice(idx, 1);
            };
        },
        onError(callback) {
            errorListeners.push(callback);
        },
        close() {
            closed = true;
        },
    };
}
//# sourceMappingURL=word-of-day-server.js.map