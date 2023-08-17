import { Types } from '../../enums/Types';
import { Todo } from '../../types/Todo';
import { TodoActions } from '../../types/TodoActionsType';
import { USER_ID } from '../../utils/const';

export const setTodosToStateAction = (todos: Todo[]):TodoActions => {
  return {
    type: Types.SetTodosToState,
    payload: {
      todos,
    },
  };
};

export const createTodoAction = (id: number, title:string): TodoActions => {
  return {
    type: Types.CreateTodo,
    payload: {
      id,
      userId: USER_ID,
      title,
      completed: false,
    },
  };
};

export const editTodoAction = (todoToEdit:Todo, id?:number):TodoActions => {
  const action:TodoActions = {
    type: Types.EditTodo,
    payload: {
      todoToEdit,
      id,
    },
  };

  if (id) {
    action.payload.id = id;
  }

  return action;
};

export const deleteTodoAction = (id: number): TodoActions => {
  return {
    type: Types.DeleteTodo,
    payload: {
      id,
    },
  };
};

export const toggleTodoCompletedAction = (id: number): TodoActions => {
  return {
    type: Types.ToggleCompletedTodo,
    payload: {
      id,
    },
  };
};
