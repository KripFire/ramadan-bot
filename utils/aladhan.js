const fetch = require('node-fetch');

const BASE = 'http://api.aladhan.com/v1';

/**
 * Formate une date JS en DD-MM-YYYY pour l'API
 */
function formatDate(date = new Date()) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
}

/**
 * Récupère les horaires de prière pour une ville et une date
 */
async function getPrayerTimes(city, country, date = null, method = 12) {
  const d = date || formatDate();
  const url = `${BASE}/timingsByCity/${d}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  return json.code === 200 ? json.data : null;
}

/**
 * Convertit une date grégorienne en date hijri
 */
async function gregorianToHijri(date = null) {
  const d = date || formatDate();
  const url = `${BASE}/gToH/${d}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  return json.code === 200 ? json.data : null;
}

/**
 * Récupère le calendrier du mois de Ramadan en cherchant dans les mois
 * grégoriens qui contiennent Ramadan (le mois 9 hijri peut chevaucher 2 mois).
 */
async function getRamadanCalendar(hijriYear, city, country, method = 12) {
  // 1. Trouver les dates grégor. du 1er Ramadan et du 1er Chawwal
  const [startData, endData] = await Promise.all([
    hijriToGregorian(1, 9, hijriYear),
    hijriToGregorian(1, 10, hijriYear),
  ]);
  if (!startData || !endData) return null;

  const [, sMonth, sYear] = startData.gregorian.date.split('-').map(Number); // DD-MM-YYYY
  const [, eMonth, eYear] = endData.gregorian.date.split('-').map(Number);

  // 2. Collecter les mois grégoriens à interroger (1 ou 2 mois)
  const monthsToFetch = [];
  monthsToFetch.push({ year: sYear, month: sMonth });
  if (eMonth !== sMonth || eYear !== sYear) {
    monthsToFetch.push({ year: eYear, month: eMonth });
  }

  // 3. Fetcher chaque mois et fusionner
  const allDays = [];
  for (const { year, month } of monthsToFetch) {
    const url = `${BASE}/calendarByCity/${year}/${month}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`;
    const res = await fetch(url);
    if (!res.ok) continue;
    const json = await res.json();
    if (json.code !== 200 || !Array.isArray(json.data)) continue;
    // Garder uniquement les jours en Ramadan (mois hijri = 9)
    const ramadanDays = json.data.filter(d => parseInt(d.date.hijri.month.number) === 9);
    allDays.push(...ramadanDays);
  }

  return allDays.length > 0 ? allDays : null;
}

/**
 * Convertit une date hijri en grégorienne
 */
async function hijriToGregorian(day, month, year) {
  const url = `${BASE}/hToG/${day}-${month}-${year}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  return json.code === 200 ? json.data : null;
}

/**
 * Récupère l'année hijri courante
 */
async function getCurrentHijriYear() {
  const data = await gregorianToHijri();
  if (!data) return null;
  return parseInt(data.hijri.year);
}

/**
 * Calcule si on est actuellement en Ramadan
 * Retourne { inRamadan, hijriDay, hijriYear }
 */
async function checkRamadan() {
  const data = await gregorianToHijri();
  if (!data) return null;
  const month = parseInt(data.hijri.month.number);
  const day   = parseInt(data.hijri.day);
  const year  = parseInt(data.hijri.year);
  return {
    inRamadan: month === 9,
    hijriMonth: month,
    hijriDay: day,
    hijriYear: year,
    hijriData: data.hijri,
  };
}

/**
 * Trouve la date grégorienne du 1er Ramadan d'une année hijri
 */
async function getRamadanStart(hijriYear) {
  return hijriToGregorian(1, 9, hijriYear);
}

/**
 * Trouve la date grégorienne du 1er Shawwal (Aïd el-Fitr)
 */
async function getEidDate(hijriYear) {
  return hijriToGregorian(1, 10, hijriYear);
}

module.exports = {
  getPrayerTimes,
  gregorianToHijri,
  getRamadanCalendar,
  hijriToGregorian,
  getCurrentHijriYear,
  checkRamadan,
  getRamadanStart,
  getEidDate,
  formatDate,
};
