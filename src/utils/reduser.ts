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
      const { todo, loadingType } = action.payload;

      return {
        ...state,
        tempTodo: todo,
        shouldLoading: loadingType ?? state.shouldLoading,
      };
    }

    case 'createTodo': {
      const { todo, loadingType } = action.payload;

      return {
        ...state,
        todos: [...state.todos, todo],
        shouldLoading: loadingType ?? state.shouldLoading,
      };
    }

    case 'deleteTodo': {
      const { id, loadingType } = action.payload;

      const updatedTodos = state.todos.filter(
        todo => todo.id !== id,
      );

      return {
        ...state,
        todos: updatedTodos,
        shouldLoading: loadingType ?? state.shouldLoading,
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
