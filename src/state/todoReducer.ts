import { FilterStatus } from '../types/FilterStatus';
import { TodosAction, TodoState } from './type';

export const initialState: TodoState = {
  todos: [],
  filterTodosStatus: FilterStatus.ALL,
  error: '',
  tempTodo: null,
  processingTodoIds: [],
  title: '',
  isLoading: false,
};

export const reducer = (state: TodoState, action: TodosAction): TodoState => {
  switch (action.type) {
    case 'SET_TODOS':
      return {
        ...state,
        todos: action.payload,
      };
    case 'SET_FILTER_STATUS':
      return {
        ...state,
        filterTodosStatus: action.payload,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    case 'REMOVE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? action.payload.response : todo,
        ),
      };
    case 'PROCESSING_TODO_ADD':
      return {
        ...state,
        processingTodoIds: [...state.processingTodoIds, action.payload],
      };
    case 'PROCESSING_TODO_REMOVE':
      return {
        ...state,
        processingTodoIds: state.processingTodoIds.filter(
          todoId => todoId !== action.payload,
        ),
      };
    case 'SET_TITLE':
      return {
        ...state,
        title: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'TEMP_TODO':
      return {
        ...state,
        tempTodo: action.payload,
      };
    default:
      return state;
  }
};
