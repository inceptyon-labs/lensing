import{p as te,e as Ze,a as d,n as ae,j as e,ba as k,o as m,bu as xe,q as n,s as a,c as pe,f as le,t as R,aC as ge,bB as we,k as G,bC as Xe,g as p,W as ye,v as f,aB as Rt,R as me,aA as ke,bv as sa,aW as mt,aD as na,bD as ra,be as et,bE as vt,ah as ia,bG as la}from"../chunks/DRA9cCzs.js";import{e as We,a as oe,f as Ee,I as Me,m as ct,l as oa,k as da,r as tt,b as ft,h as ca,p as va,j as jt,s as ua,i as Ft,d as Gt,S as _a,o as ga}from"../chunks/_BwtmL8j.js";import{p as J,v as B,s as I,z as He,r as Ne,y as nt,B as ha,C as fa,D as Ye,E as Ot,f as at,e as se,F as pa}from"../chunks/BpRJsttV.js";import{b as It,c as ma}from"../chunks/BlTpvLZj.js";import{s as Se}from"../chunks/CnsHFsvp.js";import{i as Ge}from"../chunks/BJh0JSOh.js";import{g as Bt,b as Yt,t as wa}from"../chunks/WQ6COWVE.js";const Lt={columns:12,rowHeight:60,margin:[5,5],compact:"vertical",float:!1,resizeHandles:["n","ne","e","se","s","sw","w","nw"],minRow:1,maxRow:0,animate:150},ya={weather:{x:0,y:0,w:3,h:4},news:{x:3,y:0,w:4,h:4},sports:{x:7,y:0,w:3,h:4},crypto:{x:10,y:0,w:2,h:4},calendar:{x:0,y:4,w:4,h:5},"home-assistant":{x:4,y:4,w:4,h:5},"photo-slideshow":{x:8,y:4,w:4,h:5},allergies:{x:0,y:9,w:3,h:3}},ht={w:3,h:4};let pt=0,Pt=12;function ba(o){const t=ya[o];if(t)return t;const s={x:pt,y:Pt,w:ht.w,h:ht.h};return pt+=ht.w,pt+ht.w>12&&(pt=0,Pt+=ht.h),s}function xa(o){return pt=0,Pt=12,o.filter(t=>t.enabled!==!1).map(t=>{const s=ba(t.plugin_id);return{id:t.plugin_id,x:s.x,y:s.y,w:s.w,h:s.h}})}const Et={weather:{min:[2,2],preferred:[3,4],max:[6,8]},allergies:{min:[2,2],preferred:[3,3],max:[6,6]},crypto:{min:[2,2],preferred:[2,4],max:[6,8]},"word-of-day":{min:[2,2],preferred:[3,3],max:[6,6]},finance:{min:[2,2],preferred:[3,4],max:[6,8]},"ai-news":{min:[2,3],preferred:[4,5],max:[8,10]},news:{min:[2,3],preferred:[4,4],max:[8,10]},sports:{min:[2,2],preferred:[3,4],max:[6,8]},"photo-slideshow":{min:[2,3],preferred:[4,5],max:[12,12]},calendar:{min:[2,3],preferred:[4,5],max:[8,10]},"home-assistant":{min:[2,3],preferred:[4,5],max:[8,10]}},ka={min:[1,2],preferred:[2,3],max:[12,12]};function Sa(o){return o!==null&&typeof o=="object"&&!Array.isArray(o)&&"min"in o&&"preferred"in o&&"max"in o}function Ma(o,t){return t!=null&&t.widget_sizes&&Sa(t.widget_sizes)?t.widget_sizes:o in Et?Et[o]:ka}function Vt(o,t){const s=Ma(o,t);return{w:s.preferred[0],h:s.preferred[1]}}const Tt="__",zt=[{type:"spacer",label:"Spacer",description:"Invisible block to create breathing room",icon:"⬜",defaultW:3,defaultH:1,minW:1,minH:1,maxW:12,maxH:12},{type:"hdiv",label:"Horizontal Line",description:"Thin line to separate rows",icon:"━",defaultW:12,defaultH:1,minW:1,minH:1,maxW:12,maxH:1},{type:"vdiv",label:"Vertical Line",description:"Thin line to separate columns",icon:"┃",defaultW:1,defaultH:4,minW:1,minH:1,maxW:1,maxH:12},{type:"clock",label:"Clock",description:"Current time and date display",icon:"◷",defaultW:4,defaultH:2,minW:2,minH:2,maxW:12,maxH:12}];function Wt(o){if(!o.startsWith(Tt))return null;const t=o.slice(Tt.length),s=t.indexOf("-"),_=s===-1?t:t.slice(0,s);return["spacer","hdiv","vdiv","clock"].includes(_)?_:null}function Ha(o){return zt.find(t=>t.type===o)}function Na(o){const t=Math.random().toString(36).slice(2,8);return`${Tt}${o}-${t}`}const ja=200,Wa=5,Da=768,Kt=4,Ca=70,Pa=["se","sw"];function Ta(){return typeof window>"u"?!1:window.innerWidth<=Da}function za(){return{...Lt,columns:Kt,rowHeight:Ca,resizeHandles:Pa,touchDelay:ja,moveTolerance:Wa,margin:[4,4]}}var Ia=m('<div class="grid-stack-item"><div class="grid-stack-item-content gs-item-content"><!></div></div>'),La=m('<div class="grid-stack"><!></div>');function qa(o,t){te(t,!0);let s=J(t,"items",19,()=>[]),_=J(t,"editMode",3,!1),i=J(t,"options",3,Lt),y=xe(void 0),r,l=xe(!1),P=!1;Ze(()=>{if(e(y))return j(),()=>{r&&(r.destroy(!1),r=void 0,k(l,!1))}});function j(){if(!e(y))return;const c=globalThis.GridStack;if(c)try{const v=Ta(),h=v?za():i(),q=v?Kt:i().columns,g=h.touchDelay??0,b=h.moveTolerance??0,u=c.init({column:q,cellHeight:h.rowHeight,margin:`${h.margin[0]}px`,float:h.float??!1,animate:(h.animate??150)>0,resizable:{handles:h.resizeHandles.join(",")},staticGrid:!_(),minRow:h.minRow??1,draggable:{touchDelay:g},...b>0?{moveTolerance:b}:{}},e(y));r=u,U(s()),u.on("change",()=>{if(!P&&t.onchange){const H=T();t.onchange(H)}}),u.on("added",(H,A)=>{if(!P&&t.onadd&&A.length>0)for(const Z of A){const Y=D(Z);Y&&t.onadd(Y)}}),u.on("removed",(H,A)=>{if(!P&&t.onremove&&A.length>0)for(const Z of A){const Y=D(Z);Y&&t.onremove(Y)}}),k(l,!0)}catch{}}function U(c){var q;if(!r)return;P=!0,r.batchUpdate();const v=new Map;for(const g of r.getGridItems()){const b=(q=g.gridstackNode)==null?void 0:q.id;b&&v.set(b,g)}const h=new Set(c.map(g=>g.id));for(const[g,b]of v)h.has(g)||r.removeWidget(b);for(const g of c){const b=/^[a-zA-Z0-9_-]+$/.test(g.id)?g.id:"invalid-widget",u=v.get(b);u?r.update(u,{x:g.x,y:g.y,w:g.w,h:g.h,minW:g.minW,minH:g.minH,maxW:g.maxW,maxH:g.maxH}):r.addWidget({id:b,w:g.w,h:g.h,autoPosition:!0,minW:g.minW,minH:g.minH,maxW:g.maxW,maxH:g.maxH,locked:g.locked,content:(()=>{const H=document.createElement("div");return H.className="gs-item-content",H.setAttribute("data-widget-id",b),H.outerHTML})()})}r.batchUpdate(!1),P=!1}function T(){return r?r.getGridItems().map(c=>{const v=c.gridstackNode;return{id:(v==null?void 0:v.id)??"",x:(v==null?void 0:v.x)??0,y:(v==null?void 0:v.y)??0,w:(v==null?void 0:v.w)??1,h:(v==null?void 0:v.h)??1}}):[]}function D(c){return c?{id:c.id??"",x:c.x??0,y:c.y??0,w:c.w??1,h:c.h??1}:null}Ze(()=>{e(l)&&r&&r.setStatic(!_())}),Ze(()=>{if(!e(l))return;const c=s().map(v=>({id:v.id,x:v.x,y:v.y,w:v.w,h:v.h,minW:v.minW,minH:v.minH,maxW:v.maxW,maxH:v.maxH,locked:v.locked}));U(c)});var M=La(),C=n(M);{var x=c=>{var v=pe(),h=le(v);We(h,17,s,q=>q.id,(q,g)=>{var b=Ia(),u=n(b),H=n(u);{var A=Z=>{var Y=pe(),L=le(Y);Se(L,()=>t.widget,()=>({widget:e(g)})),d(Z,Y)};B(H,Z=>{t.widget&&Z(A)})}a(u),a(b),R(()=>{oe(b,"data-gs-id",e(g).id),oe(b,"data-gs-x",e(g).x),oe(b,"data-gs-y",e(g).y),oe(b,"data-gs-w",e(g).w),oe(b,"data-gs-h",e(g).h),oe(u,"data-widget-id",e(g).id)}),d(q,b)}),d(c,v)};B(C,c=>{e(l)||c(x)})}a(M),It(M,c=>k(y,c),()=>e(y)),d(o,M),ae()}var $a=m('<div><img alt="Ambient slideshow" style="object-fit: cover; position: absolute; inset: 0; width: 100%; height: 100%;"/></div>'),Ea=m('<div class="photo-slideshow__empty svelte-ci60j3"><span>No photos available</span></div>'),Aa=m('<div class="photo-slideshow svelte-ci60j3"><!></div>');function Ua(o,t){te(t,!0);function s(x,c){return c<=1?0:(x+1)%c}const _=J(t,"photoPaths",19,()=>[]),i=J(t,"cycleInterval",3,3e4),y=["ken-burns-1","ken-burns-2","ken-burns-3"];let r=xe(0),l=xe(0),P=ge(()=>y[e(l)]);function j(){const x=_()??[];x.length!==0&&(k(r,s(e(r),x.length),!0),k(l,(e(l)+1)%y.length))}Ze(()=>{const x=_()??[],c=i()??3e4;if(x.length<=1)return;const v=setInterval(j,c);return()=>clearInterval(v)});let U=ge(()=>(_()??[]).length>0?(_()??[])[e(r)]??null:null);var T=Aa(),D=n(T);{var M=x=>{var c=$a(),v=n(c);a(c),R(()=>{Ee(c,1,`photo-slideshow__slide photo-slideshow__slide--active ${e(P)??""}`,"svelte-ci60j3"),oe(v,"src",e(U))}),d(x,c)},C=x=>{var c=Ea();d(x,c)};B(D,x=>{e(U)?x(M):x(C,!1)})}a(T),d(o,T),ae()}var Ra=m('<div class="news-headlines__empty svelte-15lg0ov"><span>No headlines available</span></div>'),Fa=m('<li class="news-headlines__compact-item svelte-15lg0ov"><span class="news-headlines__category-badge svelte-15lg0ov"> </span> <span class="news-headlines__compact-title svelte-15lg0ov"> </span> <span class="news-headlines__age svelte-15lg0ov"> </span></li>'),Ga=m('<ul class="news-headlines__compact-list svelte-15lg0ov"></ul>'),Oa=m('<p class="news-headlines__summary svelte-15lg0ov"> </p>'),Ba=m('<li class="news-headlines__item svelte-15lg0ov"><div class="news-headlines__meta svelte-15lg0ov"><span class="news-headlines__category-badge svelte-15lg0ov"> </span> <span class="news-headlines__source svelte-15lg0ov"> </span> <span class="news-headlines__age svelte-15lg0ov"> </span></div> <p class="news-headlines__title svelte-15lg0ov"> </p> <!></li>'),Ya=m('<ul class="news-headlines__list svelte-15lg0ov"></ul>'),Va=m("<div><!></div>");function Ka(o,t){te(t,!1);const s=ye();let _=J(t,"headlines",24,()=>[]),i=J(t,"maxItems",8,5),y=J(t,"compact",8,!1);function r(M){const C=Math.max(0,Date.now()-M),x=Math.floor(C/6e4);if(x<60)return`${x}m ago`;const c=Math.floor(x/60);return c<24?`${c}h ago`:`${Math.floor(c/24)}d ago`}we(()=>(G(_()),G(i())),()=>{k(s,_().slice(0,i()))}),Xe(),Ge();var l=Va();let P;var j=n(l);{var U=M=>{var C=Ra();d(M,C)},T=M=>{var C=Ga();We(C,5,()=>e(s),x=>x.id,(x,c)=>{var v=Fa(),h=n(v),q=n(h,!0);a(h);var g=f(h,2),b=n(g,!0);a(g);var u=f(g,2),H=n(u,!0);a(u),a(v),R(A=>{I(q,(e(c),p(()=>e(c).category))),I(b,(e(c),p(()=>e(c).title))),I(H,A)},[()=>(e(c),p(()=>r(e(c).published)))]),d(x,v)}),a(C),d(M,C)},D=M=>{var C=Ya();We(C,5,()=>e(s),x=>x.id,(x,c)=>{var v=Ba(),h=n(v),q=n(h),g=n(q,!0);a(q);var b=f(q,2),u=n(b,!0);a(b);var H=f(b,2),A=n(H,!0);a(H),a(h);var Z=f(h,2),Y=n(Z,!0);a(Z);var L=f(Z,2);{var S=$=>{var V=Oa(),N=n(V,!0);a(V),R(()=>I(N,(e(c),p(()=>e(c).summary)))),d($,V)};B(L,$=>{e(c),p(()=>e(c).summary)&&$(S)})}a(v),R($=>{I(g,(e(c),p(()=>e(c).category))),I(u,(e(c),p(()=>e(c).source))),I(A,$),I(Y,(e(c),p(()=>e(c).title)))},[()=>(e(c),p(()=>r(e(c).published)))]),d(x,v)}),a(C),d(M,C)};B(j,M=>{e(s),p(()=>e(s).length===0)?M(U):y()?M(T,1):M(D,!1)})}a(l),R(()=>P=Ee(l,1,"news-headlines svelte-15lg0ov",null,P,{"news-headlines--compact":y()})),d(o,l),ae()}var Za=m('<div class="sports-scores__empty svelte-1xs1y9r"><span>No games available</span></div>'),Xa=m('<span class="sports-scores__live-badge svelte-1xs1y9r">LIVE</span>'),Ja=m('<li class="sports-scores__compact-item svelte-1xs1y9r"><span class="sports-scores__league-badge svelte-1xs1y9r"> </span> <!> <span class="sports-scores__compact-matchup svelte-1xs1y9r"> </span> <span class="sports-scores__compact-status svelte-1xs1y9r"> </span></li>'),Qa=m('<ul class="sports-scores__compact-list svelte-1xs1y9r"></ul>'),es=m('<span class="sports-scores__period svelte-1xs1y9r"> </span>'),ts=m('<span class="sports-scores__live-badge svelte-1xs1y9r">LIVE</span> <!>',1),as=m('<span class="sports-scores__status svelte-1xs1y9r"> </span>'),ss=m('<li><div class="sports-scores__header svelte-1xs1y9r"><span class="sports-scores__league-badge svelte-1xs1y9r"> </span> <!></div> <div class="sports-scores__matchup svelte-1xs1y9r"><div class="sports-scores__team svelte-1xs1y9r"><span class="sports-scores__team-name svelte-1xs1y9r"> </span> <span class="sports-scores__score svelte-1xs1y9r"> </span></div> <div class="sports-scores__team svelte-1xs1y9r"><span class="sports-scores__team-name svelte-1xs1y9r"> </span> <span class="sports-scores__score svelte-1xs1y9r"> </span></div></div></li>'),ns=m('<ul class="sports-scores__list svelte-1xs1y9r"></ul>'),rs=m("<div><!></div>");function is(o,t){te(t,!1);const s=ye(),_=ye(),i=ye();let y=J(t,"games",24,()=>[]),r=J(t,"compact",8,!1);function l(x){return x.status==="in_progress"?x.period||"LIVE":x.status==="final"?"Final":x.status==="scheduled"?P(x.startTime):x.status==="postponed"?"PPD":x.status==="cancelled"?"Cancelled":x.status}function P(x){const c=new Date(x),v=c.getHours(),h=c.getMinutes().toString().padStart(2,"0"),q=v>=12?"PM":"AM";return`${v%12||12}:${h} ${q}`}we(()=>G(y()),()=>{k(s,y().filter(x=>x.status==="in_progress"))}),we(()=>G(y()),()=>{k(_,y().filter(x=>x.status!=="in_progress"))}),we(()=>(e(s),e(_)),()=>{k(i,[...e(s),...e(_)])}),Xe(),Ge();var j=rs();let U;var T=n(j);{var D=x=>{var c=Za();d(x,c)},M=x=>{var c=Qa();We(c,5,()=>e(i),v=>v.id,(v,h)=>{var q=Ja(),g=n(q),b=n(g,!0);a(g);var u=f(g,2);{var H=S=>{var $=Xa();d(S,$)};B(u,S=>{e(h),p(()=>e(h).status==="in_progress")&&S(H)})}var A=f(u,2),Z=n(A);a(A);var Y=f(A,2),L=n(Y,!0);a(Y),a(q),R((S,$)=>{I(b,S),I(Z,`${e(h),p(()=>e(h).awayTeam)??""}
            ${e(h),p(()=>e(h).awayScore)??""} – ${e(h),p(()=>e(h).homeScore)??""}
            ${e(h),p(()=>e(h).homeTeam)??""}`),I(L,$)},[()=>(e(h),p(()=>e(h).league.toUpperCase())),()=>(e(h),p(()=>l(e(h))))]),d(v,q)}),a(c),d(x,c)},C=x=>{var c=ns();We(c,5,()=>e(i),v=>v.id,(v,h)=>{var q=ss();let g;var b=n(q),u=n(b),H=n(u,!0);a(u);var A=f(u,2);{var Z=re=>{var ve=ts(),be=f(le(ve),2);{var ie=ue=>{var Te=es(),de=n(Te,!0);a(Te),R(()=>I(de,(e(h),p(()=>e(h).period)))),d(ue,Te)};B(be,ue=>{e(h),p(()=>e(h).period)&&ue(ie)})}d(re,ve)},Y=re=>{var ve=as(),be=n(ve,!0);a(ve),R(ie=>I(be,ie),[()=>(e(h),p(()=>l(e(h))))]),d(re,ve)};B(A,re=>{e(h),p(()=>e(h).status==="in_progress")?re(Z):re(Y,!1)})}a(b);var L=f(b,2),S=n(L),$=n(S),V=n($,!0);a($);var N=f($,2),w=n(N,!0);a(N),a(S);var F=f(S,2),z=n(F),E=n(z,!0);a(z);var Q=f(z,2),X=n(Q,!0);a(Q),a(F),a(L),a(q),R(re=>{g=Ee(q,1,"sports-scores__item svelte-1xs1y9r",null,g,{"sports-scores__item--live":e(h).status==="in_progress"}),I(H,re),I(V,(e(h),p(()=>e(h).awayTeam))),I(w,(e(h),p(()=>e(h).awayScore))),I(E,(e(h),p(()=>e(h).homeTeam))),I(X,(e(h),p(()=>e(h).homeScore)))},[()=>(e(h),p(()=>e(h).league.toUpperCase()))]),d(v,q)}),a(c),d(x,c)};B(T,x=>{e(i),p(()=>e(i).length===0)?x(D):r()?x(M,1):x(C,!1)})}a(j),R(()=>U=Ee(j,1,"sports-scores svelte-1xs1y9r",null,U,{"sports-scores--compact":r()})),d(o,j),ae()}var ls=m('<div class="ha-devices__empty svelte-1932y27"><span>No devices available</span></div>'),os=m('<li><span class="ha-devices__name svelte-1932y27"> </span> <span> </span></li>'),ds=m('<section class="ha-devices__group svelte-1932y27"><h3 class="ha-devices__group-label svelte-1932y27">Lights</h3> <ul class="ha-devices__list svelte-1932y27"></ul></section>'),cs=m('<li><span class="ha-devices__name svelte-1932y27"> </span> <span> </span></li>'),vs=m('<section class="ha-devices__group svelte-1932y27"><h3 class="ha-devices__group-label svelte-1932y27">Switches</h3> <ul class="ha-devices__list svelte-1932y27"></ul></section>'),us=m('<li><span class="ha-devices__name svelte-1932y27"> </span> <span> </span></li>'),_s=m('<section class="ha-devices__group svelte-1932y27"><h3 class="ha-devices__group-label svelte-1932y27">Locks</h3> <ul class="ha-devices__list svelte-1932y27"></ul></section>'),gs=m('<li class="ha-devices__item svelte-1932y27"><span class="ha-devices__name svelte-1932y27"> </span> <span class="ha-devices__state ha-devices__state--climate svelte-1932y27"> </span></li>'),hs=m('<section class="ha-devices__group svelte-1932y27"><h3 class="ha-devices__group-label svelte-1932y27">Climate</h3> <ul class="ha-devices__list svelte-1932y27"></ul></section>'),fs=m('<li class="ha-devices__item svelte-1932y27"><span class="ha-devices__name svelte-1932y27"> </span> <span class="ha-devices__state ha-devices__state--sensor svelte-1932y27"> </span></li>'),ps=m('<section class="ha-devices__group svelte-1932y27"><h3 class="ha-devices__group-label svelte-1932y27">Sensors</h3> <ul class="ha-devices__list svelte-1932y27"></ul></section>'),ms=m("<!> <!> <!> <!> <!>",1),ws=m('<div class="ha-devices svelte-1932y27"><!></div>');function ys(o,t){te(t,!1);const s=ye(),_=ye(),i=ye(),y=ye();let r=J(t,"devices",24,()=>[]),l=J(t,"sensors",24,()=>[]);function P(c){return c.state.charAt(0).toUpperCase()+c.state.slice(1)}function j(c){return c.state==="on"||c.state==="unlocked"||c.state==="open"}function U(c){return c.state==="unlocked"||c.state==="open"}function T(c){const v=c.attributes.current_temperature,h=c.attributes.temperature;return v!==void 0&&h!==void 0?`${v}° / ${h}°`:P(c)}we(()=>G(r()),()=>{k(s,r().filter(c=>c.domain==="light"))}),we(()=>G(r()),()=>{k(_,r().filter(c=>c.domain==="switch"))}),we(()=>G(r()),()=>{k(i,r().filter(c=>c.domain==="lock"))}),we(()=>G(r()),()=>{k(y,r().filter(c=>c.domain==="climate"))}),Xe(),Ge();var D=ws(),M=n(D);{var C=c=>{var v=ls();d(c,v)},x=c=>{var v=ms(),h=le(v);{var q=S=>{var $=ds(),V=f(n($),2);We(V,5,()=>e(s),N=>N.entity_id,(N,w)=>{var F=os();let z;var E=n(F),Q=n(E,!0);a(E);var X=f(E,2);let re;var ve=n(X,!0);a(X),a(F),R((be,ie)=>{z=Ee(F,1,"ha-devices__item svelte-1932y27",null,z,be),I(Q,(e(w),p(()=>e(w).friendly_name))),re=Ee(X,1,"ha-devices__state svelte-1932y27",null,re,{"ha-devices__state--on":e(w).state==="on","ha-devices__state--off":e(w).state==="off"}),I(ve,ie)},[()=>({"ha-devices__item--active":j(e(w)),"ha-devices__item--warning":U(e(w))}),()=>(e(w),p(()=>P(e(w))))]),d(N,F)}),a(V),a($),d(S,$)};B(h,S=>{e(s),p(()=>e(s).length>0)&&S(q)})}var g=f(h,2);{var b=S=>{var $=vs(),V=f(n($),2);We(V,5,()=>e(_),N=>N.entity_id,(N,w)=>{var F=cs();let z;var E=n(F),Q=n(E,!0);a(E);var X=f(E,2);let re;var ve=n(X,!0);a(X),a(F),R((be,ie)=>{z=Ee(F,1,"ha-devices__item svelte-1932y27",null,z,be),I(Q,(e(w),p(()=>e(w).friendly_name))),re=Ee(X,1,"ha-devices__state svelte-1932y27",null,re,{"ha-devices__state--on":e(w).state==="on","ha-devices__state--off":e(w).state==="off"}),I(ve,ie)},[()=>({"ha-devices__item--active":j(e(w)),"ha-devices__item--warning":U(e(w))}),()=>(e(w),p(()=>P(e(w))))]),d(N,F)}),a(V),a($),d(S,$)};B(g,S=>{e(_),p(()=>e(_).length>0)&&S(b)})}var u=f(g,2);{var H=S=>{var $=_s(),V=f(n($),2);We(V,5,()=>e(i),N=>N.entity_id,(N,w)=>{var F=us();let z;var E=n(F),Q=n(E,!0);a(E);var X=f(E,2);let re;var ve=n(X,!0);a(X),a(F),R((be,ie,ue)=>{z=Ee(F,1,"ha-devices__item svelte-1932y27",null,z,be),I(Q,(e(w),p(()=>e(w).friendly_name))),re=Ee(X,1,"ha-devices__state svelte-1932y27",null,re,ie),I(ve,ue)},[()=>({"ha-devices__item--active":j(e(w)),"ha-devices__item--warning":U(e(w))}),()=>({"ha-devices__state--locked":e(w).state==="locked","ha-devices__state--warning":U(e(w))}),()=>(e(w),p(()=>P(e(w))))]),d(N,F)}),a(V),a($),d(S,$)};B(u,S=>{e(i),p(()=>e(i).length>0)&&S(H)})}var A=f(u,2);{var Z=S=>{var $=hs(),V=f(n($),2);We(V,5,()=>e(y),N=>N.entity_id,(N,w)=>{var F=gs(),z=n(F),E=n(z,!0);a(z);var Q=f(z,2),X=n(Q,!0);a(Q),a(F),R(re=>{I(E,(e(w),p(()=>e(w).friendly_name))),I(X,re)},[()=>(e(w),p(()=>T(e(w))))]),d(N,F)}),a(V),a($),d(S,$)};B(A,S=>{e(y),p(()=>e(y).length>0)&&S(Z)})}var Y=f(A,2);{var L=S=>{var $=ps(),V=f(n($),2);We(V,5,l,N=>N.entity_id,(N,w)=>{var F=fs(),z=n(F),E=n(z,!0);a(z);var Q=f(z,2),X=n(Q);a(Q),a(F),R(()=>{I(E,(e(w),p(()=>e(w).friendly_name))),I(X,`${e(w),p(()=>e(w).state)??""}${e(w),p(()=>e(w).attributes.unit_of_measurement?` ${e(w).attributes.unit_of_measurement}`:"")??""}`)}),d(N,F)}),a(V),a($),d(S,$)};B(Y,S=>{G(l()),p(()=>l().length>0)&&S(L)})}d(c,v)};B(M,c=>{G(r()),G(l()),p(()=>r().length===0&&l().length===0)?c(C):c(x,!1)})}a(D),d(o,D),ae()}var bs=Rt('<path fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></path>'),xs=Rt('<svg class="sparkline svelte-8cklv6" preserveAspectRatio="none"><!></svg>');function Zt(o,t){te(t,!1);const s=ye();let _=J(t,"data",24,()=>[]),i=J(t,"width",8,120),y=J(t,"height",8,32),r=J(t,"positive",8,!0);function l(T,D,M){if(T.length<2)return"";const C=Math.min(...T),c=Math.max(...T)-C||1,v=1,h=M-v*2;return T.map((q,g)=>{const b=g/(T.length-1)*D,u=v+h-(q-C)/c*h;return`${g===0?"M":"L"}${b.toFixed(1)},${u.toFixed(1)}`}).join(" ")}we(()=>(G(_()),G(i()),G(y())),()=>{k(s,l(_(),i(),y()))}),Xe(),Ge();var P=xs(),j=n(P);{var U=T=>{var D=bs();R(()=>{oe(D,"d",e(s)),oe(D,"stroke",r()?"var(--alert-success, hsl(160, 45%, 45%))":"var(--alert-urgent, hsl(0, 60%, 55%))")}),d(T,D)};B(j,T=>{e(s)&&T(U)})}a(P),R(()=>{oe(P,"viewBox",`0 0 ${i()??""} ${y()??""}`),oe(P,"width",i()),oe(P,"height",y())}),d(o,P),ae()}var ks=m('<div class="crypto-widget__empty svelte-fjg0w2"><span>No crypto data available</span></div>'),Ss=m('<div class="crypto-widget__chart svelte-fjg0w2"><!></div>'),Ms=m('<span><span class="crypto-widget__change-label svelte-fjg0w2"> </span> </span>'),Hs=m('<div class="crypto-widget__row svelte-fjg0w2"><div class="crypto-widget__info svelte-fjg0w2"><span class="crypto-widget__symbol svelte-fjg0w2"> </span> <span class="crypto-widget__name svelte-fjg0w2"> </span></div> <!> <div class="crypto-widget__values svelte-fjg0w2"><span class="crypto-widget__price svelte-fjg0w2"> </span> <div class="crypto-widget__changes svelte-fjg0w2"></div></div></div>'),Ns=m('<div class="crypto-widget__list svelte-fjg0w2"></div>'),js=m('<div class="crypto-widget svelte-fjg0w2"><!></div>');function Ws(o,t){te(t,!1);const s=ye();let _=J(t,"coins",24,()=>[]),i=J(t,"show1h",8,!1),y=J(t,"show24h",8,!0),r=J(t,"show7d",8,!1),l=J(t,"showSparkline",8,!0);function P(v,h){return h==="1h"?v.change_1h:h==="7d"?v.change_7d:v.change_24h}function j(v){const h=v.sparkline??[];return h.length===0?[]:h}function U(v){return v>=1e3?v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):v>=1?v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4}):v.toLocaleString("en-US",{minimumFractionDigits:4,maximumFractionDigits:8})}function T(v){return`${v>=0?"+":""}${v.toFixed(2)}%`}function D(v){return v>0?"crypto-widget__change--positive":v<0?"crypto-widget__change--negative":"crypto-widget__change--neutral"}we(()=>(G(i()),G(y()),G(r())),()=>{k(s,[i()&&{key:"1h",label:"1H"},y()&&{key:"24h",label:"24H"},r()&&{key:"7d",label:"7D"}].filter(Boolean))}),Xe(),Ge();var M=js(),C=n(M);{var x=v=>{var h=ks();d(v,h)},c=v=>{var h=Ns();We(h,5,_,q=>q.id,(q,g)=>{const b=me(()=>(e(g),p(()=>j(e(g)))));var u=Hs(),H=n(u),A=n(H),Z=n(A,!0);a(A);var Y=f(A,2),L=n(Y,!0);a(Y),a(H);var S=f(H,2);{var $=z=>{var E=Ss(),Q=n(E);{let X=me(()=>(e(g),p(()=>e(g).change_24h>=0)));Zt(Q,{get data(){return e(b)},width:80,height:28,get positive(){return e(X)}})}a(E),d(z,E)};B(S,z=>{G(l()),G(e(b)),p(()=>l()&&e(b).length>=2)&&z($)})}var V=f(S,2),N=n(V),w=n(N);a(N);var F=f(N,2);We(F,5,()=>e(s),z=>z.key,(z,E)=>{const Q=me(()=>(e(g),e(E),p(()=>P(e(g),e(E).key))));var X=Ms(),re=n(X),ve=n(re,!0);a(re);var be=f(re);a(X),R((ie,ue)=>{Ee(X,1,`crypto-widget__change ${ie??""}`,"svelte-fjg0w2"),oe(X,"title",`${e(E),p(()=>e(E).label)??""} change`),I(ve,(e(E),p(()=>e(E).label))),I(be,` ${ue??""}`)},[()=>(G(e(Q)),p(()=>D(e(Q)))),()=>(G(e(Q)),p(()=>T(e(Q))))]),d(z,X)}),a(F),a(V),a(u),R((z,E)=>{I(Z,z),I(L,(e(g),p(()=>e(g).name))),I(w,`$${E??""}`)},[()=>(e(g),p(()=>e(g).symbol.toUpperCase())),()=>(e(g),p(()=>U(e(g).price)))]),d(q,u)}),a(h),d(v,h)};B(C,v=>{G(_()),p(()=>_().length===0)?v(x):v(c,!1)})}a(M),d(o,M),ae()}function Xt(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["circle",{cx:"12",cy:"12",r:"4"}],["path",{d:"M12 2v2"}],["path",{d:"M12 20v2"}],["path",{d:"m4.93 4.93 1.41 1.41"}],["path",{d:"m17.66 17.66 1.41 1.41"}],["path",{d:"M2 12h2"}],["path",{d:"M20 12h2"}],["path",{d:"m6.34 17.66-1.41 1.41"}],["path",{d:"m19.07 4.93-1.41 1.41"}]];Me(o,He({name:"sun"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Ds(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["circle",{cx:"12",cy:"12",r:"4"}],["path",{d:"M12 4h.01"}],["path",{d:"M20 12h.01"}],["path",{d:"M12 20h.01"}],["path",{d:"M4 12h.01"}],["path",{d:"M17.657 6.343h.01"}],["path",{d:"M17.657 17.657h.01"}],["path",{d:"M6.343 17.657h.01"}],["path",{d:"M6.343 6.343h.01"}]];Me(o,He({name:"sun-dim"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Cs(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M12 2v2"}],["path",{d:"m4.93 4.93 1.41 1.41"}],["path",{d:"M20 12h2"}],["path",{d:"m19.07 4.93-1.41 1.41"}],["path",{d:"M15.947 12.65a4 4 0 0 0-5.925-4.128"}],["path",{d:"M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"}]];Me(o,He({name:"cloud-sun"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Ps(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"}]];Me(o,He({name:"cloud"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Ts(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M17.5 12a1 1 0 1 1 0 9H9.006a7 7 0 1 1 6.702-9z"}],["path",{d:"M21.832 9A3 3 0 0 0 19 7h-2.207a5.5 5.5 0 0 0-10.72.61"}]];Me(o,He({name:"cloudy"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function zs(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"}],["path",{d:"M16 17H7"}],["path",{d:"M17 21H9"}]];Me(o,He({name:"cloud-fog"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Is(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"m5.2 6.2 1.4 1.4"}],["path",{d:"M2 13h2"}],["path",{d:"M20 13h2"}],["path",{d:"m17.4 7.6 1.4-1.4"}],["path",{d:"M22 17H2"}],["path",{d:"M22 21H2"}],["path",{d:"M16 13a4 4 0 0 0-8 0"}],["path",{d:"M12 5V2.5"}]];Me(o,He({name:"haze"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Ls(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"}],["path",{d:"M8 19v1"}],["path",{d:"M8 14v1"}],["path",{d:"M16 19v1"}],["path",{d:"M16 14v1"}],["path",{d:"M12 21v1"}],["path",{d:"M12 16v1"}]];Me(o,He({name:"cloud-drizzle"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function qs(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"}],["path",{d:"M16 14v6"}],["path",{d:"M8 14v6"}],["path",{d:"M12 16v6"}]];Me(o,He({name:"cloud-rain"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function $s(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M12 2v2"}],["path",{d:"m4.93 4.93 1.41 1.41"}],["path",{d:"M20 12h2"}],["path",{d:"m19.07 4.93-1.41 1.41"}],["path",{d:"M15.947 12.65a4 4 0 0 0-5.925-4.128"}],["path",{d:"M3 20a5 5 0 1 1 8.9-4H13a3 3 0 0 1 2 5.24"}],["path",{d:"M11 20v2"}],["path",{d:"M7 19v2"}]];Me(o,He({name:"cloud-sun-rain"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Es(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"}],["path",{d:"M16 14v2"}],["path",{d:"M8 14v2"}],["path",{d:"M16 20h.01"}],["path",{d:"M8 20h.01"}],["path",{d:"M12 16v2"}],["path",{d:"M12 22h.01"}]];Me(o,He({name:"cloud-hail"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function As(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"}],["path",{d:"M8 15h.01"}],["path",{d:"M8 19h.01"}],["path",{d:"M12 17h.01"}],["path",{d:"M12 21h.01"}],["path",{d:"M16 15h.01"}],["path",{d:"M16 19h.01"}]];Me(o,He({name:"cloud-snow"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Us(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"m10 20-1.25-2.5L6 18"}],["path",{d:"M10 4 8.75 6.5 6 6"}],["path",{d:"m14 20 1.25-2.5L18 18"}],["path",{d:"m14 4 1.25 2.5L18 6"}],["path",{d:"m17 21-3-6h-4"}],["path",{d:"m17 3-3 6 1.5 3"}],["path",{d:"M2 12h6.5L10 9"}],["path",{d:"m20 10-1.5 2 1.5 2"}],["path",{d:"M22 12h-6.5L14 15"}],["path",{d:"m4 10 1.5 2L4 14"}],["path",{d:"m7 21 3-6-1.5-3"}],["path",{d:"m7 3 3 6h4"}]];Me(o,He({name:"snowflake"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Rs(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"}],["path",{d:"m13 12-3 5h4l-3 5"}]];Me(o,He({name:"cloud-lightning"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Fs(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"}]];Me(o,He({name:"thermometer"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}var Gs=m('<span class="weather-icon svelte-1i78a4g" aria-hidden="true"><!></span>');function Dt(o,t){let s=J(t,"size",3,24);function _(u){const H=u.toLowerCase();return H.includes("thunderstorm")?"cloud-lightning":H.includes("freezing rain")||H.includes("freezing drizzle")?"cloud-hail":H.includes("snow shower")?"cloud-snow":H.includes("snow")||H.includes("snow grains")?"snowflake":H.includes("rain shower")?"cloud-sun-rain":H.includes("rain")||H.includes("drizzle")?"cloud-rain":H.includes("drizzle")?"cloud-drizzle":H.includes("fog")||H.includes("mist")?"cloud-fog":H.includes("haze")?"haze":H.includes("overcast")||H.includes("broken clouds")?"cloudy":H.includes("partly cloudy")||H.includes("scattered clouds")||H.includes("few clouds")?"cloud-sun":H.includes("mostly clear")?"sun-dim":H.includes("clear")?"sun":"thermometer"}let i=ge(()=>_(t.conditions));var y=Gs(),r=n(y);{var l=u=>{Xt(u,{get size(){return s()}})},P=u=>{Ds(u,{get size(){return s()}})},j=u=>{Cs(u,{get size(){return s()}})},U=u=>{Ps(u,{get size(){return s()}})},T=u=>{Ts(u,{get size(){return s()}})},D=u=>{zs(u,{get size(){return s()}})},M=u=>{Is(u,{get size(){return s()}})},C=u=>{Ls(u,{get size(){return s()}})},x=u=>{qs(u,{get size(){return s()}})},c=u=>{$s(u,{get size(){return s()}})},v=u=>{Es(u,{get size(){return s()}})},h=u=>{As(u,{get size(){return s()}})},q=u=>{Us(u,{get size(){return s()}})},g=u=>{Rs(u,{get size(){return s()}})},b=u=>{Fs(u,{get size(){return s()}})};B(r,u=>{e(i)==="sun"?u(l):e(i)==="sun-dim"?u(P,1):e(i)==="cloud-sun"?u(j,2):e(i)==="cloud"?u(U,3):e(i)==="cloudy"?u(T,4):e(i)==="cloud-fog"?u(D,5):e(i)==="haze"?u(M,6):e(i)==="cloud-drizzle"?u(C,7):e(i)==="cloud-rain"?u(x,8):e(i)==="cloud-sun-rain"?u(c,9):e(i)==="cloud-hail"?u(v,10):e(i)==="cloud-snow"?u(h,11):e(i)==="snowflake"?u(q,12):e(i)==="cloud-lightning"?u(g,13):u(b,!1)})}a(y),d(o,y)}var Os=m('<div class="weather-widget__empty svelte-1l2lobr"><span>No weather data available</span></div>'),Bs=m('<div class="weather-widget__compact-row svelte-1l2lobr"><span class="weather-widget__compact-icon svelte-1l2lobr"><!></span> <span class="weather-widget__compact-temp svelte-1l2lobr"> </span> <span class="weather-widget__compact-conditions svelte-1l2lobr"> </span></div>'),Ys=m("<span> </span>"),Vs=m('<div class="weather-widget__forecast-row svelte-1l2lobr"><span class="weather-widget__forecast-day svelte-1l2lobr"> </span> <span class="weather-widget__forecast-icon svelte-1l2lobr"><!></span> <span class="weather-widget__forecast-conditions svelte-1l2lobr"> </span> <!> <span class="weather-widget__forecast-temps svelte-1l2lobr"><span class="weather-widget__forecast-high svelte-1l2lobr"> </span> <span class="weather-widget__forecast-sep svelte-1l2lobr">/</span> <span class="weather-widget__forecast-low svelte-1l2lobr"> </span></span></div>'),Ks=m('<div class="weather-widget__forecast svelte-1l2lobr"></div>'),Zs=m('<div class="weather-widget__current svelte-1l2lobr"><div class="weather-widget__hero svelte-1l2lobr"><span class="weather-widget__icon svelte-1l2lobr"><!></span> <span class="weather-widget__temp svelte-1l2lobr"> </span> <div class="weather-widget__conditions-block svelte-1l2lobr"><span class="weather-widget__conditions svelte-1l2lobr"> </span> <span class="weather-widget__feels-like svelte-1l2lobr"> </span></div></div> <div class="weather-widget__details svelte-1l2lobr"><span class="weather-widget__detail svelte-1l2lobr"><span class="weather-widget__detail-label svelte-1l2lobr">Humidity</span> <span class="weather-widget__detail-value svelte-1l2lobr"> </span></span></div></div> <!>',1),Xs=m("<div><!></div>");function Js(o,t){te(t,!1);let s=J(t,"current",8,null),_=J(t,"forecast",24,()=>[]),i=J(t,"compact",8,!1);function y(M){return`${Math.round(M)}°`}function r(M){return new Date(M+"T00:00:00").toLocaleDateString("en-US",{weekday:"short"})}Ge();var l=Xs();let P;var j=n(l);{var U=M=>{var C=Os();d(M,C)},T=M=>{var C=Bs(),x=n(C),c=n(x);Dt(c,{get conditions(){return G(s()),p(()=>s().conditions)},size:32}),a(x);var v=f(x,2),h=n(v,!0);a(v);var q=f(v,2),g=n(q,!0);a(q),a(C),R(b=>{I(h,b),I(g,(G(s()),p(()=>s().conditions)))},[()=>(G(s()),p(()=>y(s().temp)))]),d(M,C)},D=M=>{var C=Zs(),x=le(C),c=n(x),v=n(c),h=n(v);Dt(h,{get conditions(){return G(s()),p(()=>s().conditions)},size:40}),a(v);var q=f(v,2),g=n(q,!0);a(q);var b=f(q,2),u=n(b),H=n(u,!0);a(u);var A=f(u,2),Z=n(A);a(A),a(b),a(c);var Y=f(c,2),L=n(Y),S=f(n(L),2),$=n(S);a(S),a(L),a(Y),a(x);var V=f(x,2);{var N=w=>{var F=Ks();We(F,5,()=>(G(_()),p(()=>_().slice(0,5))),z=>z.date,(z,E)=>{var Q=Vs(),X=n(Q),re=n(X,!0);a(X);var ve=f(X,2),be=n(ve);Dt(be,{get conditions(){return e(E),p(()=>e(E).conditions)},size:16}),a(ve);var ie=f(ve,2),ue=n(ie,!0);a(ie);var Te=f(ie,2);{var de=_e=>{var fe=Ys();let Ie;var Ae=n(fe);a(fe),R(()=>{Ie=Ee(fe,1,"weather-widget__forecast-rain svelte-1l2lobr",null,Ie,{"weather-widget__forecast-rain--high":e(E).precipChance>=50}),I(Ae,`${e(E),p(()=>e(E).precipChance)??""}%`)}),d(_e,fe)};B(Te,_e=>{e(E),p(()=>e(E).precipChance!=null)&&_e(de)})}var Le=f(Te,2),Re=n(Le),Oe=n(Re,!0);a(Re);var he=f(Re,4),ee=n(he,!0);a(he),a(Le),a(Q),R((_e,fe,Ie)=>{I(re,_e),I(ue,(e(E),p(()=>e(E).conditions))),I(Oe,fe),I(ee,Ie)},[()=>(e(E),p(()=>r(e(E).date))),()=>(e(E),p(()=>y(e(E).high))),()=>(e(E),p(()=>y(e(E).low)))]),d(z,Q)}),a(F),d(w,F)};B(V,w=>{G(_()),p(()=>_().length>0)&&w(N)})}R((w,F)=>{I(g,w),I(H,(G(s()),p(()=>s().conditions))),I(Z,`Feels like ${F??""}`),I($,`${G(s()),p(()=>s().humidity)??""}%`)},[()=>(G(s()),p(()=>y(s().temp))),()=>(G(s()),p(()=>y(s().feelsLike)))]),d(M,C)};B(j,M=>{s()?i()?M(T,1):M(D,!1):M(U)})}a(l),R(()=>P=Ee(l,1,"weather-widget svelte-1l2lobr",null,P,{"weather-widget--compact":i()})),d(o,l),ae()}var Qs=m('<div class="calendar-widget__empty svelte-c2xea9"><span>No calendar events</span></div>'),en=m('<span class="calendar-widget__compact-time calendar-widget__compact-time--allday svelte-c2xea9">All Day</span>'),tn=m('<span class="calendar-widget__compact-time svelte-c2xea9"> </span>'),an=m('<li class="calendar-widget__compact-item svelte-c2xea9"><!> <span class="calendar-widget__compact-title svelte-c2xea9"> </span></li>'),sn=m('<ul class="calendar-widget__compact-list svelte-c2xea9"></ul>'),nn=m('<span class="calendar-widget__allday-badge svelte-c2xea9">All Day</span>'),rn=m('<span class="calendar-widget__event-location svelte-c2xea9"> </span>'),ln=m('<span class="calendar-widget__event-dot svelte-c2xea9"></span>'),on=m('<li><div class="calendar-widget__event-time svelte-c2xea9"><!></div> <div class="calendar-widget__event-body svelte-c2xea9"><span class="calendar-widget__event-title svelte-c2xea9"> </span> <!></div> <!></li>'),dn=m('<div class="calendar-widget__day"><div class="calendar-widget__day-header svelte-c2xea9"> </div> <ul class="calendar-widget__event-list svelte-c2xea9"></ul></div>'),cn=m('<div class="calendar-widget__groups svelte-c2xea9"></div>'),vn=m("<div><!></div>");function un(o,t){te(t,!1);const s=ye(),_=ye();let i=J(t,"events",24,()=>[]),y=J(t,"compact",8,!1);function r(h){const q=new Date(h),g=q.getHours(),b=q.getMinutes().toString().padStart(2,"0"),u=g>=12?"PM":"AM";return`${g%12||12}:${b} ${u}`}function l(){const h=new Date;return`${h.getFullYear()}-${String(h.getMonth()+1).padStart(2,"0")}-${String(h.getDate()).padStart(2,"0")}`}function P(h){return h.allDay?h.end.slice(0,10)>l():new Date(h.end).getTime()>=Date.now()}function j(h){const q=h.slice(0,10),g=l(),b=new Date;b.setDate(b.getDate()+1);const u=`${b.getFullYear()}-${String(b.getMonth()+1).padStart(2,"0")}-${String(b.getDate()).padStart(2,"0")}`;if(q===g)return"Today";if(q===u)return"Tomorrow";const[H,A,Z]=q.split("-").map(Number);return new Date(H,A-1,Z).toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"})}function U(h,q){return h.filter(P).sort((g,b)=>new Date(g.start).getTime()-new Date(b.start).getTime()).slice(0,q)}function T(h){const q=h.filter(P).sort((b,u)=>new Date(b.start).getTime()-new Date(u.start).getTime()),g=new Map;for(const b of q){const u=j(b.start);g.has(u)||g.set(u,[]),g.get(u).push(b)}return Array.from(g.entries()).map(([b,u])=>({label:b,events:u}))}we(()=>G(i()),()=>{k(s,U(i(),5))}),we(()=>G(i()),()=>{k(_,T(i()))}),Xe(),Ge();var D=vn();let M;var C=n(D);{var x=h=>{var q=Qs();d(h,q)},c=h=>{var q=sn();We(q,5,()=>e(s),g=>g.id,(g,b)=>{var u=an(),H=n(u);{var A=S=>{var $=en();d(S,$)},Z=S=>{var $=tn(),V=n($,!0);a($),R(N=>I(V,N),[()=>(e(b),p(()=>r(e(b).start)))]),d(S,$)};B(H,S=>{e(b),p(()=>e(b).allDay)?S(A):S(Z,!1)})}var Y=f(H,2),L=n(Y,!0);a(Y),a(u),R(()=>I(L,(e(b),p(()=>e(b).title)))),d(g,u)}),a(q),d(h,q)},v=h=>{var q=cn();We(q,5,()=>e(_),g=>g.label,(g,b)=>{var u=dn(),H=n(u),A=n(H,!0);a(H);var Z=f(H,2);We(Z,5,()=>(e(b),p(()=>e(b).events)),Y=>Y.id,(Y,L)=>{var S=on();let $;var V=n(S),N=n(V);{var w=ie=>{var ue=nn();d(ie,ue)},F=ie=>{var ue=sa();R(Te=>I(ue,Te),[()=>(e(L),p(()=>r(e(L).start)))]),d(ie,ue)};B(N,ie=>{e(L),p(()=>e(L).allDay)?ie(w):ie(F,!1)})}a(V);var z=f(V,2),E=n(z),Q=n(E,!0);a(E);var X=f(E,2);{var re=ie=>{var ue=rn(),Te=n(ue,!0);a(ue),R(()=>I(Te,(e(L),p(()=>e(L).location)))),d(ie,ue)};B(X,ie=>{e(L),p(()=>e(L).location)&&ie(re)})}a(z);var ve=f(z,2);{var be=ie=>{var ue=ln();R(()=>ct(ue,`background:${e(L),p(()=>e(L).color)??""}`)),d(ie,ue)};B(ve,ie=>{e(L),p(()=>e(L).color)&&ie(be)})}a(S),R(()=>{$=Ee(S,1,"calendar-widget__event svelte-c2xea9",null,$,{"calendar-widget__event--allday":e(L).allDay}),I(Q,(e(L),p(()=>e(L).title)))}),d(Y,S)}),a(Z),a(u),R(()=>I(A,(e(b),p(()=>e(b).label)))),d(g,u)}),a(q),d(h,q)};B(C,h=>{G(i()),p(()=>i().length===0)?h(x):y()?h(c,1):h(v,!1)})}a(D),R(()=>M=Ee(D,1,"calendar-widget svelte-c2xea9",null,M,{"calendar-widget--compact":y()})),d(o,D),ae()}var _n=m('<div class="allergies-widget__location svelte-fd4qfr"> </div>'),gn=m('<span class="allergies-widget__trigger-chip svelte-fd4qfr"> </span>'),hn=m('<div class="allergies-widget__triggers svelte-fd4qfr"></div>'),fn=m('<div class="allergies-widget__period svelte-fd4qfr"><span class="allergies-widget__period-label svelte-fd4qfr"> </span> <span class="allergies-widget__period-index svelte-fd4qfr"> </span></div>'),pn=m('<div class="allergies-widget__forecast svelte-fd4qfr"></div>'),mn=m('<div class="allergies-widget__empty svelte-fd4qfr">No pollen data available</div>'),wn=m('<div class="allergies-widget svelte-fd4qfr"><div class="allergies-widget__header svelte-fd4qfr"><span class="allergies-widget__title svelte-fd4qfr">Pollen</span> <span class="allergies-widget__label svelte-fd4qfr"> </span></div> <!> <div class="allergies-widget__index-row svelte-fd4qfr"><span class="allergies-widget__index svelte-fd4qfr"> </span> <span class="allergies-widget__scale svelte-fd4qfr">/12</span></div> <div class="allergies-widget__gauge svelte-fd4qfr"><div class="allergies-widget__bar svelte-fd4qfr"></div></div> <!> <!></div>');function yn(o,t){te(t,!1);const s=ye(),_=ye();let i=J(t,"index",8,0),y=J(t,"level",8,"Low"),r=J(t,"color",8,"#4caf50"),l=J(t,"location",8,""),P=J(t,"triggers",24,()=>[]),j=J(t,"periods",24,()=>[]);function U(L){return L<=2.4?"#4caf50":L<=4.8?"#8bc34a":L<=7.2?"#ffeb3b":L<=9.6?"#ff9800":"#f44336"}we(()=>G(P()),()=>{k(s,P().reduce((L,S)=>{const $=S.plantType||"Other";return L[$]||(L[$]=[]),L[$].push(S.name),L},{}))}),we(()=>G(i()),()=>{k(_,`${Math.min(100,i()/12*100)}%`)}),Xe(),Ge();var T=wn(),D=n(T),M=f(n(D),2),C=n(M,!0);a(M),a(D);var x=f(D,2);{var c=L=>{var S=_n(),$=n(S,!0);a(S),R(()=>I($,l())),d(L,S)};B(x,L=>{l()&&L(c)})}var v=f(x,2),h=n(v),q=n(h,!0);a(h),mt(2),a(v);var g=f(v,2),b=n(g);a(g);var u=f(g,2);{var H=L=>{var S=hn();We(S,5,()=>(e(s),p(()=>Object.entries(e(s)))),([$,V])=>$,($,V)=>{var N=ge(()=>na(e(V),2));let w=()=>e(N)[0],F=()=>e(N)[1];var z=gn(),E=n(z);a(z),R(Q=>I(E,`${w()??""}: ${Q??""}`),[()=>(F(),p(()=>F().join(", ")))]),d($,z)}),a(S),d(L,S)};B(u,L=>{G(P()),p(()=>P().length>0)&&L(H)})}var A=f(u,2);{var Z=L=>{var S=pn();We(S,5,j,$=>$.type,($,V)=>{var N=fn(),w=n(N),F=n(w,!0);a(w);var z=f(w,2),E=n(z,!0);a(z),a(N),R((Q,X)=>{I(F,(e(V),p(()=>e(V).type))),ct(z,`color: ${Q??""}`),I(E,X)},[()=>(e(V),p(()=>U(e(V).index))),()=>(e(V),p(()=>e(V).index.toFixed(1)))]),d($,N)}),a(S),d(L,S)},Y=L=>{var S=mn();d(L,S)};B(A,L=>{G(j()),p(()=>j().length>0)?L(Z):L(Y,!1)})}a(T),R(L=>{ct(M,`color: ${r()??""}`),I(C,y()),ct(h,`color: ${r()??""}`),I(q,L),ct(b,`width: ${e(_)??""}; background: ${r()??""};`)},[()=>(G(i()),p(()=>i().toFixed(1)))]),d(o,T),ae()}var bn=m('<div class="ai-news__empty svelte-6g2jpi"><span>No AI summaries available</span></div>'),xn=m('<li class="ai-news__item svelte-6g2jpi"><div class="ai-news__meta svelte-6g2jpi"><span class="ai-news__category svelte-6g2jpi"> </span> <span class="ai-news__source svelte-6g2jpi"> </span> <span class="ai-news__age svelte-6g2jpi"> </span></div> <p class="ai-news__title svelte-6g2jpi"> </p> <p class="ai-news__summary svelte-6g2jpi"> </p></li>'),kn=m('<div class="ai-news__pager svelte-6g2jpi"><button class="ai-news__pager-btn svelte-6g2jpi" aria-label="Previous page">&lsaquo;</button> <span class="ai-news__pager-info svelte-6g2jpi"> </span> <button class="ai-news__pager-btn svelte-6g2jpi" aria-label="Next page">&rsaquo;</button></div>'),Sn=m('<ul class="ai-news__list svelte-6g2jpi"></ul> <!>',1),Mn=m('<div class="ai-news svelte-6g2jpi"><!></div>');function Hn(o,t){te(t,!1);const s=ye(),_=ye();let i=J(t,"summaries",24,()=>[]),y=J(t,"pageSize",8,5),r=J(t,"rotateSeconds",8,30),l=ye(0),P=ye();function j(){k(l,(e(l)+1)%e(s))}function U(){k(l,(e(l)-1+e(s))%e(s))}function T(c){const v=Math.max(0,Date.now()-c),h=Math.floor(v/6e4);if(h<60)return`${h}m ago`;const q=Math.floor(h/60);return q<24?`${q}h ago`:`${Math.floor(q/24)}d ago`}we(()=>(G(i()),G(y())),()=>{k(s,Math.max(1,Math.ceil(i().length/y())))}),we(()=>G(i()),()=>{i()&&k(l,0)}),we(()=>(G(i()),e(l),G(y())),()=>{k(_,i().slice(e(l)*y(),(e(l)+1)*y()))}),we(()=>(e(P),G(r()),e(s)),()=>{e(P)!==void 0&&clearInterval(e(P)),k(P,void 0),r()>0&&e(s)>1&&k(P,setInterval(j,r()*1e3))}),Xe(),Ge();var D=Mn(),M=n(D);{var C=c=>{var v=bn();d(c,v)},x=c=>{var v=Sn(),h=le(v);We(h,5,()=>e(_),b=>b.id,(b,u)=>{var H=xn(),A=n(H),Z=n(A),Y=n(Z,!0);a(Z);var L=f(Z,2),S=n(L,!0);a(L);var $=f(L,2),V=n($,!0);a($),a(A);var N=f(A,2),w=n(N,!0);a(N);var F=f(N,2),z=n(F,!0);a(F),a(H),R(E=>{I(Y,(e(u),p(()=>e(u).category))),I(S,(e(u),p(()=>e(u).source))),I(V,E),I(w,(e(u),p(()=>e(u).title))),I(z,(e(u),p(()=>e(u).summary)))},[()=>(e(u),p(()=>T(e(u).published)))]),d(b,H)}),a(h);var q=f(h,2);{var g=b=>{var u=kn(),H=n(u),A=f(H,2),Z=n(A);a(A);var Y=f(A,2);a(u),R(()=>I(Z,`${e(l)+1} / ${e(s)??""}`)),nt("click",H,U),nt("click",Y,j),d(b,u)};B(q,b=>{e(s)>1&&b(g)})}d(c,v)};B(M,c=>{G(i()),p(()=>i().length===0)?c(C):c(x,!1)})}a(D),d(o,D),ae()}var Nn=m('<div class="wotd__empty svelte-1w1ki2k"><span>No word available</span></div>'),jn=m('<span class="wotd__pos svelte-1w1ki2k"> </span>'),Wn=m('<div class="wotd__word svelte-1w1ki2k"> </div> <!> <p class="wotd__definition svelte-1w1ki2k"> </p>',1),Dn=m('<div class="wotd svelte-1w1ki2k"><!></div>');function Cn(o,t){te(t,!1);let s=J(t,"data",8,null);Ge();var _=Dn(),i=n(_);{var y=l=>{var P=Nn();d(l,P)},r=l=>{var P=Wn(),j=le(P),U=n(j,!0);a(j);var T=f(j,2);{var D=x=>{var c=jn(),v=n(c,!0);a(c),R(()=>I(v,(G(s()),p(()=>s().partOfSpeech)))),d(x,c)};B(T,x=>{G(s()),p(()=>s().partOfSpeech)&&x(D)})}var M=f(T,2),C=n(M,!0);a(M),R(()=>{I(U,(G(s()),p(()=>s().word))),I(C,(G(s()),p(()=>s().definition)))}),d(l,P)};B(i,l=>{s()?l(r,!1):l(y)})}a(_),d(o,_),ae()}var Pn=m('<div class="finance-widget__empty svelte-wbjoj9"><span>No stock data available</span></div>'),Tn=m('<div class="finance-widget__chart svelte-wbjoj9"><!></div>'),zn=m('<span><span class="finance-widget__change-label svelte-wbjoj9"> </span> </span>'),In=m('<div class="finance-widget__row svelte-wbjoj9"><div class="finance-widget__info svelte-wbjoj9"><span class="finance-widget__symbol svelte-wbjoj9"> </span> <span class="finance-widget__name svelte-wbjoj9"> </span></div> <!> <div class="finance-widget__values svelte-wbjoj9"><span class="finance-widget__price svelte-wbjoj9"> </span> <div class="finance-widget__changes svelte-wbjoj9"></div></div></div>'),Ln=m('<div class="finance-widget__list svelte-wbjoj9"></div>'),qn=m('<div class="finance-widget svelte-wbjoj9"><!></div>');function $n(o,t){te(t,!1);const s=ye();let _=J(t,"stocks",24,()=>[]),i=J(t,"show1h",8,!1),y=J(t,"show24h",8,!0),r=J(t,"show7d",8,!1),l=J(t,"showSparkline",8,!0);function P(v,h){return h==="1h"?v.change_1h:h==="7d"?v.change_7d:v.change_24h}function j(v){return v.sparkline.length>0?v.sparkline:[]}function U(v){return v>=1e3?v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):v>=1?v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4}):v.toLocaleString("en-US",{minimumFractionDigits:4,maximumFractionDigits:8})}function T(v){return`${v>=0?"+":""}${v.toFixed(2)}%`}function D(v){return v>0?"finance-widget__change--positive":v<0?"finance-widget__change--negative":"finance-widget__change--neutral"}we(()=>(G(i()),G(y()),G(r())),()=>{k(s,[i()&&{key:"1h",label:"1H"},y()&&{key:"24h",label:"24H"},r()&&{key:"7d",label:"7D"}].filter(Boolean))}),Xe(),Ge();var M=qn(),C=n(M);{var x=v=>{var h=Pn();d(v,h)},c=v=>{var h=Ln();We(h,5,_,q=>q.symbol,(q,g)=>{const b=me(()=>(e(g),p(()=>j(e(g)))));var u=In(),H=n(u),A=n(H),Z=n(A,!0);a(A);var Y=f(A,2),L=n(Y,!0);a(Y),a(H);var S=f(H,2);{var $=z=>{var E=Tn(),Q=n(E);{let X=me(()=>(e(g),p(()=>e(g).change_24h>=0)));Zt(Q,{get data(){return e(b)},width:80,height:28,get positive(){return e(X)}})}a(E),d(z,E)};B(S,z=>{G(l()),G(e(b)),p(()=>l()&&e(b).length>=2)&&z($)})}var V=f(S,2),N=n(V),w=n(N);a(N);var F=f(N,2);We(F,5,()=>e(s),z=>z.key,(z,E)=>{const Q=me(()=>(e(g),e(E),p(()=>P(e(g),e(E).key))));var X=zn(),re=n(X),ve=n(re,!0);a(re);var be=f(re);a(X),R((ie,ue)=>{Ee(X,1,`finance-widget__change ${ie??""}`,"svelte-wbjoj9"),oe(X,"title",`${e(E),p(()=>e(E).label)??""} change`),I(ve,(e(E),p(()=>e(E).label))),I(be,` ${ue??""}`)},[()=>(G(e(Q)),p(()=>D(e(Q)))),()=>(G(e(Q)),p(()=>T(e(Q))))]),d(z,X)}),a(F),a(V),a(u),R(z=>{I(Z,(e(g),p(()=>e(g).symbol))),I(L,(e(g),p(()=>e(g).name))),I(w,`$${z??""}`)},[()=>(e(g),p(()=>U(e(g).price)))]),d(q,u)}),a(h),d(v,h)};B(C,v=>{G(_()),p(()=>_().length===0)?v(x):v(c,!1)})}a(M),d(o,M),ae()}var En=m('<div data-testid="shadow-widget"></div>');function An(o,t){te(t,!1);let s=J(t,"html",8),_=J(t,"css",8),i=J(t,"data",8,null),y=ye();we(()=>(e(y),G(s()),G(i()),G(_())),()=>{if(e(y)){e(y).shadowRoot||e(y).attachShadow({mode:"open"});const l=oa(s(),i());ra(y,e(y).shadowRoot.innerHTML="<style>"+_()+"</style>"+l)}}),Xe(),Ge();var r=En();It(r,l=>k(y,l),()=>e(y)),d(o,r),ae()}const qt=ha(new Map);qt.subscribe;function Un(o){qt.update(t=>{const s=new Map(t);return s.set(o.plugin_id,o),s})}const At=new Map;function Ve(o){let t=At.get(o);return t||(t=fa(qt,s=>{var _;return((_=s.get(o))==null?void 0:_.data)??null}),At.set(o,t)),t}var Rn=m("<div>Loading template...</div>"),Fn=m("<div>Failed to load template</div>"),Gn=m("<!> <!>",1);function On(o,t){te(t,!0);const s=()=>Ye(U,"$dataStore",_),[_,i]=Ot();let y=xe(""),r=xe(""),l=xe(!0),P=xe(!1);const j=t.pluginId,U=Ve(j);Ze(()=>{(async()=>{const c=await fetch(`/plugins/${t.pluginId}/template`);if(!c.ok){k(P,!0),k(l,!1);return}const v=await c.json();k(y,v.html,!0),k(r,v.css,!0),k(l,!1)})()});var T=Gn(),D=le(T);{var M=c=>{var v=Rn();d(c,v)},C=c=>{var v=Fn();d(c,v)};B(D,c=>{e(l)?c(M):e(P)&&c(C,1)})}var x=f(D,2);An(x,{get html(){return e(y)},get css(){return e(r)},get data(){return s()}}),d(o,T),ae(),i()}var Bn=m('<div class="not-configured overlay svelte-1s2yccz" role="status" aria-label="Integration not configured"><div class="not-configured__icon svelte-1s2yccz" aria-hidden="true">⚙</div> <p class="not-configured__title svelte-1s2yccz">Not Configured</p> <p class="not-configured__desc svelte-1s2yccz">This widget needs integration credentials.</p> <button class="not-configured__link svelte-1s2yccz">Go to Settings</button></div>'),Yn=m('<div class="plugin-renderer-wrap svelte-1s2yccz"><!></div>');function Vn(o,t){te(t,!1);const s=()=>Ye(N,"$newsStore",M),_=()=>Ye(w,"$sportsStore",M),i=()=>Ye(F,"$haStore",M),y=()=>Ye(z,"$cryptoStore",M),r=()=>Ye(E,"$weatherStore",M),l=()=>Ye(Q,"$calendarStore",M),P=()=>Ye(X,"$photoStore",M),j=()=>Ye(re,"$allergiesStore",M),U=()=>Ye(ve,"$aiNewsStore",M),T=()=>Ye(be,"$wotdStore",M),D=()=>Ye(ie,"$financeStore",M),[M,C]=Ot(),x=ye(),c=ye(),v=ye(),h=ye(),q=ye(),g=ye(),b=ye(),u=ye(),H=ye(),A=ye(),Z=ye(),Y=ye(),L=ye();let S=J(t,"plugin",8);function $(ne,je){return ne===!0||ne==="true"?!0:ne===!1||ne==="false"?!1:je}function V(){return Bt(`${Yt}/admin`)}const N=Ve("news-server"),w=Ve("sports-server"),F=Ve("home-assistant-server"),z=Ve("crypto-server"),E=Ve("weather-server"),Q=Ve("calendar-server"),X=Ve("photo-slideshow-server"),re=Ve("allergies-server"),ve=Ve("ai-news-server"),be=Ve("word-of-day-server"),ie=Ve("finance-server");we(()=>G(S()),()=>{k(x,S().plugin_id)}),we(()=>G(S()),()=>{k(c,S().integration_status)}),we(()=>s(),()=>{k(v,s())}),we(()=>_(),()=>{k(h,_())}),we(()=>i(),()=>{k(q,i())}),we(()=>y(),()=>{k(g,y())}),we(()=>r(),()=>{k(b,r())}),we(()=>l(),()=>{k(u,l())}),we(()=>P(),()=>{k(H,P())}),we(()=>j(),()=>{k(A,j())}),we(()=>U(),()=>{k(Z,U())}),we(()=>T(),()=>{k(Y,T())}),we(()=>D(),()=>{k(L,D())}),Xe(),Ge();var ue=Yn(),Te=n(ue);{var de=ne=>{var je=Bn(),De=f(n(je),6);a(je),se("click",De,V),d(ne,je)},Le=ne=>{{let je=me(()=>(e(H),p(()=>{var Pe;return((Pe=e(H))==null?void 0:Pe.photoPaths)??[]}))),De=me(()=>(G(S()),p(()=>(Number(S().config.cycleSeconds)||30)*1e3)));Ua(ne,{get photoPaths(){return e(je)},get cycleInterval(){return e(De)}})}},Re=ne=>{{let je=me(()=>(e(v),p(()=>{var De;return((De=e(v))==null?void 0:De.articles)??[]})));Ka(ne,{get headlines(){return e(je)}})}},Oe=ne=>{{let je=me(()=>(e(h),p(()=>{var De;return((De=e(h))==null?void 0:De.games)??[]})));is(ne,{get games(){return e(je)}})}},he=ne=>{{let je=me(()=>(e(q),p(()=>{var Pe;return((Pe=e(q))==null?void 0:Pe.devices)??[]}))),De=me(()=>(e(q),p(()=>{var Pe;return((Pe=e(q))==null?void 0:Pe.sensors)??[]})));ys(ne,{get devices(){return e(je)},get sensors(){return e(De)}})}},ee=ne=>{{let je=me(()=>(e(g),p(()=>{var Qe;return((Qe=e(g))==null?void 0:Qe.coins)??[]}))),De=me(()=>(G(S()),p(()=>$(S().config.show1h,!1)))),Pe=me(()=>(G(S()),p(()=>$(S().config.show24h,!0)))),Je=me(()=>(G(S()),p(()=>$(S().config.show7d,!1)))),rt=me(()=>(G(S()),p(()=>$(S().config.showSparkline,!0))));Ws(ne,{get coins(){return e(je)},get show1h(){return e(De)},get show24h(){return e(Pe)},get show7d(){return e(Je)},get showSparkline(){return e(rt)}})}},_e=ne=>{{let je=me(()=>(e(b),p(()=>{var Pe;return((Pe=e(b))==null?void 0:Pe.current)??null}))),De=me(()=>(e(b),p(()=>{var Pe;return((Pe=e(b))==null?void 0:Pe.forecast)??[]})));Js(ne,{get current(){return e(je)},get forecast(){return e(De)}})}},fe=ne=>{{let je=me(()=>(e(u),p(()=>{var De;return((De=e(u))==null?void 0:De.events)??[]})));un(ne,{get events(){return e(je)}})}},Ie=ne=>{{let je=me(()=>(e(A),p(()=>{var qe;return((qe=e(A))==null?void 0:qe.index)??0}))),De=me(()=>(e(A),p(()=>{var qe;return((qe=e(A))==null?void 0:qe.level)??"Low"}))),Pe=me(()=>(e(A),p(()=>{var qe;return((qe=e(A))==null?void 0:qe.color)??"#4caf50"}))),Je=me(()=>(e(A),p(()=>{var qe;return((qe=e(A))==null?void 0:qe.location)??""}))),rt=me(()=>(e(A),p(()=>{var qe;return((qe=e(A))==null?void 0:qe.triggers)??[]}))),Qe=me(()=>(e(A),p(()=>{var qe;return((qe=e(A))==null?void 0:qe.periods)??[]})));yn(ne,{get index(){return e(je)},get level(){return e(De)},get color(){return e(Pe)},get location(){return e(Je)},get triggers(){return e(rt)},get periods(){return e(Qe)}})}},Ae=ne=>{Cn(ne,{get data(){return e(Y)}})},lt=ne=>{{let je=me(()=>(e(L),p(()=>{var Qe;return((Qe=e(L))==null?void 0:Qe.stocks)??[]}))),De=me(()=>(G(S()),p(()=>$(S().config.show1h,!1)))),Pe=me(()=>(G(S()),p(()=>$(S().config.show24h,!0)))),Je=me(()=>(G(S()),p(()=>$(S().config.show7d,!1)))),rt=me(()=>(G(S()),p(()=>$(S().config.showSparkline,!0))));$n(ne,{get stocks(){return e(je)},get show1h(){return e(De)},get show24h(){return e(Pe)},get show7d(){return e(Je)},get showSparkline(){return e(rt)}})}},ot=ne=>{{let je=me(()=>(e(Z),p(()=>{var Je;return((Je=e(Z))==null?void 0:Je.summaries)??[]}))),De=me(()=>(G(S()),p(()=>Number(S().config.pageSize)||5))),Pe=me(()=>(G(S()),p(()=>Number(S().config.rotateSeconds)??30)));Hn(ne,{get summaries(){return e(je)},get pageSize(){return e(De)},get rotateSeconds(){return e(Pe)}})}},wt=ne=>{On(ne,{get pluginId(){return e(x)}})};B(Te,ne=>{e(c)==="missing"?ne(de):e(x)==="photo-slideshow"?ne(Le,1):e(x)==="news"?ne(Re,2):e(x)==="sports"?ne(Oe,3):e(x)==="home-assistant"?ne(he,4):e(x)==="crypto"?ne(ee,5):e(x)==="weather"?ne(_e,6):e(x)==="calendar"?ne(fe,7):e(x)==="allergies"?ne(Ie,8):e(x)==="word-of-day"?ne(Ae,9):e(x)==="finance"?ne(lt,10):e(x)==="ai-news"?ne(ot,11):ne(wt,!1)})}a(ue),d(o,ue),ae(),C()}at(["click"]);var Kn=m('<div class="util-clock svelte-n5vm7q"><span class="util-clock__time svelte-n5vm7q"> <span class="util-clock__seconds svelte-n5vm7q"> </span></span> <span class="util-clock__date svelte-n5vm7q"> </span></div>');function Zn(o,t){te(t,!0);let s=J(t,"hour12",3,!0),_=xe(et(new Date));Ze(()=>{const C=setInterval(()=>{k(_,new Date,!0)},1e3);return()=>clearInterval(C)});let i=ge(()=>e(_).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:s()})),y=ge(()=>e(_).toLocaleTimeString([],{second:"2-digit"}).slice(-2)),r=ge(()=>e(_).toLocaleDateString([],{weekday:"short",month:"short",day:"numeric"}));var l=Kn(),P=n(l),j=n(P,!0),U=f(j),T=n(U,!0);a(U),a(P);var D=f(P,2),M=n(D,!0);a(D),a(l),R(()=>{I(j,e(i)),I(T,e(y)),I(M,e(r))}),d(o,l),ae()}var Xn=m('<div class="error-tile svelte-15v71n" role="alert"><div class="error-icon svelte-15v71n" aria-hidden="true">⚠</div> <div class="error-name svelte-15v71n"> </div> <div class="error-message svelte-15v71n"> </div> <button class="retry-btn svelte-15v71n">Retry</button></div>');function Jn(o,t){let s=J(t,"name",8,"Widget");function _(l,P){l instanceof Error?l.message:String(l),console.error(`[ErrorBoundary] "${s()}" crashed:`,l)}function i(l){l()}var y=pe(),r=le(y);pa(r,{onerror:_,failed:(P,j=ke,U=ke)=>{var T=Xn(),D=f(n(T),2),M=n(D,!0);a(D);var C=f(D,2),x=n(C,!0);a(C);var c=f(C,2);a(T),R(()=>{oe(T,"aria-label",`Error in ${s()??""}`),I(M,s()),I(x,(j(),p(()=>j()instanceof Error?j().message:"An error occurred")))}),se("click",c,()=>i(U())),d(P,T)}},P=>{var j=pe(),U=le(j);da(U,t,"default",{}),d(P,j)}),d(o,y)}at(["click"]);var Qn=m('<div class="picker__card svelte-54et1y"><div class="picker__card-body svelte-54et1y"><div class="picker__card-icon picker__card-icon--util svelte-54et1y"> </div> <div class="picker__card-info svelte-54et1y"><span class="picker__card-name svelte-54et1y"> </span> <span class="picker__card-id svelte-54et1y"> </span></div></div> <div class="picker__card-meta svelte-54et1y"><span class="picker__card-size svelte-54et1y"> </span></div> <button type="button" class="picker__card-add svelte-54et1y">+ Add to Dashboard</button></div>'),er=m('<div class="picker__group svelte-54et1y"><h3 class="picker__group-label svelte-54et1y">Layout <span class="picker__group-count svelte-54et1y"> </span></h3> <div class="picker__grid svelte-54et1y"></div></div>'),tr=m('<p class="picker__empty svelte-54et1y">No widgets match your search.</p>'),ar=m('<span class="picker__card-status picker__card-status--active svelte-54et1y">Active</span>'),sr=m('<span class="picker__card-status picker__card-status--error svelte-54et1y">Error</span>'),nr=m('<span class="picker__card-status svelte-54et1y"> </span>'),rr=m('<div class="picker__card svelte-54et1y"><div class="picker__card-body svelte-54et1y"><div class="picker__card-icon svelte-54et1y"> </div> <div class="picker__card-info svelte-54et1y"><span class="picker__card-name svelte-54et1y"> </span> <span class="picker__card-id svelte-54et1y"> </span></div></div> <div class="picker__card-meta svelte-54et1y"><span class="picker__card-size svelte-54et1y"> </span> <!></div> <button type="button" class="picker__card-add svelte-54et1y">+ Add to Dashboard</button></div>'),ir=m('<div class="picker__group svelte-54et1y"><h3 class="picker__group-label svelte-54et1y"> <span class="picker__group-count svelte-54et1y"> </span></h3> <div class="picker__grid svelte-54et1y"></div></div>'),lr=m('<div class="picker-backdrop svelte-54et1y"><div class="picker svelte-54et1y" role="dialog" tabindex="-1" aria-modal="true" aria-label="Add widget"><div class="picker__header svelte-54et1y"><div><h2 class="picker__title svelte-54et1y">Add Widget</h2> <p class="picker__subtitle svelte-54et1y">Choose a widget to add to your dashboard</p></div> <button type="button" class="picker__close svelte-54et1y" aria-label="Close widget picker">✕</button></div> <div class="picker__search svelte-54et1y"><input type="text" class="picker__search-input svelte-54et1y" placeholder="Search widgets..."/></div> <div class="picker__body svelte-54et1y"><!> <!></div></div></div>');function or(o,t){te(t,!0);let s=xe(""),_=ge(()=>e(s).trim().length===0?zt:zt.filter(g=>{const b=e(s).toLowerCase();return g.label.toLowerCase().includes(b)||g.type.toLowerCase().includes(b)})),i=ge(()=>e(s).trim().length===0?t.availablePlugins:t.availablePlugins.filter(g=>{const b=e(s).toLowerCase();return g.manifest.name.toLowerCase().includes(b)||g.plugin_id.toLowerCase().includes(b)})),y=ge(()=>{const g=e(i).filter(H=>H.builtin),b=e(i).filter(H=>!H.builtin),u=[];return g.length>0&&u.push({label:"Built-in",plugins:g}),b.length>0&&u.push({label:"Plugins",plugins:b}),u});function r(g){if(!t.onaddutility)return;const b={id:Na(g.type),x:0,y:0,w:g.defaultW,h:g.defaultH,minW:g.minW,minH:g.minH,maxW:g.maxW,maxH:g.maxH,showHeader:!1};t.onaddutility(b)}function l(g){g.key==="Escape"&&t.onclose()}var P=lr();nt("keydown",vt,l);var j=n(P),U=n(j),T=f(n(U),2);a(U);var D=f(U,2),M=n(D);tt(M),a(D);var C=f(D,2),x=n(C);{var c=g=>{var b=er(),u=n(b),H=f(n(u)),A=n(H);a(H),a(u);var Z=f(u,2);We(Z,21,()=>e(_),Y=>Y.type,(Y,L)=>{var S=Qn(),$=n(S),V=n($),N=n(V,!0);a(V);var w=f(V,2),F=n(w),z=n(F,!0);a(F);var E=f(F,2),Q=n(E,!0);a(E),a(w),a($);var X=f($,2),re=n(X),ve=n(re);a(re),a(X);var be=f(X,2);a(S),R(()=>{I(N,e(L).icon),I(z,e(L).label),I(Q,e(L).description),I(ve,`${e(L).defaultW??""}×${e(L).defaultH??""}`),oe(be,"aria-label",`Add ${e(L).label??""} to dashboard`)}),se("click",be,()=>r(e(L))),d(Y,S)}),a(Z),a(b),R(()=>I(A,`(${e(_).length??""})`)),d(g,b)};B(x,g=>{e(_).length>0&&g(c)})}var v=f(x,2);{var h=g=>{var b=tr();d(g,b)},q=g=>{var b=pe(),u=le(b);We(u,17,()=>e(y),H=>H.label,(H,A)=>{var Z=ir(),Y=n(Z),L=n(Y),S=f(L),$=n(S);a(S),a(Y);var V=f(Y,2);We(V,21,()=>e(A).plugins,N=>N.plugin_id,(N,w)=>{const F=ge(()=>Vt(e(w).plugin_id,e(w).manifest));var z=rr(),E=n(z),Q=n(E),X=n(Q,!0);a(Q);var re=f(Q,2),ve=n(re),be=n(ve,!0);a(ve);var ie=f(ve,2),ue=n(ie,!0);a(ie),a(re),a(E);var Te=f(E,2),de=n(Te),Le=n(de);a(de);var Re=f(de,2);{var Oe=fe=>{var Ie=ar();d(fe,Ie)},he=fe=>{var Ie=sr();d(fe,Ie)},ee=fe=>{var Ie=nr(),Ae=n(Ie,!0);a(Ie),R(()=>I(Ae,e(w).status)),d(fe,Ie)};B(Re,fe=>{e(w).status==="active"?fe(Oe):e(w).status==="error"?fe(he,1):fe(ee,!1)})}a(Te);var _e=f(Te,2);a(z),R(fe=>{I(X,fe),I(be,e(w).manifest.name),I(ue,e(w).plugin_id),I(Le,`${e(F).w??""}×${e(F).h??""}`),oe(_e,"aria-label",`Add ${e(w).manifest.name??""} to dashboard`)},[()=>e(w).manifest.name.charAt(0).toUpperCase()]),se("click",_e,()=>t.onadd(e(w))),d(N,z)}),a(V),a(Z),R(()=>{I(L,`${e(A).label??""} `),I($,`(${e(A).plugins.length??""})`)}),d(H,Z)}),d(g,b)};B(v,g=>{e(i).length===0&&e(_).length===0?g(h):g(q,!1)})}a(C),a(j),a(P),se("click",P,function(...g){var b;(b=t.onclose)==null||b.apply(this,g)}),se("click",j,g=>g.stopPropagation()),se("click",T,function(...g){var b;(b=t.onclose)==null||b.apply(this,g)}),ft(M,()=>e(s),g=>k(s,g)),d(o,P),ae()}at(["click"]);function dr(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"}],["path",{d:"m15 5 4 4"}]];Me(o,He({name:"pencil"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function cr(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M12 2v20"}],["path",{d:"m15 19-3 3-3-3"}],["path",{d:"m19 9 3 3-3 3"}],["path",{d:"M2 12h20"}],["path",{d:"m5 9-3 3 3 3"}],["path",{d:"m9 5 3-3 3 3"}]];Me(o,He({name:"move"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function vr(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}],["path",{d:"M3 9h18"}]];Me(o,He({name:"panel-top"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function ur(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M10 11v6"}],["path",{d:"M14 11v6"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"}],["path",{d:"M3 6h18"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}]];Me(o,He({name:"trash-2"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}var _r=m('<button type="button" class="context-menu__item svelte-4ktga8" role="menuitem"><span class="context-menu__icon svelte-4ktga8" aria-hidden="true"><!></span> Configure</button>'),gr=m('<button type="button" class="context-menu__item svelte-4ktga8" role="menuitem"><span class="context-menu__icon svelte-4ktga8" aria-hidden="true"><!></span> </button>'),hr=m('<div class="context-menu-backdrop svelte-4ktga8"><div class="context-menu svelte-4ktga8" role="menu" tabindex="-1"><div class="context-menu__header svelte-4ktga8"><span class="context-menu__name svelte-4ktga8"> </span></div> <!> <button type="button" class="context-menu__item svelte-4ktga8" role="menuitem"><span class="context-menu__icon svelte-4ktga8" aria-hidden="true"><!></span> Move &amp; Resize</button> <!> <hr class="context-menu__divider svelte-4ktga8"/> <button type="button" class="context-menu__item context-menu__item--danger svelte-4ktga8" role="menuitem"><span class="context-menu__icon svelte-4ktga8" aria-hidden="true"><!></span> Remove Widget</button></div></div>');function fr(o,t){te(t,!0);let s=J(t,"showHeader",3,!0),_=J(t,"x",3,0),i=J(t,"y",3,0),y=ge(()=>{const u=Math.min(_(),window.innerWidth-200),H=Math.min(i(),window.innerHeight-200);return`left: ${u}px; top: ${H}px;`});function r(u){u.key==="Escape"&&t.onclose()}var l=hr();nt("keydown",vt,r);var P=n(l),j=n(P),U=n(j),T=n(U,!0);a(U),a(j);var D=f(j,2);{var M=u=>{var H=_r(),A=n(H),Z=n(A);dr(Z,{size:14}),a(A),mt(),a(H),se("click",H,function(...Y){var L;(L=t.onconfigure)==null||L.apply(this,Y)}),d(u,H)};B(D,u=>{t.onconfigure&&u(M)})}var C=f(D,2),x=n(C),c=n(x);cr(c,{size:14}),a(x),mt(),a(C);var v=f(C,2);{var h=u=>{var H=gr(),A=n(H),Z=n(A);vr(Z,{size:14}),a(A);var Y=f(A);a(H),R(()=>I(Y,` ${s()?"Hide Header":"Show Header"}`)),se("click",H,function(...L){var S;(S=t.ontoggleheader)==null||S.apply(this,L)}),d(u,H)};B(v,u=>{t.ontoggleheader&&u(h)})}var q=f(v,4),g=n(q),b=n(g);ur(b,{size:14}),a(g),mt(),a(q),a(P),a(l),R(()=>{oe(P,"aria-label",`Widget actions for ${t.pluginName??""}`),oe(P,"data-plugin-id",t.pluginId),ct(P,e(y)),I(T,t.pluginName)}),se("mousedown",l,function(...u){var H;(H=t.onclose)==null||H.apply(this,u)}),se("mousedown",P,u=>u.stopPropagation()),se("click",C,function(...u){var H;(H=t.onresize)==null||H.apply(this,u)}),se("click",q,function(...u){var H;(H=t.ondelete)==null||H.apply(this,u)}),d(o,l),ae()}at(["mousedown","click"]);function pr(o,t){const s=[];return(!Number.isFinite(o.x)||!Number.isInteger(o.x))&&s.push("X position must be a valid integer"),(!Number.isFinite(o.y)||!Number.isInteger(o.y))&&s.push("Y position must be a valid integer"),(!Number.isFinite(o.w)||!Number.isInteger(o.w))&&s.push("Width must be a valid integer"),(!Number.isFinite(o.h)||!Number.isInteger(o.h))&&s.push("Height must be a valid integer"),s.length===0&&(o.x<0&&s.push("X position must be 0 or greater"),o.y<0&&s.push("Y position must be 0 or greater"),o.w<1&&s.push("Width must be at least 1"),o.h<1&&s.push("Height must be at least 1"),o.x+o.w>t&&s.push(`Widget extends beyond grid (max ${t} columns)`)),{valid:s.length===0,errors:s}}function mr(o,t){return{x:o.x,y:o.y,w:Math.max(t.minW,Math.min(t.maxW,o.w)),h:Math.max(t.minH,Math.min(t.maxH,o.h))}}var wr=m('<li class="modal__error svelte-11l7ja9"> </li>'),yr=m('<ul class="modal__errors svelte-11l7ja9" role="alert"></ul>'),br=m('<div class="modal-backdrop svelte-11l7ja9"><div class="modal svelte-11l7ja9" role="dialog" tabindex="-1" aria-modal="true"><h2 class="modal__title svelte-11l7ja9"> </h2> <div class="modal__fields svelte-11l7ja9"><label class="modal__field svelte-11l7ja9"><span class="modal__label svelte-11l7ja9">Column (X)</span> <div class="modal__stepper svelte-11l7ja9"><button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Decrease X">−</button> <input type="number" class="modal__input svelte-11l7ja9" aria-label="X position"/> <button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Increase X">+</button></div></label> <label class="modal__field svelte-11l7ja9"><span class="modal__label svelte-11l7ja9">Row (Y)</span> <div class="modal__stepper svelte-11l7ja9"><button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Decrease Y">−</button> <input type="number" class="modal__input svelte-11l7ja9" aria-label="Y position"/> <button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Increase Y">+</button></div></label> <label class="modal__field svelte-11l7ja9"><span class="modal__label svelte-11l7ja9">Width (W)</span> <div class="modal__stepper svelte-11l7ja9"><button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Decrease width">−</button> <input type="number" class="modal__input svelte-11l7ja9" aria-label="Width"/> <button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Increase width">+</button></div></label> <label class="modal__field svelte-11l7ja9"><span class="modal__label svelte-11l7ja9">Height (H)</span> <div class="modal__stepper svelte-11l7ja9"><button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Decrease height">−</button> <input type="number" class="modal__input svelte-11l7ja9" aria-label="Height"/> <button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Increase height">+</button></div></label></div> <!> <div class="modal__actions svelte-11l7ja9"><button type="button" class="modal__btn modal__btn--cancel svelte-11l7ja9">Cancel</button> <button type="button" class="modal__btn modal__btn--confirm svelte-11l7ja9">Apply</button></div></div></div>');function xr(o,t){te(t,!0);let s=J(t,"minW",3,1),_=J(t,"minH",3,1),i=J(t,"maxW",3,24),y=J(t,"maxH",3,24),r=J(t,"pluginName",3,"Widget"),l=xe(et(t.x)),P=xe(et(t.y)),j=xe(et(t.w)),U=xe(et(t.h)),T=ge(()=>pr({x:e(l),y:e(P),w:e(j),h:e(U)},24));function D(){if(!e(T).valid)return;const de=mr({x:e(l),y:e(P),w:e(j),h:e(U)},{minW:s(),minH:_(),maxW:i(),maxH:y()});t.onconfirm(de)}function M(de){de.key==="Escape"&&t.oncancel(),de.key==="Enter"&&e(T).valid&&D()}var C=br();nt("keydown",vt,M);var x=n(C),c=n(x),v=n(c);a(c);var h=f(c,2),q=n(h),g=f(n(q),2),b=n(g),u=f(b,2);tt(u),oe(u,"min",0),oe(u,"max",23);var H=f(u,2);a(g),a(q);var A=f(q,2),Z=f(n(A),2),Y=n(Z),L=f(Y,2);tt(L),oe(L,"min",0);var S=f(L,2);a(Z),a(A);var $=f(A,2),V=f(n($),2),N=n(V),w=f(N,2);tt(w);var F=f(w,2);a(V),a($);var z=f($,2),E=f(n(z),2),Q=n(E),X=f(Q,2);tt(X);var re=f(X,2);a(E),a(z),a(h);var ve=f(h,2);{var be=de=>{var Le=yr();We(Le,21,()=>e(T).errors,ca,(Re,Oe)=>{var he=wr(),ee=n(he,!0);a(he),R(()=>I(ee,e(Oe))),d(Re,he)}),a(Le),d(de,Le)};B(ve,de=>{e(T).valid||de(be)})}var ie=f(ve,2),ue=n(ie),Te=f(ue,2);a(ie),a(x),a(C),R(()=>{oe(x,"aria-label",`Resize ${r()??""}`),I(v,`Move & Resize — ${r()??""}`),oe(w,"min",s()),oe(w,"max",i()),oe(X,"min",_()),oe(X,"max",y()),Te.disabled=!e(T).valid}),se("click",C,function(...de){var Le;(Le=t.oncancel)==null||Le.apply(this,de)}),se("click",x,de=>de.stopPropagation()),se("click",b,()=>k(l,Math.max(0,e(l)-1),!0)),ft(u,()=>e(l),de=>k(l,de)),se("click",H,()=>k(l,Math.min(23,e(l)+1),!0)),se("click",Y,()=>k(P,Math.max(0,e(P)-1),!0)),ft(L,()=>e(P),de=>k(P,de)),se("click",S,()=>k(P,e(P)+1)),se("click",N,()=>k(j,Math.max(s(),e(j)-1),!0)),ft(w,()=>e(j),de=>k(j,de)),se("click",F,()=>k(j,Math.min(i(),e(j)+1),!0)),se("click",Q,()=>k(U,Math.max(_(),e(U)-1),!0)),ft(X,()=>e(U),de=>k(U,de)),se("click",re,()=>k(U,Math.min(y(),e(U)+1),!0)),se("click",ue,function(...de){var Le;(Le=t.oncancel)==null||Le.apply(this,de)}),se("click",Te,D),d(o,C),ae()}at(["click"]);var kr=m('<div class="integration-status integration-status--missing svelte-68mpyg" role="alert"><span class="integration-status__label svelte-68mpyg">Integration required</span> <span class="integration-status__desc svelte-68mpyg">Set credentials in</span> <button class="integration-status__link svelte-68mpyg">Go to Settings</button></div>'),Sr=m('<div class="integration-status integration-status--ready svelte-68mpyg" role="status"><span class="integration-status__label svelte-68mpyg">Integration connected</span></div>'),Mr=m('<p class="config-panel__empty svelte-68mpyg">No configuration options available for this widget.</p>'),Hr=m('<span class="config-field__required svelte-68mpyg">*</span>'),Nr=m('<p class="config-field__desc svelte-68mpyg"> </p>'),jr=m('<input type="text" class="config-field__input svelte-68mpyg"/>'),Wr=m('<input type="password" class="config-field__input svelte-68mpyg" autocomplete="off"/>'),Dr=m('<input type="number" class="config-field__input svelte-68mpyg"/>'),Cr=m('<label class="config-field__toggle svelte-68mpyg"><input type="checkbox" class="config-field__checkbox svelte-68mpyg"/> <span class="config-field__toggle-label svelte-68mpyg"> </span></label>'),Pr=m("<option> </option>"),Tr=m('<select class="config-field__select svelte-68mpyg"></select>'),zr=m('<div class="config-field svelte-68mpyg"><label class="config-field__label svelte-68mpyg"> <!></label> <!> <!></div>'),Ir=m('<div class="config-panel__fields svelte-68mpyg"></div>'),Lr=m('<div class="config-panel__error svelte-68mpyg" role="alert"> </div>'),qr=m('<div class="config-panel__saved svelte-68mpyg" role="status"> </div>'),$r=m('<button type="button" class="config-btn config-btn--save svelte-68mpyg"> </button>'),Er=m('<div class="config-backdrop svelte-68mpyg"><div class="config-panel svelte-68mpyg" role="dialog" tabindex="-1" aria-modal="true"><div class="config-panel__header svelte-68mpyg"><h2 class="config-panel__title svelte-68mpyg"> </h2> <span class="config-panel__subtitle svelte-68mpyg">Settings</span></div> <!> <!> <!> <!> <div class="config-panel__actions svelte-68mpyg"><button type="button" class="config-btn config-btn--cancel svelte-68mpyg">Cancel</button> <!></div></div></div>');function Ar(o,t){te(t,!0);let s=ge(()=>{var N;return((N=t.plugin.manifest.config_schema)==null?void 0:N.fields)??[]}),_=ge(()=>{if(!t.plugin.manifest.config_schema)return[];const N=va(t.plugin.manifest.config_schema),w=e(s).filter(F=>!F.category);return[...N,...w]}),i=xe(et({})),y=xe(!1),r=xe(""),l=xe(!1);Ze(()=>{const N={};for(const w of e(_))N[w.key]=t.plugin.config[w.key]!==void 0?t.plugin.config[w.key]:w.default!==void 0?w.default:w.type==="boolean"?!1:w.type==="number"?0:"";k(i,N,!0)});async function P(){k(y,!0),k(r,""),k(l,!1);try{const N=await fetch(`/plugins/${encodeURIComponent(t.plugin.plugin_id)}/config`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({config:e(i)})});if(!N.ok){const w=await N.text();throw new Error(w||`HTTP ${N.status}`)}if(t.plugin.builtin){const w=await fetch(`/modules/${encodeURIComponent(t.plugin.plugin_id)}/restart`,{method:"POST"});if(!w.ok){const F=await w.text();throw new Error(`Restart failed: ${F||`HTTP ${w.status}`}`)}}k(l,!0),setTimeout(()=>{var w;(w=t.onsaved)==null||w.call(t),t.onclose()},800)}catch(N){k(r,N instanceof Error?N.message:"Save failed",!0)}finally{k(y,!1)}}function j(N){N.key==="Escape"&&t.onclose()}function U(){return Bt(`${Yt}/admin`)}function T(N,w){k(i,{...e(i),[N]:w},!0)}var D=Er();nt("keydown",vt,j);var M=n(D),C=n(M),x=n(C),c=n(x,!0);a(x),mt(2),a(C);var v=f(C,2);{var h=N=>{var w=kr(),F=f(n(w),4);a(w),se("click",F,U),d(N,w)},q=N=>{var w=Sr();d(N,w)};B(v,N=>{t.plugin.integration_status==="missing"?N(h):t.plugin.integration_status==="ready"&&N(q,1)})}var g=f(v,2);{var b=N=>{var w=Mr();d(N,w)},u=N=>{var w=Ir();We(w,21,()=>e(_),F=>F.key,(F,z)=>{var E=zr(),Q=n(E),X=n(Q),re=f(X);{var ve=he=>{var ee=Hr();d(he,ee)};B(re,he=>{e(z).required&&he(ve)})}a(Q);var be=f(Q,2);{var ie=he=>{var ee=Nr(),_e=n(ee,!0);a(ee),R(()=>I(_e,e(z).description)),d(he,ee)};B(be,he=>{e(z).description&&he(ie)})}var ue=f(be,2);{var Te=he=>{var ee=jr();tt(ee),R(_e=>{oe(ee,"id",`wcfg-${e(z).key??""}`),jt(ee,_e),ee.required=e(z).required},[()=>String(e(i)[e(z).key]??"")]),se("input",ee,_e=>T(e(z).key,_e.currentTarget.value)),d(he,ee)},de=he=>{var ee=Wr();tt(ee),R(_e=>{oe(ee,"id",`wcfg-${e(z).key??""}`),jt(ee,_e),ee.required=e(z).required},[()=>String(e(i)[e(z).key]??"")]),se("input",ee,_e=>T(e(z).key,_e.currentTarget.value)),d(he,ee)},Le=he=>{var ee=Dr();tt(ee),R(_e=>{oe(ee,"id",`wcfg-${e(z).key??""}`),jt(ee,_e),oe(ee,"min",e(z).min),oe(ee,"max",e(z).max),ee.required=e(z).required},[()=>Number(e(i)[e(z).key]??0)]),se("input",ee,_e=>T(e(z).key,_e.currentTarget.valueAsNumber)),d(he,ee)},Re=he=>{var ee=Cr(),_e=n(ee);tt(_e);var fe=f(_e,2),Ie=n(fe,!0);a(fe),a(ee),R(Ae=>{oe(_e,"id",`wcfg-${e(z).key??""}`),ua(_e,Ae),I(Ie,e(i)[e(z).key]?"Enabled":"Disabled")},[()=>!!e(i)[e(z).key]]),se("change",_e,Ae=>T(e(z).key,Ae.currentTarget.checked)),d(he,ee)},Oe=he=>{var ee=Tr();We(ee,21,()=>e(z).options??[],fe=>fe.value,(fe,Ie)=>{var Ae=Pr(),lt=n(Ae,!0);a(Ae);var ot={};R(()=>{I(lt,e(Ie).label),ot!==(ot=e(Ie).value)&&(Ae.value=(Ae.__value=e(Ie).value)??"")}),d(fe,Ae)}),a(ee);var _e;Ft(ee),R(fe=>{oe(ee,"id",`wcfg-${e(z).key??""}`),_e!==(_e=fe)&&(ee.value=(ee.__value=fe)??"",Gt(ee,fe))},[()=>String(e(i)[e(z).key]??"")]),se("change",ee,fe=>T(e(z).key,fe.currentTarget.value)),d(he,ee)};B(ue,he=>{e(z).type==="string"?he(Te):e(z).type==="password"?he(de,1):e(z).type==="number"?he(Le,2):e(z).type==="boolean"?he(Re,3):e(z).type==="select"&&he(Oe,4)})}a(E),R(()=>{oe(Q,"for",`wcfg-${e(z).key??""}`),I(X,`${e(z).label??""} `)}),d(F,E)}),a(w),d(N,w)};B(g,N=>{e(_).length===0?N(b):N(u,!1)})}var H=f(g,2);{var A=N=>{var w=Lr(),F=n(w,!0);a(w),R(()=>I(F,e(r))),d(N,w)};B(H,N=>{e(r)&&N(A)})}var Z=f(H,2);{var Y=N=>{var w=qr(),F=n(w);a(w),R(()=>I(F,`Settings saved${t.plugin.builtin?" — restarting module":""}`)),d(N,w)};B(Z,N=>{e(l)&&N(Y)})}var L=f(Z,2),S=n(L),$=f(S,2);{var V=N=>{var w=$r(),F=n(w,!0);a(w),R(()=>{w.disabled=e(y),I(F,e(y)?"Saving...":"Save")}),se("click",w,P),d(N,w)};B($,N=>{e(_).length>0&&N(V)})}a(L),a(M),a(D),R(()=>{oe(M,"aria-label",`Configure ${t.plugin.manifest.name??""}`),I(c,t.plugin.manifest.name)}),se("mousedown",D,function(...N){var w;(w=t.onclose)==null||w.apply(this,N)}),se("mousedown",M,N=>N.stopPropagation()),se("click",S,function(...N){var w;(w=t.onclose)==null||w.apply(this,N)}),d(o,D),ae()}at(["mousedown","click","input","change"]);var Ur=m('<label class="util-config__field svelte-q3fj7w"><span class="util-config__label svelte-q3fj7w">Time Format</span> <select class="util-config__select svelte-q3fj7w"><option>12-hour (7:29 PM)</option><option>24-hour (19:29)</option></select></label>'),Rr=m('<div class="util-config-backdrop svelte-q3fj7w"><div class="util-config-panel svelte-q3fj7w" role="dialog" tabindex="-1" aria-modal="true"><h2 class="util-config__title svelte-q3fj7w">Clock Settings</h2> <!> <div class="util-config__actions svelte-q3fj7w"><button type="button" class="util-config__btn util-config__btn--cancel svelte-q3fj7w">Cancel</button> <button type="button" class="util-config__btn util-config__btn--save svelte-q3fj7w">Save</button></div></div></div>');function Fr(o,t){te(t,!0);let s=xe(t.config.hour12!==!1);function _(){t.onsave({...t.config,hour12:e(s)})}function i(D){D.key==="Escape"&&t.onclose()}var y=Rr();nt("keydown",vt,i);var r=n(y),l=f(n(r),2);{var P=D=>{var M=Ur(),C=f(n(M),2),x=n(C);x.value=x.__value="12";var c=f(x);c.value=c.__value="24",a(C);var v;Ft(C),a(M),R(()=>{v!==(v=e(s)?"12":"24")&&(C.value=C.__value=e(s)?"12":"24",Gt(C,e(s)?"12":"24"))}),se("change",C,h=>k(s,h.currentTarget.value==="12")),d(D,M)};B(l,D=>{t.utilityType==="clock"&&D(P)})}var j=f(l,2),U=n(j),T=f(U,2);a(j),a(r),a(y),R(()=>oe(r,"aria-label",`Configure ${t.utilityType??""}`)),se("mousedown",y,function(...D){var M;(M=t.onclose)==null||M.apply(this,D)}),se("mousedown",r,D=>D.stopPropagation()),se("click",U,function(...D){var M;(M=t.onclose)==null||M.apply(this,D)}),se("click",T,_),d(o,y),ae()}at(["mousedown","change","click"]);var Gr=m('<span class="edit-bar__dirty svelte-s9daqd" aria-label="Unsaved changes">Unsaved changes</span>'),Or=m('<div class="edit-bar svelte-s9daqd" role="toolbar" aria-label="Layout editing"><div class="edit-bar__group svelte-s9daqd"><button class="edit-bar__btn edit-bar__btn--undo svelte-s9daqd" type="button" aria-label="Undo" title="Undo (Ctrl+Z)">Undo</button> <button class="edit-bar__btn edit-bar__btn--redo svelte-s9daqd" type="button" aria-label="Redo" title="Redo (Ctrl+Shift+Z)">Redo</button></div> <!> <div class="edit-bar__group svelte-s9daqd"><button class="edit-bar__btn edit-bar__btn--cancel svelte-s9daqd" type="button" title="Cancel (Escape)">Cancel</button> <button class="edit-bar__btn edit-bar__btn--save svelte-s9daqd" type="button" aria-label="Save layout">Save</button></div></div>');function Br(o,t){var s=Or(),_=n(s),i=n(_),y=f(i,2);a(_);var r=f(_,2);{var l=T=>{var D=Gr();d(T,D)};B(r,T=>{t.dirty&&T(l)})}var P=f(r,2),j=n(P),U=f(j,2);a(P),a(s),R(()=>{i.disabled=!t.canUndo,y.disabled=!t.canRedo,U.disabled=!t.dirty}),se("click",i,function(...T){var D;(D=t.onundo)==null||D.apply(this,T)}),se("click",y,function(...T){var D;(D=t.onredo)==null||D.apply(this,T)}),se("click",j,function(...T){var D;(D=t.oncancel)==null||D.apply(this,T)}),se("click",U,function(...T){var D;(D=t.onsave)==null||D.apply(this,T)}),d(o,s)}at(["click"]);const Yr=50;function Fe(o){return o.map(t=>({...t}))}function Vr(o,t){if(o.length!==t.length)return!1;for(let s=0;s<o.length;s++)if(o[s].id!==t[s].id||o[s].x!==t[s].x||o[s].y!==t[s].y||o[s].w!==t[s].w||o[s].h!==t[s].h||o[s].showHeader!==!1!=(t[s].showHeader!==!1))return!1;return!0}function Ct(o){let t=Fe(o);const s=[],_=[];let i=Fe(o);return{pushState(y){s.push(Fe(i)),i=Fe(y),_.length=0,s.length>Yr&&s.shift()},undo(){return s.length===0||(_.push(Fe(i)),i=s.pop()),Fe(i)},redo(){return _.length===0||(s.push(Fe(i)),i=_.pop()),Fe(i)},canUndo(){return s.length>0},canRedo(){return _.length>0},isDirty(){return!Vr(i,t)},reset(y){t=Fe(y),i=Fe(y),s.length=0,_.length=0},getCurrent(){return Fe(i)}}}function Ut(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"}],["circle",{cx:"12",cy:"12",r:"3"}]];Me(o,He({name:"settings"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Kr(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M15 18h-5"}],["path",{d:"M18 14h-8"}],["path",{d:"M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"}],["rect",{width:"8",height:"4",x:"10",y:"6",rx:"1"}]];Me(o,He({name:"newspaper"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Zr(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978"}],["path",{d:"M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978"}],["path",{d:"M18 9h1.5a1 1 0 0 0 0-5H18"}],["path",{d:"M4 22h16"}],["path",{d:"M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"}],["path",{d:"M6 9H4.5a1 1 0 0 1 0-5H6"}]];Me(o,He({name:"trophy"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Xr(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}]];Me(o,He({name:"house"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Jr(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M13.744 17.736a6 6 0 1 1-7.48-7.48"}],["path",{d:"M15 6h1v4"}],["path",{d:"m6.134 14.768.866-.5 2 3.464"}],["circle",{cx:"16",cy:"8",r:"6"}]];Me(o,He({name:"coins"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function Qr(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M8 2v4"}],["path",{d:"M16 2v4"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2"}],["path",{d:"M3 10h18"}],["path",{d:"M8 14h.01"}],["path",{d:"M12 14h.01"}],["path",{d:"M16 14h.01"}],["path",{d:"M8 18h.01"}],["path",{d:"M12 18h.01"}],["path",{d:"M16 18h.01"}]];Me(o,He({name:"calendar-days"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function ei(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1"}],["circle",{cx:"12",cy:"8",r:"2"}],["path",{d:"M12 10v12"}],["path",{d:"M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z"}],["path",{d:"M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z"}]];Me(o,He({name:"flower-2"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function ti(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"}],["path",{d:"M20 2v4"}],["path",{d:"M22 4h-4"}],["circle",{cx:"4",cy:"20",r:"2"}]];Me(o,He({name:"sparkles"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function ai(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M12 7v14"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"}]];Me(o,He({name:"book-open"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}function si(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const _=[["path",{d:"M16 7h6v6"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17"}]];Me(o,He({name:"trending-up"},()=>s,{get iconNode(){return _},children:(i,y)=>{var r=pe(),l=le(r);Se(l,()=>t.children??ke),d(i,r)},$$slots:{default:!0}})),ae()}var ni=m('<div class="dashboard-empty svelte-15y8q3w"><p class="dashboard-empty__text svelte-15y8q3w">No plugins enabled. Visit the admin panel to configure your dashboard.</p></div>'),ri=m('<button type="button" class="widget-gear-btn svelte-15y8q3w"><!></button>'),ii=m('<span class="widget-header__icon svelte-15y8q3w"><!></span>'),li=m('<div class="widget-header svelte-15y8q3w"><!> <span class="widget-header__title svelte-15y8q3w"> </span></div>'),oi=m('<div class="dashboard-widget-content svelte-15y8q3w"><!> <!> <div><!></div></div>'),di=m('<button type="button" class="widget-gear-btn svelte-15y8q3w" aria-label="Widget settings"><!></button>'),ci=m("<div></div>"),vi=m('<div class="util-hdiv svelte-15y8q3w"></div>'),ui=m('<div class="util-vdiv svelte-15y8q3w"></div>'),_i=m('<div class="dashboard-widget-content svelte-15y8q3w"><!> <div class="widget-body widget-body--no-header svelte-15y8q3w"><!></div></div>'),gi=m('<button class="dashboard-add-btn svelte-15y8q3w" type="button" aria-label="Add Widget">Add Widget</button> <!>',1),hi=m('<a class="dashboard-admin-link svelte-15y8q3w">Admin</a>'),fi=m('<!> <button class="dashboard-edit-toggle svelte-15y8q3w" type="button">Edit Layout</button>',1),pi=m('<div><!> <!> <!> <div class="dashboard-toolbar svelte-15y8q3w"><!></div> <!> <!> <!> <!> <!></div>');function mi(o,t){var qe;te(t,!0);const s={weather:Xt,news:Kr,sports:Zr,"home-assistant":Xr,crypto:Jr,calendar:Qr,allergies:ei,"ai-news":ti,"word-of-day":ai,finance:si},_="lensing-dashboard-layout";let i=J(t,"allPlugins",19,()=>[]),y=J(t,"serverLayout",3,null),r,l=xe(!1),P=xe(!1),j=xe(null),U=xe(null),T=xe(null),D=xe(null),M=xe(null),C=xe(et([])),x=xe(null),c=xe(et(Ct([]))),v=ge(()=>xa(t.plugins));if(typeof window<"u")try{const W=localStorage.getItem(_);if(W){const O=JSON.parse(W);k(x,O,!0),(qe=t.onsave)==null||qe.call(t,O)}}catch{}Ze(()=>{if(!(!y()||e(l))){k(x,[...y()],!0);try{localStorage.setItem(_,JSON.stringify(y()))}catch{}}}),Ze(()=>{if(e(l))return;const W=e(v),O=e(x)?[...e(x)]:[...W];k(C,O.map(K=>{const ce=Wt(K.id);if(!ce)return K;const ze=Ha(ce);return ze?{...K,minW:ze.minW,minH:ze.minH,maxW:ze.maxW,maxH:ze.maxH}:K}),!0),k(c,Ct(O),!0)});let h=ge(()=>e(C)),q=ge(()=>(e(C),e(c).canUndo())),g=ge(()=>(e(C),e(c).canRedo())),b=ge(()=>(e(C),e(c).isDirty())),u=ge(()=>new Map(t.plugins.map(W=>[W.plugin_id,W]))),H=ge(()=>i().filter(W=>!e(h).some(O=>O.id===W.plugin_id)));function A(W){const O=new Map(e(C).map(ce=>[ce.id,ce])),K=W.map(ce=>{const ze=O.get(ce.id);return ze?{...ze,...ce}:ce});e(c).pushState(K),k(C,K,!0)}function Z(){if(e(l)){S();return}k(l,!0),k(c,Ct(e(C)),!0)}function Y(){const W=e(c).undo();k(C,W,!0)}function L(){const W=e(c).redo();k(C,W,!0)}function S(){const W=e(x)??e(v);e(c).reset(W),k(C,[...W],!0),k(l,!1),k(P,!1),k(j,null),k(T,null),k(D,null),k(M,null)}function $(W){if(!e(l))return;if(W.key==="Escape"){W.preventDefault(),S();return}const O=W.key.toLowerCase();if((W.ctrlKey||W.metaKey)&&O==="z"&&W.shiftKey){W.preventDefault(),L();return}if((W.ctrlKey||W.metaKey)&&O==="z"&&!W.shiftKey){W.preventDefault(),Y();return}}function V(W){const O=Vt(W.plugin_id,W.manifest),K={id:W.plugin_id,x:0,y:0,w:O.w,h:O.h},ce=[...e(C),K];e(c).pushState(ce),k(C,ce,!0),k(P,!1)}function N(W){const O=[...e(C),W];e(c).pushState(O),k(C,O,!0),k(P,!1)}function w(W){const O=e(C).filter(K=>K.id!==W);e(c).pushState(O),k(C,O,!0),k(j,null)}function F(W){k(j,null);const O=e(u).get(W)??i().find(K=>K.plugin_id===W);O&&k(D,O,!0)}function z(W,O){k(j,null),k(M,{widgetId:W,utilType:O},!0)}function E(W){if(!e(M))return;const O=e(M).widgetId,K=e(C).map(ce=>ce.id===O?{...ce,config:W}:ce);e(c).pushState(K),k(C,K,!0),k(M,null)}function Q(W){const O=e(C).map(K=>K.id===W?{...K,showHeader:K.showHeader===!1}:K);e(c).pushState(O),k(C,O,!0),k(j,null)}function X(W){k(j,null),k(T,W,!0)}function re(W){if(!e(T))return;const O=e(T).id,K=e(C).map(ce=>ce.id===O?{...ce,...W}:ce);e(c).pushState(K),k(C,K,!0),k(T,null)}function ve(){var W;k(x,[...e(h)],!0);try{localStorage.setItem(_,JSON.stringify(e(h)))}catch{}(W=t.onsave)==null||W.call(t,e(h)),e(c).reset(e(h)),k(l,!1),k(P,!1),k(j,null),k(T,null),k(D,null),k(M,null)}Ze(()=>{e(h).map(W=>W.id),wa().then(be)});function be(){if(r)for(const W of e(h)){const O=CSS.escape(W.id),K=r.querySelector(`.gs-item-content[data-widget-id="${O}"]`);if(!K||K.querySelector(".dashboard-widget-content"))continue;const ce=r.querySelector(`:scope > .dashboard-widget-content[data-widget-id="${O}"]`);ce&&K.appendChild(ce)}}function ie(W,O,K){const ce=e(h).find(ze=>ze.id===W);ce&&(k(j,ce,!0),k(U,{x:O,y:K},!0))}function ue(W,O){W.stopPropagation();const K=W.currentTarget.getBoundingClientRect();ie(O,K.left,K.bottom+4)}function Te(W){if(!e(l))return;let O=W.target;for(;O&&O!==W.currentTarget;){const K=O.getAttribute("data-widget-id");if(K){W.preventDefault(),ie(K,W.clientX,W.clientY);break}O=O.parentElement||W.currentTarget}}var de=pi();nt("keydown",vt,$);let Le;var Re=n(de);qa(Re,{get items(){return e(h)},get editMode(){return e(l)},get options(){return Lt},onchange:A});var Oe=f(Re,2);{var he=W=>{var O=ni();d(W,O)};B(Oe,W=>{e(h).length===0&&W(he)})}var ee=f(Oe,2);We(ee,17,()=>e(h),W=>W.id,(W,O)=>{const K=ge(()=>e(u).get(e(O).id)),ce=ge(()=>Wt(e(O).id));var ze=pe(),it=le(ze);{var dt=st=>{var Ue=oi(),ut=n(Ue);{var xt=Ke=>{var Ce=ri(),$e=n(Ce);Ut($e,{size:14,strokeWidth:2}),a(Ce),R(()=>oe(Ce,"aria-label",`Widget settings for ${e(K).manifest.name??""}`)),se("click",Ce,Be=>ue(Be,e(O).id)),d(Ke,Ce)};B(ut,Ke=>{e(l)&&Ke(xt)})}var _t=f(ut,2);{var kt=Ke=>{const Ce=ge(()=>s[e(O).id]);var $e=li(),Be=n($e);{var Mt=Ht=>{var Nt=ii(),ea=n(Nt);ma(ea,()=>e(Ce),(ta,aa)=>{aa(ta,{size:14})}),a(Nt),d(Ht,Nt)};B(Be,Ht=>{e(Ce)&&Ht(Mt)})}var $t=f(Be,2),Qt=n($t,!0);a($t),a($e),R(()=>I(Qt,e(K).manifest.name)),d(Ke,$e)};B(_t,Ke=>{e(O).showHeader!==!1&&Ke(kt)})}var gt=f(_t,2);let yt;var St=n(gt);Jn(St,{get name(){return e(K).manifest.name},children:(Ke,Ce)=>{Vn(Ke,{get plugin(){return e(K)}})},$$slots:{default:!0}}),a(gt),a(Ue),R(()=>{oe(Ue,"data-widget-id",e(O).id),yt=Ee(gt,1,"widget-body svelte-15y8q3w",null,yt,{"widget-body--no-header":e(O).showHeader===!1})}),d(st,Ue)},bt=st=>{var Ue=_i(),ut=n(Ue);{var xt=Ce=>{var $e=di(),Be=n($e);Ut(Be,{size:14,strokeWidth:2}),a($e),se("click",$e,Mt=>ue(Mt,e(O).id)),d(Ce,$e)};B(ut,Ce=>{e(l)&&Ce(xt)})}var _t=f(ut,2),kt=n(_t);{var gt=Ce=>{var $e=ci();let Be;R(()=>Be=Ee($e,1,"util-spacer svelte-15y8q3w",null,Be,{"util-spacer--edit":e(l)})),d(Ce,$e)},yt=Ce=>{var $e=vi();d(Ce,$e)},St=Ce=>{var $e=ui();d(Ce,$e)},Ke=Ce=>{{let $e=ge(()=>{var Be;return((Be=e(O).config)==null?void 0:Be.hour12)!==!1});Zn(Ce,{get hour12(){return e($e)}})}};B(kt,Ce=>{e(ce)==="spacer"?Ce(gt):e(ce)==="hdiv"?Ce(yt,1):e(ce)==="vdiv"?Ce(St,2):e(ce)==="clock"&&Ce(Ke,3)})}a(_t),a(Ue),R(()=>oe(Ue,"data-widget-id",e(O).id)),d(st,Ue)};B(it,st=>{e(K)?st(dt):e(ce)&&st(bt,1)})}d(W,ze)});var _e=f(ee,2),fe=n(_e);{var Ie=W=>{var O=gi(),K=le(O),ce=f(K,2);Br(ce,{onsave:ve,oncancel:S,onundo:Y,onredo:L,get canUndo(){return e(q)},get canRedo(){return e(g)},get dirty(){return e(b)}}),se("click",K,()=>k(P,!0)),d(W,O)},Ae=W=>{var O=fi(),K=le(O);{var ce=it=>{var dt=hi();R(()=>oe(dt,"href",t.adminHref)),d(it,dt)};B(K,it=>{t.adminHref&&it(ce)})}var ze=f(K,2);R(()=>oe(ze,"aria-pressed",e(l))),se("click",ze,Z),d(W,O)};B(fe,W=>{e(l)?W(Ie):W(Ae,!1)})}a(_e);var lt=f(_e,2);{var ot=W=>{const O=ge(()=>e(u).get(e(j).id)??i().find(ze=>ze.plugin_id===e(j).id)),K=ge(()=>Wt(e(j).id)),ce=ge(()=>{var ze;return((ze=e(O))==null?void 0:ze.manifest.name)??(e(K)==="spacer"?"Spacer":e(K)==="hdiv"?"Horizontal Line":e(K)==="vdiv"?"Vertical Line":e(K)==="clock"?"Clock":e(j).id)});{let ze=ge(()=>e(j).showHeader!==!1),it=ge(()=>{var Ue;return((Ue=e(U))==null?void 0:Ue.x)??0}),dt=ge(()=>{var Ue;return((Ue=e(U))==null?void 0:Ue.y)??0}),bt=ge(()=>e(K)==="clock"?()=>z(e(j).id,"clock"):e(K)?void 0:()=>F(e(j).id)),st=ge(()=>e(K)?void 0:()=>Q(e(j).id));fr(W,{get pluginId(){return e(j).id},get pluginName(){return e(ce)},get showHeader(){return e(ze)},get x(){return e(it)},get y(){return e(dt)},get onconfigure(){return e(bt)},ondelete:()=>w(e(j).id),onresize:()=>X(e(j)),get ontoggleheader(){return e(st)},onclose:()=>k(j,null)})}};B(lt,W=>{e(l)&&e(j)&&W(ot)})}var wt=f(lt,2);{var ne=W=>{{let O=ge(()=>{var K;return((K=e(u).get(e(T).id))==null?void 0:K.manifest.name)??e(T).id});xr(W,{get x(){return e(T).x},get y(){return e(T).y},get w(){return e(T).w},get h(){return e(T).h},get minW(){return e(T).minW},get minH(){return e(T).minH},get maxW(){return e(T).maxW},get maxH(){return e(T).maxH},get pluginName(){return e(O)},onconfirm:re,oncancel:()=>k(T,null)})}};B(wt,W=>{e(T)&&W(ne)})}var je=f(wt,2);{var De=W=>{Ar(W,{get plugin(){return e(D)},onclose:()=>k(D,null),get onsaved(){return t.onconfigsaved}})};B(je,W=>{e(D)&&W(De)})}var Pe=f(je,2);{var Je=W=>{{let O=ge(()=>{var K;return((K=e(C).find(ce=>ce.id===e(M).widgetId))==null?void 0:K.config)??{}});Fr(W,{get utilityType(){return e(M).utilType},get config(){return e(O)},onclose:()=>k(M,null),onsave:E})}};B(Pe,W=>{e(M)&&W(Je)})}var rt=f(Pe,2);{var Qe=W=>{or(W,{get availablePlugins(){return e(H)},onadd:V,onaddutility:N,onclose:()=>k(P,!1)})};B(rt,W=>{e(l)&&e(P)&&W(Qe)})}a(de),It(de,W=>r=W,()=>r),R(()=>Le=Ee(de,1,"dashboard-grid svelte-15y8q3w",null,Le,{"dashboard-edit-mode":e(l)})),se("contextmenu",de,Te),d(o,de),ae()}at(["contextmenu","click"]);const Jt="/layout";async function wi(o){try{return(await fetch(Jt,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({widgets:o})})).ok}catch{return!1}}async function yi(){try{const o=await fetch(Jt);return o.ok?(await o.json()).widgets??null:null}catch{return null}}var bi=m('<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>');function Wi(o,t){te(t,!0);let s=xe(et([])),_=xe(null);const i=new Set(_a);let y=ge(()=>e(s).filter(j=>!i.has(j.plugin_id)));async function r(){const j=await fetch("/plugins");j.ok&&k(s,await j.json(),!0)}function l(){r()}function P(j){wi(j).then(()=>r())}Ze(()=>{r();const j=location.protocol==="https:"?"wss:":"ws:",U=new WebSocket(`${j}//${location.host}/ws`);return U.addEventListener("message",T=>{try{const D=JSON.parse(String(T.data));D.type==="layout_change"?(r(),yi().then(M=>{M&&k(_,M,!0)})):D.type==="plugin_data"&&Un(D.payload)}catch{}}),()=>{U.close()}}),ga("1uha8ag",j=>{var U=bi();ia(()=>{la.title="Lensing Display"}),d(j,U)}),mi(o,{get plugins(){return e(y)},get allPlugins(){return e(y)},get serverLayout(){return e(_)},onsave:P,onconfigsaved:l,adminHref:"/admin"}),ae()}export{Wi as component};
