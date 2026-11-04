# -*- coding: utf-8 -*-
# UI primitives that mimic the Figma kit «Коты – Мэр» (tokens from 1.5 «Поведение интерфейса»)
import html as _h

def e(s):
    return _h.escape(str(s))

def st(**kw):
    out = []
    for k, v in kw.items():
        if v is None:
            continue
        k = k.replace('_', '-')
        if isinstance(v, (int, float)):
            v = f'{v}px'
        out.append(f'{k}:{v}')
    return ' style="' + ';'.join(out) + '"' if out else ''

def div(cls, inner='', **kw):
    return f'<div class="{cls}"{st(**kw)}>{inner}</div>'

# ---------- text ----------
def px(s, size=16, cls='', **kw):
    return f'<span class="px {cls}"{st(font_size=size, **kw)}>{e(s)}</span>'

def h1(s, size=24, cls=''):
    return f'<div class="h1 px {cls}"{st(font_size=size)}>{e(s)}</div>'

def h2(s, size=18, cls=''):
    return f'<div class="h2 px {cls}"{st(font_size=size)}>{e(s)}</div>'

def h3(s, size=20, cls=''):
    return f'<div class="h3 {cls}"{st(font_size=size)}>{e(s)}</div>'

def lb(s, size=16, cls=''):
    return f'<div class="lb {cls}"{st(font_size=size)}>{e(s)}</div>'

def sm(s, size=13, cls='', **kw):
    return f'<div class="sm {cls}"{st(font_size=size, **kw)}>{e(s)}</div>'

def p(s, size=16, cls=''):
    return f'<div class="pt {cls}"{st(font_size=size)}>{e(s)}</div>'

def row(*items, gap=16, cls='', ai='center', jc=None, **kw):
    return f'<div class="row {cls}"{st(gap=gap, align_items=ai, justify_content=jc, **kw)}>' + ''.join(items) + '</div>'

def col(*items, gap=12, cls='', ai=None, **kw):
    return f'<div class="col {cls}"{st(gap=gap, align_items=ai, **kw)}>' + ''.join(items) + '</div>'

def sp():
    return '<div class="spacer"></div>'

# ---------- icons (simple pixel glyphs as inline svg) ----------
def ico(name, size=20, color='currentColor'):
    paths = {
        'up': '<path d="M5 1h2v2h2v2h2v2H1V5h2V3h2z"/>',
        'down': '<path d="M1 3h10v2H9v2H7v2H5V7H3V5H1z"/>',
        'close': '<path d="M1 1h2v2h2v2h2V3h2V1h2v2H9v2H7v2h2v2h2v2H9V9H7V7H5v2H3v2H1V9h2V7h2V5H3V3H1z"/>',
        'back': '<path d="M5 2h2v2H5v1h6v2H5v1h2v2H5V8H3V6H1V5h2V4h2z"/>',
        'check': '<path d="M9 2h2v2H9v2H7v2H5v2H3V8H1V6h2v2h2V6h2V4h2z"/>',
        'warn': '<path d="M5 0h2v7H5zM5 9h2v2H5z"/>',
        'clock': '<path d="M4 0h4v1H4zM2 1h2v1H2zM8 1h2v1H8zM1 2h1v2H1zM10 2h1v2h-1zM0 4h1v4H0zM11 4h1v4h-1zM1 8h1v2H1zM10 8h1v2h-1zM2 10h2v1H2zM8 10h2v1H8zM4 11h4v1H4zM5 3h1v3h2v1H5z"/>',
        'pause': '<path d="M2 1h3v10H2zM7 1h3v10H7z"/>',
        'q': '<path d="M3 1h6v1h1v3H9v1H7v2H5V5h2V4h1V3H4v1H2V2h1zM5 9h2v2H5z"/>',
        'copy': '<path d="M3 0h8v8H9V2H3zM0 3h8v9H0z"/>',
        'eye': '<path d="M3 3h6v1h2v1h1v2h-1v1H9v1H3V8H1V7H0V5h1V4h2zm2 2v2h2V5z"/>',
        'person': '<path d="M4 0h4v4H4zM2 5h8v4H8v3H4V9H2z"/>',
        'city': '<path d="M1 4h3v8H1zM5 1h3v11H5zM9 6h3v6H9z"/>',
        'coin': '<path d="M3 0h6v1h2v2h1v6h-1v2H9v1H3v-1H1V9H0V3h1V1h2zm2 3v6h2V3z"/>',
        'gear': '<path d="M5 0h2v2h2V1h1v2H9v2h3v2H9v2h1v2H9v-1H7v2H5v-2H3v1H2V9h1V7H0V5h3V3H2V1h1v1h2z"/>',
        'doc': '<path d="M1 0h7l3 3v9H1zm2 5v1h6V5zm0 3v1h6V8z"/>',
        'shop': '<path d="M0 2h12v3H0zM1 6h10v6H7V9H5v3H1z"/>',
        'bulb': '<path d="M3 0h6v1h1v5H9v2H3V6H2V1h1zM4 9h4v1H4zM5 11h2v1H5z"/>',
        'people': '<path d="M1 0h3v3H1zM8 0h3v3H8zM0 4h5v5H4v3H1V9H0zM7 4h5v5h-1v3H8V9H7z"/>',
        'factory': '<path d="M0 5l4-2v2l4-2v2l2-1V0h2v12H0z"/>',
        'smile': '<path d="M3 0h6v1h2v2h1v6h-1v2H9v1H3v-1H1V9H0V3h1V1h2zM3 4v2h2V4zm4 0v2h2V4zM3 7v1h1v1h4V8h1V7H8v1H4V7z"/>',
    }
    return f'<svg class="ico" width="{size}" height="{size}" viewBox="0 0 12 12" fill="{color}" shape-rendering="crispEdges">{paths.get(name, paths["coin"])}</svg>'

# ---------- buttons, chips ----------
def btn(label, kind='p', state='', w=None, icon=None, err=None, cls=''):
    k = {'p': 'btn-p', 's': 'btn-s', 'a': 'btn-a', 'l': 'btn-l'}[kind]
    ic = ico(icon, 16) if icon else ''
    b = f'<div class="btn {k} {state} {cls}"{st(width=w)}>{ic}<span>{e(label)}</span></div>'
    if err:
        b = col(b, f'<div class="errtxt">{e(err)}</div>', gap=6, ai='stretch')
    return b

def xbtn(state=''):
    return f'<div class="xbtn {state}">{ico("close", 12)}</div>'

def chip(label, state='', cls=''):
    return f'<div class="chip {state} {cls}"><span>{e(label)}</span></div>'

def tool(label, summ='0 р.', state=''):
    """Chip_secondary – кнопка инструмента на S-08 с суммой, применённой в этом ходу"""
    return f'<div class="tool {state}"><span class="tl px">{e(label)}</span><span class="ts px">{e(summ)}</span></div>'

def qbtn(state=''):
    return f'<div class="qbtn {state}">{ico("q", 14)}</div>'

# ---------- badges ----------
def badge(text, kind='pink', size='s', arrow=None, cls=''):
    a = ico('up' if arrow == 'up' else 'down', 11) if arrow else ''
    return f'<span class="bd bd-{kind} bd-{size} {cls}">{a}<span>{e(text)}</span></span>'

def chg(text, up=True, kind='white'):
    if text is None:
        return ''
    return badge(text, kind, 's', 'up' if up else 'down', 'chg')

def tag(team, own=False):
    return badge(team, 'tagown' if own else 'tag', 's')

# ---------- rows ----------
def kpirow(name, val, ch, zone='y', up=True, state=''):
    return (f'<div class="kpirow z-{zone} {state}"><span class="kn">{e(name)}</span>'
            f'<span class="kv">{e(val)}</span>{chg(ch, up)}</div>')

def mrow(name, val, ch=None, up=True, cls=''):
    return (f'<div class="mrow {cls}"><span class="mn">{e(name)}</span>'
            f'<span class="mv">{e(val)}</span>{chg(ch, up) if ch else ""}</div>')

def lbrow(pos, team, pts, ch=None, up=True, own=False, nc=False, extra=None):
    n = badge('нет связи', 'err', 's') if nc else ''
    ex = f'<span class="lbx">{e(extra)}</span>' if extra else ''
    c = chg(ch, up) if ch else '<span class="chg-empty"></span>'
    return (f'<div class="lbrow {"own" if own else ""}"><span class="lbp px">{pos}</span>{tag(team, own)}{n}'
            f'<span class="spacer"></span>{ex}<span class="lbv">{e(pts)}</span>{c}</div>')

def docrow(rnd, team, text, own=False, kind=None):
    t = badge(team, 'tagown' if own else 'tag', 's') if kind != 'city' else badge(team, 'city', 's')
    return f'<div class="docrow">{badge("Р" + str(rnd), "dark", "s")}{t}<div class="dt">{e(text)}</div></div>'

# ---------- controls ----------
def slider(value, pct=40, state='', applied=None, preds=None, w=None, errtext='Недостаточно бюджета', auto=None):
    ap = f'<div class="sl-ap" style="width:{applied}%"></div>' if applied is not None else ''
    pr = ''
    if state in ('pressed', 'hover') and preds:
        pr = f'<div class="sl-pred" style="--p:{pct}%">' + ''.join(badge(v + ' ' + l, 'pink', 's') for l, v in preds[:2]) + '</div>'
    err = f'<div class="errtxt">{e(errtext)}</div>' if state == 'error' else ''
    if auto:
        err += badge(auto, 'accent', 's', cls='auto')
    return (f'<div class="slw {state}"{st(width=w)}><div class="sl"><div class="sl-tr">{ap}<div class="sl-fill" style="width:{pct}%"></div>'
            f'<div class="sl-kn" style="left:{pct}%"></div>{pr}</div><span class="sl-v px">{e(value)}</span></div>{err}</div>')

def stepper(value, state='', small=False, err=None):
    c = 'stp-s' if small else 'stp'
    er = f'<div class="errtxt">{e(err)}</div>' if err else ''
    return (f'<div class="stpw"><div class="{c} {state}"><span class="sb minus">−</span><span class="sv px">{e(value)}</span>'
            f'<span class="sb plus">+</span></div>{er}</div>')

def seg(sel=0, state='', labels=('среднее', 'выше среднего', 'высокое')):
    items = ''.join(f'<span class="sg {"on" if i == sel else ""}">{e(l)}</span>' for i, l in enumerate(labels))
    er = '<div class="errtxt">Недостаточно бюджета</div>' if state == 'error' else ''
    return f'<div class="segw"><div class="seg {state}">{items}</div>{er}</div>'

def switch(on=False, state=''):
    return f'<div class="sw {"on" if on else ""} {state}"><span></span></div>'

def inp(text, state='', err=None, ph=False, w=None, icon=None):
    er = f'<div class="errtxt">{e(err)}</div>' if err else ''
    ic = ico(icon, 16, '#4C5152') if icon else ''
    return (f'<div class="inpw"{st(width=w)}><div class="inp {state} {"ph" if ph else ""}"><span>{e(text)}</span>'
            f'{"<i class=caret></i>" if state == "focus" else ""}{ic}</div>{er}</div>')

def code(chars, state='', err=None, show=False):
    cells = ''.join(f'<span class="cc px">{e(c)}</span>' for c in chars)
    er = f'<div class="errtxt">{e(err)}</div>' if err else ''
    return f'<div class="codew"><div class="code {state} {"show" if show else ""}">{cells}</div>{er}</div>'

def timer(t, rnd, expiring=False):
    i = ico('warn' if expiring else 'clock', 34)
    return f'<div class="timer {"exp" if expiring else ""}">{i}<span class="tt px">{e(t)}</span>{badge(rnd, "pink", "m")}</div>'

def roundpill(rnd):
    return badge(rnd, 'pink', 'm')

ORDER = [('mig', 'мигр', 'миграция'), ('edu', 'обр', 'образование'), ('biz', 'биз', 'бизнес'),
         ('urb', 'град', 'градострой'), ('trn', 'транс', 'транспорт'), ('tur', 'тур', 'туризм')]

def turn(cur, mine=True, nc=None, solo=False, done_all=False):
    """UI-16 Turn_panel. cur – индекс текущего комитета"""
    parts = [f'<span class="tp-me px {"on" if mine else ""}">{"ваш ход" if not solo else "ход"}</span>']
    for i, (cid, short, full) in enumerate(ORDER):
        ncb = badge('нет связи', 'err', 's') if nc == i else ''
        if i < cur or done_all:
            parts.append(f'<span class="tp-i done">{ico("check", 12)}{e(short)}{ncb}</span>')
        elif i == cur:
            parts.append(f'<span class="tp-i cur"><b class="px">{i + 1}</b><span class="tp-c">{e(full)}</span>{ncb}</span>')
        else:
            parts.append(f'<span class="tp-i next">{e(short)}{ncb}</span>')
    return '<div class="turn">' + ''.join(parts) + '</div>'

def event_ind(name=None, more=0, state=''):
    if not name:
        return f'<div class="evi dis"><span class="evq">!</span><span class="evt">активных событий нет</span></div>'
    m = badge(f'+{more}', 'accent', 's') if more else ''
    return f'<div class="evi act {state}"><span class="evq">!</span><span class="evt">{e(name)}</span>{m}</div>'

def budget(v, start, plan, tip=False):
    t = ''
    if tip:
        t = div('qtip budget-tip', sm('Состав бюджета на начало хода', 13, 'tip-h') + ''.join(
            row(sm(a, 13, 'tip-l'), sp(), sm(b, 13, 'tip-v'), gap=8) for a, b in
            [('Остаток прошлого раунда', '1,80 млрд ₽'), ('Доля от налоговых сборов', '8,20 млрд ₽'),
             ('Платеж по совместным инвестициям', '−0,40 млрд ₽'), ('Come-back-бонус', '+0,40 млрд ₽')]))
    return (f'<div class="budget-w">{t}<div class="budget"><span class="px">{e(v)}</span></div>'
            f'<div class="bd bd-pink bd-row"><span>бюджет комитета</span><span class="spacer"></span><span>{e(start)}</span></div>'
            f'<div class="bd bd-white bd-row"><span>запланировано на этом ходу</span><span class="spacer"></span><span>{e(plan)}</span></div></div>')

def inmet(label, v):
    return col(sm(label, 13), f'<div class="inmet"><span class="px">{e(v)}</span></div>', gap=6)

def graph(w=472, h=240, lines=1, labels=None, seed=1):
    import random
    r = random.Random(seed)
    n = len(labels) if labels else 7
    labels = labels or ['Старт', 'Р1', 'Р2', 'Р3', 'Р4', 'Р5', 'Р6']
    pad_l, pad_b, pad_t = 56, 28, 12
    gw, gh = w - pad_l - 16, h - pad_b - pad_t
    svg = [f'<svg class="graph" width="{w}" height="{h}" viewBox="0 0 {w} {h}">']
    for i in range(5):
        y = pad_t + gh * i / 4
        val = int(2000 - 500 * i)
        svg.append(f'<line x1="{pad_l}" y1="{y:.1f}" x2="{w - 16}" y2="{y:.1f}" stroke="#303E40" stroke-dasharray="4 4"/>')
        svg.append(f'<text x="{pad_l - 10}" y="{y + 5:.1f}" text-anchor="end" class="gtx">{val:,}'.replace(',', ' ') + '</text>')
    for i, l in enumerate(labels):
        x = pad_l + gw * i / (n - 1)
        svg.append(f'<text x="{x:.1f}" y="{h - 8}" text-anchor="middle" class="gtx">{e(l)}</text>')
    cols = ['#FD3286', '#F2F2F2', '#9D9D9D']
    for L in range(lines):
        v = 0.3 + r.random() * 0.2
        pts = []
        for i in range(n):
            v = min(0.95, max(0.08, v + (r.random() - 0.4) * 0.22))
            pts.append((pad_l + gw * i / (n - 1), pad_t + gh * (1 - v)))
        d = ' '.join(f'{x:.1f},{y:.1f}' for x, y in pts)
        if L == 0:
            svg.append(f'<defs><linearGradient id="gg{seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FD3286" stop-opacity=".55"/><stop offset="1" stop-color="#FD3286" stop-opacity="0"/></linearGradient></defs>')
            svg.append(f'<polygon points="{pad_l},{pad_t + gh} {d} {pts[-1][0]:.1f},{pad_t + gh}" fill="url(#gg{seed})"/>')
        svg.append(f'<polyline points="{d}" fill="none" stroke="{cols[L % 3]}" stroke-width="3"/>')
        lx, ly = pts[-1]
        svg.append(f'<rect x="{lx - 5:.1f}" y="{ly - 5:.1f}" width="10" height="10" fill="{cols[L % 3]}"/>')
    svg.append('</svg>')
    return ''.join(svg)

# ---------- containers ----------
def panel(inner, cls='', **kw):
    return f'<div class="pnl {cls}"{st(**kw)}>{inner}</div>'

def modal(title, body, w=800, close=True, footer='', sub=None, cls='', pos='center', x=None, y=None, scroll=False):
    t = f'<div class="mtab"><span class="h1 px mt">{e(title)}</span>{xbtn() if close else ""}</div>'
    s = sm(sub, 13, 'msub') if sub else ''
    f = f'<div class="mfoot">{footer}</div>' if footer else ''
    sc = '<div class="mscroll"><i></i></div>' if scroll else ''
    style = st(width=w, left=x, top=y)
    pc = 'center' if pos == 'center' and x is None else ''
    return f'<div class="modal {pc} {cls}"{style}>{t}<div class="mbody">{sc}{s}<div class="mcont">{body}</div>{f}</div></div>'

def foot(total=None, rest=None, primary='применить', pstate='', secondary='отмена', extra=''):
    left = row(btn(primary, 'p', pstate), btn(secondary, 's') if secondary else '', extra, gap=12)
    right = ''
    if total is not None or rest is not None:
        r = []
        if total is not None:
            r.append(col(sm('итого к оплате', 13), px(total, 20, 'pink'), gap=2))
        if rest is not None:
            r.append(col(sm('остаток хода', 13), px(rest, 20), gap=2))
        right = row(*r, gap=32)
    return row(left, sp(), right, gap=24)

def preds(items):
    if not items:
        return ''
    return '<div class="preds">' + ''.join(f'<span class="pred"><span class="pl">{e(l)}</span>{badge(v, "pink", "s")}</span>' for l, v in items) + '</div>'
