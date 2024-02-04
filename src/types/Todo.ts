export interface Todo {
  id:TodoID;
  userId:number;
  title:string;
  completed:boolean;
}

export type TodoID = number;

export type TodoUpdate =
  Pick<Todo, 'id' | 'userId'>
  & Partial<Omit<Todo, 'id' | 'userId'>>;
