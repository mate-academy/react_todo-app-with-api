/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import {
  getTodos,
  USER_ID,
  deleteTodo,
  crateTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import TodoHeader from './components/TodoHeader';
import TodoFooter from './components/TodoFooter';
import TodoList from './components/TodoList';
import { filterOptions } from './types/filterOptions';
import classNames from 'classnames';
import TodoItem from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState(filterOptions.All);
  const [newTitle, setNewTitle] = useState('');
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorMessage]);

  useEffect(() => {
    setErrorMessage(null);

    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch {
        setErrorMessage('Unable to load todos');
      }
    };

    loadTodos();
  }, []);

  const filteredTodos = todos.filter(todo => {
    switch (selectedFilter) {
      case filterOptions.Completed:
        return todo.completed;
      case filterOptions.Active:
        return !todo.completed;
      default:
        return true;
    }
  });

  const addTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newTitle.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const trimmedTitle = newTitle.trim();
    const tempId = Math.random();

    setLoadingTodoId(tempId);
    setIsInputDisabled(true);
    setErrorMessage(null);

    setTempTodo({
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
      id: 0,
    });

    const newTempTodo: Todo = {
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
      id: tempId,
    };

    setTempTodo(newTempTodo);

    crateTodo({
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setNewTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setLoadingTodoId(null);
        setIsInputDisabled(false);
        setTimeout(() => inputRef.current?.focus(), 250);
      });
  };

  const removeTodo = async (id: number) => {
    setLoadingTodoId(id);

    try {
      await deleteTodo(id);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setLoadingTodoId(null);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  };

  const clearCompletedTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const deleteTodos = completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(currentTodo => currentTodo.id !== todo.id),
          );
        })
        .catch(() => {
          setErrorMessage('Unable to delete a todo');
        }),
    );

    try {
      await Promise.allSettled(deleteTodos);
      inputRef.current?.focus();
    } catch {
      setErrorMessage('Error occurred while clearing completed todos.');
    }
  };

  const handleToggleAll = () => {
    const areAllCompleted = todos.some(todo => !todo.completed);

    const todosToUpdate = todos.filter(
      todo => todo.completed !== areAllCompleted,
    );

    setTodos(prevTodos =>
      prevTodos.map(todo => ({
        ...todo,
        completed: areAllCompleted,
      })),
    );

    todosToUpdate.forEach(todo => {
      updateTodo({
        ...todo,
        completed: areAllCompleted,
      }).catch(() => {
        setErrorMessage('Unable to update a todo');
      });
    });
  };

  const toggleTodo = async (todo: Todo) => {
    setLoadingTodoId(todo.id);

    try {
      const updatedTodo = await updateTodo({
        ...todo,
        completed: !todo.completed,
      });

      setTodos(currentTodos => {
        return currentTodos.map(currentTodo =>
          currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
        );
      });
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setLoadingTodoId(null);
    }
  };

  const updateTodoTitle = async (todo: Todo, newUpdatedTitle: string) => {
    setLoadingTodoId(todo.id);

    try {
      const updatedTodo = await updateTodo({
        ...todo,
        title: newUpdatedTitle,
      });

      setTodos(currentTodos => {
        return currentTodos.map(currentTodo =>
          currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
        );
      });

      return true;
    } catch {
      setErrorMessage('Unable to update a todo');

      return false;
    } finally {
      setLoadingTodoId(null);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          loadingTodoId={loadingTodoId}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          addTodo={addTodo}
          isInputDisabled={isInputDisabled}
          inputRef={inputRef}
          handleToggleAll={handleToggleAll}
        />

        <TodoList
          filteredTodos={filteredTodos}
          loadingTodoId={loadingTodoId}
          deleteTodo={removeTodo}
          toggleTodo={toggleTodo}
          updateTodoTitle={updateTodoTitle}
        />

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            loadingTodoId={loadingTodoId}
            deleteTodo={removeTodo}
            toggleTodo={toggleTodo}
            updateTodoTitle={updateTodoTitle}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
