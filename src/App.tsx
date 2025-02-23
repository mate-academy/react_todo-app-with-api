/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  createTodo,
  getTodos,
  USER_ID,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { getPreparedTodos } from './utils/preparedTodos';

import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import { ErrorType } from './types/Errors';
import { getActiveTodos, getCompletedTodos } from './services/functions';

import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './components/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState<number[]>([]);
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorType.LOAD);
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const preparedTodos = useMemo(
    () => getPreparedTodos(todos, filterBy),
    [todos, filterBy],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  function addTodo() {
    const correctTitle = newTodoTitle.trim();

    const newTempTodo = {
      id: 0,
      title: correctTitle,
      userId: USER_ID,
      completed: false,
    };

    setIsDisabledInput(true);
    setTempTodo(newTempTodo);
    setIsLoading(ids => [...ids, 0]);

    createTodo(newTempTodo)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setNewTodoTitle('');
        setIsDisabledInput(false);
      })
      .catch(() => {
        setErrorMessage(ErrorType.ADD);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setIsDisabledInput(false);
        setTempTodo(null);
        setIsLoading(ids => ids.filter(Boolean));
      });
  }

  function handleDeleteTodo(todoId: number) {
    setIsLoading(ids => [...ids, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorType.DELETE);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setIsLoading([]);
      });
  }

  const updateTodoTitle = (todo: Todo) => {
    setIsLoading(ids => [...ids, todo.id]);

    updateTodo(todo)
      .then(todoFromServer => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === todoFromServer.id ? todoFromServer : currentTodo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorType.UPDATE);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setIsLoading([]);
      });
  };

  const updateToggle = (toggleTodo: Todo) => {
    setIsLoading(ids => [...ids, toggleTodo.id]);

    const updatedTodo = { ...toggleTodo, completed: !toggleTodo.completed };

    updateTodo(updatedTodo)
      .then(todoFromServer => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === todoFromServer.id ? todoFromServer : currentTodo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorType.UPDATE);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setIsLoading([]);
      });
  };

  const handleToggleAll = () => {
    let activeTodos = getActiveTodos(todos);

    if (!activeTodos.length) {
      activeTodos = todos.map(todo => ({ ...todo, completed: false }));
    } else {
      activeTodos = activeTodos.map(todo => ({ ...todo, completed: true }));
    }

    activeTodos.forEach(todo =>
      updateToggle({ ...todo, completed: !todo.completed }),
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoTitle={newTodoTitle}
          setNewTodo={setNewTodoTitle}
          addTodo={addTodo}
          onError={setErrorMessage}
          onDisabled={isDisabledInput}
          todos={todos}
          handleToggleAll={handleToggleAll}
          getCompletedTodos={() => getCompletedTodos(todos)}
          inputRef={inputRef}
          isLoading={isLoading}
        />

        <TodoList
          todos={preparedTodos}
          onDelete={handleDeleteTodo}
          tempTodo={tempTodo}
          isLoading={isLoading}
          onUpdateTodo={updateTodoTitle}
          updateToggle={updateToggle}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            filterBy={filterBy}
            handleSelect={setFilterBy}
            onDelete={handleDeleteTodo}
            activeTodos={() => getActiveTodos(todos)}
            completedTodos={() => getCompletedTodos(todos)}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
