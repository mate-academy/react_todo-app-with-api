/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const visibleTodos = todos.filter(todo => {
    switch (status) {
      case Status.Active:
        return !todo.completed;

      case Status.Completed:
        return todo.completed;

      case Status.All:
      default:
        return true;
    }
  });

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, []);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.Load);
      });
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage(ErrorMessage.TitleEmpty);

      return;
    }

    setIsSubmitting(true);
    setTempTodo({
      id: 0,
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    });

    createTodo({
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    })
      .then(newTodo => {
        setTitle('');
        setTodos(prevTodo => [...prevTodo, newTodo]);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Add);
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  }

  function handleDeleteTodo(todoId: number) {
    setErrorMessage('');
    setLoadingTodoIds(prevIds => [...prevIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
      })
      .finally(() => {
        setLoadingTodoIds(prevIds => prevIds.filter(id => id !== todoId));
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  }

  async function handleClearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setErrorMessage('');

    const completedIds = completedTodos.map(todo => todo.id);

    setLoadingTodoIds(prevIds => [...prevIds, ...completedIds]);

    try {
      await Promise.all(
        completedTodos.map(todo =>
          deleteTodo(todo.id).then(() => {
            setTodos(prevTodos =>
              prevTodos.filter(item => item.id !== todo.id),
            );
          }),
        ),
      );
    } catch {
      setErrorMessage(ErrorMessage.Delete);
    } finally {
      setLoadingTodoIds(prevIds =>
        prevIds.filter(id => !completedIds.includes(id)),
      );
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }

  function handleUpdateTodo(updatedTodo: Todo) {
    setErrorMessage('');
    setLoadingTodoIds(prevIds => [...prevIds, updatedTodo.id]);

    return updateTodo(updatedTodo)
      .then(returnedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === returnedTodo.id ? returnedTodo : todo,
          ),
        );
      })
      .catch(error => {
        setErrorMessage(ErrorMessage.Update);
        throw error;
      })
      .finally(() => {
        setLoadingTodoIds(prevIds =>
          prevIds.filter(id => id !== updatedTodo.id),
        );
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  }

  async function toggleTodos() {
    setErrorMessage('');

    const isAllCompleted = todos.every(todo => todo.completed);
    const targetStatus = !isAllCompleted;
    const todoUpdate = todos.filter(todo => todo.completed !== targetStatus);

    try {
      const updatePromises = todoUpdate.map(todo =>
        handleUpdateTodo({ ...todo, completed: targetStatus }),
      );

      await Promise.all(updatePromises);
    } catch (error) {
      setErrorMessage(ErrorMessage.Update);
    }
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {(todos.length > 0 || tempTodo) && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: todos.length > 0 && todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
              onClick={toggleTodos}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={isSubmitting}
              ref={inputRef}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDelete={handleDeleteTodo}
              loadingTodoIds={loadingTodoIds}
              onUpdate={handleUpdateTodo}
            />

            <Footer
              todos={todos}
              status={status}
              onStatusChange={setStatus}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
