/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodos,
  deleteTodos,
  getTodos,
  updateTodos,
  USER_ID,
} from './api/todos';

import { Todo } from './types/todo';
import { TodoList } from './componets/TodoList';
import { Header } from './componets/Header';
import { Footer } from './componets/Footer';
import { ErrorNotification } from './componets/ErrorNotification';
import { ErrorMessage } from './types/ErrorMessage';

type Filter = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  //#region State
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [errorMessage, setErrorMessage] = useState('');
  //#endregion State

  const titleField = useRef<HTMLInputElement>(null);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const newTitle = title.trim();

    if (!newTitle) {
      setErrorMessage(ErrorMessage.EmptyTitle);
      titleField.current?.focus();

      return;
    }

    setErrorMessage('');
    setIsDisabled(true);

    const cusTodo: Todo = {
      id: 0,
      completed: false,
      title: newTitle,
      userId: USER_ID,
    };

    setTempTodo(cusTodo);

    addTodos({ title: newTitle, userId: USER_ID, completed: false })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTempTodo(null);
      })
      .finally(() => {
        setIsDisabled(false);
        setTimeout(() => {
          titleField.current?.focus();
        }, 0);
      });
  }

  function handleDeleteTodo(todoId: number) {
    setErrorMessage('');
    setLoadingIds(currentLoadingIds => [...currentLoadingIds, todoId]);

    deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
      })
      .finally(() => {
        setLoadingIds(currentIds => currentIds.filter(id => id !== todoId));
        titleField.current?.focus();
      });
  }

  function loadingTodos() {
    setErrorMessage('');
    setLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.Load))
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          titleField.current?.focus();
        }, 0);
      });
  }

  function handleClearCompleted() {
    todos.filter(t => t.completed).forEach(t => handleDeleteTodo(t.id));
  }

  function handleUpdateChange(updateTodo: Todo) {
    setLoadingIds(currentLoadingIds => [...currentLoadingIds, updateTodo.id]);

    setErrorMessage('');

    return updateTodos(updateTodo)
      .then(newUpdateTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === newUpdateTodo.id ? newUpdateTodo : todo,
          ),
        );
      })
      .catch(error => {
        setErrorMessage(ErrorMessage.Update);
        throw error;
      })
      .finally(() => {
        setLoadingIds(currentIds =>
          currentIds.filter(id => id !== updateTodo.id),
        );
      });
  }

  const todoComplete = todos.length > 0 && todos.every(todo => todo.completed);

  function handleToggleAll() {
    const targetStatus = !todoComplete;

    todos
      .filter(todo => todo.completed !== targetStatus)
      .forEach(todo =>
        handleUpdateChange({ ...todo, completed: targetStatus }),
      );
  }

  useEffect(loadingTodos, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const todosFilters = () => {
    return todos.filter(todo => {
      switch (filter) {
        case 'active':
          return !todo.completed;
        case 'completed':
          return todo.completed;

        default:
          return true;
      }
    });
  };

  const visibleTodos = todosFilters();
  const countTodos = todos.filter(t => !t.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          loading={loading || isDisabled}
          todoActive={todoComplete}
          onChange={handleTitleChange}
          onSubmit={handleSubmit}
          hasTodos={todos.length > 0}
          inputRef={titleField}
          onToggleAll={handleToggleAll}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          loadingIds={loadingIds}
          onDelete={handleDeleteTodo}
          onUpdateChange={handleUpdateChange}
        />

        {todos.length > 0 && (
          <Footer
            count={countTodos}
            filter={filter}
            onFilterChange={setFilter}
            onClear={handleClearCompleted}
            hasCompleted={todos.some(t => t.completed)}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
