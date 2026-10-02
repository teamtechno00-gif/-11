// dashboard.js — الصفحة الرئيسية (الكروت + الرسم البياني + الأشرطة + القوائم)

// ---------- الرسم البياني ----------
function buildChart() {
  const data = currentRange === 'week' ? WEEK : MONTH;

  // أبعاد الرسم والهوامش
  const W = 640, H = 250;
  const padLeft = 50, padRight = 20, padTop = 14, padBottom = 34;
  const minVal = 24, maxVal = 52;

  // تحويل رقم المبيعات لمكان على الشاشة (RTL: أول يوم على اليمين)
  const getX = (i) => padRight + (W - padLeft - padRight) * (1 - i / (data.vals.length - 1));
  const getY = (v) => padTop + (H - padTop - padBottom) * (1 - (v - minVal) / (maxVal - minVal));

  const points = data.vals.map((v, i) => ({ x: getX(i), y: getY(v) }));

  // الخط المنحني بين النقاط
  let path = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    const midX = (prev.x + cur.x) / 2;
    path += ` C${midX},${prev.y} ${midX},${cur.y} ${cur.x},${cur.y}`;
  }

  // المنطقة الملوّنة تحت الخط
  const last = points[points.length - 1];
  const first = points[0];
  const area = `${path} L${last.x},${H - padBottom} L${first.x},${H - padBottom} Z`;

  // خطوط الشبكة وأرقام المحور
  let grid = '';
  [28, 32, 36, 40, 44, 48].forEach((v) => {
    grid += `<line x1="${W - padLeft + 5}" x2="${padRight}" y1="${getY(v)}" y2="${getY(v)}" stroke="var(--line)"/>`;
    grid += `<text x="${W - padLeft + 12}" y="${getY(v) + 4}">${v}k</text>`;
  });

  // أسماء الأيام
  let labels = '';
  data.labels.forEach((name, i) => {
    labels += `<text x="${getX(i)}" y="${H - 10}" text-anchor="middle">${name}</text>`;
  });

  // النقاط (بتتضغط وتظهر القيمة)
  let dots = '';
  points.forEach((p, i) => {
    dots += `<circle class="pt" cx="${p.x}" cy="${p.y}" r="5" fill="var(--gold)" data-i="${i}"/>`;
  });

  return `
    <svg viewBox="0 0 ${W} ${H}" width="100%">
      ${grid}
      <path d="${area}" fill="var(--gold)" opacity=".18"/>
      <path d="${path}" fill="none" stroke="var(--gold)" stroke-width="2.5"/>
      ${labels}
      ${dots}
      <text class="tip" id="tip" x="${W / 2}" y="12" text-anchor="middle"></text>
    </svg>`;
}

// ---------- الصفحة الرئيسية كلها ----------
function buildDashboard() {
  // 1) كروت الأرقام
  let kpiHtml = '';
  KPIS.forEach(([title, value, change, target]) => {
    const cls = change > 0 ? 'up' : 'down';
    const sign = change > 0 ? '+' : '';
    kpiHtml += `
      <div class="card kpi" data-go="${target}">
        <div class="h"><span>${title}</span></div>
        <b>${value}</b>
        <span class="${cls}">${sign}${change}% عن أمس</span>
      </div>`;
  });

  // 2) شرائط المبيعات حسب القسم
  let catsHtml = '';
  CATS.forEach(([name, percent], i) => {
    const color = i === 3 ? 'background:var(--gold)' : '';   // "هدايا" ذهبي للتمييز
    catsHtml += `
      <div class="bar" data-go="cats">
        <div class="l"><span>${name}</span><span>${percent}%</span></div>
        <div class="t"><div class="f" style="width:${percent * 2.2}%;${color}"></div></div>
      </div>`;
  });

  // 3) الأكثر مبيعًا
  let topHtml = '';
  TOP.forEach(([name, count]) => {
    topHtml += `<div class="row" data-go="products"><span>${name}</span><span>${count} قطعة</span></div>`;
  });

  // 4) حالة الطلبات اليوم
  let statusHtml = '';
  STATUS.forEach(([name, count, color]) => {
    statusHtml += `
      <div class="row" data-go="orders" data-st="${name}">
        <span><i class="dot" style="background:${color}"></i>${name}</span>
        <span>${count}</span>
      </div>`;
  });

  const rangeText = currentRange === 'week' ? 'آخر 7 أيام' : 'آخر 30 يوم';

  return `
    <div class="grid g4">${kpiHtml}</div>

    <div class="grid g2">
      <div class="card"><h3>المبيعات حسب القسم</h3>${catsHtml}</div>
      <div class="card">
        <div class="ch">
          <h3>المبيعات خلال الأسبوع</h3>
          <button class="sel" id="range">${rangeText} ▾</button>
        </div>
        ${buildChart()}
      </div>
    </div>

    <div class="grid g2b">
      <div class="card"><h3>الأكثر مبيعًا</h3>${topHtml}</div>
      <div class="card"><h3>حالة الطلبات اليوم</h3>${statusHtml}</div>
    </div>`;
}