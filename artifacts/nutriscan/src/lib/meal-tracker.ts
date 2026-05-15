import type { ScanResult } from "@workspace/api-client-react";

export interface DailyTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const STORAGE_KEY = "nutriscan_meals_";
export const DAILY_CALORIE_GOAL = 2000;

function getTodayKey() {
  const date = new Date();
  return `${STORAGE_KEY}${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function parseGrams(value: string | undefined): number {
  if (!value) return 0;
  const match = value.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

export function getDailyTotals(): DailyTotals {
  try {
    const key = getTodayKey();
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data) as DailyTotals;
    }
  } catch (e) {
    console.error("Failed to parse daily totals", e);
  }
  return { calories: 0, protein: 0, carbs: 0, fat: 0 };
}

export function addMeal(scan: ScanResult) {
  const totals = getDailyTotals();
  
  totals.calories += scan.calories || 0;
  totals.protein += parseGrams(scan.protein);
  totals.carbs += parseGrams(scan.carbs);
  totals.fat += parseGrams(scan.fat);

  localStorage.setItem(getTodayKey(), JSON.stringify(totals));
  
  // Dispatch custom event to notify components of local storage update
  window.dispatchEvent(new Event("meal-added"));
  return totals;
}
