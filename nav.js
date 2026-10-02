// nav.js — الشريط الجانبي والانتقال بين الصفحات

// بترسم أزرار الشريط الجانبي وبتعلّم الصفحة المفتوحة
function renderNav() {
  let html = '';

  PAGES.forEach(([key, title]) => {
    const active = key === currentPage ? 'on' : '';
    html += `<button class="nav ${active}" data-page="${key}">${icon(key)}${title}</button>`;
  });

  $('#nav').innerHTML = html;
}

// بتفتح صفحة معينة (وممكن نفلتر بحالة طلب)
function goTo(page, status = '') {
  currentPage = page;
  $('#q').value = '';
  renderNav();
  renderPage(status);
  $('#drop').classList.remove('show');   // اقفل قائمة الإشعارات
}

// لما أضغط على أي تبويب
$('#nav').addEventListener('click', (e) => {
  const button = e.target.closest('.nav');
  if (button) goTo(button.dataset.page);
});