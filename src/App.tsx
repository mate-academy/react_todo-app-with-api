/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo, Status, ErrorMsg } from './types/Todo';
import cn from 'classnames';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const newTodoFaild = useRef<HTMLInputElement>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [updatingTodoId, setUpdatingTodoId] = useState<number | null>(null);
  const [listOfUpdatedTodos, setListOfUpdatedTodos] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const filterdTodos = todos.filter(todo => {
    switch (status) {
      case Status.Active:
        return !todo.completed;
      case Status.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  useEffect(() => {
    if (!hasError) {
      return;
    }

    const timer = setTimeout(() => {
      setHasError(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [hasError]);
  useEffect(() => {
    setHasError(false);
    getTodos()
      .then(setTodos)
      .catch(() => {
        setHasError(true);
        setErrorMsg(ErrorMsg.Loading);
      });
  }, []);

  useEffect(() => {
    if (!isAdding) {
      newTodoFaild.current?.focus();
    }
  }, [isAdding]);
  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSudmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (newTodoTitle.trim()) {
      try {
        const newTempTodo: Todo = {
          id: 0,
          userId: USER_ID,
          title: newTodoTitle.trim(),
          completed: false,
        };

        setTempTodo(newTempTodo);

        setIsAdding(true);
        const newTodo = await addTodo(newTodoTitle.trim());

        setTodos(currentTodos => [...currentTodos, newTodo]);

        setTempTodo(null);

        setNewTodoTitle('');
      } catch {
        setErrorMsg(ErrorMsg.Adding);
        setHasError(true);
        setTempTodo(null);
      } finally {
        setIsAdding(false);
      }
    } else {
      setErrorMsg(ErrorMsg.EmptyTitle);
      setHasError(true);
    }
  };

  const handleDelete = async (todoID: number) => {
    setDeletingTodoId(todoID);
    try {
      await deleteTodo(todoID);
      setTodos(todos.filter(todo => todo.id !== todoID));

      return true;
    } catch {
      setErrorMsg(ErrorMsg.Deleting);
      setHasError(true);

      return false;
    } finally {
      setDeletingTodoId(null);
      setIsAdding(false);
      newTodoFaild.current?.focus();
    }
  };

  const handleCleareComplite = async () => {
    const compleredTodos = todos.filter(todo => todo.completed);
    const results = await Promise.allSettled(
      compleredTodos.map(todo => deleteTodo(todo.id)),
    );

    newTodoFaild.current?.focus();

    const hasFailed = results.some(result => result.status === 'rejected');

    setTodos(currentTodos =>
      currentTodos.filter((todo, index) => {
        if (!todo.completed) {
          return true;
        }

        return results[index]?.status === 'rejected';
      }),
    );

    if (hasFailed) {
      setErrorMsg(ErrorMsg.Deleting);

      setHasError(true);
    }
  };

  const handleToggle = async (todoID: number, completed: boolean) => {
    try {
      setUpdatingTodoId(todoID);
      await updateTodo(todoID, { completed: !completed });
      setTodos(
        todos.map(todo => {
          if (todo.id === todoID) {
            return {
              ...todo,
              completed: completed,
            };
          }

          return todo;
        }),
      );
    } catch {
      setErrorMsg(ErrorMsg.Updating);
      setHasError(true);
    } finally {
      setUpdatingTodoId(null);
    }
  };

  const handleToggleAll = async () => {
    const completedAll = todos.every(todo => todo.completed);
    const newCompleted = !completedAll;
    const needsToBeUpdated = todos.filter(
      newTodos => newCompleted !== newTodos.completed,
    );

    try {
      setListOfUpdatedTodos(needsToBeUpdated.map(todo => todo.id));

      await Promise.all(
        needsToBeUpdated.map(todo =>
          updateTodo(todo.id, { completed: newCompleted }),
        ),
      );

      setTodos(
        todos.map(todo => {
          if (
            needsToBeUpdated.some(updatedTodo => updatedTodo.id === todo.id)
          ) {
            return {
              ...todo,
              completed: newCompleted,
            };
          }

          return todo;
        }),
      );
    } catch {
      setHasError(true);
      setErrorMsg(ErrorMsg.Updating);
    } finally {
      setListOfUpdatedTodos([]);
    }
  };

  const handleEdit = async (todoID: number, title: string) => {
    try {
      setUpdatingTodoId(todoID);
      await updateTodo(todoID, { title });
      setTodos(
        todos.map(todo => {
          if (todoID === todo.id) {
            return {
              ...todo,
              title: title,
            };
          }

          return todo;
        }),
      );

      return true;
    } catch {
      setHasError(true);
      setErrorMsg(ErrorMsg.Updating);

      return false;
    } finally {
      setUpdatingTodoId(null);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          handleSudmit={handleSudmit}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          isAdding={isAdding}
          newTodoFaild={newTodoFaild}
          handleToggleAll={handleToggleAll}
        />
        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {/* This is a completed todo */}
            <TodoList
              filterdTodos={filterdTodos}
              onToggle={handleToggle}
              onDelete={handleDelete}
              deletingTodoId={deletingTodoId}
              updatingTodoId={updatingTodoId}
              listOfUpdatedTodos={listOfUpdatedTodos}
              editingTodoId={editingTodoId}
              onEdit={setEditingTodoId}
              onEditing={handleEdit}
            />
            {tempTodo && (
              <div data-cy="Todo" className="todo">
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={false}
                    disabled
                    readOnly
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {tempTodo.title}
                </span>

                {/* Remove button appears only on hover */}
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  disabled
                >
                  ×
                </button>

                {/* overlay will cover the todo while it is being deleted or updated */}
                <div
                  data-cy="TodoLoader"
                  className={cn('modal overlay', {
                    'is-active': tempTodo !== null,
                  })}
                >
                  <div
                    className="modal-background
                has-background-white-ter"
                  />
                  <div className="loader" />
                </div>
              </div>
            )}
          </section>
        )}
        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            setStatus={setStatus}
            handleCleareComplite={handleCleareComplite}
            status={status}
          />
        )}
        {/* DON'T use conditional rendering to hide the notification */}
        {/* DON'T use conditional rendering to hide the notification */}
        {/* Add the 'hidden' class to hide the message smoothly */}
      </div>
      <ErrorNotification
        hasError={hasError}
        errorMsg={errorMsg}
        setHasError={setHasError}
      />
    </div>
  );
};
