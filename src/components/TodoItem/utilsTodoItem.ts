import { ActiveInput, setActiveInput } from '../../app/features/focusedSlice';
import {
  changeTodo,
  removeTodo,
  UpdateTodos,
} from '../../app/features/todosSlice';
import { AppDispatch } from '../../app/store';
import { Todo } from '../../types/Todo';
import { EventType } from '../../types/types';

export interface DeleteArguments {
  dispatch: AppDispatch;
  event: EventType;
  id: number;
}

export function handleDeleteTodo(params: DeleteArguments) {
  params.event.preventDefault();

  params
    .dispatch(removeTodo(params.id))
    .unwrap()
    .then(() => {
      params.dispatch(setActiveInput(ActiveInput.isHeader));
    });
}

interface UpdateParams {
  event: EventType;
  query: string;
  todo: Todo;
  newData: boolean | string;
  completed: boolean;
  title: string;
  dispatch: AppDispatch;
  setIsFocused: (v: boolean) => void;
}

export function handleUpdateTodo(params: UpdateParams) {
  params.event.preventDefault();

  const data: UpdateTodos = {
    todoId: params.todo.id,
    newTodo: { ...params.todo },
  };

  switch (params.newData) {
    case params.completed:
      data.newTodo.completed = !params.completed ? true : false;
      break;
    case params.title:
      data.newTodo.title = params.query.trim();
      break;
  }

  params
    .dispatch(changeTodo(data))
    .unwrap()
    .then(() => {
      params.dispatch(setActiveInput(ActiveInput.isHeader));
      params.setIsFocused(false);
    });
}

export interface EditingParams {
  event: EventType;
  todo: Todo;
  query: string;
  title: string;
  dispatch: AppDispatch;
  completed: boolean;
  todoId: number;
  setQuery: (v: string) => void;
  setIsFocused: (v: boolean) => void;
}

export const editingEvent = (params: EditingParams) => {
  params.event.preventDefault();

  const deleteArgs = {
    id: params.todoId,
    dispatch: params.dispatch,
    event: params.event,
  };

  const updateArgs = {
    event: params.event,
    query: params.query,
    todo: params.todo,
    newData: params.title.trim(),
    completed: params.completed,
    title: params.title,
    dispatch: params.dispatch,
    setIsFocused: params.setIsFocused,
  };

  params.setQuery(params.query.trim());

  if (params.query.trim() === params.title) {
    params.dispatch(setActiveInput(ActiveInput.isHeader));

    return params.setIsFocused(false);
  }

  return params.query
    ? handleUpdateTodo(updateArgs)
    : handleDeleteTodo(deleteArgs);
};
