// tables.js — صفحات الجداول (الطلبات، المنتجات، العملاء...) مع البحث

function buildTable(pageKey, searchText = '', status = '') {
  const [headers, rows] = TABLES[pageKey];
  const pageTitle = PAGES.find((p) => p[0] === pageKey)[1];

  // الفلتر: اللي كتبه في البحث، أو حالة الطلب اللي ضغط عليها
  const filter = (searchText || status).trim();
  const result = rows.filter((row) => !filter || row.join(' ').includes(filter));

  if (result.length === 0) {
    return `<div class="card"><h3>${pageTitle} <span class="tag">0</span></h3><div class="empty">لا توجد نتائج</div></div>`;
  }

  const headHtml = headers.map((h) => `<th>${h}</th>`).join('') + '<th></th>';

  const bodyHtml = result.map((row) => {
    const cells = row.map((cell) => `<td>${cell}</td>`).join('');
    const buttons = `<td><button class="act" data-action="تعديل">تعديل</button><button class="act" data-action="حذف">حذف</button></td>`;
    return `<tr>${cells}${buttons}</tr>`;
  }).join('');

  return `
    <div class="card">
      <h3>${pageTitle} <span class="tag">${result.length}</span></h3>
      <table><tr>${headHtml}</tr>${bodyHtml}</table>
    </div>`;
}