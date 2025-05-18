/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable max-len */

// #region Components

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { MessageError } from './components/MessageError';

// #endregion

// #region allImport

import { Todo } from './types/Todo';
import { getTodos, postTodos, deleteTodos, patchTodos } from './api/todos';
import React, { useEffect, useMemo, useRef, useState } from 'react';

// #endregion

export type TypeNewTodo = {
  id: null;
  userId: number;
  title: string;
  completed: boolean;
};

const USER_ID = 2881;

export const App: React.FC = () => {
  // #region AddFocus
  const inputRef = useRef<HTMLInputElement>(null);
  const useRefTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const focusForInput = () => {
    inputRef.current?.focus();
  };
  // #endregion

  // #region AddLoader
  const [LoderId, setLoderId] = useState<number | null>(null);

  const showLoader = (id: number) => {
    setLoderId(id);
  };
  // #endregion

  // #region State

  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(false);
  const [theError, setTheError] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [NewTodo, setCreateNewTodo] = useState<TypeNewTodo | null>(null);
  const [doDisable, setDoDisable] = useState(false);

  // #endregion

  // #region ShowErro

  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showError = (message: string) => {
    setHasError(true);
    setTheError(message);

    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }

    errorTimerRef.current = setTimeout(() => {
      setHasError(false);
    }, 3000);
  };

  // #endregion

  // #region DoFetch

  const doPost = (titleValue: string) => {
    if (titleValue.trim().length === 0) {
      showError('Title should not be empty');

      return;
    }

    const createNewTodo: TypeNewTodo = {
      id: null,
      userId: USER_ID,
      title: titleValue.trim(),
      completed: false,
    };

    setCreateNewTodo(createNewTodo);
    setDoDisable(true);

    postTodos(createNewTodo)
      .then(response => {
        setTodos(prev => [...prev, response]);
        setInputValue('');
      })
      .catch(() => {
        showError('Unable to add a todo');
      })
      .finally(() => {
        setCreateNewTodo(null);
        setDoDisable(false);

        // #region AddFocus
        if (useRefTimer.current) {
          clearTimeout(useRefTimer.current);
        }

        useRefTimer.current = setTimeout(() => {
          focusForInput();
        }, 0);
        // #endregion AddFocus
      });
  };

  // #region UpdatePost

  /* eslint-disable @typescript-eslint/indent */
  const [showLoaderCurrentPatch, setShowLoaderCurrentPatch] = useState<
    number[]
  >([]);

  const uppdatePost = async (title: string, id: number) => {
    if (title.trim().length === 0) {
      throw new Error('Title should not be empty');
    }

    setShowLoaderCurrentPatch(p => [...p, id]);

    try {
      const response = await patchTodos(id, { title });

      setTodos(prev =>
        prev.map((todo: Todo) => (todo.id === response.id ? response : todo)),
      );
    } catch {
      showError('Unable to update a todo');
      throw new Error('Update failed');
    } finally {
      setShowLoaderCurrentPatch(p => p.filter(currentId => currentId !== id));
    }
  };

  // #endregion

  const deletePost = (id: number) => {
    deleteTodos(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        showError('Unable to delete a todo');
      })
      .finally(() => focusForInput());
  };

  const deleteCompletedPost = (completedTodos: Todo[]) => {
    const allPromises = completedTodos.map(todo =>
      deleteTodos(todo.id)
        .then(() => todo.id)
        .catch(() => null),
    );

    Promise.all(allPromises)
      .then(results => {
        const successfulIds = results.filter((id): id is number => id !== null);

        setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));

        if (successfulIds.length < completedTodos.length) {
          showError('Unable to delete a todo');
        }
      })
      .finally(() => focusForInput());
  };

  // #endregion

  // #region changeCheckedValue

  const toggleAll = (index: number, completed: boolean) => {
    showLoader(index);

    patchTodos(index, { completed })
      .then(() =>
        setTodos(prevTodos => {
          return prevTodos.map(todo =>
            index === todo.id ? { ...todo, completed } : todo,
          );
        }),
      )
      .catch(() => {
        showError('Unable to update a todo');
      })
      .finally(() => setLoderId(null));
  };

  // #endregion

  // #region changheCompleteValue
  const changheCompletedValue = () => {
    const shouldCompleteAll = todos.some(todo => !todo.completed); // Якщо є хоча б один незавершений

    const todosToUpdate = todos.filter(todo =>
      shouldCompleteAll ? !todo.completed : todo.completed,
    );

    todosToUpdate.forEach(todo =>
      setShowLoaderCurrentPatch(prev => [...prev, todo.id]),
    );

    const patchRequests = todosToUpdate.map(todo =>
      patchTodos(todo.id, { ...todo, completed: shouldCompleteAll }),
    );

    Promise.all(patchRequests)
      .then(() => {
        setTodos(prev =>
          prev.map(todo =>
            todosToUpdate.find(t => t.id === todo.id)
              ? { ...todo, completed: shouldCompleteAll }
              : todo,
          ),
        );
      })
      .catch(() => showError('Failed to update all tasks'))
      .finally(() => {
        todosToUpdate.forEach(() => setShowLoaderCurrentPatch([]));
      });
  };

  // #endregion

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === 'active') {
        return !todo.completed;
      }

      if (filter === 'completed') {
        return todo.completed;
      }

      return true;
    });
  }, [todos, filter]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(response => {
        setTodos(response);
      })
      .catch(() => {
        showError('Unable to load todos');
      });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          doPost={doPost}
          changheCompletedValue={changheCompletedValue}
          inputRef={inputRef}
          doDisable={doDisable}
          inputValue={inputValue}
          todos={todos}
          setInputValue={setInputValue}
        />

        <TodoList
          todos={todos}
          LoderId={LoderId}
          NewTodo={NewTodo}
          toggleAll={toggleAll}
          showLoader={showLoader}
          deletePost={deletePost}
          uppdatePost={uppdatePost}
          visibleTodos={visibleTodos}
          showLoaderCurrentPatch={showLoaderCurrentPatch}
        />

        <Footer
          todos={todos}
          filter={filter}
          deleteCompletedPost={deleteCompletedPost}
          setFilter={setFilter}
        />
      </div>

      <MessageError
        setHasError={setHasError}
        hasError={hasError}
        theError={theError}
      />
    </div>
  );
};
