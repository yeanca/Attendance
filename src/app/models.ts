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

export interface AuthUser{
  id: string;
  email: string;
  displayName: string;
  role: string;
}

export interface UserSummary {
  name: string;
  totalAttendance: number;
  totalLate: number;
}