import { Todo } from './Todo';
import { Dispatchers } from './enums/Dispatchers';

export type Actions =
  {
    type: Dispatchers.Add;
    payload: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>
  }
  | {
    type: Dispatchers.UpdateTitle;
    payload: Omit<Todo, 'userId' | 'completed' | 'createdAt' | 'updatedAt'>
  }
  | {
    type: Dispatchers.ChangeStatus;
    payload: Omit<Todo, 'userId' | 'title' | 'createdAt' | 'updatedAt'>
  }
  | { type: Dispatchers.ChangeAllStatuses; payload: boolean }
  | { type: Dispatchers.DeleteWithId; payload: number }
  | { type: Dispatchers.DeleteComplited }
  | { type: Dispatchers.Load }
  | {
    type: Dispatchers.UpdateTodo;
    payload: Omit<Todo, 'userId' | 'completed' | 'createdAt' | 'updatedAt'>
    | Omit<Todo, 'userId' | 'title' | 'createdAt' | 'updatedAt'>
  };
