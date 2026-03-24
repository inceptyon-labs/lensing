import{p as te,e as Ze,a as d,n as ae,j as e,ba as k,o as m,bu as xe,q as n,s as a,c as pe,f as le,t as G,aC as ge,bB as we,k as F,bC as Xe,g as p,W as ye,v as f,aB as Rt,R as me,aA as ke,bv as na,aW as ft,aD as ra,bD as ia,be as et,bE as dt,ah as la,bG as oa}from"../chunks/DRA9cCzs.js";import{e as je,b as de,h as Ee,I as Me,n as ot,m as da,l as ca,r as tt,c as gt,j as va,a as ua,k as Wt,s as _a,i as Ft,f as Gt,S as ga,p as ha}from"../chunks/D5sl8Evu.js";import{p as J,v as B,s as I,z as Ne,r as He,y as nt,B as fa,C as pa,D as Ye,E as Ot,f as at,e as se,F as ma}from"../chunks/BpRJsttV.js";import{b as It,c as wa}from"../chunks/BlTpvLZj.js";import{s as Se}from"../chunks/CnsHFsvp.js";import{i as Ge}from"../chunks/BJh0JSOh.js";import{g as Bt,b as Yt,t as ya}from"../chunks/DNxO3Txx.js";const Lt={columns:12,rowHeight:60,margin:[5,5],compact:"vertical",float:!1,resizeHandles:["n","ne","e","se","s","sw","w","nw"],minRow:1,maxRow:0,animate:150},ba={weather:{x:0,y:0,w:3,h:4},news:{x:3,y:0,w:4,h:4},sports:{x:7,y:0,w:3,h:4},crypto:{x:10,y:0,w:2,h:4},calendar:{x:0,y:4,w:4,h:5},"home-assistant":{x:4,y:4,w:4,h:5},"photo-slideshow":{x:8,y:4,w:4,h:5},allergies:{x:0,y:9,w:3,h:3}},_t={w:3,h:4};let ht=0,Pt=12;function xa(o){const t=ba[o];if(t)return t;const s={x:ht,y:Pt,w:_t.w,h:_t.h};return ht+=_t.w,ht+_t.w>12&&(ht=0,Pt+=_t.h),s}function ka(o){return ht=0,Pt=12,o.filter(t=>t.enabled!==!1).map(t=>{const s=xa(t.plugin_id);return{id:t.plugin_id,x:s.x,y:s.y,w:s.w,h:s.h}})}const Et={weather:{min:[2,2],preferred:[3,4],max:[6,8]},allergies:{min:[2,2],preferred:[3,3],max:[6,6]},crypto:{min:[2,2],preferred:[2,4],max:[6,8]},"word-of-day":{min:[2,2],preferred:[3,3],max:[6,6]},finance:{min:[2,2],preferred:[3,4],max:[6,8]},"ai-news":{min:[2,3],preferred:[4,5],max:[8,10]},news:{min:[2,3],preferred:[4,4],max:[8,10]},sports:{min:[2,2],preferred:[3,4],max:[6,8]},"photo-slideshow":{min:[2,3],preferred:[4,5],max:[12,12]},calendar:{min:[2,3],preferred:[4,5],max:[8,10]},"home-assistant":{min:[2,3],preferred:[4,5],max:[8,10]}},Sa={min:[1,2],preferred:[2,3],max:[12,12]};function Ma(o){return o!==null&&typeof o=="object"&&!Array.isArray(o)&&"min"in o&&"preferred"in o&&"max"in o}function Na(o,t){return t!=null&&t.widget_sizes&&Ma(t.widget_sizes)?t.widget_sizes:o in Et?Et[o]:Sa}function Vt(o,t){const s=Na(o,t);return{w:s.preferred[0],h:s.preferred[1]}}const Tt="__",zt=[{type:"spacer",label:"Spacer",description:"Invisible block to create breathing room",icon:"⬜",defaultW:3,defaultH:1,minW:1,minH:1,maxW:12,maxH:12},{type:"hdiv",label:"Horizontal Line",description:"Thin line to separate rows",icon:"━",defaultW:12,defaultH:1,minW:1,minH:1,maxW:12,maxH:1},{type:"vdiv",label:"Vertical Line",description:"Thin line to separate columns",icon:"┃",defaultW:1,defaultH:4,minW:1,minH:1,maxW:1,maxH:12},{type:"clock",label:"Clock",description:"Current time and date display",icon:"◷",defaultW:4,defaultH:2,minW:2,minH:2,maxW:12,maxH:12}];function jt(o){if(!o.startsWith(Tt))return null;const t=o.slice(Tt.length),s=t.indexOf("-"),_=s===-1?t:t.slice(0,s);return["spacer","hdiv","vdiv","clock"].includes(_)?_:null}function Ha(o){return zt.find(t=>t.type===o)}function Wa(o){const t=Math.random().toString(36).slice(2,8);return`${Tt}${o}-${t}`}const ja=200,Da=5,Ca=768,Kt=4,Pa=70,Ta=["se","sw"];function za(){return typeof window>"u"?!1:window.innerWidth<=Ca}function Ia(){return{...Lt,columns:Kt,rowHeight:Pa,resizeHandles:Ta,touchDelay:ja,moveTolerance:Da,margin:[4,4]}}var La=m('<div class="grid-stack-item"><div class="grid-stack-item-content gs-item-content"><!></div></div>'),$a=m('<div class="grid-stack"><!></div>');function qa(o,t){te(t,!0);let s=J(t,"items",19,()=>[]),_=J(t,"editMode",3,!1),i=J(t,"options",3,Lt),y=xe(void 0),r,l=xe(!1),P=!1;Ze(()=>{if(e(y))return W(),()=>{r&&(r.destroy(!1),r=void 0,k(l,!1))}});function W(){if(!e(y))return;const c=globalThis.GridStack;if(c)try{const v=za(),h=v?Ia():i(),$=v?Kt:i().columns,g=h.touchDelay??0,b=h.moveTolerance??0,u=c.init({column:$,cellHeight:h.rowHeight,margin:`${h.margin[0]}px`,float:h.float??!1,animate:(h.animate??150)>0,resizable:{handles:h.resizeHandles.join(",")},staticGrid:!_(),minRow:h.minRow??1,draggable:{touchDelay:g},...b>0?{moveTolerance:b}:{}},e(y));r=u,U(s()),u.on("change",()=>{if(!P&&t.onchange){const N=T();t.onchange(N)}}),u.on("added",(N,A)=>{if(!P&&t.onadd&&A.length>0)for(const K of A){const Y=D(K);Y&&t.onadd(Y)}}),u.on("removed",(N,A)=>{if(!P&&t.onremove&&A.length>0)for(const K of A){const Y=D(K);Y&&t.onremove(Y)}}),k(l,!0)}catch{}}function U(c){var $;if(!r)return;P=!0,r.batchUpdate();const v=new Map;for(const g of r.getGridItems()){const b=($=g.gridstackNode)==null?void 0:$.id;b&&v.set(b,g)}const h=new Set(c.map(g=>g.id));for(const[g,b]of v)h.has(g)||r.removeWidget(b);for(const g of c){const b=/^[a-zA-Z0-9_-]+$/.test(g.id)?g.id:"invalid-widget",u=v.get(b);u?r.update(u,{x:g.x,y:g.y,w:g.w,h:g.h,minW:g.minW,minH:g.minH,maxW:g.maxW,maxH:g.maxH}):r.addWidget({id:b,w:g.w,h:g.h,autoPosition:!0,minW:g.minW,minH:g.minH,maxW:g.maxW,maxH:g.maxH,locked:g.locked,content:(()=>{const N=document.createElement("div");return N.className="gs-item-content",N.setAttribute("data-widget-id",b),N.outerHTML})()})}r.batchUpdate(!1),P=!1}function T(){return r?r.getGridItems().map(c=>{const v=c.gridstackNode;return{id:(v==null?void 0:v.id)??"",x:(v==null?void 0:v.x)??0,y:(v==null?void 0:v.y)??0,w:(v==null?void 0:v.w)??1,h:(v==null?void 0:v.h)??1}}):[]}function D(c){return c?{id:c.id??"",x:c.x??0,y:c.y??0,w:c.w??1,h:c.h??1}:null}Ze(()=>{e(l)&&r&&r.setStatic(!_())}),Ze(()=>{if(!e(l))return;const c=s().map(v=>({id:v.id,x:v.x,y:v.y,w:v.w,h:v.h,minW:v.minW,minH:v.minH,maxW:v.maxW,maxH:v.maxH,locked:v.locked}));U(c)});var M=$a(),C=n(M);{var x=c=>{var v=pe(),h=le(v);je(h,17,s,$=>$.id,($,g)=>{var b=La(),u=n(b),N=n(u);{var A=K=>{var Y=pe(),L=le(Y);Se(L,()=>t.widget,()=>({widget:e(g)})),d(K,Y)};B(N,K=>{t.widget&&K(A)})}a(u),a(b),G(()=>{de(b,"data-gs-id",e(g).id),de(b,"data-gs-x",e(g).x),de(b,"data-gs-y",e(g).y),de(b,"data-gs-w",e(g).w),de(b,"data-gs-h",e(g).h),de(u,"data-widget-id",e(g).id)}),d($,b)}),d(c,v)};B(C,c=>{e(l)||c(x)})}a(M),It(M,c=>k(y,c),()=>e(y)),d(o,M),ae()}var Ea=m('<div><img alt="Ambient slideshow" style="object-fit: cover; position: absolute; inset: 0; width: 100%; height: 100%;"/></div>'),Aa=m('<div class="photo-slideshow__empty svelte-ci60j3"><span>No photos available</span></div>'),Ua=m('<div class="photo-slideshow svelte-ci60j3"><!></div>');function Ra(o,t){te(t,!0);function s(x,c){return c<=1?0:(x+1)%c}const _=J(t,"photoPaths",19,()=>[]),i=J(t,"cycleInterval",3,3e4),y=["ken-burns-1","ken-burns-2","ken-burns-3"];let r=xe(0),l=xe(0),P=ge(()=>y[e(l)]);function W(){const x=_()??[];x.length!==0&&(k(r,s(e(r),x.length),!0),k(l,(e(l)+1)%y.length))}Ze(()=>{const x=_()??[],c=i()??3e4;if(x.length<=1)return;const v=setInterval(W,c);return()=>clearInterval(v)});let U=ge(()=>(_()??[]).length>0?(_()??[])[e(r)]??null:null);var T=Ua(),D=n(T);{var M=x=>{var c=Ea(),v=n(c);a(c),G(()=>{Ee(c,1,`photo-slideshow__slide photo-slideshow__slide--active ${e(P)??""}`,"svelte-ci60j3"),de(v,"src",e(U))}),d(x,c)},C=x=>{var c=Aa();d(x,c)};B(D,x=>{e(U)?x(M):x(C,!1)})}a(T),d(o,T),ae()}var Fa=m('<div class="news-headlines__empty svelte-15lg0ov"><span>No headlines available</span></div>'),Ga=m('<li class="news-headlines__compact-item svelte-15lg0ov"><span class="news-headlines__category-badge svelte-15lg0ov"> </span> <span class="news-headlines__compact-title svelte-15lg0ov"> </span> <span class="news-headlines__age svelte-15lg0ov"> </span></li>'),Oa=m('<ul class="news-headlines__compact-list svelte-15lg0ov"></ul>'),Ba=m('<p class="news-headlines__summary svelte-15lg0ov"> </p>'),Ya=m('<li class="news-headlines__item svelte-15lg0ov"><div class="news-headlines__meta svelte-15lg0ov"><span class="news-headlines__category-badge svelte-15lg0ov"> </span> <span class="news-headlines__source svelte-15lg0ov"> </span> <span class="news-headlines__age svelte-15lg0ov"> </span></div> <p class="news-headlines__title svelte-15lg0ov"> </p> <!></li>'),Va=m('<ul class="news-headlines__list svelte-15lg0ov"></ul>'),Ka=m("<div><!></div>");function Za(o,t){te(t,!1);const s=ye();let _=J(t,"headlines",24,()=>[]),i=J(t,"maxItems",8,5),y=J(t,"compact",8,!1);function r(M){const C=Math.max(0,Date.now()-M),x=Math.floor(C/6e4);if(x<60)return`${x}m ago`;const c=Math.floor(x/60);return c<24?`${c}h ago`:`${Math.floor(c/24)}d ago`}we(()=>(F(_()),F(i())),()=>{k(s,_().slice(0,i()))}),Xe(),Ge();var l=Ka();let P;var W=n(l);{var U=M=>{var C=Fa();d(M,C)},T=M=>{var C=Oa();je(C,5,()=>e(s),x=>x.id,(x,c)=>{var v=Ga(),h=n(v),$=n(h,!0);a(h);var g=f(h,2),b=n(g,!0);a(g);var u=f(g,2),N=n(u,!0);a(u),a(v),G(A=>{I($,(e(c),p(()=>e(c).category))),I(b,(e(c),p(()=>e(c).title))),I(N,A)},[()=>(e(c),p(()=>r(e(c).published)))]),d(x,v)}),a(C),d(M,C)},D=M=>{var C=Va();je(C,5,()=>e(s),x=>x.id,(x,c)=>{var v=Ya(),h=n(v),$=n(h),g=n($,!0);a($);var b=f($,2),u=n(b,!0);a(b);var N=f(b,2),A=n(N,!0);a(N),a(h);var K=f(h,2),Y=n(K,!0);a(K);var L=f(K,2);{var S=q=>{var V=Ba(),H=n(V,!0);a(V),G(()=>I(H,(e(c),p(()=>e(c).summary)))),d(q,V)};B(L,q=>{e(c),p(()=>e(c).summary)&&q(S)})}a(v),G(q=>{I(g,(e(c),p(()=>e(c).category))),I(u,(e(c),p(()=>e(c).source))),I(A,q),I(Y,(e(c),p(()=>e(c).title)))},[()=>(e(c),p(()=>r(e(c).published)))]),d(x,v)}),a(C),d(M,C)};B(W,M=>{e(s),p(()=>e(s).length===0)?M(U):y()?M(T,1):M(D,!1)})}a(l),G(()=>P=Ee(l,1,"news-headlines svelte-15lg0ov",null,P,{"news-headlines--compact":y()})),d(o,l),ae()}var Xa=m('<div class="sports-scores__empty svelte-1xs1y9r"><span>No games available</span></div>'),Ja=m('<span class="sports-scores__live-badge svelte-1xs1y9r">LIVE</span>'),Qa=m('<li class="sports-scores__compact-item svelte-1xs1y9r"><span class="sports-scores__league-badge svelte-1xs1y9r"> </span> <!> <span class="sports-scores__compact-matchup svelte-1xs1y9r"> </span> <span class="sports-scores__compact-status svelte-1xs1y9r"> </span></li>'),es=m('<ul class="sports-scores__compact-list svelte-1xs1y9r"></ul>'),ts=m('<span class="sports-scores__period svelte-1xs1y9r"> </span>'),as=m('<span class="sports-scores__live-badge svelte-1xs1y9r">LIVE</span> <!>',1),ss=m('<span class="sports-scores__status svelte-1xs1y9r"> </span>'),ns=m('<li><div class="sports-scores__header svelte-1xs1y9r"><span class="sports-scores__league-badge svelte-1xs1y9r"> </span> <!></div> <div class="sports-scores__matchup svelte-1xs1y9r"><div class="sports-scores__team svelte-1xs1y9r"><span class="sports-scores__team-name svelte-1xs1y9r"> </span> <span class="sports-scores__score svelte-1xs1y9r"> </span></div> <div class="sports-scores__team svelte-1xs1y9r"><span class="sports-scores__team-name svelte-1xs1y9r"> </span> <span class="sports-scores__score svelte-1xs1y9r"> </span></div></div></li>'),rs=m('<ul class="sports-scores__list svelte-1xs1y9r"></ul>'),is=m("<div><!></div>");function ls(o,t){te(t,!1);const s=ye(),_=ye(),i=ye();let y=J(t,"games",24,()=>[]),r=J(t,"compact",8,!1);function l(x){return x.status==="in_progress"?x.period||"LIVE":x.status==="final"?"Final":x.status==="scheduled"?P(x.startTime):x.status==="postponed"?"PPD":x.status==="cancelled"?"Cancelled":x.status}function P(x){const c=new Date(x),v=c.getHours(),h=c.getMinutes().toString().padStart(2,"0"),$=v>=12?"PM":"AM";return`${v%12||12}:${h} ${$}`}we(()=>F(y()),()=>{k(s,y().filter(x=>x.status==="in_progress"))}),we(()=>F(y()),()=>{k(_,y().filter(x=>x.status!=="in_progress"))}),we(()=>(e(s),e(_)),()=>{k(i,[...e(s),...e(_)])}),Xe(),Ge();var W=is();let U;var T=n(W);{var D=x=>{var c=Xa();d(x,c)},M=x=>{var c=es();je(c,5,()=>e(i),v=>v.id,(v,h)=>{var $=Qa(),g=n($),b=n(g,!0);a(g);var u=f(g,2);{var N=S=>{var q=Ja();d(S,q)};B(u,S=>{e(h),p(()=>e(h).status==="in_progress")&&S(N)})}var A=f(u,2),K=n(A);a(A);var Y=f(A,2),L=n(Y,!0);a(Y),a($),G((S,q)=>{I(b,S),I(K,`${e(h),p(()=>e(h).awayTeam)??""}
            ${e(h),p(()=>e(h).awayScore)??""} – ${e(h),p(()=>e(h).homeScore)??""}
            ${e(h),p(()=>e(h).homeTeam)??""}`),I(L,q)},[()=>(e(h),p(()=>e(h).league.toUpperCase())),()=>(e(h),p(()=>l(e(h))))]),d(v,$)}),a(c),d(x,c)},C=x=>{var c=rs();je(c,5,()=>e(i),v=>v.id,(v,h)=>{var $=ns();let g;var b=n($),u=n(b),N=n(u,!0);a(u);var A=f(u,2);{var K=re=>{var ve=as(),be=f(le(ve),2);{var ie=ue=>{var Te=ts(),oe=n(Te,!0);a(Te),G(()=>I(oe,(e(h),p(()=>e(h).period)))),d(ue,Te)};B(be,ue=>{e(h),p(()=>e(h).period)&&ue(ie)})}d(re,ve)},Y=re=>{var ve=ss(),be=n(ve,!0);a(ve),G(ie=>I(be,ie),[()=>(e(h),p(()=>l(e(h))))]),d(re,ve)};B(A,re=>{e(h),p(()=>e(h).status==="in_progress")?re(K):re(Y,!1)})}a(b);var L=f(b,2),S=n(L),q=n(S),V=n(q,!0);a(q);var H=f(q,2),w=n(H,!0);a(H),a(S);var R=f(S,2),z=n(R),E=n(z,!0);a(z);var Q=f(z,2),X=n(Q,!0);a(Q),a(R),a(L),a($),G(re=>{g=Ee($,1,"sports-scores__item svelte-1xs1y9r",null,g,{"sports-scores__item--live":e(h).status==="in_progress"}),I(N,re),I(V,(e(h),p(()=>e(h).awayTeam))),I(w,(e(h),p(()=>e(h).awayScore))),I(E,(e(h),p(()=>e(h).homeTeam))),I(X,(e(h),p(()=>e(h).homeScore)))},[()=>(e(h),p(()=>e(h).league.toUpperCase()))]),d(v,$)}),a(c),d(x,c)};B(T,x=>{e(i),p(()=>e(i).length===0)?x(D):r()?x(M,1):x(C,!1)})}a(W),G(()=>U=Ee(W,1,"sports-scores svelte-1xs1y9r",null,U,{"sports-scores--compact":r()})),d(o,W),ae()}var os=m('<div class="ha-devices__empty svelte-1932y27"><span>No devices available</span></div>'),ds=m('<li><span class="ha-devices__name svelte-1932y27"> </span> <span> </span></li>'),cs=m('<section class="ha-devices__group svelte-1932y27"><h3 class="ha-devices__group-label svelte-1932y27">Lights</h3> <ul class="ha-devices__list svelte-1932y27"></ul></section>'),vs=m('<li><span class="ha-devices__name svelte-1932y27"> </span> <span> </span></li>'),us=m('<section class="ha-devices__group svelte-1932y27"><h3 class="ha-devices__group-label svelte-1932y27">Switches</h3> <ul class="ha-devices__list svelte-1932y27"></ul></section>'),_s=m('<li><span class="ha-devices__name svelte-1932y27"> </span> <span> </span></li>'),gs=m('<section class="ha-devices__group svelte-1932y27"><h3 class="ha-devices__group-label svelte-1932y27">Locks</h3> <ul class="ha-devices__list svelte-1932y27"></ul></section>'),hs=m('<li class="ha-devices__item svelte-1932y27"><span class="ha-devices__name svelte-1932y27"> </span> <span class="ha-devices__state ha-devices__state--climate svelte-1932y27"> </span></li>'),fs=m('<section class="ha-devices__group svelte-1932y27"><h3 class="ha-devices__group-label svelte-1932y27">Climate</h3> <ul class="ha-devices__list svelte-1932y27"></ul></section>'),ps=m('<li class="ha-devices__item svelte-1932y27"><span class="ha-devices__name svelte-1932y27"> </span> <span class="ha-devices__state ha-devices__state--sensor svelte-1932y27"> </span></li>'),ms=m('<section class="ha-devices__group svelte-1932y27"><h3 class="ha-devices__group-label svelte-1932y27">Sensors</h3> <ul class="ha-devices__list svelte-1932y27"></ul></section>'),ws=m("<!> <!> <!> <!> <!>",1),ys=m('<div class="ha-devices svelte-1932y27"><!></div>');function bs(o,t){te(t,!1);const s=ye(),_=ye(),i=ye(),y=ye();let r=J(t,"devices",24,()=>[]),l=J(t,"sensors",24,()=>[]);function P(c){return c.state.charAt(0).toUpperCase()+c.state.slice(1)}function W(c){return c.state==="on"||c.state==="unlocked"||c.state==="open"}function U(c){return c.state==="unlocked"||c.state==="open"}function T(c){const v=c.attributes.current_temperature,h=c.attributes.temperature;return v!==void 0&&h!==void 0?`${v}° / ${h}°`:P(c)}we(()=>F(r()),()=>{k(s,r().filter(c=>c.domain==="light"))}),we(()=>F(r()),()=>{k(_,r().filter(c=>c.domain==="switch"))}),we(()=>F(r()),()=>{k(i,r().filter(c=>c.domain==="lock"))}),we(()=>F(r()),()=>{k(y,r().filter(c=>c.domain==="climate"))}),Xe(),Ge();var D=ys(),M=n(D);{var C=c=>{var v=os();d(c,v)},x=c=>{var v=ws(),h=le(v);{var $=S=>{var q=cs(),V=f(n(q),2);je(V,5,()=>e(s),H=>H.entity_id,(H,w)=>{var R=ds();let z;var E=n(R),Q=n(E,!0);a(E);var X=f(E,2);let re;var ve=n(X,!0);a(X),a(R),G((be,ie)=>{z=Ee(R,1,"ha-devices__item svelte-1932y27",null,z,be),I(Q,(e(w),p(()=>e(w).friendly_name))),re=Ee(X,1,"ha-devices__state svelte-1932y27",null,re,{"ha-devices__state--on":e(w).state==="on","ha-devices__state--off":e(w).state==="off"}),I(ve,ie)},[()=>({"ha-devices__item--active":W(e(w)),"ha-devices__item--warning":U(e(w))}),()=>(e(w),p(()=>P(e(w))))]),d(H,R)}),a(V),a(q),d(S,q)};B(h,S=>{e(s),p(()=>e(s).length>0)&&S($)})}var g=f(h,2);{var b=S=>{var q=us(),V=f(n(q),2);je(V,5,()=>e(_),H=>H.entity_id,(H,w)=>{var R=vs();let z;var E=n(R),Q=n(E,!0);a(E);var X=f(E,2);let re;var ve=n(X,!0);a(X),a(R),G((be,ie)=>{z=Ee(R,1,"ha-devices__item svelte-1932y27",null,z,be),I(Q,(e(w),p(()=>e(w).friendly_name))),re=Ee(X,1,"ha-devices__state svelte-1932y27",null,re,{"ha-devices__state--on":e(w).state==="on","ha-devices__state--off":e(w).state==="off"}),I(ve,ie)},[()=>({"ha-devices__item--active":W(e(w)),"ha-devices__item--warning":U(e(w))}),()=>(e(w),p(()=>P(e(w))))]),d(H,R)}),a(V),a(q),d(S,q)};B(g,S=>{e(_),p(()=>e(_).length>0)&&S(b)})}var u=f(g,2);{var N=S=>{var q=gs(),V=f(n(q),2);je(V,5,()=>e(i),H=>H.entity_id,(H,w)=>{var R=_s();let z;var E=n(R),Q=n(E,!0);a(E);var X=f(E,2);let re;var ve=n(X,!0);a(X),a(R),G((be,ie,ue)=>{z=Ee(R,1,"ha-devices__item svelte-1932y27",null,z,be),I(Q,(e(w),p(()=>e(w).friendly_name))),re=Ee(X,1,"ha-devices__state svelte-1932y27",null,re,ie),I(ve,ue)},[()=>({"ha-devices__item--active":W(e(w)),"ha-devices__item--warning":U(e(w))}),()=>({"ha-devices__state--locked":e(w).state==="locked","ha-devices__state--warning":U(e(w))}),()=>(e(w),p(()=>P(e(w))))]),d(H,R)}),a(V),a(q),d(S,q)};B(u,S=>{e(i),p(()=>e(i).length>0)&&S(N)})}var A=f(u,2);{var K=S=>{var q=fs(),V=f(n(q),2);je(V,5,()=>e(y),H=>H.entity_id,(H,w)=>{var R=hs(),z=n(R),E=n(z,!0);a(z);var Q=f(z,2),X=n(Q,!0);a(Q),a(R),G(re=>{I(E,(e(w),p(()=>e(w).friendly_name))),I(X,re)},[()=>(e(w),p(()=>T(e(w))))]),d(H,R)}),a(V),a(q),d(S,q)};B(A,S=>{e(y),p(()=>e(y).length>0)&&S(K)})}var Y=f(A,2);{var L=S=>{var q=ms(),V=f(n(q),2);je(V,5,l,H=>H.entity_id,(H,w)=>{var R=ps(),z=n(R),E=n(z,!0);a(z);var Q=f(z,2),X=n(Q);a(Q),a(R),G(()=>{I(E,(e(w),p(()=>e(w).friendly_name))),I(X,`${e(w),p(()=>e(w).state)??""}${e(w),p(()=>e(w).attributes.unit_of_measurement?` ${e(w).attributes.unit_of_measurement}`:"")??""}`)}),d(H,R)}),a(V),a(q),d(S,q)};B(Y,S=>{F(l()),p(()=>l().length>0)&&S(L)})}d(c,v)};B(M,c=>{F(r()),F(l()),p(()=>r().length===0&&l().length===0)?c(C):c(x,!1)})}a(D),d(o,D),ae()}var xs=Rt('<path fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></path>'),ks=Rt('<svg class="sparkline svelte-8cklv6" preserveAspectRatio="none"><!></svg>');function Zt(o,t){te(t,!1);const s=ye();let _=J(t,"data",24,()=>[]),i=J(t,"width",8,120),y=J(t,"height",8,32),r=J(t,"positive",8,!0);function l(T,D,M){if(T.length<2)return"";const C=Math.min(...T),c=Math.max(...T)-C||1,v=1,h=M-v*2;return T.map(($,g)=>{const b=g/(T.length-1)*D,u=v+h-($-C)/c*h;return`${g===0?"M":"L"}${b.toFixed(1)},${u.toFixed(1)}`}).join(" ")}we(()=>(F(_()),F(i()),F(y())),()=>{k(s,l(_(),i(),y()))}),Xe(),Ge();var P=ks(),W=n(P);{var U=T=>{var D=xs();G(()=>{de(D,"d",e(s)),de(D,"stroke",r()?"var(--alert-success, hsl(160, 45%, 45%))":"var(--alert-urgent, hsl(0, 60%, 55%))")}),d(T,D)};B(W,T=>{e(s)&&T(U)})}a(P),G(()=>{de(P,"viewBox",`0 0 ${i()??""} ${y()??""}`),de(P,"width",i()),de(P,"height",y())}),d(o,P),ae()}var Ss=m('<div class="crypto-widget__empty svelte-fjg0w2"><span>No crypto data available</span></div>'),Ms=m('<div class="crypto-widget__chart svelte-fjg0w2"><!></div>'),Ns=m('<span><span class="crypto-widget__change-label svelte-fjg0w2"> </span> </span>'),Hs=m('<div class="crypto-widget__row svelte-fjg0w2"><div class="crypto-widget__info svelte-fjg0w2"><span class="crypto-widget__symbol svelte-fjg0w2"> </span> <span class="crypto-widget__name svelte-fjg0w2"> </span></div> <!> <div class="crypto-widget__values svelte-fjg0w2"><span class="crypto-widget__price svelte-fjg0w2"> </span> <div class="crypto-widget__changes svelte-fjg0w2"></div></div></div>'),Ws=m('<div class="crypto-widget__list svelte-fjg0w2"></div>'),js=m('<div class="crypto-widget svelte-fjg0w2"><!></div>');function Ds(o,t){te(t,!1);const s=ye();let _=J(t,"coins",24,()=>[]),i=J(t,"show1h",8,!1),y=J(t,"show24h",8,!0),r=J(t,"show7d",8,!1),l=J(t,"showSparkline",8,!0);function P(v,h){return h==="1h"?v.change_1h:h==="7d"?v.change_7d:v.change_24h}function W(v){const h=v.sparkline??[];return h.length===0?[]:h}function U(v){return v>=1e3?v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):v>=1?v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4}):v.toLocaleString("en-US",{minimumFractionDigits:4,maximumFractionDigits:8})}function T(v){return`${v>=0?"+":""}${v.toFixed(2)}%`}function D(v){return v>0?"crypto-widget__change--positive":v<0?"crypto-widget__change--negative":"crypto-widget__change--neutral"}we(()=>(F(i()),F(y()),F(r())),()=>{k(s,[i()&&{key:"1h",label:"1H"},y()&&{key:"24h",label:"24H"},r()&&{key:"7d",label:"7D"}].filter(Boolean))}),Xe(),Ge();var M=js(),C=n(M);{var x=v=>{var h=Ss();d(v,h)},c=v=>{var h=Ws();je(h,5,_,$=>$.id,($,g)=>{const b=me(()=>(e(g),p(()=>W(e(g)))));var u=Hs(),N=n(u),A=n(N),K=n(A,!0);a(A);var Y=f(A,2),L=n(Y,!0);a(Y),a(N);var S=f(N,2);{var q=z=>{var E=Ms(),Q=n(E);{let X=me(()=>(e(g),p(()=>e(g).change_24h>=0)));Zt(Q,{get data(){return e(b)},width:80,height:28,get positive(){return e(X)}})}a(E),d(z,E)};B(S,z=>{F(l()),F(e(b)),p(()=>l()&&e(b).length>=2)&&z(q)})}var V=f(S,2),H=n(V),w=n(H);a(H);var R=f(H,2);je(R,5,()=>e(s),z=>z.key,(z,E)=>{const Q=me(()=>(e(g),e(E),p(()=>P(e(g),e(E).key))));var X=Ns(),re=n(X),ve=n(re,!0);a(re);var be=f(re);a(X),G((ie,ue)=>{Ee(X,1,`crypto-widget__change ${ie??""}`,"svelte-fjg0w2"),de(X,"title",`${e(E),p(()=>e(E).label)??""} change`),I(ve,(e(E),p(()=>e(E).label))),I(be,` ${ue??""}`)},[()=>(F(e(Q)),p(()=>D(e(Q)))),()=>(F(e(Q)),p(()=>T(e(Q))))]),d(z,X)}),a(R),a(V),a(u),G((z,E)=>{I(K,z),I(L,(e(g),p(()=>e(g).name))),I(w,`$${E??""}`)},[()=>(e(g),p(()=>e(g).symbol.toUpperCase())),()=>(e(g),p(()=>U(e(g).price)))]),d($,u)}),a(h),d(v,h)};B(C,v=>{F(_()),p(()=>_().length===0)?v(x):v(c,!1)})}a(M),d(o,M),ae()}function Xt(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["circle",{cx:"12",cy:"12",r:"4"}],["path",{d:"M12 2v2"}],["path",{d:"M12 20v2"}],["path",{d:"m4.93 4.93 1.41 1.41"}],["path",{d:"m17.66 17.66 1.41 1.41"}],["path",{d:"M2 12h2"}],["path",{d:"M20 12h2"}],["path",{d:"m6.34 17.66-1.41 1.41"}],["path",{d:"m19.07 4.93-1.41 1.41"}]];Me(o,Ne({name:"sun"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Cs(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["circle",{cx:"12",cy:"12",r:"4"}],["path",{d:"M12 4h.01"}],["path",{d:"M20 12h.01"}],["path",{d:"M12 20h.01"}],["path",{d:"M4 12h.01"}],["path",{d:"M17.657 6.343h.01"}],["path",{d:"M17.657 17.657h.01"}],["path",{d:"M6.343 17.657h.01"}],["path",{d:"M6.343 6.343h.01"}]];Me(o,Ne({name:"sun-dim"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Ps(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M12 2v2"}],["path",{d:"m4.93 4.93 1.41 1.41"}],["path",{d:"M20 12h2"}],["path",{d:"m19.07 4.93-1.41 1.41"}],["path",{d:"M15.947 12.65a4 4 0 0 0-5.925-4.128"}],["path",{d:"M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"}]];Me(o,Ne({name:"cloud-sun"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Ts(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"}]];Me(o,Ne({name:"cloud"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function zs(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M17.5 12a1 1 0 1 1 0 9H9.006a7 7 0 1 1 6.702-9z"}],["path",{d:"M21.832 9A3 3 0 0 0 19 7h-2.207a5.5 5.5 0 0 0-10.72.61"}]];Me(o,Ne({name:"cloudy"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Is(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"}],["path",{d:"M16 17H7"}],["path",{d:"M17 21H9"}]];Me(o,Ne({name:"cloud-fog"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Ls(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"m5.2 6.2 1.4 1.4"}],["path",{d:"M2 13h2"}],["path",{d:"M20 13h2"}],["path",{d:"m17.4 7.6 1.4-1.4"}],["path",{d:"M22 17H2"}],["path",{d:"M22 21H2"}],["path",{d:"M16 13a4 4 0 0 0-8 0"}],["path",{d:"M12 5V2.5"}]];Me(o,Ne({name:"haze"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function $s(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"}],["path",{d:"M8 19v1"}],["path",{d:"M8 14v1"}],["path",{d:"M16 19v1"}],["path",{d:"M16 14v1"}],["path",{d:"M12 21v1"}],["path",{d:"M12 16v1"}]];Me(o,Ne({name:"cloud-drizzle"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function qs(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"}],["path",{d:"M16 14v6"}],["path",{d:"M8 14v6"}],["path",{d:"M12 16v6"}]];Me(o,Ne({name:"cloud-rain"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Es(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M12 2v2"}],["path",{d:"m4.93 4.93 1.41 1.41"}],["path",{d:"M20 12h2"}],["path",{d:"m19.07 4.93-1.41 1.41"}],["path",{d:"M15.947 12.65a4 4 0 0 0-5.925-4.128"}],["path",{d:"M3 20a5 5 0 1 1 8.9-4H13a3 3 0 0 1 2 5.24"}],["path",{d:"M11 20v2"}],["path",{d:"M7 19v2"}]];Me(o,Ne({name:"cloud-sun-rain"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function As(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"}],["path",{d:"M16 14v2"}],["path",{d:"M8 14v2"}],["path",{d:"M16 20h.01"}],["path",{d:"M8 20h.01"}],["path",{d:"M12 16v2"}],["path",{d:"M12 22h.01"}]];Me(o,Ne({name:"cloud-hail"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Us(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"}],["path",{d:"M8 15h.01"}],["path",{d:"M8 19h.01"}],["path",{d:"M12 17h.01"}],["path",{d:"M12 21h.01"}],["path",{d:"M16 15h.01"}],["path",{d:"M16 19h.01"}]];Me(o,Ne({name:"cloud-snow"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Rs(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"m10 20-1.25-2.5L6 18"}],["path",{d:"M10 4 8.75 6.5 6 6"}],["path",{d:"m14 20 1.25-2.5L18 18"}],["path",{d:"m14 4 1.25 2.5L18 6"}],["path",{d:"m17 21-3-6h-4"}],["path",{d:"m17 3-3 6 1.5 3"}],["path",{d:"M2 12h6.5L10 9"}],["path",{d:"m20 10-1.5 2 1.5 2"}],["path",{d:"M22 12h-6.5L14 15"}],["path",{d:"m4 10 1.5 2L4 14"}],["path",{d:"m7 21 3-6-1.5-3"}],["path",{d:"m7 3 3 6h4"}]];Me(o,Ne({name:"snowflake"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Fs(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"}],["path",{d:"m13 12-3 5h4l-3 5"}]];Me(o,Ne({name:"cloud-lightning"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Gs(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"}]];Me(o,Ne({name:"thermometer"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}var Os=m('<span class="weather-icon svelte-1i78a4g" aria-hidden="true"><!></span>');function Dt(o,t){let s=J(t,"size",3,24);function _(u){const N=u.toLowerCase();return N.includes("thunderstorm")?"cloud-lightning":N.includes("freezing rain")||N.includes("freezing drizzle")?"cloud-hail":N.includes("snow shower")?"cloud-snow":N.includes("snow")||N.includes("snow grains")?"snowflake":N.includes("rain shower")?"cloud-sun-rain":N.includes("rain")||N.includes("drizzle")?"cloud-rain":N.includes("drizzle")?"cloud-drizzle":N.includes("fog")||N.includes("mist")?"cloud-fog":N.includes("haze")?"haze":N.includes("overcast")||N.includes("broken clouds")?"cloudy":N.includes("partly cloudy")||N.includes("scattered clouds")||N.includes("few clouds")?"cloud-sun":N.includes("mostly clear")?"sun-dim":N.includes("clear")?"sun":"thermometer"}let i=ge(()=>_(t.conditions));var y=Os(),r=n(y);{var l=u=>{Xt(u,{get size(){return s()}})},P=u=>{Cs(u,{get size(){return s()}})},W=u=>{Ps(u,{get size(){return s()}})},U=u=>{Ts(u,{get size(){return s()}})},T=u=>{zs(u,{get size(){return s()}})},D=u=>{Is(u,{get size(){return s()}})},M=u=>{Ls(u,{get size(){return s()}})},C=u=>{$s(u,{get size(){return s()}})},x=u=>{qs(u,{get size(){return s()}})},c=u=>{Es(u,{get size(){return s()}})},v=u=>{As(u,{get size(){return s()}})},h=u=>{Us(u,{get size(){return s()}})},$=u=>{Rs(u,{get size(){return s()}})},g=u=>{Fs(u,{get size(){return s()}})},b=u=>{Gs(u,{get size(){return s()}})};B(r,u=>{e(i)==="sun"?u(l):e(i)==="sun-dim"?u(P,1):e(i)==="cloud-sun"?u(W,2):e(i)==="cloud"?u(U,3):e(i)==="cloudy"?u(T,4):e(i)==="cloud-fog"?u(D,5):e(i)==="haze"?u(M,6):e(i)==="cloud-drizzle"?u(C,7):e(i)==="cloud-rain"?u(x,8):e(i)==="cloud-sun-rain"?u(c,9):e(i)==="cloud-hail"?u(v,10):e(i)==="cloud-snow"?u(h,11):e(i)==="snowflake"?u($,12):e(i)==="cloud-lightning"?u(g,13):u(b,!1)})}a(y),d(o,y)}var Bs=m('<div class="weather-widget__empty svelte-1l2lobr"><span>No weather data available</span></div>'),Ys=m('<div class="weather-widget__compact-row svelte-1l2lobr"><span class="weather-widget__compact-icon svelte-1l2lobr"><!></span> <span class="weather-widget__compact-temp svelte-1l2lobr"> </span> <span class="weather-widget__compact-conditions svelte-1l2lobr"> </span></div>'),Vs=m("<span> </span>"),Ks=m('<div class="weather-widget__forecast-row svelte-1l2lobr"><span class="weather-widget__forecast-day svelte-1l2lobr"> </span> <span class="weather-widget__forecast-icon svelte-1l2lobr"><!></span> <span class="weather-widget__forecast-conditions svelte-1l2lobr"> </span> <!> <span class="weather-widget__forecast-temps svelte-1l2lobr"><span class="weather-widget__forecast-high svelte-1l2lobr"> </span> <span class="weather-widget__forecast-sep svelte-1l2lobr">/</span> <span class="weather-widget__forecast-low svelte-1l2lobr"> </span></span></div>'),Zs=m('<div class="weather-widget__forecast svelte-1l2lobr"></div>'),Xs=m('<div class="weather-widget__current svelte-1l2lobr"><div class="weather-widget__hero svelte-1l2lobr"><span class="weather-widget__icon svelte-1l2lobr"><!></span> <span class="weather-widget__temp svelte-1l2lobr"> </span> <div class="weather-widget__conditions-block svelte-1l2lobr"><span class="weather-widget__conditions svelte-1l2lobr"> </span> <span class="weather-widget__feels-like svelte-1l2lobr"> </span></div></div> <div class="weather-widget__details svelte-1l2lobr"><span class="weather-widget__detail svelte-1l2lobr"><span class="weather-widget__detail-label svelte-1l2lobr">Humidity</span> <span class="weather-widget__detail-value svelte-1l2lobr"> </span></span></div></div> <!>',1),Js=m("<div><!></div>");function Qs(o,t){te(t,!1);let s=J(t,"current",8,null),_=J(t,"forecast",24,()=>[]),i=J(t,"compact",8,!1);function y(M){return`${Math.round(M)}°`}function r(M){return new Date(M+"T00:00:00").toLocaleDateString("en-US",{weekday:"short"})}Ge();var l=Js();let P;var W=n(l);{var U=M=>{var C=Bs();d(M,C)},T=M=>{var C=Ys(),x=n(C),c=n(x);Dt(c,{get conditions(){return F(s()),p(()=>s().conditions)},size:32}),a(x);var v=f(x,2),h=n(v,!0);a(v);var $=f(v,2),g=n($,!0);a($),a(C),G(b=>{I(h,b),I(g,(F(s()),p(()=>s().conditions)))},[()=>(F(s()),p(()=>y(s().temp)))]),d(M,C)},D=M=>{var C=Xs(),x=le(C),c=n(x),v=n(c),h=n(v);Dt(h,{get conditions(){return F(s()),p(()=>s().conditions)},size:40}),a(v);var $=f(v,2),g=n($,!0);a($);var b=f($,2),u=n(b),N=n(u,!0);a(u);var A=f(u,2),K=n(A);a(A),a(b),a(c);var Y=f(c,2),L=n(Y),S=f(n(L),2),q=n(S);a(S),a(L),a(Y),a(x);var V=f(x,2);{var H=w=>{var R=Zs();je(R,5,()=>(F(_()),p(()=>_().slice(0,5))),z=>z.date,(z,E)=>{var Q=Ks(),X=n(Q),re=n(X,!0);a(X);var ve=f(X,2),be=n(ve);Dt(be,{get conditions(){return e(E),p(()=>e(E).conditions)},size:16}),a(ve);var ie=f(ve,2),ue=n(ie,!0);a(ie);var Te=f(ie,2);{var oe=_e=>{var fe=Vs();let ze;var Ae=n(fe);a(fe),G(()=>{ze=Ee(fe,1,"weather-widget__forecast-rain svelte-1l2lobr",null,ze,{"weather-widget__forecast-rain--high":e(E).precipChance>=50}),I(Ae,`${e(E),p(()=>e(E).precipChance)??""}%`)}),d(_e,fe)};B(Te,_e=>{e(E),p(()=>e(E).precipChance!=null)&&_e(oe)})}var Ie=f(Te,2),Re=n(Ie),Oe=n(Re,!0);a(Re);var he=f(Re,4),ee=n(he,!0);a(he),a(Ie),a(Q),G((_e,fe,ze)=>{I(re,_e),I(ue,(e(E),p(()=>e(E).conditions))),I(Oe,fe),I(ee,ze)},[()=>(e(E),p(()=>r(e(E).date))),()=>(e(E),p(()=>y(e(E).high))),()=>(e(E),p(()=>y(e(E).low)))]),d(z,Q)}),a(R),d(w,R)};B(V,w=>{F(_()),p(()=>_().length>0)&&w(H)})}G((w,R)=>{I(g,w),I(N,(F(s()),p(()=>s().conditions))),I(K,`Feels like ${R??""}`),I(q,`${F(s()),p(()=>s().humidity)??""}%`)},[()=>(F(s()),p(()=>y(s().temp))),()=>(F(s()),p(()=>y(s().feelsLike)))]),d(M,C)};B(W,M=>{s()?i()?M(T,1):M(D,!1):M(U)})}a(l),G(()=>P=Ee(l,1,"weather-widget svelte-1l2lobr",null,P,{"weather-widget--compact":i()})),d(o,l),ae()}var en=m('<div class="calendar-widget__empty svelte-c2xea9"><span>No calendar events</span></div>'),tn=m('<span class="calendar-widget__compact-time calendar-widget__compact-time--allday svelte-c2xea9">All Day</span>'),an=m('<span class="calendar-widget__compact-time svelte-c2xea9"> </span>'),sn=m('<li class="calendar-widget__compact-item svelte-c2xea9"><!> <span class="calendar-widget__compact-title svelte-c2xea9"> </span></li>'),nn=m('<ul class="calendar-widget__compact-list svelte-c2xea9"></ul>'),rn=m('<span class="calendar-widget__allday-badge svelte-c2xea9">All Day</span>'),ln=m('<span class="calendar-widget__event-location svelte-c2xea9"> </span>'),on=m('<span class="calendar-widget__event-dot svelte-c2xea9"></span>'),dn=m('<li><div class="calendar-widget__event-time svelte-c2xea9"><!></div> <div class="calendar-widget__event-body svelte-c2xea9"><span class="calendar-widget__event-title svelte-c2xea9"> </span> <!></div> <!></li>'),cn=m('<div class="calendar-widget__day"><div class="calendar-widget__day-header svelte-c2xea9"> </div> <ul class="calendar-widget__event-list svelte-c2xea9"></ul></div>'),vn=m('<div class="calendar-widget__groups svelte-c2xea9"></div>'),un=m("<div><!></div>");function _n(o,t){te(t,!1);const s=ye(),_=ye();let i=J(t,"events",24,()=>[]),y=J(t,"compact",8,!1);function r(h){const $=new Date(h),g=$.getHours(),b=$.getMinutes().toString().padStart(2,"0"),u=g>=12?"PM":"AM";return`${g%12||12}:${b} ${u}`}function l(){const h=new Date;return`${h.getFullYear()}-${String(h.getMonth()+1).padStart(2,"0")}-${String(h.getDate()).padStart(2,"0")}`}function P(h){return h.allDay?h.end.slice(0,10)>l():new Date(h.end).getTime()>=Date.now()}function W(h){const $=h.slice(0,10),g=l(),b=new Date;b.setDate(b.getDate()+1);const u=`${b.getFullYear()}-${String(b.getMonth()+1).padStart(2,"0")}-${String(b.getDate()).padStart(2,"0")}`;if($===g)return"Today";if($===u)return"Tomorrow";const[N,A,K]=$.split("-").map(Number);return new Date(N,A-1,K).toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"})}function U(h,$){return h.filter(P).sort((g,b)=>new Date(g.start).getTime()-new Date(b.start).getTime()).slice(0,$)}function T(h){const $=h.filter(P).sort((b,u)=>new Date(b.start).getTime()-new Date(u.start).getTime()),g=new Map;for(const b of $){const u=W(b.start);g.has(u)||g.set(u,[]),g.get(u).push(b)}return Array.from(g.entries()).map(([b,u])=>({label:b,events:u}))}we(()=>F(i()),()=>{k(s,U(i(),5))}),we(()=>F(i()),()=>{k(_,T(i()))}),Xe(),Ge();var D=un();let M;var C=n(D);{var x=h=>{var $=en();d(h,$)},c=h=>{var $=nn();je($,5,()=>e(s),g=>g.id,(g,b)=>{var u=sn(),N=n(u);{var A=S=>{var q=tn();d(S,q)},K=S=>{var q=an(),V=n(q,!0);a(q),G(H=>I(V,H),[()=>(e(b),p(()=>r(e(b).start)))]),d(S,q)};B(N,S=>{e(b),p(()=>e(b).allDay)?S(A):S(K,!1)})}var Y=f(N,2),L=n(Y,!0);a(Y),a(u),G(()=>I(L,(e(b),p(()=>e(b).title)))),d(g,u)}),a($),d(h,$)},v=h=>{var $=vn();je($,5,()=>e(_),g=>g.label,(g,b)=>{var u=cn(),N=n(u),A=n(N,!0);a(N);var K=f(N,2);je(K,5,()=>(e(b),p(()=>e(b).events)),Y=>Y.id,(Y,L)=>{var S=dn();let q;var V=n(S),H=n(V);{var w=ie=>{var ue=rn();d(ie,ue)},R=ie=>{var ue=na();G(Te=>I(ue,Te),[()=>(e(L),p(()=>r(e(L).start)))]),d(ie,ue)};B(H,ie=>{e(L),p(()=>e(L).allDay)?ie(w):ie(R,!1)})}a(V);var z=f(V,2),E=n(z),Q=n(E,!0);a(E);var X=f(E,2);{var re=ie=>{var ue=ln(),Te=n(ue,!0);a(ue),G(()=>I(Te,(e(L),p(()=>e(L).location)))),d(ie,ue)};B(X,ie=>{e(L),p(()=>e(L).location)&&ie(re)})}a(z);var ve=f(z,2);{var be=ie=>{var ue=on();G(()=>ot(ue,`background:${e(L),p(()=>e(L).color)??""}`)),d(ie,ue)};B(ve,ie=>{e(L),p(()=>e(L).color)&&ie(be)})}a(S),G(()=>{q=Ee(S,1,"calendar-widget__event svelte-c2xea9",null,q,{"calendar-widget__event--allday":e(L).allDay}),I(Q,(e(L),p(()=>e(L).title)))}),d(Y,S)}),a(K),a(u),G(()=>I(A,(e(b),p(()=>e(b).label)))),d(g,u)}),a($),d(h,$)};B(C,h=>{F(i()),p(()=>i().length===0)?h(x):y()?h(c,1):h(v,!1)})}a(D),G(()=>M=Ee(D,1,"calendar-widget svelte-c2xea9",null,M,{"calendar-widget--compact":y()})),d(o,D),ae()}var gn=m('<div class="allergies-widget__location svelte-fd4qfr"> </div>'),hn=m('<span class="allergies-widget__trigger-chip svelte-fd4qfr"> </span>'),fn=m('<div class="allergies-widget__triggers svelte-fd4qfr"></div>'),pn=m('<div class="allergies-widget__period svelte-fd4qfr"><span class="allergies-widget__period-label svelte-fd4qfr"> </span> <span class="allergies-widget__period-index svelte-fd4qfr"> </span></div>'),mn=m('<div class="allergies-widget__forecast svelte-fd4qfr"></div>'),wn=m('<div class="allergies-widget__empty svelte-fd4qfr">No pollen data available</div>'),yn=m('<div class="allergies-widget svelte-fd4qfr"><div class="allergies-widget__header svelte-fd4qfr"><span class="allergies-widget__title svelte-fd4qfr">Pollen</span> <span class="allergies-widget__label svelte-fd4qfr"> </span></div> <!> <div class="allergies-widget__index-row svelte-fd4qfr"><span class="allergies-widget__index svelte-fd4qfr"> </span> <span class="allergies-widget__scale svelte-fd4qfr">/12</span></div> <div class="allergies-widget__gauge svelte-fd4qfr"><div class="allergies-widget__bar svelte-fd4qfr"></div></div> <!> <!></div>');function bn(o,t){te(t,!1);const s=ye(),_=ye();let i=J(t,"index",8,0),y=J(t,"level",8,"Low"),r=J(t,"color",8,"#4caf50"),l=J(t,"location",8,""),P=J(t,"triggers",24,()=>[]),W=J(t,"periods",24,()=>[]);function U(L){return L<=2.4?"#4caf50":L<=4.8?"#8bc34a":L<=7.2?"#ffeb3b":L<=9.6?"#ff9800":"#f44336"}we(()=>F(P()),()=>{k(s,P().reduce((L,S)=>{const q=S.plantType||"Other";return L[q]||(L[q]=[]),L[q].push(S.name),L},{}))}),we(()=>F(i()),()=>{k(_,`${Math.min(100,i()/12*100)}%`)}),Xe(),Ge();var T=yn(),D=n(T),M=f(n(D),2),C=n(M,!0);a(M),a(D);var x=f(D,2);{var c=L=>{var S=gn(),q=n(S,!0);a(S),G(()=>I(q,l())),d(L,S)};B(x,L=>{l()&&L(c)})}var v=f(x,2),h=n(v),$=n(h,!0);a(h),ft(2),a(v);var g=f(v,2),b=n(g);a(g);var u=f(g,2);{var N=L=>{var S=fn();je(S,5,()=>(e(s),p(()=>Object.entries(e(s)))),([q,V])=>q,(q,V)=>{var H=ge(()=>ra(e(V),2));let w=()=>e(H)[0],R=()=>e(H)[1];var z=hn(),E=n(z);a(z),G(Q=>I(E,`${w()??""}: ${Q??""}`),[()=>(R(),p(()=>R().join(", ")))]),d(q,z)}),a(S),d(L,S)};B(u,L=>{F(P()),p(()=>P().length>0)&&L(N)})}var A=f(u,2);{var K=L=>{var S=mn();je(S,5,W,q=>q.type,(q,V)=>{var H=pn(),w=n(H),R=n(w,!0);a(w);var z=f(w,2),E=n(z,!0);a(z),a(H),G((Q,X)=>{I(R,(e(V),p(()=>e(V).type))),ot(z,`color: ${Q??""}`),I(E,X)},[()=>(e(V),p(()=>U(e(V).index))),()=>(e(V),p(()=>e(V).index.toFixed(1)))]),d(q,H)}),a(S),d(L,S)},Y=L=>{var S=wn();d(L,S)};B(A,L=>{F(W()),p(()=>W().length>0)?L(K):L(Y,!1)})}a(T),G(L=>{ot(M,`color: ${r()??""}`),I(C,y()),ot(h,`color: ${r()??""}`),I($,L),ot(b,`width: ${e(_)??""}; background: ${r()??""};`)},[()=>(F(i()),p(()=>i().toFixed(1)))]),d(o,T),ae()}var xn=m('<div class="ai-news__empty svelte-6g2jpi"><span>No AI summaries available</span></div>'),kn=m('<li class="ai-news__item svelte-6g2jpi"><div class="ai-news__meta svelte-6g2jpi"><span class="ai-news__category svelte-6g2jpi"> </span> <span class="ai-news__source svelte-6g2jpi"> </span> <span class="ai-news__age svelte-6g2jpi"> </span></div> <p class="ai-news__title svelte-6g2jpi"> </p> <p class="ai-news__summary svelte-6g2jpi"> </p></li>'),Sn=m('<div class="ai-news__pager svelte-6g2jpi"><button class="ai-news__pager-btn svelte-6g2jpi" aria-label="Previous page">&lsaquo;</button> <span class="ai-news__pager-info svelte-6g2jpi"> </span> <button class="ai-news__pager-btn svelte-6g2jpi" aria-label="Next page">&rsaquo;</button></div>'),Mn=m('<ul class="ai-news__list svelte-6g2jpi"></ul> <!>',1),Nn=m('<div class="ai-news svelte-6g2jpi"><!></div>');function Hn(o,t){te(t,!1);const s=ye(),_=ye();let i=J(t,"summaries",24,()=>[]),y=J(t,"pageSize",8,5),r=J(t,"rotateSeconds",8,30),l=ye(0),P=ye();function W(){k(l,(e(l)+1)%e(s))}function U(){k(l,(e(l)-1+e(s))%e(s))}function T(c){const v=Math.max(0,Date.now()-c),h=Math.floor(v/6e4);if(h<60)return`${h}m ago`;const $=Math.floor(h/60);return $<24?`${$}h ago`:`${Math.floor($/24)}d ago`}we(()=>(F(i()),F(y())),()=>{k(s,Math.max(1,Math.ceil(i().length/y())))}),we(()=>F(i()),()=>{i()&&k(l,0)}),we(()=>(F(i()),e(l),F(y())),()=>{k(_,i().slice(e(l)*y(),(e(l)+1)*y()))}),we(()=>(e(P),F(r()),e(s)),()=>{e(P)!==void 0&&clearInterval(e(P)),k(P,void 0),r()>0&&e(s)>1&&k(P,setInterval(W,r()*1e3))}),Xe(),Ge();var D=Nn(),M=n(D);{var C=c=>{var v=xn();d(c,v)},x=c=>{var v=Mn(),h=le(v);je(h,5,()=>e(_),b=>b.id,(b,u)=>{var N=kn(),A=n(N),K=n(A),Y=n(K,!0);a(K);var L=f(K,2),S=n(L,!0);a(L);var q=f(L,2),V=n(q,!0);a(q),a(A);var H=f(A,2),w=n(H,!0);a(H);var R=f(H,2),z=n(R,!0);a(R),a(N),G(E=>{I(Y,(e(u),p(()=>e(u).category))),I(S,(e(u),p(()=>e(u).source))),I(V,E),I(w,(e(u),p(()=>e(u).title))),I(z,(e(u),p(()=>e(u).summary)))},[()=>(e(u),p(()=>T(e(u).published)))]),d(b,N)}),a(h);var $=f(h,2);{var g=b=>{var u=Sn(),N=n(u),A=f(N,2),K=n(A);a(A);var Y=f(A,2);a(u),G(()=>I(K,`${e(l)+1} / ${e(s)??""}`)),nt("click",N,U),nt("click",Y,W),d(b,u)};B($,b=>{e(s)>1&&b(g)})}d(c,v)};B(M,c=>{F(i()),p(()=>i().length===0)?c(C):c(x,!1)})}a(D),d(o,D),ae()}var Wn=m('<div class="wotd__empty svelte-1w1ki2k"><span>No word available</span></div>'),jn=m('<span class="wotd__pos svelte-1w1ki2k"> </span>'),Dn=m('<div class="wotd__word svelte-1w1ki2k"> </div> <!> <p class="wotd__definition svelte-1w1ki2k"> </p>',1),Cn=m('<div class="wotd svelte-1w1ki2k"><!></div>');function Pn(o,t){te(t,!1);let s=J(t,"data",8,null);Ge();var _=Cn(),i=n(_);{var y=l=>{var P=Wn();d(l,P)},r=l=>{var P=Dn(),W=le(P),U=n(W,!0);a(W);var T=f(W,2);{var D=x=>{var c=jn(),v=n(c,!0);a(c),G(()=>I(v,(F(s()),p(()=>s().partOfSpeech)))),d(x,c)};B(T,x=>{F(s()),p(()=>s().partOfSpeech)&&x(D)})}var M=f(T,2),C=n(M,!0);a(M),G(()=>{I(U,(F(s()),p(()=>s().word))),I(C,(F(s()),p(()=>s().definition)))}),d(l,P)};B(i,l=>{s()?l(r,!1):l(y)})}a(_),d(o,_),ae()}var Tn=m('<div class="finance-widget__empty svelte-wbjoj9"><span>No stock data available</span></div>'),zn=m('<div class="finance-widget__chart svelte-wbjoj9"><!></div>'),In=m('<span><span class="finance-widget__change-label svelte-wbjoj9"> </span> </span>'),Ln=m('<div class="finance-widget__row svelte-wbjoj9"><div class="finance-widget__info svelte-wbjoj9"><span class="finance-widget__symbol svelte-wbjoj9"> </span> <span class="finance-widget__name svelte-wbjoj9"> </span></div> <!> <div class="finance-widget__values svelte-wbjoj9"><span class="finance-widget__price svelte-wbjoj9"> </span> <div class="finance-widget__changes svelte-wbjoj9"></div></div></div>'),$n=m('<div class="finance-widget__list svelte-wbjoj9"></div>'),qn=m('<div class="finance-widget svelte-wbjoj9"><!></div>');function En(o,t){te(t,!1);const s=ye();let _=J(t,"stocks",24,()=>[]),i=J(t,"show1h",8,!1),y=J(t,"show24h",8,!0),r=J(t,"show7d",8,!1),l=J(t,"showSparkline",8,!0);function P(v,h){return h==="1h"?v.change_1h:h==="7d"?v.change_7d:v.change_24h}function W(v){return v.sparkline.length>0?v.sparkline:[]}function U(v){return v>=1e3?v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):v>=1?v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4}):v.toLocaleString("en-US",{minimumFractionDigits:4,maximumFractionDigits:8})}function T(v){return`${v>=0?"+":""}${v.toFixed(2)}%`}function D(v){return v>0?"finance-widget__change--positive":v<0?"finance-widget__change--negative":"finance-widget__change--neutral"}we(()=>(F(i()),F(y()),F(r())),()=>{k(s,[i()&&{key:"1h",label:"1H"},y()&&{key:"24h",label:"24H"},r()&&{key:"7d",label:"7D"}].filter(Boolean))}),Xe(),Ge();var M=qn(),C=n(M);{var x=v=>{var h=Tn();d(v,h)},c=v=>{var h=$n();je(h,5,_,$=>$.symbol,($,g)=>{const b=me(()=>(e(g),p(()=>W(e(g)))));var u=Ln(),N=n(u),A=n(N),K=n(A,!0);a(A);var Y=f(A,2),L=n(Y,!0);a(Y),a(N);var S=f(N,2);{var q=z=>{var E=zn(),Q=n(E);{let X=me(()=>(e(g),p(()=>e(g).change_24h>=0)));Zt(Q,{get data(){return e(b)},width:80,height:28,get positive(){return e(X)}})}a(E),d(z,E)};B(S,z=>{F(l()),F(e(b)),p(()=>l()&&e(b).length>=2)&&z(q)})}var V=f(S,2),H=n(V),w=n(H);a(H);var R=f(H,2);je(R,5,()=>e(s),z=>z.key,(z,E)=>{const Q=me(()=>(e(g),e(E),p(()=>P(e(g),e(E).key))));var X=In(),re=n(X),ve=n(re,!0);a(re);var be=f(re);a(X),G((ie,ue)=>{Ee(X,1,`finance-widget__change ${ie??""}`,"svelte-wbjoj9"),de(X,"title",`${e(E),p(()=>e(E).label)??""} change`),I(ve,(e(E),p(()=>e(E).label))),I(be,` ${ue??""}`)},[()=>(F(e(Q)),p(()=>D(e(Q)))),()=>(F(e(Q)),p(()=>T(e(Q))))]),d(z,X)}),a(R),a(V),a(u),G(z=>{I(K,(e(g),p(()=>e(g).symbol))),I(L,(e(g),p(()=>e(g).name))),I(w,`$${z??""}`)},[()=>(e(g),p(()=>U(e(g).price)))]),d($,u)}),a(h),d(v,h)};B(C,v=>{F(_()),p(()=>_().length===0)?v(x):v(c,!1)})}a(M),d(o,M),ae()}var An=m('<div data-testid="shadow-widget"></div>');function Un(o,t){te(t,!1);let s=J(t,"html",8),_=J(t,"css",8),i=J(t,"data",8,null),y=ye();we(()=>(e(y),F(s()),F(i()),F(_())),()=>{if(e(y)){e(y).shadowRoot||e(y).attachShadow({mode:"open"});const l=da(s(),i());ia(y,e(y).shadowRoot.innerHTML="<style>"+_()+"</style>"+l)}}),Xe(),Ge();var r=An();It(r,l=>k(y,l),()=>e(y)),d(o,r),ae()}const $t=fa(new Map);$t.subscribe;function Rn(o){$t.update(t=>{const s=new Map(t);return s.set(o.plugin_id,o),s})}const At=new Map;function Ve(o){let t=At.get(o);return t||(t=pa($t,s=>{var _;return((_=s.get(o))==null?void 0:_.data)??null}),At.set(o,t)),t}var Fn=m("<div>Loading template...</div>"),Gn=m("<div>Failed to load template</div>"),On=m("<!> <!>",1);function Bn(o,t){te(t,!0);const s=()=>Ye(U,"$dataStore",_),[_,i]=Ot();let y=xe(""),r=xe(""),l=xe(!0),P=xe(!1);const W=t.pluginId,U=Ve(W);Ze(()=>{(async()=>{const c=await fetch(`/plugins/${t.pluginId}/template`);if(!c.ok){k(P,!0),k(l,!1);return}const v=await c.json();k(y,v.html,!0),k(r,v.css,!0),k(l,!1)})()});var T=On(),D=le(T);{var M=c=>{var v=Fn();d(c,v)},C=c=>{var v=Gn();d(c,v)};B(D,c=>{e(l)?c(M):e(P)&&c(C,1)})}var x=f(D,2);Un(x,{get html(){return e(y)},get css(){return e(r)},get data(){return s()}}),d(o,T),ae(),i()}var Yn=m('<div class="not-configured overlay svelte-1s2yccz" role="status" aria-label="Integration not configured"><div class="not-configured__icon svelte-1s2yccz" aria-hidden="true">⚙</div> <p class="not-configured__title svelte-1s2yccz">Not Configured</p> <p class="not-configured__desc svelte-1s2yccz">This widget needs integration credentials.</p> <button class="not-configured__link svelte-1s2yccz">Go to Settings</button></div>'),Vn=m('<div class="plugin-renderer-wrap svelte-1s2yccz"><!></div>');function Kn(o,t){te(t,!1);const s=()=>Ye(H,"$newsStore",M),_=()=>Ye(w,"$sportsStore",M),i=()=>Ye(R,"$haStore",M),y=()=>Ye(z,"$cryptoStore",M),r=()=>Ye(E,"$weatherStore",M),l=()=>Ye(Q,"$calendarStore",M),P=()=>Ye(X,"$photoStore",M),W=()=>Ye(re,"$allergiesStore",M),U=()=>Ye(ve,"$aiNewsStore",M),T=()=>Ye(be,"$wotdStore",M),D=()=>Ye(ie,"$financeStore",M),[M,C]=Ot(),x=ye(),c=ye(),v=ye(),h=ye(),$=ye(),g=ye(),b=ye(),u=ye(),N=ye(),A=ye(),K=ye(),Y=ye(),L=ye();let S=J(t,"plugin",8);function q(ne,We){return ne===!0||ne==="true"?!0:ne===!1||ne==="false"?!1:We}function V(){return Bt(`${Yt}/admin`)}const H=Ve("news-server"),w=Ve("sports-server"),R=Ve("home-assistant-server"),z=Ve("crypto-server"),E=Ve("weather-server"),Q=Ve("calendar-server"),X=Ve("photo-slideshow-server"),re=Ve("allergies-server"),ve=Ve("ai-news-server"),be=Ve("word-of-day-server"),ie=Ve("finance-server");we(()=>F(S()),()=>{k(x,S().plugin_id)}),we(()=>F(S()),()=>{k(c,S().integration_status)}),we(()=>s(),()=>{k(v,s())}),we(()=>_(),()=>{k(h,_())}),we(()=>i(),()=>{k($,i())}),we(()=>y(),()=>{k(g,y())}),we(()=>r(),()=>{k(b,r())}),we(()=>l(),()=>{k(u,l())}),we(()=>P(),()=>{k(N,P())}),we(()=>W(),()=>{k(A,W())}),we(()=>U(),()=>{k(K,U())}),we(()=>T(),()=>{k(Y,T())}),we(()=>D(),()=>{k(L,D())}),Xe(),Ge();var ue=Vn(),Te=n(ue);{var oe=ne=>{var We=Yn(),De=f(n(We),6);a(We),se("click",De,V),d(ne,We)},Ie=ne=>{{let We=me(()=>(e(N),p(()=>{var Pe;return((Pe=e(N))==null?void 0:Pe.photoPaths)??[]}))),De=me(()=>(F(S()),p(()=>(Number(S().config.cycleSeconds)||30)*1e3)));Ra(ne,{get photoPaths(){return e(We)},get cycleInterval(){return e(De)}})}},Re=ne=>{{let We=me(()=>(e(v),p(()=>{var De;return((De=e(v))==null?void 0:De.articles)??[]})));Za(ne,{get headlines(){return e(We)}})}},Oe=ne=>{{let We=me(()=>(e(h),p(()=>{var De;return((De=e(h))==null?void 0:De.games)??[]})));ls(ne,{get games(){return e(We)}})}},he=ne=>{{let We=me(()=>(e($),p(()=>{var Pe;return((Pe=e($))==null?void 0:Pe.devices)??[]}))),De=me(()=>(e($),p(()=>{var Pe;return((Pe=e($))==null?void 0:Pe.sensors)??[]})));bs(ne,{get devices(){return e(We)},get sensors(){return e(De)}})}},ee=ne=>{{let We=me(()=>(e(g),p(()=>{var Qe;return((Qe=e(g))==null?void 0:Qe.coins)??[]}))),De=me(()=>(F(S()),p(()=>q(S().config.show1h,!1)))),Pe=me(()=>(F(S()),p(()=>q(S().config.show24h,!0)))),Je=me(()=>(F(S()),p(()=>q(S().config.show7d,!1)))),rt=me(()=>(F(S()),p(()=>q(S().config.showSparkline,!0))));Ds(ne,{get coins(){return e(We)},get show1h(){return e(De)},get show24h(){return e(Pe)},get show7d(){return e(Je)},get showSparkline(){return e(rt)}})}},_e=ne=>{{let We=me(()=>(e(b),p(()=>{var Pe;return((Pe=e(b))==null?void 0:Pe.current)??null}))),De=me(()=>(e(b),p(()=>{var Pe;return((Pe=e(b))==null?void 0:Pe.forecast)??[]})));Qs(ne,{get current(){return e(We)},get forecast(){return e(De)}})}},fe=ne=>{{let We=me(()=>(e(u),p(()=>{var De;return((De=e(u))==null?void 0:De.events)??[]})));_n(ne,{get events(){return e(We)}})}},ze=ne=>{{let We=me(()=>(e(A),p(()=>{var Le;return((Le=e(A))==null?void 0:Le.index)??0}))),De=me(()=>(e(A),p(()=>{var Le;return((Le=e(A))==null?void 0:Le.level)??"Low"}))),Pe=me(()=>(e(A),p(()=>{var Le;return((Le=e(A))==null?void 0:Le.color)??"#4caf50"}))),Je=me(()=>(e(A),p(()=>{var Le;return((Le=e(A))==null?void 0:Le.location)??""}))),rt=me(()=>(e(A),p(()=>{var Le;return((Le=e(A))==null?void 0:Le.triggers)??[]}))),Qe=me(()=>(e(A),p(()=>{var Le;return((Le=e(A))==null?void 0:Le.periods)??[]})));bn(ne,{get index(){return e(We)},get level(){return e(De)},get color(){return e(Pe)},get location(){return e(Je)},get triggers(){return e(rt)},get periods(){return e(Qe)}})}},Ae=ne=>{Pn(ne,{get data(){return e(Y)}})},it=ne=>{{let We=me(()=>(e(L),p(()=>{var Qe;return((Qe=e(L))==null?void 0:Qe.stocks)??[]}))),De=me(()=>(F(S()),p(()=>q(S().config.show1h,!1)))),Pe=me(()=>(F(S()),p(()=>q(S().config.show24h,!0)))),Je=me(()=>(F(S()),p(()=>q(S().config.show7d,!1)))),rt=me(()=>(F(S()),p(()=>q(S().config.showSparkline,!0))));En(ne,{get stocks(){return e(We)},get show1h(){return e(De)},get show24h(){return e(Pe)},get show7d(){return e(Je)},get showSparkline(){return e(rt)}})}},lt=ne=>{{let We=me(()=>(e(K),p(()=>{var Je;return((Je=e(K))==null?void 0:Je.summaries)??[]}))),De=me(()=>(F(S()),p(()=>Number(S().config.pageSize)||5))),Pe=me(()=>(F(S()),p(()=>Number(S().config.rotateSeconds)??30)));Hn(ne,{get summaries(){return e(We)},get pageSize(){return e(De)},get rotateSeconds(){return e(Pe)}})}},pt=ne=>{Bn(ne,{get pluginId(){return e(x)}})};B(Te,ne=>{e(c)==="missing"?ne(oe):e(x)==="photo-slideshow"?ne(Ie,1):e(x)==="news"?ne(Re,2):e(x)==="sports"?ne(Oe,3):e(x)==="home-assistant"?ne(he,4):e(x)==="crypto"?ne(ee,5):e(x)==="weather"?ne(_e,6):e(x)==="calendar"?ne(fe,7):e(x)==="allergies"?ne(ze,8):e(x)==="word-of-day"?ne(Ae,9):e(x)==="finance"?ne(it,10):e(x)==="ai-news"?ne(lt,11):ne(pt,!1)})}a(ue),d(o,ue),ae(),C()}at(["click"]);var Zn=m('<div class="util-clock svelte-n5vm7q"><span class="util-clock__time svelte-n5vm7q"> <span class="util-clock__seconds svelte-n5vm7q"> </span></span> <span class="util-clock__date svelte-n5vm7q"> </span></div>');function Xn(o,t){te(t,!0);let s=J(t,"hour12",3,!0),_=xe(et(new Date));Ze(()=>{const C=setInterval(()=>{k(_,new Date,!0)},1e3);return()=>clearInterval(C)});let i=ge(()=>e(_).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:s()})),y=ge(()=>e(_).toLocaleTimeString([],{second:"2-digit"}).slice(-2)),r=ge(()=>e(_).toLocaleDateString([],{weekday:"short",month:"short",day:"numeric"}));var l=Zn(),P=n(l),W=n(P,!0),U=f(W),T=n(U,!0);a(U),a(P);var D=f(P,2),M=n(D,!0);a(D),a(l),G(()=>{I(W,e(i)),I(T,e(y)),I(M,e(r))}),d(o,l),ae()}var Jn=m('<div class="error-tile svelte-15v71n" role="alert"><div class="error-icon svelte-15v71n" aria-hidden="true">⚠</div> <div class="error-name svelte-15v71n"> </div> <div class="error-message svelte-15v71n"> </div> <button class="retry-btn svelte-15v71n">Retry</button></div>');function Qn(o,t){let s=J(t,"name",8,"Widget");function _(l,P){l instanceof Error?l.message:String(l),console.error(`[ErrorBoundary] "${s()}" crashed:`,l)}function i(l){l()}var y=pe(),r=le(y);ma(r,{onerror:_,failed:(P,W=ke,U=ke)=>{var T=Jn(),D=f(n(T),2),M=n(D,!0);a(D);var C=f(D,2),x=n(C,!0);a(C);var c=f(C,2);a(T),G(()=>{de(T,"aria-label",`Error in ${s()??""}`),I(M,s()),I(x,(W(),p(()=>W()instanceof Error?W().message:"An error occurred")))}),se("click",c,()=>i(U())),d(P,T)}},P=>{var W=pe(),U=le(W);ca(U,t,"default",{}),d(P,W)}),d(o,y)}at(["click"]);var er=m('<div class="picker__card svelte-54et1y"><div class="picker__card-body svelte-54et1y"><div class="picker__card-icon picker__card-icon--util svelte-54et1y"> </div> <div class="picker__card-info svelte-54et1y"><span class="picker__card-name svelte-54et1y"> </span> <span class="picker__card-id svelte-54et1y"> </span></div></div> <div class="picker__card-meta svelte-54et1y"><span class="picker__card-size svelte-54et1y"> </span></div> <button type="button" class="picker__card-add svelte-54et1y">+ Add to Dashboard</button></div>'),tr=m('<div class="picker__group svelte-54et1y"><h3 class="picker__group-label svelte-54et1y">Layout <span class="picker__group-count svelte-54et1y"> </span></h3> <div class="picker__grid svelte-54et1y"></div></div>'),ar=m('<p class="picker__empty svelte-54et1y">No widgets match your search.</p>'),sr=m('<span class="picker__card-status picker__card-status--active svelte-54et1y">Active</span>'),nr=m('<span class="picker__card-status picker__card-status--error svelte-54et1y">Error</span>'),rr=m('<span class="picker__card-status svelte-54et1y"> </span>'),ir=m('<div class="picker__card svelte-54et1y"><div class="picker__card-body svelte-54et1y"><div class="picker__card-icon svelte-54et1y"> </div> <div class="picker__card-info svelte-54et1y"><span class="picker__card-name svelte-54et1y"> </span> <span class="picker__card-id svelte-54et1y"> </span></div></div> <div class="picker__card-meta svelte-54et1y"><span class="picker__card-size svelte-54et1y"> </span> <!></div> <button type="button" class="picker__card-add svelte-54et1y">+ Add to Dashboard</button></div>'),lr=m('<div class="picker__group svelte-54et1y"><h3 class="picker__group-label svelte-54et1y"> <span class="picker__group-count svelte-54et1y"> </span></h3> <div class="picker__grid svelte-54et1y"></div></div>'),or=m('<div class="picker-backdrop svelte-54et1y"><div class="picker svelte-54et1y" role="dialog" tabindex="-1" aria-modal="true" aria-label="Add widget"><div class="picker__header svelte-54et1y"><div><h2 class="picker__title svelte-54et1y">Add Widget</h2> <p class="picker__subtitle svelte-54et1y">Choose a widget to add to your dashboard</p></div> <button type="button" class="picker__close svelte-54et1y" aria-label="Close widget picker">✕</button></div> <div class="picker__search svelte-54et1y"><input type="text" class="picker__search-input svelte-54et1y" placeholder="Search widgets..."/></div> <div class="picker__body svelte-54et1y"><!> <!></div></div></div>');function dr(o,t){te(t,!0);let s=xe(""),_=ge(()=>e(s).trim().length===0?zt:zt.filter(g=>{const b=e(s).toLowerCase();return g.label.toLowerCase().includes(b)||g.type.toLowerCase().includes(b)})),i=ge(()=>e(s).trim().length===0?t.availablePlugins:t.availablePlugins.filter(g=>{const b=e(s).toLowerCase();return g.manifest.name.toLowerCase().includes(b)||g.plugin_id.toLowerCase().includes(b)})),y=ge(()=>{const g=e(i).filter(N=>N.builtin),b=e(i).filter(N=>!N.builtin),u=[];return g.length>0&&u.push({label:"Built-in",plugins:g}),b.length>0&&u.push({label:"Plugins",plugins:b}),u});function r(g){if(!t.onaddutility)return;const b={id:Wa(g.type),x:0,y:0,w:g.defaultW,h:g.defaultH,minW:g.minW,minH:g.minH,maxW:g.maxW,maxH:g.maxH,showHeader:!1};t.onaddutility(b)}function l(g){g.key==="Escape"&&t.onclose()}var P=or();nt("keydown",dt,l);var W=n(P),U=n(W),T=f(n(U),2);a(U);var D=f(U,2),M=n(D);tt(M),a(D);var C=f(D,2),x=n(C);{var c=g=>{var b=tr(),u=n(b),N=f(n(u)),A=n(N);a(N),a(u);var K=f(u,2);je(K,21,()=>e(_),Y=>Y.type,(Y,L)=>{var S=er(),q=n(S),V=n(q),H=n(V,!0);a(V);var w=f(V,2),R=n(w),z=n(R,!0);a(R);var E=f(R,2),Q=n(E,!0);a(E),a(w),a(q);var X=f(q,2),re=n(X),ve=n(re);a(re),a(X);var be=f(X,2);a(S),G(()=>{I(H,e(L).icon),I(z,e(L).label),I(Q,e(L).description),I(ve,`${e(L).defaultW??""}×${e(L).defaultH??""}`),de(be,"aria-label",`Add ${e(L).label??""} to dashboard`)}),se("click",be,()=>r(e(L))),d(Y,S)}),a(K),a(b),G(()=>I(A,`(${e(_).length??""})`)),d(g,b)};B(x,g=>{e(_).length>0&&g(c)})}var v=f(x,2);{var h=g=>{var b=ar();d(g,b)},$=g=>{var b=pe(),u=le(b);je(u,17,()=>e(y),N=>N.label,(N,A)=>{var K=lr(),Y=n(K),L=n(Y),S=f(L),q=n(S);a(S),a(Y);var V=f(Y,2);je(V,21,()=>e(A).plugins,H=>H.plugin_id,(H,w)=>{const R=ge(()=>Vt(e(w).plugin_id,e(w).manifest));var z=ir(),E=n(z),Q=n(E),X=n(Q,!0);a(Q);var re=f(Q,2),ve=n(re),be=n(ve,!0);a(ve);var ie=f(ve,2),ue=n(ie,!0);a(ie),a(re),a(E);var Te=f(E,2),oe=n(Te),Ie=n(oe);a(oe);var Re=f(oe,2);{var Oe=fe=>{var ze=sr();d(fe,ze)},he=fe=>{var ze=nr();d(fe,ze)},ee=fe=>{var ze=rr(),Ae=n(ze,!0);a(ze),G(()=>I(Ae,e(w).status)),d(fe,ze)};B(Re,fe=>{e(w).status==="active"?fe(Oe):e(w).status==="error"?fe(he,1):fe(ee,!1)})}a(Te);var _e=f(Te,2);a(z),G(fe=>{I(X,fe),I(be,e(w).manifest.name),I(ue,e(w).plugin_id),I(Ie,`${e(R).w??""}×${e(R).h??""}`),de(_e,"aria-label",`Add ${e(w).manifest.name??""} to dashboard`)},[()=>e(w).manifest.name.charAt(0).toUpperCase()]),se("click",_e,()=>t.onadd(e(w))),d(H,z)}),a(V),a(K),G(()=>{I(L,`${e(A).label??""} `),I(q,`(${e(A).plugins.length??""})`)}),d(N,K)}),d(g,b)};B(v,g=>{e(i).length===0&&e(_).length===0?g(h):g($,!1)})}a(C),a(W),a(P),se("click",P,function(...g){var b;(b=t.onclose)==null||b.apply(this,g)}),se("click",W,g=>g.stopPropagation()),se("click",T,function(...g){var b;(b=t.onclose)==null||b.apply(this,g)}),gt(M,()=>e(s),g=>k(s,g)),d(o,P),ae()}at(["click"]);function Jt(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M10 11v6"}],["path",{d:"M14 11v6"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"}],["path",{d:"M3 6h18"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}]];Me(o,Ne({name:"trash-2"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}var _r=m('<button type="button" class="context-menu__item svelte-4ktga8" role="menuitem"><span class="context-menu__icon svelte-4ktga8" aria-hidden="true"><!></span> Configure</button>'),gr=m('<button type="button" class="context-menu__item svelte-4ktga8" role="menuitem"><span class="context-menu__icon svelte-4ktga8" aria-hidden="true"><!></span> </button>'),hr=m('<div class="context-menu-backdrop svelte-4ktga8"><div class="context-menu svelte-4ktga8" role="menu" tabindex="-1"><div class="context-menu__header svelte-4ktga8"><span class="context-menu__name svelte-4ktga8"> </span></div> <!> <button type="button" class="context-menu__item svelte-4ktga8" role="menuitem"><span class="context-menu__icon svelte-4ktga8" aria-hidden="true"><!></span> Move &amp; Resize</button> <!> <hr class="context-menu__divider svelte-4ktga8"/> <button type="button" class="context-menu__item context-menu__item--danger svelte-4ktga8" role="menuitem"><span class="context-menu__icon svelte-4ktga8" aria-hidden="true"><!></span> Remove Widget</button></div></div>');function fr(o,t){te(t,!0);let s=J(t,"showHeader",3,!0),_=J(t,"x",3,0),i=J(t,"y",3,0),y=ge(()=>{const u=Math.min(_(),window.innerWidth-200),N=Math.min(i(),window.innerHeight-200);return`left: ${u}px; top: ${N}px;`});function r(u){u.key==="Escape"&&t.onclose()}var l=hr();nt("keydown",dt,r);var P=n(l),W=n(P),U=n(W),T=n(U,!0);a(U),a(W);var D=f(W,2);{var M=u=>{var N=_r(),A=n(N),K=n(A);Jt(K,{size:14}),a(A),ft(),a(N),se("click",N,function(...Y){var L;(L=t.onconfigure)==null||L.apply(this,Y)}),d(u,N)};B(D,u=>{t.onconfigure&&u(M)})}var C=f(D,2),x=n(C),c=n(x);cr(c,{size:14}),a(x),ft(),a(C);var v=f(C,2);{var h=u=>{var N=gr(),A=n(N),K=n(A);vr(K,{size:14}),a(A);var Y=f(A);a(N),G(()=>I(Y,` ${s()?"Hide Header":"Show Header"}`)),se("click",N,function(...L){var S;(S=t.ontoggleheader)==null||S.apply(this,L)}),d(u,N)};B(v,u=>{t.ontoggleheader&&u(h)})}var $=f(v,4),g=n($),b=n(g);ur(b,{size:14}),a(g),ft(),a($),a(P),a(l),G(()=>{de(P,"aria-label",`Widget actions for ${t.pluginName??""}`),de(P,"data-plugin-id",t.pluginId),ot(P,e(y)),I(T,t.pluginName)}),se("mousedown",l,function(...u){var N;(N=t.onclose)==null||N.apply(this,u)}),se("mousedown",P,u=>u.stopPropagation()),se("click",C,function(...u){var N;(N=t.onresize)==null||N.apply(this,u)}),se("click",$,function(...u){var N;(N=t.ondelete)==null||N.apply(this,u)}),d(o,l),ae()}at(["mousedown","click"]);function pr(o,t){const s=[];return(!Number.isFinite(o.x)||!Number.isInteger(o.x))&&s.push("X position must be a valid integer"),(!Number.isFinite(o.y)||!Number.isInteger(o.y))&&s.push("Y position must be a valid integer"),(!Number.isFinite(o.w)||!Number.isInteger(o.w))&&s.push("Width must be a valid integer"),(!Number.isFinite(o.h)||!Number.isInteger(o.h))&&s.push("Height must be a valid integer"),s.length===0&&(o.x<0&&s.push("X position must be 0 or greater"),o.y<0&&s.push("Y position must be 0 or greater"),o.w<1&&s.push("Width must be at least 1"),o.h<1&&s.push("Height must be at least 1"),o.x+o.w>t&&s.push(`Widget extends beyond grid (max ${t} columns)`)),{valid:s.length===0,errors:s}}function mr(o,t){return{x:o.x,y:o.y,w:Math.max(t.minW,Math.min(t.maxW,o.w)),h:Math.max(t.minH,Math.min(t.maxH,o.h))}}var wr=m('<li class="modal__error svelte-11l7ja9"> </li>'),yr=m('<ul class="modal__errors svelte-11l7ja9" role="alert"></ul>'),br=m('<div class="modal-backdrop svelte-11l7ja9"><div class="modal svelte-11l7ja9" role="dialog" tabindex="-1" aria-modal="true"><h2 class="modal__title svelte-11l7ja9"> </h2> <div class="modal__fields svelte-11l7ja9"><label class="modal__field svelte-11l7ja9"><span class="modal__label svelte-11l7ja9">Column (X)</span> <div class="modal__stepper svelte-11l7ja9"><button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Decrease X">−</button> <input type="number" class="modal__input svelte-11l7ja9" aria-label="X position"/> <button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Increase X">+</button></div></label> <label class="modal__field svelte-11l7ja9"><span class="modal__label svelte-11l7ja9">Row (Y)</span> <div class="modal__stepper svelte-11l7ja9"><button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Decrease Y">−</button> <input type="number" class="modal__input svelte-11l7ja9" aria-label="Y position"/> <button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Increase Y">+</button></div></label> <label class="modal__field svelte-11l7ja9"><span class="modal__label svelte-11l7ja9">Width (W)</span> <div class="modal__stepper svelte-11l7ja9"><button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Decrease width">−</button> <input type="number" class="modal__input svelte-11l7ja9" aria-label="Width"/> <button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Increase width">+</button></div></label> <label class="modal__field svelte-11l7ja9"><span class="modal__label svelte-11l7ja9">Height (H)</span> <div class="modal__stepper svelte-11l7ja9"><button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Decrease height">−</button> <input type="number" class="modal__input svelte-11l7ja9" aria-label="Height"/> <button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Increase height">+</button></div></label></div> <!> <div class="modal__actions svelte-11l7ja9"><button type="button" class="modal__btn modal__btn--cancel svelte-11l7ja9">Cancel</button> <button type="button" class="modal__btn modal__btn--confirm svelte-11l7ja9">Apply</button></div></div></div>');function xr(o,t){te(t,!0);let s=J(t,"minW",3,1),_=J(t,"minH",3,1),i=J(t,"maxW",3,24),y=J(t,"maxH",3,24),r=J(t,"pluginName",3,"Widget"),l=xe(et(t.x)),P=xe(et(t.y)),W=xe(et(t.w)),U=xe(et(t.h)),T=ge(()=>pr({x:e(l),y:e(P),w:e(W),h:e(U)},24));function D(){if(!e(T).valid)return;const oe=mr({x:e(l),y:e(P),w:e(W),h:e(U)},{minW:s(),minH:_(),maxW:i(),maxH:y()});t.onconfirm(oe)}function M(oe){oe.key==="Escape"&&t.oncancel(),oe.key==="Enter"&&e(T).valid&&D()}var C=br();nt("keydown",dt,M);var x=n(C),c=n(x),v=n(c);a(c);var h=f(c,2),$=n(h),g=f(n($),2),b=n(g),u=f(b,2);tt(u),de(u,"min",0),de(u,"max",23);var N=f(u,2);a(g),a($);var A=f($,2),K=f(n(A),2),Y=n(K),L=f(Y,2);tt(L),de(L,"min",0);var S=f(L,2);a(K),a(A);var q=f(A,2),V=f(n(q),2),H=n(V),w=f(H,2);tt(w);var R=f(w,2);a(V),a(q);var z=f(q,2),E=f(n(z),2),Q=n(E),X=f(Q,2);tt(X);var re=f(X,2);a(E),a(z),a(h);var ve=f(h,2);{var be=oe=>{var Ie=yr();je(Ie,21,()=>e(T).errors,va,(Re,Oe)=>{var he=wr(),ee=n(he,!0);a(he),G(()=>I(ee,e(Oe))),d(Re,he)}),a(Ie),d(oe,Ie)};B(ve,oe=>{e(T).valid||oe(be)})}var ie=f(ve,2),ue=n(ie),Te=f(ue,2);a(ie),a(x),a(C),G(()=>{de(x,"aria-label",`Resize ${r()??""}`),I(v,`Move & Resize — ${r()??""}`),de(w,"min",s()),de(w,"max",i()),de(X,"min",_()),de(X,"max",y()),Te.disabled=!e(T).valid}),se("click",C,function(...oe){var Ie;(Ie=t.oncancel)==null||Ie.apply(this,oe)}),se("click",x,oe=>oe.stopPropagation()),se("click",b,()=>k(l,Math.max(0,e(l)-1),!0)),gt(u,()=>e(l),oe=>k(l,oe)),se("click",N,()=>k(l,Math.min(23,e(l)+1),!0)),se("click",Y,()=>k(P,Math.max(0,e(P)-1),!0)),gt(L,()=>e(P),oe=>k(P,oe)),se("click",S,()=>k(P,e(P)+1)),se("click",H,()=>k(W,Math.max(s(),e(W)-1),!0)),gt(w,()=>e(W),oe=>k(W,oe)),se("click",R,()=>k(W,Math.min(i(),e(W)+1),!0)),se("click",Q,()=>k(U,Math.max(_(),e(U)-1),!0)),gt(X,()=>e(U),oe=>k(U,oe)),se("click",re,()=>k(U,Math.min(y(),e(U)+1),!0)),se("click",ue,function(...oe){var Ie;(Ie=t.oncancel)==null||Ie.apply(this,oe)}),se("click",Te,D),d(o,C),ae()}at(["click"]);var kr=m('<div class="integration-status integration-status--missing svelte-68mpyg" role="alert"><span class="integration-status__label svelte-68mpyg">Integration required</span> <span class="integration-status__desc svelte-68mpyg">Set credentials in</span> <button class="integration-status__link svelte-68mpyg">Go to Settings</button></div>'),Sr=m('<div class="integration-status integration-status--ready svelte-68mpyg" role="status"><span class="integration-status__label svelte-68mpyg">Integration connected</span></div>'),Mr=m('<p class="config-panel__empty svelte-68mpyg">No configuration options available for this widget.</p>'),Nr=m('<span class="config-field__required svelte-68mpyg">*</span>'),Hr=m('<p class="config-field__desc svelte-68mpyg"> </p>'),Wr=m('<input type="text" class="config-field__input svelte-68mpyg"/>'),jr=m('<input type="password" class="config-field__input svelte-68mpyg" autocomplete="off"/>'),Dr=m('<input type="number" class="config-field__input svelte-68mpyg"/>'),Cr=m('<label class="config-field__toggle svelte-68mpyg"><input type="checkbox" class="config-field__checkbox svelte-68mpyg"/> <span class="config-field__toggle-label svelte-68mpyg"> </span></label>'),Pr=m("<option> </option>"),Tr=m('<select class="config-field__select svelte-68mpyg"></select>'),zr=m('<div class="config-field svelte-68mpyg"><label class="config-field__label svelte-68mpyg"> <!></label> <!> <!></div>'),Ir=m('<div class="config-panel__fields svelte-68mpyg"></div>'),Lr=m('<div class="config-panel__error svelte-68mpyg" role="alert"> </div>'),$r=m('<div class="config-panel__saved svelte-68mpyg" role="status"> </div>'),qr=m('<button type="button" class="config-btn config-btn--save svelte-68mpyg"> </button>'),Er=m('<div class="config-backdrop svelte-68mpyg"><div class="config-panel svelte-68mpyg" role="dialog" tabindex="-1" aria-modal="true"><div class="config-panel__header svelte-68mpyg"><h2 class="config-panel__title svelte-68mpyg"> </h2> <span class="config-panel__subtitle svelte-68mpyg">Settings</span></div> <!> <!> <!> <!> <div class="config-panel__actions svelte-68mpyg"><button type="button" class="config-btn config-btn--cancel svelte-68mpyg">Cancel</button> <!></div></div></div>');function Ar(o,t){te(t,!0);let s=ge(()=>{var H;return((H=t.plugin.manifest.config_schema)==null?void 0:H.fields)??[]}),_=ge(()=>{if(!t.plugin.manifest.config_schema)return[];const H=ua(t.plugin.manifest.config_schema),w=e(s).filter(R=>!R.category);return[...H,...w]}),i=xe(et({})),y=xe(!1),r=xe(""),l=xe(!1);Ze(()=>{const H={};for(const w of e(_))H[w.key]=t.plugin.config[w.key]!==void 0?t.plugin.config[w.key]:w.default!==void 0?w.default:w.type==="boolean"?!1:w.type==="number"?0:"";k(i,H,!0)});async function P(){k(y,!0),k(r,""),k(l,!1);try{const H=await fetch(`/plugins/${encodeURIComponent(t.plugin.plugin_id)}/config`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({config:e(i)})});if(!H.ok){const w=await H.text();throw new Error(w||`HTTP ${H.status}`)}if(t.plugin.builtin){const w=await fetch(`/modules/${encodeURIComponent(t.plugin.plugin_id)}/restart`,{method:"POST"});if(!w.ok){const R=await w.text();throw new Error(`Restart failed: ${R||`HTTP ${w.status}`}`)}}k(l,!0),setTimeout(()=>{var w;(w=t.onsaved)==null||w.call(t),t.onclose()},800)}catch(H){k(r,H instanceof Error?H.message:"Save failed",!0)}finally{k(y,!1)}}function W(H){H.key==="Escape"&&t.onclose()}function U(){return Bt(`${Yt}/admin`)}function T(H,w){k(i,{...e(i),[H]:w},!0)}var D=Er();nt("keydown",dt,W);var M=n(D),C=n(M),x=n(C),c=n(x,!0);a(x),ft(2),a(C);var v=f(C,2);{var h=H=>{var w=kr(),R=f(n(w),4);a(w),se("click",R,U),d(H,w)},$=H=>{var w=Sr();d(H,w)};B(v,H=>{t.plugin.integration_status==="missing"?H(h):t.plugin.integration_status==="ready"&&H($,1)})}var g=f(v,2);{var b=H=>{var w=Mr();d(H,w)},u=H=>{var w=Ir();je(w,21,()=>e(_),R=>R.key,(R,z)=>{var E=zr(),Q=n(E),X=n(Q),re=f(X);{var ve=he=>{var ee=Nr();d(he,ee)};B(re,he=>{e(z).required&&he(ve)})}a(Q);var be=f(Q,2);{var ie=he=>{var ee=Hr(),_e=n(ee,!0);a(ee),G(()=>I(_e,e(z).description)),d(he,ee)};B(be,he=>{e(z).description&&he(ie)})}var ue=f(be,2);{var Te=he=>{var ee=Wr();tt(ee),G(_e=>{de(ee,"id",`wcfg-${e(z).key??""}`),Wt(ee,_e),ee.required=e(z).required},[()=>String(e(i)[e(z).key]??"")]),se("input",ee,_e=>T(e(z).key,_e.currentTarget.value)),d(he,ee)},oe=he=>{var ee=jr();tt(ee),G(_e=>{de(ee,"id",`wcfg-${e(z).key??""}`),Wt(ee,_e),ee.required=e(z).required},[()=>String(e(i)[e(z).key]??"")]),se("input",ee,_e=>T(e(z).key,_e.currentTarget.value)),d(he,ee)},Ie=he=>{var ee=Dr();tt(ee),G(_e=>{de(ee,"id",`wcfg-${e(z).key??""}`),Wt(ee,_e),de(ee,"min",e(z).min),de(ee,"max",e(z).max),ee.required=e(z).required},[()=>Number(e(i)[e(z).key]??0)]),se("input",ee,_e=>T(e(z).key,_e.currentTarget.valueAsNumber)),d(he,ee)},Re=he=>{var ee=Cr(),_e=n(ee);tt(_e);var fe=f(_e,2),ze=n(fe,!0);a(fe),a(ee),G(Ae=>{de(_e,"id",`wcfg-${e(z).key??""}`),_a(_e,Ae),I(ze,e(i)[e(z).key]?"Enabled":"Disabled")},[()=>!!e(i)[e(z).key]]),se("change",_e,Ae=>T(e(z).key,Ae.currentTarget.checked)),d(he,ee)},Oe=he=>{var ee=Tr();je(ee,21,()=>e(z).options??[],fe=>fe.value,(fe,ze)=>{var Ae=Pr(),it=n(Ae,!0);a(Ae);var lt={};G(()=>{I(it,e(ze).label),lt!==(lt=e(ze).value)&&(Ae.value=(Ae.__value=e(ze).value)??"")}),d(fe,Ae)}),a(ee);var _e;Ft(ee),G(fe=>{de(ee,"id",`wcfg-${e(z).key??""}`),_e!==(_e=fe)&&(ee.value=(ee.__value=fe)??"",Gt(ee,fe))},[()=>String(e(i)[e(z).key]??"")]),se("change",ee,fe=>T(e(z).key,fe.currentTarget.value)),d(he,ee)};B(ue,he=>{e(z).type==="string"?he(Te):e(z).type==="password"?he(oe,1):e(z).type==="number"?he(Ie,2):e(z).type==="boolean"?he(Re,3):e(z).type==="select"&&he(Oe,4)})}a(E),G(()=>{de(Q,"for",`wcfg-${e(z).key??""}`),I(X,`${e(z).label??""} `)}),d(R,E)}),a(w),d(H,w)};B(g,H=>{e(_).length===0?H(b):H(u,!1)})}var N=f(g,2);{var A=H=>{var w=Lr(),R=n(w,!0);a(w),G(()=>I(R,e(r))),d(H,w)};B(N,H=>{e(r)&&H(A)})}var K=f(N,2);{var Y=H=>{var w=$r(),R=n(w);a(w),G(()=>I(R,`Settings saved${t.plugin.builtin?" — restarting module":""}`)),d(H,w)};B(K,H=>{e(l)&&H(Y)})}var L=f(K,2),S=n(L),q=f(S,2);{var V=H=>{var w=qr(),R=n(w,!0);a(w),G(()=>{w.disabled=e(y),I(R,e(y)?"Saving...":"Save")}),se("click",w,P),d(H,w)};B(q,H=>{e(_).length>0&&H(V)})}a(L),a(M),a(D),G(()=>{de(M,"aria-label",`Configure ${t.plugin.manifest.name??""}`),I(c,t.plugin.manifest.name)}),se("mousedown",D,function(...H){var w;(w=t.onclose)==null||w.apply(this,H)}),se("mousedown",M,H=>H.stopPropagation()),se("click",S,function(...H){var w;(w=t.onclose)==null||w.apply(this,H)}),d(o,D),ae()}at(["mousedown","click","input","change"]);var Ur=m('<label class="util-config__field svelte-q3fj7w"><span class="util-config__label svelte-q3fj7w">Time Format</span> <select class="util-config__select svelte-q3fj7w"><option>12-hour (7:29 PM)</option><option>24-hour (19:29)</option></select></label>'),Rr=m('<div class="util-config-backdrop svelte-q3fj7w"><div class="util-config-panel svelte-q3fj7w" role="dialog" tabindex="-1" aria-modal="true"><h2 class="util-config__title svelte-q3fj7w">Clock Settings</h2> <!> <div class="util-config__actions svelte-q3fj7w"><button type="button" class="util-config__btn util-config__btn--cancel svelte-q3fj7w">Cancel</button> <button type="button" class="util-config__btn util-config__btn--save svelte-q3fj7w">Save</button></div></div></div>');function Fr(o,t){te(t,!0);let s=xe(t.config.hour12!==!1);function _(){t.onsave({...t.config,hour12:e(s)})}function i(D){D.key==="Escape"&&t.onclose()}var y=Rr();nt("keydown",dt,i);var r=n(y),l=f(n(r),2);{var P=D=>{var M=Ur(),C=f(n(M),2),x=n(C);x.value=x.__value="12";var c=f(x);c.value=c.__value="24",a(C);var v;Ft(C),a(M),G(()=>{v!==(v=e(s)?"12":"24")&&(C.value=C.__value=e(s)?"12":"24",Gt(C,e(s)?"12":"24"))}),se("change",C,h=>k(s,h.currentTarget.value==="12")),d(D,M)};B(l,D=>{t.utilityType==="clock"&&D(P)})}var W=f(l,2),U=n(W),T=f(U,2);a(W),a(r),a(y),G(()=>de(r,"aria-label",`Configure ${t.utilityType??""}`)),se("mousedown",y,function(...D){var M;(M=t.onclose)==null||M.apply(this,D)}),se("mousedown",r,D=>D.stopPropagation()),se("click",U,function(...D){var M;(M=t.onclose)==null||M.apply(this,D)}),se("click",T,_),d(o,y),ae()}at(["mousedown","change","click"]);var Gr=m('<span class="edit-bar__dirty svelte-s9daqd" aria-label="Unsaved changes">Unsaved changes</span>'),Or=m('<div class="edit-bar svelte-s9daqd" role="toolbar" aria-label="Layout editing"><div class="edit-bar__group svelte-s9daqd"><button class="edit-bar__btn edit-bar__btn--undo svelte-s9daqd" type="button" aria-label="Undo" title="Undo (Ctrl+Z)">Undo</button> <button class="edit-bar__btn edit-bar__btn--redo svelte-s9daqd" type="button" aria-label="Redo" title="Redo (Ctrl+Shift+Z)">Redo</button></div> <!> <div class="edit-bar__group svelte-s9daqd"><button class="edit-bar__btn edit-bar__btn--cancel svelte-s9daqd" type="button" title="Cancel (Escape)">Cancel</button> <button class="edit-bar__btn edit-bar__btn--save svelte-s9daqd" type="button" aria-label="Save layout">Save</button></div></div>');function Br(o,t){var s=Or(),_=n(s),i=n(_),y=f(i,2);a(_);var r=f(_,2);{var l=T=>{var D=Gr();d(T,D)};B(r,T=>{t.dirty&&T(l)})}var P=f(r,2),W=n(P),U=f(W,2);a(P),a(s),G(()=>{i.disabled=!t.canUndo,y.disabled=!t.canRedo,U.disabled=!t.dirty}),se("click",i,function(...T){var D;(D=t.onundo)==null||D.apply(this,T)}),se("click",y,function(...T){var D;(D=t.onredo)==null||D.apply(this,T)}),se("click",W,function(...T){var D;(D=t.oncancel)==null||D.apply(this,T)}),se("click",U,function(...T){var D;(D=t.onsave)==null||D.apply(this,T)}),d(o,s)}at(["click"]);const Yr=50;function Fe(o){return o.map(t=>({...t}))}function Vr(o,t){if(o.length!==t.length)return!1;for(let s=0;s<o.length;s++)if(o[s].id!==t[s].id||o[s].x!==t[s].x||o[s].y!==t[s].y||o[s].w!==t[s].w||o[s].h!==t[s].h||o[s].showHeader!==!1!=(t[s].showHeader!==!1))return!1;return!0}function Ct(o){let t=Fe(o);const s=[],_=[];let i=Fe(o);return{pushState(y){s.push(Fe(i)),i=Fe(y),_.length=0,s.length>Yr&&s.shift()},undo(){return s.length===0||(_.push(Fe(i)),i=s.pop()),Fe(i)},redo(){return _.length===0||(s.push(Fe(i)),i=_.pop()),Fe(i)},canUndo(){return s.length>0},canRedo(){return _.length>0},isDirty(){return!Vr(i,t)},reset(y){t=Fe(y),i=Fe(y),s.length=0,_.length=0},getCurrent(){return Fe(i)}}}function Ut(o,t){te(t,!0);/**
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
 */let s=He(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M16 7h6v6"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17"}]];Me(o,Ne({name:"trending-up"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}var ni=m('<div class="dashboard-empty svelte-15y8q3w"><p class="dashboard-empty__text svelte-15y8q3w">No plugins enabled. Visit the admin panel to configure your dashboard.</p></div>'),ri=m('<button type="button" class="widget-gear-btn svelte-15y8q3w"><!></button>'),ii=m('<span class="widget-header__icon svelte-15y8q3w"><!></span>'),li=m('<div class="widget-header svelte-15y8q3w"><!> <span class="widget-header__title svelte-15y8q3w"> </span></div>'),oi=m('<div class="dashboard-widget-content svelte-15y8q3w"><!> <!> <div><!></div></div>'),di=m('<button type="button" class="widget-gear-btn svelte-15y8q3w" aria-label="Widget settings"><!></button>'),ci=m("<div></div>"),vi=m('<div class="util-hdiv svelte-15y8q3w"></div>'),ui=m('<div class="util-vdiv svelte-15y8q3w"></div>'),_i=m('<div class="dashboard-widget-content svelte-15y8q3w"><!> <div class="widget-body widget-body--no-header svelte-15y8q3w"><!></div></div>'),gi=m('<button class="dashboard-add-btn svelte-15y8q3w" type="button" aria-label="Add Widget">Add Widget</button> <!>',1),hi=m('<button class="dashboard-edit-icon svelte-15y8q3w" type="button" aria-label="Edit Layout"><!></button>'),fi=m('<div><!> <!> <!> <div class="dashboard-toolbar svelte-15y8q3w"><!></div> <!> <!> <!> <!> <!></div>');function pi(o,t){var Le;te(t,!0);const s={weather:Xt,news:Kr,sports:Zr,"home-assistant":Xr,crypto:Jr,calendar:Qr,allergies:ei,"ai-news":ti,"word-of-day":ai,finance:si},_="lensing-dashboard-layout";let i=J(t,"allPlugins",19,()=>[]),y=J(t,"serverLayout",3,null),r,l=xe(!1),P=xe(!1),W=xe(null),U=xe(null),T=xe(null),D=xe(null),M=xe(null),C=xe(et([])),x=xe(null),c=xe(et(Ct([]))),v=ge(()=>ka(t.plugins));if(typeof window<"u")try{const j=localStorage.getItem(_);if(j){const O=JSON.parse(j);k(x,O,!0),(Le=t.onsave)==null||Le.call(t,O)}}catch{}Ze(()=>{if(!(!y()||e(l))){k(x,[...y()],!0);try{localStorage.setItem(_,JSON.stringify(y()))}catch{}}}),Ze(()=>{if(e(l))return;const j=e(v),O=e(x)?[...e(x)]:[...j];k(C,O.map(Z=>{const ce=jt(Z.id);if(!ce)return Z;const $e=Ha(ce);return $e?{...Z,minW:$e.minW,minH:$e.minH,maxW:$e.maxW,maxH:$e.maxH}:Z}),!0),k(c,Ct(O),!0)});let h=ge(()=>e(C)),$=ge(()=>(e(C),e(c).canUndo())),g=ge(()=>(e(C),e(c).canRedo())),b=ge(()=>(e(C),e(c).isDirty())),u=ge(()=>new Map(t.plugins.map(j=>[j.plugin_id,j]))),N=ge(()=>i().filter(j=>!e(h).some(O=>O.id===j.plugin_id)));function A(j){const O=new Map(e(C).map(ce=>[ce.id,ce])),Z=j.map(ce=>{const $e=O.get(ce.id);return $e?{...$e,...ce}:ce});e(c).pushState(Z),k(C,Z,!0)}function K(){if(e(l)){S();return}k(l,!0),k(c,Ct(e(C)),!0)}function Y(){const j=e(c).undo();k(C,j,!0)}function L(){const j=e(c).redo();k(C,j,!0)}function S(){const j=e(x)??e(v);e(c).reset(j),k(C,[...j],!0),k(l,!1),k(P,!1),k(W,null),k(T,null),k(D,null),k(M,null)}function q(j){if(!e(l))return;if(j.key==="Escape"){j.preventDefault(),S();return}const O=j.key.toLowerCase();if((j.ctrlKey||j.metaKey)&&O==="z"&&j.shiftKey){j.preventDefault(),L();return}if((j.ctrlKey||j.metaKey)&&O==="z"&&!j.shiftKey){j.preventDefault(),Y();return}}function V(j){const O=Vt(j.plugin_id,j.manifest),Z={id:j.plugin_id,x:0,y:0,w:O.w,h:O.h},ce=[...e(C),Z];e(c).pushState(ce),k(C,ce,!0),k(P,!1)}function H(j){const O=[...e(C),j];e(c).pushState(O),k(C,O,!0),k(P,!1)}function w(j){const O=e(C).filter(Z=>Z.id!==j);e(c).pushState(O),k(C,O,!0),k(W,null)}function R(j){k(W,null);const O=e(u).get(j)??i().find(Z=>Z.plugin_id===j);O&&k(D,O,!0)}function z(j,O){k(W,null),k(M,{widgetId:j,utilType:O},!0)}function E(j){if(!e(M))return;const O=e(M).widgetId,Z=e(C).map(ce=>ce.id===O?{...ce,config:j}:ce);e(c).pushState(Z),k(C,Z,!0),k(M,null)}function Q(j){const O=e(C).map(Z=>Z.id===j?{...Z,showHeader:Z.showHeader===!1}:Z);e(c).pushState(O),k(C,O,!0),k(W,null)}function X(j){k(W,null),k(T,j,!0)}function re(j){if(!e(T))return;const O=e(T).id,Z=e(C).map(ce=>ce.id===O?{...ce,...j}:ce);e(c).pushState(Z),k(C,Z,!0),k(T,null)}function ve(){var j;k(x,[...e(h)],!0);try{localStorage.setItem(_,JSON.stringify(e(h)))}catch{}(j=t.onsave)==null||j.call(t,e(h)),e(c).reset(e(h)),k(l,!1),k(P,!1),k(W,null),k(T,null),k(D,null),k(M,null)}Ze(()=>{e(h).map(j=>j.id),ya().then(be)});function be(){if(r)for(const j of e(h)){const O=CSS.escape(j.id),Z=r.querySelector(`.gs-item-content[data-widget-id="${O}"]`);if(!Z||Z.querySelector(".dashboard-widget-content"))continue;const ce=r.querySelector(`:scope > .dashboard-widget-content[data-widget-id="${O}"]`);ce&&Z.appendChild(ce)}}function ie(j,O,Z){const ce=e(h).find($e=>$e.id===j);ce&&(k(W,ce,!0),k(U,{x:O,y:Z},!0))}function ue(j,O){j.stopPropagation();const Z=j.currentTarget.getBoundingClientRect();ie(O,Z.left,Z.bottom+4)}function Te(j){if(!e(l))return;let O=j.target;for(;O&&O!==j.currentTarget;){const Z=O.getAttribute("data-widget-id");if(Z){j.preventDefault(),ie(Z,j.clientX,j.clientY);break}O=O.parentElement||j.currentTarget}}var oe=fi();nt("keydown",dt,q);let Ie;var Re=n(oe);qa(Re,{get items(){return e(h)},get editMode(){return e(l)},get options(){return Lt},onchange:A});var Oe=f(Re,2);{var he=j=>{var O=ni();d(j,O)};B(Oe,j=>{e(h).length===0&&j(he)})}var ee=f(Oe,2);je(ee,17,()=>e(h),j=>j.id,(j,O)=>{const Z=ge(()=>e(u).get(e(O).id)),ce=ge(()=>jt(e(O).id));var $e=pe(),wt=le($e);{var yt=st=>{var Ue=oi(),ct=n(Ue);{var xt=Ke=>{var Ce=ri(),qe=n(Ce);Ut(qe,{size:14,strokeWidth:2}),a(Ce),G(()=>de(Ce,"aria-label",`Widget settings for ${e(Z).manifest.name??""}`)),se("click",Ce,Be=>ue(Be,e(O).id)),d(Ke,Ce)};B(ct,Ke=>{e(l)&&Ke(xt)})}var vt=f(ct,2);{var kt=Ke=>{const Ce=ge(()=>s[e(O).id]);var qe=li(),Be=n(qe);{var Mt=Nt=>{var Ht=ii(),ta=n(Ht);wa(ta,()=>e(Ce),(aa,sa)=>{sa(aa,{size:14})}),a(Ht),d(Nt,Ht)};B(Be,Nt=>{e(Ce)&&Nt(Mt)})}var qt=f(Be,2),ea=n(qt,!0);a(qt),a(qe),G(()=>I(ea,e(Z).manifest.name)),d(Ke,qe)};B(vt,Ke=>{e(O).showHeader!==!1&&Ke(kt)})}var ut=f(vt,2);let mt;var St=n(ut);Qn(St,{get name(){return e(Z).manifest.name},children:(Ke,Ce)=>{Kn(Ke,{get plugin(){return e(Z)}})},$$slots:{default:!0}}),a(ut),a(Ue),G(()=>{de(Ue,"data-widget-id",e(O).id),mt=Ee(ut,1,"widget-body svelte-15y8q3w",null,mt,{"widget-body--no-header":e(O).showHeader===!1})}),d(st,Ue)},bt=st=>{var Ue=_i(),ct=n(Ue);{var xt=Ce=>{var qe=di(),Be=n(qe);Ut(Be,{size:14,strokeWidth:2}),a(qe),se("click",qe,Mt=>ue(Mt,e(O).id)),d(Ce,qe)};B(ct,Ce=>{e(l)&&Ce(xt)})}var vt=f(ct,2),kt=n(vt);{var ut=Ce=>{var qe=ci();let Be;G(()=>Be=Ee(qe,1,"util-spacer svelte-15y8q3w",null,Be,{"util-spacer--edit":e(l)})),d(Ce,qe)},mt=Ce=>{var qe=vi();d(Ce,qe)},St=Ce=>{var qe=ui();d(Ce,qe)},Ke=Ce=>{{let qe=ge(()=>{var Be;return((Be=e(O).config)==null?void 0:Be.hour12)!==!1});Xn(Ce,{get hour12(){return e(qe)}})}};B(kt,Ce=>{e(ce)==="spacer"?Ce(ut):e(ce)==="hdiv"?Ce(mt,1):e(ce)==="vdiv"?Ce(St,2):e(ce)==="clock"&&Ce(Ke,3)})}a(vt),a(Ue),G(()=>de(Ue,"data-widget-id",e(O).id)),d(st,Ue)};B(wt,st=>{e(Z)?st(yt):e(ce)&&st(bt,1)})}d(j,$e)});var _e=f(ee,2),fe=n(_e);{var ze=j=>{var O=gi(),Z=le(O),ce=f(Z,2);Br(ce,{onsave:ve,oncancel:S,onundo:Y,onredo:L,get canUndo(){return e($)},get canRedo(){return e(g)},get dirty(){return e(b)}}),se("click",Z,()=>k(P,!0)),d(j,O)},Ae=j=>{var O=hi(),Z=n(O);Jt(Z,{size:14,strokeWidth:1.5}),a(O),se("click",O,K),d(j,O)};B(fe,j=>{e(l)?j(ze):j(Ae,!1)})}a(_e);var it=f(_e,2);{var lt=j=>{const O=ge(()=>e(u).get(e(W).id)??i().find($e=>$e.plugin_id===e(W).id)),Z=ge(()=>jt(e(W).id)),ce=ge(()=>{var $e;return(($e=e(O))==null?void 0:$e.manifest.name)??(e(Z)==="spacer"?"Spacer":e(Z)==="hdiv"?"Horizontal Line":e(Z)==="vdiv"?"Vertical Line":e(Z)==="clock"?"Clock":e(W).id)});{let $e=ge(()=>e(W).showHeader!==!1),wt=ge(()=>{var Ue;return((Ue=e(U))==null?void 0:Ue.x)??0}),yt=ge(()=>{var Ue;return((Ue=e(U))==null?void 0:Ue.y)??0}),bt=ge(()=>e(Z)==="clock"?()=>z(e(W).id,"clock"):e(Z)?void 0:()=>R(e(W).id)),st=ge(()=>e(Z)?void 0:()=>Q(e(W).id));fr(j,{get pluginId(){return e(W).id},get pluginName(){return e(ce)},get showHeader(){return e($e)},get x(){return e(wt)},get y(){return e(yt)},get onconfigure(){return e(bt)},ondelete:()=>w(e(W).id),onresize:()=>X(e(W)),get ontoggleheader(){return e(st)},onclose:()=>k(W,null)})}};B(it,j=>{e(l)&&e(W)&&j(lt)})}var pt=f(it,2);{var ne=j=>{{let O=ge(()=>{var Z;return((Z=e(u).get(e(T).id))==null?void 0:Z.manifest.name)??e(T).id});xr(j,{get x(){return e(T).x},get y(){return e(T).y},get w(){return e(T).w},get h(){return e(T).h},get minW(){return e(T).minW},get minH(){return e(T).minH},get maxW(){return e(T).maxW},get maxH(){return e(T).maxH},get pluginName(){return e(O)},onconfirm:re,oncancel:()=>k(T,null)})}};B(pt,j=>{e(T)&&j(ne)})}var We=f(pt,2);{var De=j=>{Ar(j,{get plugin(){return e(D)},onclose:()=>k(D,null),get onsaved(){return t.onconfigsaved}})};B(We,j=>{e(D)&&j(De)})}var Pe=f(We,2);{var Je=j=>{{let O=ge(()=>{var Z;return((Z=e(C).find(ce=>ce.id===e(M).widgetId))==null?void 0:Z.config)??{}});Fr(j,{get utilityType(){return e(M).utilType},get config(){return e(O)},onclose:()=>k(M,null),onsave:E})}};B(Pe,j=>{e(M)&&j(Je)})}var rt=f(Pe,2);{var Qe=j=>{dr(j,{get availablePlugins(){return e(N)},onadd:V,onaddutility:H,onclose:()=>k(P,!1)})};B(rt,j=>{e(l)&&e(P)&&j(Qe)})}a(oe),It(oe,j=>r=j,()=>r),G(()=>Ie=Ee(oe,1,"dashboard-grid svelte-15y8q3w",null,Ie,{"dashboard-edit-mode":e(l)})),se("contextmenu",oe,Te),d(o,oe),ae()}at(["contextmenu","click"]);const Qt="/layout";async function mi(o){try{return(await fetch(Qt,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({widgets:o})})).ok}catch{return!1}}async function wi(){try{const o=await fetch(Qt);return o.ok?(await o.json()).widgets??null:null}catch{return null}}var yi=m('<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>');function Wi(o,t){te(t,!0);let s=xe(et([])),_=xe(null);const i=new Set(ga);let y=ge(()=>e(s).filter(W=>!i.has(W.plugin_id)));async function r(){const W=await fetch("/plugins");W.ok&&k(s,await W.json(),!0)}function l(){r()}function P(W){mi(W).then(()=>r())}Ze(()=>{r();const W=location.protocol==="https:"?"wss:":"ws:",U=new WebSocket(`${W}//${location.host}/ws`);return U.addEventListener("message",T=>{try{const D=JSON.parse(String(T.data));D.type==="layout_change"?(r(),wi().then(M=>{M&&k(_,M,!0)})):D.type==="plugin_data"&&Rn(D.payload)}catch{}}),()=>{U.close()}}),ha("1uha8ag",W=>{var U=yi();la(()=>{oa.title="Lensing Display"}),d(W,U)}),pi(o,{get plugins(){return e(y)},get allPlugins(){return e(y)},get serverLayout(){return e(_)},onsave:P,onconfigsaved:l,adminHref:"/admin"}),ae()}export{Wi as component};
