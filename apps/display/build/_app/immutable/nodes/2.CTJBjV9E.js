import{p as te,e as Je,a as d,n as ae,j as e,ba as x,o as m,bu as Se,q as n,s as a,c as we,f as le,t as F,bB as me,k as U,bC as Ke,W as ge,g as p,v as f,aB as Rt,R as ye,aA as xe,aC as pe,bv as sa,aW as mt,aD as na,bD as ra,be as et,bE as vt,ah as ia,bG as la}from"../chunks/DRA9cCzs.js";import{e as We,a as oe,f as Ee,I as Me,m as ct,l as oa,k as da,r as tt,b as ft,h as ca,p as va,j as jt,s as ua,i as Ft,d as Gt,S as _a,o as ga}from"../chunks/_BwtmL8j.js";import{p as J,v as B,s as I,z as He,r as Ne,y as nt,B as ha,C as fa,D as Ye,E as Ot,f as at,e as se,F as pa}from"../chunks/BpRJsttV.js";import{b as It,c as ma}from"../chunks/B_5CzqlB.js";import{s as ke}from"../chunks/CnsHFsvp.js";import{i as Fe}from"../chunks/BJh0JSOh.js";import{o as wa,g as Bt,b as Yt,t as ya}from"../chunks/HNclfR13.js";const Lt={columns:12,rowHeight:60,margin:[5,5],compact:"vertical",float:!1,resizeHandles:["n","ne","e","se","s","sw","w","nw"],minRow:1,maxRow:0,animate:150},ba={weather:{x:0,y:0,w:3,h:4},news:{x:3,y:0,w:4,h:4},sports:{x:7,y:0,w:3,h:4},crypto:{x:10,y:0,w:2,h:4},calendar:{x:0,y:4,w:4,h:5},"home-assistant":{x:4,y:4,w:4,h:5},"photo-slideshow":{x:8,y:4,w:4,h:5},allergies:{x:0,y:9,w:3,h:3}},ht={w:3,h:4};let pt=0,Pt=12;function xa(o){const t=ba[o];if(t)return t;const s={x:pt,y:Pt,w:ht.w,h:ht.h};return pt+=ht.w,pt+ht.w>12&&(pt=0,Pt+=ht.h),s}function ka(o){return pt=0,Pt=12,o.filter(t=>t.enabled!==!1).map(t=>{const s=xa(t.plugin_id);return{id:t.plugin_id,x:s.x,y:s.y,w:s.w,h:s.h}})}const Et={weather:{min:[2,2],preferred:[3,4],max:[6,8]},allergies:{min:[2,2],preferred:[3,3],max:[6,6]},crypto:{min:[2,2],preferred:[2,4],max:[6,8]},"word-of-day":{min:[2,2],preferred:[3,3],max:[6,6]},finance:{min:[2,2],preferred:[3,4],max:[6,8]},"ai-news":{min:[2,3],preferred:[4,5],max:[8,10]},news:{min:[2,3],preferred:[4,4],max:[8,10]},sports:{min:[2,2],preferred:[3,4],max:[6,8]},"photo-slideshow":{min:[2,3],preferred:[4,5],max:[12,12]},calendar:{min:[2,3],preferred:[4,5],max:[8,10]},"home-assistant":{min:[2,3],preferred:[4,5],max:[8,10]}},Sa={min:[1,2],preferred:[2,3],max:[12,12]};function Ma(o){return o!==null&&typeof o=="object"&&!Array.isArray(o)&&"min"in o&&"preferred"in o&&"max"in o}function Ha(o,t){return t!=null&&t.widget_sizes&&Ma(t.widget_sizes)?t.widget_sizes:o in Et?Et[o]:Sa}function Vt(o,t){const s=Ha(o,t);return{w:s.preferred[0],h:s.preferred[1]}}const Tt="__",zt=[{type:"spacer",label:"Spacer",description:"Invisible block to create breathing room",icon:"⬜",defaultW:3,defaultH:1,minW:1,minH:1,maxW:12,maxH:12},{type:"hdiv",label:"Horizontal Line",description:"Thin line to separate rows",icon:"━",defaultW:12,defaultH:1,minW:1,minH:1,maxW:12,maxH:1},{type:"vdiv",label:"Vertical Line",description:"Thin line to separate columns",icon:"┃",defaultW:1,defaultH:4,minW:1,minH:1,maxW:1,maxH:12},{type:"clock",label:"Clock",description:"Current time and date display",icon:"◷",defaultW:4,defaultH:2,minW:2,minH:2,maxW:12,maxH:12}];function Wt(o){if(!o.startsWith(Tt))return null;const t=o.slice(Tt.length),s=t.indexOf("-"),h=s===-1?t:t.slice(0,s);return["spacer","hdiv","vdiv","clock"].includes(h)?h:null}function Na(o){return zt.find(t=>t.type===o)}function ja(o){const t=Math.random().toString(36).slice(2,8);return`${Tt}${o}-${t}`}const Wa=200,Da=5,Ca=768,Kt=4,Pa=70,Ta=["se","sw"];function za(){return typeof window>"u"?!1:window.innerWidth<=Ca}function Ia(){return{...Lt,columns:Kt,rowHeight:Pa,resizeHandles:Ta,touchDelay:Wa,moveTolerance:Da,margin:[4,4]}}var La=m('<div class="grid-stack-item"><div class="grid-stack-item-content gs-item-content"><!></div></div>'),qa=m('<div class="grid-stack"><!></div>');function $a(o,t){te(t,!0);let s=J(t,"items",19,()=>[]),h=J(t,"editMode",3,!1),r=J(t,"options",3,Lt),y=Se(void 0),i,l=Se(!1),D=!1;Je(()=>{if(e(y))return N(),()=>{i&&(i.destroy(!1),i=void 0,x(l,!1))}});function N(){if(!e(y))return;const v=globalThis.GridStack;if(v)try{const c=za(),g=c?Ia():r(),q=c?Kt:r().columns,_=g.touchDelay??0,b=g.moveTolerance??0,u=v.init({column:q,cellHeight:g.rowHeight,margin:`${g.margin[0]}px`,float:g.float??!1,animate:(g.animate??150)>0,resizable:{handles:g.resizeHandles.join(",")},staticGrid:!h(),minRow:g.minRow??1,draggable:{touchDelay:_},...b>0?{moveTolerance:b}:{}},e(y));i=u,R(s()),u.on("change",()=>{if(!D&&t.onchange){const M=C();t.onchange(M)}}),u.on("added",(M,A)=>{if(!D&&t.onadd&&A.length>0)for(const Z of A){const Y=W(Z);Y&&t.onadd(Y)}}),u.on("removed",(M,A)=>{if(!D&&t.onremove&&A.length>0)for(const Z of A){const Y=W(Z);Y&&t.onremove(Y)}}),x(l,!0)}catch{}}function R(v){var q;if(!i)return;D=!0,i.batchUpdate();const c=new Map;for(const _ of i.getGridItems()){const b=(q=_.gridstackNode)==null?void 0:q.id;b&&c.set(b,_)}const g=new Set(v.map(_=>_.id));for(const[_,b]of c)g.has(_)||i.removeWidget(b);for(const _ of v){const b=/^[a-zA-Z0-9_-]+$/.test(_.id)?_.id:"invalid-widget",u=c.get(b);u?i.update(u,{x:_.x,y:_.y,w:_.w,h:_.h,minW:_.minW,minH:_.minH,maxW:_.maxW,maxH:_.maxH}):i.addWidget({id:b,w:_.w,h:_.h,autoPosition:!0,minW:_.minW,minH:_.minH,maxW:_.maxW,maxH:_.maxH,locked:_.locked,content:(()=>{const M=document.createElement("div");return M.className="gs-item-content",M.setAttribute("data-widget-id",b),M.outerHTML})()})}i.batchUpdate(!1),D=!1}function C(){return i?i.getGridItems().map(v=>{const c=v.gridstackNode;return{id:(c==null?void 0:c.id)??"",x:(c==null?void 0:c.x)??0,y:(c==null?void 0:c.y)??0,w:(c==null?void 0:c.w)??1,h:(c==null?void 0:c.h)??1}}):[]}function W(v){return v?{id:v.id??"",x:v.x??0,y:v.y??0,w:v.w??1,h:v.h??1}:null}Je(()=>{e(l)&&i&&i.setStatic(!h())}),Je(()=>{if(!e(l))return;const v=s().map(c=>({id:c.id,x:c.x,y:c.y,w:c.w,h:c.h,minW:c.minW,minH:c.minH,maxW:c.maxW,maxH:c.maxH,locked:c.locked}));R(v)});var S=qa(),T=n(S);{var j=v=>{var c=we(),g=le(c);We(g,17,s,q=>q.id,(q,_)=>{var b=La(),u=n(b),M=n(u);{var A=Z=>{var Y=we(),L=le(Y);ke(L,()=>t.widget,()=>({widget:e(_)})),d(Z,Y)};B(M,Z=>{t.widget&&Z(A)})}a(u),a(b),F(()=>{oe(b,"data-gs-id",e(_).id),oe(b,"data-gs-x",e(_).x),oe(b,"data-gs-y",e(_).y),oe(b,"data-gs-w",e(_).w),oe(b,"data-gs-h",e(_).h),oe(u,"data-widget-id",e(_).id)}),d(q,b)}),d(v,c)};B(T,v=>{e(l)||v(j)})}a(S),It(S,v=>x(y,v),()=>e(y)),d(o,S),ae()}var Ea=m('<div><img alt="Ambient slideshow" style="object-fit: cover; position: absolute; inset: 0; width: 100%; height: 100%;"/></div>'),Aa=m('<div class="photo-slideshow__empty svelte-ci60j3"><span>No photos available</span></div>'),Ua=m('<div class="photo-slideshow svelte-ci60j3"><!></div>');function Ra(o,t){te(t,!1);const s=ge();function h(v,c){return c<=1?0:(v+1)%c}let r=J(t,"photoPaths",24,()=>[]),y=J(t,"cycleInterval",8,8e3);const i=["ken-burns-1","ken-burns-2","ken-burns-3"];let l=ge(0),D=0,N=ge(i[0]);function R(){!r()||r().length===0||(x(l,h(e(l),r().length)),D=(D+1)%i.length,x(N,i[D]))}let C=ge();wa(()=>{e(C)&&clearInterval(e(C))}),me(()=>(U(r()),e(C),U(y())),()=>{r()&&r().length>1&&typeof window<"u"&&(e(C)&&clearInterval(e(C)),x(C,setInterval(R,y())))}),me(()=>(U(r()),e(l)),()=>{x(s,r()&&r().length>0?r()[e(l)]:null)}),Ke(),Fe();var W=Ua(),S=n(W);{var T=v=>{var c=Ea(),g=n(c);a(c),F(()=>{Ee(c,1,`photo-slideshow__slide photo-slideshow__slide--active ${e(N)??""}`,"svelte-ci60j3"),oe(g,"src",e(s))}),d(v,c)},j=v=>{var c=Aa();d(v,c)};B(S,v=>{e(s)?v(T):v(j,!1)})}a(W),d(o,W),ae()}var Fa=m('<div class="news-headlines__empty svelte-15lg0ov"><span>No headlines available</span></div>'),Ga=m('<li class="news-headlines__compact-item svelte-15lg0ov"><span class="news-headlines__category-badge svelte-15lg0ov"> </span> <span class="news-headlines__compact-title svelte-15lg0ov"> </span> <span class="news-headlines__age svelte-15lg0ov"> </span></li>'),Oa=m('<ul class="news-headlines__compact-list svelte-15lg0ov"></ul>'),Ba=m('<p class="news-headlines__summary svelte-15lg0ov"> </p>'),Ya=m('<li class="news-headlines__item svelte-15lg0ov"><div class="news-headlines__meta svelte-15lg0ov"><span class="news-headlines__category-badge svelte-15lg0ov"> </span> <span class="news-headlines__source svelte-15lg0ov"> </span> <span class="news-headlines__age svelte-15lg0ov"> </span></div> <p class="news-headlines__title svelte-15lg0ov"> </p> <!></li>'),Va=m('<ul class="news-headlines__list svelte-15lg0ov"></ul>'),Ka=m("<div><!></div>");function Za(o,t){te(t,!1);const s=ge();let h=J(t,"headlines",24,()=>[]),r=J(t,"maxItems",8,5),y=J(t,"compact",8,!1);function i(S){const T=Math.max(0,Date.now()-S),j=Math.floor(T/6e4);if(j<60)return`${j}m ago`;const v=Math.floor(j/60);return v<24?`${v}h ago`:`${Math.floor(v/24)}d ago`}me(()=>(U(h()),U(r())),()=>{x(s,h().slice(0,r()))}),Ke(),Fe();var l=Ka();let D;var N=n(l);{var R=S=>{var T=Fa();d(S,T)},C=S=>{var T=Oa();We(T,5,()=>e(s),j=>j.id,(j,v)=>{var c=Ga(),g=n(c),q=n(g,!0);a(g);var _=f(g,2),b=n(_,!0);a(_);var u=f(_,2),M=n(u,!0);a(u),a(c),F(A=>{I(q,(e(v),p(()=>e(v).category))),I(b,(e(v),p(()=>e(v).title))),I(M,A)},[()=>(e(v),p(()=>i(e(v).published)))]),d(j,c)}),a(T),d(S,T)},W=S=>{var T=Va();We(T,5,()=>e(s),j=>j.id,(j,v)=>{var c=Ya(),g=n(c),q=n(g),_=n(q,!0);a(q);var b=f(q,2),u=n(b,!0);a(b);var M=f(b,2),A=n(M,!0);a(M),a(g);var Z=f(g,2),Y=n(Z,!0);a(Z);var L=f(Z,2);{var k=$=>{var V=Ba(),H=n(V,!0);a(V),F(()=>I(H,(e(v),p(()=>e(v).summary)))),d($,V)};B(L,$=>{e(v),p(()=>e(v).summary)&&$(k)})}a(c),F($=>{I(_,(e(v),p(()=>e(v).category))),I(u,(e(v),p(()=>e(v).source))),I(A,$),I(Y,(e(v),p(()=>e(v).title)))},[()=>(e(v),p(()=>i(e(v).published)))]),d(j,c)}),a(T),d(S,T)};B(N,S=>{e(s),p(()=>e(s).length===0)?S(R):y()?S(C,1):S(W,!1)})}a(l),F(()=>D=Ee(l,1,"news-headlines svelte-15lg0ov",null,D,{"news-headlines--compact":y()})),d(o,l),ae()}var Xa=m('<div class="sports-scores__empty svelte-1xs1y9r"><span>No games available</span></div>'),Ja=m('<span class="sports-scores__live-badge svelte-1xs1y9r">LIVE</span>'),Qa=m('<li class="sports-scores__compact-item svelte-1xs1y9r"><span class="sports-scores__league-badge svelte-1xs1y9r"> </span> <!> <span class="sports-scores__compact-matchup svelte-1xs1y9r"> </span> <span class="sports-scores__compact-status svelte-1xs1y9r"> </span></li>'),es=m('<ul class="sports-scores__compact-list svelte-1xs1y9r"></ul>'),ts=m('<span class="sports-scores__period svelte-1xs1y9r"> </span>'),as=m('<span class="sports-scores__live-badge svelte-1xs1y9r">LIVE</span> <!>',1),ss=m('<span class="sports-scores__status svelte-1xs1y9r"> </span>'),ns=m('<li><div class="sports-scores__header svelte-1xs1y9r"><span class="sports-scores__league-badge svelte-1xs1y9r"> </span> <!></div> <div class="sports-scores__matchup svelte-1xs1y9r"><div class="sports-scores__team svelte-1xs1y9r"><span class="sports-scores__team-name svelte-1xs1y9r"> </span> <span class="sports-scores__score svelte-1xs1y9r"> </span></div> <div class="sports-scores__team svelte-1xs1y9r"><span class="sports-scores__team-name svelte-1xs1y9r"> </span> <span class="sports-scores__score svelte-1xs1y9r"> </span></div></div></li>'),rs=m('<ul class="sports-scores__list svelte-1xs1y9r"></ul>'),is=m("<div><!></div>");function ls(o,t){te(t,!1);const s=ge(),h=ge(),r=ge();let y=J(t,"games",24,()=>[]),i=J(t,"compact",8,!1);function l(j){return j.status==="in_progress"?j.period||"LIVE":j.status==="final"?"Final":j.status==="scheduled"?D(j.startTime):j.status==="postponed"?"PPD":j.status==="cancelled"?"Cancelled":j.status}function D(j){const v=new Date(j),c=v.getHours(),g=v.getMinutes().toString().padStart(2,"0"),q=c>=12?"PM":"AM";return`${c%12||12}:${g} ${q}`}me(()=>U(y()),()=>{x(s,y().filter(j=>j.status==="in_progress"))}),me(()=>U(y()),()=>{x(h,y().filter(j=>j.status!=="in_progress"))}),me(()=>(e(s),e(h)),()=>{x(r,[...e(s),...e(h)])}),Ke(),Fe();var N=is();let R;var C=n(N);{var W=j=>{var v=Xa();d(j,v)},S=j=>{var v=es();We(v,5,()=>e(r),c=>c.id,(c,g)=>{var q=Qa(),_=n(q),b=n(_,!0);a(_);var u=f(_,2);{var M=k=>{var $=Ja();d(k,$)};B(u,k=>{e(g),p(()=>e(g).status==="in_progress")&&k(M)})}var A=f(u,2),Z=n(A);a(A);var Y=f(A,2),L=n(Y,!0);a(Y),a(q),F((k,$)=>{I(b,k),I(Z,`${e(g),p(()=>e(g).awayTeam)??""}
            ${e(g),p(()=>e(g).awayScore)??""} – ${e(g),p(()=>e(g).homeScore)??""}
            ${e(g),p(()=>e(g).homeTeam)??""}`),I(L,$)},[()=>(e(g),p(()=>e(g).league.toUpperCase())),()=>(e(g),p(()=>l(e(g))))]),d(c,q)}),a(v),d(j,v)},T=j=>{var v=rs();We(v,5,()=>e(r),c=>c.id,(c,g)=>{var q=ns();let _;var b=n(q),u=n(b),M=n(u,!0);a(u);var A=f(u,2);{var Z=re=>{var ve=as(),be=f(le(ve),2);{var ie=ue=>{var Te=ts(),de=n(Te,!0);a(Te),F(()=>I(de,(e(g),p(()=>e(g).period)))),d(ue,Te)};B(be,ue=>{e(g),p(()=>e(g).period)&&ue(ie)})}d(re,ve)},Y=re=>{var ve=ss(),be=n(ve,!0);a(ve),F(ie=>I(be,ie),[()=>(e(g),p(()=>l(e(g))))]),d(re,ve)};B(A,re=>{e(g),p(()=>e(g).status==="in_progress")?re(Z):re(Y,!1)})}a(b);var L=f(b,2),k=n(L),$=n(k),V=n($,!0);a($);var H=f($,2),w=n(H,!0);a(H),a(k);var G=f(k,2),z=n(G),E=n(z,!0);a(z);var Q=f(z,2),X=n(Q,!0);a(Q),a(G),a(L),a(q),F(re=>{_=Ee(q,1,"sports-scores__item svelte-1xs1y9r",null,_,{"sports-scores__item--live":e(g).status==="in_progress"}),I(M,re),I(V,(e(g),p(()=>e(g).awayTeam))),I(w,(e(g),p(()=>e(g).awayScore))),I(E,(e(g),p(()=>e(g).homeTeam))),I(X,(e(g),p(()=>e(g).homeScore)))},[()=>(e(g),p(()=>e(g).league.toUpperCase()))]),d(c,q)}),a(v),d(j,v)};B(C,j=>{e(r),p(()=>e(r).length===0)?j(W):i()?j(S,1):j(T,!1)})}a(N),F(()=>R=Ee(N,1,"sports-scores svelte-1xs1y9r",null,R,{"sports-scores--compact":i()})),d(o,N),ae()}var os=m('<div class="ha-devices__empty svelte-1932y27"><span>No devices available</span></div>'),ds=m('<li><span class="ha-devices__name svelte-1932y27"> </span> <span> </span></li>'),cs=m('<section class="ha-devices__group svelte-1932y27"><h3 class="ha-devices__group-label svelte-1932y27">Lights</h3> <ul class="ha-devices__list svelte-1932y27"></ul></section>'),vs=m('<li><span class="ha-devices__name svelte-1932y27"> </span> <span> </span></li>'),us=m('<section class="ha-devices__group svelte-1932y27"><h3 class="ha-devices__group-label svelte-1932y27">Switches</h3> <ul class="ha-devices__list svelte-1932y27"></ul></section>'),_s=m('<li><span class="ha-devices__name svelte-1932y27"> </span> <span> </span></li>'),gs=m('<section class="ha-devices__group svelte-1932y27"><h3 class="ha-devices__group-label svelte-1932y27">Locks</h3> <ul class="ha-devices__list svelte-1932y27"></ul></section>'),hs=m('<li class="ha-devices__item svelte-1932y27"><span class="ha-devices__name svelte-1932y27"> </span> <span class="ha-devices__state ha-devices__state--climate svelte-1932y27"> </span></li>'),fs=m('<section class="ha-devices__group svelte-1932y27"><h3 class="ha-devices__group-label svelte-1932y27">Climate</h3> <ul class="ha-devices__list svelte-1932y27"></ul></section>'),ps=m('<li class="ha-devices__item svelte-1932y27"><span class="ha-devices__name svelte-1932y27"> </span> <span class="ha-devices__state ha-devices__state--sensor svelte-1932y27"> </span></li>'),ms=m('<section class="ha-devices__group svelte-1932y27"><h3 class="ha-devices__group-label svelte-1932y27">Sensors</h3> <ul class="ha-devices__list svelte-1932y27"></ul></section>'),ws=m("<!> <!> <!> <!> <!>",1),ys=m('<div class="ha-devices svelte-1932y27"><!></div>');function bs(o,t){te(t,!1);const s=ge(),h=ge(),r=ge(),y=ge();let i=J(t,"devices",24,()=>[]),l=J(t,"sensors",24,()=>[]);function D(v){return v.state.charAt(0).toUpperCase()+v.state.slice(1)}function N(v){return v.state==="on"||v.state==="unlocked"||v.state==="open"}function R(v){return v.state==="unlocked"||v.state==="open"}function C(v){const c=v.attributes.current_temperature,g=v.attributes.temperature;return c!==void 0&&g!==void 0?`${c}° / ${g}°`:D(v)}me(()=>U(i()),()=>{x(s,i().filter(v=>v.domain==="light"))}),me(()=>U(i()),()=>{x(h,i().filter(v=>v.domain==="switch"))}),me(()=>U(i()),()=>{x(r,i().filter(v=>v.domain==="lock"))}),me(()=>U(i()),()=>{x(y,i().filter(v=>v.domain==="climate"))}),Ke(),Fe();var W=ys(),S=n(W);{var T=v=>{var c=os();d(v,c)},j=v=>{var c=ws(),g=le(c);{var q=k=>{var $=cs(),V=f(n($),2);We(V,5,()=>e(s),H=>H.entity_id,(H,w)=>{var G=ds();let z;var E=n(G),Q=n(E,!0);a(E);var X=f(E,2);let re;var ve=n(X,!0);a(X),a(G),F((be,ie)=>{z=Ee(G,1,"ha-devices__item svelte-1932y27",null,z,be),I(Q,(e(w),p(()=>e(w).friendly_name))),re=Ee(X,1,"ha-devices__state svelte-1932y27",null,re,{"ha-devices__state--on":e(w).state==="on","ha-devices__state--off":e(w).state==="off"}),I(ve,ie)},[()=>({"ha-devices__item--active":N(e(w)),"ha-devices__item--warning":R(e(w))}),()=>(e(w),p(()=>D(e(w))))]),d(H,G)}),a(V),a($),d(k,$)};B(g,k=>{e(s),p(()=>e(s).length>0)&&k(q)})}var _=f(g,2);{var b=k=>{var $=us(),V=f(n($),2);We(V,5,()=>e(h),H=>H.entity_id,(H,w)=>{var G=vs();let z;var E=n(G),Q=n(E,!0);a(E);var X=f(E,2);let re;var ve=n(X,!0);a(X),a(G),F((be,ie)=>{z=Ee(G,1,"ha-devices__item svelte-1932y27",null,z,be),I(Q,(e(w),p(()=>e(w).friendly_name))),re=Ee(X,1,"ha-devices__state svelte-1932y27",null,re,{"ha-devices__state--on":e(w).state==="on","ha-devices__state--off":e(w).state==="off"}),I(ve,ie)},[()=>({"ha-devices__item--active":N(e(w)),"ha-devices__item--warning":R(e(w))}),()=>(e(w),p(()=>D(e(w))))]),d(H,G)}),a(V),a($),d(k,$)};B(_,k=>{e(h),p(()=>e(h).length>0)&&k(b)})}var u=f(_,2);{var M=k=>{var $=gs(),V=f(n($),2);We(V,5,()=>e(r),H=>H.entity_id,(H,w)=>{var G=_s();let z;var E=n(G),Q=n(E,!0);a(E);var X=f(E,2);let re;var ve=n(X,!0);a(X),a(G),F((be,ie,ue)=>{z=Ee(G,1,"ha-devices__item svelte-1932y27",null,z,be),I(Q,(e(w),p(()=>e(w).friendly_name))),re=Ee(X,1,"ha-devices__state svelte-1932y27",null,re,ie),I(ve,ue)},[()=>({"ha-devices__item--active":N(e(w)),"ha-devices__item--warning":R(e(w))}),()=>({"ha-devices__state--locked":e(w).state==="locked","ha-devices__state--warning":R(e(w))}),()=>(e(w),p(()=>D(e(w))))]),d(H,G)}),a(V),a($),d(k,$)};B(u,k=>{e(r),p(()=>e(r).length>0)&&k(M)})}var A=f(u,2);{var Z=k=>{var $=fs(),V=f(n($),2);We(V,5,()=>e(y),H=>H.entity_id,(H,w)=>{var G=hs(),z=n(G),E=n(z,!0);a(z);var Q=f(z,2),X=n(Q,!0);a(Q),a(G),F(re=>{I(E,(e(w),p(()=>e(w).friendly_name))),I(X,re)},[()=>(e(w),p(()=>C(e(w))))]),d(H,G)}),a(V),a($),d(k,$)};B(A,k=>{e(y),p(()=>e(y).length>0)&&k(Z)})}var Y=f(A,2);{var L=k=>{var $=ms(),V=f(n($),2);We(V,5,l,H=>H.entity_id,(H,w)=>{var G=ps(),z=n(G),E=n(z,!0);a(z);var Q=f(z,2),X=n(Q);a(Q),a(G),F(()=>{I(E,(e(w),p(()=>e(w).friendly_name))),I(X,`${e(w),p(()=>e(w).state)??""}${e(w),p(()=>e(w).attributes.unit_of_measurement?` ${e(w).attributes.unit_of_measurement}`:"")??""}`)}),d(H,G)}),a(V),a($),d(k,$)};B(Y,k=>{U(l()),p(()=>l().length>0)&&k(L)})}d(v,c)};B(S,v=>{U(i()),U(l()),p(()=>i().length===0&&l().length===0)?v(T):v(j,!1)})}a(W),d(o,W),ae()}var xs=Rt('<path fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"></path>'),ks=Rt('<svg class="sparkline svelte-8cklv6" preserveAspectRatio="none"><!></svg>');function Zt(o,t){te(t,!1);const s=ge();let h=J(t,"data",24,()=>[]),r=J(t,"width",8,120),y=J(t,"height",8,32),i=J(t,"positive",8,!0);function l(C,W,S){if(C.length<2)return"";const T=Math.min(...C),v=Math.max(...C)-T||1,c=1,g=S-c*2;return C.map((q,_)=>{const b=_/(C.length-1)*W,u=c+g-(q-T)/v*g;return`${_===0?"M":"L"}${b.toFixed(1)},${u.toFixed(1)}`}).join(" ")}me(()=>(U(h()),U(r()),U(y())),()=>{x(s,l(h(),r(),y()))}),Ke(),Fe();var D=ks(),N=n(D);{var R=C=>{var W=xs();F(()=>{oe(W,"d",e(s)),oe(W,"stroke",i()?"var(--alert-success, hsl(160, 45%, 45%))":"var(--alert-urgent, hsl(0, 60%, 55%))")}),d(C,W)};B(N,C=>{e(s)&&C(R)})}a(D),F(()=>{oe(D,"viewBox",`0 0 ${r()??""} ${y()??""}`),oe(D,"width",r()),oe(D,"height",y())}),d(o,D),ae()}var Ss=m('<div class="crypto-widget__empty svelte-fjg0w2"><span>No crypto data available</span></div>'),Ms=m('<div class="crypto-widget__chart svelte-fjg0w2"><!></div>'),Hs=m('<span><span class="crypto-widget__change-label svelte-fjg0w2"> </span> </span>'),Ns=m('<div class="crypto-widget__row svelte-fjg0w2"><div class="crypto-widget__info svelte-fjg0w2"><span class="crypto-widget__symbol svelte-fjg0w2"> </span> <span class="crypto-widget__name svelte-fjg0w2"> </span></div> <!> <div class="crypto-widget__values svelte-fjg0w2"><span class="crypto-widget__price svelte-fjg0w2"> </span> <div class="crypto-widget__changes svelte-fjg0w2"></div></div></div>'),js=m('<div class="crypto-widget__list svelte-fjg0w2"></div>'),Ws=m('<div class="crypto-widget svelte-fjg0w2"><!></div>');function Ds(o,t){te(t,!1);const s=ge();let h=J(t,"coins",24,()=>[]),r=J(t,"show1h",8,!1),y=J(t,"show24h",8,!0),i=J(t,"show7d",8,!1),l=J(t,"showSparkline",8,!0);function D(c,g){return g==="1h"?c.change_1h:g==="7d"?c.change_7d:c.change_24h}function N(c){const g=c.sparkline??[];return g.length===0?[]:g}function R(c){return c>=1e3?c.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):c>=1?c.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4}):c.toLocaleString("en-US",{minimumFractionDigits:4,maximumFractionDigits:8})}function C(c){return`${c>=0?"+":""}${c.toFixed(2)}%`}function W(c){return c>0?"crypto-widget__change--positive":c<0?"crypto-widget__change--negative":"crypto-widget__change--neutral"}me(()=>(U(r()),U(y()),U(i())),()=>{x(s,[r()&&{key:"1h",label:"1H"},y()&&{key:"24h",label:"24H"},i()&&{key:"7d",label:"7D"}].filter(Boolean))}),Ke(),Fe();var S=Ws(),T=n(S);{var j=c=>{var g=Ss();d(c,g)},v=c=>{var g=js();We(g,5,h,q=>q.id,(q,_)=>{const b=ye(()=>(e(_),p(()=>N(e(_)))));var u=Ns(),M=n(u),A=n(M),Z=n(A,!0);a(A);var Y=f(A,2),L=n(Y,!0);a(Y),a(M);var k=f(M,2);{var $=z=>{var E=Ms(),Q=n(E);{let X=ye(()=>(e(_),p(()=>e(_).change_24h>=0)));Zt(Q,{get data(){return e(b)},width:80,height:28,get positive(){return e(X)}})}a(E),d(z,E)};B(k,z=>{U(l()),U(e(b)),p(()=>l()&&e(b).length>=2)&&z($)})}var V=f(k,2),H=n(V),w=n(H);a(H);var G=f(H,2);We(G,5,()=>e(s),z=>z.key,(z,E)=>{const Q=ye(()=>(e(_),e(E),p(()=>D(e(_),e(E).key))));var X=Hs(),re=n(X),ve=n(re,!0);a(re);var be=f(re);a(X),F((ie,ue)=>{Ee(X,1,`crypto-widget__change ${ie??""}`,"svelte-fjg0w2"),oe(X,"title",`${e(E),p(()=>e(E).label)??""} change`),I(ve,(e(E),p(()=>e(E).label))),I(be,` ${ue??""}`)},[()=>(U(e(Q)),p(()=>W(e(Q)))),()=>(U(e(Q)),p(()=>C(e(Q))))]),d(z,X)}),a(G),a(V),a(u),F((z,E)=>{I(Z,z),I(L,(e(_),p(()=>e(_).name))),I(w,`$${E??""}`)},[()=>(e(_),p(()=>e(_).symbol.toUpperCase())),()=>(e(_),p(()=>R(e(_).price)))]),d(q,u)}),a(g),d(c,g)};B(T,c=>{U(h()),p(()=>h().length===0)?c(j):c(v,!1)})}a(S),d(o,S),ae()}function Xt(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["circle",{cx:"12",cy:"12",r:"4"}],["path",{d:"M12 2v2"}],["path",{d:"M12 20v2"}],["path",{d:"m4.93 4.93 1.41 1.41"}],["path",{d:"m17.66 17.66 1.41 1.41"}],["path",{d:"M2 12h2"}],["path",{d:"M20 12h2"}],["path",{d:"m6.34 17.66-1.41 1.41"}],["path",{d:"m19.07 4.93-1.41 1.41"}]];Me(o,He({name:"sun"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}function Cs(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["circle",{cx:"12",cy:"12",r:"4"}],["path",{d:"M12 4h.01"}],["path",{d:"M20 12h.01"}],["path",{d:"M12 20h.01"}],["path",{d:"M4 12h.01"}],["path",{d:"M17.657 6.343h.01"}],["path",{d:"M17.657 17.657h.01"}],["path",{d:"M6.343 17.657h.01"}],["path",{d:"M6.343 6.343h.01"}]];Me(o,He({name:"sun-dim"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}function Ps(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["path",{d:"M12 2v2"}],["path",{d:"m4.93 4.93 1.41 1.41"}],["path",{d:"M20 12h2"}],["path",{d:"m19.07 4.93-1.41 1.41"}],["path",{d:"M15.947 12.65a4 4 0 0 0-5.925-4.128"}],["path",{d:"M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"}]];Me(o,He({name:"cloud-sun"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}function Ts(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["path",{d:"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"}]];Me(o,He({name:"cloud"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}function zs(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["path",{d:"M17.5 12a1 1 0 1 1 0 9H9.006a7 7 0 1 1 6.702-9z"}],["path",{d:"M21.832 9A3 3 0 0 0 19 7h-2.207a5.5 5.5 0 0 0-10.72.61"}]];Me(o,He({name:"cloudy"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}function Is(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"}],["path",{d:"M16 17H7"}],["path",{d:"M17 21H9"}]];Me(o,He({name:"cloud-fog"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}function Ls(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["path",{d:"m5.2 6.2 1.4 1.4"}],["path",{d:"M2 13h2"}],["path",{d:"M20 13h2"}],["path",{d:"m17.4 7.6 1.4-1.4"}],["path",{d:"M22 17H2"}],["path",{d:"M22 21H2"}],["path",{d:"M16 13a4 4 0 0 0-8 0"}],["path",{d:"M12 5V2.5"}]];Me(o,He({name:"haze"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}function qs(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"}],["path",{d:"M8 19v1"}],["path",{d:"M8 14v1"}],["path",{d:"M16 19v1"}],["path",{d:"M16 14v1"}],["path",{d:"M12 21v1"}],["path",{d:"M12 16v1"}]];Me(o,He({name:"cloud-drizzle"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}function $s(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"}],["path",{d:"M16 14v6"}],["path",{d:"M8 14v6"}],["path",{d:"M12 16v6"}]];Me(o,He({name:"cloud-rain"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}function Es(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["path",{d:"M12 2v2"}],["path",{d:"m4.93 4.93 1.41 1.41"}],["path",{d:"M20 12h2"}],["path",{d:"m19.07 4.93-1.41 1.41"}],["path",{d:"M15.947 12.65a4 4 0 0 0-5.925-4.128"}],["path",{d:"M3 20a5 5 0 1 1 8.9-4H13a3 3 0 0 1 2 5.24"}],["path",{d:"M11 20v2"}],["path",{d:"M7 19v2"}]];Me(o,He({name:"cloud-sun-rain"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}function As(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"}],["path",{d:"M16 14v2"}],["path",{d:"M8 14v2"}],["path",{d:"M16 20h.01"}],["path",{d:"M8 20h.01"}],["path",{d:"M12 16v2"}],["path",{d:"M12 22h.01"}]];Me(o,He({name:"cloud-hail"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}function Us(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"}],["path",{d:"M8 15h.01"}],["path",{d:"M8 19h.01"}],["path",{d:"M12 17h.01"}],["path",{d:"M12 21h.01"}],["path",{d:"M16 15h.01"}],["path",{d:"M16 19h.01"}]];Me(o,He({name:"cloud-snow"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}function Rs(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["path",{d:"m10 20-1.25-2.5L6 18"}],["path",{d:"M10 4 8.75 6.5 6 6"}],["path",{d:"m14 20 1.25-2.5L18 18"}],["path",{d:"m14 4 1.25 2.5L18 6"}],["path",{d:"m17 21-3-6h-4"}],["path",{d:"m17 3-3 6 1.5 3"}],["path",{d:"M2 12h6.5L10 9"}],["path",{d:"m20 10-1.5 2 1.5 2"}],["path",{d:"M22 12h-6.5L14 15"}],["path",{d:"m4 10 1.5 2L4 14"}],["path",{d:"m7 21 3-6-1.5-3"}],["path",{d:"m7 3 3 6h4"}]];Me(o,He({name:"snowflake"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}function Fs(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["path",{d:"M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"}],["path",{d:"m13 12-3 5h4l-3 5"}]];Me(o,He({name:"cloud-lightning"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}function Gs(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["path",{d:"M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"}]];Me(o,He({name:"thermometer"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}var Os=m('<span class="weather-icon svelte-1i78a4g" aria-hidden="true"><!></span>');function Dt(o,t){let s=J(t,"size",3,24);function h(u){const M=u.toLowerCase();return M.includes("thunderstorm")?"cloud-lightning":M.includes("freezing rain")||M.includes("freezing drizzle")?"cloud-hail":M.includes("snow shower")?"cloud-snow":M.includes("snow")||M.includes("snow grains")?"snowflake":M.includes("rain shower")?"cloud-sun-rain":M.includes("rain")||M.includes("drizzle")?"cloud-rain":M.includes("drizzle")?"cloud-drizzle":M.includes("fog")||M.includes("mist")?"cloud-fog":M.includes("haze")?"haze":M.includes("overcast")||M.includes("broken clouds")?"cloudy":M.includes("partly cloudy")||M.includes("scattered clouds")||M.includes("few clouds")?"cloud-sun":M.includes("mostly clear")?"sun-dim":M.includes("clear")?"sun":"thermometer"}let r=pe(()=>h(t.conditions));var y=Os(),i=n(y);{var l=u=>{Xt(u,{get size(){return s()}})},D=u=>{Cs(u,{get size(){return s()}})},N=u=>{Ps(u,{get size(){return s()}})},R=u=>{Ts(u,{get size(){return s()}})},C=u=>{zs(u,{get size(){return s()}})},W=u=>{Is(u,{get size(){return s()}})},S=u=>{Ls(u,{get size(){return s()}})},T=u=>{qs(u,{get size(){return s()}})},j=u=>{$s(u,{get size(){return s()}})},v=u=>{Es(u,{get size(){return s()}})},c=u=>{As(u,{get size(){return s()}})},g=u=>{Us(u,{get size(){return s()}})},q=u=>{Rs(u,{get size(){return s()}})},_=u=>{Fs(u,{get size(){return s()}})},b=u=>{Gs(u,{get size(){return s()}})};B(i,u=>{e(r)==="sun"?u(l):e(r)==="sun-dim"?u(D,1):e(r)==="cloud-sun"?u(N,2):e(r)==="cloud"?u(R,3):e(r)==="cloudy"?u(C,4):e(r)==="cloud-fog"?u(W,5):e(r)==="haze"?u(S,6):e(r)==="cloud-drizzle"?u(T,7):e(r)==="cloud-rain"?u(j,8):e(r)==="cloud-sun-rain"?u(v,9):e(r)==="cloud-hail"?u(c,10):e(r)==="cloud-snow"?u(g,11):e(r)==="snowflake"?u(q,12):e(r)==="cloud-lightning"?u(_,13):u(b,!1)})}a(y),d(o,y)}var Bs=m('<div class="weather-widget__empty svelte-1l2lobr"><span>No weather data available</span></div>'),Ys=m('<div class="weather-widget__compact-row svelte-1l2lobr"><span class="weather-widget__compact-icon svelte-1l2lobr"><!></span> <span class="weather-widget__compact-temp svelte-1l2lobr"> </span> <span class="weather-widget__compact-conditions svelte-1l2lobr"> </span></div>'),Vs=m("<span> </span>"),Ks=m('<div class="weather-widget__forecast-row svelte-1l2lobr"><span class="weather-widget__forecast-day svelte-1l2lobr"> </span> <span class="weather-widget__forecast-icon svelte-1l2lobr"><!></span> <span class="weather-widget__forecast-conditions svelte-1l2lobr"> </span> <!> <span class="weather-widget__forecast-temps svelte-1l2lobr"><span class="weather-widget__forecast-high svelte-1l2lobr"> </span> <span class="weather-widget__forecast-sep svelte-1l2lobr">/</span> <span class="weather-widget__forecast-low svelte-1l2lobr"> </span></span></div>'),Zs=m('<div class="weather-widget__forecast svelte-1l2lobr"></div>'),Xs=m('<div class="weather-widget__current svelte-1l2lobr"><div class="weather-widget__hero svelte-1l2lobr"><span class="weather-widget__icon svelte-1l2lobr"><!></span> <span class="weather-widget__temp svelte-1l2lobr"> </span> <div class="weather-widget__conditions-block svelte-1l2lobr"><span class="weather-widget__conditions svelte-1l2lobr"> </span> <span class="weather-widget__feels-like svelte-1l2lobr"> </span></div></div> <div class="weather-widget__details svelte-1l2lobr"><span class="weather-widget__detail svelte-1l2lobr"><span class="weather-widget__detail-label svelte-1l2lobr">Humidity</span> <span class="weather-widget__detail-value svelte-1l2lobr"> </span></span></div></div> <!>',1),Js=m("<div><!></div>");function Qs(o,t){te(t,!1);let s=J(t,"current",8,null),h=J(t,"forecast",24,()=>[]),r=J(t,"compact",8,!1);function y(S){return`${Math.round(S)}°`}function i(S){return new Date(S+"T00:00:00").toLocaleDateString("en-US",{weekday:"short"})}Fe();var l=Js();let D;var N=n(l);{var R=S=>{var T=Bs();d(S,T)},C=S=>{var T=Ys(),j=n(T),v=n(j);Dt(v,{get conditions(){return U(s()),p(()=>s().conditions)},size:32}),a(j);var c=f(j,2),g=n(c,!0);a(c);var q=f(c,2),_=n(q,!0);a(q),a(T),F(b=>{I(g,b),I(_,(U(s()),p(()=>s().conditions)))},[()=>(U(s()),p(()=>y(s().temp)))]),d(S,T)},W=S=>{var T=Xs(),j=le(T),v=n(j),c=n(v),g=n(c);Dt(g,{get conditions(){return U(s()),p(()=>s().conditions)},size:40}),a(c);var q=f(c,2),_=n(q,!0);a(q);var b=f(q,2),u=n(b),M=n(u,!0);a(u);var A=f(u,2),Z=n(A);a(A),a(b),a(v);var Y=f(v,2),L=n(Y),k=f(n(L),2),$=n(k);a(k),a(L),a(Y),a(j);var V=f(j,2);{var H=w=>{var G=Zs();We(G,5,()=>(U(h()),p(()=>h().slice(0,5))),z=>z.date,(z,E)=>{var Q=Ks(),X=n(Q),re=n(X,!0);a(X);var ve=f(X,2),be=n(ve);Dt(be,{get conditions(){return e(E),p(()=>e(E).conditions)},size:16}),a(ve);var ie=f(ve,2),ue=n(ie,!0);a(ie);var Te=f(ie,2);{var de=_e=>{var fe=Vs();let Ie;var Ae=n(fe);a(fe),F(()=>{Ie=Ee(fe,1,"weather-widget__forecast-rain svelte-1l2lobr",null,Ie,{"weather-widget__forecast-rain--high":e(E).precipChance>=50}),I(Ae,`${e(E),p(()=>e(E).precipChance)??""}%`)}),d(_e,fe)};B(Te,_e=>{e(E),p(()=>e(E).precipChance!=null)&&_e(de)})}var Le=f(Te,2),Re=n(Le),Oe=n(Re,!0);a(Re);var he=f(Re,4),ee=n(he,!0);a(he),a(Le),a(Q),F((_e,fe,Ie)=>{I(re,_e),I(ue,(e(E),p(()=>e(E).conditions))),I(Oe,fe),I(ee,Ie)},[()=>(e(E),p(()=>i(e(E).date))),()=>(e(E),p(()=>y(e(E).high))),()=>(e(E),p(()=>y(e(E).low)))]),d(z,Q)}),a(G),d(w,G)};B(V,w=>{U(h()),p(()=>h().length>0)&&w(H)})}F((w,G)=>{I(_,w),I(M,(U(s()),p(()=>s().conditions))),I(Z,`Feels like ${G??""}`),I($,`${U(s()),p(()=>s().humidity)??""}%`)},[()=>(U(s()),p(()=>y(s().temp))),()=>(U(s()),p(()=>y(s().feelsLike)))]),d(S,T)};B(N,S=>{s()?r()?S(C,1):S(W,!1):S(R)})}a(l),F(()=>D=Ee(l,1,"weather-widget svelte-1l2lobr",null,D,{"weather-widget--compact":r()})),d(o,l),ae()}var en=m('<div class="calendar-widget__empty svelte-c2xea9"><span>No calendar events</span></div>'),tn=m('<span class="calendar-widget__compact-time calendar-widget__compact-time--allday svelte-c2xea9">All Day</span>'),an=m('<span class="calendar-widget__compact-time svelte-c2xea9"> </span>'),sn=m('<li class="calendar-widget__compact-item svelte-c2xea9"><!> <span class="calendar-widget__compact-title svelte-c2xea9"> </span></li>'),nn=m('<ul class="calendar-widget__compact-list svelte-c2xea9"></ul>'),rn=m('<span class="calendar-widget__allday-badge svelte-c2xea9">All Day</span>'),ln=m('<span class="calendar-widget__event-location svelte-c2xea9"> </span>'),on=m('<span class="calendar-widget__event-dot svelte-c2xea9"></span>'),dn=m('<li><div class="calendar-widget__event-time svelte-c2xea9"><!></div> <div class="calendar-widget__event-body svelte-c2xea9"><span class="calendar-widget__event-title svelte-c2xea9"> </span> <!></div> <!></li>'),cn=m('<div class="calendar-widget__day"><div class="calendar-widget__day-header svelte-c2xea9"> </div> <ul class="calendar-widget__event-list svelte-c2xea9"></ul></div>'),vn=m('<div class="calendar-widget__groups svelte-c2xea9"></div>'),un=m("<div><!></div>");function _n(o,t){te(t,!1);const s=ge(),h=ge();let r=J(t,"events",24,()=>[]),y=J(t,"compact",8,!1);function i(g){const q=new Date(g),_=q.getHours(),b=q.getMinutes().toString().padStart(2,"0"),u=_>=12?"PM":"AM";return`${_%12||12}:${b} ${u}`}function l(){const g=new Date;return`${g.getFullYear()}-${String(g.getMonth()+1).padStart(2,"0")}-${String(g.getDate()).padStart(2,"0")}`}function D(g){return g.allDay?g.end.slice(0,10)>l():new Date(g.end).getTime()>=Date.now()}function N(g){const q=g.slice(0,10),_=l(),b=new Date;b.setDate(b.getDate()+1);const u=`${b.getFullYear()}-${String(b.getMonth()+1).padStart(2,"0")}-${String(b.getDate()).padStart(2,"0")}`;if(q===_)return"Today";if(q===u)return"Tomorrow";const[M,A,Z]=q.split("-").map(Number);return new Date(M,A-1,Z).toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"})}function R(g,q){return g.filter(D).sort((_,b)=>new Date(_.start).getTime()-new Date(b.start).getTime()).slice(0,q)}function C(g){const q=g.filter(D).sort((b,u)=>new Date(b.start).getTime()-new Date(u.start).getTime()),_=new Map;for(const b of q){const u=N(b.start);_.has(u)||_.set(u,[]),_.get(u).push(b)}return Array.from(_.entries()).map(([b,u])=>({label:b,events:u}))}me(()=>U(r()),()=>{x(s,R(r(),5))}),me(()=>U(r()),()=>{x(h,C(r()))}),Ke(),Fe();var W=un();let S;var T=n(W);{var j=g=>{var q=en();d(g,q)},v=g=>{var q=nn();We(q,5,()=>e(s),_=>_.id,(_,b)=>{var u=sn(),M=n(u);{var A=k=>{var $=tn();d(k,$)},Z=k=>{var $=an(),V=n($,!0);a($),F(H=>I(V,H),[()=>(e(b),p(()=>i(e(b).start)))]),d(k,$)};B(M,k=>{e(b),p(()=>e(b).allDay)?k(A):k(Z,!1)})}var Y=f(M,2),L=n(Y,!0);a(Y),a(u),F(()=>I(L,(e(b),p(()=>e(b).title)))),d(_,u)}),a(q),d(g,q)},c=g=>{var q=vn();We(q,5,()=>e(h),_=>_.label,(_,b)=>{var u=cn(),M=n(u),A=n(M,!0);a(M);var Z=f(M,2);We(Z,5,()=>(e(b),p(()=>e(b).events)),Y=>Y.id,(Y,L)=>{var k=dn();let $;var V=n(k),H=n(V);{var w=ie=>{var ue=rn();d(ie,ue)},G=ie=>{var ue=sa();F(Te=>I(ue,Te),[()=>(e(L),p(()=>i(e(L).start)))]),d(ie,ue)};B(H,ie=>{e(L),p(()=>e(L).allDay)?ie(w):ie(G,!1)})}a(V);var z=f(V,2),E=n(z),Q=n(E,!0);a(E);var X=f(E,2);{var re=ie=>{var ue=ln(),Te=n(ue,!0);a(ue),F(()=>I(Te,(e(L),p(()=>e(L).location)))),d(ie,ue)};B(X,ie=>{e(L),p(()=>e(L).location)&&ie(re)})}a(z);var ve=f(z,2);{var be=ie=>{var ue=on();F(()=>ct(ue,`background:${e(L),p(()=>e(L).color)??""}`)),d(ie,ue)};B(ve,ie=>{e(L),p(()=>e(L).color)&&ie(be)})}a(k),F(()=>{$=Ee(k,1,"calendar-widget__event svelte-c2xea9",null,$,{"calendar-widget__event--allday":e(L).allDay}),I(Q,(e(L),p(()=>e(L).title)))}),d(Y,k)}),a(Z),a(u),F(()=>I(A,(e(b),p(()=>e(b).label)))),d(_,u)}),a(q),d(g,q)};B(T,g=>{U(r()),p(()=>r().length===0)?g(j):y()?g(v,1):g(c,!1)})}a(W),F(()=>S=Ee(W,1,"calendar-widget svelte-c2xea9",null,S,{"calendar-widget--compact":y()})),d(o,W),ae()}var gn=m('<div class="allergies-widget__location svelte-fd4qfr"> </div>'),hn=m('<span class="allergies-widget__trigger-chip svelte-fd4qfr"> </span>'),fn=m('<div class="allergies-widget__triggers svelte-fd4qfr"></div>'),pn=m('<div class="allergies-widget__period svelte-fd4qfr"><span class="allergies-widget__period-label svelte-fd4qfr"> </span> <span class="allergies-widget__period-index svelte-fd4qfr"> </span></div>'),mn=m('<div class="allergies-widget__forecast svelte-fd4qfr"></div>'),wn=m('<div class="allergies-widget__empty svelte-fd4qfr">No pollen data available</div>'),yn=m('<div class="allergies-widget svelte-fd4qfr"><div class="allergies-widget__header svelte-fd4qfr"><span class="allergies-widget__title svelte-fd4qfr">Pollen</span> <span class="allergies-widget__label svelte-fd4qfr"> </span></div> <!> <div class="allergies-widget__index-row svelte-fd4qfr"><span class="allergies-widget__index svelte-fd4qfr"> </span> <span class="allergies-widget__scale svelte-fd4qfr">/12</span></div> <div class="allergies-widget__gauge svelte-fd4qfr"><div class="allergies-widget__bar svelte-fd4qfr"></div></div> <!> <!></div>');function bn(o,t){te(t,!1);const s=ge(),h=ge();let r=J(t,"index",8,0),y=J(t,"level",8,"Low"),i=J(t,"color",8,"#4caf50"),l=J(t,"location",8,""),D=J(t,"triggers",24,()=>[]),N=J(t,"periods",24,()=>[]);function R(L){return L<=2.4?"#4caf50":L<=4.8?"#8bc34a":L<=7.2?"#ffeb3b":L<=9.6?"#ff9800":"#f44336"}me(()=>U(D()),()=>{x(s,D().reduce((L,k)=>{const $=k.plantType||"Other";return L[$]||(L[$]=[]),L[$].push(k.name),L},{}))}),me(()=>U(r()),()=>{x(h,`${Math.min(100,r()/12*100)}%`)}),Ke(),Fe();var C=yn(),W=n(C),S=f(n(W),2),T=n(S,!0);a(S),a(W);var j=f(W,2);{var v=L=>{var k=gn(),$=n(k,!0);a(k),F(()=>I($,l())),d(L,k)};B(j,L=>{l()&&L(v)})}var c=f(j,2),g=n(c),q=n(g,!0);a(g),mt(2),a(c);var _=f(c,2),b=n(_);a(_);var u=f(_,2);{var M=L=>{var k=fn();We(k,5,()=>(e(s),p(()=>Object.entries(e(s)))),([$,V])=>$,($,V)=>{var H=pe(()=>na(e(V),2));let w=()=>e(H)[0],G=()=>e(H)[1];var z=hn(),E=n(z);a(z),F(Q=>I(E,`${w()??""}: ${Q??""}`),[()=>(G(),p(()=>G().join(", ")))]),d($,z)}),a(k),d(L,k)};B(u,L=>{U(D()),p(()=>D().length>0)&&L(M)})}var A=f(u,2);{var Z=L=>{var k=mn();We(k,5,N,$=>$.type,($,V)=>{var H=pn(),w=n(H),G=n(w,!0);a(w);var z=f(w,2),E=n(z,!0);a(z),a(H),F((Q,X)=>{I(G,(e(V),p(()=>e(V).type))),ct(z,`color: ${Q??""}`),I(E,X)},[()=>(e(V),p(()=>R(e(V).index))),()=>(e(V),p(()=>e(V).index.toFixed(1)))]),d($,H)}),a(k),d(L,k)},Y=L=>{var k=wn();d(L,k)};B(A,L=>{U(N()),p(()=>N().length>0)?L(Z):L(Y,!1)})}a(C),F(L=>{ct(S,`color: ${i()??""}`),I(T,y()),ct(g,`color: ${i()??""}`),I(q,L),ct(b,`width: ${e(h)??""}; background: ${i()??""};`)},[()=>(U(r()),p(()=>r().toFixed(1)))]),d(o,C),ae()}var xn=m('<div class="ai-news__empty svelte-6g2jpi"><span>No AI summaries available</span></div>'),kn=m('<li class="ai-news__item svelte-6g2jpi"><div class="ai-news__meta svelte-6g2jpi"><span class="ai-news__category svelte-6g2jpi"> </span> <span class="ai-news__source svelte-6g2jpi"> </span> <span class="ai-news__age svelte-6g2jpi"> </span></div> <p class="ai-news__title svelte-6g2jpi"> </p> <p class="ai-news__summary svelte-6g2jpi"> </p></li>'),Sn=m('<div class="ai-news__pager svelte-6g2jpi"><button class="ai-news__pager-btn svelte-6g2jpi" aria-label="Previous page">&lsaquo;</button> <span class="ai-news__pager-info svelte-6g2jpi"> </span> <button class="ai-news__pager-btn svelte-6g2jpi" aria-label="Next page">&rsaquo;</button></div>'),Mn=m('<ul class="ai-news__list svelte-6g2jpi"></ul> <!>',1),Hn=m('<div class="ai-news svelte-6g2jpi"><!></div>');function Nn(o,t){te(t,!1);const s=ge(),h=ge();let r=J(t,"summaries",24,()=>[]),y=J(t,"pageSize",8,5),i=J(t,"rotateSeconds",8,30),l=ge(0),D=ge();function N(){x(l,(e(l)+1)%e(s))}function R(){x(l,(e(l)-1+e(s))%e(s))}function C(v){const c=Math.max(0,Date.now()-v),g=Math.floor(c/6e4);if(g<60)return`${g}m ago`;const q=Math.floor(g/60);return q<24?`${q}h ago`:`${Math.floor(q/24)}d ago`}me(()=>(U(r()),U(y())),()=>{x(s,Math.max(1,Math.ceil(r().length/y())))}),me(()=>U(r()),()=>{r()&&x(l,0)}),me(()=>(U(r()),e(l),U(y())),()=>{x(h,r().slice(e(l)*y(),(e(l)+1)*y()))}),me(()=>(e(D),U(i()),e(s)),()=>{e(D)!==void 0&&clearInterval(e(D)),x(D,void 0),i()>0&&e(s)>1&&x(D,setInterval(N,i()*1e3))}),Ke(),Fe();var W=Hn(),S=n(W);{var T=v=>{var c=xn();d(v,c)},j=v=>{var c=Mn(),g=le(c);We(g,5,()=>e(h),b=>b.id,(b,u)=>{var M=kn(),A=n(M),Z=n(A),Y=n(Z,!0);a(Z);var L=f(Z,2),k=n(L,!0);a(L);var $=f(L,2),V=n($,!0);a($),a(A);var H=f(A,2),w=n(H,!0);a(H);var G=f(H,2),z=n(G,!0);a(G),a(M),F(E=>{I(Y,(e(u),p(()=>e(u).category))),I(k,(e(u),p(()=>e(u).source))),I(V,E),I(w,(e(u),p(()=>e(u).title))),I(z,(e(u),p(()=>e(u).summary)))},[()=>(e(u),p(()=>C(e(u).published)))]),d(b,M)}),a(g);var q=f(g,2);{var _=b=>{var u=Sn(),M=n(u),A=f(M,2),Z=n(A);a(A);var Y=f(A,2);a(u),F(()=>I(Z,`${e(l)+1} / ${e(s)??""}`)),nt("click",M,R),nt("click",Y,N),d(b,u)};B(q,b=>{e(s)>1&&b(_)})}d(v,c)};B(S,v=>{U(r()),p(()=>r().length===0)?v(T):v(j,!1)})}a(W),d(o,W),ae()}var jn=m('<div class="wotd__empty svelte-1w1ki2k"><span>No word available</span></div>'),Wn=m('<span class="wotd__pos svelte-1w1ki2k"> </span>'),Dn=m('<div class="wotd__word svelte-1w1ki2k"> </div> <!> <p class="wotd__definition svelte-1w1ki2k"> </p>',1),Cn=m('<div class="wotd svelte-1w1ki2k"><!></div>');function Pn(o,t){te(t,!1);let s=J(t,"data",8,null);Fe();var h=Cn(),r=n(h);{var y=l=>{var D=jn();d(l,D)},i=l=>{var D=Dn(),N=le(D),R=n(N,!0);a(N);var C=f(N,2);{var W=j=>{var v=Wn(),c=n(v,!0);a(v),F(()=>I(c,(U(s()),p(()=>s().partOfSpeech)))),d(j,v)};B(C,j=>{U(s()),p(()=>s().partOfSpeech)&&j(W)})}var S=f(C,2),T=n(S,!0);a(S),F(()=>{I(R,(U(s()),p(()=>s().word))),I(T,(U(s()),p(()=>s().definition)))}),d(l,D)};B(r,l=>{s()?l(i,!1):l(y)})}a(h),d(o,h),ae()}var Tn=m('<div class="finance-widget__empty svelte-wbjoj9"><span>No stock data available</span></div>'),zn=m('<div class="finance-widget__chart svelte-wbjoj9"><!></div>'),In=m('<span><span class="finance-widget__change-label svelte-wbjoj9"> </span> </span>'),Ln=m('<div class="finance-widget__row svelte-wbjoj9"><div class="finance-widget__info svelte-wbjoj9"><span class="finance-widget__symbol svelte-wbjoj9"> </span> <span class="finance-widget__name svelte-wbjoj9"> </span></div> <!> <div class="finance-widget__values svelte-wbjoj9"><span class="finance-widget__price svelte-wbjoj9"> </span> <div class="finance-widget__changes svelte-wbjoj9"></div></div></div>'),qn=m('<div class="finance-widget__list svelte-wbjoj9"></div>'),$n=m('<div class="finance-widget svelte-wbjoj9"><!></div>');function En(o,t){te(t,!1);const s=ge();let h=J(t,"stocks",24,()=>[]),r=J(t,"show1h",8,!1),y=J(t,"show24h",8,!0),i=J(t,"show7d",8,!1),l=J(t,"showSparkline",8,!0);function D(c,g){return g==="1h"?c.change_1h:g==="7d"?c.change_7d:c.change_24h}function N(c){return c.sparkline.length>0?c.sparkline:[]}function R(c){return c>=1e3?c.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):c>=1?c.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:4}):c.toLocaleString("en-US",{minimumFractionDigits:4,maximumFractionDigits:8})}function C(c){return`${c>=0?"+":""}${c.toFixed(2)}%`}function W(c){return c>0?"finance-widget__change--positive":c<0?"finance-widget__change--negative":"finance-widget__change--neutral"}me(()=>(U(r()),U(y()),U(i())),()=>{x(s,[r()&&{key:"1h",label:"1H"},y()&&{key:"24h",label:"24H"},i()&&{key:"7d",label:"7D"}].filter(Boolean))}),Ke(),Fe();var S=$n(),T=n(S);{var j=c=>{var g=Tn();d(c,g)},v=c=>{var g=qn();We(g,5,h,q=>q.symbol,(q,_)=>{const b=ye(()=>(e(_),p(()=>N(e(_)))));var u=Ln(),M=n(u),A=n(M),Z=n(A,!0);a(A);var Y=f(A,2),L=n(Y,!0);a(Y),a(M);var k=f(M,2);{var $=z=>{var E=zn(),Q=n(E);{let X=ye(()=>(e(_),p(()=>e(_).change_24h>=0)));Zt(Q,{get data(){return e(b)},width:80,height:28,get positive(){return e(X)}})}a(E),d(z,E)};B(k,z=>{U(l()),U(e(b)),p(()=>l()&&e(b).length>=2)&&z($)})}var V=f(k,2),H=n(V),w=n(H);a(H);var G=f(H,2);We(G,5,()=>e(s),z=>z.key,(z,E)=>{const Q=ye(()=>(e(_),e(E),p(()=>D(e(_),e(E).key))));var X=In(),re=n(X),ve=n(re,!0);a(re);var be=f(re);a(X),F((ie,ue)=>{Ee(X,1,`finance-widget__change ${ie??""}`,"svelte-wbjoj9"),oe(X,"title",`${e(E),p(()=>e(E).label)??""} change`),I(ve,(e(E),p(()=>e(E).label))),I(be,` ${ue??""}`)},[()=>(U(e(Q)),p(()=>W(e(Q)))),()=>(U(e(Q)),p(()=>C(e(Q))))]),d(z,X)}),a(G),a(V),a(u),F(z=>{I(Z,(e(_),p(()=>e(_).symbol))),I(L,(e(_),p(()=>e(_).name))),I(w,`$${z??""}`)},[()=>(e(_),p(()=>R(e(_).price)))]),d(q,u)}),a(g),d(c,g)};B(T,c=>{U(h()),p(()=>h().length===0)?c(j):c(v,!1)})}a(S),d(o,S),ae()}var An=m('<div data-testid="shadow-widget"></div>');function Un(o,t){te(t,!1);let s=J(t,"html",8),h=J(t,"css",8),r=J(t,"data",8,null),y=ge();me(()=>(e(y),U(s()),U(r()),U(h())),()=>{if(e(y)){e(y).shadowRoot||e(y).attachShadow({mode:"open"});const l=oa(s(),r());ra(y,e(y).shadowRoot.innerHTML="<style>"+h()+"</style>"+l)}}),Ke(),Fe();var i=An();It(i,l=>x(y,l),()=>e(y)),d(o,i),ae()}const qt=ha(new Map);qt.subscribe;function Rn(o){qt.update(t=>{const s=new Map(t);return s.set(o.plugin_id,o),s})}const At=new Map;function Ve(o){let t=At.get(o);return t||(t=fa(qt,s=>{var h;return((h=s.get(o))==null?void 0:h.data)??null}),At.set(o,t)),t}var Fn=m("<div>Loading template...</div>"),Gn=m("<div>Failed to load template</div>"),On=m("<!> <!>",1);function Bn(o,t){te(t,!0);const s=()=>Ye(R,"$dataStore",h),[h,r]=Ot();let y=Se(""),i=Se(""),l=Se(!0),D=Se(!1);const N=t.pluginId,R=Ve(N);Je(()=>{(async()=>{const v=await fetch(`/plugins/${t.pluginId}/template`);if(!v.ok){x(D,!0),x(l,!1);return}const c=await v.json();x(y,c.html,!0),x(i,c.css,!0),x(l,!1)})()});var C=On(),W=le(C);{var S=v=>{var c=Fn();d(v,c)},T=v=>{var c=Gn();d(v,c)};B(W,v=>{e(l)?v(S):e(D)&&v(T,1)})}var j=f(W,2);Un(j,{get html(){return e(y)},get css(){return e(i)},get data(){return s()}}),d(o,C),ae(),r()}var Yn=m('<div class="not-configured overlay svelte-1s2yccz" role="status" aria-label="Integration not configured"><div class="not-configured__icon svelte-1s2yccz" aria-hidden="true">⚙</div> <p class="not-configured__title svelte-1s2yccz">Not Configured</p> <p class="not-configured__desc svelte-1s2yccz">This widget needs integration credentials.</p> <button class="not-configured__link svelte-1s2yccz">Go to Settings</button></div>'),Vn=m('<div class="plugin-renderer-wrap svelte-1s2yccz"><!></div>');function Kn(o,t){te(t,!1);const s=()=>Ye(H,"$newsStore",S),h=()=>Ye(w,"$sportsStore",S),r=()=>Ye(G,"$haStore",S),y=()=>Ye(z,"$cryptoStore",S),i=()=>Ye(E,"$weatherStore",S),l=()=>Ye(Q,"$calendarStore",S),D=()=>Ye(X,"$photoStore",S),N=()=>Ye(re,"$allergiesStore",S),R=()=>Ye(ve,"$aiNewsStore",S),C=()=>Ye(be,"$wotdStore",S),W=()=>Ye(ie,"$financeStore",S),[S,T]=Ot(),j=ge(),v=ge(),c=ge(),g=ge(),q=ge(),_=ge(),b=ge(),u=ge(),M=ge(),A=ge(),Z=ge(),Y=ge(),L=ge();let k=J(t,"plugin",8);function $(ne,je){return ne===!0||ne==="true"?!0:ne===!1||ne==="false"?!1:je}function V(){return Bt(`${Yt}/admin`)}const H=Ve("news-server"),w=Ve("sports-server"),G=Ve("home-assistant-server"),z=Ve("crypto-server"),E=Ve("weather-server"),Q=Ve("calendar-server"),X=Ve("photo-slideshow-server"),re=Ve("allergies-server"),ve=Ve("ai-news-server"),be=Ve("word-of-day-server"),ie=Ve("finance-server");me(()=>U(k()),()=>{x(j,k().plugin_id)}),me(()=>U(k()),()=>{x(v,k().integration_status)}),me(()=>s(),()=>{x(c,s())}),me(()=>h(),()=>{x(g,h())}),me(()=>r(),()=>{x(q,r())}),me(()=>y(),()=>{x(_,y())}),me(()=>i(),()=>{x(b,i())}),me(()=>l(),()=>{x(u,l())}),me(()=>D(),()=>{x(M,D())}),me(()=>N(),()=>{x(A,N())}),me(()=>R(),()=>{x(Z,R())}),me(()=>C(),()=>{x(Y,C())}),me(()=>W(),()=>{x(L,W())}),Ke(),Fe();var ue=Vn(),Te=n(ue);{var de=ne=>{var je=Yn(),De=f(n(je),6);a(je),se("click",De,V),d(ne,je)},Le=ne=>{{let je=ye(()=>(e(M),p(()=>{var Pe;return((Pe=e(M))==null?void 0:Pe.photoPaths)??[]}))),De=ye(()=>(U(k()),p(()=>(Number(k().config.cycleSeconds)||30)*1e3)));Ra(ne,{get photoPaths(){return e(je)},get cycleInterval(){return e(De)}})}},Re=ne=>{{let je=ye(()=>(e(c),p(()=>{var De;return((De=e(c))==null?void 0:De.articles)??[]})));Za(ne,{get headlines(){return e(je)}})}},Oe=ne=>{{let je=ye(()=>(e(g),p(()=>{var De;return((De=e(g))==null?void 0:De.games)??[]})));ls(ne,{get games(){return e(je)}})}},he=ne=>{{let je=ye(()=>(e(q),p(()=>{var Pe;return((Pe=e(q))==null?void 0:Pe.devices)??[]}))),De=ye(()=>(e(q),p(()=>{var Pe;return((Pe=e(q))==null?void 0:Pe.sensors)??[]})));bs(ne,{get devices(){return e(je)},get sensors(){return e(De)}})}},ee=ne=>{{let je=ye(()=>(e(_),p(()=>{var Qe;return((Qe=e(_))==null?void 0:Qe.coins)??[]}))),De=ye(()=>(U(k()),p(()=>$(k().config.show1h,!1)))),Pe=ye(()=>(U(k()),p(()=>$(k().config.show24h,!0)))),Xe=ye(()=>(U(k()),p(()=>$(k().config.show7d,!1)))),rt=ye(()=>(U(k()),p(()=>$(k().config.showSparkline,!0))));Ds(ne,{get coins(){return e(je)},get show1h(){return e(De)},get show24h(){return e(Pe)},get show7d(){return e(Xe)},get showSparkline(){return e(rt)}})}},_e=ne=>{{let je=ye(()=>(e(b),p(()=>{var Pe;return((Pe=e(b))==null?void 0:Pe.current)??null}))),De=ye(()=>(e(b),p(()=>{var Pe;return((Pe=e(b))==null?void 0:Pe.forecast)??[]})));Qs(ne,{get current(){return e(je)},get forecast(){return e(De)}})}},fe=ne=>{{let je=ye(()=>(e(u),p(()=>{var De;return((De=e(u))==null?void 0:De.events)??[]})));_n(ne,{get events(){return e(je)}})}},Ie=ne=>{{let je=ye(()=>(e(A),p(()=>{var qe;return((qe=e(A))==null?void 0:qe.index)??0}))),De=ye(()=>(e(A),p(()=>{var qe;return((qe=e(A))==null?void 0:qe.level)??"Low"}))),Pe=ye(()=>(e(A),p(()=>{var qe;return((qe=e(A))==null?void 0:qe.color)??"#4caf50"}))),Xe=ye(()=>(e(A),p(()=>{var qe;return((qe=e(A))==null?void 0:qe.location)??""}))),rt=ye(()=>(e(A),p(()=>{var qe;return((qe=e(A))==null?void 0:qe.triggers)??[]}))),Qe=ye(()=>(e(A),p(()=>{var qe;return((qe=e(A))==null?void 0:qe.periods)??[]})));bn(ne,{get index(){return e(je)},get level(){return e(De)},get color(){return e(Pe)},get location(){return e(Xe)},get triggers(){return e(rt)},get periods(){return e(Qe)}})}},Ae=ne=>{Pn(ne,{get data(){return e(Y)}})},lt=ne=>{{let je=ye(()=>(e(L),p(()=>{var Qe;return((Qe=e(L))==null?void 0:Qe.stocks)??[]}))),De=ye(()=>(U(k()),p(()=>$(k().config.show1h,!1)))),Pe=ye(()=>(U(k()),p(()=>$(k().config.show24h,!0)))),Xe=ye(()=>(U(k()),p(()=>$(k().config.show7d,!1)))),rt=ye(()=>(U(k()),p(()=>$(k().config.showSparkline,!0))));En(ne,{get stocks(){return e(je)},get show1h(){return e(De)},get show24h(){return e(Pe)},get show7d(){return e(Xe)},get showSparkline(){return e(rt)}})}},ot=ne=>{{let je=ye(()=>(e(Z),p(()=>{var Xe;return((Xe=e(Z))==null?void 0:Xe.summaries)??[]}))),De=ye(()=>(U(k()),p(()=>Number(k().config.pageSize)||5))),Pe=ye(()=>(U(k()),p(()=>Number(k().config.rotateSeconds)??30)));Nn(ne,{get summaries(){return e(je)},get pageSize(){return e(De)},get rotateSeconds(){return e(Pe)}})}},wt=ne=>{Bn(ne,{get pluginId(){return e(j)}})};B(Te,ne=>{e(v)==="missing"?ne(de):e(j)==="photo-slideshow"?ne(Le,1):e(j)==="news"?ne(Re,2):e(j)==="sports"?ne(Oe,3):e(j)==="home-assistant"?ne(he,4):e(j)==="crypto"?ne(ee,5):e(j)==="weather"?ne(_e,6):e(j)==="calendar"?ne(fe,7):e(j)==="allergies"?ne(Ie,8):e(j)==="word-of-day"?ne(Ae,9):e(j)==="finance"?ne(lt,10):e(j)==="ai-news"?ne(ot,11):ne(wt,!1)})}a(ue),d(o,ue),ae(),T()}at(["click"]);var Zn=m('<div class="util-clock svelte-n5vm7q"><span class="util-clock__time svelte-n5vm7q"> <span class="util-clock__seconds svelte-n5vm7q"> </span></span> <span class="util-clock__date svelte-n5vm7q"> </span></div>');function Xn(o,t){te(t,!0);let s=J(t,"hour12",3,!0),h=Se(et(new Date));Je(()=>{const T=setInterval(()=>{x(h,new Date,!0)},1e3);return()=>clearInterval(T)});let r=pe(()=>e(h).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:s()})),y=pe(()=>e(h).toLocaleTimeString([],{second:"2-digit"}).slice(-2)),i=pe(()=>e(h).toLocaleDateString([],{weekday:"short",month:"short",day:"numeric"}));var l=Zn(),D=n(l),N=n(D,!0),R=f(N),C=n(R,!0);a(R),a(D);var W=f(D,2),S=n(W,!0);a(W),a(l),F(()=>{I(N,e(r)),I(C,e(y)),I(S,e(i))}),d(o,l),ae()}var Jn=m('<div class="error-tile svelte-15v71n" role="alert"><div class="error-icon svelte-15v71n" aria-hidden="true">⚠</div> <div class="error-name svelte-15v71n"> </div> <div class="error-message svelte-15v71n"> </div> <button class="retry-btn svelte-15v71n">Retry</button></div>');function Qn(o,t){let s=J(t,"name",8,"Widget");function h(l,D){l instanceof Error?l.message:String(l),console.error(`[ErrorBoundary] "${s()}" crashed:`,l)}function r(l){l()}var y=we(),i=le(y);pa(i,{onerror:h,failed:(D,N=xe,R=xe)=>{var C=Jn(),W=f(n(C),2),S=n(W,!0);a(W);var T=f(W,2),j=n(T,!0);a(T);var v=f(T,2);a(C),F(()=>{oe(C,"aria-label",`Error in ${s()??""}`),I(S,s()),I(j,(N(),p(()=>N()instanceof Error?N().message:"An error occurred")))}),se("click",v,()=>r(R())),d(D,C)}},D=>{var N=we(),R=le(N);da(R,t,"default",{}),d(D,N)}),d(o,y)}at(["click"]);var er=m('<div class="picker__card svelte-54et1y"><div class="picker__card-body svelte-54et1y"><div class="picker__card-icon picker__card-icon--util svelte-54et1y"> </div> <div class="picker__card-info svelte-54et1y"><span class="picker__card-name svelte-54et1y"> </span> <span class="picker__card-id svelte-54et1y"> </span></div></div> <div class="picker__card-meta svelte-54et1y"><span class="picker__card-size svelte-54et1y"> </span></div> <button type="button" class="picker__card-add svelte-54et1y">+ Add to Dashboard</button></div>'),tr=m('<div class="picker__group svelte-54et1y"><h3 class="picker__group-label svelte-54et1y">Layout <span class="picker__group-count svelte-54et1y"> </span></h3> <div class="picker__grid svelte-54et1y"></div></div>'),ar=m('<p class="picker__empty svelte-54et1y">No widgets match your search.</p>'),sr=m('<span class="picker__card-status picker__card-status--active svelte-54et1y">Active</span>'),nr=m('<span class="picker__card-status picker__card-status--error svelte-54et1y">Error</span>'),rr=m('<span class="picker__card-status svelte-54et1y"> </span>'),ir=m('<div class="picker__card svelte-54et1y"><div class="picker__card-body svelte-54et1y"><div class="picker__card-icon svelte-54et1y"> </div> <div class="picker__card-info svelte-54et1y"><span class="picker__card-name svelte-54et1y"> </span> <span class="picker__card-id svelte-54et1y"> </span></div></div> <div class="picker__card-meta svelte-54et1y"><span class="picker__card-size svelte-54et1y"> </span> <!></div> <button type="button" class="picker__card-add svelte-54et1y">+ Add to Dashboard</button></div>'),lr=m('<div class="picker__group svelte-54et1y"><h3 class="picker__group-label svelte-54et1y"> <span class="picker__group-count svelte-54et1y"> </span></h3> <div class="picker__grid svelte-54et1y"></div></div>'),or=m('<div class="picker-backdrop svelte-54et1y"><div class="picker svelte-54et1y" role="dialog" tabindex="-1" aria-modal="true" aria-label="Add widget"><div class="picker__header svelte-54et1y"><div><h2 class="picker__title svelte-54et1y">Add Widget</h2> <p class="picker__subtitle svelte-54et1y">Choose a widget to add to your dashboard</p></div> <button type="button" class="picker__close svelte-54et1y" aria-label="Close widget picker">✕</button></div> <div class="picker__search svelte-54et1y"><input type="text" class="picker__search-input svelte-54et1y" placeholder="Search widgets..."/></div> <div class="picker__body svelte-54et1y"><!> <!></div></div></div>');function dr(o,t){te(t,!0);let s=Se(""),h=pe(()=>e(s).trim().length===0?zt:zt.filter(_=>{const b=e(s).toLowerCase();return _.label.toLowerCase().includes(b)||_.type.toLowerCase().includes(b)})),r=pe(()=>e(s).trim().length===0?t.availablePlugins:t.availablePlugins.filter(_=>{const b=e(s).toLowerCase();return _.manifest.name.toLowerCase().includes(b)||_.plugin_id.toLowerCase().includes(b)})),y=pe(()=>{const _=e(r).filter(M=>M.builtin),b=e(r).filter(M=>!M.builtin),u=[];return _.length>0&&u.push({label:"Built-in",plugins:_}),b.length>0&&u.push({label:"Plugins",plugins:b}),u});function i(_){if(!t.onaddutility)return;const b={id:ja(_.type),x:0,y:0,w:_.defaultW,h:_.defaultH,minW:_.minW,minH:_.minH,maxW:_.maxW,maxH:_.maxH,showHeader:!1};t.onaddutility(b)}function l(_){_.key==="Escape"&&t.onclose()}var D=or();nt("keydown",vt,l);var N=n(D),R=n(N),C=f(n(R),2);a(R);var W=f(R,2),S=n(W);tt(S),a(W);var T=f(W,2),j=n(T);{var v=_=>{var b=tr(),u=n(b),M=f(n(u)),A=n(M);a(M),a(u);var Z=f(u,2);We(Z,21,()=>e(h),Y=>Y.type,(Y,L)=>{var k=er(),$=n(k),V=n($),H=n(V,!0);a(V);var w=f(V,2),G=n(w),z=n(G,!0);a(G);var E=f(G,2),Q=n(E,!0);a(E),a(w),a($);var X=f($,2),re=n(X),ve=n(re);a(re),a(X);var be=f(X,2);a(k),F(()=>{I(H,e(L).icon),I(z,e(L).label),I(Q,e(L).description),I(ve,`${e(L).defaultW??""}×${e(L).defaultH??""}`),oe(be,"aria-label",`Add ${e(L).label??""} to dashboard`)}),se("click",be,()=>i(e(L))),d(Y,k)}),a(Z),a(b),F(()=>I(A,`(${e(h).length??""})`)),d(_,b)};B(j,_=>{e(h).length>0&&_(v)})}var c=f(j,2);{var g=_=>{var b=ar();d(_,b)},q=_=>{var b=we(),u=le(b);We(u,17,()=>e(y),M=>M.label,(M,A)=>{var Z=lr(),Y=n(Z),L=n(Y),k=f(L),$=n(k);a(k),a(Y);var V=f(Y,2);We(V,21,()=>e(A).plugins,H=>H.plugin_id,(H,w)=>{const G=pe(()=>Vt(e(w).plugin_id,e(w).manifest));var z=ir(),E=n(z),Q=n(E),X=n(Q,!0);a(Q);var re=f(Q,2),ve=n(re),be=n(ve,!0);a(ve);var ie=f(ve,2),ue=n(ie,!0);a(ie),a(re),a(E);var Te=f(E,2),de=n(Te),Le=n(de);a(de);var Re=f(de,2);{var Oe=fe=>{var Ie=sr();d(fe,Ie)},he=fe=>{var Ie=nr();d(fe,Ie)},ee=fe=>{var Ie=rr(),Ae=n(Ie,!0);a(Ie),F(()=>I(Ae,e(w).status)),d(fe,Ie)};B(Re,fe=>{e(w).status==="active"?fe(Oe):e(w).status==="error"?fe(he,1):fe(ee,!1)})}a(Te);var _e=f(Te,2);a(z),F(fe=>{I(X,fe),I(be,e(w).manifest.name),I(ue,e(w).plugin_id),I(Le,`${e(G).w??""}×${e(G).h??""}`),oe(_e,"aria-label",`Add ${e(w).manifest.name??""} to dashboard`)},[()=>e(w).manifest.name.charAt(0).toUpperCase()]),se("click",_e,()=>t.onadd(e(w))),d(H,z)}),a(V),a(Z),F(()=>{I(L,`${e(A).label??""} `),I($,`(${e(A).plugins.length??""})`)}),d(M,Z)}),d(_,b)};B(c,_=>{e(r).length===0&&e(h).length===0?_(g):_(q,!1)})}a(T),a(N),a(D),se("click",D,function(..._){var b;(b=t.onclose)==null||b.apply(this,_)}),se("click",N,_=>_.stopPropagation()),se("click",C,function(..._){var b;(b=t.onclose)==null||b.apply(this,_)}),ft(S,()=>e(s),_=>x(s,_)),d(o,D),ae()}at(["click"]);function cr(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"}],["path",{d:"m15 5 4 4"}]];Me(o,He({name:"pencil"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}function vr(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["path",{d:"M12 2v20"}],["path",{d:"m15 19-3 3-3-3"}],["path",{d:"m19 9 3 3-3 3"}],["path",{d:"M2 12h20"}],["path",{d:"m5 9-3 3 3 3"}],["path",{d:"m9 5 3-3 3 3"}]];Me(o,He({name:"move"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}function ur(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}],["path",{d:"M3 9h18"}]];Me(o,He({name:"panel-top"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}function _r(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["path",{d:"M10 11v6"}],["path",{d:"M14 11v6"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"}],["path",{d:"M3 6h18"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}]];Me(o,He({name:"trash-2"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}var gr=m('<button type="button" class="context-menu__item svelte-4ktga8" role="menuitem"><span class="context-menu__icon svelte-4ktga8" aria-hidden="true"><!></span> Configure</button>'),hr=m('<button type="button" class="context-menu__item svelte-4ktga8" role="menuitem"><span class="context-menu__icon svelte-4ktga8" aria-hidden="true"><!></span> </button>'),fr=m('<div class="context-menu-backdrop svelte-4ktga8"><div class="context-menu svelte-4ktga8" role="menu" tabindex="-1"><div class="context-menu__header svelte-4ktga8"><span class="context-menu__name svelte-4ktga8"> </span></div> <!> <button type="button" class="context-menu__item svelte-4ktga8" role="menuitem"><span class="context-menu__icon svelte-4ktga8" aria-hidden="true"><!></span> Move &amp; Resize</button> <!> <hr class="context-menu__divider svelte-4ktga8"/> <button type="button" class="context-menu__item context-menu__item--danger svelte-4ktga8" role="menuitem"><span class="context-menu__icon svelte-4ktga8" aria-hidden="true"><!></span> Remove Widget</button></div></div>');function pr(o,t){te(t,!0);let s=J(t,"showHeader",3,!0),h=J(t,"x",3,0),r=J(t,"y",3,0),y=pe(()=>{const u=Math.min(h(),window.innerWidth-200),M=Math.min(r(),window.innerHeight-200);return`left: ${u}px; top: ${M}px;`});function i(u){u.key==="Escape"&&t.onclose()}var l=fr();nt("keydown",vt,i);var D=n(l),N=n(D),R=n(N),C=n(R,!0);a(R),a(N);var W=f(N,2);{var S=u=>{var M=gr(),A=n(M),Z=n(A);cr(Z,{size:14}),a(A),mt(),a(M),se("click",M,function(...Y){var L;(L=t.onconfigure)==null||L.apply(this,Y)}),d(u,M)};B(W,u=>{t.onconfigure&&u(S)})}var T=f(W,2),j=n(T),v=n(j);vr(v,{size:14}),a(j),mt(),a(T);var c=f(T,2);{var g=u=>{var M=hr(),A=n(M),Z=n(A);ur(Z,{size:14}),a(A);var Y=f(A);a(M),F(()=>I(Y,` ${s()?"Hide Header":"Show Header"}`)),se("click",M,function(...L){var k;(k=t.ontoggleheader)==null||k.apply(this,L)}),d(u,M)};B(c,u=>{t.ontoggleheader&&u(g)})}var q=f(c,4),_=n(q),b=n(_);_r(b,{size:14}),a(_),mt(),a(q),a(D),a(l),F(()=>{oe(D,"aria-label",`Widget actions for ${t.pluginName??""}`),oe(D,"data-plugin-id",t.pluginId),ct(D,e(y)),I(C,t.pluginName)}),se("mousedown",l,function(...u){var M;(M=t.onclose)==null||M.apply(this,u)}),se("mousedown",D,u=>u.stopPropagation()),se("click",T,function(...u){var M;(M=t.onresize)==null||M.apply(this,u)}),se("click",q,function(...u){var M;(M=t.ondelete)==null||M.apply(this,u)}),d(o,l),ae()}at(["mousedown","click"]);function mr(o,t){const s=[];return(!Number.isFinite(o.x)||!Number.isInteger(o.x))&&s.push("X position must be a valid integer"),(!Number.isFinite(o.y)||!Number.isInteger(o.y))&&s.push("Y position must be a valid integer"),(!Number.isFinite(o.w)||!Number.isInteger(o.w))&&s.push("Width must be a valid integer"),(!Number.isFinite(o.h)||!Number.isInteger(o.h))&&s.push("Height must be a valid integer"),s.length===0&&(o.x<0&&s.push("X position must be 0 or greater"),o.y<0&&s.push("Y position must be 0 or greater"),o.w<1&&s.push("Width must be at least 1"),o.h<1&&s.push("Height must be at least 1"),o.x+o.w>t&&s.push(`Widget extends beyond grid (max ${t} columns)`)),{valid:s.length===0,errors:s}}function wr(o,t){return{x:o.x,y:o.y,w:Math.max(t.minW,Math.min(t.maxW,o.w)),h:Math.max(t.minH,Math.min(t.maxH,o.h))}}var yr=m('<li class="modal__error svelte-11l7ja9"> </li>'),br=m('<ul class="modal__errors svelte-11l7ja9" role="alert"></ul>'),xr=m('<div class="modal-backdrop svelte-11l7ja9"><div class="modal svelte-11l7ja9" role="dialog" tabindex="-1" aria-modal="true"><h2 class="modal__title svelte-11l7ja9"> </h2> <div class="modal__fields svelte-11l7ja9"><label class="modal__field svelte-11l7ja9"><span class="modal__label svelte-11l7ja9">Column (X)</span> <div class="modal__stepper svelte-11l7ja9"><button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Decrease X">−</button> <input type="number" class="modal__input svelte-11l7ja9" aria-label="X position"/> <button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Increase X">+</button></div></label> <label class="modal__field svelte-11l7ja9"><span class="modal__label svelte-11l7ja9">Row (Y)</span> <div class="modal__stepper svelte-11l7ja9"><button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Decrease Y">−</button> <input type="number" class="modal__input svelte-11l7ja9" aria-label="Y position"/> <button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Increase Y">+</button></div></label> <label class="modal__field svelte-11l7ja9"><span class="modal__label svelte-11l7ja9">Width (W)</span> <div class="modal__stepper svelte-11l7ja9"><button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Decrease width">−</button> <input type="number" class="modal__input svelte-11l7ja9" aria-label="Width"/> <button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Increase width">+</button></div></label> <label class="modal__field svelte-11l7ja9"><span class="modal__label svelte-11l7ja9">Height (H)</span> <div class="modal__stepper svelte-11l7ja9"><button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Decrease height">−</button> <input type="number" class="modal__input svelte-11l7ja9" aria-label="Height"/> <button type="button" class="modal__step-btn svelte-11l7ja9" aria-label="Increase height">+</button></div></label></div> <!> <div class="modal__actions svelte-11l7ja9"><button type="button" class="modal__btn modal__btn--cancel svelte-11l7ja9">Cancel</button> <button type="button" class="modal__btn modal__btn--confirm svelte-11l7ja9">Apply</button></div></div></div>');function kr(o,t){te(t,!0);let s=J(t,"minW",3,1),h=J(t,"minH",3,1),r=J(t,"maxW",3,24),y=J(t,"maxH",3,24),i=J(t,"pluginName",3,"Widget"),l=Se(et(t.x)),D=Se(et(t.y)),N=Se(et(t.w)),R=Se(et(t.h)),C=pe(()=>mr({x:e(l),y:e(D),w:e(N),h:e(R)},24));function W(){if(!e(C).valid)return;const de=wr({x:e(l),y:e(D),w:e(N),h:e(R)},{minW:s(),minH:h(),maxW:r(),maxH:y()});t.onconfirm(de)}function S(de){de.key==="Escape"&&t.oncancel(),de.key==="Enter"&&e(C).valid&&W()}var T=xr();nt("keydown",vt,S);var j=n(T),v=n(j),c=n(v);a(v);var g=f(v,2),q=n(g),_=f(n(q),2),b=n(_),u=f(b,2);tt(u),oe(u,"min",0),oe(u,"max",23);var M=f(u,2);a(_),a(q);var A=f(q,2),Z=f(n(A),2),Y=n(Z),L=f(Y,2);tt(L),oe(L,"min",0);var k=f(L,2);a(Z),a(A);var $=f(A,2),V=f(n($),2),H=n(V),w=f(H,2);tt(w);var G=f(w,2);a(V),a($);var z=f($,2),E=f(n(z),2),Q=n(E),X=f(Q,2);tt(X);var re=f(X,2);a(E),a(z),a(g);var ve=f(g,2);{var be=de=>{var Le=br();We(Le,21,()=>e(C).errors,ca,(Re,Oe)=>{var he=yr(),ee=n(he,!0);a(he),F(()=>I(ee,e(Oe))),d(Re,he)}),a(Le),d(de,Le)};B(ve,de=>{e(C).valid||de(be)})}var ie=f(ve,2),ue=n(ie),Te=f(ue,2);a(ie),a(j),a(T),F(()=>{oe(j,"aria-label",`Resize ${i()??""}`),I(c,`Move & Resize — ${i()??""}`),oe(w,"min",s()),oe(w,"max",r()),oe(X,"min",h()),oe(X,"max",y()),Te.disabled=!e(C).valid}),se("click",T,function(...de){var Le;(Le=t.oncancel)==null||Le.apply(this,de)}),se("click",j,de=>de.stopPropagation()),se("click",b,()=>x(l,Math.max(0,e(l)-1),!0)),ft(u,()=>e(l),de=>x(l,de)),se("click",M,()=>x(l,Math.min(23,e(l)+1),!0)),se("click",Y,()=>x(D,Math.max(0,e(D)-1),!0)),ft(L,()=>e(D),de=>x(D,de)),se("click",k,()=>x(D,e(D)+1)),se("click",H,()=>x(N,Math.max(s(),e(N)-1),!0)),ft(w,()=>e(N),de=>x(N,de)),se("click",G,()=>x(N,Math.min(r(),e(N)+1),!0)),se("click",Q,()=>x(R,Math.max(h(),e(R)-1),!0)),ft(X,()=>e(R),de=>x(R,de)),se("click",re,()=>x(R,Math.min(y(),e(R)+1),!0)),se("click",ue,function(...de){var Le;(Le=t.oncancel)==null||Le.apply(this,de)}),se("click",Te,W),d(o,T),ae()}at(["click"]);var Sr=m('<div class="integration-status integration-status--missing svelte-68mpyg" role="alert"><span class="integration-status__label svelte-68mpyg">Integration required</span> <span class="integration-status__desc svelte-68mpyg">Set credentials in</span> <button class="integration-status__link svelte-68mpyg">Go to Settings</button></div>'),Mr=m('<div class="integration-status integration-status--ready svelte-68mpyg" role="status"><span class="integration-status__label svelte-68mpyg">Integration connected</span></div>'),Hr=m('<p class="config-panel__empty svelte-68mpyg">No configuration options available for this widget.</p>'),Nr=m('<span class="config-field__required svelte-68mpyg">*</span>'),jr=m('<p class="config-field__desc svelte-68mpyg"> </p>'),Wr=m('<input type="text" class="config-field__input svelte-68mpyg"/>'),Dr=m('<input type="password" class="config-field__input svelte-68mpyg" autocomplete="off"/>'),Cr=m('<input type="number" class="config-field__input svelte-68mpyg"/>'),Pr=m('<label class="config-field__toggle svelte-68mpyg"><input type="checkbox" class="config-field__checkbox svelte-68mpyg"/> <span class="config-field__toggle-label svelte-68mpyg"> </span></label>'),Tr=m("<option> </option>"),zr=m('<select class="config-field__select svelte-68mpyg"></select>'),Ir=m('<div class="config-field svelte-68mpyg"><label class="config-field__label svelte-68mpyg"> <!></label> <!> <!></div>'),Lr=m('<div class="config-panel__fields svelte-68mpyg"></div>'),qr=m('<div class="config-panel__error svelte-68mpyg" role="alert"> </div>'),$r=m('<div class="config-panel__saved svelte-68mpyg" role="status"> </div>'),Er=m('<button type="button" class="config-btn config-btn--save svelte-68mpyg"> </button>'),Ar=m('<div class="config-backdrop svelte-68mpyg"><div class="config-panel svelte-68mpyg" role="dialog" tabindex="-1" aria-modal="true"><div class="config-panel__header svelte-68mpyg"><h2 class="config-panel__title svelte-68mpyg"> </h2> <span class="config-panel__subtitle svelte-68mpyg">Settings</span></div> <!> <!> <!> <!> <div class="config-panel__actions svelte-68mpyg"><button type="button" class="config-btn config-btn--cancel svelte-68mpyg">Cancel</button> <!></div></div></div>');function Ur(o,t){te(t,!0);let s=pe(()=>{var H;return((H=t.plugin.manifest.config_schema)==null?void 0:H.fields)??[]}),h=pe(()=>{if(!t.plugin.manifest.config_schema)return[];const H=va(t.plugin.manifest.config_schema),w=e(s).filter(G=>!G.category);return[...H,...w]}),r=Se(et({})),y=Se(!1),i=Se(""),l=Se(!1);Je(()=>{const H={};for(const w of e(h))H[w.key]=t.plugin.config[w.key]!==void 0?t.plugin.config[w.key]:w.default!==void 0?w.default:w.type==="boolean"?!1:w.type==="number"?0:"";x(r,H,!0)});async function D(){x(y,!0),x(i,""),x(l,!1);try{const H=await fetch(`/plugins/${encodeURIComponent(t.plugin.plugin_id)}/config`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({config:e(r)})});if(!H.ok){const w=await H.text();throw new Error(w||`HTTP ${H.status}`)}if(t.plugin.builtin){const w=await fetch(`/modules/${encodeURIComponent(t.plugin.plugin_id)}/restart`,{method:"POST"});if(!w.ok){const G=await w.text();throw new Error(`Restart failed: ${G||`HTTP ${w.status}`}`)}}x(l,!0),setTimeout(()=>{var w;(w=t.onsaved)==null||w.call(t),t.onclose()},800)}catch(H){x(i,H instanceof Error?H.message:"Save failed",!0)}finally{x(y,!1)}}function N(H){H.key==="Escape"&&t.onclose()}function R(){return Bt(`${Yt}/admin`)}function C(H,w){x(r,{...e(r),[H]:w},!0)}var W=Ar();nt("keydown",vt,N);var S=n(W),T=n(S),j=n(T),v=n(j,!0);a(j),mt(2),a(T);var c=f(T,2);{var g=H=>{var w=Sr(),G=f(n(w),4);a(w),se("click",G,R),d(H,w)},q=H=>{var w=Mr();d(H,w)};B(c,H=>{t.plugin.integration_status==="missing"?H(g):t.plugin.integration_status==="ready"&&H(q,1)})}var _=f(c,2);{var b=H=>{var w=Hr();d(H,w)},u=H=>{var w=Lr();We(w,21,()=>e(h),G=>G.key,(G,z)=>{var E=Ir(),Q=n(E),X=n(Q),re=f(X);{var ve=he=>{var ee=Nr();d(he,ee)};B(re,he=>{e(z).required&&he(ve)})}a(Q);var be=f(Q,2);{var ie=he=>{var ee=jr(),_e=n(ee,!0);a(ee),F(()=>I(_e,e(z).description)),d(he,ee)};B(be,he=>{e(z).description&&he(ie)})}var ue=f(be,2);{var Te=he=>{var ee=Wr();tt(ee),F(_e=>{oe(ee,"id",`wcfg-${e(z).key??""}`),jt(ee,_e),ee.required=e(z).required},[()=>String(e(r)[e(z).key]??"")]),se("input",ee,_e=>C(e(z).key,_e.currentTarget.value)),d(he,ee)},de=he=>{var ee=Dr();tt(ee),F(_e=>{oe(ee,"id",`wcfg-${e(z).key??""}`),jt(ee,_e),ee.required=e(z).required},[()=>String(e(r)[e(z).key]??"")]),se("input",ee,_e=>C(e(z).key,_e.currentTarget.value)),d(he,ee)},Le=he=>{var ee=Cr();tt(ee),F(_e=>{oe(ee,"id",`wcfg-${e(z).key??""}`),jt(ee,_e),oe(ee,"min",e(z).min),oe(ee,"max",e(z).max),ee.required=e(z).required},[()=>Number(e(r)[e(z).key]??0)]),se("input",ee,_e=>C(e(z).key,_e.currentTarget.valueAsNumber)),d(he,ee)},Re=he=>{var ee=Pr(),_e=n(ee);tt(_e);var fe=f(_e,2),Ie=n(fe,!0);a(fe),a(ee),F(Ae=>{oe(_e,"id",`wcfg-${e(z).key??""}`),ua(_e,Ae),I(Ie,e(r)[e(z).key]?"Enabled":"Disabled")},[()=>!!e(r)[e(z).key]]),se("change",_e,Ae=>C(e(z).key,Ae.currentTarget.checked)),d(he,ee)},Oe=he=>{var ee=zr();We(ee,21,()=>e(z).options??[],fe=>fe.value,(fe,Ie)=>{var Ae=Tr(),lt=n(Ae,!0);a(Ae);var ot={};F(()=>{I(lt,e(Ie).label),ot!==(ot=e(Ie).value)&&(Ae.value=(Ae.__value=e(Ie).value)??"")}),d(fe,Ae)}),a(ee);var _e;Ft(ee),F(fe=>{oe(ee,"id",`wcfg-${e(z).key??""}`),_e!==(_e=fe)&&(ee.value=(ee.__value=fe)??"",Gt(ee,fe))},[()=>String(e(r)[e(z).key]??"")]),se("change",ee,fe=>C(e(z).key,fe.currentTarget.value)),d(he,ee)};B(ue,he=>{e(z).type==="string"?he(Te):e(z).type==="password"?he(de,1):e(z).type==="number"?he(Le,2):e(z).type==="boolean"?he(Re,3):e(z).type==="select"&&he(Oe,4)})}a(E),F(()=>{oe(Q,"for",`wcfg-${e(z).key??""}`),I(X,`${e(z).label??""} `)}),d(G,E)}),a(w),d(H,w)};B(_,H=>{e(h).length===0?H(b):H(u,!1)})}var M=f(_,2);{var A=H=>{var w=qr(),G=n(w,!0);a(w),F(()=>I(G,e(i))),d(H,w)};B(M,H=>{e(i)&&H(A)})}var Z=f(M,2);{var Y=H=>{var w=$r(),G=n(w);a(w),F(()=>I(G,`Settings saved${t.plugin.builtin?" — restarting module":""}`)),d(H,w)};B(Z,H=>{e(l)&&H(Y)})}var L=f(Z,2),k=n(L),$=f(k,2);{var V=H=>{var w=Er(),G=n(w,!0);a(w),F(()=>{w.disabled=e(y),I(G,e(y)?"Saving...":"Save")}),se("click",w,D),d(H,w)};B($,H=>{e(h).length>0&&H(V)})}a(L),a(S),a(W),F(()=>{oe(S,"aria-label",`Configure ${t.plugin.manifest.name??""}`),I(v,t.plugin.manifest.name)}),se("mousedown",W,function(...H){var w;(w=t.onclose)==null||w.apply(this,H)}),se("mousedown",S,H=>H.stopPropagation()),se("click",k,function(...H){var w;(w=t.onclose)==null||w.apply(this,H)}),d(o,W),ae()}at(["mousedown","click","input","change"]);var Rr=m('<label class="util-config__field svelte-q3fj7w"><span class="util-config__label svelte-q3fj7w">Time Format</span> <select class="util-config__select svelte-q3fj7w"><option>12-hour (7:29 PM)</option><option>24-hour (19:29)</option></select></label>'),Fr=m('<div class="util-config-backdrop svelte-q3fj7w"><div class="util-config-panel svelte-q3fj7w" role="dialog" tabindex="-1" aria-modal="true"><h2 class="util-config__title svelte-q3fj7w">Clock Settings</h2> <!> <div class="util-config__actions svelte-q3fj7w"><button type="button" class="util-config__btn util-config__btn--cancel svelte-q3fj7w">Cancel</button> <button type="button" class="util-config__btn util-config__btn--save svelte-q3fj7w">Save</button></div></div></div>');function Gr(o,t){te(t,!0);let s=Se(t.config.hour12!==!1);function h(){t.onsave({...t.config,hour12:e(s)})}function r(W){W.key==="Escape"&&t.onclose()}var y=Fr();nt("keydown",vt,r);var i=n(y),l=f(n(i),2);{var D=W=>{var S=Rr(),T=f(n(S),2),j=n(T);j.value=j.__value="12";var v=f(j);v.value=v.__value="24",a(T);var c;Ft(T),a(S),F(()=>{c!==(c=e(s)?"12":"24")&&(T.value=T.__value=e(s)?"12":"24",Gt(T,e(s)?"12":"24"))}),se("change",T,g=>x(s,g.currentTarget.value==="12")),d(W,S)};B(l,W=>{t.utilityType==="clock"&&W(D)})}var N=f(l,2),R=n(N),C=f(R,2);a(N),a(i),a(y),F(()=>oe(i,"aria-label",`Configure ${t.utilityType??""}`)),se("mousedown",y,function(...W){var S;(S=t.onclose)==null||S.apply(this,W)}),se("mousedown",i,W=>W.stopPropagation()),se("click",R,function(...W){var S;(S=t.onclose)==null||S.apply(this,W)}),se("click",C,h),d(o,y),ae()}at(["mousedown","change","click"]);var Or=m('<span class="edit-bar__dirty svelte-s9daqd" aria-label="Unsaved changes">Unsaved changes</span>'),Br=m('<div class="edit-bar svelte-s9daqd" role="toolbar" aria-label="Layout editing"><div class="edit-bar__group svelte-s9daqd"><button class="edit-bar__btn edit-bar__btn--undo svelte-s9daqd" type="button" aria-label="Undo" title="Undo (Ctrl+Z)">Undo</button> <button class="edit-bar__btn edit-bar__btn--redo svelte-s9daqd" type="button" aria-label="Redo" title="Redo (Ctrl+Shift+Z)">Redo</button></div> <!> <div class="edit-bar__group svelte-s9daqd"><button class="edit-bar__btn edit-bar__btn--cancel svelte-s9daqd" type="button" title="Cancel (Escape)">Cancel</button> <button class="edit-bar__btn edit-bar__btn--save svelte-s9daqd" type="button" aria-label="Save layout">Save</button></div></div>');function Yr(o,t){var s=Br(),h=n(s),r=n(h),y=f(r,2);a(h);var i=f(h,2);{var l=C=>{var W=Or();d(C,W)};B(i,C=>{t.dirty&&C(l)})}var D=f(i,2),N=n(D),R=f(N,2);a(D),a(s),F(()=>{r.disabled=!t.canUndo,y.disabled=!t.canRedo,R.disabled=!t.dirty}),se("click",r,function(...C){var W;(W=t.onundo)==null||W.apply(this,C)}),se("click",y,function(...C){var W;(W=t.onredo)==null||W.apply(this,C)}),se("click",N,function(...C){var W;(W=t.oncancel)==null||W.apply(this,C)}),se("click",R,function(...C){var W;(W=t.onsave)==null||W.apply(this,C)}),d(o,s)}at(["click"]);const Vr=50;function Ge(o){return o.map(t=>({...t}))}function Kr(o,t){if(o.length!==t.length)return!1;for(let s=0;s<o.length;s++)if(o[s].id!==t[s].id||o[s].x!==t[s].x||o[s].y!==t[s].y||o[s].w!==t[s].w||o[s].h!==t[s].h||o[s].showHeader!==!1!=(t[s].showHeader!==!1))return!1;return!0}function Ct(o){let t=Ge(o);const s=[],h=[];let r=Ge(o);return{pushState(y){s.push(Ge(r)),r=Ge(y),h.length=0,s.length>Vr&&s.shift()},undo(){return s.length===0||(h.push(Ge(r)),r=s.pop()),Ge(r)},redo(){return h.length===0||(s.push(Ge(r)),r=h.pop()),Ge(r)},canUndo(){return s.length>0},canRedo(){return h.length>0},isDirty(){return!Kr(r,t)},reset(y){t=Ge(y),r=Ge(y),s.length=0,h.length=0},getCurrent(){return Ge(r)}}}function Ut(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"}],["circle",{cx:"12",cy:"12",r:"3"}]];Me(o,He({name:"settings"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}function Zr(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["path",{d:"M15 18h-5"}],["path",{d:"M18 14h-8"}],["path",{d:"M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"}],["rect",{width:"8",height:"4",x:"10",y:"6",rx:"1"}]];Me(o,He({name:"newspaper"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}function Xr(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["path",{d:"M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978"}],["path",{d:"M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978"}],["path",{d:"M18 9h1.5a1 1 0 0 0 0-5H18"}],["path",{d:"M4 22h16"}],["path",{d:"M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"}],["path",{d:"M6 9H4.5a1 1 0 0 1 0-5H6"}]];Me(o,He({name:"trophy"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}function Jr(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}]];Me(o,He({name:"house"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}function Qr(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["path",{d:"M13.744 17.736a6 6 0 1 1-7.48-7.48"}],["path",{d:"M15 6h1v4"}],["path",{d:"m6.134 14.768.866-.5 2 3.464"}],["circle",{cx:"16",cy:"8",r:"6"}]];Me(o,He({name:"coins"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}function ei(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["path",{d:"M8 2v4"}],["path",{d:"M16 2v4"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2"}],["path",{d:"M3 10h18"}],["path",{d:"M8 14h.01"}],["path",{d:"M12 14h.01"}],["path",{d:"M16 14h.01"}],["path",{d:"M8 18h.01"}],["path",{d:"M12 18h.01"}],["path",{d:"M16 18h.01"}]];Me(o,He({name:"calendar-days"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}function ti(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["path",{d:"M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1"}],["circle",{cx:"12",cy:"8",r:"2"}],["path",{d:"M12 10v12"}],["path",{d:"M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z"}],["path",{d:"M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z"}]];Me(o,He({name:"flower-2"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}function ai(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"}],["path",{d:"M20 2v4"}],["path",{d:"M22 4h-4"}],["circle",{cx:"4",cy:"20",r:"2"}]];Me(o,He({name:"sparkles"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}function si(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["path",{d:"M12 7v14"}],["path",{d:"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"}]];Me(o,He({name:"book-open"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}function ni(o,t){te(t,!0);/**
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
 */let s=Ne(t,["$$slots","$$events","$$legacy"]);const h=[["path",{d:"M16 7h6v6"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17"}]];Me(o,He({name:"trending-up"},()=>s,{get iconNode(){return h},children:(r,y)=>{var i=we(),l=le(i);ke(l,()=>t.children??xe),d(r,i)},$$slots:{default:!0}})),ae()}var ri=m('<div class="dashboard-empty svelte-15y8q3w"><p class="dashboard-empty__text svelte-15y8q3w">No plugins enabled. Visit the admin panel to configure your dashboard.</p></div>'),ii=m('<button type="button" class="widget-gear-btn svelte-15y8q3w"><!></button>'),li=m('<span class="widget-header__icon svelte-15y8q3w"><!></span>'),oi=m('<div class="widget-header svelte-15y8q3w"><!> <span class="widget-header__title svelte-15y8q3w"> </span></div>'),di=m('<div class="dashboard-widget-content svelte-15y8q3w"><!> <!> <div><!></div></div>'),ci=m('<button type="button" class="widget-gear-btn svelte-15y8q3w" aria-label="Widget settings"><!></button>'),vi=m("<div></div>"),ui=m('<div class="util-hdiv svelte-15y8q3w"></div>'),_i=m('<div class="util-vdiv svelte-15y8q3w"></div>'),gi=m('<div class="dashboard-widget-content svelte-15y8q3w"><!> <div class="widget-body widget-body--no-header svelte-15y8q3w"><!></div></div>'),hi=m('<button class="dashboard-add-btn svelte-15y8q3w" type="button" aria-label="Add Widget">Add Widget</button> <!>',1),fi=m('<a class="dashboard-admin-link svelte-15y8q3w">Admin</a>'),pi=m('<!> <button class="dashboard-edit-toggle svelte-15y8q3w" type="button">Edit Layout</button>',1),mi=m('<div><!> <!> <!> <div class="dashboard-toolbar svelte-15y8q3w"><!></div> <!> <!> <!> <!> <!></div>');function wi(o,t){var qe;te(t,!0);const s={weather:Xt,news:Zr,sports:Xr,"home-assistant":Jr,crypto:Qr,calendar:ei,allergies:ti,"ai-news":ai,"word-of-day":si,finance:ni},h="lensing-dashboard-layout";let r=J(t,"allPlugins",19,()=>[]),y=J(t,"serverLayout",3,null),i,l=Se(!1),D=Se(!1),N=Se(null),R=Se(null),C=Se(null),W=Se(null),S=Se(null),T=Se(et([])),j=Se(null),v=Se(et(Ct([]))),c=pe(()=>ka(t.plugins));if(typeof window<"u")try{const P=localStorage.getItem(h);if(P){const O=JSON.parse(P);x(j,O,!0),(qe=t.onsave)==null||qe.call(t,O)}}catch{}Je(()=>{if(!(!y()||e(l))){x(j,[...y()],!0);try{localStorage.setItem(h,JSON.stringify(y()))}catch{}}}),Je(()=>{if(e(l))return;const P=e(c),O=e(j)?[...e(j)]:[...P];x(T,O.map(K=>{const ce=Wt(K.id);if(!ce)return K;const ze=Na(ce);return ze?{...K,minW:ze.minW,minH:ze.minH,maxW:ze.maxW,maxH:ze.maxH}:K}),!0),x(v,Ct(O),!0)});let g=pe(()=>e(T)),q=pe(()=>(e(T),e(v).canUndo())),_=pe(()=>(e(T),e(v).canRedo())),b=pe(()=>(e(T),e(v).isDirty())),u=pe(()=>new Map(t.plugins.map(P=>[P.plugin_id,P]))),M=pe(()=>r().filter(P=>!e(g).some(O=>O.id===P.plugin_id)));function A(P){const O=new Map(e(T).map(ce=>[ce.id,ce])),K=P.map(ce=>{const ze=O.get(ce.id);return ze?{...ze,...ce}:ce});e(v).pushState(K),x(T,K,!0)}function Z(){if(e(l)){k();return}x(l,!0),x(v,Ct(e(T)),!0)}function Y(){const P=e(v).undo();x(T,P,!0)}function L(){const P=e(v).redo();x(T,P,!0)}function k(){const P=e(j)??e(c);e(v).reset(P),x(T,[...P],!0),x(l,!1),x(D,!1),x(N,null),x(C,null),x(W,null),x(S,null)}function $(P){if(!e(l))return;if(P.key==="Escape"){P.preventDefault(),k();return}const O=P.key.toLowerCase();if((P.ctrlKey||P.metaKey)&&O==="z"&&P.shiftKey){P.preventDefault(),L();return}if((P.ctrlKey||P.metaKey)&&O==="z"&&!P.shiftKey){P.preventDefault(),Y();return}}function V(P){const O=Vt(P.plugin_id,P.manifest),K={id:P.plugin_id,x:0,y:0,w:O.w,h:O.h},ce=[...e(T),K];e(v).pushState(ce),x(T,ce,!0),x(D,!1)}function H(P){const O=[...e(T),P];e(v).pushState(O),x(T,O,!0),x(D,!1)}function w(P){const O=e(T).filter(K=>K.id!==P);e(v).pushState(O),x(T,O,!0),x(N,null)}function G(P){x(N,null);const O=e(u).get(P)??r().find(K=>K.plugin_id===P);O&&x(W,O,!0)}function z(P,O){x(N,null),x(S,{widgetId:P,utilType:O},!0)}function E(P){if(!e(S))return;const O=e(S).widgetId,K=e(T).map(ce=>ce.id===O?{...ce,config:P}:ce);e(v).pushState(K),x(T,K,!0),x(S,null)}function Q(P){const O=e(T).map(K=>K.id===P?{...K,showHeader:K.showHeader===!1}:K);e(v).pushState(O),x(T,O,!0),x(N,null)}function X(P){x(N,null),x(C,P,!0)}function re(P){if(!e(C))return;const O=e(C).id,K=e(T).map(ce=>ce.id===O?{...ce,...P}:ce);e(v).pushState(K),x(T,K,!0),x(C,null)}function ve(){var P;x(j,[...e(g)],!0);try{localStorage.setItem(h,JSON.stringify(e(g)))}catch{}(P=t.onsave)==null||P.call(t,e(g)),e(v).reset(e(g)),x(l,!1),x(D,!1),x(N,null),x(C,null),x(W,null),x(S,null)}Je(()=>{e(g).map(P=>P.id),ya().then(be)});function be(){if(i)for(const P of e(g)){const O=CSS.escape(P.id),K=i.querySelector(`.gs-item-content[data-widget-id="${O}"]`);if(!K||K.querySelector(".dashboard-widget-content"))continue;const ce=i.querySelector(`:scope > .dashboard-widget-content[data-widget-id="${O}"]`);ce&&K.appendChild(ce)}}function ie(P,O,K){const ce=e(g).find(ze=>ze.id===P);ce&&(x(N,ce,!0),x(R,{x:O,y:K},!0))}function ue(P,O){P.stopPropagation();const K=P.currentTarget.getBoundingClientRect();ie(O,K.left,K.bottom+4)}function Te(P){if(!e(l))return;let O=P.target;for(;O&&O!==P.currentTarget;){const K=O.getAttribute("data-widget-id");if(K){P.preventDefault(),ie(K,P.clientX,P.clientY);break}O=O.parentElement||P.currentTarget}}var de=mi();nt("keydown",vt,$);let Le;var Re=n(de);$a(Re,{get items(){return e(g)},get editMode(){return e(l)},get options(){return Lt},onchange:A});var Oe=f(Re,2);{var he=P=>{var O=ri();d(P,O)};B(Oe,P=>{e(g).length===0&&P(he)})}var ee=f(Oe,2);We(ee,17,()=>e(g),P=>P.id,(P,O)=>{const K=pe(()=>e(u).get(e(O).id)),ce=pe(()=>Wt(e(O).id));var ze=we(),it=le(ze);{var dt=st=>{var Ue=di(),ut=n(Ue);{var xt=Ze=>{var Ce=ii(),$e=n(Ce);Ut($e,{size:14,strokeWidth:2}),a(Ce),F(()=>oe(Ce,"aria-label",`Widget settings for ${e(K).manifest.name??""}`)),se("click",Ce,Be=>ue(Be,e(O).id)),d(Ze,Ce)};B(ut,Ze=>{e(l)&&Ze(xt)})}var _t=f(ut,2);{var kt=Ze=>{const Ce=pe(()=>s[e(O).id]);var $e=oi(),Be=n($e);{var Mt=Ht=>{var Nt=li(),ea=n(Nt);ma(ea,()=>e(Ce),(ta,aa)=>{aa(ta,{size:14})}),a(Nt),d(Ht,Nt)};B(Be,Ht=>{e(Ce)&&Ht(Mt)})}var $t=f(Be,2),Qt=n($t,!0);a($t),a($e),F(()=>I(Qt,e(K).manifest.name)),d(Ze,$e)};B(_t,Ze=>{e(O).showHeader!==!1&&Ze(kt)})}var gt=f(_t,2);let yt;var St=n(gt);Qn(St,{get name(){return e(K).manifest.name},children:(Ze,Ce)=>{Kn(Ze,{get plugin(){return e(K)}})},$$slots:{default:!0}}),a(gt),a(Ue),F(()=>{oe(Ue,"data-widget-id",e(O).id),yt=Ee(gt,1,"widget-body svelte-15y8q3w",null,yt,{"widget-body--no-header":e(O).showHeader===!1})}),d(st,Ue)},bt=st=>{var Ue=gi(),ut=n(Ue);{var xt=Ce=>{var $e=ci(),Be=n($e);Ut(Be,{size:14,strokeWidth:2}),a($e),se("click",$e,Mt=>ue(Mt,e(O).id)),d(Ce,$e)};B(ut,Ce=>{e(l)&&Ce(xt)})}var _t=f(ut,2),kt=n(_t);{var gt=Ce=>{var $e=vi();let Be;F(()=>Be=Ee($e,1,"util-spacer svelte-15y8q3w",null,Be,{"util-spacer--edit":e(l)})),d(Ce,$e)},yt=Ce=>{var $e=ui();d(Ce,$e)},St=Ce=>{var $e=_i();d(Ce,$e)},Ze=Ce=>{{let $e=pe(()=>{var Be;return((Be=e(O).config)==null?void 0:Be.hour12)!==!1});Xn(Ce,{get hour12(){return e($e)}})}};B(kt,Ce=>{e(ce)==="spacer"?Ce(gt):e(ce)==="hdiv"?Ce(yt,1):e(ce)==="vdiv"?Ce(St,2):e(ce)==="clock"&&Ce(Ze,3)})}a(_t),a(Ue),F(()=>oe(Ue,"data-widget-id",e(O).id)),d(st,Ue)};B(it,st=>{e(K)?st(dt):e(ce)&&st(bt,1)})}d(P,ze)});var _e=f(ee,2),fe=n(_e);{var Ie=P=>{var O=hi(),K=le(O),ce=f(K,2);Yr(ce,{onsave:ve,oncancel:k,onundo:Y,onredo:L,get canUndo(){return e(q)},get canRedo(){return e(_)},get dirty(){return e(b)}}),se("click",K,()=>x(D,!0)),d(P,O)},Ae=P=>{var O=pi(),K=le(O);{var ce=it=>{var dt=fi();F(()=>oe(dt,"href",t.adminHref)),d(it,dt)};B(K,it=>{t.adminHref&&it(ce)})}var ze=f(K,2);F(()=>oe(ze,"aria-pressed",e(l))),se("click",ze,Z),d(P,O)};B(fe,P=>{e(l)?P(Ie):P(Ae,!1)})}a(_e);var lt=f(_e,2);{var ot=P=>{const O=pe(()=>e(u).get(e(N).id)??r().find(ze=>ze.plugin_id===e(N).id)),K=pe(()=>Wt(e(N).id)),ce=pe(()=>{var ze;return((ze=e(O))==null?void 0:ze.manifest.name)??(e(K)==="spacer"?"Spacer":e(K)==="hdiv"?"Horizontal Line":e(K)==="vdiv"?"Vertical Line":e(K)==="clock"?"Clock":e(N).id)});{let ze=pe(()=>e(N).showHeader!==!1),it=pe(()=>{var Ue;return((Ue=e(R))==null?void 0:Ue.x)??0}),dt=pe(()=>{var Ue;return((Ue=e(R))==null?void 0:Ue.y)??0}),bt=pe(()=>e(K)==="clock"?()=>z(e(N).id,"clock"):e(K)?void 0:()=>G(e(N).id)),st=pe(()=>e(K)?void 0:()=>Q(e(N).id));pr(P,{get pluginId(){return e(N).id},get pluginName(){return e(ce)},get showHeader(){return e(ze)},get x(){return e(it)},get y(){return e(dt)},get onconfigure(){return e(bt)},ondelete:()=>w(e(N).id),onresize:()=>X(e(N)),get ontoggleheader(){return e(st)},onclose:()=>x(N,null)})}};B(lt,P=>{e(l)&&e(N)&&P(ot)})}var wt=f(lt,2);{var ne=P=>{{let O=pe(()=>{var K;return((K=e(u).get(e(C).id))==null?void 0:K.manifest.name)??e(C).id});kr(P,{get x(){return e(C).x},get y(){return e(C).y},get w(){return e(C).w},get h(){return e(C).h},get minW(){return e(C).minW},get minH(){return e(C).minH},get maxW(){return e(C).maxW},get maxH(){return e(C).maxH},get pluginName(){return e(O)},onconfirm:re,oncancel:()=>x(C,null)})}};B(wt,P=>{e(C)&&P(ne)})}var je=f(wt,2);{var De=P=>{Ur(P,{get plugin(){return e(W)},onclose:()=>x(W,null),get onsaved(){return t.onconfigsaved}})};B(je,P=>{e(W)&&P(De)})}var Pe=f(je,2);{var Xe=P=>{{let O=pe(()=>{var K;return((K=e(T).find(ce=>ce.id===e(S).widgetId))==null?void 0:K.config)??{}});Gr(P,{get utilityType(){return e(S).utilType},get config(){return e(O)},onclose:()=>x(S,null),onsave:E})}};B(Pe,P=>{e(S)&&P(Xe)})}var rt=f(Pe,2);{var Qe=P=>{dr(P,{get availablePlugins(){return e(M)},onadd:V,onaddutility:H,onclose:()=>x(D,!1)})};B(rt,P=>{e(l)&&e(D)&&P(Qe)})}a(de),It(de,P=>i=P,()=>i),F(()=>Le=Ee(de,1,"dashboard-grid svelte-15y8q3w",null,Le,{"dashboard-edit-mode":e(l)})),se("contextmenu",de,Te),d(o,de),ae()}at(["contextmenu","click"]);const Jt="/layout";async function yi(o){try{return(await fetch(Jt,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({widgets:o})})).ok}catch{return!1}}async function bi(){try{const o=await fetch(Jt);return o.ok?(await o.json()).widgets??null:null}catch{return null}}var xi=m('<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>');function Di(o,t){te(t,!0);let s=Se(et([])),h=Se(null);const r=new Set(_a);let y=pe(()=>e(s).filter(N=>!r.has(N.plugin_id)));async function i(){const N=await fetch("/plugins");N.ok&&x(s,await N.json(),!0)}function l(){i()}function D(N){yi(N).then(()=>i())}Je(()=>{i();const N=location.protocol==="https:"?"wss:":"ws:",R=new WebSocket(`${N}//${location.host}/ws`);return R.addEventListener("message",C=>{try{const W=JSON.parse(String(C.data));W.type==="layout_change"?(i(),bi().then(S=>{S&&x(h,S,!0)})):W.type==="plugin_data"&&Rn(W.payload)}catch{}}),()=>{R.close()}}),ga("1uha8ag",N=>{var R=xi();ia(()=>{la.title="Lensing Display"}),d(N,R)}),wi(o,{get plugins(){return e(y)},get allPlugins(){return e(y)},get serverLayout(){return e(h)},onsave:D,onconfigsaved:l,adminHref:"/admin"}),ae()}export{Di as component};
