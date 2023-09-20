import { Types } from '../enums/Types';
import { Todo } from './Todo';

export type TodoPayload = {
  [Types.CreateTodo] : {
    id: number;
    userId: number;
    title: string;
    completed: boolean;
  };
  [Types.DeleteTodo]: {
    id: number;
  };
  [Types.ToggleCompletedTodo]: {
    id: number;
  };
  [Types.ClearCompletedTodo]: {};
  [Types.SetTodosToState]: {
    todos: Todo[] | [];
  };
  [Types.ToggleSelectAllTodo]: {
    isSelectedAll: boolean;
  };
  [Types.EditTodo]: {
    todoToEdit: Todo;
    id?: number;
  };
};
