/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';
import { ErrorType } from './types/ErrorType';

function getFilteredTodos(
  currentTodos: Todo[],
  currentFilter: 'all' | 'active' | 'completed',
) {
  const filteredTodos = [...currentTodos];

  switch (currentFilter) {
    case 'active':
      return filteredTodos.filter(todo => !todo.completed);

    case 'completed':
      return filteredTodos.filter(todo => todo.completed);

    case 'all':
      return filteredTodos;

    default:
      return;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorType | ''>('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setIsLoading(true);

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddTodo = async (title: string) => {
    if (!title.trim()) {
      setError('Title should not be empty');

      return;
    }

    setIsLoading(true);

    const newTempTodo: Todo = {
      id: 0,
      title: title.trim(),
      completed: false,
      userId: todoService.USER_ID,
    };

    setTempTodo(newTempTodo);
    setUpdatingTodoIds(ids => [...ids, 0]);

    todoService
      .addTodo({
        userId: todoService.USER_ID,
        title: title.trim(),
        completed: false,
      })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setInputValue('');
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
        setUpdatingTodoIds(ids => ids.filter(id => id !== 0));
      });
  };

  const handleDeleteTodo = async (todoId: number) => {
    setIsLoading(true);
    setUpdatingTodoIds(ids => [...ids, todoId]);

    try {
      await todoService.deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setIsLoading(false);
      setUpdatingTodoIds(ids => ids.filter(id => id !== todoId));
    }
  };

  const handleDeleteCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    return Promise.allSettled(
      completedTodos.map(todo => handleDeleteTodo(todo.id).then(() => todo)),
    )
      .then(values => {
        values.map(value1 => {
          if (value1.status === 'rejected') {
            setError('Unable to delete a todo');
          } else {
            setTodos((currentTodos: Todo[]) => {
              const todoId = value1.value as Todo;

              return currentTodos.filter(todo1 => todo1.id !== todoId.id);
            });
          }
        });
      })
      .finally(() => {});
  };

  const handleToggleTodo = async (todo: Todo) => {
    setIsLoading(true);
    setUpdatingTodoIds(ids => [...ids, todo.id]);

    try {
      const updatedTodo = await todoService.updateCompleted(
        todo.id,
        !todo.completed,
      );

      setTodos(currentTodos =>
        currentTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
      );
    } catch {
      setError('Unable to update a todo');
    } finally {
      setIsLoading(false);
      setUpdatingTodoIds(ids => ids.filter(id => id !== todo.id));
    }
  };

  const handleToggleAll = async (value: boolean) => {
    const notCompletedTodos = todos.filter(todo => !todo.completed);
    const areAllCompleted = todos.every(todo => todo.completed === true);

    if (value && !areAllCompleted) {
      return Promise.allSettled(
        notCompletedTodos.map(todo => handleToggleTodo(todo).then(() => todo)),
      )
        .then(values => {
          values.map(value1 => {
            if (value1.status === 'rejected') {
              setError('Unable to update a todo');
            } else {
              setTodos((currentTodos: Todo[]) => {
                return currentTodos;
              });
            }
          });
        })
        .finally(() => {});
    } else {
      return Promise.allSettled(
        todos.map(todo => handleToggleTodo(todo).then(() => todo)),
      )
        .then(values => {
          values.map(value1 => {
            if (value1.status === 'rejected') {
              setError('Unable to update a todo');
            } else {
              setTodos((currentTodos: Todo[]) => {
                return currentTodos;
              });
            }
          });
        })
        .finally(() => {});
    }
  };

  const handleRenameTodo = async (todoId: number, newTitle: string) => {
    setIsLoading(true);
    setUpdatingTodoIds(ids => [...ids, todoId]);

    try {
      const updatedTodo = await todoService.updateTitle(todoId, newTitle);

      setTodos(currentTodos =>
        currentTodos.map(t => (t.id === todoId ? updatedTodo : t)),
      );
    } catch {
      setError('Unable to update a todo');
    } finally {
      setIsLoading(false);
      setUpdatingTodoIds(ids => ids.filter(id => id !== todoId));
    }
  };

  const visibleTodos = getFilteredTodos(todos, filter);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onAdd={handleAddTodo}
          todos={todos}
          disabled={isLoading}
          inputValue={inputValue}
          setInputValue={setInputValue}
          onToggleAll={handleToggleAll}
        />

        <TodoList
          todos={visibleTodos ?? []}
          toggleTodo={handleToggleTodo}
          isLoading={isLoading}
          updatingTodoIds={updatingTodoIds}
          tempTodo={tempTodo}
          onDelete={handleDeleteTodo}
          disabled={isLoading}
          onRename={handleRenameTodo}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <TodoFooter
            todos={todos}
            currentFilter={filter}
            onFilterChange={setFilter}
            onDeleteCompletedTodos={handleDeleteCompletedTodos}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification errorMessage={error} onClose={() => setError('')} />
    </div>
  );
};
