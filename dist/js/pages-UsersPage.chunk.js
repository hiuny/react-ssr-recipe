"use strict";exports.id=850,exports.ids=[850],exports.modules={393:(s,e,r)=>{r.r(e),r.d(e,{default:()=>x});var n=r(661),t=r(689),u=r(22),c=r(997);const i=function(s){var e=s.users;return e?(0,c.jsx)("div",{children:(0,c.jsx)("ul",{children:e.map((function(s){return(0,c.jsx)("li",{children:(0,c.jsx)(n.Link,{to:"/users/".concat(s.id),children:s.username})},s.id)}))})}):null};var o=r(701),l=r(312);const d=(0,u.connect)((function(s){return{users:s.users.users}}),{getUsers:l.Rf})((function(s){var e=s.users,r=s.getUsers;return(0,t.useEffect)((function(){console.log("UsersContainer 마운트",e),e||r()}),[r,e]),(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{users:e}),(0,c.jsx)(o.p9,{resolve:r})]})})),x=function(){return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(d,{}),(0,c.jsx)(n.Outlet,{})]})}}};