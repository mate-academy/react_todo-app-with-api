/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';

import { Todo } from './types/Todo';

import { USER_ID } from './helpers/userId';
import * as dataOperations from './api/todos';

import { TodoList } from './components/TodoList/TodoList';
import { TodoError } from './components/TodoError/TodoError';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { Header } from './components/Header/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isTodoSelected, setIsTodoSelected] = useState('');

  const [isTodoLoading, setIsTodoLoading] = useState<Todo | null>(null);
  const [isAllTodosLoading, setIsAllTodosLoading] = useState(false);

  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const [updatingForm, setUpdatingForm] = useState<Todo | null>(null);

  const [updateInputFocus, setUpdateInputFocus] = useState(false);

  useEffect(() => {
    setErrorMessage('');
    dataOperations.getTodos(USER_ID)
      .then(setTodos)
      .catch((error) => {
        setErrorMessage('Unable to load todos');
        throw error;
      });
  }, []);

  const errorTimerId = useRef(0);

  const showErrorMessage = () => {
    if (errorTimerId.current) {
      clearTimeout(errorTimerId.current);
    }

    errorTimerId.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    showErrorMessage();
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodos = ({ userId, title, completed }: Todo) => {
    setErrorMessage('');

    const temporaryTodo = {
      userId,
      title,
      completed,
      id: 0,
    };

    setTempTodo(temporaryTodo);
    setIsTodoLoading(temporaryTodo);
    setIsInputDisabled(true);

    return dataOperations.addTodos({ userId, title, completed })
      .then(todo => {
        setTodos(
          prev => [...prev, todo],
        );
      })
      .catch((error) => {
        setTodos(prev => prev.filter(t => t.id !== temporaryTodo.id));
        setErrorMessage('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setIsInputDisabled(false);
        setIsTodoLoading(null);
      });
  };

  const deleteTodos = (todoId: number) => {
    setErrorMessage('');

    todos.map(todo => (
      todo.id === todoId ? setIsTodoLoading(todo) : null
    ));

    return dataOperations.deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
      })
      .catch((error) => {
        setTodos(todos);
        setErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setIsTodoLoading(null);
        setIsAllTodosLoading(false);
      });
  };

  const completedTodos = todos.filter(todo => todo.completed === true);

  const deleteCompletedTodos = () => {
    todos.every(todo => (
      todo.completed ? setIsAllTodosLoading(true) : setIsTodoLoading(todo)
    ));

    return Promise.allSettled(completedTodos.map(todo => (
      deleteTodos(todo.id)
    )));
  };

  const updateTodos = (updatingTodo: Todo) => {
    setErrorMessage('');

    setIsTodoLoading(updatingTodo);

    return dataOperations.updateTodos(updatingTodo)
      .then(todo => {
        setTodos(currentTodo => {
          const newTodo = [...currentTodo];
          const index = newTodo.findIndex(td => td.id === updatingTodo.id);

          newTodo.splice(index, 1, todo);

          return newTodo;
        });
      })
      .catch((error) => {
        setErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => {
        setIsTodoLoading(null);
        setIsAllTodosLoading(false);
      });
  };

  const toggleAll = () => {
    setIsAllTodosLoading(true);

    const allCheckedTodos = todos.every(todo => todo.completed);
    const todosForUpdate = todos.filter(todo => (
      allCheckedTodos ? todo.completed : !todo.completed
    ));

    return Promise.allSettled(todosForUpdate.map(todo => (
      updateTodos({
        ...todo,
        completed: !todo.completed,
      })
    )));
  };

  const onCheckedToggle = (updatingTodo: Todo) => {
    setErrorMessage('');

    todos.map(todo => (
      todo.id === updatingTodo.id ? setIsTodoLoading(todo) : null
    ));

    const updatedTodo = { ...updatingTodo, completed: !updatingTodo.completed };

    return dataOperations.updateTodos(updatedTodo)
      .then(todo => {
        setTodos(currentTodo => {
          const newTodo = [...currentTodo];
          const index = newTodo.findIndex(td => td.id === updatedTodo.id);

          newTodo.splice(index, 1, todo);

          return newTodo;
        });
      })
      .catch((error) => {
        setErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => setIsTodoLoading(null));
  };

  let copyOfTodos = [...todos];

  switch (isTodoSelected) {
    case 'all':
      copyOfTodos = todos.filter(todo => todo);
      break;
    case 'active':
      copyOfTodos = todos.filter(todo => !todo.completed);
      break;
    case 'completed':
      copyOfTodos = todos.filter(todo => todo.completed);
      break;
    default: copyOfTodos = todos;
  }

  const todosCounter = todos.filter(todo => todo.completed !== true).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onDeleteCompletedTodos={deleteCompletedTodos}
          onErrorMessage={setErrorMessage}
          onToggleAll={toggleAll}
          onSubmit={addTodos}
          onDelete={deleteTodos}
          onQuery={setQuery}
          updateInputFocus={updateInputFocus}
          isInputDisabled={isInputDisabled}
          query={query}
          todos={todos}
        />

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            onUpdateInputFocus={setUpdateInputFocus}
            onCheckedToggle={onCheckedToggle}
            onUpdatingForm={setUpdatingForm}
            onSubmit={updateTodos}
            onDelete={deleteTodos}
            isAllTodosLoading={isAllTodosLoading}
            isTodoLoading={isTodoLoading}
            updatingForm={updatingForm}
            tempTodo={tempTodo}
            query={query}
            todos={copyOfTodos}
          />
        </section>

        {todos.length !== 0 && (
          <TodoFooter
            onDeleteCompletedTodos={deleteCompletedTodos}
            onTodoSelected={setIsTodoSelected}
            isTodoSelected={isTodoSelected}
            completedTodos={completedTodos}
            todosCounter={todosCounter}
          />
        )}
      </div>
      <TodoError
        onErrorMessage={setErrorMessage}
        errorMessage={errorMessage}
      />
    </div>
  );
};
