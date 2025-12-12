import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Format product name to proper title case
// "WIRELESS HEADPHONES" -> "Wireless Headphones"
// "nike air max" -> "Nike Air Max"
export function formatProductName(name) {
  if (!name) return ''
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Format currency to NRS
export function formatPrice(price) {
  if (!price && price !== 0) return 'Rs. 0'
  return `Rs. ${Number(price).toLocaleString()}`
}
