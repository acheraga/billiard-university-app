// Types pour les drills de l'Exam I
export interface PositionDrill {
  code: string;
  name: string;
  type: 'position';
  shots: number[];
  successes: boolean[];
  loses: boolean[];
  locked: boolean[];
  score: number;
  maxScore: number;
  bonus: number;
}

export interface CountingDrill {
  code: string;
  name: string;
  type: 'counting';
  score: number;
  maxScore: number;
  instructions: string;
  // attempts[targetIndex][attemptIndex] = true (success) | false (miss) | null (not attempted yet)
  attempts?: (boolean | null)[][];
} 

export type ExamIDrill = PositionDrill | CountingDrill;

// Types pour les skills de l'Exam II
export interface BestOfTwoSkill {
  code: string;
  name: string;
  type: 'bestOfTwo';
  attempt1: number;
  attempt2: number;
  maxScore: number;
}

export interface LowestTwoOfThreeSkill {
  code: string;
  name: string;
  type: 'lowestTwoOfThree';
  scores: number[];
  maxScore: number;
}

export interface SumSkill {
  code: string;
  name: string;
  type: 'sum';
  scores: number[];
  maxScore: number;
}

export interface MedianSkill {
  code: string;
  name: string;
  type: 'median';
  breakScores: number[][];
  maxScore: number;
}

export type ExamIISkill = BestOfTwoSkill | LowestTwoOfThreeSkill | SumSkill | MedianSkill;

export type ExamIILevel = 'Bachelors' | 'Masters' | 'Doctorate';

// Student info
export interface Student {
  name: string;
  date: string;
  examIScore: number | null;
  examIILevel: string | null;
}

// Exam I state
export interface ExamI {
  drills: ExamIDrill[];
  totalScore: number;
  placement: string;
}

// Exam II state
export interface ExamII {
  currentLevel: ExamIILevel;
  skills: {
    Bachelors: ExamIISkill[];
    Masters: ExamIISkill[];
    Doctorate: ExamIISkill[];
  };
  currentScore: number;
}

// History entries
export interface ExamIHistoryEntry {
  date: string;
  studentName: string;
  scores: number[];
  total: number;
  level: string;
}

export interface ExamIIHistoryEntry {
  date: string;
  studentName: string;
  level: string;
  scores: number[];
  total: number;
}

export interface History {
  examI: ExamIHistoryEntry[];
  examII: ExamIIHistoryEntry[];
}

// User profile data
export interface UserProfile {
  student: Student;
  examI: ExamI;
  examII: ExamII;
  history: History;
  lastSaved: string;
}

// Store state
export interface ExamsState {
  student: Student;
  examI: ExamI;
  examII: ExamII;
  history: History;
  users: Record<string, UserProfile>;
  currentUserId: string | null;
}

// User list item
export interface UserListItem {
  id: string;
  name: string;
}
