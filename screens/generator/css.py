CSS = r"""
/* Layout: review board — sticky section nav on top, frame cards in a responsive grid, click opens a full-size viewer.
   Frames are rendered at native 1920×1080 and scaled; frame internals use the kit tokens from 1.5. */
:root{
  --board:#0E1514; --board-2:#141E1D; --board-line:#26332F; --ink:#EEF2F0; --ink-2:#9FB0AB; --pink:#FD3286;
  --font-pixel:'Pixel Code','Inter',ui-monospace,monospace; --font-ui:'Inter',system-ui,sans-serif;
  /* kit tokens */
  --bg0:#000; --s1:#172827; --s2:#202E30; --s3:#232727; --s4:#303E40; --sh:#0D1B1A; --n1:#4C5152; --n2:#9D9D9D; --n5:#F2F2F2; --n6:#FFFFFF;
  --a1:#DA2E76; --a2:#E94785; --a3:#FD3286; --er:#F52538;
  color-scheme:dark;
}
@font-face{font-family:'Pixel Code';font-weight:700;font-style:normal;src:url(data:font/woff2;base64,__PCFONT__) format('woff2');}
body{background:var(--board);color:var(--ink);font-family:var(--font-ui);}
.page{padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:24px 80px;max-width:1880px;margin:0 auto;}
header.top h1{font-family:var(--font-pixel);font-size:clamp(22px,3vw,36px);letter-spacing:-.02em;text-transform:uppercase;margin:8px 0 6px;color:var(--ink);text-shadow:2px 2px 0 var(--a2);text-wrap:balance}
header.top p{color:var(--ink-2);max-width:72ch;line-height:1.55;margin:6px 0}
.legend{display:flex;flex-wrap:wrap;gap:8px 18px;margin:14px 0 4px;color:var(--ink-2);font-size:13px}
.legend b{color:var(--ink)}
nav.secs{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:var(--board);border-bottom:1px solid var(--board-line);padding-block:10px;display:flex;gap:8px;overflow-x:auto;scrollbar-width:thin}
body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:10;background:var(--board)}
nav.secs a{flex:0 0 auto;color:var(--ink-2);text-decoration:none;font-size:13px;padding:6px 12px;border:1px solid var(--board-line);border-radius:999px;white-space:nowrap}
nav.secs a:hover,nav.secs a:focus-visible{color:var(--ink);border-color:var(--pink);outline:none}
section.sec{margin-top:36px;scroll-margin-top:64px}
section.sec>h2{font-family:var(--font-pixel);text-transform:uppercase;font-size:20px;letter-spacing:.02em;color:var(--ink);margin:0 0 4px}
section.sec>p{color:var(--ink-2);margin:0 0 16px;font-size:14px;max-width:90ch;line-height:1.5}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,520px),1fr));gap:22px}
.card{background:var(--board-2);border:1px solid var(--board-line);border-radius:14px;overflow:hidden;display:flex;flex-direction:column;min-width:0}
.thumb{position:relative;aspect-ratio:16/9;overflow:hidden;cursor:zoom-in;background:#000;max-width:100%}
.thumb:focus-visible{outline:2px solid var(--pink);outline-offset:-2px}
.thumb>.fr{position:absolute;left:0;top:0;transform-origin:0 0;transform:scale(var(--k,.25));pointer-events:none}
.cap{padding:12px 14px 14px;display:flex;flex-direction:column;gap:6px;min-width:0}
.cap .idl{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.fid{font-family:var(--font-pixel);font-size:12px;color:#0E1514;background:var(--pink);padding:2px 8px;border-radius:6px;letter-spacing:.03em}
.cap .nm{font-weight:700;font-size:15px;color:var(--ink)}
.cap .nt{color:var(--ink-2);font-size:13px;line-height:1.5}
.viewer{position:fixed;inset:0;z-index:20;background:rgba(5,9,8,.92);display:flex;flex-direction:column;padding:max(12px,env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) max(12px,env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px))}
.viewer .vbar{display:flex;gap:12px;align-items:center;color:var(--ink);padding-bottom:10px;flex-wrap:wrap}
.viewer .vbar .nm{font-weight:700}
.viewer .vbar .nt{color:var(--ink-2);font-size:13px;flex:1 1 300px;min-width:0}
.viewer button{background:var(--board-2);color:var(--ink);border:1px solid var(--board-line);border-radius:999px;padding:8px 14px;font:600 13px var(--font-ui);cursor:pointer}
.viewer button:hover,.viewer button:focus-visible{border-color:var(--pink);outline:none}
.vstage{flex:1;position:relative;overflow:hidden}
.vstage>.fr{position:absolute;transform-origin:0 0}
@media (prefers-reduced-motion:no-preference){.card{transition:border-color .15s}.card:hover{border-color:#3b4b47}}

/* ===== frame internals ===== */
.fr{width:1920px;height:1080px;position:relative;overflow:hidden;background:var(--bg0);font-family:var(--font-ui);color:var(--n5);font-size:16px;line-height:1.5}
.fr *{box-sizing:border-box}
.bg{position:absolute;left:-54px;top:-25px;width:2028px;height:calc(100% + 50px);background:url(__BG__) center/cover no-repeat}
.fr.sys .bg{filter:blur(5px) brightness(.62)}
.fr.reception .bg{filter:blur(3px) brightness(.4) saturate(.6)}
.ovl{position:absolute;inset:0;background:rgba(0,0,0,.65)}
.px{font-family:var(--font-pixel);font-weight:700;text-transform:uppercase;letter-spacing:-.02em}
.h1{color:var(--n5);text-shadow:1.3px 1.3px 0 var(--a2);-webkit-text-stroke:.6px var(--a2);line-height:1.5}
.h2{color:var(--n5);text-shadow:1.2px 1.2px 0 var(--a2);line-height:1.6}
.h3{font-weight:700;text-transform:uppercase;letter-spacing:-.02em;color:var(--n5);text-shadow:1.3px 1.3px 0 var(--a2);-webkit-text-stroke:.6px var(--a2);line-height:1.4}
.lb{font-weight:700;text-transform:uppercase;letter-spacing:-.02em;color:var(--n5);line-height:1.4}
.sm{font-weight:500;color:var(--n2);line-height:1.45}
.pt{font-weight:500;color:var(--n5);line-height:1.5}
.pink{color:var(--a3)}
.row{display:flex;flex-direction:row}
.col{display:flex;flex-direction:column}
.spacer{flex:1 1 auto}
.abs{position:absolute}
.center{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}
.ico{display:inline-block;flex:0 0 auto}
.errtxt{font-family:var(--font-pixel);font-weight:700;font-size:13px;color:var(--er);text-transform:uppercase;padding-left:12px}
/* buttons */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;height:55px;padding:0 28px;border-radius:999px;font-family:var(--font-pixel);font-weight:700;font-size:18px;text-transform:uppercase;letter-spacing:-.02em;white-space:nowrap}
.btn-p{background:var(--s1);border:2px solid var(--n1);color:var(--n5);box-shadow:inset 0 -3px 0 var(--sh)}
.btn-p.hover{border-color:var(--a3);color:var(--a3)}
.btn-p.pressed{border-color:var(--a1);background:var(--sh);color:var(--a3);box-shadow:0 0 0 3px rgba(253,50,134,.25)}
.btn-s{background:var(--s4);border:2px solid var(--s4);color:var(--n5)}
.btn-a{background:var(--a3);color:var(--s1);border:2px solid var(--a3);box-shadow:0 0 18px rgba(253,50,134,.45)}
.btn-l{background:none;border:none;text-decoration:underline;text-underline-offset:5px;padding:0;height:auto;font-size:15px}
.btn.dis{background:var(--s1);border-color:var(--s4);color:var(--n1);box-shadow:none}
.btn.btn-sm{height:44px;font-size:15px;padding:0 20px}
.xbtn{width:32px;height:32px;border-radius:50%;border:2px solid var(--n2);display:flex;align-items:center;justify-content:center;color:var(--n5);flex:0 0 auto}
.qbtn{width:32px;height:32px;border-radius:50%;border:2px solid var(--a3);display:inline-flex;align-items:center;justify-content:center;color:var(--a3);background:var(--sh)}
.chip{display:inline-flex;align-items:center;height:47px;padding:0 22px;border-radius:999px;background:var(--s1);border:2px solid var(--s4);font-family:var(--font-pixel);font-weight:700;text-transform:uppercase;font-size:16px;color:var(--n5);white-space:nowrap}
.chip.pressed{border-color:var(--a3);box-shadow:0 0 0 3px rgba(253,50,134,.3),0 0 14px rgba(253,50,134,.5);color:var(--n6)}
.chip.dis{color:var(--n1)}
.tool{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:39px;padding:6px 16px;border-radius:999px;background:var(--s4);border:2px solid var(--s4)}
.tool .tl{font-size:13px;color:var(--n5)}
.tool .ts{font-size:13px;color:var(--a3);white-space:nowrap}
.tool.pressed{border-color:var(--a3);box-shadow:0 0 10px rgba(253,50,134,.5)}
.tool.dis{background:var(--s3);border-color:var(--s3)}
.tool.dis .tl,.tool.dis .ts{color:var(--n1)}
.tool.live{border-color:var(--a3)}
/* badges */
.bd{display:inline-flex;align-items:center;gap:6px;border-radius:999px;font-weight:700;white-space:nowrap;line-height:1}
.bd-s{height:28px;padding:0 10px;font-size:13px}
.bd-m{height:44px;padding:0 14px;font-size:16px}
.bd-pink{background:var(--a3);color:var(--n6)}
.bd-white{background:var(--n5);color:var(--s1)}
.bd-white .ico{color:var(--a3)}
.bd-accent{background:var(--a1);color:var(--n6)}
.bd-err{background:var(--er);color:var(--n6)}
.bd-dark{background:var(--s4);color:var(--n5)}
.bd-tag{background:var(--n5);color:var(--s1);text-transform:uppercase}
.bd-tagown{background:var(--a3);color:var(--n6);text-transform:uppercase}
.bd-city{background:var(--s4);color:var(--a3);text-transform:uppercase}
.bd-row{width:100%;height:28px;padding:0 10px;font-size:11.5px;gap:4px;text-transform:uppercase}
/* rows */
.kpirow,.mrow,.lbrow{display:flex;align-items:center;gap:12px;min-height:54px;padding:6px 10px 6px 18px;border-radius:999px;background:var(--s1);border:2px solid var(--s4)}
.kn,.mn{flex:1 1 0;min-width:0;overflow-wrap:anywhere;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:-.02em;color:var(--n5);line-height:1.3}
.kv{font-weight:700;font-size:15px;white-space:nowrap;flex:0 0 auto}
.kpirow{gap:8px;padding-left:14px}.kpirow .kn{font-size:12px}.kpirow .chg,.mrow .chg,.lbrow .chg{flex:0 0 auto}
.z-g .kv{color:var(--n6)}
.z-y .kv{color:var(--a3);text-shadow:0 0 8px rgba(253,50,134,.6)}
.z-r .kv{color:var(--er);text-shadow:0 0 8px rgba(245,37,56,.5)}
.kpirow.hover{border-color:var(--a3)}
.mv{font-weight:700;font-size:15px;color:var(--a3);white-space:nowrap}
.mrow.big .mn{font-size:15px}
.mrow.sub{background:var(--s3)}
.lbrow{min-height:54px;padding-left:14px}
.lbrow.own{background:var(--a3);border-color:var(--a3)}
.lbrow.own .lbv{color:var(--n6)}
.lbp{font-size:30px;width:34px;text-align:center;color:var(--n5)}
.lbv{font-weight:700;font-size:16px;color:var(--a3);white-space:nowrap}
.lbx{font-weight:600;font-size:13px;color:var(--n2)}
.lbrow.own .lbx{color:var(--n6)}
.chg-empty{width:64px}
.docrow{display:flex;gap:10px;align-items:flex-start;flex-wrap:wrap;padding:12px 14px;border-radius:20px;background:var(--s1);border:2px solid var(--s4)}
.docrow .dt{flex:1 1 100%;font-weight:600;font-size:15px;line-height:1.4;color:var(--n5)}
/* slider */
.slw{display:flex;flex-direction:column;gap:6px;width:100%}
.sl{display:flex;align-items:center;gap:18px;height:51px}
.sl-tr{position:relative;flex:1;height:10px;border-radius:6px;background:var(--s4)}
.sl-fill{position:absolute;left:0;top:0;bottom:0;border-radius:6px;background:var(--a3)}
.sl-ap{position:absolute;left:0;top:0;bottom:0;border-radius:6px;background:var(--a1);z-index:1}
.sl-ap+.sl-fill{z-index:0}
.sl-kn{position:absolute;top:50%;width:26px;height:38px;border-radius:9px;background:var(--n5);transform:translate(-50%,-50%);box-shadow:0 2px 0 var(--sh);z-index:2}
.sl-v{font-size:18px;color:var(--n5);white-space:nowrap;min-width:92px;text-align:right}
.slw.hover .sl-kn{outline:3px solid var(--a3)}
.slw.pressed .sl-kn{outline:3px solid var(--a3);box-shadow:0 0 14px rgba(253,50,134,.7)}
.slw.error .sl-fill{background:var(--er)}
.slw.error .sl-kn{outline:3px solid var(--er)}
.slw.dis .sl-fill{background:var(--n1)}
.slw.dis .sl-kn{background:var(--n2)}
.slw.dis .sl-v{color:var(--n1)}
.sl-pred{position:absolute;left:calc(var(--p,40%) + 30px);top:-44px;display:flex;gap:6px;z-index:3}
.preds{display:flex;flex-wrap:wrap;gap:8px 14px}
.pred{display:inline-flex;align-items:center;gap:8px}
.pred .pl{font-weight:500;font-size:13px;color:var(--n2)}
/* stepper, seg, switch */
.stpw{display:flex;flex-direction:column;gap:6px}
.stp,.stp-s{display:inline-flex;align-items:center;gap:10px}
.stp .sb{width:44px;height:44px;border-radius:50%;border:2px solid var(--n1);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:22px;color:var(--n5)}
.stp .sv{min-width:84px;height:44px;padding:0 14px;border-radius:999px;background:var(--s4);display:flex;align-items:center;justify-content:center;font-size:18px}
.stp-s .sb{width:24px;height:24px;border-radius:50%;border:2px solid var(--n1);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px}
.stp-s .sv{min-width:38px;height:24px;border-radius:999px;background:var(--s4);display:flex;align-items:center;justify-content:center;font-size:13px}
.stp.min .minus,.stp-s.min .minus,.stp.max .plus,.stp-s.max .plus{color:var(--n1);border-color:var(--s4)}
.stp.error .plus,.stp-s.error .plus{border-color:var(--er);color:var(--er)}
.stp.dis .sb,.stp-s.dis .sb,.stp.dis .sv,.stp-s.dis .sv{color:var(--n1);border-color:var(--s4)}
.segw{display:flex;flex-direction:column;gap:6px}
.seg{display:inline-flex;gap:8px}
.sg{height:47px;padding:0 18px;display:inline-flex;align-items:center;border-radius:999px;background:var(--s1);border:2px solid var(--s4);font-family:var(--font-pixel);font-weight:700;text-transform:uppercase;font-size:14px;white-space:nowrap}
.sg.on{border-color:var(--a3);box-shadow:0 0 10px rgba(253,50,134,.5)}
.seg.error .sg.on{border-color:var(--er);box-shadow:0 0 10px rgba(245,37,56,.5)}
.seg.dis .sg{color:var(--n1)}
.sw{width:100px;height:51px;border-radius:999px;background:var(--s4);position:relative;flex:0 0 auto}
.sw span{position:absolute;left:6px;top:6px;width:39px;height:39px;border-radius:50%;background:var(--n2)}
.sw.on{background:var(--a3);box-shadow:0 0 16px rgba(253,50,134,.55)}
.sw.on span{left:55px;background:var(--n6)}
/* inputs */
.inpw{display:flex;flex-direction:column;gap:6px;width:100%}
.inp{height:51px;border-radius:999px;background:var(--s1);border:2px solid var(--s4);display:flex;align-items:center;gap:8px;padding:0 20px;font-weight:700;font-size:16px;text-transform:uppercase;color:var(--n5)}
.inp.ph span{color:var(--n1)}
.inp>span{flex:1}
.inp.focus{border-color:var(--a3);box-shadow:0 0 14px rgba(253,50,134,.5)}
.inp.error{border-color:var(--er);color:var(--er)}
.inp.dis{color:var(--n1)}
.caret{display:inline-block;width:2px;height:22px;background:var(--a3);margin-left:-6px}
.codew{display:flex;flex-direction:column;gap:8px}
.code{display:flex;gap:12px}
.cc{width:71px;height:84px;border-radius:999px;background:var(--s1);border:2px solid var(--s4);display:flex;align-items:center;justify-content:center;font-size:30px;color:var(--a3)}
.code.show .cc{width:58px;height:70px;font-size:26px}
.code.error .cc{border-color:var(--er);color:var(--er)}
.code.typing .cc:nth-child(4){border-color:var(--a3);box-shadow:0 0 12px rgba(253,50,134,.5)}
/* timer / turn / event */
.timer{display:flex;align-items:center;gap:22px;height:60px;padding:0 6px 0 24px;border-radius:999px;background:var(--s1);border:2px solid var(--n1)}
.timer .tt{font-size:40px;color:var(--a3);text-shadow:2px 2px 0 var(--a1);min-width:131px}
.timer.exp .tt,.timer.exp .ico{color:var(--a3)}
.timer.exp{border-color:var(--a3)}
.turn{display:flex;align-items:center;gap:10px;height:60px;padding:0 8px 0 24px;border-radius:999px;background:var(--s1);border:2px solid var(--n1);flex:1;min-width:0}
.tp-me{font-size:16px;color:var(--n1);margin-right:6px;white-space:nowrap}
.tp-me.on{color:var(--n5)}
.tp-i{display:inline-flex;align-items:center;gap:6px;height:44px;padding:0 14px;border-radius:999px;font-weight:700;font-size:16px;text-transform:uppercase;white-space:nowrap;color:var(--n1)}
.tp-i.done{color:var(--n2);background:var(--s3)}
.tp-i.done .ico{color:var(--a3)}
.tp-i.cur b{font-size:38px;color:var(--a3);line-height:1}
.tp-i.cur .tp-c{background:var(--a3);color:var(--n6);border-radius:999px;padding:9px 14px}
.tp-i.next{background:var(--s3)}
.evi{display:flex;align-items:center;gap:20px;height:60px;padding:0 20px 0 6px;border-radius:999px;background:var(--s1);border:2px solid var(--s4)}
.evq{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--font-pixel);font-weight:700;font-size:24px;background:var(--s3);color:var(--n1)}
.evt{flex:1;font-weight:700;font-size:16px;text-transform:uppercase;color:var(--n1)}
.evi.act{border-color:var(--a3);box-shadow:0 0 14px rgba(253,50,134,.45)}
.evi.act .evq{background:var(--a3);color:var(--n6)}
.evi.act .evt{color:var(--n5)}
/* panels */
.pnl{background:var(--s1);border:2px solid var(--n1);border-radius:20px;padding:12px;display:flex;flex-direction:column;gap:16px}
.pnl .ptitle{text-align:center}
.budget-w{position:relative;display:flex;flex-direction:column;gap:10px}
.budget{height:77px;border-radius:999px;border:2px solid var(--n1);display:flex;align-items:center;justify-content:center}
.budget .px{font-size:32px;color:var(--a3);text-shadow:2px 2px 0 var(--a1)}
.qtip{background:var(--s2);border:2px solid var(--a3);border-radius:20px;padding:12px 14px;display:flex;flex-direction:column;gap:6px;box-shadow:0 10px 30px rgba(0,0,0,.5)}
.qtip .tip-l{color:var(--n5)}
.qtip .tip-v{color:var(--a3);font-weight:700;white-space:nowrap}
.budget-tip{position:absolute;left:100%;top:0;margin-left:22px;width:380px;z-index:4}
.inmet{height:56px;border-radius:999px;border:2px solid var(--a3);display:flex;align-items:center;justify-content:center;background:var(--sh)}
.inmet .px{font-size:20px;color:var(--n5);text-shadow:1.3px 1.3px 0 var(--a2)}
.blk{position:absolute;left:39px;top:13px;width:1842px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px 19px}
.blk.static{position:relative;left:auto;top:auto}
.chipm{display:flex;align-items:center;gap:12px;height:60px;padding:0 6px 0 22px;border-radius:999px;background:var(--s1);border:2px solid var(--n1)}
.chipm .ico{color:var(--n5)}
.chipm .cmt{flex:1;min-width:0;display:flex;flex-direction:column;line-height:1.25}
.chipm .cmn{font-family:var(--font-pixel);font-weight:700;font-size:15px;text-transform:uppercase;color:var(--n5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.chipm .cmv{font-family:var(--font-pixel);font-weight:700;font-size:14px;text-transform:uppercase;color:var(--n2)}
.chipm .bd{height:48px;padding:0 14px;font-size:14px}
.chipm.pressed{border-color:var(--a3);box-shadow:0 0 0 3px rgba(253,50,134,.25)}
.ctrl{position:absolute;left:39px;top:989px;width:1842px;height:60px;display:flex;gap:6px;align-items:center}
.lpan{position:absolute;left:39px;top:154px;width:345px}
.rpan{position:absolute;left:1536px;top:154px;width:345px;display:flex;flex-direction:column;gap:12px}
.sect{display:flex;flex-direction:column;gap:8px}
.notif{background:var(--s2);border:2px solid var(--s4);border-radius:20px;padding:10px 12px;display:flex;flex-direction:column;gap:8px;position:relative}
.notif .nf{font-family:var(--font-pixel);font-weight:700;font-size:13px;text-transform:uppercase;color:var(--n2);text-align:center}
.notif .ntx{font-weight:700;font-size:14px;line-height:1.4;text-transform:uppercase;color:var(--n5)}
.notif .xbtn{position:absolute;right:8px;top:8px;width:26px;height:26px}
.notif.new{border-color:var(--a3)}
.wtag{position:absolute;z-index:6}
/* modal */
.modal{position:absolute;padding-top:53px;z-index:5}
.modal.center{left:50%;top:50%;transform:translate(-50%,-50%)}
.mtab{position:absolute;right:0;top:0;height:64px;display:flex;align-items:center;gap:14px;padding:0 18px 12px 40px;background:var(--s2);border:4px solid var(--s4);border-bottom:none;border-radius:28px 28px 0 0;max-width:100%}
.mtab .mt{font-size:24px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mbody{position:relative;background:var(--s2) repeating-linear-gradient(135deg,rgba(255,255,255,.018) 0 18px,transparent 18px 36px);border:4px solid var(--s4);border-radius:40px 0 40px 40px;padding:22px 24px 24px;display:flex;flex-direction:column;gap:18px;box-shadow:0 20px 60px rgba(0,0,0,.45)}
.msub{margin-top:-8px}
.mcont{display:flex;flex-direction:column;gap:18px}
.mfoot{border-top:2px solid var(--s4);padding-top:16px}
.mscroll{position:absolute;right:8px;top:30px;bottom:30px;width:12px}
.mscroll::before{content:"";position:absolute;left:4px;top:0;bottom:0;width:4px;border-radius:2px;background:var(--s4)}
.mscroll i{position:absolute;left:0;top:0;width:12px;height:34px;border-radius:6px;background:var(--a3)}
.modal.scroll .mbody{padding-right:40px}
.grp{display:flex;flex-direction:column;gap:12px;padding:14px;border-radius:24px;background:rgba(23,40,39,.6);border:2px solid var(--s4)}
.item{display:flex;flex-direction:column;gap:8px}
.ihead{display:flex;align-items:baseline;gap:12px;justify-content:space-between}
.ihead .lb{font-size:15px}
.ihead .sm{text-align:right}
.ill{height:260px;border-radius:24px;border:2px dashed var(--n1);display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(180deg,rgba(48,62,64,.5),rgba(13,27,26,.5));color:var(--n2);font-size:14px;font-weight:600;padding:20px}
.cards{display:grid;grid-template-columns:repeat(3,365px);gap:24px;justify-content:center}
.ccard{width:365px;display:flex;flex-direction:column;gap:12px;align-items:center;position:relative}
.ccard .cimg{width:365px;height:210px;border-radius:24px;border:3px solid var(--s4);background:url(__BG__) no-repeat;background-size:1100px auto;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}
.ccard .cn{font-weight:700;font-size:22px;text-transform:uppercase;text-align:center;line-height:1.25;color:var(--n5);min-height:56px;display:flex;align-items:center}
.ccard.hover .cimg,.ccard.pressed .cimg{border-color:var(--a3);box-shadow:0 0 18px rgba(253,50,134,.55)}
.ccard.pressed .cn{color:var(--a3)}
.ccard.choosen .cimg::after,.ccard.lock .cimg::after{content:"";position:absolute;inset:0;background:rgba(0,0,0,.65)}
.ccard.lock .cn{color:var(--n2)}
.ccard.error .cimg{border-color:var(--er)}
.ccard.error .cn{color:var(--er)}
.ccard .cbadge{position:relative;z-index:2}
.ccard .you{position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:3}
.tcards{display:grid;grid-template-columns:repeat(3,365px);gap:24px 24px;justify-content:center}
.resid{position:absolute;display:flex;flex-direction:column;align-items:center;gap:10px}
.resid svg{filter:drop-shadow(0 0 0 transparent)}
.resid.new svg .ol{stroke:var(--a3)}
.dialog{position:absolute;width:300px;background:var(--n5);color:var(--s1);border-radius:20px;padding:14px 16px;display:flex;flex-direction:column;gap:6px;box-shadow:0 10px 30px rgba(0,0,0,.4)}
.dialog::after{content:"";position:absolute;left:50%;bottom:-14px;width:24px;height:24px;background:var(--n5);transform:translateX(-50%) rotate(45deg);border-radius:4px}
.dialog .dlt{font-family:var(--font-pixel);font-weight:700;font-size:13px;text-transform:uppercase;color:var(--a1)}
.dialog .dlx{font-weight:700;font-size:16px;line-height:1.4}
.conn{position:absolute;left:50%;top:160px;transform:translateX(-50%);z-index:6}
.graph text.gtx{fill:var(--n2);font:600 13px var(--font-ui)}
.scr-label{position:absolute;right:40px;bottom:12px;font-size:12px;color:rgba(255,255,255,.35);font-weight:600}
"""
CSS += r"""
.chip.csm{height:38px;font-size:13px;padding:0 14px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.lbrow{min-height:50px}
"""
CSS += r"""
.kpirow .kn{font-size:11.5px;overflow-wrap:normal;hyphens:auto}
.kpirow .bd-s{padding:0 7px;font-size:12px}
"""
