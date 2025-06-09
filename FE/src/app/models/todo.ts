export interface Todo {
  id: number;
  title: string;
  description: string;
  type: 'Feature' | 'Bug' | 'Story' | 'Other';
  status: 'Todo' | 'In progress' | 'Done';
  createdOn: Date;
}
