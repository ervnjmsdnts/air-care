import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toPhp(value: string | number) {
  const price = parseFloat(value.toString());

  const formatted = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(price);

  return formatted;
}

export function toTitleCase(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function truncateString(str: string, maxLength: number) {
  if (str.length <= maxLength) {
    return str; // Return the original string if it's already shorter or equal to maxLength.
  } else {
    return str.slice(0, maxLength) + '...'; // Truncate the string and append an ellipsis.
  }
}
