import { Action } from '../types/Action';
import { Todo } from '../types/Todo';

export function todosReducer(state: Todo[], action: Action): Todo[] {
  let currentState: Todo[] = [];

  switch (action.type) {
    case 'get':
      currentState = [...action.payload];
      break;

    case 'add':
      currentState = [
        ...state,
        action.payload,
      ];
      break;

    case 'remove':
      currentState = state.filter(todo => todo.id !== action.payload);
      break;

    case 'toggle':
      currentState = state.map(todo => {
        if (todo.id === action.payload.id) {
          return { ...action.payload };
        }

        return { ...todo };
      });
      break;

    case 'edit':
      currentState = state.map(todo => {
        if (todo.id === action.payload.id) {
          return {
            ...todo,
            title: action.payload.title,
          };
        }

        return { ...todo };
      });
      break;

    default:
      currentState = [...state];
      break;
  }

  return currentState;
}
