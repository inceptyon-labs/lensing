import{t as Y,q as h,r as W,b as G,v as he,a2 as ye,x as ae,y as E,z as T,A as I,ax as ue,aE as me,ap as ne,$ as ve,Z as U,aU as S,_ as z,aV as be,a1 as we,k as ke,aW as Se,aD as K,aX as Ae,aY as Ce,a6 as _e,ab as ie,aZ as Ie,W as fe,Y as pe,a_ as q,a$ as Ee,aB as Pe,X as xe,ay as B,aw as Z,b0 as ge,F as De,b1 as Te,b2 as Re,E as Le,aJ as Me,b3 as Ne,e as Oe,a3 as Ge,b4 as Ue,as as He,N as Fe,T as We,O as qe,V as ze,a5 as Be,U as Ve,R as Ye,aT as Ke,b5 as Ze}from"./BenZH3Ce.js";import{c as je,g as Xe,d as Je,a as re,j as Qe}from"./D-OhQpsP.js";import{a as oe,s as $e}from"./Cqdwz6pc.js";import{B as et}from"./ziI2NItE.js";import{p as M,r as tt}from"./FxU1-Syz.js";function at(e,t){return t}function nt(e,t,o){for(var a=[],i=t.length,n,s=t.length,c=0;c<i;c++){let y=t[c];pe(y,()=>{if(n){if(n.pending.delete(y),n.done.add(y),n.pending.size===0){var f=e.outrogroups;V(K(n.done)),f.delete(n),f.size===0&&(e.outrogroups=null)}}else s-=1},!1)}if(s===0){var d=a.length===0&&o!==null;if(d){var p=o,l=p.parentNode;Pe(l),l.append(p),e.items.clear()}V(t,!d)}else n={pending:new Set(t),done:new Set},(e.outrogroups??(e.outrogroups=new Set)).add(n)}function V(e,t=!0){for(var o=0;o<e.length;o++)xe(e[o],t)}var se;function it(e,t,o,a,i,n=null){var s=e,c=new Map,d=(t&ge)!==0;if(d){var p=e;s=h?E(Z(p)):p.appendChild(U())}h&&W();var l=null,y=ke(()=>{var u=o();return Se(u)?u:u==null?[]:K(u)}),f,g=!0;function w(){r.fallback=l,rt(r,f,s,t,a),l!==null&&(f.length===0?(l.f&S)===0?fe(l):(l.f^=S,O(l,null,s)):pe(l,()=>{l=null}))}var A=Y(()=>{f=G(y);var u=f.length;let C=!1;if(h){var P=he(s)===ye;P!==(u===0)&&(s=ae(),E(s),T(!1),C=!0)}for(var v=new Set,x=ve,R=we(),m=0;m<u;m+=1){h&&I.nodeType===ue&&I.data===me&&(s=I,C=!0,T(!1));var D=f[m],L=a(D,m),b=g?null:c.get(L);b?(b.v&&ne(b.v,D),b.i&&ne(b.i,m),R&&x.unskip_effect(b.e)):(b=ot(c,g?s:se??(se=U()),D,L,m,i,t,o),g||(b.e.f|=S),c.set(L,b)),v.add(L)}if(u===0&&n&&!l&&(g?l=z(()=>n(s)):(l=z(()=>n(se??(se=U()))),l.f|=S)),u>v.size&&be(),h&&u>0&&E(ae()),!g)if(R){for(const[H,F]of c)v.has(H)||x.skip_effect(F.e);x.oncommit(w),x.ondiscard(()=>{})}else w();C&&T(!0),G(y)}),r={effect:A,items:c,outrogroups:null,fallback:l};g=!1,h&&(s=I)}function N(e){for(;e!==null&&(e.f&Ee)===0;)e=e.next;return e}function rt(e,t,o,a,i){var b,H,F,j,X,J,Q,$,ee;var n=(a&Te)!==0,s=t.length,c=e.items,d=N(e.effect.first),p,l=null,y,f=[],g=[],w,A,r,u;if(n)for(u=0;u<s;u+=1)w=t[u],A=i(w,u),r=c.get(A).e,(r.f&S)===0&&((H=(b=r.nodes)==null?void 0:b.a)==null||H.measure(),(y??(y=new Set)).add(r));for(u=0;u<s;u+=1){if(w=t[u],A=i(w,u),r=c.get(A).e,e.outrogroups!==null)for(const k of e.outrogroups)k.pending.delete(r),k.done.delete(r);if((r.f&S)!==0)if(r.f^=S,r===d)O(r,null,o);else{var C=l?l.next:d;r===e.effect.last&&(e.effect.last=r.prev),r.prev&&(r.prev.next=r.next),r.next&&(r.next.prev=r.prev),_(e,l,r),_(e,r,C),O(r,C,o),l=r,f=[],g=[],d=N(l.next);continue}if((r.f&q)!==0&&(fe(r),n&&((j=(F=r.nodes)==null?void 0:F.a)==null||j.unfix(),(y??(y=new Set)).delete(r))),r!==d){if(p!==void 0&&p.has(r)){if(f.length<g.length){var P=g[0],v;l=P.prev;var x=f[0],R=f[f.length-1];for(v=0;v<f.length;v+=1)O(f[v],P,o);for(v=0;v<g.length;v+=1)p.delete(g[v]);_(e,x.prev,R.next),_(e,l,x),_(e,R,P),d=P,l=R,u-=1,f=[],g=[]}else p.delete(r),O(r,d,o),_(e,r.prev,r.next),_(e,r,l===null?e.effect.first:l.next),_(e,l,r),l=r;continue}for(f=[],g=[];d!==null&&d!==r;)(p??(p=new Set)).add(d),g.push(d),d=N(d.next);if(d===null)continue}(r.f&S)===0&&f.push(r),l=r,d=N(r.next)}if(e.outrogroups!==null){for(const k of e.outrogroups)k.pending.size===0&&(V(K(k.done)),(X=e.outrogroups)==null||X.delete(k));e.outrogroups.size===0&&(e.outrogroups=null)}if(d!==null||p!==void 0){var m=[];if(p!==void 0)for(r of p)(r.f&q)===0&&m.push(r);for(;d!==null;)(d.f&q)===0&&d!==e.fallback&&m.push(d),d=N(d.next);var D=m.length;if(D>0){var L=(a&ge)!==0&&s===0?o:null;if(n){for(u=0;u<D;u+=1)(Q=(J=m[u].nodes)==null?void 0:J.a)==null||Q.measure();for(u=0;u<D;u+=1)(ee=($=m[u].nodes)==null?void 0:$.a)==null||ee.fix()}nt(e,m,L)}}n&&De(()=>{var k,te;if(y!==void 0)for(r of y)(te=(k=r.nodes)==null?void 0:k.a)==null||te.apply()})}function ot(e,t,o,a,i,n,s,c){var d=(s&Ae)!==0?(s&Ce)===0?_e(o,!1,!1):ie(o):null,p=(s&Ie)!==0?ie(i):null;return{v:d,i:p,e:z(()=>(n(t,d??o,p??i,c),()=>{e.delete(a)}))}}function O(e,t,o){if(e.nodes)for(var a=e.nodes.start,i=e.nodes.end,n=t&&(t.f&S)===0?t.nodes.start:o;a!==null;){var s=B(a);if(n.before(a),a===i)return;a=s}}function _(e,t,o){t===null?e.effect.first=o:t.next=o,o===null?e.effect.last=t:o.prev=t}function bt(e,t,o,a,i){var c;h&&W();var n=(c=t.$$slots)==null?void 0:c[o],s=!1;n===!0&&(n=t.children,s=!0),n===void 0||n(e,s?()=>a:a)}function st(e,t,o,a,i,n){let s=h;h&&W();var c=null;h&&I.nodeType===Re&&(c=I,W());var d=h?I:e,p=new et(d,!1);Y(()=>{const l=t()||null;var y=Ne;if(l===null){p.ensure(null,null);return}return p.ensure(l,f=>{if(l){if(c=h?c:Me(l,y),je(c,c),a){h&&Xe(l)&&c.append(document.createComment(""));var g=h?Z(c):c.appendChild(U());h&&(g===null?T(!1):E(g)),a(c,g)}Oe.nodes.end=c,f.before(c)}h&&E(f)}),()=>{}},Le),Ge(()=>{}),s&&(T(!0),E(d))}function wt(e,t){let o=null,a=h;var i;if(h){o=I;for(var n=Z(document.head);n!==null&&(n.nodeType!==ue||n.data!==e);)n=B(n);if(n===null)T(!1);else{var s=B(n);n.remove(),E(s)}}h||(i=document.head.appendChild(U()));try{Y(()=>t(i),Ue|He)}finally{a&&(T(!0),E(o))}}const lt=[{id:"weather",name:"Weather",description:"Current conditions and forecast via Open-Meteo (free) or OpenWeatherMap",setupGuide:`Open-Meteo is free and requires no API key.

Enter a city name or zip code in the Location field — coordinates will be looked up automatically. Or set Latitude/Longitude directly for precision.

For OpenWeatherMap, sign up at openweathermap.org/api and get a free API key (the "Current Weather" plan is free for up to 1,000 calls/day).`,fields:[{key:"provider",type:"select",label:"Provider",default:"open-meteo",category:"integration",options:[{label:"Open-Meteo (free, no key required)",value:"open-meteo"},{label:"OpenWeatherMap (requires API key)",value:"openweathermap"}]},{key:"apiKey",type:"password",label:"API Key",description:"Required for OpenWeatherMap only",category:"integration"},{key:"locationQuery",type:"string",label:"Location",description:'City name or zip code (e.g. "New York" or "10001")',category:"widget"},{key:"lat",type:"number",label:"Latitude",description:"Optional if Location is set",min:-90,max:90,category:"widget"},{key:"lon",type:"number",label:"Longitude",description:"Optional if Location is set",min:-180,max:180,category:"widget"},{key:"units",type:"select",label:"Units",default:"imperial",category:"widget",options:[{label:"Imperial (°F)",value:"imperial"},{label:"Metric (°C)",value:"metric"}]}]},{id:"crypto",name:"Crypto Prices",description:"Cryptocurrency price tracker via CoinGecko",setupGuide:`Uses the free CoinGecko API — no API key needed.

Enter coin IDs separated by commas. Find IDs at coingecko.com (the ID is in the URL, e.g. coingecko.com/en/coins/bitcoin → "bitcoin").

Common IDs: bitcoin, ethereum, solana, cardano, dogecoin, polkadot.`,fields:[{key:"watchlist",type:"string",label:"Watchlist",description:"Comma-separated coin IDs (e.g. bitcoin,ethereum,solana)",default:"bitcoin,ethereum",category:"widget"},{key:"show1h",type:"boolean",label:"Show 1H Change",description:"Display 1-hour price change",default:!1,category:"widget"},{key:"show24h",type:"boolean",label:"Show 24H Change",description:"Display 24-hour price change",default:!0,category:"widget"},{key:"show7d",type:"boolean",label:"Show 7D Change",description:"Display 7-day price change",default:!1,category:"widget"},{key:"showSparkline",type:"boolean",label:"Show Sparkline Charts",description:"Display inline price charts next to each coin",default:!0,category:"widget"}]},{id:"news",name:"News Headlines",description:"RSS feed aggregator for news headlines",setupGuide:`Add RSS feed URLs separated by commas. No API key needed — this reads public RSS feeds directly.

Most news sites offer RSS feeds. Common ones:
• AP News: rss.app/feeds/v1.1/tPuMpEjSnHjHCFCd.xml
• Reuters: feeds.reuters.com/reuters/topNews
• BBC: feeds.bbci.co.uk/news/rss.xml
• NPR: feeds.npr.org/1001/rss.xml

Use the presets below the URL field for quick setup.`,fields:[{key:"feedUrls",type:"string",label:"Feed URLs",description:"Comma-separated RSS feed URLs",required:!0,category:"widget"},{key:"maxItems",type:"number",label:"Max Items",default:20,min:1,max:100,category:"widget"}]},{id:"sports",name:"Sports Scores",description:"Live scores from ESPN",setupGuide:`Uses the free ESPN API — no API key needed.

Enter league IDs separated by commas.

Available leagues: nfl, nba, mlb, nhl, mls, ncaaf, ncaab, wcbb.

To filter by specific teams, enter team names separated by commas (e.g. "Buccaneers, Gators, Lakers"). Matching is case-insensitive and partial — "Gators" matches "Florida Gators". Leave blank to show all games.

Scores update every 2 minutes during active games.`,fields:[{key:"leagues",type:"string",label:"Leagues",description:"Comma-separated league IDs (e.g. nfl,nba,mlb)",default:"nfl,nba",category:"widget"},{key:"teams",type:"string",label:"Favorite Teams",description:"Comma-separated team names to filter (e.g. Buccaneers,Gators,Lakers). Leave blank for all games.",category:"widget"}]},{id:"calendar",name:"Calendar",description:"CalDAV calendar event sync",setupGuide:`Connects to any CalDAV server (iCloud, Google via CalDAV, Nextcloud, Radicale, etc.).

For iCloud:
• Server URL: https://caldav.icloud.com
• Username: your Apple ID email
• Password: generate an app-specific password at appleid.apple.com
• Calendar Path: leave blank to auto-discover your first calendar

For Google Calendar:
• Server URL: https://apidata.googleusercontent.com/caldav/v2
• Use an app password from myaccount.google.com/apppasswords`,fields:[{key:"serverUrl",type:"string",label:"Server URL",description:"CalDAV server URL (e.g. https://caldav.icloud.com)",required:!0,category:"integration"},{key:"username",type:"string",label:"Username",required:!0,category:"integration"},{key:"password",type:"password",label:"Password",required:!0,category:"integration"},{key:"calendarPath",type:"string",label:"Calendar Path",description:"Auto-discovered if blank. Override: /calendars/user@icloud.com/calendar/",required:!1,category:"integration"},{key:"rangeDays",type:"number",label:"Days Ahead",default:7,min:1,max:90,category:"widget"}]},{id:"home-assistant",name:"Home Assistant",description:"Smart home entity state via Home Assistant API",setupGuide:`Connects to your Home Assistant instance to display entity states.

To get a long-lived access token:
1. Open your Home Assistant UI
2. Click your profile picture (bottom-left)
3. Scroll to "Long-Lived Access Tokens"
4. Click "Create Token", name it "Lensing", and copy the token

The URL is your Home Assistant address (e.g. http://homeassistant.local:8123).

Domains filter which entity types to show (e.g. light, switch, sensor).`,fields:[{key:"url",type:"string",label:"URL",description:"Home Assistant base URL (e.g. http://homeassistant.local:8123)",required:!0,category:"integration"},{key:"token",type:"password",label:"Access Token",description:"Long-lived access token",required:!0,category:"integration"},{key:"domains",type:"string",label:"Domains",description:"Comma-separated entity domains (e.g. light,switch,sensor)",default:"light,switch,lock,climate,sensor,binary_sensor",category:"widget"}]},{id:"allergies",name:"Pollen Index",description:"Pollen forecast and allergen triggers via pollen.com (free, no key required)",setupGuide:`Uses pollen.com for real-time pollen data — no API key needed.

Enter your 5-digit US zip code to get local pollen forecasts.

The index runs from 0 (none) to 12 (very high). The alert threshold controls when you get notifications — default is 7.3 (medium-high).

Data includes yesterday, today, and tomorrow forecasts with specific allergen triggers (tree, grass, weed pollen).`,fields:[{key:"zipCode",type:"string",label:"Zip Code",description:"5-digit US zip code (e.g. 90210)",required:!0,category:"widget"},{key:"alertThreshold",type:"number",label:"Alert Threshold",description:"Notify when index reaches this level (0-12)",default:7.3,min:0,max:12,category:"widget"}]},{id:"pir",name:"PIR Sensor",description:"Motion detection for automatic display wake/sleep",system:!0,setupGuide:`Controls the display backlight using a passive infrared (PIR) motion sensor.

Wiring (BCM pin numbering):
• PIR VCC → Pin 2 or 4 (5V power)
• PIR GND → Pin 6 (ground)
• PIR OUT → Pin 7 (GPIO 4) or any free GPIO pin

The default GPIO pin is 4. If your sensor is on a different pin, change it above.

Idle timeout controls how long after the last motion the screen stays on (default: 5 minutes / 300000 ms).

Requires the gpiod package: sudo apt install gpiod`,fields:[{key:"gpioPin",type:"number",label:"GPIO Pin",description:"BCM GPIO pin number the PIR sensor is connected to",default:4,min:0,max:27,category:"integration"},{key:"idleTimeout_ms",type:"number",label:"Idle Timeout (ms)",description:"Milliseconds without motion before the display sleeps",default:3e5,min:1e3,category:"widget"}]},{id:"photo-slideshow",name:"Photo Slideshow",description:"Ambient photo slideshow from a local directory",setupGuide:`Displays photos from a folder on the Pi in a slideshow.

Enter the full path to a directory containing images (e.g. /home/pi/photos). Supported formats: jpg, jpeg, png, webp, gif.

Photos rotate every 10 minutes. Subdirectories are included.`,fields:[{key:"cycleSeconds",type:"number",label:"Photo Duration (seconds)",description:"How long each photo is shown before advancing",default:30,min:5,max:600,category:"widget"},{key:"photoDirectory",type:"string",label:"Photo Directory",description:"Absolute path to the directory containing photos",required:!0,category:"integration"}]},{id:"ai-news",name:"AI News Summary",description:"AI-powered headline summaries from RSS feeds",setupGuide:`Pick news categories below and choose how often to refresh.

Uses the same API key from your .env file (ANTHROPIC_API_KEY, DEEPSEEK_API_KEY, or GEMINI_API_KEY) — no extra key needed.

Tip: "2x daily" is great for morning and evening updates with minimal API usage.`,fields:[{key:"categories",type:"string",label:"News Categories",description:"Select topics to follow",required:!0,category:"integration"},{key:"refreshSchedule",type:"select",label:"Refresh Schedule",description:"How often to fetch and summarize new headlines",default:"2x-daily",category:"integration",options:[{label:"2x daily (morning & evening)",value:"2x-daily"},{label:"3x daily",value:"3x-daily"},{label:"4x daily (every 6 hours)",value:"4x-daily"},{label:"Hourly",value:"hourly"}]},{key:"maxItems",type:"number",label:"Max Headlines",description:"Maximum articles to summarize per refresh",default:10,min:1,max:50,category:"integration"},{key:"pageSize",type:"number",label:"Headlines Per Page",description:"How many headlines to show at once on the display",default:5,min:1,max:20,category:"integration"},{key:"rotateSeconds",type:"number",label:"Rotate Every (seconds)",description:"Auto-cycle to next page after this many seconds (0 = manual only)",default:30,min:0,max:300,category:"integration"},{key:"aiProvider",type:"select",label:"AI Provider",default:"anthropic",category:"integration",options:[{label:"Anthropic (Claude)",value:"anthropic"},{label:"DeepSeek",value:"deepseek"},{label:"Gemini",value:"gemini"}]},{key:"aiModel",type:"select",label:"Model",description:"AI model to use for summarization",category:"integration",options:[]}]},{id:"word-of-day",name:"Word of the Day",description:"Daily vocabulary from Merriam-Webster",fields:[]},{id:"finance",name:"Finance",description:"Stock prices and charts via Yahoo Finance (free, no key required)",setupGuide:`Uses Yahoo Finance — no API key needed.

Enter stock ticker symbols separated by commas.

Common symbols: AAPL, MSFT, GOOGL, AMZN, TSLA, NVDA, META.`,fields:[{key:"watchlist",type:"string",label:"Watchlist",description:"Comma-separated ticker symbols (e.g. AAPL,MSFT,GOOGL)",default:"AAPL,MSFT,GOOGL",category:"widget"},{key:"show1h",type:"boolean",label:"Show 1H Change",description:"Display 1-hour price change",default:!1,category:"widget"},{key:"show24h",type:"boolean",label:"Show 24H Change",description:"Display 24-hour price change",default:!0,category:"widget"},{key:"show7d",type:"boolean",label:"Show 7D Change",description:"Display 7-day price change",default:!1,category:"widget"},{key:"showSparkline",type:"boolean",label:"Show Sparkline Charts",description:"Display inline price charts next to each stock",default:!0,category:"widget"}]}],kt=lt.filter(e=>e.system).map(e=>e.id);function St(e){return e.fields.filter(t=>t.category==="integration")}function At(e){return e.fields.filter(t=>t.category==="widget")}/**
 * @license @lucide/svelte v0.575.0 - ISC
 *
 * ISC License
 * 
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * 
 * ---
 * 
 * The MIT License (MIT) (for portions derived from Feather)
 * 
 * Copyright (c) 2013-2026 Cole Bemis
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */const dt={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license @lucide/svelte v0.575.0 - ISC
 *
 * ISC License
 * 
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2026 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2026.
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * 
 * ---
 * 
 * The MIT License (MIT) (for portions derived from Feather)
 * 
 * Copyright (c) 2013-2026 Cole Bemis
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */const ct=e=>{for(const t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0;return!1};var ut=Qe("<svg><!><!></svg>");function Ct(e,t){Fe(t,!0);const o=M(t,"color",3,"currentColor"),a=M(t,"size",3,24),i=M(t,"strokeWidth",3,2),n=M(t,"absoluteStrokeWidth",3,!1),s=M(t,"iconNode",19,()=>[]),c=tt(t,["$$slots","$$events","$$legacy","name","color","size","strokeWidth","absoluteStrokeWidth","iconNode","children"]);var d=ut();oe(d,(y,f)=>({...dt,...y,...c,width:a(),height:a(),stroke:o(),"stroke-width":f,class:["lucide-icon lucide",t.name&&`lucide-${t.name}`,t.class]}),[()=>!t.children&&!ct(c)&&{"aria-hidden":"true"},()=>n()?Number(i())*24/Number(a()):i()]);var p=We(d);it(p,17,s,at,(y,f)=>{var g=Ke(()=>Ze(G(f),2));let w=()=>G(g)[0],A=()=>G(g)[1];var r=Je(),u=qe(r);st(u,w,!0,(C,P)=>{oe(C,()=>({...A()}))}),re(y,r)});var l=ze(p);$e(l,()=>t.children??Be),Ve(d),re(e,d),Ye()}function ft(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function le(e){const t=[],o=/\{\{([^#/}][^}]*)\}\}/g;let a=0,i;for(;(i=o.exec(e))!==null;)t.push({type:"text",value:e.slice(a,i.index)}),t.push({type:"placeholder",path:i[1].trim()}),a=i.index+i[0].length;return t.push({type:"text",value:e.slice(a)}),t}function pt(e){const t=[],o=/\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g;let a=0,i;for(;(i=o.exec(e))!==null;){const s=e.slice(a,i.index);(s.length>0||a===0)&&t.push(...le(s)),t.push({type:"block",variable:i[1],content:i[2]}),a=i.index+i[0].length}const n=e.slice(a);return(n.length>0||t.length===0)&&t.push(...le(n)),t}function de(e,t){const o=[];let a=0;for(;a<t.length;)if(t[a]==="["){const i=t.indexOf("]",a);if(i===-1)break;let n=t.slice(a+1,i);(n.startsWith('"')&&n.endsWith('"')||n.startsWith("'")&&n.endsWith("'"))&&(n=n.slice(1,-1)),o.push(n),a=i+1,a<t.length&&t[a]==="."&&a++}else{let i=t.length;const n=t.indexOf(".",a),s=t.indexOf("[",a);n!==-1&&(i=Math.min(i,n)),s!==-1&&(i=Math.min(i,s));const c=t.slice(a,i);c&&o.push(c),a=i,a<t.length&&t[a]==="."&&a++}return o.reduce((i,n)=>{if(!(i==null||typeof i!="object"))return i[n]},e)}function ce(e,t){return t==null?e:pt(e).map(a=>{switch(a.type){case"text":return a.value;case"placeholder":{const i=de(t,a.path);return i==null?"":ft(String(i))}case"block":{const i=de(t,a.variable);return!Array.isArray(i)||i.length===0?"":i.map(n=>typeof n=="object"&&n!==null?ce(a.content,n):ce(a.content,{this:n})).join("")}default:return""}}).join("")}export{Ct as I,kt as S,At as a,ft as b,it as e,St as g,wt as h,at as i,ce as r,bt as s};
