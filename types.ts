
export interface Voucher {
  id: string;
  title: string;
  description: string;
  cost: number;
  unlocked: boolean;
  used: boolean;
  icon: string;
}

export interface LoveTask {
  id: string;
  text: string;
  reward: number;
  completed: boolean;
}

export interface UserStats {
  points: number;
  lastCheckIn: string | null;
  totalCheckIns: number;
  completedTasks: string[]; // Store IDs of tasks completed today
  lastTaskRefresh: string | null;
}
