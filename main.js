!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=22)}([function(e,t,n){!function(e,n){n(t)}(0,function(e){function t(e,t,n){this.nodeName=e,this.attributes=t,this.children=n,this.key=t&&t.key}function n(e,n){var r,o,i,a,u;for(u=arguments.length;u-- >2;)D.push(arguments[u]);for(n&&n.children&&(D.length||D.push(n.children),delete n.children);D.length;)if((i=D.pop())instanceof Array)for(u=i.length;u--;)D.push(i[u]);else null!=i&&i!==!0&&i!==!1&&("number"==typeof i&&(i=String(i)),a="string"==typeof i,a&&o?r[r.length-1]+=i:((r||(r=[])).push(i),o=a));var l=new t(e,n||void 0,r||I);return B.vnode&&B.vnode(l),l}function r(e,t){if(t)for(var n in t)e[n]=t[n];return e}function o(e){return r({},e)}function i(e,t){for(var n=t.split("."),r=0;r<n.length&&e;r++)e=e[n[r]];return e}function a(e){return"function"==typeof e}function u(e){return"string"==typeof e}function l(e){var t="";for(var n in e)e[n]&&(t&&(t+=" "),t+=n);return t}function s(e,t){return n(e.nodeName,r(o(e.attributes),t),arguments.length>2?[].slice.call(arguments,2):e.children)}function c(e,t,n){var r=t.split(".");return function(t){for(var o=t&&t.target||this,a={},l=a,s=u(n)?i(t,n):o.nodeName?o.type.match(/^che|rad/)?o.checked:o.value:t,c=0;c<r.length-1;c++)l=l[r[c]]||(l[r[c]]=!c&&e.state[r[c]]||{});l[r[c]]=s,e.setState(a)}}function f(e){!e._dirty&&(e._dirty=!0)&&1==q.push(e)&&(B.debounceRendering||V)(d)}function d(){var e,t=q;for(q=[];e=t.pop();)e._dirty&&z(e)}function p(e){var t=e&&e.nodeName;return t&&a(t)&&!(t.prototype&&t.prototype.render)}function h(e,t){return e.nodeName(b(e),t||$)}function v(e,t){return u(t)?e instanceof Text:u(t.nodeName)?!e._componentConstructor&&m(e,t.nodeName):a(t.nodeName)?!e._componentConstructor||e._componentConstructor===t.nodeName||p(t):void 0}function m(e,t){return e.normalizedNodeName===t||F(e.nodeName)===F(t)}function b(e){var t=o(e.attributes);t.children=e.children;var n=e.nodeName.defaultProps;if(n)for(var r in n)void 0===t[r]&&(t[r]=n[r]);return t}function y(e){var t=e.parentNode;t&&t.removeChild(e)}function g(e,t,n,r,o){if("className"===t&&(t="class"),"class"===t&&r&&"object"==typeof r&&(r=l(r)),"key"===t);else if("class"!==t||o)if("style"===t){if((!r||u(r)||u(n))&&(e.style.cssText=r||""),r&&"object"==typeof r){if(!u(n))for(var i in n)i in r||(e.style[i]="");for(var i in r)e.style[i]="number"!=typeof r[i]||J[i]?r[i]:r[i]+"px"}}else if("dangerouslySetInnerHTML"===t)r&&(e.innerHTML=r.__html||"");else if("o"==t[0]&&"n"==t[1]){var s=e._listeners||(e._listeners={});t=F(t.substring(2)),r?s[t]||e.addEventListener(t,w,!!Z[t]):s[t]&&e.removeEventListener(t,w,!!Z[t]),s[t]=r}else if("list"!==t&&"type"!==t&&!o&&t in e)_(e,t,null==r?"":r),null!=r&&r!==!1||e.removeAttribute(t);else{var c=o&&t.match(/^xlink\:?(.+)/);null==r||r===!1?c?e.removeAttributeNS("http://www.w3.org/1999/xlink",F(c[1])):e.removeAttribute(t):"object"==typeof r||a(r)||(c?e.setAttributeNS("http://www.w3.org/1999/xlink",F(c[1]),r):e.setAttribute(t,r))}else e.className=r||""}function _(e,t,n){try{e[t]=n}catch(e){}}function w(e){return this._listeners[e.type](B.event&&B.event(e)||e)}function x(e){if(y(e),e instanceof Element){e._component=e._componentConstructor=null;var t=e.normalizedNodeName||F(e.nodeName);(K[t]||(K[t]=[])).push(e)}}function k(e,t){var n=F(e),r=K[n]&&K[n].pop()||(t?document.createElementNS("http://www.w3.org/2000/svg",e):document.createElement(e));return r.normalizedNodeName=n,r}function j(){for(var e;e=X.pop();)B.afterMount&&B.afterMount(e),e.componentDidMount&&e.componentDidMount()}function O(e,t,n,r,o,i){Y++||(Q=o&&void 0!==o.ownerSVGElement,ee=e&&!(G in e));var a=S(e,t,n,r);return o&&a.parentNode!==o&&o.appendChild(a),--Y||(ee=!1,i||j()),a}function S(e,t,n,r){for(var o=t&&t.attributes&&t.attributes.ref;p(t);)t=h(t,n);if(null==t&&(t=""),u(t))return e&&e instanceof Text&&e.parentNode?e.nodeValue!=t&&(e.nodeValue=t):(e&&P(e),e=document.createTextNode(t)),e;if(a(t.nodeName))return A(e,t,n,r);var i=e,l=String(t.nodeName),s=Q,c=t.children;if(Q="svg"===l||"foreignObject"!==l&&Q,e){if(!m(e,l)){for(i=k(l,Q);e.firstChild;)i.appendChild(e.firstChild);e.parentNode&&e.parentNode.replaceChild(i,e),P(e)}}else i=k(l,Q);var f=i.firstChild,d=i[G];if(!d){i[G]=d={};for(var v=i.attributes,b=v.length;b--;)d[v[b].name]=v[b].value}return!ee&&c&&1===c.length&&"string"==typeof c[0]&&f&&f instanceof Text&&!f.nextSibling?f.nodeValue!=c[0]&&(f.nodeValue=c[0]):(c&&c.length||f)&&C(i,c,n,r,!!d.dangerouslySetInnerHTML),E(i,t.attributes,d),o&&(d.ref=o)(i),Q=s,i}function C(e,t,n,r,o){var i,a,u,l,s=e.childNodes,c=[],f={},d=0,p=0,h=s.length,m=0,b=t&&t.length;if(h)for(var g=0;g<h;g++){var _=s[g],w=_[G],x=b?(a=_._component)?a.__key:w?w.key:null:null;null!=x?(d++,f[x]=_):(ee||o||w||_ instanceof Text)&&(c[m++]=_)}if(b)for(var g=0;g<b;g++){u=t[g],l=null;var x=u.key;if(null!=x)d&&x in f&&(l=f[x],f[x]=void 0,d--);else if(!l&&p<m)for(i=p;i<m;i++)if((a=c[i])&&v(a,u)){l=a,c[i]=void 0,i===m-1&&m--,i===p&&p++;break}l=S(l,u,n,r),l&&l!==e&&(g>=h?e.appendChild(l):l!==s[g]&&(l===s[g+1]&&y(s[g]),e.insertBefore(l,s[g]||null)))}if(d)for(var g in f)f[g]&&P(f[g]);for(;p<=m;)(l=c[m--])&&P(l)}function P(e,t){var n=e._component;if(n)T(n,!t);else{e[G]&&e[G].ref&&e[G].ref(null),t||x(e);for(var r;r=e.lastChild;)P(r,t)}}function E(e,t,n){var r;for(r in n)t&&r in t||null==n[r]||g(e,r,n[r],n[r]=void 0,Q);if(t)for(r in t)"children"===r||"innerHTML"===r||r in n&&t[r]===("value"===r||"checked"===r?e[r]:n[r])||g(e,r,n[r],n[r]=t[r],Q)}function M(e){var t=e.constructor.name,n=te[t];n?n.push(e):te[t]=[e]}function R(e,t,n){var r=new e(t,n),o=te[e.name];if(U.call(r,t,n),o)for(var i=o.length;i--;)if(o[i].constructor===e){r.nextBase=o[i].nextBase,o.splice(i,1);break}return r}function N(e,t,n,r,o){e._disable||(e._disable=!0,(e.__ref=t.ref)&&delete t.ref,(e.__key=t.key)&&delete t.key,!e.base||o?e.componentWillMount&&e.componentWillMount():e.componentWillReceiveProps&&e.componentWillReceiveProps(t,r),r&&r!==e.context&&(e.prevContext||(e.prevContext=e.context),e.context=r),e.prevProps||(e.prevProps=e.props),e.props=t,e._disable=!1,0!==n&&(1!==n&&B.syncComponentUpdates===!1&&e.base?f(e):z(e,1,o)),e.__ref&&e.__ref(e))}function z(e,t,n,i){if(!e._disable){var u,l,s,c,f=e.props,d=e.state,v=e.context,m=e.prevProps||f,y=e.prevState||d,g=e.prevContext||v,_=e.base,w=e.nextBase,x=_||w,k=e._component;if(_&&(e.props=m,e.state=y,e.context=g,2!==t&&e.shouldComponentUpdate&&e.shouldComponentUpdate(f,d,v)===!1?u=!0:e.componentWillUpdate&&e.componentWillUpdate(f,d,v),e.props=f,e.state=d,e.context=v),e.prevProps=e.prevState=e.prevContext=e.nextBase=null,e._dirty=!1,!u){for(e.render&&(l=e.render(f,d,v)),e.getChildContext&&(v=r(o(v),e.getChildContext()));p(l);)l=h(l,v);var S,C,E=l&&l.nodeName;if(a(E)){var M=b(l);s=k,s&&s.constructor===E&&M.key==s.__key?N(s,M,1,v):(S=s,s=R(E,M,v),s.nextBase=s.nextBase||w,s._parentComponent=e,e._component=s,N(s,M,0,v),z(s,1,n,!0)),C=s.base}else c=x,S=k,S&&(c=e._component=null),(x||1===t)&&(c&&(c._component=null),C=O(c,l,v,n||!_,x&&x.parentNode,!0));if(x&&C!==x&&s!==k){var A=x.parentNode;A&&C!==A&&(A.replaceChild(C,x),S||(x._component=null,P(x)))}if(S&&T(S,C!==x),e.base=C,C&&!i){for(var U=e,L=e;L=L._parentComponent;)(U=L).base=C;C._component=U,C._componentConstructor=U.constructor}}!_||n?X.unshift(e):u||(e.componentDidUpdate&&e.componentDidUpdate(m,y,g),B.afterUpdate&&B.afterUpdate(e));var D,I=e._renderCallbacks;if(I)for(;D=I.pop();)D.call(e);Y||i||j()}}function A(e,t,n,r){for(var o=e&&e._component,i=o,a=e,u=o&&e._componentConstructor===t.nodeName,l=u,s=b(t);o&&!l&&(o=o._parentComponent);)l=o.constructor===t.nodeName;return o&&l&&(!r||o._component)?(N(o,s,3,n,r),e=o.base):(i&&!u&&(T(i,!0),e=a=null),o=R(t.nodeName,s,n),e&&!o.nextBase&&(o.nextBase=e,a=null),N(o,s,1,n,r),e=o.base,a&&e!==a&&(a._component=null,P(a))),e}function T(e,t){B.beforeUnmount&&B.beforeUnmount(e);var n=e.base;e._disable=!0,e.componentWillUnmount&&e.componentWillUnmount(),e.base=null;var r=e._component;if(r)T(r,t);else if(n){n[G]&&n[G].ref&&n[G].ref(null),e.nextBase=n,t&&(y(n),M(e));for(var o;o=n.lastChild;)P(o,!t)}e.__ref&&e.__ref(null),e.componentDidUnmount&&e.componentDidUnmount()}function U(e,t){this._dirty=!0,this.context=t,this.props=e,this.state||(this.state={})}function L(e,t,n){return O(n,e,{},!1,t)}var B={},D=[],I=[],W={},F=function(e){return W[e]||(W[e]=e.toLowerCase())},H="undefined"!=typeof Promise&&Promise.resolve(),V=H?function(e){H.then(e)}:setTimeout,$={},G="undefined"!=typeof Symbol?Symbol.for("preactattr"):"__preactattr_",J={boxFlex:1,boxFlexGroup:1,columnCount:1,fillOpacity:1,flex:1,flexGrow:1,flexPositive:1,flexShrink:1,flexNegative:1,fontWeight:1,lineClamp:1,lineHeight:1,opacity:1,order:1,orphans:1,strokeOpacity:1,widows:1,zIndex:1,zoom:1},Z={blur:1,error:1,focus:1,load:1,resize:1,scroll:1},q=[],K={},X=[],Y=0,Q=!1,ee=!1,te={};r(U.prototype,{linkState:function(e,t){var n=this._linkedStates||(this._linkedStates={});return n[e+t]||(n[e+t]=c(this,e,t))},setState:function(e,t){var n=this.state;this.prevState||(this.prevState=o(n)),r(n,a(e)?e(n,this.props):e),t&&(this._renderCallbacks=this._renderCallbacks||[]).push(t),f(this)},forceUpdate:function(){z(this,2)},render:function(){}}),e.h=n,e.cloneElement=s,e.Component=U,e.render=L,e.rerender=d,e.options=B})},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.base=t.boxShadow=t.borderRadius=t.marginSize=void 0;var o=n(21),i=r(o),a=(t.marginSize="6px",t.borderRadius="2px"),u=t.boxShadow="0.5px 0.5px 3px rgba(0, 0, 0, 0.5)";t.base=(0,i.default)().addRules({input:{font:"inherit",padding:"6px 12px",borderRadius:a,border:"1px solid transparent",boxShadow:u,outline:0},textField:{inherit:"input",backgroundColor:"#fff"},button:{inherit:"input",color:"#fff",borderColor:"#27AE60",backgroundColor:"#27AE60",cursor:"pointer",hover:{backgroundColor:"#2ECC71"}},error:{color:"#C0392B",fontWeight:"bold"}})},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){return Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}function i(e,t){return k(e,t).then(function(e){if(e.error)throw Object.assign(new Error(e.error.message),e.error);return e})}function a(e){return i("list",{passphrase:e}).then(function(t){R=t,w.default.setPassphrase(e),w.default.setList(t)})}function u(e){return i("get",{passphrase:w.default.passphrase,path:e})}function l(){(0,x.emptyClipboard)(),w.default.setList()}function s(e){return e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")}function c(e,t){var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(r=(a=u.next()).done);r=!0){var l=a.value;if(t.test(l.name))n.push(l);else if(l.children){var s=c(l.children,t);s.length&&n.push(d({},l,{children:s}))}}}catch(e){o=!0,i=e}finally{try{!r&&u.return&&u.return()}finally{if(o)throw i}}return n}function f(e){var t=e.trim();if(t){var n=new RegExp(s(t).replace(/\s+/g,".*"),"i"),r=c(R,n);w.default.setList(r)}else w.default.setList(R)}Object.defineProperty(t,"__esModule",{value:!0});var d=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},h=o(["\n        mypassword\n        User name: mail@example.org"],["\n        mypassword\n        User name: mail@example.org"]),v=o(["\n        somepassword"],["\n        somepassword"]),m=o(["\n        emailpassword\n        Address: me@donenfeld.com"],["\n        emailpassword\n        Address: me@donenfeld.com"]),b=o(["\n        emailpassword\n        Address: jean-michel@zx2c4.com"],["\n        emailpassword\n        Address: jean-michel@zx2c4.com"]),y=o(["\n        bankpassword\n        User name: me\n        URL: https://mybank.org"],["\n        bankpassword\n        User name: me\n        URL: https://mybank.org"]),g=o(["\n\n        +33654235423"],["\\n\n        +33654235423"]);t.signin=a,t.get=u,t.logout=l,t.search=f;var _=n(5),w=r(_),x=n(4),k=void 0,j=function(e){for(var t="",n=0;n<e.length;n+=1)t+=e[n],n<e.length-1&&(t+=arguments.length<=n+1?void 0:arguments[n+1]);"\n"===t[0]&&(t=t.slice(1));var r=t.match(/([\t ]*)\S/);return r&&(t=t.replace(new RegExp("^"+r[1],"mg"),"")),t},O="demo",S={Business:{"some-silly-business-site.com.gpg":j(h),"another-business-site.net.gpg":j(v)},Email:{"donenfeld.com.gpg":j(m),"zx2c4.com.gpg":j(b)},France:{"bank.gpg":j(y),"freebox.gpg":"pwet","mobilephone.gpg":j(g)}},C=function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:S;return Object.keys(t).map(function(n){return{name:n,children:"object"===p(t[n])&&e(t[n])}})},P=function e(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:S,r=n[t[0]];return t.length>1?e(t.slice(1),r):r},E=function(e){return{error:{message:e}}},M=function(e,t){return t.passphrase!==O?E("Bad passphrase"):"list"===e?C():"get"===e?P(t.path):E("Invalid route")};k=function(e,t){return Promise.resolve(M(e,t))};var R=void 0},function(e,t,n){"use strict";function r(e){return function(){for(var t=arguments.length,n=Array(t),r=0;r<t;r++)n[r]=arguments[r];n[0]instanceof Event&&n.shift().preventDefault(),e&&e.apply(void 0,n)}}Object.defineProperty(t,"__esModule",{value:!0}),t.stop=r},function(e,t,n){"use strict";function r(e){u||(u=document.createElement("div"),u.style.opacity="0",u.style.position="absolute",u.style.top="0",document.body.appendChild(u)),u.textContent=e,i(u);try{return document.execCommand("copy")}catch(e){return!1}finally{a()}}function o(){r(".")}function i(e){if(e){a();var t=document.createRange();t.selectNode(e),window.getSelection().addRange(t)}}function a(){window.getSelection().removeAllRanges()}Object.defineProperty(t,"__esModule",{value:!0}),t.copy=r,t.emptyClipboard=o,t.select=i,t.unselect=a;var u=void 0},function(e,t,n){"use strict";function r(){o.forEach(function(e){return e()})}Object.defineProperty(t,"__esModule",{value:!0});var o=[],i=!1,a=!1;t.default={setList:function(e){i=e,r()},setPassphrase:function(e){a=e,r()},logout:function(){i=!1},get loggedIn(){return Boolean(i)},get passphrase(){return a},get list(){return i||[]},register:function(e){o.push(e)},unregister:function(e){o=o.filter(function(t){return t!==e})}}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}Object.defineProperty(t,"__esModule",{value:!0});var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},a=n(0),u=n(1),l=n(18),s=r(l),c=u.base.namespace("Icon").addRules({root:{verticalAlign:"middle",display:"inline-block"}});t.default=function(e){var t=e.name,n=e.style,r=o(e,["name","style"]);return(0,a.h)("img",i({},r,{src:s.default+"#"+t,class:c("root",n)}))}},function(e,t,n){"use strict";function r(e){return this.then(function(t){return e(),t},function(t){throw e(),t})}function o(e){return this.then(null,e)}Object.defineProperty(t,"__esModule",{value:!0}),t.finally_=r,t.catch_=o},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}var o=n(0),i=n(9),a=r(i),u=n(17);document.body.style.margin=0,document.body.style.fontFamily="Helvetica, Arial, sans-serif",document.body.style.fontSize="14px",(0,u.init)(),(0,o.render)((0,o.h)(a.default,null),document.body)},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=n(10),c=r(s),f=n(5),d=r(f),p=n(15),h=r(p),v=n(16),m=r(v),b=n(2),y=n(3),g=n(1),_=g.base.namespace("App").addRules({root:{display:"flex",flexDirection:"column",alignItems:"stretch",position:"relative",boxSizing:"border-box",height:"100vh",maxWidth:"40em",margin:"auto",padding:"12px"},header:{display:"flex",flexShrink:0,justifyContent:"space-between",marginBottom:g.marginSize}}),w=function(e){function t(){o(this,t);var e=i(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return e.state={store:d.default},e.updateStore=function(){return e.setState({store:d.default})},e}return a(t,e),u(t,[{key:"focus",value:function(){this.auth?this.auth.focus():this.search.focus()}},{key:"componentDidMount",value:function(){d.default.register(this.updateStore),this.focus()}},{key:"componentDidUpdate",value:function(){this.focus()}},{key:"componentWillUnmount",value:function(){d.default.unregister(this.updateStore)}},{key:"render",value:function(e,t){var n=this,r=t.store;return(0,l.h)("div",{class:_("root")},r.loggedIn&&(0,l.h)("div",{class:_("header")},(0,l.h)(m.default,{onChange:b.search,ref:function(e){n.search=e}}),(0,l.h)("button",{onClick:(0,y.stop)(b.logout),class:_("button")},"Logout")),r.loggedIn&&(0,l.h)(h.default,{list:r.list}),!r.loggedIn&&(0,l.h)(c.default,{ref:function(e){n.auth=e}}))}}]),t}(l.Component);t.default=w},function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),l=n(2),s=n(3),c=n(7),f=n(1),d=f.base.namespace("Auth").addRules({root:{textAlign:"center"},textField:{inherit:"textField",marginRight:f.marginSize,marginBottom:f.marginSize},error:{inherit:"error",marginBottom:f.marginSize}}),p=function(e){function t(){r(this,t);var e=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return e.state={passphrase:"",error:null,loading:!1},e.submit=function(){var t;e.setState({loading:!0}),(t=(t=(0,l.signin)(e.state.passphrase),c.finally_).call(t,function(){return e.setState({loading:!1})}),c.catch_).call(t,function(t){return e.setState({error:t})})},e}return i(t,e),a(t,[{key:"render",value:function(e,t){var n=this,r=t.error,o=t.passphrase,i=t.loading;return(0,u.h)("form",{class:d("root"),onSubmit:(0,s.stop)(this.submit)},r&&(0,u.h)("div",{class:d("error")},"Error: ",r.message),(0,u.h)("input",{class:d("textField"),type:"password",ref:function(e){n.input=e},onChange:function(e){return n.setState({passphrase:e.target.value})},value:o}),(0,u.h)("button",{class:d("button"),disabled:i},"Login"),(0,u.h)("div",null,"Hint: the demo passphrase is 'demo'."))}},{key:"focus",value:function(){this.input.focus()}}]),t}(u.Component);t.default=p},function(e,t,n){"use strict";function r(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}Object.defineProperty(t,"__esModule",{value:!0});var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},i=n(0),a=n(4),u=n(1),l=u.base.namespace("CopyIcon").addRules({root:{verticalAlign:"middle",display:"inline-block",cursor:"pointer",position:"relative",top:"-4px",margin:"0 "+u.marginSize}});t.default=function(e){var t=e.content,n=e.style,u=r(e,["content","style"]);return(0,i.h)("svg",o({},u,{class:l("root",n),xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 20 20",onClick:function(){return(0,a.copy)(t)}}),(0,i.h)("title",null,"Copy"),(0,i.h)("path",{d:"M2 15H1V5h8v4h2v10H3V9h6",fill:"none",stroke:"#7F8C8D","fill-rule":"evenodd","stroke-width":"1.5","stroke-linecap":"round","stroke-linejoin":"round"}))}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),i=n(14),a=r(i);t.default=function(e){var t=e.children,n=e.activeChild,r=e.onActiveChildChanged,i=void 0===r?function(){}:r;return t.sort(function(e,t){return Boolean(e.children)^Boolean(t.children)?e.children?-1:1:e.name<t.name?-1:1}),(0,o.h)("div",null,t.map(function(e){var t=e.children;return(0,o.h)(a.default,{key:e.name,icon:t?"directory":"file",title:t?e.name:e.name.slice(0,-4),active:e===n,onClick:function(){return i(e===n?null:e)}})}))}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}function a(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=n(2),c=n(11),f=r(c),d=n(4),p=n(7),h=n(1),v=h.base.namespace("File").addRules({root:{overflow:"hidden"},passwordSelector:{display:"inline-block",position:"relative",lineHeight:"24px",hover:{backgroundColor:"#3498DB"}},passwordLine:{display:"block",position:"absolute",top:"0",left:"0",right:"0",bottom:"0",overflow:"hidden",color:"transparent",opacity:"0",fontSize:"1000px"},rest:{whiteSpace:"pre",lineHeight:"24px"},button:{inherit:"button",marginLeft:h.marginSize},link:{color:"#2C3E50",textDecoration:"none",hover:{textDecoration:"underline"}}}),m=function(){function e(){a(this,e),this._renderers=[],this._re=null}return u(e,[{key:"add",value:function(e,t){this._renderers.push({re:e,fn:t}),this._re=null}},{key:"render",value:function(e){var t=this._re;t||(this._re=t=new RegExp(this._renderers.map(function(e){return"("+e.re.source+")"}).join("|"),"gm"));for(var n=[];;){var r=t.lastIndex,o=t.exec(e);if(!o){n.push(e.slice(r));break}for(var i=0;void 0===o[i+1];i+=1);n.push(e.slice(r,o.index),this._renderers[i].fn(o))}return n}}]),e}(),b=new m;b.add(/\bhttps?:\/\/\S+/,function(e){return(0,l.h)("a",{class:v("link"),href:e[0],target:"_blank"},e[0])}),b.add(/\S+@\S+/,function(e){return(0,l.h)("a",{class:v("link"),href:"mailto:"+e[0],target:"_blank"},e[0])}),b.add(/^[A-Z].*?:/,function(e){return(0,l.h)("strong",null,e[0])});var y=function(e){function t(e){var n,r=e.path;a(this,t);var i=o(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return i.state={content:"",error:!1,loading:!0},(n=(0,s.get)(r),p.finally_).call(n,function(){return i.setState({loading:!1})}).then(function(e){return i.setState({content:e})},function(e){return i.setState({error:e})}),i}return i(t,e),u(t,[{key:"renderLoaded",value:function(e){var t=e.split("\n"),n=t[0],r=t.slice(1).join("\n"),o=void 0,i=function(){return(0,d.select)(o)};return[(0,l.h)("div",null,n&&(0,l.h)("span",{class:v("passwordSelector"),onMouseOver:i,onClick:i,onMouseOut:d.unselect},"•".repeat(10),(0,l.h)("span",{class:v("passwordLine"),ref:function(e){return o=e}},n)),(0,l.h)(f.default,{content:n})),(0,l.h)("div",{class:v("rest")},b.render(r.trimRight()))]}},{key:"render",value:function(e,t){var n=t.loading,r=t.error,o=t.content;return(0,l.h)("div",{class:v("root")},n?(0,l.h)("div",null,"Loading..."):r?(0,l.h)("div",{class:v("error")},"Error: ",r.message):this.renderLoaded(o))}}]),t}(l.Component);t.default=y},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(0),i=n(6),a=r(i),u=n(3),l=n(1),s="236, 240, 241",c="189, 195, 199",f=l.base.namespace("Line").addRules({root:{position:"relative",cursor:"pointer",whiteSpace:"nowrap",overflow:"hidden",borderRadius:l.borderRadius,padding:"2px "+l.marginSize},active:{backgroundColor:"rgb("+c+")"},icon:{marginRight:l.marginSize},shadow:{position:"absolute",top:l.borderRadius,bottom:l.borderRadius,right:0,width:l.marginSize,background:"linear-gradient(\n    to right,\n    rgba("+s+", 0) 0%,\n    rgba("+s+", 1) 50%,\n    rgba("+s+", 1) 100%\n    )"},activeShadow:{inherit:"shadow",background:"linear-gradient(\n    to right,\n    rgba("+c+", 0) 0%,\n    rgba("+c+", 1) 50%,\n    rgba("+c+", 1) 100%\n    )"}});t.default=function(e){var t=e.title,n=e.icon,r=e.active,i=void 0!==r&&r,l=e.onClick,s=void 0===l?function(){}:l;return(0,o.h)("div",{class:f("root",i&&"active"),onMouseDown:(0,u.stop)(),onClick:(0,u.stop)(s)},"string"==typeof n?(0,o.h)(a.default,{name:n,style:f("icon")}):n,t,(0,o.h)("div",{class:f(i?"activeShadow":"shadow")}))}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=n(0),c=n(12),f=r(c),d=n(13),p=r(d),h=n(1),v=.5,m={},b=h.base.namespace("List").addRules({root:{display:"flex",borderRadius:h.borderRadius,backgroundColor:"#ECF0F1",boxShadow:h.boxShadow,overflow:"hidden"},container:{flex:"1",display:"flex",marginLeft:"-2px"},column:{position:"relative",display:"flex",transition:"width "+v+"s",verticalAlign:"top",overflow:"hidden"},columnContent:{flex:"1",padding:""+h.marginSize,paddingLeft:"calc("+h.marginSize+" + 2px)",overflowY:"auto",overflowX:"hidden",boxSizing:"border-box"},separator:{position:"absolute",left:"0",top:h.marginSize,bottom:h.marginSize,border:"1px solid #BDC3C7"},noResult:{inherit:"error",margin:h.marginSize}}),y=function(e){function t(){i(this,t);var e=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return e.state={path:[],previousPath:null},e.setPath=function(t){e.setState(function(e){return{previousPath:e.path.slice(),path:t}})},e}return u(t,e),l(t,[{key:"updatePath",value:function(e){for(var t=this.state.path,n=function(e,t){var n=!0,r=!1,o=void 0;try{for(var i,a=e[Symbol.iterator]();!(n=(i=a.next()).done);n=!0){var u=i.value;if(u.name===t)return u}}catch(e){r=!0,o=e}finally{try{!n&&a.return&&a.return()}finally{if(r)throw o}}},r=0;r<t.length;r+=1){var o=n(e,t[r].name);if(!o){t.length=r;break}if(t[r]=o,!(e=o.children))break}for(;e&&1===e.length;)t.push(e[0]),e=e[0].children}},{key:"adjustColumnWidths",value:function(){if(0!==this.props.list.length){var e=200,t=this.state.path.length+1,n=this.container.clientWidth,r=Array.from(this.container.childNodes);if(n>t*e)r.forEach(function(r,o){if(o>=t)r.style.width="0";else if(o>=t-1){var i=n-e*(t-1);r.style.width=i+"px"}else r.style.width=e+"px"});else{var o=Math.max((n-2*e)/(t-2),0);r.forEach(function(n,r){n.style.width=r>=t?"0":r>=t-2?e+"px":o+"px"})}}}},{key:"componentDidMount",value:function(){this.adjustColumnWidths()}},{key:"componentDidUpdate",value:function(){this.adjustColumnWidths()}},{key:"render",value:function(e,t){var n=this,r=e.list,i=t.path,a=t.previousPath;this.updatePath(r);var u=i.slice();if(a&&a.length>i.length){var l=i[i.length-1]===a[i.length-1],c=!0,d=!1,h=void 0;try{for(var y,g=a.slice(i.length)[Symbol.iterator]();!(c=(y=g.next()).done);c=!0){var _=y.value;u.push(l?_:m)}}catch(e){d=!0,h=e}finally{try{!c&&g.return&&g.return()}finally{if(d)throw h}}clearTimeout(this.redrawTimer),this.redrawTimer=setTimeout(function(){n.setState({previousPath:null})},1e3*v)}var w=function(e,t){var r=void 0,l=void 0,c=u.slice(0,t);return e.children?r=(0,s.h)(f.default,{onActiveChildChanged:function(e){e?n.setPath([].concat(o(c),[e])):n.setPath(c)},activeChild:i[t]},e.children):e!==m&&(r=(0,s.h)(p.default,{path:c.map(function(e){return e.name})})),a&&t>a.length&&(l="0"),(0,s.h)("div",{class:b("column"),style:{width:l}},(0,s.h)("div",{class:b("separator")}),(0,s.h)("div",{class:b("columnContent"),key:e.name},r))};return(0,s.h)("div",{class:b("root")},r.length?(0,s.h)("div",{class:b("container"),ref:function(e){return n.container=e}},w({children:r},0),u.map(function(e,t){return w(e,t+1)})):(0,s.h)("div",{class:b("noResult")},"No result"))}}]),t}(s.Component);t.default=y},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function a(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),l=n(0),s=n(6),c=r(s),f=n(1),d=f.base.namespace("Search").addRules({root:{position:"relative",flex:"1",maxWidth:"300px",marginRight:f.marginSize},textField:{inherit:"textField",width:"100%",boxSizing:"border-box",paddingRight:"calc(20px + "+f.marginSize+")"},searchIcon:{},button:{pointerEvents:"none",position:"absolute",right:"0",top:"0",padding:"5px "+f.marginSize,cursor:"pointer"},buttonActive:{pointerEvents:"initial"}}),p=function(e){function t(){return o(this,t),i(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return a(t,e),u(t,[{key:"render",value:function(e){var t=this,n=e.onChange,r=function(){n&&t.input&&n(t.input.value)},o=function(){t.input.value="",r()},i=Boolean(this.input&&this.input.value);return(0,l.h)("div",{class:d("root")},(0,l.h)("input",{class:d("textField"),ref:function(e){t.input=e},onKeyUp:r}),(0,l.h)("div",{class:d("button",i&&"buttonActive"),onClick:o},(0,l.h)(c.default,{name:i?"clean":"search",style:d("searchIcon")})))}},{key:"focus",value:function(){this.input.focus()}}]),t}(l.Component);t.default=p},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(){var e=u.default.loggedIn?f.default:s.default;document.querySelector("link[rel=icon]").setAttribute("href",e)}function i(){u.default.register(o),o()}Object.defineProperty(t,"__esModule",{value:!0}),t.init=i;var a=n(5),u=r(a),l=n(20),s=r(l),c=n(19),f=r(c)},function(e,t,n){e.exports=n.p+"icons.svg?245ccf008a6a55928b5365205ab1a7ee"},function(e,t,n){e.exports=n.p+"favicon-unlocked.png?4317a0c11e70887b06ac7ae9333ff580"},function(e,t,n){e.exports=n.p+"favicon.png?47f78c6cde9e22a7c0230ad8288cf60b"},function(e,t,n){!function(t,n){e.exports=n()}(0,function(){"use strict";function e(e){if(!e||"object"!==(void 0===e?"undefined":d(e)))return!1;var t=Object.getPrototypeOf(e);return!t||t===Object.prototype}function t(n,r,o){return"object"===(void 0===r?"undefined":d(r))&&r?(Object.keys(r).forEach(function(i){var a=r[i];void 0===a||null===a?delete n[i]:o!==!0&&e(a)?(p(n,i)&&e(n[i])||(n[i]={}),t(n[i],a)):n[i]=a}),n):n}function n(r,o,i,a){var u=void 0;for(u in o){var l=o[u];if(u in r){var s=r[u],c="function"==typeof s,f=u+":"+v(c?l:Boolean(l));if(!p(i,f)){i[f]=t({},c?s(l):l&&s);var d={};n(r,i[f],i,d),i[f]=d}t(a,i[f])}else e(l)?(p(a,u)&&e(a[u])||(a[u]={}),n(r,l,i,a[u])):a[u]=l}return a}function r(e){if(!/^[a-z](?:[a-z0-9_-]*[a-z0-9])?$/i.test(e))throw new Error("Invalid identifier: "+e)}function o(e,t,n){for(var r=e.length-1;r>=0;r--){var i=e[r];i&&("number"==typeof i.length?o(i,t,n):n[i.id]||(t.unshift(i),n[i.id]=!0,i.parents&&o(i.parents,t,n)))}}function i(){var e=[];return o(arguments,e,{}),e}function a(e){return e.replace(/([A-Z])/g,"-$1")}function u(e,t){if(f&&r(e),Array.isArray(t))return t.map(function(t){return u(e,t)}).reverse().join("\n");var n=y[e];return"content"===e?t=JSON.stringify(t):"number"!=typeof t||n||(t+="px"),e in b||(b[e]=a(e)),b[e]+":"+t+";"}function l(t,n,r,o){var i="",s=[];for(var c in n){var f=n[c];e(f)?s.push(c):i+=u(c,f)}i&&(i=t+"{"+i+"}",o&&(i=o+"{"+i+"}"),r(i));for(var d=0;d<s.length;d++){var p=s[d],h=n[p];if("@"===p[0])l(t,h,r,p);else{l(""+t+a("$"===p[0]?"::"+p.slice(1):":"!==p[0]?":"+p:p),h,r,o)}}}function s(e){var t=0,n=Object.create(null);return function(r){var o=-1,a=i(r).map(function(r){for(var i=-1,a=n[r.id]||(n[r.id]=[]),u=0;u<a.length;u++)if(a[u]>o){i=a[u];break}return i<0&&(l("."+r.class+"__"+t,r.declarations,e),a.push(t),i=t,t+=1),o=i,r.class+"__"+i}),u={};return Object.defineProperties(u,{toString:{value:function(){return a.join(" ")}},_rules:{value:r}}),a.forEach(function(e){return u[e]=!0}),u}}function c(){function t(){return P(i(arguments))}function n(e){return function(n){if(f&&(!n||"object"!==(void 0===n?"undefined":d(n))))throw new Error("The 'set' argument should be an object");for(var r in n)e(r,n[r]);return t}}function o(e,t){var n=void 0,r=void 0;for(n=0,r=e.length;n<r;n++){var i=e[n];if(i){var a=void 0===i?"undefined":d(i);if("object"===a&&i)i._rules?o(i._rules,t):i.length?o(i,t):t.push(i);else{if("string"!==a)throw new Error('Style "'+i+'" has wrong type');if(!(i in N))throw new Error('Unknown style "'+i+'"');t.push(N[i])}}}return t}function i(){return o(arguments,[])}function a(e){if(f&&(r(e),"string"!=typeof e))throw new Error("The 'name' argument should be a string");return e in M||(M[e]=c({name:y?y+"_"+e:e,_renderer:P,_transforms:R,_styles:N})),M[e]}function u(e,n){if(f){if("string"!=typeof e)throw new Error("The 'name' argument should be a string");if(!n||"object"!==(void 0===n?"undefined":d(n))&&"function"!=typeof n)throw new Error("The 'definition' argument should be an object or a function");if(p(R,e))throw new Error("The transform "+e+" already exists")}return R[e]=n,t}function l(n,o){if(f){if("string"!=typeof n)throw new Error("The 'name' argument should be a string");if(r(n),!e(o))throw new Error("The 'declaration' argument should be a plain object");if(p(N,n))throw new Error('A "'+n+'" style already exists')}var a=o.inherit?Array.isArray(o.inherit)?o.inherit:[o.inherit]:[];return N[n]={id:g,class:y+"__"+n,parents:i(a),declarations:m(R,o,E)},g+=1,t}var v=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},b=v.name,y=void 0===b?"":b,_=v.backend,w=void 0===_?null:_,x=v._renderer,k=void 0===x?null:x,j=v._styles,O=void 0===j?null:j,S=v._transforms,C=void 0===S?null:S;if(f){if("string"!=typeof y)throw new Error("The 'name' option should be a string");if(null!==w&&"function"!=typeof w)throw new Error("The 'backend' option should be a function")}var P=k||s(w||h()),E=Object.create(null),M=Object.create(null),R=Object.create(C),N=Object.create(O);return t.namespace=a,t.addTransform=u,t.addTransforms=n(u),t.addRule=l,t.addRules=n(l),t}var f=!0,d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},p=(function(){function e(e){this.value=e}function t(t){function n(e,t){return new Promise(function(n,o){var u={key:e,arg:t,resolve:n,reject:o,next:null};a?a=a.next=u:(i=a=u,r(e,t))})}function r(n,i){try{var a=t[n](i),u=a.value;u instanceof e?Promise.resolve(u.value).then(function(e){r("next",e)},function(e){r("throw",e)}):o(a.done?"return":"normal",a.value)}catch(e){o("throw",e)}}function o(e,t){switch(e){case"return":i.resolve({value:t,done:!0});break;case"throw":i.reject(t);break;default:i.resolve({value:t,done:!1})}i=i.next,i?r(i.key,i.arg):a=null}var i,a;this._invoke=n,"function"!=typeof t.return&&(this.return=void 0)}"function"==typeof Symbol&&Symbol.asyncIterator&&(t.prototype[Symbol.asyncIterator]=function(){return this}),t.prototype.next=function(e){return this._invoke("next",e)},t.prototype.throw=function(e){return this._invoke("throw",e)},t.prototype.return=function(e){return this._invoke("return",e)},{wrap:function(e){return function(){return new t(e.apply(this,arguments))}},await:function(t){return new e(t)}}}(),function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}),h=function(){var e=document.createElement("style");document.head.appendChild(e);var t=e.sheet;return function(e){t.insertRule(e,t.cssRules.length)}},v=JSON.stringify,m=function(e,t,r){var o={};return n(e,t,r,o),o},b=Object.create(null),y=Object.create(null);["columnCount","fillOpacity","flex","flexGrow","flexShrink","fontWeight","lineClamp","lineHeight","opacity","order","orphans","strokeOpacity","transition","transitionDelay","transitionDuration","widows","zIndex","zoom"].forEach(function(e){y[e]=!0});var g=0;return c})},function(e,t,n){e.exports=n(8)}]);