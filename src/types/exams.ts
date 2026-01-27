// Types pour les drills de l'Exam I
export interface PositionDrill {
  code: string;
  name: string;
  type: "position";
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
  type: "counting";
  score: number;
  maxScore: number;
  instructions: string;
  // attempts[targetIndex][attemptIndex] = true (success) | false (miss) | null (not attempted yet)
  attempts?: (boolean | null)[][];
  // Backward-compatible legacy fields used by some UI helpers and tests (F6)
  shots?: (number | boolean)[];
  attempted?: boolean[];
}

export type ExamIDrill = PositionDrill | CountingDrill;

// Types pour les skills de l'Exam II
export interface BestOfTwoSkill {
  code: string;
  name: string;
  type: "bestOfTwo";
  attempt1: number;
  attempt2: number;
  maxScore: number;
}

export interface LowestTwoOfThreeSkill {
  code: string;
  name: string;
  type: "lowestTwoOfThree";
  scores: number[];
  maxScore: number;
}

export interface SumSkill {
  code: string;
  name: string;
  type: "sum";
  scores: number[];
  maxScore: number;
}

export interface MedianSkill {
  code: string;
  name: string;
  type: "median";
  breakScores: number[][];
  maxScore: number;
}

export type ExamIISkill = BestOfTwoSkill | LowestTwoOfThreeSkill | SumSkill | MedianSkill;

export type ExamIILevel = "Bachelors" | "Masters" | "Doctorate";

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

export interface SnapshotEntry {
  id: string;
  date: string;
  label?: string;
  version?: number;
  data: {
    student: Student;
    examI: ExamI;
    examII: ExamII;
    history: {
      examI: ExamIHistoryEntry[];
      examII: ExamIIHistoryEntry[];
    };
  };
}

export interface History {
  examI: ExamIHistoryEntry[];
  examII: ExamIIHistoryEntry[];
  // Full application snapshots (autosave / manual restore points)
  snapshots?: SnapshotEntry[];
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

// Type guards
export function isPositionDrill(drill: ExamIDrill): drill is PositionDrill {
  return (drill as ExamIDrill).type === "position";
}

export function isCountingDrill(drill: ExamIDrill): drill is CountingDrill {
  return (drill as ExamIDrill).type === "counting";
}

export function isBestOfTwoSkill(skill: ExamIISkill): skill is BestOfTwoSkill {
  return (skill as ExamIISkill).type === "bestOfTwo";
}

export function isLowestTwoOfThreeSkill(skill: ExamIISkill): skill is LowestTwoOfThreeSkill {
  return (skill as ExamIISkill).type === "lowestTwoOfThree";
}

export function isSumSkill(skill: ExamIISkill): skill is SumSkill {
  return (skill as ExamIISkill).type === "sum";
}

export function isMedianSkill(skill: ExamIISkill): skill is MedianSkill {
  return (skill as ExamIISkill).type === "median";
}
