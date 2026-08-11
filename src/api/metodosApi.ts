import React from 'react';
import { Todo } from '../types/Todo';
import * as apiMetodos from './todos';

interface Metodos {
  setTodo: React.Dispatch<React.SetStateAction<Todo[]>>;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setTodoFantasm: React.Dispatch<React.SetStateAction<Todo | undefined>>;
  setDeletingTodo: React.Dispatch<React.SetStateAction<number | undefined>>;
  setUpdatingTodo: React.Dispatch<React.SetStateAction<number | undefined>>;
  setTexto: React.Dispatch<React.SetStateAction<[number, string]>>;

  newTodoInputRef: React.RefObject<HTMLInputElement | null>;

  activeFilter: string;
  inputText: string;
  texto: [number, string];
  todo: Todo[];
}

// Always fetches the FULL list. Filtering by 'active' / 'completed' is done
// purely at render time in App.tsx, never by shrinking this state array -
// otherwise counters, the Toggle All button, and the footer break whenever
// a filter other than 'all' is selected.
export const getData = async (
  metodos: Pick<Metodos, 'setTodo' | 'setErrorMessage'>,
) => {
  try {
    const todosGet = await apiMetodos.getTodos();

    metodos.setTodo(todosGet);
    metodos.setErrorMessage('');
  } catch (e) {
    metodos.setErrorMessage('Unable to load todos');

    throw new Error('Erro no GetData ' + e);
  }
};

export const postData = async (
  event: React.FormEvent<HTMLFormElement>,
  metodos: Metodos,
) => {
  let createdTodo: Todo;

  event.preventDefault();

  if (!metodos.inputText || metodos.inputText.trim() === '') {
    metodos.setErrorMessage('Title should not be empty');

    metodos.newTodoInputRef.current?.focus();

    return;
  }

  // Clear any previous error immediately when a new submission starts.
  // Without this, submitting again after a failure with the SAME error
  // text ('Unable to add a todo') would be a no-op state update in React
  // (identical string value), so the auto-hide effect would never re-run
  // and its 3s timer would never restart.
  metodos.setErrorMessage('');

  try {
    const sendObject = {
      id: 0,
      userId: apiMetodos.USER_ID,
      title: String(metodos.inputText).trim(),
      completed: false,
    };

    metodos.setTodoFantasm(sendObject);
    metodos.setInputDisabled(true);

    createdTodo = await apiMetodos.postTodo(sendObject);

    metodos.setTodo((prev: Todo[]) => [...prev, createdTodo]);

    metodos.setInputText('');
  } catch (e) {
    metodos.setErrorMessage('Unable to add a todo');
  } finally {
    metodos.setTodoFantasm(undefined);
    metodos.setInputDisabled(false);
  }
};

export const deleteData = async (todoId: number, metodos: Metodos) => {
  try {
    metodos.setDeletingTodo(todoId);

    await apiMetodos.deleteTodo(todoId);

    metodos.setTodo(prev => prev.filter(r => r.id !== todoId));

    return true;
  } catch (e) {
    metodos.setErrorMessage('Unable to delete a todo');

    return false;
  } finally {
    metodos.setDeletingTodo(undefined);
    metodos.newTodoInputRef.current?.focus();
  }
};

export const deleteCompleted = async (metodos: Metodos) => {
  const completedTodos = metodos.todo.filter(r => r.completed);

  // deleteData never throws (it catches its own errors and returns
  // false), so there is no need for extra try/catch or a "retry failed
  // deletes" branch here - each item resolves independently and updates
  // its own bit of state (removed on success, kept + error shown on fail).
  await Promise.all(completedTodos.map(r => deleteData(r.id, metodos)));
};

export const patchData = async (task: Todo, metodos: Metodos) => {
  const updatedTodo = {
    ...task,
    completed: !task.completed,
  };

  metodos.setUpdatingTodo(task.id);

  try {
    await apiMetodos.patchTodo(updatedTodo);

    metodos.setTodo(prev =>
      prev.map(todoItem =>
        todoItem.id === task.id
          ? { ...todoItem, completed: !todoItem.completed }
          : todoItem,
      ),
    );
  } catch (e) {
    metodos.setErrorMessage('Unable to update a todo');
  } finally {
    metodos.setUpdatingTodo(undefined);
  }
};

export const sendPatchDataForAll = async (metodos: Metodos) => {
  const allCompleted = metodos.todo.every(r => r.completed);
  const targets = allCompleted
    ? metodos.todo
    : metodos.todo.filter(r => !r.completed);

  await Promise.all(targets.map(r => patchData(r, metodos)));
};

export const updateTodoTitle = async (
  todoUpdate: Todo,
  newTitle: string,
  metodos: Metodos,
) => {
  metodos.setUpdatingTodo(todoUpdate.id);

  const guardarTexto = metodos.texto;

  metodos.setTexto([-1, '']);

  try {
    const updatedTodo = {
      ...todoUpdate,
      title: newTitle.trim(),
    };

    await apiMetodos.patchTodo(updatedTodo);

    metodos.setTodo(prev =>
      prev.map(item => (item.id === todoUpdate.id ? updatedTodo : item)),
    );
  } catch {
    metodos.setTexto(guardarTexto);

    metodos.setErrorMessage('Unable to update a todo');
  } finally {
    metodos.setUpdatingTodo(undefined);
  }
};
