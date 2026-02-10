/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoError } from './types/TodoErrors';
import { TodoFilter } from './types/TodoFilter';
import { TodoItem } from './components/TodoItem';
import { HeaderTodo } from './components/HeaderTodo';
import { FooterTodo } from './components/FooterTodo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<TodoError>(TodoError.None);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.All);
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [processingId, setProcessingId] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const hideError = () => setErrorMessage(TodoError.None);
  const allCompleted =
    Boolean(todos.length) && todos.every(todo => todo.completed);
  const activeCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  useEffect(() => {
    hideError();
    setLoading(true);

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(TodoError.LoadTodos))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (errorMessage === TodoError.None) {
      return;
    }

    const timer = setTimeout(() => {
      hideError();
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding, processingId]);

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case TodoFilter.Active:
        return !todo.completed;
      case TodoFilter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    hideError();
  };

  async function handleAddTodo(newTodo: Omit<Todo, 'id'>) {
    setTempTodo({ ...newTodo, id: 0 });
    setIsAdding(true);
    hideError();

    try {
      const savedTodo = await todoService.addTodo(newTodo);

      setTodos(currentTodos => [...currentTodos, savedTodo]);

      setTitle('');
    } catch {
      setErrorMessage(TodoError.AddTodo);
    } finally {
      setIsAdding(false);
      setTempTodo(null);
    }
  }

  async function handleDeleteTodo(todoId: number) {
    setProcessingId(ids => [...ids, todoId]);

    try {
      await todoService.deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(TodoError.DeleteTodo);
      throw new Error();
    } finally {
      setProcessingId(ids => ids.filter(id => id !== todoId));
    }
  }

  async function handleToggleTodo(todoToUpdate: Todo) {
    setProcessingId(ids => [...ids, todoToUpdate.id]);

    try {
      const toggledTodo = await todoService.updateTodo({
        ...todoToUpdate,
        completed: !todoToUpdate.completed,
      });

      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === toggledTodo.id ? toggledTodo : todo,
        ),
      );
    } catch {
      setErrorMessage(TodoError.UpdateTodo);
    } finally {
      setProcessingId(ids => ids.filter(id => id !== todoToUpdate.id));
    }
  }

  async function handleUpdateTitle(todoUpdate: Todo, newTitle: string) {
    if (newTitle === '') {
      return handleDeleteTodo(todoUpdate.id);
    }

    if (newTitle === todoUpdate.title) {
      return;
    }

    setProcessingId(ids => [...ids, todoUpdate.id]);

    try {
      const updatedTodo = await todoService.updateTodo({
        ...todoUpdate,
        title: newTitle,
      });

      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      );
    } catch {
      setErrorMessage(TodoError.UpdateTodo);
      throw new Error();
    } finally {
      setProcessingId(ids => ids.filter(id => id !== todoUpdate.id));
    }
  }

  function handleToggleAll() {
    todos
      .filter(todo => todo.completed === allCompleted)
      .forEach(handleToggleTodo);
  }

  function handleClearCompleted() {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        return handleDeleteTodo(todo.id);
      });
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setErrorMessage(TodoError.EmptyTitle);

      return;
    }

    handleAddTodo({
      userId: todoService.USER_ID,
      title: normalizedTitle,
      completed: false,
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <HeaderTodo
          allCompleted={allCompleted}
          hasTodos={!loading && Boolean(todos.length)}
          inputRef={inputRef}
          title={title}
          isAdding={isAdding}
          onSubmit={handleSubmit}
          onTitleChange={handleTitleChange}
          onToggleAll={handleToggleAll}
        />

        {!loading && Boolean(todos.length) && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {visibleTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  isProcessing={processingId.includes(todo.id)}
                  onDelete={() => handleDeleteTodo(todo.id)}
                  onToggle={() => handleToggleTodo(todo)}
                  onUpdateTitle={newTitle => handleUpdateTitle(todo, newTitle)}
                />
              ))}
              {tempTodo && <TodoItem todo={tempTodo} isProcessing={isAdding} />}
            </section>

            <FooterTodo
              activeCount={activeCount}
              filter={filter}
              hasCompleted={hasCompleted}
              onFilterChange={setFilter}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />
        {errorMessage}
      </div>
    </div>
  );
};
