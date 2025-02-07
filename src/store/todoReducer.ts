import { USER_ID } from '../api/todos';
import { Action, State } from '../types/todoReduser';

export const initialState = {
  todos: [],
  tempTodo: null,
  loadingState: {
    isAdding: false,
    updatingTodos: new Set<number>(),
    deletingTodos: new Set<number>(),
    isLoading: false,
  },
};

const toggleLoadingSet = (set: Set<number>, value: number): Set<number> => {
  const newSet = new Set(set);

  if (newSet.has(value)) {
    newSet.delete(value);
  } else {
    newSet.add(value);
  }

  return newSet;
};

export const todoReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_TODOS':
      return {
        ...state,
        todos: action.payload,
        loadingState: { ...state.loadingState, isLoading: false },
      };

    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload],
        loadingState: {
          ...state.loadingState,
          isAdding: false,
          isLoading:
            state.loadingState.updatingTodos.size > 0 ||
            state.loadingState.deletingTodos.size > 0,
        },
      };

    case 'UPDATE_TODO': {
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? action.payload : todo,
        ),
      };
    }

    case 'DELETE_TODO': {
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
        loadingState: {
          ...state.loadingState,
          isLoading:
            state.loadingState.deletingTodos.size > 0 ||
            state.loadingState.isAdding,
        },
      };
    }

    case 'SET_TEMP_TODO':
      return {
        ...state,
        tempTodo: { id: 0, ...action.payload, userId: USER_ID },
        loadingState: {
          ...state.loadingState,
          isAdding: true,
          isLoading: true,
        },
      };

    case 'CLEAR_TEMP_TODO':
      return {
        ...state,
        tempTodo: null,
        loadingState: {
          ...state.loadingState,
          isAdding: false,
          isLoading: state.loadingState.deletingTodos.size > 0,
        },
      };

    case 'TOGGLE_LOADING': {
      const { key, todoId } = action.payload;
      const newLoadingSet = toggleLoadingSet(state.loadingState[key], todoId);

      return {
        ...state,
        loadingState: {
          ...state.loadingState,
          [key]: newLoadingSet,
          isLoading:
            state.loadingState.isAdding ||
            (key === 'deletingTodos' && newLoadingSet.size > 0),
        },
      };
    }

    default:
      return state;
  }
};
