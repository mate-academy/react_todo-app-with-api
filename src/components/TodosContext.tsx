import React, { useEffect, useState } from 'react';
import { USER_ID, wait } from '../utils/fetchClient';
import { deleteTodos, editTodos, getTodos } from '../api/todos';

import { Todo } from '../types/Todo';
import { Error } from '../types/Error';
import { Status } from '../types/Status';
import { TodosProps } from '../types/Context';

export const TodosContext = React
  .createContext<TodosProps>({
  isComplited: false,
  active: 0,

  todos: [],
  tempTodo: null,
  lids: new Set(),
  errorMessage: '',
  status: Status.ALL,

  setLids: () => {},
  doDelete: () => {},
  setTodos: () => {},
  doUpdate: () => {},
  setStatus: () => {},
  setTempTodo: () => {},
  setErrorMessage: () => {},
});

export const TodosProvider: React.FC<{
  children: React.ReactNode,
}> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState<Status>(Status.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [lids, setLids] = useState<Set<number>>(new Set());

  const active = todos.filter(todo => !todo.completed).length;
  const isComplited = todos.length - active > 0;

  useEffect(() => {
    getTodos(USER_ID).then(setTodos)
      .catch(() => setErrorMessage(Error.get));
  }, []);

  useEffect((errorShowTime = 3000) => {
    if (errorMessage.length) {
      wait(errorShowTime).then(() => setErrorMessage(''));
    }
  }, [errorMessage]);

  const doSetAdd = (set: Set<number>, val: number) => new Set(set.add(val));
  const doSetClear = (set: Set<number>, value: number) => {
    set.delete(value);

    return new Set(set);
  };

  const doUpdate = (updated: Todo) => {
    setLids(curr => doSetAdd(curr, updated.id));

    editTodos(updated)
      .then(resp => setTodos(curr => (
        curr.map(item => (resp.id === item.id ? resp : item)))))
      .catch(() => setErrorMessage(Error.patch))
      .finally(() => setLids(curr => doSetClear(curr, updated.id)));
  };

  const doDelete = (todoId: string) => {
    setLids(curr => doSetAdd(curr, +todoId));

    deleteTodos(todoId)
      .catch(() => setErrorMessage(Error.delete))
      .then(() => getTodos(USER_ID)
        .then(setTodos)
        .catch(() => setErrorMessage(Error.get)))
      .finally(() => setLids(curr => doSetClear(curr, +todoId)));
  };

  const value: TodosProps = {
    setLids,
    setTodos,
    doDelete,
    doUpdate,
    setStatus,
    setTempTodo,
    setErrorMessage,
    errorMessage,
    isComplited,
    tempTodo,
    active,
    status,
    todos,
    lids,
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
