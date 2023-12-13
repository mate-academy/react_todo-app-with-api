import { Action } from '../types/Action';
import { State } from '../types/State';

export const reduser = (state: State, action: Action): State => {
  switch (action.type) {
    case 'loadingTodos':
      return {
        ...state,
        todos: action.payload,
      };

    case 'setRef':
      return {
        ...state,
        newTodoInputRef: action.payload,
      };

    case 'error': {
      const { error, loadingType } = action.payload;

      return {
        ...state,
        errorMessage: error,
        shouldLoading: loadingType ?? state.shouldLoading,
      }; }

    case 'filter':
      return {
        ...state,
        filteredBy: action.payload,
      };

    case 'updateTodo': {
      const { todos } = state;
      const { loadingType, todo } = action.payload;
      const { completed, id, title } = todo;

      if (todos) {
        const updatedTodo = todos.find(
          t => t.id === id,
        );

        if (updatedTodo) {
          updatedTodo.completed = completed;
          updatedTodo.title = title;
        }

        return {
          ...state,
          todos: [...todos],
          shouldLoading: loadingType ?? state.shouldLoading,
        };
      }

      return state;
    }

    case 'createTempTodo': {
      return {
        ...state,
        tempTodo: action.payload,
      };
    }

    case 'createTodo': {
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    }

    case 'deleteTodo': {
      const updatedTodos = state.todos.filter(
        todo => todo.id !== action.payload,
      );

      return {
        ...state,
        todos: updatedTodos,
      };
    }

    case 'shouldLoading': {
      return {
        ...state,
        shouldLoading: action.payload,
      };
    }

    default:
      return state;
  }
};
