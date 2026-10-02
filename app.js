// app.js — تشغيل اللوحة وربط كل الأزرار (آخر ملف بيتحمّل)

// ---------- عرض الصفحة الحالية ----------
function renderPage(status = '') {
  const isDash = currentPage === 'dash';
  const pageTitle = PAGES.find((p) => p[0] === currentPage)[1];

  $('#sub').textContent = isDash ? 'ملخص الأداء اليوم' : pageTitle;
  $('#q').placeholder = 'ابحث في ' + (isDash ? 'الطلبات' : pageTitle);

  $('#view').innerHTML = isDash
    ? buildDashboard()
    : buildTable(currentPage, $('#q').value, status);
}

// ---------- الضغط جوه منطقة المحتوى ----------
$('#view').addEventListener('click', (e) => {
  // زر تغيير الفترة (7 أيام / 30 يوم)
  if (e.target.id === 'range') {
    currentRange = currentRange === 'week' ? 'month' : 'week';
    renderPage();
    return;
  }

  // الضغط على نقطة في الرسم البياني: اعرض قيمتها
  const point = e.target.closest('.pt');
  if (point) {
    const data = currentRange === 'week' ? WEEK : MONTH;
    const i = Number(point.dataset.i);
    $('#tip').textContent = `${data.labels[i]}: ${data.vals[i]},000 ج.م`;
    return;
  }

  // أزرار تعديل / حذف
  if (e.target.dataset.action) {
    showToast(e.target.dataset.action + ' — تم بنجاح');
    return;
  }

  // أي كارت أو صف ليه data-go: افتح صفحته
  const link = e.target.closest('[data-go]');
  if (link) goTo(link.dataset.go, link.dataset.st || '');
});

// ---------- البحث ----------
$('#q').addEventListener('input', () => {
  // لو بدأ يكتب وهو في الرئيسية، وديه صفحة الطلبات
  if (currentPage === 'dash') {
    if (!$('#q').value) return;
    currentPage = 'orders';
    renderNav();
  }
  renderPage();
});

// ---------- الإشعارات ----------
$('#drop').innerHTML = NOTES.map((n) => `<div>${n}</div>`).join('');

$('#bell').addEventListener('click', (e) => {
  e.stopPropagation();
  $('#drop').classList.toggle('show');
  $('#badge').style.display = 'none';      // اخفي الرقم بعد ما يشوفها
});

$('#drop').addEventListener('click', (e) => {
  if (e.target.tagName === 'DIV') {
    showToast('تم فتح الإشعار');
    $('#drop').classList.remove('show');
  }
});

// الضغط في أي مكان تاني يقفل القائمة
document.addEventListener('click', () => $('#drop').classList.remove('show'));

// ---------- تشغيل ----------
renderNav();
renderPage();