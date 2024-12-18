import React, { useState, useEffect, useCallback } from 'react';
import * as todosService from './api/todos';

import { ErrorMessages } from './components/ErrorsMessage';
import TodoList from './components/TodoList';
import { Footer } from './components/Footer';
import Header from './components/Header';

import { Todo } from './types/Todo';
import { Field } from './types/Field';
import { filterByTodos, preparedTodos } from './service/service';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [field, setField] = useState<Field>(Field.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [editedTodos, setEditedTodos] = useState<Todo[]>([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [todosForDelete, setTodosForDelete] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.Nothing,
  );

  useEffect(() => {
    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.UnableToLoad));
  }, []);

  const todosCounter = filterByTodos(todos);

  useEffect(() => {
    const timerId = window.setTimeout(
      () => setErrorMessage(ErrorMessage.Nothing),
      3000,
    );

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  const filteredTodos = preparedTodos(todos, field);

  const changeComplete = useCallback((toggleTodo: Todo) => {
    const changedTodo = { ...toggleTodo, completed: !toggleTodo.completed };

    setEditedTodos([toggleTodo]);

    todosService
      .editTodo(changedTodo)
      .then(newTodo =>
        setTodos(prevTodos =>
          prevTodos.map(currentTodo =>
            currentTodo.id === newTodo.id ? newTodo : currentTodo,
          ),
        ),
      )
      .catch(() => setErrorMessage(ErrorMessage.UnableToUpdate))
      .finally(() => setEditedTodos([]));
  }, []);

  const changeCompleteAll = useCallback((todosAll: Todo[]) => {
    let changedTodos = todosAll.filter(todo => !todo.completed);

    if (changedTodos.length === 0 || changedTodos.length === todosAll.length) {
      changedTodos = todosAll;
    } else {
      changedTodos.map(todo => ({
        ...todo,
        completed: true,
      }));
    }

    setEditedTodos(changedTodos);
    changedTodos.map(todo =>
      todosService
        .editTodo({ ...todo, completed: !todo.completed })
        .then(newTodo =>
          setTodos(prevTodos =>
            prevTodos.map(currentTodo =>
              currentTodo.id === newTodo.id ? newTodo : currentTodo,
            ),
          ),
        )
        .catch(() => setErrorMessage(ErrorMessage.UnableToUpdate))
        .finally(() => setEditedTodos([])),
    );
  }, []);

  const addTempTodo = useCallback((temporaryTodo: Todo | null) => {
    setTempTodo(temporaryTodo ? { ...temporaryTodo, id: 0 } : null);
  }, []);

  const deleteCompletedTodos = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    setTodosForDelete(completedTodos);

    completedTodos.forEach(deletedTodo =>
      todosService
        .deleteTodo(deletedTodo.id)
        .then(() =>
          setTodos(prevTodos =>
            prevTodos.filter(currentTodo => currentTodo.id !== deletedTodo.id),
          ),
        )
        .then(() => setTodosForDelete([]))
        .catch(() => setErrorMessage(ErrorMessage.UnableToDelete))
        .finally(() => setIsDeleted(true)),
    );
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          todosCounter={todosCounter.length}
          changeCompleteAll={changeCompleteAll}
          setErrorMessage={setErrorMessage}
          addTempTodo={addTempTodo}
          isDeleted={isDeleted}
        />

        {!!todos.length && (
          <TodoList
            filteredTodos={filteredTodos}
            changeComplete={changeComplete}
            setTodos={setTodos}
            tempTodo={tempTodo}
            setIsDeleted={setIsDeleted}
            setErrorMessage={setErrorMessage}
            todosForDelete={todosForDelete}
            editedTodos={editedTodos}
          />
        )}

        {!!todos.length && (
          <Footer
            field={field}
            setField={setField}
            todosCounter={todosCounter.length}
            isCompleted={todosCounter.length === todos.length}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      <ErrorMessages
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
