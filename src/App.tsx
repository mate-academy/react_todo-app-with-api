import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';

import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { getTodos, addTodo, deleteTodo, updateTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoFilter, FilterValue } from './components/TodoFilter';
import { ErrorNotification } from './components/ErrorNotification';
import { UserWarning } from './UserWarning';

const USER_ID = 2425;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterValue>('all');
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const activeUserId = (() => {
    try {
      const user = localStorage.getItem('user');

      return user ? JSON.parse(user).id : USER_ID;
    } catch {
      return USER_ID;
    }
  })();

  useEffect(() => {
    if (!activeUserId) {
      return;
    }

    getTodos(activeUserId)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.Load);
      });
  }, [activeUserId]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, tempTodo]);

  if (!activeUserId) {
    return <UserWarning />;
  }

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    const optimisticTodo: Todo = {
      id: 0,
      userId: activeUserId,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(optimisticTodo);
    setIsAdding(true);
    setErrorMessage(null);

    addTodo({ userId: activeUserId, title: trimmedTitle, completed: false })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setNewTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
        inputRef.current?.focus();
      });
  };

  const handleDeleteTodo = (todoId: number): Promise<void> => {
    setLoadingTodoIds(prev => [...prev, todoId]);
    setErrorMessage(null);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(err => {
        setErrorMessage(ErrorMessage.Delete);
        throw err;
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
        inputRef.current?.focus();
      });
  };

  const handleUpdateTodo = (
    todoId: number,
    data: Partial<Todo>,
  ): Promise<void> => {
    setLoadingTodoIds(prev => [...prev, todoId]);
    setErrorMessage(null);

    return updateTodo(todoId, data)
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );
      })
      .catch(err => {
        setErrorMessage(ErrorMessage.Update);
        throw err;
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
        inputRef.current?.focus();
      });
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(t => t.completed);
    const targetCompleted = !allCompleted;
    const todosToUpdate = todos.filter(t => t.completed !== targetCompleted);

    todosToUpdate.forEach(todo => {
      handleUpdateTodo(todo.id, { completed: targetCompleted }).catch(() => {});
    });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(t => t.completed);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id).catch(() => {});
    });
  };

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const allCompleted = todos.length > 0 && todos.every(t => t.completed);
  const activeTodosCount = todos.filter(t => !t.completed).length;
  const completedTodosCount = todos.filter(t => t.completed).length;
  const activeCountText = `${activeTodosCount} ${
    activeTodosCount === 1 ? 'item' : 'items'
  } left`;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: allCompleted,
              })}
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={inputRef}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              loadingTodoIds={loadingTodoIds}
              onDelete={handleDeleteTodo}
              onUpdate={handleUpdateTodo}
            />

            {todos.length > 0 && (
              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="TodosCounter">
                  {activeCountText}
                </span>

                <TodoFilter filter={filter} onChange={setFilter} />

                <button
                  data-cy="ClearCompletedButton"
                  type="button"
                  className="todoapp__clear-completed"
                  disabled={completedTodosCount === 0}
                  onClick={handleClearCompleted}
                >
                  Clear completed
                </button>
              </footer>
            )}
          </>
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
};
