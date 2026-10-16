export type QuestionType = "text" | "email" | "multiple_choice" | "yes_no";

export interface QuestionData {
  id?: string;
  order: number;
  type: QuestionType;
  title: string;
  description?: string | null;
  placeholder?: string | null;
  required: boolean;
  options?: string[] | null; // parsed options
}

export interface FormData {
  id: string;
  title: string;
  description?: string | null;
  published: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  botName: string;
  botAvatar: string;
  themeColor: string;
  welcomeMessage: string;
  completionMessage: string;
  questions: QuestionData[];
  _count?: {
    submissions: number;
  };
}

export interface AnswerData {
  id: string;
  questionId: string;
  value: string;
  question?: QuestionData;
}

export interface SubmissionData {
  id: string;
  formId: string;
  createdAt: string | Date;
  answers: AnswerData[];
}
