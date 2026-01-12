import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

interface OperationResult<T = void> {
  success: boolean,
  message?: string,
  data?: T
};

export const success = <K = void>(message: string = "", data?: K) : OperationResult<K> => {
  return {
    success: true,
    message,
    data
  }; 
};

export const error = <K = void>(message: string = "Error Occured!", data?: K) => {
  return {
    success: false,
    message,
    data
  }; 
};

export function getOperationFunctions<K = void>() {
  return {
    success: success<K>,
    error: error<K>
  };
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
