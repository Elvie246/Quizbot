export interface UserCreditsSummary {
  mode: 'authenticated';
  balance: number;
  costPerQuiz: number;
  canGenerate: boolean;
}

export interface GuestCreditsSummary {
  mode: 'guest';
  dailyLimit: number;
  used: number;
  remaining: number;
  canGenerate: boolean;
  resetAt: string;
}
