/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { getTodos, postTodo, removeTodo, updateTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodosList } from './components/TodosList';
import { FilterType } from './types/FilterType';
import { Footer } from './components/Footer';
import { ErrorType } from './types/ErrorType';
import { ErrorNotification } from './components/ErrorNotification';
import { MyInput } from './components/Header';
import { OptionalAttributes } from './types/OptionalAttributes';

export const App: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<ErrorType | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState<FilterType>(FilterType.All);
  const [tmpTodo, setTmpTodo] = useState<Omit<Todo, 'userId'> | null>(null);
  const [updatedTodosId, setUpdatedTodosId] = useState<number[]>([]);
  const [failedTitleUpdateId, setFailedTitleUpdateId] = useState<number>(0);

  const downloadTodos = async () => {
    try {
      const tmp = await getTodos();

      setTodos(tmp);
    } catch {
      setError(ErrorType.UnableToLoad);
    }
  };

  useEffect(() => {
    downloadTodos();
    inputRef.current?.focus();
  }, []);

  const filterTodos = () => {
    if (query === FilterType.Active) {
      return todos.filter(todo => !todo.completed);
    } else if (query === FilterType.Completed) {
      return todos.filter(todo => todo.completed);
    }

    return todos;
  };

  const filteredTodos = filterTodos();

  const returnLeftNumber = () => {
    return todos.filter(todo => todo.completed != true).length;
  };

  const handleSetQuery = (passedQuery: FilterType) => {
    setQuery(passedQuery);
  };

  const handleSetError = (errorType: ErrorType | null) => {
    setError(errorType);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (inputRef.current?.value.trim()) {
      inputRef.current.disabled = true;
      setTmpTodo({
        title: inputRef.current.value.trim(),
        id: -1,
        completed: false,
      });

      postTodo(inputRef.current.value.trim())
        .then(response => {
          setTodos(prev => [...prev, response]);

          if (inputRef.current) {
            inputRef.current.value = '';
          }
        })
        .catch(() => setError(ErrorType.UnableToAdd))
        .finally(() => {
          if (inputRef.current) {
            inputRef.current.disabled = false;
            inputRef.current.focus();
          }

          setTmpTodo(null);
        });
    } else {
      setError(ErrorType.EmptyTitle);
    }
  };

  const handleRemoveTodoById = async (id: number): Promise<boolean> => {
    setUpdatedTodosId(prev => [...prev, id]);
    let success = false;

    try {
      await removeTodo(id);

      setTodos(prev => prev.filter(el => el.id != id));
      inputRef.current?.focus();
      success = true;
    } catch {
      handleSetError(ErrorType.UnableToDelete);
    } finally {
      setUpdatedTodosId(prev => prev.filter(el => el != id));
    }

    return success;
  };

  const handleRemoveAllComplited = () => {
    const todosToRemoveIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setUpdatedTodosId(todosToRemoveIds);

    todosToRemoveIds.map(id => {
      handleRemoveTodoById(id);
    });
  };

  const deactivateClearAllButton = () => {
    return !todos.some(todo => todo.completed);
  };

  const isAllTodosCompleted = () => {
    if (todos.length === 0) {
      return false;
    }

    return todos.every(todo => todo.completed);
  };

  const handleUpdate = async (
    id: number,
    data: OptionalAttributes<Todo>,
  ): Promise<boolean> => {
    setUpdatedTodosId(prev => [...prev, id]);
    let success = false;

    try {
      const response = await updateTodo(id, data);

      setTodos(prev => prev.map(todo => (todo.id === id ? response : todo)));

      success = true;
    } catch {
      handleSetError(ErrorType.UnableToUpdate);
    } finally {
      setUpdatedTodosId(prev => prev.filter(el => el !== id));
    }

    return success;
  };

  const handleToggle = (id: number) => {
    handleUpdate(id, {
      completed: !todos.find(todo => todo.id === id)?.completed ?? false,
    });
  };

  const handleToggleAll = () => {
    const status = !isAllTodosCompleted();

    todos.map(todo => {
      if (todo.completed !== status) {
        handleUpdate(todo.id, { completed: status });
      }
    });
  };

  const handleSetFailedTitleUpdateId = (id: number) => {
    setFailedTitleUpdateId(id);
  };

  const handleUpdateTitle = async (id: number, newTitle: string) => {
    const success = await handleUpdate(id, { title: newTitle });

    if (!success) {
      handleSetFailedTitleUpdateId(id);
    }
  };

  const handleRemoveEmptyTodo = async (id: number) => {
    handleRemoveTodoById(id);

    const success = await handleRemoveTodoById(id);

    if (!success) {
      handleSetFailedTitleUpdateId(id);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <MyInput
          ref={inputRef}
          onSubmit={handleSubmit}
          isAllTodosCompleted={isAllTodosCompleted}
          onToggleAll={handleToggleAll}
          todosLength={todos.length}
        />

        {filteredTodos?.length > 0 && (
          <TodosList
            todos={filteredTodos}
            tmpTodo={tmpTodo}
            updatedTodosId={updatedTodosId}
            onRemove={handleRemoveTodoById}
            onToggle={handleToggle}
            onUpdateTitle={handleUpdateTitle}
            failedTitleUpdateId={failedTitleUpdateId}
            onSetFailedTitleUpdateId={handleSetFailedTitleUpdateId}
            onRemoveEmptyTodo={handleRemoveEmptyTodo}
          />
        )}

        {todos?.length > 0 && (
          <Footer
            onSetQuery={handleSetQuery}
            query={query}
            leftTodos={returnLeftNumber}
            deactivateClearAllButton={deactivateClearAllButton}
            onRemoveAllComplited={handleRemoveAllComplited}
          />
        )}
      </div>
      <ErrorNotification error={error} onSetError={handleSetError} />
    </div>
  );
};
