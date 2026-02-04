/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { ErrorMessage } from './types/ErrorMessage';
import { getVisibleTodos, getActiveTodos } from './utils/todoHelpers';
import { TodoItem } from './components/TodoItem';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.Empty,
  );
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const todoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.Load));
  }, []);

  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, filter),
    [todos, filter],
  );
  const activeTodosCount = useMemo(() => getActiveTodos(todos).length, [todos]);
  const isAllCompleted = useMemo(
    () => todos.length > 0 && todos.every(todo => todo.completed),
    [todos],
  );
  const hasCompleted = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.Title);

      return;
    }

    setIsLoading(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    createTodo({ title: trimmedTitle, completed: false, userId: USER_ID })
      .then(newTodo => {
        setTodos(current => [...current, newTodo]);
        setTitle('');
        todoInputRef.current?.focus();
      })
      .catch(() => setErrorMessage(ErrorMessage.Add))
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setProcessingIds(current => [...current, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
        todoInputRef.current?.focus();
      })
      .catch(error => {
        setErrorMessage(ErrorMessage.Delete);
        throw error;
      })
      .finally(() => {
        setProcessingIds(current => current.filter(id => id !== todoId));
      });
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setProcessingIds(current => [...current, updatedTodo.id]);

    return updateTodo(updatedTodo)
      .then(res => {
        setTodos(current =>
          current.map(t => (t.id === updatedTodo.id ? res : t)),
        );
      })
      .catch(error => {
        setErrorMessage(ErrorMessage.Update);
        throw error;
      })
      .finally(() => {
        setProcessingIds(current =>
          current.filter(id => id !== updatedTodo.id),
        );
      });
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);

    todos
      .filter(todo => todo.completed === allCompleted)
      .forEach(todo => handleUpdateTodo({ ...todo, completed: !allCompleted }));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todos={todos}
          isAllCompleted={isAllCompleted}
          title={title}
          setTitle={setTitle}
          onAddTodo={handleAddTodo}
          isAdding={isLoading}
          todoInputRef={todoInputRef}
          onToggleAll={handleToggleAll}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={handleDeleteTodo}
              onUpdate={handleUpdateTodo}
              isLoading={processingIds.includes(todo.id)}
            />
          ))}
          {tempTodo && <TodoItem todo={tempTodo} isLoading={true} />}
        </section>

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            filter={filter}
            setFilter={setFilter}
            hasCompleted={hasCompleted}
            onClearCompleted={() =>
              todos
                .filter(t => t.completed)
                .forEach(t => handleDeleteTodo(t.id))
            }
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage(ErrorMessage.Empty)}
      />
    </div>
  );
};
