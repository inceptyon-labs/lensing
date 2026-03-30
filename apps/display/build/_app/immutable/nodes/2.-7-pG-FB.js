import{p as te,e as Ze,a as d,n as ae,j as e,ba as k,o as m,bu as xe,q as n,s as a,c as pe,f as le,t as G,aC as ge,bB as we,k as F,bC as Xe,g as p,W as ye,v as f,aB as Ft,R as me,aA as ke,bv as ra,aW as ft,aD as ia,bD as la,be as et,bE as dt,ah as oa,bG as da}from"../chunks/DRA9cCzs.js";import{e as We,b as de,h as Ee,I as Me,n as ot,m as ca,l as va,r as tt,c as gt,j as ua,a as _a,k as jt,s as ga,i as Gt,f as Ot,S as ha,p as fa}from"../chunks/D5sl8Evu.js";import{p as J,v as B,s as I,z as Ne,r as He,y as nt,B as pa,C as ma,D as Ye,E as Bt,f as at,e as se,F as wa}from"../chunks/BpRJsttV.js";import{b as It,c as ya}from"../chunks/BlTpvLZj.js";import{s as Se}from"../chunks/CnsHFsvp.js";import{i as Ge}from"../chunks/BJh0JSOh.js";import{g as Yt,b as Vt,t as ba}from"../chunks/3ioIPOGt.js";const Lt={columns:12,rowHeight:60,margin:[5,5],compact:"vertical",float:!1,resizeHandles:["n","ne","e","se","s","sw","w","nw"],minRow:1,maxRow:0,animate:150},xa={weather:{x:0,y:0,w:3,h:4},news:{x:3,y:0,w:4,h:4},sports:{x:7,y:0,w:3,h:4},crypto:{x:10,y:0,w:2,h:4},calendar:{x:0,y:4,w:4,h:5},"home-assistant":{x:4,y:4,w:4,h:5},"photo-slideshow":{x:8,y:4,w:4,h:5},allergies:{x:0,y:9,w:3,h:3}},_t={w:3,h:4};let ht=0,Pt=12;function ka(o){const t=xa[o];if(t)return t;const s={x:ht,y:Pt,w:_t.w,h:_t.h};return ht+=_t.w,ht+_t.w>12&&(ht=0,Pt+=_t.h),s}function Sa(o){return ht=0,Pt=12,o.filter(t=>t.enabled!==!1).map(t=>{const s=ka(t.plugin_id);return{id:t.plugin_id,x:s.x,y:s.y,w:s.w,h:s.h}})}const Et={weather:{min:[2,2],preferred:[3,4],max:[6,8]},allergies:{min:[2,2],preferred:[3,3],max:[6,6]},crypto:{min:[2,2],preferred:[2,4],max:[6,8]},"word-of-day":{min:[2,2],preferred:[3,3],max:[6,6]},finance:{min:[2,2],preferred:[3,4],max:[6,8]},"ai-news":{min:[2,3],preferred:[4,5],max:[8,10]},news:{min:[2,3],preferred:[4,4],max:[8,10]},sports:{min:[2,2],preferred:[3,4],max:[6,8]},"photo-slideshow":{min:[2,3],preferred:[4,5],max:[12,12]},calendar:{min:[2,3],preferred:[4,5],max:[8,10]},"home-assistant":{min:[2,3],preferred:[4,5],max:[8,10]}},Ma={min:[1,2],preferred:[2,3],max:[12,12]};function Na(o){return o!==null&&typeof o=="object"&&!Array.isArray(o)&&"min"in o&&"preferred"in o&&"max"in o}function Ha(o,t){return t!=null&&t.widget_sizes&&Na(t.widget_sizes)?t.widget_sizes:o in Et?Et[o]:Ma}function Kt(o,t){const s=Ha(o,t);return{w:s.preferred[0],h:s.preferred[1]}}const Tt="__",zt=[{type:"spacer",label:"Spacer",description:"Invisible block to create breathing room",icon:"⬜",defaultW:3,defaultH:1,minW:1,minH:1,maxW:12,maxH:12},{type:"hdiv",label:"Horizontal Line",description:"Thin line to separate rows",icon:"━",defaultW:12,defaultH:1,minW:1,minH:1,maxW:12,maxH:1},{type:"vdiv",label:"Vertical Line",description:"Thin line to separate columns",icon:"┃",defaultW:1,defaultH:4,minW:1,minH:1,maxW:1,maxH:12},{type:"clock",label:"Clock",description:"Current time and date display",icon:"◷",defaultW:4,defaultH:2,minW:2,minH:2,maxW:12,maxH:12}];function Wt(o){if(!o.startsWith(Tt))return null;const t=o.slice(Tt.length),s=t.indexOf("-"),_=s===-1?t:t.slice(0,s);return["spacer","hdiv","vdiv","clock"].includes(_)?_:null}function ja(o){return zt.find(t=>t.type===o)}function Wa(o){const t=Math.random().toString(36).slice(2,8);return`${Tt}${o}-${t}`}const Da=200,Ca=5,Pa=768,Zt=4,Ta=70,za=["se","sw"];function Ia(){return typeof window>"u"?!1:window.innerWidth<=Pa}function La(){return{...Lt,columns:Zt,rowHeight:Ta,resizeHandles:za,touchDelay:Da,moveTolerance:Ca,margin:[4,4]}}var $a=m('<div class="grid-stack-item"><div class="grid-stack-item-content gs-item-content"><!></div></div>'),qa=m('<div class="grid-stack"><!></div>');function Ea(o,t){te(t,!0);let s=J(t,"items",19,()=>[]),_=J(t,"editMode",3,!1),i=J(t,"options",3,Lt),y=xe(void 0),r,l=xe(!1),P=!1;Ze(()=>{if(e(y))return z(),()=>{r&&(r.destroy(!1),r=void 0,k(l,!1))}});function z(){if(!e(y))return;const c=globalThis.GridStack;if(c)try{const v=Ia(),h=v?La():i(),$=v?Zt:i().columns,g=h.touchDelay??0,b=h.moveTolerance??0,u=c.init({column:$,cellHeight:h.rowHeight,margin:`${h.margin[0]}px`,float:h.float??!1,animate:(h.animate??150)>0,resizable:{handles:h.resizeHandles.join(",")},staticGrid:!_(),minRow:h.minRow??1,draggable:{touchDelay:g},...b>0?{moveTolerance:b}:{}},e(y));r=u,E(s()),u.on("change",()=>{if(!P&&t.onchange){const N=j();t.onchange(N)}}),u.on("added",(N,U)=>{if(!P&&t.onadd&&U.length>0)for(const K of U){const Y=C(K);Y&&t.onadd(Y)}}),u.on("removed",(N,U)=>{if(!P&&t.onremove&&U.length>0)for(const K of U){const Y=C(K);Y&&t.onremove(Y)}}),k(l,!0)}catch{}}function E(c){var $;if(!r)return;P=!0,r.batchUpdate();const v=new Map;for(const g of r.getGridItems()){const b=($=g.gridstackNode)==null?void 0:$.id;b&&v.set(b,g)}const h=new Set(c.map(g=>g.id));for(const[g,b]of v)h.has(g)||r.removeWidget(b);for(const g of c){const b=/^[a-zA-Z0-9_-]+$/.test(g.id)?g.id:"invalid-widget",u=v.get(b);u?r.update(u,{x:g.x,y:g.y,w:g.w,h:g.h,minW:g.minW,minH:g.minH,maxW:g.maxW,maxH:g.maxH}):r.addWidget({id:b,w:g.w,h:g.h,autoPosition:!0,minW:g.minW,minH:g.minH,maxW:g.maxW,maxH:g.maxH,locked:g.locked,content:(()=>{const N=document.createElement("div");return N.className="gs-item-content",N.setAttribute("data-widget-id",b),N.outerHTML})()})}r.batchUpdate(!1),P=!1}function j(){return r?r.getGridItems().map(c=>{const v=c.gridstackNode;return{id:(v==null?void 0:v.id)??"",x:(v==null?void 0:v.x)??0,y:(v==null?void 0:v.y)??0,w:(v==null?void 0:v.w)??1,h:(v==null?void 0:v.h)??1}}):[]}function C(c){return c?{id:c.id??"",x:c.x??0,y:c.y??0,w:c.w??1,h:c.h??1}:null}Ze(()=>{e(l)&&r&&r.setStatic(!_())}),Ze(()=>{if(!e(l))return;const c=s().map(v=>({id:v.id,x:v.x,y:v.y,w:v.w,h:v.h,minW:v.minW,minH:v.minH,maxW:v.maxW,maxH:v.maxH,locked:v.locked}));E(c)});var M=qa(),W=n(M);{var x=c=>{var v=pe(),h=le(v);We(h,17,s,$=>$.id,($,g)=>{var b=$a(),u=n(b),N=n(u);{var U=K=>{var Y=pe(),L=le(Y);Se(L,()=>t.widget,()=>({widget:e(g)})),d(K,Y)};B(N,K=>{t.widget&&K(U)})}a(u),a(b),G(()=>{de(b,"data-gs-id",e(g).id),de(b,"data-gs-x",e(g).x),de(b,"data-gs-y",e(g).y),de(b,"data-gs-w",e(g).w),de(b,"data-gs-h",e(g).h),de(u,"data-widget-id",e(g).id)}),d($,b)}),d(c,v)};B(W,c=>{e(l)||c(x)})}a(M),It(M,c=>k(y,c),()=>e(y)),d(o,M),ae()}var Aa=m('<div><img alt="Ambient slideshow" style="object-fit: cover; position: absolute; inset: 0; width: 100%; height: 100%;"/></div>'),Ua=m('<div class="photo-slideshow__empty svelte-ci60j3"><span>No photos available</span></div>'),Ra=m('<div class="photo-slideshow svelte-ci60j3"><!></div>');function Fa(o,t){te(t,!0);function s(x,c){return c<=1?0:(x+1)%c}const _=J(t,"photoPaths",19,()=>[]),i=J(t,"cycleInterval",3,3e4),y=["ken-burns-1","ken-burns-2","ken-burns-3"];let r=xe(0),l=xe(0),P=ge(()=>y[e(l)]);function z(){const x=_()??[];x.length!==0&&(k(r,s(e(r),x.length),!0),k(l,(e(l)+1)%y.length))}Ze(()=>{const x=_()??[],c=i()??3e4;if(x.length<=1)return;const v=setInterval(z,c);return()=>clearInterval(v)});let E=ge(()=>(_()??[]).length>0?(_()??[])[e(r)]??null:null);var j=Ra(),C=n(j);{var M=x=>{var c=Aa(),v=n(c);a(c),G(()=>{Ee(c,1,`photo-slideshow__slide photo-slideshow__slide--active ${e(P)??""}`,"svelte-ci60j3"),de(v,"src",e(E))}),d(x,c)},W=x=>{var c=Ua();d(x,c)};B(C,x=>{e(E)?x(M):x(W,!1)})}a(j),d(o,j),ae()}var Ga=m('<div class="news-headlines__empty svelte-15lg0ov"><span>No headlines available</span></div>'),Oa=m('<li class="news-headlines__compact-item svelte-15lg0ov"><span class="news-headlines__category-badge svelte-15lg0ov"> </span> <span class="news-headlines__compact-title svelte-15lg0ov"> </span> <span class="news-headlines__age svelte-15lg0ov"> </span></li>'),Ba=m('<ul class="news-headlines__compact-list svelte-15lg0ov"></ul>'),Ya=m('<p class="news-headlines__summary svelte-15lg0ov"> </p>'),Va=m('<li class="news-headlines__item svelte-15lg0ov"><div class="news-headlines__meta svelte-15lg0ov"><span class="news-headlines__category-badge svelte-15lg0ov"> </span> <span class="news-headlines__source svelte-15lg0ov"> </span> <span class="news-headlines__age svelte-15lg0ov"> </span></div> <p class="news-headlines__title svelte-15lg0ov"> </p> <!></li>'),Ka=m('<ul class="news-headlines__list svelte-15lg0ov"></ul>'),Za=m("<div><!></div>");function Xa(o,t){te(t,!1);const s=ye();let _=J(t,"headlines",24,()=>[]),i=J(t,"maxItems",8,5),y=J(t,"compact",8,!1);function r(M){const W=Math.max(0,Date.now()-M),x=Math.floor(W/6e4);if(x<60)return`${x}m ago`;const c=Math.floor(x/60);return c<24?`${c}h ago`:`${Math.floor(c/24)}d ago`}we(()=>(F(_()),F(i())),()=>{k(s,_().slice(0,i()))}),Xe(),Ge();var l=Za();let P;var z=n(l);{var E=M=>{var W=Ga();d(M,W)},j=M=>{var W=Ba();We(W,5,()=>e(s),x=>x.id,(x,c)=>{var v=Oa(),h=n(v),$=n(h,!0);a(h);var g=f(h,2),b=n(g,!0);a(g);var u=f(g,2),N=n(u,!0);a(u),a(v),G(U=>{I($,(e(c),p(()=>e(c).category))),I(b,(e(c),p(()=>e(c).title))),I(N,U)},[()=>(e(c),p(()=>r(e(c).published)))]),d(x,v)}),a(W),d(M,W)},C=M=>{var W=Ka();We(W,5,()=>e(s),x=>x.id,(x,c)=>{var v=Va(),h=n(v),$=n(h),g=n($,!0);a($);var b=f($,2),u=n(b,!0);a(b);var N=f(b,2),U=n(N,!0);a(N),a(h);var K=f(h,2),Y=n(K,!0);a(K);var L=f(K,2);{var S=q=>{var V=Ya(),H=n(V,!0);a(V),G(()=>I(H,(e(c),p(()=>e(c).summary)))),d(q,V)};B(L,q=>{e(c),p(()=>e(c).summary)&&q(S)})}a(v),G(q=>{I(g,(e(c),p(()=>e(c).category))),I(u,(e(c),p(()=>e(c).source))),I(U,q),I(Y,(e(c),p(()=>e(c).title)))},[()=>(e(c),p(()=>r(e(c).published)))]),d(x,v)}),a(W),d(M,W)};B(z,M=>{e(s),p(()=>e(s).length===0)?M(E):y()?M(j,1):M(C,!1)})}a(l),G(()=>P=Ee(l,1,"news-headlines svelte-15lg0ov",null,P,{"news-headlines--compact":y()})),d(o,l),ae()}var Ja=m('<div class="sports-scores__empty svelte-1xs1y9r"><span>No games available</span></div>'),Qa=m('<span class="sports-scores__live-badge svelte-1xs1y9r">LIVE</span>'),es=m('<li class="sports-scores__compact-item svelte-1xs1y9r"><span class="sports-scores__league-badge svelte-1xs1y9r"> </span> <!> <span class="sports-scores__compact-matchup svelte-1xs1y9r"> </span> <span class="sports-scores__compact-status svelte-1xs1y9r"> </span></li>'),ts=m('<ul class="sports-scores__compact-list svelte-1xs1y9r"></ul>'),as=m('<span class="sports-scores__period svelte-1xs1y9r"> </span>'),ss=m('<span class="sports-scores__live-badge svelte-1xs1y9r">LIVE</span> <!>',1),ns=m('<span class="sports-scores__status svelte-1xs1y9r"> </span>'),rs=m('<li><div class="sports-scores__header svelte-1xs1y9r"><span class="sports-scores__league-badge svelte-1xs1y9r"> </span> <!></div> <div class="sports-scores__matchup svelte-1xs1y9r"><div class="sports-scores__team svelte-1xs1y9r"><span class="sports-scores__team-name svelte-1xs1y9r"> </span> <span class="sports-scores__score svelte-1xs1y9r"> </span></div> <div class="sports-scores__team svelte-1xs1y9r"><span class="sports-scores__team-name svelte-1xs1y9r"> </span> <span class="sports-scores__score svelte-1xs1y9r"> </span></div></div></li>'),is=m('<ul class="sports-scores__list svelte-1xs1y9r"></ul>'),ls=m("<div><!></div>");function os(o,t){te(t,!1);const s=ye(),_=ye(),i=ye();let y=J(t,"games",24,()=>[]),r=J(t,"compact",8,!1);function l(x){return x.status==="in_progress"?x.period||"LIVE":x.status==="final"?"Final":x.status==="scheduled"?P(x.startTime):x.status==="postponed"?"PPD":x.status==="cancelled"?"Cancelled":x.status}function P(x){const c=new Date(x),v=c.getHours(),h=c.getMinutes().toString().padStart(2,"0"),$=v>=12?"PM":"AM";return`${v%12||12}:${h} ${$}`}we(()=>F(y()),()=>{k(s,y().filter(x=>x.status==="in_progress"))}),we(()=>F(y()),()=>{k(_,y().filter(x=>x.status!=="in_progress"))}),we(()=>(e(s),e(_)),()=>{k(i,[...e(s),...e(_)])}),Xe(),Ge();var z=ls();let E;var j=n(z);{var C=x=>{var c=Ja();d(x,c)},M=x=>{var c=ts();We(c,5,()=>e(i),v=>v.id,(v,h)=>{var $=es(),g=n($),b=n(g,!0);a(g);var u=f(g,2);{var N=S=>{var q=Qa();d(S,q)};B(u,S=>{e(h),p(()=>e(h).status==="in_progress")&&S(N)})}var U=f(u,2),K=n(U);a(U);var Y=f(U,2),L=n(Y,!0);a(Y),a($),G((S,q)=>{I(b,S),I(K,`${e(h),p(()=>e(h).awayTeam)??""}
            ${e(h),p(()=>e(h).awayScore)??""} – ${e(h),p(()=>e(h).homeScore)??""}
            ${e(h),p(()=>e(h).homeTeam)??""}`),I(L,q)},[()=>(e(h),p(()=>e(h).league.toUpperCase())),()=>(e(h),p(()=>l(e(h))))]),d(v,$)}),a(c),d(x,c)},W=x=>{var c=is();We(c,5,()=>e(i),v=>v.id,(v,h)=>{var $=rs();let g;var b=n($),u=n(b),N=n(u,!0);a(u);var U=f(u,2);{var K=re=>{var ve=ss(),be=f(le(ve),2);{var ie=ue=>{var Te=as(),oe=n(Te,!0);a(Te),G(()=>I(oe,(e(h),p(()=>e(h).period)))),d(ue,Te)};B(be,ue=>{e(h),p(()=>e(h).period)&&ue(ie)})}d(re,ve)},Y=re=>{var ve=ns(),be=n(ve,!0);a(ve),G(ie=>I(be,ie),[()=>(e(h),p(()=>l(e(h))))]),d(re,ve)};B(U,re=>{e(h),p(()=>e(h).status==="in_progress")?re(K):re(Y,!1)})}a(b);var L=f(b,2),S=n(L),q=n(S),V=n(q,!0);a(q);var H=f(q,2),w=n(H,!0);a(H),a(S);var R=f(S,2),T=n(R),A=n(T,!0);a(T);var Q=f(T,2),X=n(Q,!0);a(Q),a(R),a(L),a($),G(re=>{g=Ee($,1,"sports-scores__item svelte-1xs1y9r",null,g,{"sports-scores__item--live":e(h).status==="in_progress"}),I(N,re),I(V,(e(h),p(()=>e(h).awayTeam))),I(w,(e(h),p(()=>e(h).awayScore))),I(A,(e(h),p(()=>e(h).homeTeam))),I(X,(e(h),p(()=>e(h).homeScore)))},[()=>(e(h),p(()=>e(h).league.toUpperCase()))]),d(v,$)}),a(c),d(x,c)};B(j,x=>{e(i),p(()=>e(i).length===0)?x(C):r()?x(M,1):x(W,!1)})}a(z),G(()=>E=Ee(z,1,"sports-scores svelte-1xs1y9r",null,E,{"sports-scores--compact":r()})),d(o,z),ae()}var ds=m('<div class="ha-devices__empty svelte-1932y27"><span>No devices available</span></div>'),cs=m('<li><span class="ha-devices__name svelte-1932y27"> </span> <span> </span></li>'),vs=m('<section class="ha-devices__group svelte-1932y27"><h3 class="ha-devices__group-label svelte-1932y27">Lights</h3> <ul class="ha-devices__list svelte-1932y27"></ul></section>'),us=m('<li><span class="ha-devices__name svelte-1932y27"> </span> <span> </span></li>'),_s=m('<section class="ha-devices__group svelte-1932y27"><h3 class="ha-devices__group-label svelte-1932y27">Switches</h3> <ul class="ha-devices__list svelte-1932y27"></ul></section>'),gs=m('<li><span class="ha-devices__name svelte-1932y27"> </span> <span> </span></li>'),hs=m('<section class="ha-devices__group svelte-1932y27"><h3 class="ha-devices__group-label svelte-1932y27">Locks</h3> <ul class="ha-devices__list svelte-1932y27"></ul></section>'),fs=m('<li class="ha-devices__item svelte-1932y27"><span class="ha-devices__name svelte-1932y27"> </span> <span class="ha-devices__state ha-devices__state--climate svelte-1932y27"> </span></li>'),ps=m('<section class="ha-devices__group svelte-1932y27"><h3 class="ha-devices__group-label svelte-1932y27">Climate</h3> <ul class="ha-devices__list svelte-1932y27"></ul></section>'),ms=m('<li class="ha-devices__item svelte-1932y27"><span class="ha-devices__name svelte-1932y27"> </span> <span class="ha-devices__state ha-devices__state--sensor svelte-1932y27"> </span></li>'),ws=m('<section class="ha-devices__group svelte-1932y27"><h3 class="ha-devices__group-label svelte-1932y27">Sensors</h3> <ul class="ha-devices__list svelte-1932y27"></ul></section>'),ys=m("<!> <!> <!> <!> <!>",1),bs=m('<div class="ha-devices svelte-1932y27"><!></div>');function xs(o,t){te(t,!1);const s=ye(),_=ye(),i=ye(),y=ye();let r=J(t,"devices",24,()=>[]),l=J(t,"sensors",24,()=>[]);function P(c){return c.state.charAt(0).toUpperCase()+c.state.slice(1)}function z(c){return c.state==="on"||c.state==="unlocked"||c.state==="open"}function E(c){return c.state==="unlocked"||c.state==="open"}function j(c){const v=c.attributes.current_temperature,h=c.attributes.temperature;return v!==void 0&&h!==void 0?`${v}° / ${h}°`:P(c)}we(()=>F(r()),()=>{k(s,r().filter(c=>c.domain==="light"))}),we(()=>F(r()),()=>{k(_,r().filter(c=>c.domain==="switch"))}),we(()=>F(r()),()=>{k(i,r().filter(c=>c.domain==="lock"))}),we(()=>F(r()),()=>{k(y,r().filter(c=>c.domain==="climate"))}),Xe(),Ge();var C=bs(),M=n(C);{var W=c=>{var v=ds();d(c,v)},x=c=>{var v=ys(),h=le(v);{var $=S=>{var q=vs(),V=f(n(q),2);We(V,5,()=>e(s),H=>H.entity_id,(H,w)=>{var R=cs();let T;var A=n(R),Q=n(A,!0);a(A);var X=f(A,2);let re;var ve=n(X,!0);a(X),a(R),G((be,ie)=>{T=Ee(R,1,"ha-devices__item svelte-1932y27",null,T,be),I(Q,(e(w),p(()=>e(w).friendly_name))),re=Ee(X,1,"ha-devices__state svelte-1932y27",null,re,{"ha-devices__state--on":e(w).state==="on","ha-devices__state--off":e(w).state==="off"}),I(ve,ie)},[()=>({"ha-devices__item--active":z(e(w)),"ha-devices__item--warning":E(e(w))}),()=>(e(w),p(()=>P(e(w))))]),d(H,R)}),a(V),a(q),d(S,q)};B(h,S=>{e(s),p(()=>e(s).length>0)&&S($)})}var g=f(h,2);{var b=S=>{var q=_s(),V=f(n(q),2);We(V,5,()=>e(_),H=>H.entity_id,(H,w)=>{var R=us();let T;var A=n(R),Q=n(A,!0);a(A);var X=f(A,2);let re;var ve=n(X,!0);a(X),a(R),G((be,ie)=>{T=Ee(R,1,"ha-devices__item svelte-1932y27",null,T,be),I(Q,(e(w),p(()=>e(w).friendly_name))),re=Ee(X,1,"ha-devices__state svelte-1932y27",null,re,{"ha-devices__state--on":e(w).state==="on","ha-devices__state--off":e(w).state==="off"}),I(ve,ie)},[()=>({"ha-devices__item--active":z(e(w)),"ha-devices__item--warning":E(e(w))}),()=>(e(w),p(()=>P(e(w))))]),d(H,R)}),a(V),a(q),d(S,q)};B(g,S=>{e(_),p(()=>e(_).length>0)&&S(b)})}var u=f(g,2);{var N=S=>{var q=hs(),V=f(n(q),2);We(V,5,()=>e(i),H=>H.entity_id,(H,w)=>{var R=gs();let T;var A=n(R),Q=n(A,!0);a(A);var X=f(A,2);let re;var ve=n(X,!0);a(X),a(R),G((be,ie,ue)=>{T=Ee(R,1,"ha-devices__item svelte-1932y27",null,T,be),I(Q,(e(w),p(()=>e(w).friendly_name))),re=Ee(X,1,"ha-devices__state svelte-1932y27",null,re,ie),I(ve,ue)},[()=>({"ha-devices__item--active":z(e(w)),"ha-devices__item--warning":E(e(w))}),()=>({"ha-devices__state--locked":e(w).state==="locked","ha-devices__state--warning":E(e(w))}),()=>(e(w),p(()=>P(e(w))))]),d(H,R)}),a(V),a(q),d(S,q)};B(u,S=>{e(i),p(()=>e(i).length>0)&&S(N)})}var U=f(u,2);{var K=S=>{var q=ps(),V=f(n(q),2);We(V,5,()=>e(y),H=>H.entity_id,(H,w)=>{var R=fs(),T=n(R),A=n(T,!0);a(T);var Q=f(T,2),X=n(Q,!0);a(Q),a(R),G(re=>{I(A,(e(w),p(()=>e(w).friendly_name))),I(X,re)},[()=>(e(w),p(()=>j(e(w))))]),d(H,R)}),a(V),a(q),d(S,q)};B(U,S=>{e(y),p(()=>e(y).length>0)&&S(K)})}var Y=f(U,2);{var L=S=>{var q=ws(),V=f(n(q),2);We(V,5,l,H=>H.entity_id,(H,w)=>{var R=ms(),T=n(R),A=n(T,!0);a(T);var Q=f(T,2),X=n(Q);a(Q),a(R),G(()=>{I(A,(e(w),p(()=>e(w).friendly_name))),I(X,`${e(w),p(()=>e(w).state)??""}${e(w),p(()=>e(w).attributes.unit_of_measurement?` ${e(w).attributes.unit_of_measurement}`:"")??""}`)}),d(H,R)}),a(V),a(q),d(S,q)};B(Y,S=>{F(l()),p(()=>l().length>0)&&S(L)})}d(c,v)};B(M,c=>{F(r()),F(l()),p(()=>r().length===0&&l().length===0)?c(W):c(x,!1)})}a(C),d(o,C),ae()}var ks=Ft('<path fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></path>'),Ss=Ft('<svg class="sparkline svelte-8cklv6" preserveAspectRatio="none"><!></svg>');function Xt(o,t){te(t,!1);const s=ye();let _=J(t,"data",24,()=>[]),i=J(t,"width",8,120),y=J(t,"height",8,32),r=J(t,"positive",8,!0);function l(j,C,M){if(j.length<2)return"";const W=Math.min(...j),c=Math.max(...j)-W||1,v=1,h=M-v*2;return j.map(($,g)=>{const b=g/(j.length-1)*C,u=v+h-($-W)/c*h;return`${g===0?"M":"L"}${b.toFixed(1)},${u.toFixed(1)}`}).join(" ")}we(()=>(F(_()),F(i()),F(y())),()=>{k(s,l(_(),i(),y()))}),Xe(),Ge();var P=Ss(),z=n(P);{var E=j=>{var C=ks();G(()=>{de(C,"d",e(s)),de(C,"stroke",r()?"var(--alert-success, hsl(160, 45%, 45%))":"var(--alert-urgent, hsl(0, 60%, 55%))")}),d(j,C)};B(z,j=>{e(s)&&j(E)})}a(P),G(()=>{de(P,"viewBox",`0 0 ${i()??""} ${y()??""}`),de(P,"width",i()),de(P,"height",y())}),d(o,P),ae()}var Ms=m('<div class="crypto-widget__empty svelte-fjg0w2"><span>No crypto data available</span></div>'),Ns=m('<div class="crypto-widget__chart svelte-fjg0w2"><!></div>'),Hs=m('<span><span class="crypto-widget__change-label svelte-fjg0w2"> </span> </span>'),js=m('<div class="crypto-widget__row svelte-fjg0w2"><div class="crypto-widget__info svelte-fjg0w2"><span class="crypto-widget__symbol svelte-fjg0w2"> </span> <span class="crypto-widget__name svelte-fjg0w2"> </span></div> <!> <div class="crypto-widget__values svelte-fjg0w2"><span class="crypto-widget__price svelte-fjg0w2"> </span> <div class="crypto-widget__changes svelte-fjg0w2"></div></div></div>'),Ws=m('<div class="crypto-widget__list svelte-fjg0w2"></div>'),Ds=m('<div class="crypto-widget svelte-fjg0w2"><!></div>');function Cs(o,t){te(t,!1);const s=ye();let _=J(t,"coins",24,()=>[]),i=J(t,"show1h",8,!1),y=J(t,"show24h",8,!0),r=J(t,"show7d",8,!1),l=J(t,"showSparkline",8,!0);function P(v,h){return h==="1h"?v.change_1h:h==="7d"?v.change_7d:v.change_24h}function z(v){const h=v.sparkline??[];return h.length===0?[]:h}function E(v){return v>=1e3?v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):v>=1?v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4}):v.toLocaleString("en-US",{minimumFractionDigits:4,maximumFractionDigits:8})}function j(v){return`${v>=0?"+":""}${v.toFixed(2)}%`}function C(v){return v>0?"crypto-widget__change--positive":v<0?"crypto-widget__change--negative":"crypto-widget__change--neutral"}we(()=>(F(i()),F(y()),F(r())),()=>{k(s,[i()&&{key:"1h",label:"1H"},y()&&{key:"24h",label:"24H"},r()&&{key:"7d",label:"7D"}].filter(Boolean))}),Xe(),Ge();var M=Ds(),W=n(M);{var x=v=>{var h=Ms();d(v,h)},c=v=>{var h=Ws();We(h,5,_,$=>$.id,($,g)=>{const b=me(()=>(e(g),p(()=>z(e(g)))));var u=js(),N=n(u),U=n(N),K=n(U,!0);a(U);var Y=f(U,2),L=n(Y,!0);a(Y),a(N);var S=f(N,2);{var q=T=>{var A=Ns(),Q=n(A);{let X=me(()=>(e(g),p(()=>e(g).change_24h>=0)));Xt(Q,{get data(){return e(b)},width:80,height:28,get positive(){return e(X)}})}a(A),d(T,A)};B(S,T=>{F(l()),F(e(b)),p(()=>l()&&e(b).length>=2)&&T(q)})}var V=f(S,2),H=n(V),w=n(H);a(H);var R=f(H,2);We(R,5,()=>e(s),T=>T.key,(T,A)=>{const Q=me(()=>(e(g),e(A),p(()=>P(e(g),e(A).key))));var X=Hs(),re=n(X),ve=n(re,!0);a(re);var be=f(re);a(X),G((ie,ue)=>{Ee(X,1,`crypto-widget__change ${ie??""}`,"svelte-fjg0w2"),de(X,"title",`${e(A),p(()=>e(A).label)??""} change`),I(ve,(e(A),p(()=>e(A).label))),I(be,` ${ue??""}`)},[()=>(F(e(Q)),p(()=>C(e(Q)))),()=>(F(e(Q)),p(()=>j(e(Q))))]),d(T,X)}),a(R),a(V),a(u),G((T,A)=>{I(K,T),I(L,(e(g),p(()=>e(g).name))),I(w,`$${A??""}`)},[()=>(e(g),p(()=>e(g).symbol.toUpperCase())),()=>(e(g),p(()=>E(e(g).price)))]),d($,u)}),a(h),d(v,h)};B(W,v=>{F(_()),p(()=>_().length===0)?v(x):v(c,!1)})}a(M),d(o,M),ae()}function Jt(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["circle",{cx:"12",cy:"12",r:"4"}],["path",{d:"M12 2v2"}],["path",{d:"M12 20v2"}],["path",{d:"m4.93 4.93 1.41 1.41"}],["path",{d:"m17.66 17.66 1.41 1.41"}],["path",{d:"M2 12h2"}],["path",{d:"M20 12h2"}],["path",{d:"m6.34 17.66-1.41 1.41"}],["path",{d:"m19.07 4.93-1.41 1.41"}]];Me(o,Ne({name:"sun"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Ps(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["circle",{cx:"12",cy:"12",r:"4"}],["path",{d:"M12 4h.01"}],["path",{d:"M20 12h.01"}],["path",{d:"M12 20h.01"}],["path",{d:"M4 12h.01"}],["path",{d:"M17.657 6.343h.01"}],["path",{d:"M17.657 17.657h.01"}],["path",{d:"M6.343 17.657h.01"}],["path",{d:"M6.343 6.343h.01"}]];Me(o,Ne({name:"sun-dim"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Ts(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M12 2v2"}],["path",{d:"m4.93 4.93 1.41 1.41"}],["path",{d:"M20 12h2"}],["path",{d:"m19.07 4.93-1.41 1.41"}],["path",{d:"M15.947 12.65a4 4 0 0 0-5.925-4.128"}],["path",{d:"M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"}]];Me(o,Ne({name:"cloud-sun"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function zs(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"}]];Me(o,Ne({name:"cloud"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Is(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M17.5 12a1 1 0 1 1 0 9H9.006a7 7 0 1 1 6.702-9z"}],["path",{d:"M21.832 9A3 3 0 0 0 19 7h-2.207a5.5 5.5 0 0 0-10.72.61"}]];Me(o,Ne({name:"cloudy"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Ls(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"}],["path",{d:"M16 17H7"}],["path",{d:"M17 21H9"}]];Me(o,Ne({name:"cloud-fog"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function $s(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"m5.2 6.2 1.4 1.4"}],["path",{d:"M2 13h2"}],["path",{d:"M20 13h2"}],["path",{d:"m17.4 7.6 1.4-1.4"}],["path",{d:"M22 17H2"}],["path",{d:"M22 21H2"}],["path",{d:"M16 13a4 4 0 0 0-8 0"}],["path",{d:"M12 5V2.5"}]];Me(o,Ne({name:"haze"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function qs(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"}],["path",{d:"M8 19v1"}],["path",{d:"M8 14v1"}],["path",{d:"M16 19v1"}],["path",{d:"M16 14v1"}],["path",{d:"M12 21v1"}],["path",{d:"M12 16v1"}]];Me(o,Ne({name:"cloud-drizzle"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Es(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"}],["path",{d:"M16 14v6"}],["path",{d:"M8 14v6"}],["path",{d:"M12 16v6"}]];Me(o,Ne({name:"cloud-rain"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function As(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M12 2v2"}],["path",{d:"m4.93 4.93 1.41 1.41"}],["path",{d:"M20 12h2"}],["path",{d:"m19.07 4.93-1.41 1.41"}],["path",{d:"M15.947 12.65a4 4 0 0 0-5.925-4.128"}],["path",{d:"M3 20a5 5 0 1 1 8.9-4H13a3 3 0 0 1 2 5.24"}],["path",{d:"M11 20v2"}],["path",{d:"M7 19v2"}]];Me(o,Ne({name:"cloud-sun-rain"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Us(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"}],["path",{d:"M16 14v2"}],["path",{d:"M8 14v2"}],["path",{d:"M16 20h.01"}],["path",{d:"M8 20h.01"}],["path",{d:"M12 16v2"}],["path",{d:"M12 22h.01"}]];Me(o,Ne({name:"cloud-hail"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Rs(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"}],["path",{d:"M8 15h.01"}],["path",{d:"M8 19h.01"}],["path",{d:"M12 17h.01"}],["path",{d:"M12 21h.01"}],["path",{d:"M16 15h.01"}],["path",{d:"M16 19h.01"}]];Me(o,Ne({name:"cloud-snow"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Fs(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"m10 20-1.25-2.5L6 18"}],["path",{d:"M10 4 8.75 6.5 6 6"}],["path",{d:"m14 20 1.25-2.5L18 18"}],["path",{d:"m14 4 1.25 2.5L18 6"}],["path",{d:"m17 21-3-6h-4"}],["path",{d:"m17 3-3 6 1.5 3"}],["path",{d:"M2 12h6.5L10 9"}],["path",{d:"m20 10-1.5 2 1.5 2"}],["path",{d:"M22 12h-6.5L14 15"}],["path",{d:"m4 10 1.5 2L4 14"}],["path",{d:"m7 21 3-6-1.5-3"}],["path",{d:"m7 3 3 6h4"}]];Me(o,Ne({name:"snowflake"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Gs(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"}],["path",{d:"m13 12-3 5h4l-3 5"}]];Me(o,Ne({name:"cloud-lightning"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Os(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"}]];Me(o,Ne({name:"thermometer"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}var Bs=m('<span class="weather-icon svelte-1i78a4g" aria-hidden="true"><!></span>');function Dt(o,t){let s=J(t,"size",3,24);function _(u){const N=u.toLowerCase();return N.includes("thunderstorm")?"cloud-lightning":N.includes("freezing rain")||N.includes("freezing drizzle")?"cloud-hail":N.includes("snow shower")?"cloud-snow":N.includes("snow")||N.includes("snow grains")?"snowflake":N.includes("rain shower")?"cloud-sun-rain":N.includes("rain")||N.includes("drizzle")?"cloud-rain":N.includes("drizzle")?"cloud-drizzle":N.includes("fog")||N.includes("mist")?"cloud-fog":N.includes("haze")?"haze":N.includes("overcast")||N.includes("broken clouds")?"cloudy":N.includes("partly cloudy")||N.includes("scattered clouds")||N.includes("few clouds")?"cloud-sun":N.includes("mostly clear")?"sun-dim":N.includes("clear")?"sun":"thermometer"}let i=ge(()=>_(t.conditions));var y=Bs(),r=n(y);{var l=u=>{Jt(u,{get size(){return s()}})},P=u=>{Ps(u,{get size(){return s()}})},z=u=>{Ts(u,{get size(){return s()}})},E=u=>{zs(u,{get size(){return s()}})},j=u=>{Is(u,{get size(){return s()}})},C=u=>{Ls(u,{get size(){return s()}})},M=u=>{$s(u,{get size(){return s()}})},W=u=>{qs(u,{get size(){return s()}})},x=u=>{Es(u,{get size(){return s()}})},c=u=>{As(u,{get size(){return s()}})},v=u=>{Us(u,{get size(){return s()}})},h=u=>{Rs(u,{get size(){return s()}})},$=u=>{Fs(u,{get size(){return s()}})},g=u=>{Gs(u,{get size(){return s()}})},b=u=>{Os(u,{get size(){return s()}})};B(r,u=>{e(i)==="sun"?u(l):e(i)==="sun-dim"?u(P,1):e(i)==="cloud-sun"?u(z,2):e(i)==="cloud"?u(E,3):e(i)==="cloudy"?u(j,4):e(i)==="cloud-fog"?u(C,5):e(i)==="haze"?u(M,6):e(i)==="cloud-drizzle"?u(W,7):e(i)==="cloud-rain"?u(x,8):e(i)==="cloud-sun-rain"?u(c,9):e(i)==="cloud-hail"?u(v,10):e(i)==="cloud-snow"?u(h,11):e(i)==="snowflake"?u($,12):e(i)==="cloud-lightning"?u(g,13):u(b,!1)})}a(y),d(o,y)}var Ys=m('<div class="weather-widget__empty svelte-1l2lobr"><span>No weather data available</span></div>'),Vs=m('<div class="weather-widget__compact-row svelte-1l2lobr"><span class="weather-widget__compact-icon svelte-1l2lobr"><!></span> <span class="weather-widget__compact-temp svelte-1l2lobr"> </span> <span class="weather-widget__compact-conditions svelte-1l2lobr"> </span></div>'),Ks=m("<span> </span>"),Zs=m('<div class="weather-widget__forecast-row svelte-1l2lobr"><span class="weather-widget__forecast-day svelte-1l2lobr"> </span> <span class="weather-widget__forecast-icon svelte-1l2lobr"><!></span> <span class="weather-widget__forecast-conditions svelte-1l2lobr"> </span> <!> <span class="weather-widget__forecast-temps svelte-1l2lobr"><span class="weather-widget__forecast-high svelte-1l2lobr"> </span> <span class="weather-widget__forecast-sep svelte-1l2lobr">/</span> <span class="weather-widget__forecast-low svelte-1l2lobr"> </span></span></div>'),Xs=m('<div class="weather-widget__forecast svelte-1l2lobr"></div>'),Js=m('<div class="weather-widget__current svelte-1l2lobr"><div class="weather-widget__hero svelte-1l2lobr"><span class="weather-widget__icon svelte-1l2lobr"><!></span> <span class="weather-widget__temp svelte-1l2lobr"> </span> <div class="weather-widget__conditions-block svelte-1l2lobr"><span class="weather-widget__conditions svelte-1l2lobr"> </span> <span class="weather-widget__feels-like svelte-1l2lobr"> </span></div></div> <div class="weather-widget__details svelte-1l2lobr"><span class="weather-widget__detail svelte-1l2lobr"><span class="weather-widget__detail-label svelte-1l2lobr">Humidity</span> <span class="weather-widget__detail-value svelte-1l2lobr"> </span></span></div></div> <!>',1),Qs=m("<div><!></div>");function en(o,t){te(t,!1);let s=J(t,"current",8,null),_=J(t,"forecast",24,()=>[]),i=J(t,"compact",8,!1);function y(M){return`${Math.round(M)}°`}function r(M){return new Date(M+"T00:00:00").toLocaleDateString("en-US",{weekday:"short"})}Ge();var l=Qs();let P;var z=n(l);{var E=M=>{var W=Ys();d(M,W)},j=M=>{var W=Vs(),x=n(W),c=n(x);Dt(c,{get conditions(){return F(s()),p(()=>s().conditions)},size:32}),a(x);var v=f(x,2),h=n(v,!0);a(v);var $=f(v,2),g=n($,!0);a($),a(W),G(b=>{I(h,b),I(g,(F(s()),p(()=>s().conditions)))},[()=>(F(s()),p(()=>y(s().temp)))]),d(M,W)},C=M=>{var W=Js(),x=le(W),c=n(x),v=n(c),h=n(v);Dt(h,{get conditions(){return F(s()),p(()=>s().conditions)},size:40}),a(v);var $=f(v,2),g=n($,!0);a($);var b=f($,2),u=n(b),N=n(u,!0);a(u);var U=f(u,2),K=n(U);a(U),a(b),a(c);var Y=f(c,2),L=n(Y),S=f(n(L),2),q=n(S);a(S),a(L),a(Y),a(x);var V=f(x,2);{var H=w=>{var R=Xs();We(R,5,()=>(F(_()),p(()=>_().slice(0,5))),T=>T.date,(T,A)=>{var Q=Zs(),X=n(Q),re=n(X,!0);a(X);var ve=f(X,2),be=n(ve);Dt(be,{get conditions(){return e(A),p(()=>e(A).conditions)},size:16}),a(ve);var ie=f(ve,2),ue=n(ie,!0);a(ie);var Te=f(ie,2);{var oe=_e=>{var fe=Ks();let ze;var Ae=n(fe);a(fe),G(()=>{ze=Ee(fe,1,"weather-widget__forecast-rain svelte-1l2lobr",null,ze,{"weather-widget__forecast-rain--high":e(A).precipChance>=50}),I(Ae,`${e(A),p(()=>e(A).precipChance)??""}%`)}),d(_e,fe)};B(Te,_e=>{e(A),p(()=>e(A).precipChance!=null)&&_e(oe)})}var Ie=f(Te,2),Re=n(Ie),Oe=n(Re,!0);a(Re);var he=f(Re,4),ee=n(he,!0);a(he),a(Ie),a(Q),G((_e,fe,ze)=>{I(re,_e),I(ue,(e(A),p(()=>e(A).conditions))),I(Oe,fe),I(ee,ze)},[()=>(e(A),p(()=>r(e(A).date))),()=>(e(A),p(()=>y(e(A).high))),()=>(e(A),p(()=>y(e(A).low)))]),d(T,Q)}),a(R),d(w,R)};B(V,w=>{F(_()),p(()=>_().length>0)&&w(H)})}G((w,R)=>{I(g,w),I(N,(F(s()),p(()=>s().conditions))),I(K,`Feels like ${R??""}`),I(q,`${F(s()),p(()=>s().humidity)??""}%`)},[()=>(F(s()),p(()=>y(s().temp))),()=>(F(s()),p(()=>y(s().feelsLike)))]),d(M,W)};B(z,M=>{s()?i()?M(j,1):M(C,!1):M(E)})}a(l),G(()=>P=Ee(l,1,"weather-widget svelte-1l2lobr",null,P,{"weather-widget--compact":i()})),d(o,l),ae()}var tn=m('<div class="calendar-widget__empty svelte-c2xea9"><span>No calendar events</span></div>'),an=m('<span class="calendar-widget__compact-time calendar-widget__compact-time--allday svelte-c2xea9">All Day</span>'),sn=m('<span class="calendar-widget__compact-time svelte-c2xea9"> </span>'),nn=m('<li class="calendar-widget__compact-item svelte-c2xea9"><!> <span class="calendar-widget__compact-title svelte-c2xea9"> </span></li>'),rn=m('<ul class="calendar-widget__compact-list svelte-c2xea9"></ul>'),ln=m('<span class="calendar-widget__allday-badge svelte-c2xea9">All Day</span>'),on=m('<span class="calendar-widget__event-location svelte-c2xea9"> </span>'),dn=m('<span class="calendar-widget__event-dot svelte-c2xea9"></span>'),cn=m('<li><div class="calendar-widget__event-time svelte-c2xea9"><!></div> <div class="calendar-widget__event-body svelte-c2xea9"><span class="calendar-widget__event-title svelte-c2xea9"> </span> <!></div> <!></li>'),vn=m('<div class="calendar-widget__day"><div class="calendar-widget__day-header svelte-c2xea9"> </div> <ul class="calendar-widget__event-list svelte-c2xea9"></ul></div>'),un=m('<div class="calendar-widget__groups svelte-c2xea9"></div>'),_n=m("<div><!></div>");function gn(o,t){te(t,!1);const s=ye(),_=ye();let i=J(t,"events",24,()=>[]),y=J(t,"compact",8,!1);function r(h){const $=new Date(h),g=$.getHours(),b=$.getMinutes().toString().padStart(2,"0"),u=g>=12?"PM":"AM";return`${g%12||12}:${b} ${u}`}function l(){const h=new Date;return`${h.getFullYear()}-${String(h.getMonth()+1).padStart(2,"0")}-${String(h.getDate()).padStart(2,"0")}`}function P(h){return h.allDay?h.end.slice(0,10)>l():new Date(h.end).getTime()>=Date.now()}function z(h){const $=h.slice(0,10),g=l(),b=new Date;b.setDate(b.getDate()+1);const u=`${b.getFullYear()}-${String(b.getMonth()+1).padStart(2,"0")}-${String(b.getDate()).padStart(2,"0")}`;if($===g)return"Today";if($===u)return"Tomorrow";const[N,U,K]=$.split("-").map(Number);return new Date(N,U-1,K).toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"})}function E(h,$){return h.filter(P).sort((g,b)=>new Date(g.start).getTime()-new Date(b.start).getTime()).slice(0,$)}function j(h){const $=h.filter(P).sort((b,u)=>new Date(b.start).getTime()-new Date(u.start).getTime()),g=new Map;for(const b of $){const u=z(b.start);g.has(u)||g.set(u,[]),g.get(u).push(b)}return Array.from(g.entries()).map(([b,u])=>({label:b,events:u}))}we(()=>F(i()),()=>{k(s,E(i(),5))}),we(()=>F(i()),()=>{k(_,j(i()))}),Xe(),Ge();var C=_n();let M;var W=n(C);{var x=h=>{var $=tn();d(h,$)},c=h=>{var $=rn();We($,5,()=>e(s),g=>g.id,(g,b)=>{var u=nn(),N=n(u);{var U=S=>{var q=an();d(S,q)},K=S=>{var q=sn(),V=n(q,!0);a(q),G(H=>I(V,H),[()=>(e(b),p(()=>r(e(b).start)))]),d(S,q)};B(N,S=>{e(b),p(()=>e(b).allDay)?S(U):S(K,!1)})}var Y=f(N,2),L=n(Y,!0);a(Y),a(u),G(()=>I(L,(e(b),p(()=>e(b).title)))),d(g,u)}),a($),d(h,$)},v=h=>{var $=un();We($,5,()=>e(_),g=>g.label,(g,b)=>{var u=vn(),N=n(u),U=n(N,!0);a(N);var K=f(N,2);We(K,5,()=>(e(b),p(()=>e(b).events)),Y=>Y.id,(Y,L)=>{var S=cn();let q;var V=n(S),H=n(V);{var w=ie=>{var ue=ln();d(ie,ue)},R=ie=>{var ue=ra();G(Te=>I(ue,Te),[()=>(e(L),p(()=>r(e(L).start)))]),d(ie,ue)};B(H,ie=>{e(L),p(()=>e(L).allDay)?ie(w):ie(R,!1)})}a(V);var T=f(V,2),A=n(T),Q=n(A,!0);a(A);var X=f(A,2);{var re=ie=>{var ue=on(),Te=n(ue,!0);a(ue),G(()=>I(Te,(e(L),p(()=>e(L).location)))),d(ie,ue)};B(X,ie=>{e(L),p(()=>e(L).location)&&ie(re)})}a(T);var ve=f(T,2);{var be=ie=>{var ue=dn();G(()=>ot(ue,`background:${e(L),p(()=>e(L).color)??""}`)),d(ie,ue)};B(ve,ie=>{e(L),p(()=>e(L).color)&&ie(be)})}a(S),G(()=>{q=Ee(S,1,"calendar-widget__event svelte-c2xea9",null,q,{"calendar-widget__event--allday":e(L).allDay}),I(Q,(e(L),p(()=>e(L).title)))}),d(Y,S)}),a(K),a(u),G(()=>I(U,(e(b),p(()=>e(b).label)))),d(g,u)}),a($),d(h,$)};B(W,h=>{F(i()),p(()=>i().length===0)?h(x):y()?h(c,1):h(v,!1)})}a(C),G(()=>M=Ee(C,1,"calendar-widget svelte-c2xea9",null,M,{"calendar-widget--compact":y()})),d(o,C),ae()}var hn=m('<div class="allergies-widget__location svelte-fd4qfr"> </div>'),fn=m('<span class="allergies-widget__trigger-chip svelte-fd4qfr"> </span>'),pn=m('<div class="allergies-widget__triggers svelte-fd4qfr"></div>'),mn=m('<div class="allergies-widget__period svelte-fd4qfr"><span class="allergies-widget__period-label svelte-fd4qfr"> </span> <span class="allergies-widget__period-index svelte-fd4qfr"> </span></div>'),wn=m('<div class="allergies-widget__forecast svelte-fd4qfr"></div>'),yn=m('<div class="allergies-widget__empty svelte-fd4qfr">No pollen data available</div>'),bn=m('<div class="allergies-widget svelte-fd4qfr"><div class="allergies-widget__header svelte-fd4qfr"><span class="allergies-widget__title svelte-fd4qfr">Pollen</span> <span class="allergies-widget__label svelte-fd4qfr"> </span></div> <!> <div class="allergies-widget__index-row svelte-fd4qfr"><span class="allergies-widget__index svelte-fd4qfr"> </span> <span class="allergies-widget__scale svelte-fd4qfr">/12</span></div> <div class="allergies-widget__gauge svelte-fd4qfr"><div class="allergies-widget__bar svelte-fd4qfr"></div></div> <!> <!></div>');function xn(o,t){te(t,!1);const s=ye(),_=ye();let i=J(t,"index",8,0),y=J(t,"level",8,"Low"),r=J(t,"color",8,"#4caf50"),l=J(t,"location",8,""),P=J(t,"triggers",24,()=>[]),z=J(t,"periods",24,()=>[]);function E(L){return L<=2.4?"#4caf50":L<=4.8?"#8bc34a":L<=7.2?"#ffeb3b":L<=9.6?"#ff9800":"#f44336"}we(()=>F(P()),()=>{k(s,P().reduce((L,S)=>{const q=S.plantType||"Other";return L[q]||(L[q]=[]),L[q].push(S.name),L},{}))}),we(()=>F(i()),()=>{k(_,`${Math.min(100,i()/12*100)}%`)}),Xe(),Ge();var j=bn(),C=n(j),M=f(n(C),2),W=n(M,!0);a(M),a(C);var x=f(C,2);{var c=L=>{var S=hn(),q=n(S,!0);a(S),G(()=>I(q,l())),d(L,S)};B(x,L=>{l()&&L(c)})}var v=f(x,2),h=n(v),$=n(h,!0);a(h),ft(2),a(v);var g=f(v,2),b=n(g);a(g);var u=f(g,2);{var N=L=>{var S=pn();We(S,5,()=>(e(s),p(()=>Object.entries(e(s)))),([q,V])=>q,(q,V)=>{var H=ge(()=>ia(e(V),2));let w=()=>e(H)[0],R=()=>e(H)[1];var T=fn(),A=n(T);a(T),G(Q=>I(A,`${w()??""}: ${Q??""}`),[()=>(R(),p(()=>R().join(", ")))]),d(q,T)}),a(S),d(L,S)};B(u,L=>{F(P()),p(()=>P().length>0)&&L(N)})}var U=f(u,2);{var K=L=>{var S=wn();We(S,5,z,q=>q.type,(q,V)=>{var H=mn(),w=n(H),R=n(w,!0);a(w);var T=f(w,2),A=n(T,!0);a(T),a(H),G((Q,X)=>{I(R,(e(V),p(()=>e(V).type))),ot(T,`color: ${Q??""}`),I(A,X)},[()=>(e(V),p(()=>E(e(V).index))),()=>(e(V),p(()=>e(V).index.toFixed(1)))]),d(q,H)}),a(S),d(L,S)},Y=L=>{var S=yn();d(L,S)};B(U,L=>{F(z()),p(()=>z().length>0)?L(K):L(Y,!1)})}a(j),G(L=>{ot(M,`color: ${r()??""}`),I(W,y()),ot(h,`color: ${r()??""}`),I($,L),ot(b,`width: ${e(_)??""}; background: ${r()??""};`)},[()=>(F(i()),p(()=>i().toFixed(1)))]),d(o,j),ae()}var kn=m('<div class="ai-news__empty svelte-6g2jpi"><span>No AI summaries available</span></div>'),Sn=m('<li class="ai-news__item svelte-6g2jpi"><div class="ai-news__meta svelte-6g2jpi"><span class="ai-news__category svelte-6g2jpi"> </span> <span class="ai-news__source svelte-6g2jpi"> </span> <span class="ai-news__age svelte-6g2jpi"> </span></div> <p class="ai-news__title svelte-6g2jpi"> </p> <p class="ai-news__summary svelte-6g2jpi"> </p></li>'),Mn=m('<div class="ai-news__pager svelte-6g2jpi"><button class="ai-news__pager-btn svelte-6g2jpi" aria-label="Previous page">&lsaquo;</button> <span class="ai-news__pager-info svelte-6g2jpi"> </span> <button class="ai-news__pager-btn svelte-6g2jpi" aria-label="Next page">&rsaquo;</button></div>'),Nn=m('<ul class="ai-news__list svelte-6g2jpi"></ul> <!>',1),Hn=m('<div class="ai-news svelte-6g2jpi"><!></div>');function jn(o,t){te(t,!1);const s=ye(),_=ye();let i=J(t,"summaries",24,()=>[]),y=J(t,"pageSize",8,5),r=J(t,"rotateSeconds",8,30),l=ye(0),P=ye();function z(){k(l,(e(l)+1)%e(s))}function E(){k(l,(e(l)-1+e(s))%e(s))}function j(c){const v=Math.max(0,Date.now()-c),h=Math.floor(v/6e4);if(h<60)return`${h}m ago`;const $=Math.floor(h/60);return $<24?`${$}h ago`:`${Math.floor($/24)}d ago`}we(()=>(F(i()),F(y())),()=>{k(s,Math.max(1,Math.ceil(i().length/y())))}),we(()=>F(i()),()=>{i()&&k(l,0)}),we(()=>(F(i()),e(l),F(y())),()=>{k(_,i().slice(e(l)*y(),(e(l)+1)*y()))}),we(()=>(e(P),F(r()),e(s)),()=>{e(P)!==void 0&&clearInterval(e(P)),k(P,void 0),r()>0&&e(s)>1&&k(P,setInterval(z,r()*1e3))}),Xe(),Ge();var C=Hn(),M=n(C);{var W=c=>{var v=kn();d(c,v)},x=c=>{var v=Nn(),h=le(v);We(h,5,()=>e(_),b=>b.id,(b,u)=>{var N=Sn(),U=n(N),K=n(U),Y=n(K,!0);a(K);var L=f(K,2),S=n(L,!0);a(L);var q=f(L,2),V=n(q,!0);a(q),a(U);var H=f(U,2),w=n(H,!0);a(H);var R=f(H,2),T=n(R,!0);a(R),a(N),G(A=>{I(Y,(e(u),p(()=>e(u).category))),I(S,(e(u),p(()=>e(u).source))),I(V,A),I(w,(e(u),p(()=>e(u).title))),I(T,(e(u),p(()=>e(u).summary)))},[()=>(e(u),p(()=>j(e(u).published)))]),d(b,N)}),a(h);var $=f(h,2);{var g=b=>{var u=Mn(),N=n(u),U=f(N,2),K=n(U);a(U);var Y=f(U,2);a(u),G(()=>I(K,`${e(l)+1} / ${e(s)??""}`)),nt("click",N,E),nt("click",Y,z),d(b,u)};B($,b=>{e(s)>1&&b(g)})}d(c,v)};B(M,c=>{F(i()),p(()=>i().length===0)?c(W):c(x,!1)})}a(C),d(o,C),ae()}var Wn=m('<div class="wotd__empty svelte-1w1ki2k"><span>No word available</span></div>'),Dn=m('<span class="wotd__pos svelte-1w1ki2k"> </span>'),Cn=m('<div class="wotd__word svelte-1w1ki2k"> </div> <!> <p class="wotd__definition svelte-1w1ki2k"> </p>',1),Pn=m('<div class="wotd svelte-1w1ki2k"><!></div>');function Tn(o,t){te(t,!1);let s=J(t,"data",8,null);Ge();var _=Pn(),i=n(_);{var y=l=>{var P=Wn();d(l,P)},r=l=>{var P=Cn(),z=le(P),E=n(z,!0);a(z);var j=f(z,2);{var C=x=>{var c=Dn(),v=n(c,!0);a(c),G(()=>I(v,(F(s()),p(()=>s().partOfSpeech)))),d(x,c)};B(j,x=>{F(s()),p(()=>s().partOfSpeech)&&x(C)})}var M=f(j,2),W=n(M,!0);a(M),G(()=>{I(E,(F(s()),p(()=>s().word))),I(W,(F(s()),p(()=>s().definition)))}),d(l,P)};B(i,l=>{s()?l(r,!1):l(y)})}a(_),d(o,_),ae()}var zn=m('<div class="finance-widget__empty svelte-wbjoj9"><span>No stock data available</span></div>'),In=m('<div class="finance-widget__chart svelte-wbjoj9"><!></div>'),Ln=m('<span><span class="finance-widget__change-label svelte-wbjoj9"> </span> </span>'),$n=m('<div class="finance-widget__row svelte-wbjoj9"><div class="finance-widget__info svelte-wbjoj9"><span class="finance-widget__symbol svelte-wbjoj9"> </span> <span class="finance-widget__name svelte-wbjoj9"> </span></div> <!> <div class="finance-widget__values svelte-wbjoj9"><span class="finance-widget__price svelte-wbjoj9"> </span> <div class="finance-widget__changes svelte-wbjoj9"></div></div></div>'),qn=m('<div class="finance-widget__list svelte-wbjoj9"></div>'),En=m('<div class="finance-widget svelte-wbjoj9"><!></div>');function An(o,t){te(t,!1);const s=ye();let _=J(t,"stocks",24,()=>[]),i=J(t,"show1h",8,!1),y=J(t,"show24h",8,!0),r=J(t,"show7d",8,!1),l=J(t,"showSparkline",8,!0);function P(v,h){return h==="1h"?v.change_1h:h==="7d"?v.change_7d:v.change_24h}function z(v){return v.sparkline.length>0?v.sparkline:[]}function E(v){return v>=1e3?v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):v>=1?v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4}):v.toLocaleString("en-US",{minimumFractionDigits:4,maximumFractionDigits:8})}function j(v){return`${v>=0?"+":""}${v.toFixed(2)}%`}function C(v){return v>0?"finance-widget__change--positive":v<0?"finance-widget__change--negative":"finance-widget__change--neutral"}we(()=>(F(i()),F(y()),F(r())),()=>{k(s,[i()&&{key:"1h",label:"1H"},y()&&{key:"24h",label:"24H"},r()&&{key:"7d",label:"7D"}].filter(Boolean))}),Xe(),Ge();var M=En(),W=n(M);{var x=v=>{var h=zn();d(v,h)},c=v=>{var h=qn();We(h,5,_,$=>$.symbol,($,g)=>{const b=me(()=>(e(g),p(()=>z(e(g)))));var u=$n(),N=n(u),U=n(N),K=n(U,!0);a(U);var Y=f(U,2),L=n(Y,!0);a(Y),a(N);var S=f(N,2);{var q=T=>{var A=In(),Q=n(A);{let X=me(()=>(e(g),p(()=>e(g).change_24h>=0)));Xt(Q,{get data(){return e(b)},width:80,height:28,get positive(){return e(X)}})}a(A),d(T,A)};B(S,T=>{F(l()),F(e(b)),p(()=>l()&&e(b).length>=2)&&T(q)})}var V=f(S,2),H=n(V),w=n(H);a(H);var R=f(H,2);We(R,5,()=>e(s),T=>T.key,(T,A)=>{const Q=me(()=>(e(g),e(A),p(()=>P(e(g),e(A).key))));var X=Ln(),re=n(X),ve=n(re,!0);a(re);var be=f(re);a(X),G((ie,ue)=>{Ee(X,1,`finance-widget__change ${ie??""}`,"svelte-wbjoj9"),de(X,"title",`${e(A),p(()=>e(A).label)??""} change`),I(ve,(e(A),p(()=>e(A).label))),I(be,` ${ue??""}`)},[()=>(F(e(Q)),p(()=>C(e(Q)))),()=>(F(e(Q)),p(()=>j(e(Q))))]),d(T,X)}),a(R),a(V),a(u),G(T=>{I(K,(e(g),p(()=>e(g).symbol))),I(L,(e(g),p(()=>e(g).name))),I(w,`$${T??""}`)},[()=>(e(g),p(()=>E(e(g).price)))]),d($,u)}),a(h),d(v,h)};B(W,v=>{F(_()),p(()=>_().length===0)?v(x):v(c,!1)})}a(M),d(o,M),ae()}var Un=m('<div data-testid="shadow-widget"></div>');function Rn(o,t){te(t,!1);let s=J(t,"html",8),_=J(t,"css",8),i=J(t,"data",8,null),y=ye();we(()=>(e(y),F(s()),F(i()),F(_())),()=>{if(e(y)){e(y).shadowRoot||e(y).attachShadow({mode:"open"});const l=ca(s(),i());la(y,e(y).shadowRoot.innerHTML="<style>"+_()+"</style>"+l)}}),Xe(),Ge();var r=Un();It(r,l=>k(y,l),()=>e(y)),d(o,r),ae()}const $t=pa(new Map);$t.subscribe;function At(o){$t.update(t=>{const s=new Map(t);return s.set(o.plugin_id,o),s})}const Ut=new Map;function Ve(o){let t=Ut.get(o);return t||(t=ma($t,s=>{var _;return((_=s.get(o))==null?void 0:_.data)??null}),Ut.set(o,t)),t}var Fn=m("<div>Loading template...</div>"),Gn=m("<div>Failed to load template</div>"),On=m("<!> <!>",1);function Bn(o,t){te(t,!0);const s=()=>Ye(E,"$dataStore",_),[_,i]=Bt();let y=xe(""),r=xe(""),l=xe(!0),P=xe(!1);const z=t.pluginId,E=Ve(z);Ze(()=>{(async()=>{const c=await fetch(`/plugins/${t.pluginId}/template`);if(!c.ok){k(P,!0),k(l,!1);return}const v=await c.json();k(y,v.html,!0),k(r,v.css,!0),k(l,!1)})()});var j=On(),C=le(j);{var M=c=>{var v=Fn();d(c,v)},W=c=>{var v=Gn();d(c,v)};B(C,c=>{e(l)?c(M):e(P)&&c(W,1)})}var x=f(C,2);Rn(x,{get html(){return e(y)},get css(){return e(r)},get data(){return s()}}),d(o,j),ae(),i()}var Yn=m('<div class="not-configured overlay svelte-1s2yccz" role="status" aria-label="Integration not configured"><div class="not-configured__icon svelte-1s2yccz" aria-hidden="true">⚙</div> <p class="not-configured__title svelte-1s2yccz">Not Configured</p> <p class="not-configured__desc svelte-1s2yccz">This widget needs integration credentials.</p> <button class="not-configured__link svelte-1s2yccz">Go to Settings</button></div>'),Vn=m('<div class="plugin-renderer-wrap svelte-1s2yccz"><!></div>');function Kn(o,t){te(t,!1);const s=()=>Ye(H,"$newsStore",M),_=()=>Ye(w,"$sportsStore",M),i=()=>Ye(R,"$haStore",M),y=()=>Ye(T,"$cryptoStore",M),r=()=>Ye(A,"$weatherStore",M),l=()=>Ye(Q,"$calendarStore",M),P=()=>Ye(X,"$photoStore",M),z=()=>Ye(re,"$allergiesStore",M),E=()=>Ye(ve,"$aiNewsStore",M),j=()=>Ye(be,"$wotdStore",M),C=()=>Ye(ie,"$financeStore",M),[M,W]=Bt(),x=ye(),c=ye(),v=ye(),h=ye(),$=ye(),g=ye(),b=ye(),u=ye(),N=ye(),U=ye(),K=ye(),Y=ye(),L=ye();let S=J(t,"plugin",8);function q(ne,je){return ne===!0||ne==="true"?!0:ne===!1||ne==="false"?!1:je}function V(){return Yt(`${Vt}/admin`)}const H=Ve("news-server"),w=Ve("sports-server"),R=Ve("home-assistant-server"),T=Ve("crypto-server"),A=Ve("weather-server"),Q=Ve("calendar-server"),X=Ve("photo-slideshow-server"),re=Ve("allergies-server"),ve=Ve("ai-news-server"),be=Ve("word-of-day-server"),ie=Ve("finance-server");we(()=>F(S()),()=>{k(x,S().plugin_id)}),we(()=>F(S()),()=>{k(c,S().integration_status)}),we(()=>s(),()=>{k(v,s())}),we(()=>_(),()=>{k(h,_())}),we(()=>i(),()=>{k($,i())}),we(()=>y(),()=>{k(g,y())}),we(()=>r(),()=>{k(b,r())}),we(()=>l(),()=>{k(u,l())}),we(()=>P(),()=>{k(N,P())}),we(()=>z(),()=>{k(U,z())}),we(()=>E(),()=>{k(K,E())}),we(()=>j(),()=>{k(Y,j())}),we(()=>C(),()=>{k(L,C())}),Xe(),Ge();var ue=Vn(),Te=n(ue);{var oe=ne=>{var je=Yn(),De=f(n(je),6);a(je),se("click",De,V),d(ne,je)},Ie=ne=>{{let je=me(()=>(e(N),p(()=>{var Pe;return((Pe=e(N))==null?void 0:Pe.photoPaths)??[]}))),De=me(()=>(F(S()),p(()=>(Number(S().config.cycleSeconds)||30)*1e3)));Fa(ne,{get photoPaths(){return e(je)},get cycleInterval(){return e(De)}})}},Re=ne=>{{let je=me(()=>(e(v),p(()=>{var De;return((De=e(v))==null?void 0:De.articles)??[]})));Xa(ne,{get headlines(){return e(je)}})}},Oe=ne=>{{let je=me(()=>(e(h),p(()=>{var De;return((De=e(h))==null?void 0:De.games)??[]})));os(ne,{get games(){return e(je)}})}},he=ne=>{{let je=me(()=>(e($),p(()=>{var Pe;return((Pe=e($))==null?void 0:Pe.devices)??[]}))),De=me(()=>(e($),p(()=>{var Pe;return((Pe=e($))==null?void 0:Pe.sensors)??[]})));xs(ne,{get devices(){return e(je)},get sensors(){return e(De)}})}},ee=ne=>{{let je=me(()=>(e(g),p(()=>{var Qe;return((Qe=e(g))==null?void 0:Qe.coins)??[]}))),De=me(()=>(F(S()),p(()=>q(S().config.show1h,!1)))),Pe=me(()=>(F(S()),p(()=>q(S().config.show24h,!0)))),Je=me(()=>(F(S()),p(()=>q(S().config.show7d,!1)))),rt=me(()=>(F(S()),p(()=>q(S().config.showSparkline,!0))));Cs(ne,{get coins(){return e(je)},get show1h(){return e(De)},get show24h(){return e(Pe)},get show7d(){return e(Je)},get showSparkline(){return e(rt)}})}},_e=ne=>{{let je=me(()=>(e(b),p(()=>{var Pe;return((Pe=e(b))==null?void 0:Pe.current)??null}))),De=me(()=>(e(b),p(()=>{var Pe;return((Pe=e(b))==null?void 0:Pe.forecast)??[]})));en(ne,{get current(){return e(je)},get forecast(){return e(De)}})}},fe=ne=>{{let je=me(()=>(e(u),p(()=>{var De;return((De=e(u))==null?void 0:De.events)??[]})));gn(ne,{get events(){return e(je)}})}},ze=ne=>{{let je=me(()=>(e(U),p(()=>{var Le;return((Le=e(U))==null?void 0:Le.index)??0}))),De=me(()=>(e(U),p(()=>{var Le;return((Le=e(U))==null?void 0:Le.level)??"Low"}))),Pe=me(()=>(e(U),p(()=>{var Le;return((Le=e(U))==null?void 0:Le.color)??"#4caf50"}))),Je=me(()=>(e(U),p(()=>{var Le;return((Le=e(U))==null?void 0:Le.location)??""}))),rt=me(()=>(e(U),p(()=>{var Le;return((Le=e(U))==null?void 0:Le.triggers)??[]}))),Qe=me(()=>(e(U),p(()=>{var Le;return((Le=e(U))==null?void 0:Le.periods)??[]})));xn(ne,{get index(){return e(je)},get level(){return e(De)},get color(){return e(Pe)},get location(){return e(Je)},get triggers(){return e(rt)},get periods(){return e(Qe)}})}},Ae=ne=>{Tn(ne,{get data(){return e(Y)}})},it=ne=>{{let je=me(()=>(e(L),p(()=>{var Qe;return((Qe=e(L))==null?void 0:Qe.stocks)??[]}))),De=me(()=>(F(S()),p(()=>q(S().config.show1h,!1)))),Pe=me(()=>(F(S()),p(()=>q(S().config.show24h,!0)))),Je=me(()=>(F(S()),p(()=>q(S().config.show7d,!1)))),rt=me(()=>(F(S()),p(()=>q(S().config.showSparkline,!0))));An(ne,{get stocks(){return e(je)},get show1h(){return e(De)},get show24h(){return e(Pe)},get show7d(){return e(Je)},get showSparkline(){return e(rt)}})}},lt=ne=>{{let je=me(()=>(e(K),p(()=>{var Je;return((Je=e(K))==null?void 0:Je.summaries)??[]}))),De=me(()=>(F(S()),p(()=>Number(S().config.pageSize)||5))),Pe=me(()=>(F(S()),p(()=>Number(S().config.rotateSeconds)??30)));jn(ne,{get summaries(){return e(je)},get pageSize(){return e(De)},get rotateSeconds(){return e(Pe)}})}},pt=ne=>{Bn(ne,{get pluginId(){return e(x)}})};B(Te,ne=>{e(c)==="missing"?ne(oe):e(x)==="photo-slideshow"?ne(Ie,1):e(x)==="news"?ne(Re,2):e(x)==="sports"?ne(Oe,3):e(x)==="home-assistant"?ne(he,4):e(x)==="crypto"?ne(ee,5):e(x)==="weather"?ne(_e,6):e(x)==="calendar"?ne(fe,7):e(x)==="allergies"?ne(ze,8):e(x)==="word-of-day"?ne(Ae,9):e(x)==="finance"?ne(it,10):e(x)==="ai-news"?ne(lt,11):ne(pt,!1)})}a(ue),d(o,ue),ae(),W()}at(["click"]);var Zn=m('<div class="util-clock svelte-n5vm7q"><span class="util-clock__time svelte-n5vm7q"> <span class="util-clock__seconds svelte-n5vm7q"> </span></span> <span class="util-clock__date svelte-n5vm7q"> </span></div>');function Xn(o,t){te(t,!0);let s=J(t,"hour12",3,!0),_=xe(et(new Date));Ze(()=>{const W=setInterval(()=>{k(_,new Date,!0)},1e3);return()=>clearInterval(W)});let i=ge(()=>e(_).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:s()})),y=ge(()=>e(_).toLocaleTimeString([],{second:"2-digit"}).slice(-2)),r=ge(()=>e(_).toLocaleDateString([],{weekday:"short",month:"short",day:"numeric"}));var l=Zn(),P=n(l),z=n(P,!0),E=f(z),j=n(E,!0);a(E),a(P);var C=f(P,2),M=n(C,!0);a(C),a(l),G(()=>{I(z,e(i)),I(j,e(y)),I(M,e(r))}),d(o,l),ae()}var Jn=m('<div class="error-tile svelte-15v71n" role="alert"><div class="error-icon svelte-15v71n" aria-hidden="true">⚠</div> <div class="error-name svelte-15v71n"> </div> <div class="error-message svelte-15v71n"> </div> <button class="retry-btn svelte-15v71n">Retry</button></div>');function Qn(o,t){let s=J(t,"name",8,"Widget");function _(l,P){l instanceof Error?l.message:String(l),console.error(`[ErrorBoundary] "${s()}" crashed:`,l)}function i(l){l()}var y=pe(),r=le(y);wa(r,{onerror:_,failed:(P,z=ke,E=ke)=>{var j=Jn(),C=f(n(j),2),M=n(C,!0);a(C);var W=f(C,2),x=n(W,!0);a(W);var c=f(W,2);a(j),G(()=>{de(j,"aria-label",`Error in ${s()??""}`),I(M,s()),I(x,(z(),p(()=>z()instanceof Error?z().message:"An error occurred")))}),se("click",c,()=>i(E())),d(P,j)}},P=>{var z=pe(),E=le(z);va(E,t,"default",{}),d(P,z)}),d(o,y)}at(["click"]);var er=m('<div class="picker__card svelte-54et1y"><div class="picker__card-body svelte-54et1y"><div class="picker__card-icon picker__card-icon--util svelte-54et1y"> </div> <div class="picker__card-info svelte-54et1y"><span class="picker__card-name svelte-54et1y"> </span> <span class="picker__card-id svelte-54et1y"> </span></div></div> <div class="picker__card-meta svelte-54et1y"><span class="picker__card-size svelte-54et1y"> </span></div> <button type="button" class="picker__card-add svelte-54et1y">+ Add to Dashboard</button></div>'),tr=m('<div class="picker__group svelte-54et1y"><h3 class="picker__group-label svelte-54et1y">Layout <span class="picker__group-count svelte-54et1y"> </span></h3> <div class="picker__grid svelte-54et1y"></div></div>'),ar=m('<p class="picker__empty svelte-54et1y">No widgets match your search.</p>'),sr=m('<span class="picker__card-status picker__card-status--active svelte-54et1y">Active</span>'),nr=m('<span class="picker__card-status picker__card-status--error svelte-54et1y">Error</span>'),rr=m('<span class="picker__card-status svelte-54et1y"> </span>'),ir=m('<div class="picker__card svelte-54et1y"><div class="picker__card-body svelte-54et1y"><div class="picker__card-icon svelte-54et1y"> </div> <div class="picker__card-info svelte-54et1y"><span class="picker__card-name svelte-54et1y"> </span> <span class="picker__card-id svelte-54et1y"> </span></div></div> <div class="picker__card-meta svelte-54et1y"><span class="picker__card-size svelte-54et1y"> </span> <!></div> <button type="button" class="picker__card-add svelte-54et1y">+ Add to Dashboard</button></div>'),lr=m('<div class="picker__group svelte-54et1y"><h3 class="picker__group-label svelte-54et1y"> <span class="picker__group-count svelte-54et1y"> </span></h3> <div class="picker__grid svelte-54et1y"></div></div>'),or=m('<div class="picker-backdrop svelte-54et1y"><div class="picker svelte-54et1y" role="dialog" tabindex="-1" aria-modal="true" aria-label="Add widget"><div class="picker__header svelte-54et1y"><div><h2 class="picker__title svelte-54et1y">Add Widget</h2> <p class="picker__subtitle svelte-54et1y">Choose a widget to add to your dashboard</p></div> <button type="button" class="picker__close svelte-54et1y" aria-label="Close widget picker">✕</button></div> <div class="picker__search svelte-54et1y"><input type="text" class="picker__search-input svelte-54et1y" placeholder="Search widgets..."/></div> <div class="picker__body svelte-54et1y"><!> <!></div></div></div>');function dr(o,t){te(t,!0);let s=xe(""),_=ge(()=>e(s).trim().length===0?zt:zt.filter(g=>{const b=e(s).toLowerCase();return g.label.toLowerCase().includes(b)||g.type.toLowerCase().includes(b)})),i=ge(()=>e(s).trim().length===0?t.availablePlugins:t.availablePlugins.filter(g=>{const b=e(s).toLowerCase();return g.manifest.name.toLowerCase().includes(b)||g.plugin_id.toLowerCase().includes(b)})),y=ge(()=>{const g=e(i).filter(N=>N.builtin),b=e(i).filter(N=>!N.builtin),u=[];return g.length>0&&u.push({label:"Built-in",plugins:g}),b.length>0&&u.push({label:"Plugins",plugins:b}),u});function r(g){if(!t.onaddutility)return;const b={id:Wa(g.type),x:0,y:0,w:g.defaultW,h:g.defaultH,minW:g.minW,minH:g.minH,maxW:g.maxW,maxH:g.maxH,showHeader:!1};t.onaddutility(b)}function l(g){g.key==="Escape"&&t.onclose()}var P=or();nt("keydown",dt,l);var z=n(P),E=n(z),j=f(n(E),2);a(E);var C=f(E,2),M=n(C);tt(M),a(C);var W=f(C,2),x=n(W);{var c=g=>{var b=tr(),u=n(b),N=f(n(u)),U=n(N);a(N),a(u);var K=f(u,2);We(K,21,()=>e(_),Y=>Y.type,(Y,L)=>{var S=er(),q=n(S),V=n(q),H=n(V,!0);a(V);var w=f(V,2),R=n(w),T=n(R,!0);a(R);var A=f(R,2),Q=n(A,!0);a(A),a(w),a(q);var X=f(q,2),re=n(X),ve=n(re);a(re),a(X);var be=f(X,2);a(S),G(()=>{I(H,e(L).icon),I(T,e(L).label),I(Q,e(L).description),I(ve,`${e(L).defaultW??""}×${e(L).defaultH??""}`),de(be,"aria-label",`Add ${e(L).label??""} to dashboard`)}),se("click",be,()=>r(e(L))),d(Y,S)}),a(K),a(b),G(()=>I(U,`(${e(_).length??""})`)),d(g,b)};B(x,g=>{e(_).length>0&&g(c)})}var v=f(x,2);{var h=g=>{var b=ar();d(g,b)},$=g=>{var b=pe(),u=le(b);We(u,17,()=>e(y),N=>N.label,(N,U)=>{var K=lr(),Y=n(K),L=n(Y),S=f(L),q=n(S);a(S),a(Y);var V=f(Y,2);We(V,21,()=>e(U).plugins,H=>H.plugin_id,(H,w)=>{const R=ge(()=>Kt(e(w).plugin_id,e(w).manifest));var T=ir(),A=n(T),Q=n(A),X=n(Q,!0);a(Q);var re=f(Q,2),ve=n(re),be=n(ve,!0);a(ve);var ie=f(ve,2),ue=n(ie,!0);a(ie),a(re),a(A);var Te=f(A,2),oe=n(Te),Ie=n(oe);a(oe);var Re=f(oe,2);{var Oe=fe=>{var ze=sr();d(fe,ze)},he=fe=>{var ze=nr();d(fe,ze)},ee=fe=>{var ze=rr(),Ae=n(ze,!0);a(ze),G(()=>I(Ae,e(w).status)),d(fe,ze)};B(Re,fe=>{e(w).status==="active"?fe(Oe):e(w).status==="error"?fe(he,1):fe(ee,!1)})}a(Te);var _e=f(Te,2);a(T),G(fe=>{I(X,fe),I(be,e(w).manifest.name),I(ue,e(w).plugin_id),I(Ie,`${e(R).w??""}×${e(R).h??""}`),de(_e,"aria-label",`Add ${e(w).manifest.name??""} to dashboard`)},[()=>e(w).manifest.name.charAt(0).toUpperCase()]),se("click",_e,()=>t.onadd(e(w))),d(H,T)}),a(V),a(K),G(()=>{I(L,`${e(U).label??""} `),I(q,`(${e(U).plugins.length??""})`)}),d(N,K)}),d(g,b)};B(v,g=>{e(i).length===0&&e(_).length===0?g(h):g($,!1)})}a(W),a(z),a(P),se("click",P,function(...g){var b;(b=t.onclose)==null||b.apply(this,g)}),se("click",z,g=>g.stopPropagation()),se("click",j,function(...g){var b;(b=t.onclose)==null||b.apply(this,g)}),gt(M,()=>e(s),g=>k(s,g)),d(o,P),ae()}at(["click"]);function Qt(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"}],["path",{d:"m15 5 4 4"}]];Me(o,Ne({name:"pencil"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function cr(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M12 2v20"}],["path",{d:"m15 19-3 3-3-3"}],["path",{d:"m19 9 3 3-3 3"}],["path",{d:"M2 12h20"}],["path",{d:"m5 9-3 3 3 3"}],["path",{d:"m9 5 3-3 3 3"}]];Me(o,Ne({name:"move"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function vr(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}],["path",{d:"M3 9h18"}]];Me(o,Ne({name:"panel-top"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function ur(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M10 11v6"}],["path",{d:"M14 11v6"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"}],["path",{d:"M3 6h18"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}]];Me(o,Ne({name:"trash-2"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}var _r=m('<button type="button" class="context-menu__item svelte-4ktga8" role="menuitem"><span class="context-menu__icon svelte-4ktga8" aria-hidden="true"><!></span> Configure</button>'),gr=m('<button type="button" class="context-menu__item svelte-4ktga8" role="menuitem"><span class="context-menu__icon svelte-4ktga8" aria-hidden="true"><!></span> </button>'),hr=m('<div class="context-menu-backdrop svelte-4ktga8"><div class="context-menu svelte-4ktga8" role="menu" tabindex="-1"><div class="context-menu__header svelte-4ktga8"><span class="context-menu__name svelte-4ktga8"> </span></div> <!> <button type="button" class="context-menu__item svelte-4ktga8" role="menuitem"><span class="context-menu__icon svelte-4ktga8" aria-hidden="true"><!></span> Move &amp; Resize</button> <!> <hr class="context-menu__divider svelte-4ktga8"/> <button type="button" class="context-menu__item context-menu__item--danger svelte-4ktga8" role="menuitem"><span class="context-menu__icon svelte-4ktga8" aria-hidden="true"><!></span> Remove Widget</button></div></div>');function fr(o,t){te(t,!0);let s=J(t,"showHeader",3,!0),_=J(t,"x",3,0),i=J(t,"y",3,0),y=ge(()=>{const u=Math.min(_(),window.innerWidth-200),N=Math.min(i(),window.innerHeight-200);return`left: ${u}px; top: ${N}px;`});function r(u){u.key==="Escape"&&t.onclose()}var l=hr();nt("keydown",dt,r);var P=n(l),z=n(P),E=n(z),j=n(E,!0);a(E),a(z);var C=f(z,2);{var M=u=>{var N=_r(),U=n(N),K=n(U);Qt(K,{size:14}),a(U),ft(),a(N),se("click",N,function(...Y){var L;(L=t.onconfigure)==null||L.apply(this,Y)}),d(u,N)};B(C,u=>{t.onconfigure&&u(M)})}var W=f(C,2),x=n(W),c=n(x);cr(c,{size:14}),a(x),ft(),a(W);var v=f(W,2);{var h=u=>{var N=gr(),U=n(N),K=n(U);vr(K,{size:14}),a(U);var Y=f(U);a(N),G(()=>I(Y,` ${s()?"Hide Header":"Show Header"}`)),se("click",N,function(...L){var S;(S=t.ontoggleheader)==null||S.apply(this,L)}),d(u,N)};B(v,u=>{t.ontoggleheader&&u(h)})}var $=f(v,4),g=n($),b=n(g);ur(b,{size:14}),a(g),ft(),a($),a(P),a(l),G(()=>{de(P,"aria-label",`Widget actions for ${t.pluginName??""}`),de(P,"data-plugin-id",t.pluginId),ot(P,e(y)),I(j,t.pluginName)}),se("mousedown",l,function(...u){var N;(N=t.onclose)==null||N.apply(this,u)}),se("mousedown",P,u=>u.stopPropagation()),se("click",W,function(...u){var N;(N=t.onresize)==null||N.apply(this,u)}),se("click",$,function(...u){var N;(N=t.ondelete)==null||N.apply(this,u)}),d(o,l),ae()}at(["mousedown","click"]);function pr(o,t){const s=[];return(!Number.isFinite(o.x)||!Number.isInteger(o.x))&&s.push("X position must be a valid integer"),(!Number.isFinite(o.y)||!Number.isInteger(o.y))&&s.push("Y position must be a valid integer"),(!Number.isFinite(o.w)||!Number.isInteger(o.w))&&s.push("Width must be a valid integer"),(!Number.isFinite(o.h)||!Number.isInteger(o.h))&&s.push("Height must be a valid integer"),s.length===0&&(o.x<0&&s.push("X position must be 0 or greater"),o.y<0&&s.push("Y position must be 0 or greater"),o.w<1&&s.push("Width must be at least 1"),o.h<1&&s.push("Height must be at least 1"),o.x+o.w>t&&s.push(`Widget extends beyond grid (max ${t} columns)`)),{valid:s.length===0,errors:s}}function mr(o,t){return{x:o.x,y:o.y,w:Math.max(t.minW,Math.min(t.maxW,o.w)),h:Math.max(t.minH,Math.min(t.maxH,o.h))}}var wr=m('<li class="modal__error svelte-11l7ja9"> </li>'),yr=m('<ul class="modal__errors svelte-11l7ja9" role="alert"></ul>'),br=m('<div class="modal-backdrop svelte-11l7ja9"><div class="modal svelte-11l7ja9" role="dialog" tabindex="-1" aria-modal="true"><h2 class="modal__title svelte-11l7ja9"> </h2> <div class="modal__fields svelte-11l7ja9"><label class="modal__field svelte-11l7ja9"><span class="modal__label svelte-11l7ja9">Column (X)</span> <div class="modal__stepper svelte-11l7ja9"><button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Decrease X">−</button> <input type="number" class="modal__input svelte-11l7ja9" aria-label="X position"/> <button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Increase X">+</button></div></label> <label class="modal__field svelte-11l7ja9"><span class="modal__label svelte-11l7ja9">Row (Y)</span> <div class="modal__stepper svelte-11l7ja9"><button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Decrease Y">−</button> <input type="number" class="modal__input svelte-11l7ja9" aria-label="Y position"/> <button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Increase Y">+</button></div></label> <label class="modal__field svelte-11l7ja9"><span class="modal__label svelte-11l7ja9">Width (W)</span> <div class="modal__stepper svelte-11l7ja9"><button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Decrease width">−</button> <input type="number" class="modal__input svelte-11l7ja9" aria-label="Width"/> <button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Increase width">+</button></div></label> <label class="modal__field svelte-11l7ja9"><span class="modal__label svelte-11l7ja9">Height (H)</span> <div class="modal__stepper svelte-11l7ja9"><button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Decrease height">−</button> <input type="number" class="modal__input svelte-11l7ja9" aria-label="Height"/> <button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Increase height">+</button></div></label></div> <!> <div class="modal__actions svelte-11l7ja9"><button type="button" class="modal__btn modal__btn--cancel svelte-11l7ja9">Cancel</button> <button type="button" class="modal__btn modal__btn--confirm svelte-11l7ja9">Apply</button></div></div></div>');function xr(o,t){te(t,!0);let s=J(t,"minW",3,1),_=J(t,"minH",3,1),i=J(t,"maxW",3,24),y=J(t,"maxH",3,24),r=J(t,"pluginName",3,"Widget"),l=xe(et(t.x)),P=xe(et(t.y)),z=xe(et(t.w)),E=xe(et(t.h)),j=ge(()=>pr({x:e(l),y:e(P),w:e(z),h:e(E)},24));function C(){if(!e(j).valid)return;const oe=mr({x:e(l),y:e(P),w:e(z),h:e(E)},{minW:s(),minH:_(),maxW:i(),maxH:y()});t.onconfirm(oe)}function M(oe){oe.key==="Escape"&&t.oncancel(),oe.key==="Enter"&&e(j).valid&&C()}var W=br();nt("keydown",dt,M);var x=n(W),c=n(x),v=n(c);a(c);var h=f(c,2),$=n(h),g=f(n($),2),b=n(g),u=f(b,2);tt(u),de(u,"min",0),de(u,"max",23);var N=f(u,2);a(g),a($);var U=f($,2),K=f(n(U),2),Y=n(K),L=f(Y,2);tt(L),de(L,"min",0);var S=f(L,2);a(K),a(U);var q=f(U,2),V=f(n(q),2),H=n(V),w=f(H,2);tt(w);var R=f(w,2);a(V),a(q);var T=f(q,2),A=f(n(T),2),Q=n(A),X=f(Q,2);tt(X);var re=f(X,2);a(A),a(T),a(h);var ve=f(h,2);{var be=oe=>{var Ie=yr();We(Ie,21,()=>e(j).errors,ua,(Re,Oe)=>{var he=wr(),ee=n(he,!0);a(he),G(()=>I(ee,e(Oe))),d(Re,he)}),a(Ie),d(oe,Ie)};B(ve,oe=>{e(j).valid||oe(be)})}var ie=f(ve,2),ue=n(ie),Te=f(ue,2);a(ie),a(x),a(W),G(()=>{de(x,"aria-label",`Resize ${r()??""}`),I(v,`Move & Resize — ${r()??""}`),de(w,"min",s()),de(w,"max",i()),de(X,"min",_()),de(X,"max",y()),Te.disabled=!e(j).valid}),se("click",W,function(...oe){var Ie;(Ie=t.oncancel)==null||Ie.apply(this,oe)}),se("click",x,oe=>oe.stopPropagation()),se("click",b,()=>k(l,Math.max(0,e(l)-1),!0)),gt(u,()=>e(l),oe=>k(l,oe)),se("click",N,()=>k(l,Math.min(23,e(l)+1),!0)),se("click",Y,()=>k(P,Math.max(0,e(P)-1),!0)),gt(L,()=>e(P),oe=>k(P,oe)),se("click",S,()=>k(P,e(P)+1)),se("click",H,()=>k(z,Math.max(s(),e(z)-1),!0)),gt(w,()=>e(z),oe=>k(z,oe)),se("click",R,()=>k(z,Math.min(i(),e(z)+1),!0)),se("click",Q,()=>k(E,Math.max(_(),e(E)-1),!0)),gt(X,()=>e(E),oe=>k(E,oe)),se("click",re,()=>k(E,Math.min(y(),e(E)+1),!0)),se("click",ue,function(...oe){var Ie;(Ie=t.oncancel)==null||Ie.apply(this,oe)}),se("click",Te,C),d(o,W),ae()}at(["click"]);var kr=m('<div class="integration-status integration-status--missing svelte-68mpyg" role="alert"><span class="integration-status__label svelte-68mpyg">Integration required</span> <span class="integration-status__desc svelte-68mpyg">Set credentials in</span> <button class="integration-status__link svelte-68mpyg">Go to Settings</button></div>'),Sr=m('<div class="integration-status integration-status--ready svelte-68mpyg" role="status"><span class="integration-status__label svelte-68mpyg">Integration connected</span></div>'),Mr=m('<p class="config-panel__empty svelte-68mpyg">No configuration options available for this widget.</p>'),Nr=m('<span class="config-field__required svelte-68mpyg">*</span>'),Hr=m('<p class="config-field__desc svelte-68mpyg"> </p>'),jr=m('<input type="text" class="config-field__input svelte-68mpyg"/>'),Wr=m('<input type="password" class="config-field__input svelte-68mpyg" autocomplete="off"/>'),Dr=m('<input type="number" class="config-field__input svelte-68mpyg"/>'),Cr=m('<label class="config-field__toggle svelte-68mpyg"><input type="checkbox" class="config-field__checkbox svelte-68mpyg"/> <span class="config-field__toggle-label svelte-68mpyg"> </span></label>'),Pr=m("<option> </option>"),Tr=m('<select class="config-field__select svelte-68mpyg"></select>'),zr=m('<div class="config-field svelte-68mpyg"><label class="config-field__label svelte-68mpyg"> <!></label> <!> <!></div>'),Ir=m('<div class="config-panel__fields svelte-68mpyg"></div>'),Lr=m('<div class="config-panel__error svelte-68mpyg" role="alert"> </div>'),$r=m('<div class="config-panel__saved svelte-68mpyg" role="status"> </div>'),qr=m('<button type="button" class="config-btn config-btn--save svelte-68mpyg"> </button>'),Er=m('<div class="config-backdrop svelte-68mpyg"><div class="config-panel svelte-68mpyg" role="dialog" tabindex="-1" aria-modal="true"><div class="config-panel__header svelte-68mpyg"><h2 class="config-panel__title svelte-68mpyg"> </h2> <span class="config-panel__subtitle svelte-68mpyg">Settings</span></div> <!> <!> <!> <!> <div class="config-panel__actions svelte-68mpyg"><button type="button" class="config-btn config-btn--cancel svelte-68mpyg">Cancel</button> <!></div></div></div>');function Ar(o,t){te(t,!0);let s=ge(()=>{var H;return((H=t.plugin.manifest.config_schema)==null?void 0:H.fields)??[]}),_=ge(()=>{if(!t.plugin.manifest.config_schema)return[];const H=_a(t.plugin.manifest.config_schema),w=e(s).filter(R=>!R.category);return[...H,...w]}),i=xe(et({})),y=xe(!1),r=xe(""),l=xe(!1);Ze(()=>{const H={};for(const w of e(_))H[w.key]=t.plugin.config[w.key]!==void 0?t.plugin.config[w.key]:w.default!==void 0?w.default:w.type==="boolean"?!1:w.type==="number"?0:"";k(i,H,!0)});async function P(){k(y,!0),k(r,""),k(l,!1);try{const H=await fetch(`/plugins/${encodeURIComponent(t.plugin.plugin_id)}/config`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({config:e(i)})});if(!H.ok){const w=await H.text();throw new Error(w||`HTTP ${H.status}`)}if(t.plugin.builtin){const w=await fetch(`/modules/${encodeURIComponent(t.plugin.plugin_id)}/restart`,{method:"POST"});if(!w.ok){const R=await w.text();throw new Error(`Restart failed: ${R||`HTTP ${w.status}`}`)}}k(l,!0),setTimeout(()=>{var w;(w=t.onsaved)==null||w.call(t),t.onclose()},800)}catch(H){k(r,H instanceof Error?H.message:"Save failed",!0)}finally{k(y,!1)}}function z(H){H.key==="Escape"&&t.onclose()}function E(){return Yt(`${Vt}/admin`)}function j(H,w){k(i,{...e(i),[H]:w},!0)}var C=Er();nt("keydown",dt,z);var M=n(C),W=n(M),x=n(W),c=n(x,!0);a(x),ft(2),a(W);var v=f(W,2);{var h=H=>{var w=kr(),R=f(n(w),4);a(w),se("click",R,E),d(H,w)},$=H=>{var w=Sr();d(H,w)};B(v,H=>{t.plugin.integration_status==="missing"?H(h):t.plugin.integration_status==="ready"&&H($,1)})}var g=f(v,2);{var b=H=>{var w=Mr();d(H,w)},u=H=>{var w=Ir();We(w,21,()=>e(_),R=>R.key,(R,T)=>{var A=zr(),Q=n(A),X=n(Q),re=f(X);{var ve=he=>{var ee=Nr();d(he,ee)};B(re,he=>{e(T).required&&he(ve)})}a(Q);var be=f(Q,2);{var ie=he=>{var ee=Hr(),_e=n(ee,!0);a(ee),G(()=>I(_e,e(T).description)),d(he,ee)};B(be,he=>{e(T).description&&he(ie)})}var ue=f(be,2);{var Te=he=>{var ee=jr();tt(ee),G(_e=>{de(ee,"id",`wcfg-${e(T).key??""}`),jt(ee,_e),ee.required=e(T).required},[()=>String(e(i)[e(T).key]??"")]),se("input",ee,_e=>j(e(T).key,_e.currentTarget.value)),d(he,ee)},oe=he=>{var ee=Wr();tt(ee),G(_e=>{de(ee,"id",`wcfg-${e(T).key??""}`),jt(ee,_e),ee.required=e(T).required},[()=>String(e(i)[e(T).key]??"")]),se("input",ee,_e=>j(e(T).key,_e.currentTarget.value)),d(he,ee)},Ie=he=>{var ee=Dr();tt(ee),G(_e=>{de(ee,"id",`wcfg-${e(T).key??""}`),jt(ee,_e),de(ee,"min",e(T).min),de(ee,"max",e(T).max),ee.required=e(T).required},[()=>Number(e(i)[e(T).key]??0)]),se("input",ee,_e=>j(e(T).key,_e.currentTarget.valueAsNumber)),d(he,ee)},Re=he=>{var ee=Cr(),_e=n(ee);tt(_e);var fe=f(_e,2),ze=n(fe,!0);a(fe),a(ee),G(Ae=>{de(_e,"id",`wcfg-${e(T).key??""}`),ga(_e,Ae),I(ze,e(i)[e(T).key]?"Enabled":"Disabled")},[()=>!!e(i)[e(T).key]]),se("change",_e,Ae=>j(e(T).key,Ae.currentTarget.checked)),d(he,ee)},Oe=he=>{var ee=Tr();We(ee,21,()=>e(T).options??[],fe=>fe.value,(fe,ze)=>{var Ae=Pr(),it=n(Ae,!0);a(Ae);var lt={};G(()=>{I(it,e(ze).label),lt!==(lt=e(ze).value)&&(Ae.value=(Ae.__value=e(ze).value)??"")}),d(fe,Ae)}),a(ee);var _e;Gt(ee),G(fe=>{de(ee,"id",`wcfg-${e(T).key??""}`),_e!==(_e=fe)&&(ee.value=(ee.__value=fe)??"",Ot(ee,fe))},[()=>String(e(i)[e(T).key]??"")]),se("change",ee,fe=>j(e(T).key,fe.currentTarget.value)),d(he,ee)};B(ue,he=>{e(T).type==="string"?he(Te):e(T).type==="password"?he(oe,1):e(T).type==="number"?he(Ie,2):e(T).type==="boolean"?he(Re,3):e(T).type==="select"&&he(Oe,4)})}a(A),G(()=>{de(Q,"for",`wcfg-${e(T).key??""}`),I(X,`${e(T).label??""} `)}),d(R,A)}),a(w),d(H,w)};B(g,H=>{e(_).length===0?H(b):H(u,!1)})}var N=f(g,2);{var U=H=>{var w=Lr(),R=n(w,!0);a(w),G(()=>I(R,e(r))),d(H,w)};B(N,H=>{e(r)&&H(U)})}var K=f(N,2);{var Y=H=>{var w=$r(),R=n(w);a(w),G(()=>I(R,`Settings saved${t.plugin.builtin?" — restarting module":""}`)),d(H,w)};B(K,H=>{e(l)&&H(Y)})}var L=f(K,2),S=n(L),q=f(S,2);{var V=H=>{var w=qr(),R=n(w,!0);a(w),G(()=>{w.disabled=e(y),I(R,e(y)?"Saving...":"Save")}),se("click",w,P),d(H,w)};B(q,H=>{e(_).length>0&&H(V)})}a(L),a(M),a(C),G(()=>{de(M,"aria-label",`Configure ${t.plugin.manifest.name??""}`),I(c,t.plugin.manifest.name)}),se("mousedown",C,function(...H){var w;(w=t.onclose)==null||w.apply(this,H)}),se("mousedown",M,H=>H.stopPropagation()),se("click",S,function(...H){var w;(w=t.onclose)==null||w.apply(this,H)}),d(o,C),ae()}at(["mousedown","click","input","change"]);var Ur=m('<label class="util-config__field svelte-q3fj7w"><span class="util-config__label svelte-q3fj7w">Time Format</span> <select class="util-config__select svelte-q3fj7w"><option>12-hour (7:29 PM)</option><option>24-hour (19:29)</option></select></label>'),Rr=m('<div class="util-config-backdrop svelte-q3fj7w"><div class="util-config-panel svelte-q3fj7w" role="dialog" tabindex="-1" aria-modal="true"><h2 class="util-config__title svelte-q3fj7w">Clock Settings</h2> <!> <div class="util-config__actions svelte-q3fj7w"><button type="button" class="util-config__btn util-config__btn--cancel svelte-q3fj7w">Cancel</button> <button type="button" class="util-config__btn util-config__btn--save svelte-q3fj7w">Save</button></div></div></div>');function Fr(o,t){te(t,!0);let s=xe(t.config.hour12!==!1);function _(){t.onsave({...t.config,hour12:e(s)})}function i(C){C.key==="Escape"&&t.onclose()}var y=Rr();nt("keydown",dt,i);var r=n(y),l=f(n(r),2);{var P=C=>{var M=Ur(),W=f(n(M),2),x=n(W);x.value=x.__value="12";var c=f(x);c.value=c.__value="24",a(W);var v;Gt(W),a(M),G(()=>{v!==(v=e(s)?"12":"24")&&(W.value=W.__value=e(s)?"12":"24",Ot(W,e(s)?"12":"24"))}),se("change",W,h=>k(s,h.currentTarget.value==="12")),d(C,M)};B(l,C=>{t.utilityType==="clock"&&C(P)})}var z=f(l,2),E=n(z),j=f(E,2);a(z),a(r),a(y),G(()=>de(r,"aria-label",`Configure ${t.utilityType??""}`)),se("mousedown",y,function(...C){var M;(M=t.onclose)==null||M.apply(this,C)}),se("mousedown",r,C=>C.stopPropagation()),se("click",E,function(...C){var M;(M=t.onclose)==null||M.apply(this,C)}),se("click",j,_),d(o,y),ae()}at(["mousedown","change","click"]);var Gr=m('<span class="edit-bar__dirty svelte-s9daqd" aria-label="Unsaved changes">Unsaved changes</span>'),Or=m('<div class="edit-bar svelte-s9daqd" role="toolbar" aria-label="Layout editing"><div class="edit-bar__group svelte-s9daqd"><button class="edit-bar__btn edit-bar__btn--undo svelte-s9daqd" type="button" aria-label="Undo" title="Undo (Ctrl+Z)">Undo</button> <button class="edit-bar__btn edit-bar__btn--redo svelte-s9daqd" type="button" aria-label="Redo" title="Redo (Ctrl+Shift+Z)">Redo</button></div> <!> <div class="edit-bar__group svelte-s9daqd"><button class="edit-bar__btn edit-bar__btn--cancel svelte-s9daqd" type="button" title="Cancel (Escape)">Cancel</button> <button class="edit-bar__btn edit-bar__btn--save svelte-s9daqd" type="button" aria-label="Save layout">Save</button></div></div>');function Br(o,t){var s=Or(),_=n(s),i=n(_),y=f(i,2);a(_);var r=f(_,2);{var l=j=>{var C=Gr();d(j,C)};B(r,j=>{t.dirty&&j(l)})}var P=f(r,2),z=n(P),E=f(z,2);a(P),a(s),G(()=>{i.disabled=!t.canUndo,y.disabled=!t.canRedo,E.disabled=!t.dirty}),se("click",i,function(...j){var C;(C=t.onundo)==null||C.apply(this,j)}),se("click",y,function(...j){var C;(C=t.onredo)==null||C.apply(this,j)}),se("click",z,function(...j){var C;(C=t.oncancel)==null||C.apply(this,j)}),se("click",E,function(...j){var C;(C=t.onsave)==null||C.apply(this,j)}),d(o,s)}at(["click"]);const Yr=50;function Fe(o){return o.map(t=>({...t}))}function Vr(o,t){if(o.length!==t.length)return!1;for(let s=0;s<o.length;s++)if(o[s].id!==t[s].id||o[s].x!==t[s].x||o[s].y!==t[s].y||o[s].w!==t[s].w||o[s].h!==t[s].h||o[s].showHeader!==!1!=(t[s].showHeader!==!1))return!1;return!0}function Ct(o){let t=Fe(o);const s=[],_=[];let i=Fe(o);return{pushState(y){s.push(Fe(i)),i=Fe(y),_.length=0,s.length>Yr&&s.shift()},undo(){return s.length===0||(_.push(Fe(i)),i=s.pop()),Fe(i)},redo(){return _.length===0||(s.push(Fe(i)),i=_.pop()),Fe(i)},canUndo(){return s.length>0},canRedo(){return _.length>0},isDirty(){return!Vr(i,t)},reset(y){t=Fe(y),i=Fe(y),s.length=0,_.length=0},getCurrent(){return Fe(i)}}}function Rt(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"}],["circle",{cx:"12",cy:"12",r:"3"}]];Me(o,Ne({name:"settings"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Kr(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M15 18h-5"}],["path",{d:"M18 14h-8"}],["path",{d:"M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"}],["rect",{width:"8",height:"4",x:"10",y:"6",rx:"1"}]];Me(o,Ne({name:"newspaper"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Zr(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978"}],["path",{d:"M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978"}],["path",{d:"M18 9h1.5a1 1 0 0 0 0-5H18"}],["path",{d:"M4 22h16"}],["path",{d:"M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"}],["path",{d:"M6 9H4.5a1 1 0 0 1 0-5H6"}]];Me(o,Ne({name:"trophy"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Xr(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}]];Me(o,Ne({name:"house"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Jr(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M13.744 17.736a6 6 0 1 1-7.48-7.48"}],["path",{d:"M15 6h1v4"}],["path",{d:"m6.134 14.768.866-.5 2 3.464"}],["circle",{cx:"16",cy:"8",r:"6"}]];Me(o,Ne({name:"coins"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Qr(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M8 2v4"}],["path",{d:"M16 2v4"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2"}],["path",{d:"M3 10h18"}],["path",{d:"M8 14h.01"}],["path",{d:"M12 14h.01"}],["path",{d:"M16 14h.01"}],["path",{d:"M8 18h.01"}],["path",{d:"M12 18h.01"}],["path",{d:"M16 18h.01"}]];Me(o,Ne({name:"calendar-days"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function ei(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1"}],["circle",{cx:"12",cy:"8",r:"2"}],["path",{d:"M12 10v12"}],["path",{d:"M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z"}],["path",{d:"M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z"}]];Me(o,Ne({name:"flower-2"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function ti(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"}],["path",{d:"M20 2v4"}],["path",{d:"M22 4h-4"}],["circle",{cx:"4",cy:"20",r:"2"}]];Me(o,Ne({name:"sparkles"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function ai(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M12 7v14"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"}]];Me(o,Ne({name:"book-open"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function si(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M16 7h6v6"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17"}]];Me(o,Ne({name:"trending-up"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}var ni=m('<div class="dashboard-empty svelte-15y8q3w"><p class="dashboard-empty__text svelte-15y8q3w">No plugins enabled. Visit the admin panel to configure your dashboard.</p></div>'),ri=m('<button type="button" class="widget-gear-btn svelte-15y8q3w"><!></button>'),ii=m('<span class="widget-header__icon svelte-15y8q3w"><!></span>'),li=m('<div class="widget-header svelte-15y8q3w"><!> <span class="widget-header__title svelte-15y8q3w"> </span></div>'),oi=m('<div class="dashboard-widget-content svelte-15y8q3w"><!> <!> <div><!></div></div>'),di=m('<button type="button" class="widget-gear-btn svelte-15y8q3w" aria-label="Widget settings"><!></button>'),ci=m("<div></div>"),vi=m('<div class="util-hdiv svelte-15y8q3w"></div>'),ui=m('<div class="util-vdiv svelte-15y8q3w"></div>'),_i=m('<div class="dashboard-widget-content svelte-15y8q3w"><!> <div class="widget-body widget-body--no-header svelte-15y8q3w"><!></div></div>'),gi=m('<button class="dashboard-add-btn svelte-15y8q3w" type="button" aria-label="Add Widget">Add Widget</button> <!>',1),hi=m('<button class="dashboard-edit-icon svelte-15y8q3w" type="button" aria-label="Edit Layout"><!></button>'),fi=m('<div><!> <!> <!> <div class="dashboard-toolbar svelte-15y8q3w"><!></div> <!> <!> <!> <!> <!></div>');function pi(o,t){var Le;te(t,!0);const s={weather:Jt,news:Kr,sports:Zr,"home-assistant":Xr,crypto:Jr,calendar:Qr,allergies:ei,"ai-news":ti,"word-of-day":ai,finance:si},_="lensing-dashboard-layout";let i=J(t,"allPlugins",19,()=>[]),y=J(t,"serverLayout",3,null),r,l=xe(!1),P=xe(!1),z=xe(null),E=xe(null),j=xe(null),C=xe(null),M=xe(null),W=xe(et([])),x=xe(null),c=xe(et(Ct([]))),v=ge(()=>Sa(t.plugins));if(typeof window<"u")try{const D=localStorage.getItem(_);if(D){const O=JSON.parse(D);k(x,O,!0),(Le=t.onsave)==null||Le.call(t,O)}}catch{}Ze(()=>{if(!(!y()||e(l))){k(x,[...y()],!0);try{localStorage.setItem(_,JSON.stringify(y()))}catch{}}}),Ze(()=>{if(e(l))return;const D=e(v),O=e(x)?[...e(x)]:[...D];k(W,O.map(Z=>{const ce=Wt(Z.id);if(!ce)return Z;const $e=ja(ce);return $e?{...Z,minW:$e.minW,minH:$e.minH,maxW:$e.maxW,maxH:$e.maxH}:Z}),!0),k(c,Ct(O),!0)});let h=ge(()=>e(W)),$=ge(()=>(e(W),e(c).canUndo())),g=ge(()=>(e(W),e(c).canRedo())),b=ge(()=>(e(W),e(c).isDirty())),u=ge(()=>new Map(t.plugins.map(D=>[D.plugin_id,D]))),N=ge(()=>i().filter(D=>!e(h).some(O=>O.id===D.plugin_id)));function U(D){const O=new Map(e(W).map(ce=>[ce.id,ce])),Z=D.map(ce=>{const $e=O.get(ce.id);return $e?{...$e,...ce}:ce});e(c).pushState(Z),k(W,Z,!0)}function K(){if(e(l)){S();return}k(l,!0),k(c,Ct(e(W)),!0)}function Y(){const D=e(c).undo();k(W,D,!0)}function L(){const D=e(c).redo();k(W,D,!0)}function S(){const D=e(x)??e(v);e(c).reset(D),k(W,[...D],!0),k(l,!1),k(P,!1),k(z,null),k(j,null),k(C,null),k(M,null)}function q(D){if(!e(l))return;if(D.key==="Escape"){D.preventDefault(),S();return}const O=D.key.toLowerCase();if((D.ctrlKey||D.metaKey)&&O==="z"&&D.shiftKey){D.preventDefault(),L();return}if((D.ctrlKey||D.metaKey)&&O==="z"&&!D.shiftKey){D.preventDefault(),Y();return}}function V(D){const O=Kt(D.plugin_id,D.manifest),Z={id:D.plugin_id,x:0,y:0,w:O.w,h:O.h},ce=[...e(W),Z];e(c).pushState(ce),k(W,ce,!0),k(P,!1)}function H(D){const O=[...e(W),D];e(c).pushState(O),k(W,O,!0),k(P,!1)}function w(D){const O=e(W).filter(Z=>Z.id!==D);e(c).pushState(O),k(W,O,!0),k(z,null)}function R(D){k(z,null);const O=e(u).get(D)??i().find(Z=>Z.plugin_id===D);O&&k(C,O,!0)}function T(D,O){k(z,null),k(M,{widgetId:D,utilType:O},!0)}function A(D){if(!e(M))return;const O=e(M).widgetId,Z=e(W).map(ce=>ce.id===O?{...ce,config:D}:ce);e(c).pushState(Z),k(W,Z,!0),k(M,null)}function Q(D){const O=e(W).map(Z=>Z.id===D?{...Z,showHeader:Z.showHeader===!1}:Z);e(c).pushState(O),k(W,O,!0),k(z,null)}function X(D){k(z,null),k(j,D,!0)}function re(D){if(!e(j))return;const O=e(j).id,Z=e(W).map(ce=>ce.id===O?{...ce,...D}:ce);e(c).pushState(Z),k(W,Z,!0),k(j,null)}function ve(){var D;k(x,[...e(h)],!0);try{localStorage.setItem(_,JSON.stringify(e(h)))}catch{}(D=t.onsave)==null||D.call(t,e(h)),e(c).reset(e(h)),k(l,!1),k(P,!1),k(z,null),k(j,null),k(C,null),k(M,null)}Ze(()=>{e(h).map(D=>D.id),ba().then(be)});function be(){if(r)for(const D of e(h)){const O=CSS.escape(D.id),Z=r.querySelector(`.gs-item-content[data-widget-id="${O}"]`);if(!Z||Z.querySelector(".dashboard-widget-content"))continue;const ce=r.querySelector(`:scope > .dashboard-widget-content[data-widget-id="${O}"]`);ce&&Z.appendChild(ce)}}function ie(D,O,Z){const ce=e(h).find($e=>$e.id===D);ce&&(k(z,ce,!0),k(E,{x:O,y:Z},!0))}function ue(D,O){D.stopPropagation();const Z=D.currentTarget.getBoundingClientRect();ie(O,Z.left,Z.bottom+4)}function Te(D){if(!e(l))return;let O=D.target;for(;O&&O!==D.currentTarget;){const Z=O.getAttribute("data-widget-id");if(Z){D.preventDefault(),ie(Z,D.clientX,D.clientY);break}O=O.parentElement||D.currentTarget}}var oe=fi();nt("keydown",dt,q);let Ie;var Re=n(oe);Ea(Re,{get items(){return e(h)},get editMode(){return e(l)},get options(){return Lt},onchange:U});var Oe=f(Re,2);{var he=D=>{var O=ni();d(D,O)};B(Oe,D=>{e(h).length===0&&D(he)})}var ee=f(Oe,2);We(ee,17,()=>e(h),D=>D.id,(D,O)=>{const Z=ge(()=>e(u).get(e(O).id)),ce=ge(()=>Wt(e(O).id));var $e=pe(),wt=le($e);{var yt=st=>{var Ue=oi(),ct=n(Ue);{var xt=Ke=>{var Ce=ri(),qe=n(Ce);Rt(qe,{size:14,strokeWidth:2}),a(Ce),G(()=>de(Ce,"aria-label",`Widget settings for ${e(Z).manifest.name??""}`)),se("click",Ce,Be=>ue(Be,e(O).id)),d(Ke,Ce)};B(ct,Ke=>{e(l)&&Ke(xt)})}var vt=f(ct,2);{var kt=Ke=>{const Ce=ge(()=>s[e(O).id]);var qe=li(),Be=n(qe);{var Mt=Nt=>{var Ht=ii(),aa=n(Ht);ya(aa,()=>e(Ce),(sa,na)=>{na(sa,{size:14})}),a(Ht),d(Nt,Ht)};B(Be,Nt=>{e(Ce)&&Nt(Mt)})}var qt=f(Be,2),ta=n(qt,!0);a(qt),a(qe),G(()=>I(ta,e(Z).manifest.name)),d(Ke,qe)};B(vt,Ke=>{e(O).showHeader!==!1&&Ke(kt)})}var ut=f(vt,2);let mt;var St=n(ut);Qn(St,{get name(){return e(Z).manifest.name},children:(Ke,Ce)=>{Kn(Ke,{get plugin(){return e(Z)}})},$$slots:{default:!0}}),a(ut),a(Ue),G(()=>{de(Ue,"data-widget-id",e(O).id),mt=Ee(ut,1,"widget-body svelte-15y8q3w",null,mt,{"widget-body--no-header":e(O).showHeader===!1})}),d(st,Ue)},bt=st=>{var Ue=_i(),ct=n(Ue);{var xt=Ce=>{var qe=di(),Be=n(qe);Rt(Be,{size:14,strokeWidth:2}),a(qe),se("click",qe,Mt=>ue(Mt,e(O).id)),d(Ce,qe)};B(ct,Ce=>{e(l)&&Ce(xt)})}var vt=f(ct,2),kt=n(vt);{var ut=Ce=>{var qe=ci();let Be;G(()=>Be=Ee(qe,1,"util-spacer svelte-15y8q3w",null,Be,{"util-spacer--edit":e(l)})),d(Ce,qe)},mt=Ce=>{var qe=vi();d(Ce,qe)},St=Ce=>{var qe=ui();d(Ce,qe)},Ke=Ce=>{{let qe=ge(()=>{var Be;return((Be=e(O).config)==null?void 0:Be.hour12)!==!1});Xn(Ce,{get hour12(){return e(qe)}})}};B(kt,Ce=>{e(ce)==="spacer"?Ce(ut):e(ce)==="hdiv"?Ce(mt,1):e(ce)==="vdiv"?Ce(St,2):e(ce)==="clock"&&Ce(Ke,3)})}a(vt),a(Ue),G(()=>de(Ue,"data-widget-id",e(O).id)),d(st,Ue)};B(wt,st=>{e(Z)?st(yt):e(ce)&&st(bt,1)})}d(D,$e)});var _e=f(ee,2),fe=n(_e);{var ze=D=>{var O=gi(),Z=le(O),ce=f(Z,2);Br(ce,{onsave:ve,oncancel:S,onundo:Y,onredo:L,get canUndo(){return e($)},get canRedo(){return e(g)},get dirty(){return e(b)}}),se("click",Z,()=>k(P,!0)),d(D,O)},Ae=D=>{var O=hi(),Z=n(O);Qt(Z,{size:14,strokeWidth:1.5}),a(O),se("click",O,K),d(D,O)};B(fe,D=>{e(l)?D(ze):D(Ae,!1)})}a(_e);var it=f(_e,2);{var lt=D=>{const O=ge(()=>e(u).get(e(z).id)??i().find($e=>$e.plugin_id===e(z).id)),Z=ge(()=>Wt(e(z).id)),ce=ge(()=>{var $e;return(($e=e(O))==null?void 0:$e.manifest.name)??(e(Z)==="spacer"?"Spacer":e(Z)==="hdiv"?"Horizontal Line":e(Z)==="vdiv"?"Vertical Line":e(Z)==="clock"?"Clock":e(z).id)});{let $e=ge(()=>e(z).showHeader!==!1),wt=ge(()=>{var Ue;return((Ue=e(E))==null?void 0:Ue.x)??0}),yt=ge(()=>{var Ue;return((Ue=e(E))==null?void 0:Ue.y)??0}),bt=ge(()=>e(Z)==="clock"?()=>T(e(z).id,"clock"):e(Z)?void 0:()=>R(e(z).id)),st=ge(()=>e(Z)?void 0:()=>Q(e(z).id));fr(D,{get pluginId(){return e(z).id},get pluginName(){return e(ce)},get showHeader(){return e($e)},get x(){return e(wt)},get y(){return e(yt)},get onconfigure(){return e(bt)},ondelete:()=>w(e(z).id),onresize:()=>X(e(z)),get ontoggleheader(){return e(st)},onclose:()=>k(z,null)})}};B(it,D=>{e(l)&&e(z)&&D(lt)})}var pt=f(it,2);{var ne=D=>{{let O=ge(()=>{var Z;return((Z=e(u).get(e(j).id))==null?void 0:Z.manifest.name)??e(j).id});xr(D,{get x(){return e(j).x},get y(){return e(j).y},get w(){return e(j).w},get h(){return e(j).h},get minW(){return e(j).minW},get minH(){return e(j).minH},get maxW(){return e(j).maxW},get maxH(){return e(j).maxH},get pluginName(){return e(O)},onconfirm:re,oncancel:()=>k(j,null)})}};B(pt,D=>{e(j)&&D(ne)})}var je=f(pt,2);{var De=D=>{Ar(D,{get plugin(){return e(C)},onclose:()=>k(C,null),get onsaved(){return t.onconfigsaved}})};B(je,D=>{e(C)&&D(De)})}var Pe=f(je,2);{var Je=D=>{{let O=ge(()=>{var Z;return((Z=e(W).find(ce=>ce.id===e(M).widgetId))==null?void 0:Z.config)??{}});Fr(D,{get utilityType(){return e(M).utilType},get config(){return e(O)},onclose:()=>k(M,null),onsave:A})}};B(Pe,D=>{e(M)&&D(Je)})}var rt=f(Pe,2);{var Qe=D=>{dr(D,{get availablePlugins(){return e(N)},onadd:V,onaddutility:H,onclose:()=>k(P,!1)})};B(rt,D=>{e(l)&&e(P)&&D(Qe)})}a(oe),It(oe,D=>r=D,()=>r),G(()=>Ie=Ee(oe,1,"dashboard-grid svelte-15y8q3w",null,Ie,{"dashboard-edit-mode":e(l)})),se("contextmenu",oe,Te),d(o,oe),ae()}at(["contextmenu","click"]);const ea="/layout";async function mi(o){try{return(await fetch(ea,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({widgets:o})})).ok}catch{return!1}}async function wi(){try{const o=await fetch(ea);return o.ok?(await o.json()).widgets??null:null}catch{return null}}var yi=m('<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>');function ji(o,t){te(t,!0);let s=xe(et([])),_=xe(null);const i=new Set(ha);let y=ge(()=>e(s).filter(E=>!i.has(E.plugin_id)));async function r(){const E=await fetch("/plugins");E.ok&&k(s,await E.json(),!0)}function l(){r()}function P(E){mi(E).then(()=>r())}async function z(){try{const E=await fetch("/data-bus");if(!E.ok)return;const j=await E.json();for(const C of j)At(C)}catch{}}Ze(()=>{r(),z();const E=location.protocol==="https:"?"wss:":"ws:",j=new WebSocket(`${E}//${location.host}/ws`);return j.addEventListener("message",C=>{try{const M=JSON.parse(String(C.data));M.type==="layout_change"?(r(),wi().then(W=>{W&&k(_,W,!0)})):M.type==="plugin_data"&&At(M.payload)}catch{}}),()=>{j.close()}}),fa("1uha8ag",E=>{var j=yi();oa(()=>{da.title="Lensing Display"}),d(E,j)}),pi(o,{get plugins(){return e(y)},get allPlugins(){return e(y)},get serverLayout(){return e(_)},onsave:P,onconfigsaved:l,adminHref:"/admin"}),ae()}export{ji as component};
