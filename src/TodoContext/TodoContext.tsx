import React, { useEffect, useMemo, useState } from 'react';
import { filterForTodos } from '../services/chooseFilterForTodos';
import { getTodos } from '../api/todos';
import { USER_ID } from '../variables/UserID';
import { Todo } from '../types/Todo';
import { TodoContext } from '../types/TodoContext.1';
import * as todosServices from '../api/todos';
import { Status } from '../types/Status';

export const TodosContext = React.createContext<TodoContext>({
  todos: [],
  addTodo: () => { },
  setCompleted: () => { },
  onToggleAll: () => { },
  query: Status.All,
  setQuery: () => { },
  filteredTodos: [],
  deleteCompletedTodos: () => { },
  deleteTodo: () => { },
  errorMessage: '',
  setErrorMessage: () => { },
  tempTodo: null,
  setTempTodo: () => { },
  updateTodosId: [],
  setUpdateTodosId: () => { },
  setTodos: () => { },
});

interface Props {
  children: React.ReactNode;
}

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [updateTodosId, setUpdateTodosId] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  function addTodo(todo: Todo) {
    if (todo.title.trim().length) {
      setTodos(prevTodos => [
        ...prevTodos,
        todo,
      ]);
    }
  }

  function updateTodo(updatedTodo: Todo) {
    setUpdateTodosId(prevId => [...prevId, updatedTodo.id]);
    todosServices
      .editTodo(updatedTodo)
      .then(() => {
        const todosAfterUpdate = todos.map((todo) => {
          return todo.id === updatedTodo.id ? updatedTodo : todo;
        });

        setTodos(todosAfterUpdate);
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => setUpdateTodosId([]));
  }

  function setCompleted(todoForEdit: Todo) {
    const updatedTodo = { ...todoForEdit, completed: !todoForEdit.completed };

    updateTodo(updatedTodo);
  }

  const filteredTodos = filterForTodos(query, todos);

  function onToggleAll() {
    const areAllCompleted = todos.every(todo => todo.completed);

    setUpdateTodosId(() => {
      if (areAllCompleted) {
        return todos.map(todo => todo.id);
      }

      const signedTodos = todos.filter(todo => !todo.completed);

      return signedTodos.map(todo => todo.id);
    });

    const toggledTodos = areAllCompleted
      ? [...todos]
      : todos.filter(todo => !todo.completed);

    const todosForEach = toggledTodos.map(todo => {
      return areAllCompleted
        ? { ...todo, completed: false }
        : { ...todo, completed: true };
    });

    todosForEach.forEach(
      updatedTodo => todosServices.editTodo(updatedTodo)
        .then(() => setTodos(currentTodos => currentTodos.map(
          // eslint-disable-next-line no-confusing-arrow
          (todo: Todo) => todo.id === updatedTodo.id
            ? updatedTodo
            : todo,
        )))
        .catch(() => setErrorMessage('Unable to update a todo'))
        .finally(() => setUpdateTodosId([])),
    );
  }

  function deleteCompletedTodos() {
    const filterTodos = todos.filter(({ completed }) => completed);

    setUpdateTodosId(filterTodos.map(todo => todo.id));

    filterTodos.map(({ id }) => todosServices.deleteTodo(id)
      .then(() => setTodos(todos.filter(({ completed }) => !completed)))
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => setUpdateTodosId([])));
  }

  function deleteTodo(todoID: number) {
    setUpdateTodosId(prevNumbers => [...prevNumbers, todoID]);

    return todosServices.deleteTodo(todoID).then(() => setTodos(
      prevTodos => prevTodos.filter(
        todo => todo.id !== todoID,
      ),
    ))
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => setUpdateTodosId([]));
  }

  const value = useMemo(() => ({
    todos,
    addTodo,
    setCompleted,
    onToggleAll,
    query,
    setQuery,
    filteredTodos,
    deleteCompletedTodos,
    deleteTodo,
    errorMessage,
    setErrorMessage,
    tempTodo,
    setTempTodo,
    updateTodosId,
    setUpdateTodosId,
    setTodos,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [todos, filteredTodos, query, errorMessage]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
