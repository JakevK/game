(this.webpackJsonpgame=this.webpackJsonpgame||[]).push([[0],{34:function(e,t,n){"use strict";n.r(t);var c=n(8),a=n(6),r=n(32),o=n.n(r),i=(n(39),n(33)),u=n.n(i),s=n(0),l=window.location.hostname+":"+("5000"===window.location.port?window.location.port:"");console.log("bruh"),console.log(l);var d=u.a.connect(l),j=function(e){var t=Object(a.useState)(""),n=Object(c.a)(t,2),r=n[0],o=n[1];return Object(s.jsxs)("div",{children:[Object(s.jsx)("input",{value:r,onKeyUp:function(t){return function(t){13===t.keyCode&&e.onSubmit(r)}(t)},onChange:function(e){return function(e){o(e.target.value)}(e)}}),Object(s.jsx)("button",{onClick:function(){return e.onSubmit(r)},children:"submit"})]})},b=function(){var e=Object(a.useState)(""),t=Object(c.a)(e,2),n=t[0],r=t[1],o=Object(a.useState)(),i=Object(c.a)(o,2),u=i[0],l=i[1],b=Object(a.useState)(),m=Object(c.a)(b,2),h=m[0],f=m[1],x=Object(a.useState)(0),p=Object(c.a)(x,2),v=p[0],g=p[1];Object(a.useEffect)((function(){y(),N()}),[]);var y=function(){d.on("game",(function(e){f(e),g(0)}))},N=function(){d.on("game_over",(function(e){f()}))};return h?h.player1?Object(s.jsx)(O,{data:h,playerNum:u,name:n,leaveGame:function(){d.emit("leave",{game_code:h.game_code,name:n}),f()}}):Object(s.jsxs)("div",{children:[Object(s.jsx)("h3",{children:"Your game code is"}),Object(s.jsx)("div",{children:h.game_code})]}):v?Object(s.jsxs)("div",{children:[Object(s.jsx)("h3",{children:"enter a code to join a game"}),Object(s.jsx)(j,{onSubmit:function(e){var t;6===(t=e).length&&(d.emit("join",{game_code:t,name:n}),l(1))}})]}):n?Object(s.jsxs)("div",{children:[Object(s.jsxs)("h3",{children:["hello ",n,"!"]}),Object(s.jsx)("p",{children:"what would you like to do today?"}),Object(s.jsxs)("button",{onClick:function(){return d.emit("create",{name:n}),void l(0)},children:[Object(s.jsx)("div",{children:"create"}),Object(s.jsx)("p",{children:"create a new game for your friend to join"})]}),Object(s.jsxs)("button",{onClick:function(){return g(1)},children:[Object(s.jsx)("div",{children:"join"}),Object(s.jsx)("p",{children:"join an existing game with a game code"})]})]}):Object(s.jsxs)("div",{children:[Object(s.jsx)("h3",{children:"what's your name?"}),Object(s.jsx)(j,{onSubmit:function(e){return r(e)}})]})},m=function(e){return Object(s.jsx)("div",{className:"board",children:e.board.map((function(t,n){return Object(s.jsx)("div",{className:"board-quarter",style:{transform:"rotate(".concat(90*e.rotations.split(",")[n],"deg)")},children:t.map((function(t,c){return Object(s.jsx)("div",{className:"board-row",children:t.map((function(t,a){return Object(s.jsx)("button",{className:"board-square",style:{backgroundColor:["#efefef","blue","red"][t]},onClick:function(){return e.onClickSquare(n,c,a)}},a)}))},c)}))},n)}))})},O=function(e){var t=function(e,t){return e.match(new RegExp(".{1,"+t+"}","g"))},n=function(t,n){d.emit("rotate",{game_code:e.data.game_code,player_num:e.playerNum,quarter:t,rotation:n})};return Object(s.jsxs)("div",{children:[Object(s.jsx)("button",{onClick:function(){return e.leaveGame()},children:"leave game"}),Object(s.jsxs)("h3",{children:["playing as"," ",Object(s.jsx)("span",{style:{color:["blue","red"][e.playerNum]},children:e.name})]}),Object(s.jsx)("div",{children:null===e.data.winner?e.data.turn===e.playerNum?e.data.stage?"turn a quarter":"place a piece":"opponent's turn":e.data.winner===e.playerNum?"you won!":"you lost :("}),e.data.stage&&e.data.turn===e.playerNum?Object(s.jsxs)("div",{className:"controls",children:[Object(s.jsxs)("div",{className:"rotate-top-left",children:[Object(s.jsx)("button",{onClick:function(){return n(0,-1)},children:"<-"}),Object(s.jsx)("button",{onClick:function(){return n(0,1)},children:"->"})]}),Object(s.jsxs)("div",{className:"rotate-top-right",children:[Object(s.jsx)("button",{onClick:function(){return n(1,-1)},children:"<-"}),Object(s.jsx)("button",{onClick:function(){return n(1,1)},children:"->"})]})]}):Object(s.jsx)("div",{className:"controls"}),Object(s.jsx)(m,{board:t(e.data.board,9).map((function(e){return t(e,3).map((function(e){return e.split("").map((function(e){return+e}))}))})),rotations:e.data.rotations,onClickSquare:function(t,n,c){return function(t,n,c){if(e.data.turn===e.playerNum&&0===e.data.stage&&null===e.data.winner){var a=9*t+3*n+c;"0"===e.data.board[a]&&d.emit("place",{game_code:e.data.game_code,index:a,player_num:e.playerNum})}}(t,n,c)}}),e.data.stage&&e.data.turn===e.playerNum?Object(s.jsxs)("div",{className:"controls",children:[Object(s.jsxs)("div",{className:"rotate-bottom-left",children:[Object(s.jsx)("button",{onClick:function(){return n(2,1)},children:"<-"}),Object(s.jsx)("button",{onClick:function(){return n(2,-1)},children:"->"})]}),Object(s.jsxs)("div",{className:"rotate-bottom-right",children:[Object(s.jsx)("button",{onClick:function(){return n(3,1)},children:"<-"}),Object(s.jsx)("button",{onClick:function(){return n(3,-1)},children:"->"})]})]}):Object(s.jsx)("div",{className:"controls"})]})};o.a.render(Object(s.jsx)(b,{}),document.getElementById("root"))},39:function(e,t,n){}},[[34,1,2]]]);
//# sourceMappingURL=main.e2bd0009.chunk.js.map