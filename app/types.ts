export type Status = 'success' | 'fail' | 'none';

export interface Entry {
  date: string; // ISO format date string (YYYY-MM-DD)
  status: Status;
}

export interface Habit {
  id: string;
  name: string;
  entries: Record<string, Status>; // date string -> Status
}

export interface HabitState {
  habits: Habit[];
}
