export interface User {
  // userId: string;
  email: string;
  displayName: string;
  // password: string;
  // role: string;
}
export interface SignIn {
  id?: string;
  name: string;
  timestamp?: string;
  timeout?: string;
  late?: boolean;
}

export interface UserSummary {
  name: string;
  totalAttendance: number;
  totalLate: number;
}