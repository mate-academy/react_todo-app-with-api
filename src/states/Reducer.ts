import { Todo } from '../types/Todo';
import { GlobalState } from '../types/GlobalState';
import { ErrorType } from '../types/ErrorType';

export enum ActionType {
  CreateTodo,
  SetTodos,
  UpdateTodo,
  DeleteTodo,
  SetTempTodo,
  ToggleError,
  SetTodoToProcess,
}

export type Action = { type: ActionType.CreateTodo, payload: { todo: Todo } }
| { type: ActionType.SetTodos, payload: { todos: Todo[] } }
| { type: ActionType.UpdateTodo, payload: { updatedTodo: Todo } }
| { type: ActionType.DeleteTodo, payload: { id: number } }
| { type: ActionType.SetTempTodo, payload: { tempTodo: Todo | null } }
| { type: ActionType.SetTodoToProcess, payload: { todo: Todo | null } }
| { type: ActionType.ToggleError, payload: { errorType: ErrorType | null } };

export const reducer = (
  state: GlobalState,
  { type, payload }: Action,
): GlobalState => {
  switch (type) {
    case ActionType.CreateTodo:
      return {
        ...state,
        todos: [...state.todos, payload.todo],
      };

    case ActionType.SetTodos:
      return {
        ...state,
        todos: payload.todos,
      };

    case ActionType.UpdateTodo: {
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === payload.updatedTodo.id) {
            return payload.updatedTodo;
          }

          return todo;
        }),
      };
    }

    case ActionType.DeleteTodo:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== payload.id),
      };

    case ActionType.SetTempTodo:
      return {
        ...state,
        tempTodo: payload.tempTodo,
      };

    case ActionType.SetTodoToProcess: {
      const newTodosToProcess = payload.todo === null
        ? []
        : [...state.todosToProcess, payload.todo];

      return {
        ...state,
        todosToProcess: newTodosToProcess,
      };
    }

    case ActionType.ToggleError:
      return {
        ...state,
        error: payload.errorType,
      };

    default:
      return state;
  }
};
