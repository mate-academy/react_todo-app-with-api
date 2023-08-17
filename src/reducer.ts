/* eslint-disable max-len */
import { Types } from './enums/Types';
import { ErrorMessageActions } from './types/ErrorMessageActionsType';
import { FiltertActions } from './types/FilterActionsType';
import { Todo } from './types/Todo';
import { TodoActions } from './types/TodoActionsType';
import { UpdatedTodoIdActions } from './types/UpdatedTodoIdActionsType';

export const todoReducer = (todos: Todo[], action: TodoActions) => {
  switch (action.type) {
    case Types.CreateTodo:
      return [
        ...todos,
        {
          id: action.payload.id,
          userId: action.payload.userId,
          title: action.payload.title,
          completed: action.payload.completed,
        },
      ];
    case Types.DeleteTodo:
      return [
        ...todos.filter(todo => todo.id !== action.payload.id),
      ];
    case Types.SetTodosToState: {
      return [...action.payload.todos];
    }

    case Types.EditTodo: {
      const index = todos.findIndex(todo => {
        if (action.payload?.id !== undefined) {
          return action.payload.id === todo.id;
        }

        return action.payload.todoToEdit.id === todo.id;
      });
      const result = [...todos];

      result.splice(index, 1, action.payload.todoToEdit);

      return result;
    }

    case Types.ToggleCompletedTodo:
      return [
        ...todos.map(todo => {
          if (todo.id === action.payload.id) {
            return { ...todo, completed: !todo.completed };
          }

          return todo;
        }),
      ];
    case Types.ClearCompletedTodo:
      return [
        ...todos.filter(todo => !todo.completed),
      ];
    case Types.ToggleSelectAllTodo:
      if (action.payload.isSelectedAll) {
        return [
          ...todos.map(todo => {
            return { ...todo, completed: false };
          }),
        ];
      }

      return [
        ...todos.map(todo => {
          return { ...todo, completed: true };
        }),
      ];
    default:
      return todos;
  }
};

export const filterReducer = (filter: string, action: FiltertActions) => {
  switch (action.type) {
    case Types.FilterBy:
      return action.payload.filterBy;
    default:
      return filter;
  }
};

export const updatedTodoIdReducer = (updatedTodoIds: number[], action: UpdatedTodoIdActions) => {
  switch (action.type) {
    case Types.SetUpdatedTodoId:
      return [...updatedTodoIds, action.payload.updatedTodoId];
    case Types.RemoveUpdatedTodoId:
      return [...updatedTodoIds.filter(id => id !== action.payload.updatedTodoId)];
    default:
      return updatedTodoIds;
  }
};

export const errorMessageReducer = (errorMessage: string, action: ErrorMessageActions) => {
  switch (action.type) {
    case Types.SetErrorMessage:
      return action.payload.errorMessage;
    default:
      return errorMessage;
  }
};
