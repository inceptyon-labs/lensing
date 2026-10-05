import { describe, it, expect, vi } from 'vitest';
import { createWordOfDayServer } from '../word-of-day-server';
// Trimmed from the live Merriam-Webster feed (2026-10-04)
const FEED = `<rss><channel><item><guid>52e49256</guid><title><![CDATA[adventitious]]></title><description><![CDATA[<font size="-1" face="arial, helvetica">
  <p>
    <strong>
      <font color="#000066">Merriam-Webster's Word of the Day for October 4, 2026 is:</font>
    </strong>
  </p>
  <p>
    <strong>adventitious</strong> &#149; \\ad-ven-TISH-us\\&nbsp; &#149; <em>adjective</em><br />
    <p><em>Adventitious</em> is a formal word that most often describes something that comes from an outside source, and is neither inherent or innate.  </p>

<p>// The house is like a museum—beautifully restored, full of period pieces, and with no <em>adventitious</em> elements in view. </p>

<p>// The bumps growing along the stem of the tomato plants are <em>adventitious</em> roots.</p>

<p><a href="https://www.merriam-webster.com/dictionary/adventitious">See the entry ></a></p>
  </p>
  <p>
    <strong>Examples:</strong><br />
    <p>“Although individual plants have a lifespan of 30-90 years...”</p>
  </p>
</font>]]></description><pubDate>Sun, 04 Oct 2026 01:00:01 -0400</pubDate></item></channel></rss>`;
function makeDataBus() {
    return {
        publish: vi.fn(),
        subscribe: vi.fn(() => vi.fn()),
        getLatest: vi.fn(),
        getChannels: vi.fn(() => []),
        onMessage: vi.fn(() => vi.fn()),
        clear: vi.fn(),
        close: vi.fn(),
    };
}
describe('Word of the Day Server', () => {
    it('parses the word, part of speech and definition without example sentences', async () => {
        const server = createWordOfDayServer({
            dataBus: makeDataBus(),
            fetchFn: async () => ({ ok: true, text: async () => FEED }),
        });
        await server.refresh();
        const data = server.getData();
        expect(data.word).toBe('adventitious');
        expect(data.partOfSpeech).toBe('adjective');
        expect(data.definition).toBe('Adventitious is a formal word that most often describes something that comes from an outside source, and is neither inherent or innate.');
    });
});
//# sourceMappingURL=word-of-day-server.test.js.map