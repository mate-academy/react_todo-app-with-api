import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MessageError, StatusFilter, Todo } from '../types/Todo';

import * as todoService from '../api/todos';
import { TodoHeader } from './TodoHeader';
import { TodoMain } from './TodoMain';
import { TodoFooter } from './TodoFooter';
import { ErrorNotification } from './ErrorNotification/ErrorNotification';

export const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessege, setErrorMessege] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    StatusFilter.All,
  );

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  const focusInput = useRef<() => void>();

  const focusInputFn = useCallback((fn: () => void) => {
    focusInput.current = fn;
  }, []);

  useEffect(() => {
    setErrorMessege('');

    todoService
      .getTodos()
      .then(loadingTodos => {
        setTodos(loadingTodos);

        focusInput.current?.();
      })
      .catch(() => {
        setErrorMessege('Unable to load todos');
      });
  }, []);

  const visibleTodos = todos.filter(todo => {
    return (
      statusFilter === StatusFilter.All ||
      (statusFilter === StatusFilter.Active && !todo.completed) ||
      (statusFilter === StatusFilter.Completed && todo.completed)
    );
  });

  function addTodos({
    title,
    completed,
    userId,
  }: Omit<Todo, 'id'>): Promise<void> {
    setErrorMessege('');

    const newTemptodo: Todo = {
      id: -1,
      title,
      completed,
      userId,
    };

    setTempTodo(newTemptodo);

    return todoService
      .creatTodos({ title, completed, userId })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);

        focusInput.current?.();
      })
      .catch(error => {
        setTempTodo(null);
        setErrorMessege(MessageError.add);

        throw error;
      })
      .finally(() => {});
  }

  function deleteTodos(id: number) {
    setErrorMessege('');
    setDeletingIds(prev => new Set(prev).add(id));

    return todoService
      .deleteTodos(id)
      .then(() => {
        setTodos(preventTodos => preventTodos.filter(todo => todo.id !== id));

        focusInput.current?.();
      })
      .catch(error => {
        setErrorMessege(MessageError.delete);
        focusInput.current?.();

        throw error;
      })
      .finally(() => {
        setDeletingIds(prev => {
          const next = new Set(prev);

          next.delete(id);

          return next;
        });
      });
  }

  function updateTodos(updateTodo: Todo) {
    setErrorMessege('');
    setDeletingIds(prev => new Set(prev).add(updateTodo.id));

    return todoService
      .updateTodos(updateTodo)
      .then(todo => {
        setTodos(currentTodos => {
          const newTodo = [...currentTodos];
          const index = newTodo.findIndex(post => post.id === updateTodo.id);

          newTodo.splice(index, 1, todo);

          return newTodo;
        });
      })
      .catch(error => {
        setErrorMessege(MessageError.update);

        throw error;
      })
      .finally(() => {
        setDeletingIds(prev => {
          const next = new Set(prev);

          next.delete(updateTodo.id);

          return next;
        });
      });
  }

  async function toggleAll() {
    const allCompleted = todos.every(todo => todo.completed);

    const updates = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    try {
      await Promise.all(
        updates
          .filter((t, i) => {
            return t.completed !== todos[i].completed;
          })
          .map(t =>
            updateTodos(t).catch(error => {
              setErrorMessege(MessageError.update);
              throw error;
            }),
          ),
      );

      setTodos(updates);
    } catch {
      setErrorMessege(MessageError.update);
    }
  }

  async function handleClearCompleted() {
    try {
      setErrorMessege('');

      const completedTodos = todos.filter(todo => todo.completed);

      setDeletingIds(prev => {
        const next = new Set(prev);

        completedTodos.forEach(t => next.add(t.id));

        return next;
      });

      const results = await Promise.allSettled(
        completedTodos.map(todo => todoService.deleteTodos(todo.id)),
      );

      const failedIds = results
        .map((result, i) =>
          result.status === 'rejected' ? completedTodos[i].id : null,
        )
        .filter(Boolean);

      setTodos(currentTodos =>
        currentTodos.filter(
          todo => !todo.completed || failedIds.includes(todo.id),
        ),
      );

      focusInput.current?.();

      if (failedIds.length) {
        setErrorMessege(MessageError.delete);
      } else {
        setErrorMessege('');
      }

      setDeletingIds(new Set());
    } catch (err) {
      setErrorMessege(MessageError.SomethingWentWrong);
      focusInput.current?.();
      setDeletingIds(new Set());
    }
  }

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (errorMessege) {
      timer = setTimeout(() => {
        setErrorMessege('');
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [errorMessege]);

  return (
    <>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>
        <div className="todoapp__content">
          <TodoHeader
            todos={todos}
            onSubmit={addTodos}
            setErrorMessege={setErrorMessege}
            focusInputFn={focusInputFn}
            toggleAll={toggleAll}
            updateTodos={updateTodos}
          />
          {todos && (
            <TodoMain
              visibleTodos={visibleTodos}
              tempTodo={tempTodo}
              onDelete={deleteTodos}
              deletingIds={deletingIds}
              updateTodos={updateTodos}
              setErrorMessege={setErrorMessege}
            />
          )}
          {todos && (
            <TodoFooter
              setStatusFilter={setStatusFilter}
              handleClearCompleted={handleClearCompleted}
              todos={todos}
            />
          )}
        </div>
        <ErrorNotification messege={errorMessege} />
      </div>
    </>
  );
};
