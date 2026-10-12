export interface FormValues {
  taskId: number | null;
  comment: string;
  date: string;
  start: string;
  end: string;
  duration: string;
}

export type FormField = keyof FormValues;

export type FormErrors = Partial<Record<FormField, string>>;
