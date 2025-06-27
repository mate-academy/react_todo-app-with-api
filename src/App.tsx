import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodos,
  getTodos,
  USER_ID,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './ErrorMessage';
import { Footer } from './Footer';
import { TodoList } from './TodoList';
import classNames from 'classnames';

export type TodoInput = Omit<Todo, 'id'>;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const justAddedRef = useRef(true);
  const allCompleted = todos?.length && todos.every(todo => todo.completed);

  const clearError = () => {
    setError('');
  };

  useEffect(() => {
    getTodos()
      .then(data => {
        setTodos(data ?? null);
      })
      .catch(() => setError('load'));
  }, []);

  useEffect(() => {
    if (justAddedRef.current) {
      inputRef.current?.focus();
      justAddedRef.current = false; // zresetuj flagę
    }
  }, [todos]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim().length === 0) {
      setError('empty title');

      return;
    }

    setIsLoading(true);

    setTempTodo({
      id: 0,
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    });

    addTodos({
      id: 0,
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    })
      .then(newTodoFromAPI => {
        setTodos(prev => (prev ? [...prev, newTodoFromAPI] : [newTodoFromAPI]));
        setTitle('');
        justAddedRef.current = true;
      })
      .catch(() => {
        setError('add');
        setTimeout(() => inputRef.current?.focus(), 0);
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  };

  const handleFilter = (): Todo[] | null => {
    if (!todos) {
      return null;
    }

    if (filter === 'active') {
      return todos.filter(t => !t.completed);
    }

    if (filter === 'completed') {
      return todos.filter(t => t.completed);
    }

    return todos;
  };

  const delTodo = (todoId: number) => {
    setIsLoading(true);
    setLoadingIds(prev => [...prev, todoId]);
    deleteTodo(todoId)
      .then(() => {
        if (todos) {
          const updatedTodos = todos.filter(todo => todo.id !== todoId);

          setTodos(updatedTodos);
          justAddedRef.current = true;
        }

        setLoadingIds(prev => prev.filter(id => id !== todoId));
      })
      .catch(() => {
        setError('delete');
        setLoadingIds(prev => prev.filter(id => id !== todoId));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteCompletedTodos = () => {
    setIsLoading(true);

    if (!todos) {
      return;
    }

    const completedTodos = todos.filter(todo => todo.completed === true);
    const completedTodosIds = completedTodos.map(todo => todo.id);

    setLoadingIds(prev => [...prev, ...completedTodosIds]);

    Promise.allSettled(
      completedTodosIds.map(todoIdCompleted =>
        deleteTodo(todoIdCompleted).then(() => {
          setTodos(
            currentTodos =>
              currentTodos &&
              currentTodos.filter(
                currentTodo => currentTodo.id !== todoIdCompleted,
              ),
          );
          setLoadingIds(prev => prev.filter(id => id !== todoIdCompleted));
          justAddedRef.current = true;
        }),
      ),
    )
      .then(results => {
        const hasError = results.some(r => r.status === 'rejected');

        if (hasError) {
          setError('delete');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const checkTodo = (todoId: number) => {
    setIsLoading(true);
    setLoadingIds(prev => [...prev, todoId]);

    const todoToUpdate = todos?.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      setIsLoading(false);
      setLoadingIds(prev => prev.filter(id => id !== todoId));

      return;
    }

    const newCompletedStatus = !todoToUpdate.completed;

    updateTodo(todoId, { completed: newCompletedStatus })
      .then(() => {
        setTodos(prev => {
          if (!prev) {
            return null;
          }

          return prev.map(todo =>
            todo.id === todoId
              ? { ...todo, completed: newCompletedStatus }
              : todo,
          );
        });
        setLoadingIds(prev => prev.filter(id => id !== todoId));
      })
      .catch(() => {
        setError('update');
        setLoadingIds(prev => prev.filter(id => id !== todoId));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const checkAllTodos = () => {
    if (!todos) {
      return;
    }

    const allCompletedTodos = todos.every(todo => todo.completed);
    const newCompletedStatus = !allCompletedTodos;

    setIsLoading(true);

    Promise.all(
      todos
        .filter(todo => todo.completed === !newCompletedStatus)
        .map(todo => {
          setLoadingIds(prev => [...prev, todo.id]);
          updateTodo(todo.id, { completed: newCompletedStatus });
        }),
    )
      .then(() => {
        setTodos(prev => {
          if (!prev) {
            return null;
          }

          return prev.map(todo => ({
            ...todo,
            completed: newCompletedStatus,
          }));
        });
        todos.map(todo => {
          setLoadingIds(prev => prev.filter(id => id !== todo.id));
        });
      })
      .catch(() => {
        setError('update');
        todos.map(todo => {
          setLoadingIds(prev => prev.filter(id => id !== todo.id));
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const changeTitle = async (
    todoId: number,
    newTitle: string,
  ): Promise<boolean> => {
    setIsLoading(true);
    setLoadingIds(prev => [...prev, todoId]);

    const todoToUpdate = todos?.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      setIsLoading(false);
      setLoadingIds(prev => prev.filter(id => id !== todoId));

      return false;
    }

    try {
      await updateTodo(todoId, { title: newTitle });

      setTodos(prev => {
        if (!prev) {
          return null;
        }

        return prev.map(todo =>
          todo.id === todoId ? { ...todo, title: newTitle } : todo,
        );
      });

      return true;
    } catch {
      setError('update');

      return false;
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todoId));
      setIsLoading(false);
    }
  };

  const finalTodos: Todo[] | null = handleFilter();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos && todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: allCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={() => checkAllTodos()}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => {
                setTitle(e.target.value);
              }}
              disabled={isLoading}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todos={finalTodos}
            tempTodo={tempTodo}
            loadingIds={loadingIds}
            onDeleted={delTodo}
            isLoading={isLoading}
            onChecked={checkTodo}
            onUpdated={changeTitle}
          />
        </section>

        {todos && todos.length > 0 && (
          <Footer
            filter={filter}
            filterTodos={todos}
            setFilter={setFilter}
            deleteCompleted={deleteCompletedTodos}
          />
        )}
      </div>
      <ErrorMessage error={error} onClear={clearError} />
    </div>
  );
};
