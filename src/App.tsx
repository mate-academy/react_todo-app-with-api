/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  createTodo,
  deleteTodo as deleteTodoRequest,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Filter } from './types/Filter';
import { Header } from './components/Header';

export enum ErrorMessage {
  None = '',
  Load = 'Unable to load todos',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Update = 'Unable to update a todo',
  Empty = 'Title should not be empty',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [error, setError] = useState<ErrorMessage>(ErrorMessage.None);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [title, setTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorMessage.Load));
  }, []);

  useEffect(() => {
    if (!tempTodo && processingIds.length === 0) {
      inputRef.current?.focus();
    }
  }, [tempTodo, processingIds]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filterTodos = (todo: Todo) => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      case Filter.All:
      default:
        return true;
    }
  };

  const visibleTodos = todos.filter(filterTodos);

  const shouldShowList = visibleTodos.length > 0 || tempTodo;

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = title.trim();

    if (!trimmed) {
      setError(ErrorMessage.Empty);

      return;
    }

    const newTodo = {
      title: trimmed,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo as Todo);

    createTodo(newTodo as Todo)
      .then(todoFromServer => {
        setTodos(prev => [...prev, todoFromServer]);
        setTitle('');
      })
      .catch(() => setError(ErrorMessage.Add))
      .finally(() => setTempTodo(null));
  };

  const handleDelete = (id: number) => {
    setProcessingIds(prevIds => [...prevIds, id]);

    deleteTodoRequest(id)
      .then(() =>
        setTodos(prevTodos => prevTodos.filter(todoItem => todoItem.id !== id)),
      )
      .catch(() => setError(ErrorMessage.Delete))
      .finally(() =>
        setProcessingIds(prevIds =>
          prevIds.filter(processingId => processingId !== id),
        ),
      );
  };

  const handleToggle = (todo: Todo) => {
    setProcessingIds(prevIds => [...prevIds, todo.id]);

    updateTodo({ ...todo, completed: !todo.completed })
      .then(updated =>
        setTodos(prevTodos =>
          prevTodos.map(todoItem =>
            todoItem.id === updated.id ? updated : todoItem,
          ),
        ),
      )
      .catch(() => setError(ErrorMessage.Update))
      .finally(() =>
        setProcessingIds(prevIds =>
          prevIds.filter(processingId => processingId !== todo.id),
        ),
      );
  };

  const handleRename = (todo: Todo, newTitle: string) => {
    setProcessingIds(prevIds => [...prevIds, todo.id]);

    return updateTodo({ ...todo, title: newTitle })
      .then(updated =>
        setTodos(prevTodos =>
          prevTodos.map(todoItem =>
            todoItem.id === updated.id ? updated : todoItem,
          ),
        ),
      )
      .catch(err => {
        setError(ErrorMessage.Update);
        throw err;
      })
      .finally(() =>
        setProcessingIds(prevIds =>
          prevIds.filter(processingId => processingId !== todo.id),
        ),
      );
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);

    todos.forEach(todo => {
      if (todo.completed === allCompleted) {
        handleToggle(todo);
      }
    });
  };

  const handleClearCompleted = () => {
    todos.filter(todo => todo.completed).forEach(todo => handleDelete(todo.id));
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const activeCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const hasCompleted = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          title={title}
          setTitle={setTitle}
          onSubmit={handleAddTodo}
          tempTodo={tempTodo}
          inputRef={inputRef}
          error={error}
          setError={setError}
          onToggleAll={handleToggleAll}
        />

        {shouldShowList && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            processingIds={processingIds}
            onDelete={handleDelete}
            onToggle={handleToggle}
            onRename={handleRename}
          />
        )}

        {Boolean(todos.length) && (
          <Footer
            activeCount={activeCount}
            todos={todos}
            hasCompletedTodos={hasCompleted}
            onClearCompleted={handleClearCompleted}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>

      <ErrorNotification
        error={error}
        onClose={() => setError(ErrorMessage.None)}
      />
    </div>
  );
};
