import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import type { Task } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function compareArrays(arr1: Task[], arr2: Task[]): Task[] {
  return arr1
    .map(item1 => {
      const item2 = arr2.find(item => item.id === item1.id)
      return item2 && item1.order_number !== item2.order_number
        ? { ...item1, order_number: item2.order_number }
        : undefined
    })
    .filter((item): item is Task => item !== undefined)
}
