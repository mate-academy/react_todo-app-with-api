import { TodosListType } from '../../types/todosTypes';
import { Actions } from '../../types/actionTypes';

export const todosReducer
  = (todos: TodosListType, action: Actions): TodosListType => {
    const { type, payload } = action;

    switch (type) {
      case 'LOAD': {
        return [...payload];
      }

      case 'POST': {
        return [...todos, payload];
      }

      case 'DELETE': {
        const filtered = todos.filter(({ id }) => (
          id !== payload));

        return filtered;
      }

      case 'PATCH': {
        const maped = todos.map((todo) => {
          if (todo.id === payload.id) {
            return payload;
          }

          return todo;
        });

        return maped;
      }

      case 'IS_SPINNING': {
        const maped = todos.map((todo) => {
          if (todo.id === payload) {
            const copyTodo = { ...todo };

            copyTodo.isSpinned = true;

            return copyTodo;
          }

          return todo;
        });

        return maped;
      }

      case 'REMOVE_SPINNING': {
        const maped = todos.map((todo) => {
          if (todo.id === payload) {
            const copyTodo = { ...todo };

            delete copyTodo.isSpinned;

            return copyTodo;
          }

          return todo;
        });

        return maped;
      }

      default: {
        throw Error('Unknown action');
      }
    }
  };
