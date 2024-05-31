import { ActionType } from '../../types/ActionType';
import { Todo } from '../../types/Todo';

type Action =
  | { type: ActionType.GetTodos; payload: Todo[] }
  | { type: ActionType.AddTodo; payload: Todo }
  | { type: ActionType.DeleteTodo; payload: number }
  | { type: ActionType.ChangeTodo; payload: Todo }
  | { type: ActionType.ClearCompleted };

export const reducer = (todos: Todo[], action: Action): Todo[] => {
  switch (action.type) {
    case ActionType.GetTodos:
      return action.payload;
    case ActionType.AddTodo:
      return [...todos, action.payload];
    case ActionType.DeleteTodo:
      return todos.filter(({ id }) => id !== action.payload);
    case ActionType.ChangeTodo:
      return todos.map(todo =>
        todo.id === action.payload.id ? action.payload : todo,
      );
    case ActionType.ClearCompleted:
      return todos.filter(({ completed }) => !completed);
    default:
      return todos;
  }
};
