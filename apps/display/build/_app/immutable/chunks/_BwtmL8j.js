import{b as se,w as y,x as j,j as U,y as Ve,H as Be,z as he,A as D,C as N,F as R,G as Pe,I as Ye,D as H,J as Ke,K as ye,L as G,M as V,N as L,O as B,P as Te,Q as je,R as Ze,S as Le,T as oe,U as Xe,V as Qe,W as Je,X as ve,Y as $e,Z as Ne,_ as Me,$ as J,a0 as ea,a1 as aa,a2 as Z,a3 as te,a4 as le,a5 as Re,a6 as De,a7 as ta,a8 as ra,E as ia,B as na,a9 as sa,aa as oa,ab as la,ac as ca,ad as Oe,ae as da,af as ua,ag as Ge,ah as Ue,ai as fa,aj as pa,ak as ga,al as ha,am as ya,an as va,ao as ma,ap as ba,aq as Y,ar as ka,as as _a,at as wa,au as Aa,av as He,aw as me,ax as Sa,g as xe,ay as Fe,az as Ca,p as Ea,q as Ia,c as Pa,f as Ta,a as be,v as La,aA as Na,s as Ma,n as Ra,aB as Da,aC as Oa,aD as Ga}from"./DRA9cCzs.js";import{s as Ua}from"./CnsHFsvp.js";import{i as Ha,t as xa,a as Fa,c as Wa,d as qa,e as za,f as Va,g as Ba,n as Ya,h as Ka,p as x,r as ja}from"./BpRJsttV.js";function Za(e,a){return a}function Xa(e,a,t){for(var r=[],i=a.length,n,s=a.length,c=0;c<i;c++){let b=a[c];Me(b,()=>{if(n){if(n.pending.delete(b),n.done.add(b),n.pending.size===0){var p=e.outrogroups;re(oe(n.done)),p.delete(n),p.size===0&&(e.outrogroups=null)}}else s-=1},!1)}if(s===0){var o=r.length===0&&t!==null;if(o){var f=t,d=f.parentNode;aa(d),d.append(f),e.items.clear()}re(a,!o)}else n={pending:new Set(a),done:new Set},(e.outrogroups??(e.outrogroups=new Set)).add(n)}function re(e,a=!0){for(var t=0;t<e.length;t++)Z(e[t],a)}var ke;function Qa(e,a,t,r,i,n=null){var s=e,c=new Map,o=(a&Re)!==0;if(o){var f=e;s=y?D(le(f)):f.appendChild(V())}y&&j();var d=null,b=Ze(()=>{var u=t();return Le(u)?u:u==null?[]:oe(u)}),p,v=!0;function w(){l.fallback=d,Ja(l,p,s,a,r),d!==null&&(p.length===0?(d.f&L)===0?Ne(d):(d.f^=L,z(d,null,s)):Me(d,()=>{d=null}))}var C=se(()=>{p=U(b);var u=p.length;let E=!1;if(y){var I=Ve(s)===Be;I!==(u===0)&&(s=he(),D(s),N(!1),E=!0)}for(var m=new Set,P=G,h=je(),g=0;g<u;g+=1){y&&R.nodeType===Pe&&R.data===Ye&&(s=R,E=!0,N(!1));var k=p[g],A=r(k,g);if(H){var _=r(k,g);A!==_&&Ke(String(g),String(A),String(_))}var S=v?null:c.get(A);S?(S.v&&ye(S.v,k),S.i&&ye(S.i,g),h&&P.unskip_effect(S.e)):(S=$a(c,v?s:ke??(ke=V()),k,A,g,i,a,t),v||(S.e.f|=L),c.set(A,S)),m.add(A)}if(u===0&&n&&!d&&(v?d=B(()=>n(s)):(d=B(()=>n(ke??(ke=V()))),d.f|=L)),u>m.size&&(H?et(p,r):Te("","","")),y&&u>0&&D(he()),!v)if(h){for(const[O,K]of c)m.has(O)||P.skip_effect(K.e);P.oncommit(w),P.ondiscard(()=>{})}else w();E&&N(!0),U(b)}),l={effect:C,items:c,outrogroups:null,fallback:d};v=!1,y&&(s=R)}function F(e){for(;e!==null&&(e.f&ea)===0;)e=e.next;return e}function Ja(e,a,t,r,i){var _,S,O,K,ce,de,ue,fe,pe;var n=(r&ta)!==0,s=a.length,c=e.items,o=F(e.effect.first),f,d=null,b,p=[],v=[],w,C,l,u;if(n)for(u=0;u<s;u+=1)w=a[u],C=i(w,u),l=c.get(C).e,(l.f&L)===0&&((S=(_=l.nodes)==null?void 0:_.a)==null||S.measure(),(b??(b=new Set)).add(l));for(u=0;u<s;u+=1){if(w=a[u],C=i(w,u),l=c.get(C).e,e.outrogroups!==null)for(const T of e.outrogroups)T.pending.delete(l),T.done.delete(l);if((l.f&L)!==0)if(l.f^=L,l===o)z(l,null,t);else{var E=d?d.next:o;l===e.effect.last&&(e.effect.last=l.prev),l.prev&&(l.prev.next=l.next),l.next&&(l.next.prev=l.prev),M(e,d,l),M(e,l,E),z(l,E,t),d=l,p=[],v=[],o=F(d.next);continue}if((l.f&J)!==0&&(Ne(l),n&&((K=(O=l.nodes)==null?void 0:O.a)==null||K.unfix(),(b??(b=new Set)).delete(l))),l!==o){if(f!==void 0&&f.has(l)){if(p.length<v.length){var I=v[0],m;d=I.prev;var P=p[0],h=p[p.length-1];for(m=0;m<p.length;m+=1)z(p[m],I,t);for(m=0;m<v.length;m+=1)f.delete(v[m]);M(e,P.prev,h.next),M(e,d,P),M(e,h,I),o=I,d=h,u-=1,p=[],v=[]}else f.delete(l),z(l,o,t),M(e,l.prev,l.next),M(e,l,d===null?e.effect.first:d.next),M(e,d,l),d=l;continue}for(p=[],v=[];o!==null&&o!==l;)(f??(f=new Set)).add(o),v.push(o),o=F(o.next);if(o===null)continue}(l.f&L)===0&&p.push(l),d=l,o=F(l.next)}if(e.outrogroups!==null){for(const T of e.outrogroups)T.pending.size===0&&(re(oe(T.done)),(ce=e.outrogroups)==null||ce.delete(T));e.outrogroups.size===0&&(e.outrogroups=null)}if(o!==null||f!==void 0){var g=[];if(f!==void 0)for(l of f)(l.f&J)===0&&g.push(l);for(;o!==null;)(o.f&J)===0&&o!==e.fallback&&g.push(o),o=F(o.next);var k=g.length;if(k>0){var A=(r&Re)!==0&&s===0?t:null;if(n){for(u=0;u<k;u+=1)(ue=(de=g[u].nodes)==null?void 0:de.a)==null||ue.measure();for(u=0;u<k;u+=1)(pe=(fe=g[u].nodes)==null?void 0:fe.a)==null||pe.fix()}Xa(e,g,A)}}n&&De(()=>{var T,ge;if(b!==void 0)for(l of b)(ge=(T=l.nodes)==null?void 0:T.a)==null||ge.apply()})}function $a(e,a,t,r,i,n,s,c){var o=(s&Xe)!==0?(s&Qe)===0?Je(t,!1,!1):ve(t):null,f=(s&$e)!==0?ve(i):null;return H&&o&&(o.trace=()=>{c()[(f==null?void 0:f.v)??i]}),{v:o,i:f,e:B(()=>(n(a,o??t,f??i,c),()=>{e.delete(r)}))}}function z(e,a,t){if(e.nodes)for(var r=e.nodes.start,i=e.nodes.end,n=a&&(a.f&L)===0?a.nodes.start:t;r!==null;){var s=te(r);if(n.before(r),r===i)return;r=s}}function M(e,a,t){a===null?e.effect.first=t:a.next=t,t===null?e.effect.last=a:t.prev=a}function et(e,a){const t=new Map,r=e.length;for(let i=0;i<r;i++){const n=a(e[i],i);if(t.has(n)){const s=String(t.get(n)),c=String(i);let o=String(n);o.startsWith("[object ")&&(o=null),Te(s,c,o)}t.set(n,i)}}function Ct(e,a,t,r,i){var c;y&&j();var n=(c=a.$$slots)==null?void 0:c[t],s=!1;n===!0&&(n=a.children,s=!0),n===void 0||n(e,s?()=>r:r)}function at(e,a,t,r,i,n){let s=y;y&&j();var c=null;y&&R.nodeType===ra&&(c=R,j());var o=y?R:e,f=new na(o,!1);se(()=>{const d=a()||null;var b=oa;if(d===null){f.ensure(null,null);return}return f.ensure(d,p=>{if(d){if(c=y?c:sa(d,b),la(c,c),r){y&&Ha(d)&&c.append(document.createComment(""));var v=y?le(c):c.appendChild(V());y&&(v===null?N(!1):D(v)),r(c,v)}ca.nodes.end=c,p.before(c)}y&&D(p)}),()=>{}},ia),Oe(()=>{}),s&&(N(!0),D(o))}function Et(e,a){let t=null,r=y;var i;if(y){t=R;for(var n=le(document.head);n!==null&&(n.nodeType!==Pe||n.data!==e);)n=te(n);if(n===null)N(!1);else{var s=te(n);n.remove(),D(s)}}y||(i=document.head.appendChild(V()));try{se(()=>a(i),da|ua)}finally{r&&(N(!0),D(t))}}function tt(e,a){var t=void 0,r;Ge(()=>{t!==(t=a())&&(r&&(Z(r),r=null),t&&(r=B(()=>{Ue(()=>t(e))})))})}function rt(e,a,t,r,i,n){var s=e.__className;if(y||s!==t||s===void 0){var c=xa(t,r,n);(!y||c!==e.getAttribute("class"))&&(c==null?e.removeAttribute("class"):a?e.className=c:e.setAttribute("class",c)),e.__className=t}else if(n&&i!==n)for(var o in n){var f=!!n[o];(i==null||f!==!!i[o])&&e.classList.toggle(o,f)}return n}function $(e,a={},t,r){for(var i in t){var n=t[i];a[i]!==n&&(t[i]==null?e.style.removeProperty(i):e.style.setProperty(i,n,r))}}function it(e,a,t,r){var i=e.__style;if(y||i!==a){var n=Fa(a,r);(!y||n!==e.getAttribute("style"))&&(n==null?e.removeAttribute("style"):e.style.cssText=n),e.__style=a}else r&&(Array.isArray(r)?($(e,t==null?void 0:t[0],r[0]),$(e,t==null?void 0:t[1],r[1],"important")):$(e,t,r));return r}function ie(e,a,t=!1){if(e.multiple){if(a==null)return;if(!Le(a))return fa();for(var r of e.options)r.selected=a.includes(_e(r));return}for(r of e.options){var i=_e(r);if(pa(i,a)){r.selected=!0;return}}(!t||a!==void 0)&&(e.selectedIndex=-1)}function nt(e){var a=new MutationObserver(()=>{ie(e,e.__value)});a.observe(e,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["value"]}),Oe(()=>{a.disconnect()})}function _e(e){return"__value"in e?e.__value:e.value}const W=Symbol("class"),q=Symbol("style"),We=Symbol("is custom element"),qe=Symbol("is html"),st=Y?"link":"LINK",ot=Y?"input":"INPUT",lt=Y?"option":"OPTION",ct=Y?"select":"SELECT",dt=Y?"progress":"PROGRESS";function ut(e){if(y){var a=!1,t=()=>{if(!a){if(a=!0,e.hasAttribute("value")){var r=e.value;X(e,"value",null),e.value=r}if(e.hasAttribute("checked")){var i=e.checked;X(e,"checked",null),e.checked=i}}};e.__on_r=t,De(t),ba()}}function It(e,a){var t=Q(e);t.value===(t.value=a??void 0)||e.value===a&&(a!==0||e.nodeName!==dt)||(e.value=a??"")}function Pt(e,a){var t=Q(e);t.checked!==(t.checked=a??void 0)&&(e.checked=a)}function ft(e,a){a?e.hasAttribute("selected")||e.setAttribute("selected",""):e.removeAttribute("selected")}function X(e,a,t,r){var i=Q(e);if(y&&(i[a]=e.getAttribute(a),a==="src"||a==="srcset"||a==="href"&&e.nodeName===st)){r||gt(e,a,t??"");return}i[a]!==(i[a]=t)&&(a==="loading"&&(e[wa]=t),t==null?e.removeAttribute(a):typeof t!="string"&&ze(e).includes(a)?e[a]=t:e.setAttribute(a,t))}function pt(e,a,t,r,i=!1,n=!1){if(y&&i&&e.nodeName===ot){var s=e,c=s.type==="checkbox"?"defaultChecked":"defaultValue";c in t||ut(s)}var o=Q(e),f=o[We],d=!o[qe];let b=y&&f;b&&N(!1);var p=a||{},v=e.nodeName===lt;for(var w in a)w in t||(t[w]=null);t.class?t.class=Wa(t.class):t[W]&&(t.class=null),t[q]&&(t.style??(t.style=null));var C=ze(e);for(const h in t){let g=t[h];if(v&&h==="value"&&g==null){e.value=e.__value="",p[h]=g;continue}if(h==="class"){var l=e.namespaceURI==="http://www.w3.org/1999/xhtml";rt(e,l,g,r,a==null?void 0:a[W],t[W]),p[h]=g,p[W]=t[W];continue}if(h==="style"){it(e,g,a==null?void 0:a[q],t[q]),p[h]=g,p[q]=t[q];continue}var u=p[h];if(!(g===u&&!(g===void 0&&e.hasAttribute(h)))){p[h]=g;var E=h[0]+h[1];if(E!=="$$")if(E==="on"){const k={},A="$$"+h;let _=h.slice(2);var I=Ka(_);if(qa(_)&&(_=_.slice(0,-7),k.capture=!0),!I&&u){if(g!=null)continue;e.removeEventListener(_,p[A],k),p[A]=null}if(I)za(_,e,g),Va([_]);else if(g!=null){let S=function(O){p[h].call(this,O)};p[A]=Ba(_,e,S,k)}}else if(h==="style")X(e,h,g);else if(h==="autofocus")ka(e,!!g);else if(!f&&(h==="__value"||h==="value"&&g!=null))e.value=e.__value=g;else if(h==="selected"&&v)ft(e,g);else{var m=h;d||(m=Ya(m));var P=m==="defaultValue"||m==="defaultChecked";if(g==null&&!f&&!P)if(o[h]=null,m==="value"||m==="checked"){let k=e;const A=a===void 0;if(m==="value"){let _=k.defaultValue;k.removeAttribute(m),k.defaultValue=_,k.value=k.__value=A?_:null}else{let _=k.defaultChecked;k.removeAttribute(m),k.defaultChecked=_,k.checked=A?_:!1}}else e.removeAttribute(h);else P||C.includes(m)&&(f||typeof g!="string")?(e[m]=g,m in o&&(o[m]=_a)):typeof g!="function"&&X(e,m,g,n)}}}return b&&N(!0),p}function we(e,a,t=[],r=[],i=[],n,s=!1,c=!1){va(i,t,r,o=>{var f=void 0,d={},b=e.nodeName===ct,p=!1;if(Ge(()=>{var w=a(...o.map(U)),C=pt(e,f,w,n,s,c);p&&b&&"value"in w&&ie(e,w.value);for(let u of Object.getOwnPropertySymbols(d))w[u]||Z(d[u]);for(let u of Object.getOwnPropertySymbols(w)){var l=w[u];u.description===ma&&(!f||l!==f[u])&&(d[u]&&Z(d[u]),d[u]=B(()=>tt(e,()=>l))),C[u]=l}f=C}),b){var v=e;Ue(()=>{ie(v,f.value,!0),nt(v)})}p=!0})}function Q(e){return e.__attributes??(e.__attributes={[We]:e.nodeName.includes("-"),[qe]:e.namespaceURI===ga})}var Ae=new Map;function ze(e){var a=e.getAttribute("is")||e.nodeName,t=Ae.get(a);if(t)return t;Ae.set(a,t=[]);for(var r,i=e,n=Element.prototype;n!==i;){r=ya(i);for(var s in r)r[s].set&&t.push(s);i=ha(i)}return t}function gt(e,a,t){H&&(a==="srcset"&&ht(e,t)||ne(e.getAttribute(a)??"",t)||Aa(a,e.outerHTML.replace(e.innerHTML,e.innerHTML&&"..."),String(t)))}function ne(e,a){return e===a?!0:new URL(e,document.baseURI).href===new URL(a,document.baseURI).href}function Se(e){return e.split(",").map(a=>a.trim().split(" ").filter(Boolean))}function ht(e,a){var t=Se(e.srcset),r=Se(a);return r.length===t.length&&r.every(([i,n],s)=>n===t[s][1]&&(ne(t[s][0],i)||ne(i,t[s][0])))}function Tt(e,a,t=a){var r=new WeakSet;He(e,"input",async i=>{H&&e.type==="checkbox"&&me();var n=i?e.defaultValue:e.value;if(n=ee(e)?ae(n):n,t(n),G!==null&&r.add(G),await Sa(),n!==(n=a())){var s=e.selectionStart,c=e.selectionEnd,o=e.value.length;if(e.value=n??"",c!==null){var f=e.value.length;s===c&&c===o&&f>o?(e.selectionStart=f,e.selectionEnd=f):(e.selectionStart=s,e.selectionEnd=Math.min(c,f))}}}),(y&&e.defaultValue!==e.value||xe(a)==null&&e.value)&&(t(ee(e)?ae(e.value):e.value),G!==null&&r.add(G)),Fe(()=>{H&&e.type==="checkbox"&&me();var i=a();if(e===document.activeElement){var n=Ca??G;if(r.has(n))return}ee(e)&&i===ae(e.value)||e.type==="date"&&!i&&!e.value||i!==e.value&&(e.value=i??"")})}function Lt(e,a,t=a){He(e,"change",r=>{var i=r?e.defaultChecked:e.checked;t(i)}),(y&&e.defaultChecked!==e.checked||xe(a)==null)&&t(e.checked),Fe(()=>{var r=a();e.checked=!!r})}function ee(e){var a=e.type;return a==="number"||a==="range"}function ae(e){return e===""?null:+e}const yt=[{id:"weather",name:"Weather",description:"Current conditions and forecast via Open-Meteo (free) or OpenWeatherMap",setupGuide:`Open-Meteo is free and requires no API key.

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

Common symbols: AAPL, MSFT, GOOGL, AMZN, TSLA, NVDA, META.`,fields:[{key:"watchlist",type:"string",label:"Watchlist",description:"Comma-separated ticker symbols (e.g. AAPL,MSFT,GOOGL)",default:"AAPL,MSFT,GOOGL",category:"widget"},{key:"show1h",type:"boolean",label:"Show 1H Change",description:"Display 1-hour price change",default:!1,category:"widget"},{key:"show24h",type:"boolean",label:"Show 24H Change",description:"Display 24-hour price change",default:!0,category:"widget"},{key:"show7d",type:"boolean",label:"Show 7D Change",description:"Display 7-day price change",default:!1,category:"widget"},{key:"showSparkline",type:"boolean",label:"Show Sparkline Charts",description:"Display inline price charts next to each stock",default:!0,category:"widget"}]}],Nt=yt.filter(e=>e.system).map(e=>e.id);function Mt(e){return e.fields.filter(a=>a.category==="integration")}function Rt(e){return e.fields.filter(a=>a.category==="widget")}/**
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
 */const vt={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
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
 */const mt=e=>{for(const a in e)if(a.startsWith("aria-")||a==="role"||a==="title")return!0;return!1};var bt=Da("<svg><!><!></svg>");function Dt(e,a){Ea(a,!0);const t=x(a,"color",3,"currentColor"),r=x(a,"size",3,24),i=x(a,"strokeWidth",3,2),n=x(a,"absoluteStrokeWidth",3,!1),s=x(a,"iconNode",19,()=>[]),c=ja(a,["$$slots","$$events","$$legacy","name","color","size","strokeWidth","absoluteStrokeWidth","iconNode","children"]);var o=bt();we(o,(b,p)=>({...vt,...b,...c,width:r(),height:r(),stroke:t(),"stroke-width":p,class:["lucide-icon lucide",a.name&&`lucide-${a.name}`,a.class]}),[()=>!a.children&&!mt(c)&&{"aria-hidden":"true"},()=>n()?Number(i())*24/Number(r()):i()]);var f=Ia(o);Qa(f,17,s,Za,(b,p)=>{var v=Oa(()=>Ga(U(p),2));let w=()=>U(v)[0],C=()=>U(v)[1];var l=Pa(),u=Ta(l);at(u,w,!0,(E,I)=>{we(E,()=>({...C()}))}),be(b,l)});var d=La(f);Ua(d,()=>a.children??Na),Ma(o),be(e,o),Ra()}function kt(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ce(e){const a=[],t=/\{\{([^#/}][^}]*)\}\}/g;let r=0,i;for(;(i=t.exec(e))!==null;)a.push({type:"text",value:e.slice(r,i.index)}),a.push({type:"placeholder",path:i[1].trim()}),r=i.index+i[0].length;return a.push({type:"text",value:e.slice(r)}),a}function _t(e){const a=[],t=/\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g;let r=0,i;for(;(i=t.exec(e))!==null;){const s=e.slice(r,i.index);(s.length>0||r===0)&&a.push(...Ce(s)),a.push({type:"block",variable:i[1],content:i[2]}),r=i.index+i[0].length}const n=e.slice(r);return(n.length>0||a.length===0)&&a.push(...Ce(n)),a}function Ee(e,a){const t=[];let r=0;for(;r<a.length;)if(a[r]==="["){const i=a.indexOf("]",r);if(i===-1)break;let n=a.slice(r+1,i);(n.startsWith('"')&&n.endsWith('"')||n.startsWith("'")&&n.endsWith("'"))&&(n=n.slice(1,-1)),t.push(n),r=i+1,r<a.length&&a[r]==="."&&r++}else{let i=a.length;const n=a.indexOf(".",r),s=a.indexOf("[",r);n!==-1&&(i=Math.min(i,n)),s!==-1&&(i=Math.min(i,s));const c=a.slice(r,i);c&&t.push(c),r=i,r<a.length&&a[r]==="."&&r++}return t.reduce((i,n)=>{if(!(i==null||typeof i!="object"))return i[n]},e)}function Ie(e,a){return a==null?e:_t(e).map(r=>{switch(r.type){case"text":return r.value;case"placeholder":{const i=Ee(a,r.path);return i==null?"":kt(String(i))}case"block":{const i=Ee(a,r.variable);return!Array.isArray(i)||i.length===0?"":i.map(n=>typeof n=="object"&&n!==null?Ie(r.content,n):Ie(r.content,{this:n})).join("")}default:return""}}).join("")}export{Dt as I,Nt as S,X as a,Tt as b,Lt as c,ie as d,Qa as e,rt as f,Mt as g,Za as h,nt as i,It as j,Ct as k,Ie as l,it as m,ft as n,Et as o,Rt as p,ut as r,Pt as s};
