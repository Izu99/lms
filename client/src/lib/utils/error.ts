import { AxiosError } from 'axios';

// Type guard to check if error is an AxiosError
export function isAxiosError(error: unknown): error is AxiosError<{ message: string }> {
  return (error as AxiosError).isAxiosError !== undefined;
}
