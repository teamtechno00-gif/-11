// utils.js — أدوات صغيرة بنستخدمها في كل الملفات + الحالة العامة

// اختصار document.querySelector
const $ = (selector) => document.querySelector(selector);

// الحالة العامة: الصفحة المفتوحة دلوقتي وفترة الرسم البياني
let currentPage = 'dash';
let currentRange = 'week';   // 'week' أو 'month'

// بترجع أيقونة SVG جاهزة من الأيقونات اللي في data.js
function icon(name, size = 20) {
  return `<svg viewBox="0 0 24 24" style="width:${size}px;height:${size}px;stroke:currentColor;fill:none;stroke-width:1.7">${ICONS[name]}</svg>`;
}

// بتظهر رسالة صغيرة تحت الشاشة وتختفي لوحدها
function showToast(text) {
  const toast = $('#toast');
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
}