import{N as j,K as h,O as q,g as U,bk as me,P as be,a9 as ae,a7 as x,al as R,J as _,ah as fe,ay as ve,D as B,bl as we,a5 as ie,bh as ke,S as H,bm as S,R as V,bn as pe,bo as Se,aK as Ae,aW as Ce,as as Z,bp as Ie,bq as Ee,A as Pe,G as re,br as _e,bs as ge,U as he,bt as z,bu as xe,an as De,a6 as Te,aj as Y,ag as J,bv as ye,I as Re,bw as Le,bx as Me,ab as Ne,aR as Oe,by as Ge,bz as Ue,ax as He,bA as Fe,L as We,aZ as qe,bB as ze,ac as Be,p as Ve,q as Ye,i as Ke,k as je,m as oe,t as Ze,bC as Je,x as Qe,n as Xe,bD as $e,bE as et,bF as tt}from"./jXY9Blq1.js";import{a as se,s as nt}from"./CiGBWU-C.js";import{p as N,r as at}from"./UsWP0l6m.js";function it(e,t){return t}function rt(e,t,o){for(var a=[],i=t.length,n,l=t.length,d=0;d<i;d++){let y=t[d];he(y,()=>{if(n){if(n.pending.delete(y),n.done.add(y),n.pending.size===0){var f=e.outrogroups;K(Z(n.done)),f.delete(n),f.size===0&&(e.outrogroups=null)}}else l-=1},!1)}if(l===0){var s=a.length===0&&o!==null;if(s){var p=o,c=p.parentNode;De(c),c.append(p),e.items.clear()}K(t,!s)}else n={pending:new Set(t),done:new Set},(e.outrogroups??(e.outrogroups=new Set)).add(n)}function K(e,t=!0){for(var o=0;o<e.length;o++)Te(e[o],t)}var le;function ot(e,t,o,a,i,n=null){var l=e,d=new Map,s=(t&ye)!==0;if(s){var p=e;l=h?x(J(p)):p.appendChild(H())}h&&q();var c=null,y=Ae(()=>{var u=o();return Ce(u)?u:u==null?[]:Z(u)}),f,g=!0;function w(){r.fallback=c,st(r,f,l,t,a),c!==null&&(f.length===0?(c.f&S)===0?ge(c):(c.f^=S,G(c,null,l)):he(c,()=>{c=null}))}var A=j(()=>{f=U(y);var u=f.length;let C=!1;if(h){var D=me(l)===be;D!==(u===0)&&(l=ae(),x(l),R(!1),C=!0)}for(var b=new Set,T=ke,L=Se(),m=0;m<u;m+=1){h&&_.nodeType===fe&&_.data===ve&&(l=_,C=!0,R(!1));var I=f[m],E=a(I,m);if(B){var M=a(I,m);E!==M&&we(String(m),String(E),String(M))}var v=g?null:d.get(E);v?(v.v&&ie(v.v,I),v.i&&ie(v.i,m),L&&T.unskip_effect(v.e)):(v=lt(d,g?l:le??(le=H()),I,E,m,i,t,o),g||(v.e.f|=S),d.set(E,v)),b.add(E)}if(u===0&&n&&!c&&(g?c=V(()=>n(l)):(c=V(()=>n(le??(le=H()))),c.f|=S)),u>b.size&&(B?dt(f,a):pe("","","")),h&&u>0&&x(ae()),!g)if(L){for(const[F,W]of d)b.has(F)||T.skip_effect(W.e);T.oncommit(w),T.ondiscard(()=>{})}else w();C&&R(!0),U(y)}),r={effect:A,items:d,outrogroups:null,fallback:c};g=!1,h&&(l=_)}function O(e){for(;e!==null&&(e.f&xe)===0;)e=e.next;return e}function st(e,t,o,a,i){var M,v,F,W,Q,X,$,ee,te;var n=(a&Le)!==0,l=t.length,d=e.items,s=O(e.effect.first),p,c=null,y,f=[],g=[],w,A,r,u;if(n)for(u=0;u<l;u+=1)w=t[u],A=i(w,u),r=d.get(A).e,(r.f&S)===0&&((v=(M=r.nodes)==null?void 0:M.a)==null||v.measure(),(y??(y=new Set)).add(r));for(u=0;u<l;u+=1){if(w=t[u],A=i(w,u),r=d.get(A).e,e.outrogroups!==null)for(const k of e.outrogroups)k.pending.delete(r),k.done.delete(r);if((r.f&S)!==0)if(r.f^=S,r===s)G(r,null,o);else{var C=c?c.next:s;r===e.effect.last&&(e.effect.last=r.prev),r.prev&&(r.prev.next=r.next),r.next&&(r.next.prev=r.prev),P(e,c,r),P(e,r,C),G(r,C,o),c=r,f=[],g=[],s=O(c.next);continue}if((r.f&z)!==0&&(ge(r),n&&((W=(F=r.nodes)==null?void 0:F.a)==null||W.unfix(),(y??(y=new Set)).delete(r))),r!==s){if(p!==void 0&&p.has(r)){if(f.length<g.length){var D=g[0],b;c=D.prev;var T=f[0],L=f[f.length-1];for(b=0;b<f.length;b+=1)G(f[b],D,o);for(b=0;b<g.length;b+=1)p.delete(g[b]);P(e,T.prev,L.next),P(e,c,T),P(e,L,D),s=D,c=L,u-=1,f=[],g=[]}else p.delete(r),G(r,s,o),P(e,r.prev,r.next),P(e,r,c===null?e.effect.first:c.next),P(e,c,r),c=r;continue}for(f=[],g=[];s!==null&&s!==r;)(p??(p=new Set)).add(s),g.push(s),s=O(s.next);if(s===null)continue}(r.f&S)===0&&f.push(r),c=r,s=O(r.next)}if(e.outrogroups!==null){for(const k of e.outrogroups)k.pending.size===0&&(K(Z(k.done)),(Q=e.outrogroups)==null||Q.delete(k));e.outrogroups.size===0&&(e.outrogroups=null)}if(s!==null||p!==void 0){var m=[];if(p!==void 0)for(r of p)(r.f&z)===0&&m.push(r);for(;s!==null;)(s.f&z)===0&&s!==e.fallback&&m.push(s),s=O(s.next);var I=m.length;if(I>0){var E=(a&ye)!==0&&l===0?o:null;if(n){for(u=0;u<I;u+=1)($=(X=m[u].nodes)==null?void 0:X.a)==null||$.measure();for(u=0;u<I;u+=1)(te=(ee=m[u].nodes)==null?void 0:ee.a)==null||te.fix()}rt(e,m,E)}}n&&Re(()=>{var k,ne;if(y!==void 0)for(r of y)(ne=(k=r.nodes)==null?void 0:k.a)==null||ne.apply()})}function lt(e,t,o,a,i,n,l,d){var s=(l&Ie)!==0?(l&Ee)===0?Pe(o,!1,!1):re(o):null,p=(l&_e)!==0?re(i):null;return B&&s&&(s.trace=()=>{d()[(p==null?void 0:p.v)??i]}),{v:s,i:p,e:V(()=>(n(t,s??o,p??i,d),()=>{e.delete(a)}))}}function G(e,t,o){if(e.nodes)for(var a=e.nodes.start,i=e.nodes.end,n=t&&(t.f&S)===0?t.nodes.start:o;a!==null;){var l=Y(a);if(n.before(a),a===i)return;a=l}}function P(e,t,o){t===null?e.effect.first=o:t.next=o,o===null?e.effect.last=t:o.prev=t}function dt(e,t){const o=new Map,a=e.length;for(let i=0;i<a;i++){const n=t(e[i],i);if(o.has(n)){const l=String(o.get(n)),d=String(i);let s=String(n);s.startsWith("[object ")&&(s=null),pe(l,d,s)}o.set(n,i)}}function wt(e,t,o,a,i){var d;h&&q();var n=(d=t.$$slots)==null?void 0:d[o],l=!1;n===!0&&(n=t.children,l=!0),n===void 0||n(e,l?()=>a:a)}function ct(e,t,o,a,i,n){let l=h;h&&q();var d=null;h&&_.nodeType===Me&&(d=_,q());var s=h?_:e,p=new Oe(s,!1);j(()=>{const c=t()||null;var y=Ue;if(c===null){p.ensure(null,null);return}return p.ensure(c,f=>{if(c){if(d=h?d:Ge(c,y),He(d,d),a){h&&Fe(c)&&d.append(document.createComment(""));var g=h?J(d):d.appendChild(H());h&&(g===null?R(!1):x(g)),a(d,g)}We.nodes.end=d,f.before(d)}h&&x(f)}),()=>{}},Ne),qe(()=>{}),l&&(R(!0),x(s))}function kt(e,t){let o=null,a=h;var i;if(h){o=_;for(var n=J(document.head);n!==null&&(n.nodeType!==fe||n.data!==e);)n=Y(n);if(n===null)R(!1);else{var l=Y(n);n.remove(),x(l)}}h||(i=document.head.appendChild(H()));try{j(()=>t(i),ze|Be)}finally{a&&(R(!0),x(o))}}const ut=[{id:"weather",name:"Weather",description:"Current conditions and forecast via Open-Meteo (free) or OpenWeatherMap",setupGuide:`Open-Meteo is free and requires no API key.

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

Common symbols: AAPL, MSFT, GOOGL, AMZN, TSLA, NVDA, META.`,fields:[{key:"watchlist",type:"string",label:"Watchlist",description:"Comma-separated ticker symbols (e.g. AAPL,MSFT,GOOGL)",default:"AAPL,MSFT,GOOGL",category:"widget"},{key:"show1h",type:"boolean",label:"Show 1H Change",description:"Display 1-hour price change",default:!1,category:"widget"},{key:"show24h",type:"boolean",label:"Show 24H Change",description:"Display 24-hour price change",default:!0,category:"widget"},{key:"show7d",type:"boolean",label:"Show 7D Change",description:"Display 7-day price change",default:!1,category:"widget"},{key:"showSparkline",type:"boolean",label:"Show Sparkline Charts",description:"Display inline price charts next to each stock",default:!0,category:"widget"}]}],St=ut.filter(e=>e.system).map(e=>e.id);function At(e){return e.fields.filter(t=>t.category==="integration")}function Ct(e){return e.fields.filter(t=>t.category==="widget")}/**
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
 */const ft={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
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
 */const pt=e=>{for(const t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0;return!1};var gt=$e("<svg><!><!></svg>");function It(e,t){Ve(t,!0);const o=N(t,"color",3,"currentColor"),a=N(t,"size",3,24),i=N(t,"strokeWidth",3,2),n=N(t,"absoluteStrokeWidth",3,!1),l=N(t,"iconNode",19,()=>[]),d=at(t,["$$slots","$$events","$$legacy","name","color","size","strokeWidth","absoluteStrokeWidth","iconNode","children"]);var s=gt();se(s,(y,f)=>({...ft,...y,...d,width:a(),height:a(),stroke:o(),"stroke-width":f,class:["lucide-icon lucide",t.name&&`lucide-${t.name}`,t.class]}),[()=>!t.children&&!pt(d)&&{"aria-hidden":"true"},()=>n()?Number(i())*24/Number(a()):i()]);var p=Ye(s);ot(p,17,l,it,(y,f)=>{var g=et(()=>tt(U(f),2));let w=()=>U(g)[0],A=()=>U(g)[1];var r=Ke(),u=je(r);ct(u,w,!0,(C,D)=>{se(C,()=>({...A()}))}),oe(y,r)});var c=Ze(p);nt(c,()=>t.children??Je),Qe(s),oe(e,s),Xe()}function ht(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function de(e){const t=[],o=/\{\{([^#/}][^}]*)\}\}/g;let a=0,i;for(;(i=o.exec(e))!==null;)t.push({type:"text",value:e.slice(a,i.index)}),t.push({type:"placeholder",path:i[1].trim()}),a=i.index+i[0].length;return t.push({type:"text",value:e.slice(a)}),t}function yt(e){const t=[],o=/\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g;let a=0,i;for(;(i=o.exec(e))!==null;){const l=e.slice(a,i.index);(l.length>0||a===0)&&t.push(...de(l)),t.push({type:"block",variable:i[1],content:i[2]}),a=i.index+i[0].length}const n=e.slice(a);return(n.length>0||t.length===0)&&t.push(...de(n)),t}function ce(e,t){const o=[];let a=0;for(;a<t.length;)if(t[a]==="["){const i=t.indexOf("]",a);if(i===-1)break;let n=t.slice(a+1,i);(n.startsWith('"')&&n.endsWith('"')||n.startsWith("'")&&n.endsWith("'"))&&(n=n.slice(1,-1)),o.push(n),a=i+1,a<t.length&&t[a]==="."&&a++}else{let i=t.length;const n=t.indexOf(".",a),l=t.indexOf("[",a);n!==-1&&(i=Math.min(i,n)),l!==-1&&(i=Math.min(i,l));const d=t.slice(a,i);d&&o.push(d),a=i,a<t.length&&t[a]==="."&&a++}return o.reduce((i,n)=>{if(!(i==null||typeof i!="object"))return i[n]},e)}function ue(e,t){return t==null?e:yt(e).map(a=>{switch(a.type){case"text":return a.value;case"placeholder":{const i=ce(t,a.path);return i==null?"":ht(String(i))}case"block":{const i=ce(t,a.variable);return!Array.isArray(i)||i.length===0?"":i.map(n=>typeof n=="object"&&n!==null?ue(a.content,n):ue(a.content,{this:n})).join("")}default:return""}}).join("")}export{It as I,St as S,Ct as a,ht as b,ot as e,At as g,kt as h,it as i,ue as r,wt as s};
