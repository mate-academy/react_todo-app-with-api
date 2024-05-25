import { Action, ActionTypes, FilterFields, TodoState } from './types';

export const initialState: TodoState = {
  todos: [],
  tempTodo: null,
  filter: FilterFields.All,
  isLoading: false,
  error: null,
  refresh: 0,
  loadingAll: false,
};

export const reducer = (state: TodoState, action: Action) => {
  switch (action.type) {
    case ActionTypes.ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    case ActionTypes.SET_TODOS:
      return {
        ...state,
        todos: action.payload,
      };
    case ActionTypes.SET_REFRESH:
      return {
        ...state,
        refresh: state.refresh + 1,
      };
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case ActionTypes.ADD_TEMP_TODO:
      return {
        ...state,
        tempTodo: action.payload,
      };
    case ActionTypes.EDIT_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, title: action.payload.title }
            : todo,
        ),
      };
    case ActionTypes.DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };
    case ActionTypes.TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? { ...todo, ...action.payload } : todo,
        ),
      };
    case ActionTypes.SET_FILTER:
      return {
        ...state,
        filter: action.payload,
      };
    case ActionTypes.SET_LOADING_ALL:
      return {
        ...state,
        loadingAll: action.payload,
      };
    default:
      return state;
  }
};
