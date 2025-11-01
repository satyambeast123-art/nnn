
export interface Option {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: Option[];
}

export interface Answers {
  [key: number]: string;
}
