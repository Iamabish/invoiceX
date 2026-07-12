

export function getPasswordStrength(value: string) {
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value) && /[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value) && value.length >= 12) score++;

  if (score === 0) return { score: 1, label: "Weak", color: "bg-ix-status-overdue" };
  if (score === 1) return { score: 1, label: "Weak", color: "bg-ix-status-overdue" };
  if (score === 2) return { score: 2, label: "Okay", color: "bg-amber-400" };
  return { score: 3, label: "Strong", color: "bg-ix-status-paid" };
}

