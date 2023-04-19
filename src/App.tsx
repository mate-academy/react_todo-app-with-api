/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  postTodos,
  deleteTodo,
  toggleTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';

import { Header } from './components/Header/Header';
import { ListOfTodos } from './components/ListOfTodos/ListOfTodos';
import { FilterForTodos } from './components/FilterTodos/FilterTodos';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';

const USER_ID = 6984;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [disabledInput, setDisabledInput] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError('Unable to load the list'));
  }, []);

  useEffect(() => {
    const currentTodos = todos.filter((todo) => {
      switch (filter) {
        case FilterStatus.Active:
          return !todo.completed;

        case FilterStatus.Completed:
          return todo.completed;

        default:
          return todo;
      }
    });

    setFilteredTodos(currentTodos);
  }, [todos, filter]);

  const unfinishedTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  const finishedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const handleTodoCreation = (title: string) => {
    if (!title.trim().length) {
      setError('Title can\'t be empty');
    } else {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setDisabledInput(true);
      setTempTodo({ ...newTodo, id: 0 });
      setError('');

      postTodos(USER_ID, newTodo)
        .then(result => {
          setTodos(prevTodos => {
            return [...prevTodos, result];
          });
        })
        .catch(() => {
          setError('Unable to add a todo');
        })
        .finally(() => {
          setDisabledInput(false);
          setTempTodo(null);
        });
    }
  };

  const handleTodoDeletion = (id: number) => {
    setLoadingTodoId(prev => [...prev, id]);

    return deleteTodo(id)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
        setLoadingTodoId(prev => prev.filter(todoId => todoId !== id));
      })
      .catch(() => {
        setError('Unable to delete a todo');
        setLoadingTodoId(prev => prev.filter(todoId => todoId !== id));
      });
  };

  const handleTodoUpdating = async (id: number, data: Partial<Todo>) => {
    setLoadingTodoId(prev => [...prev, id]);

    try {
      await toggleTodo(id, data);

      setTodos(prev => prev.map(todo => {
        if (todo.id === id) {
          return { ...todo, ...data };
        }

        return todo;
      }));
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingTodoId(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const handleAllTodoCompletion = () => {
    const todosCompletion = todos.every(todo => todo.completed);

    if (todosCompletion) {
      todos.map(todo => {
        return handleTodoUpdating(todo.id, { completed: false });
      });
    } else {
      const todosNotCompleted = todos.filter(todo => !todo.completed);

      todosNotCompleted.map(todo => {
        return handleTodoUpdating(todo.id, { completed: true });
      });
    }
  };

  const handleAllTodoDeletion = () => {
    const completed = todos.filter(todo => todo.completed);
    const uncompleted = todos.filter(todo => !todo.completed);

    completed.forEach(todo => {
      handleTodoDeletion(todo.id)
        .then(() => {
          setTodos(uncompleted);
        });
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          unfinishedTodos={unfinishedTodos}
          disabledInput={disabledInput}
          onTodoCreation={handleTodoCreation}
          onAllTodoCompletion={handleAllTodoCompletion}
        />

        {todos.length > 0 && (
          <>
            <section className="todoapp__main">
              <ListOfTodos
                todos={filteredTodos}
                tempTodo={tempTodo}
                onTodoDeletion={handleTodoDeletion}
                onTodoUpdating={handleTodoUpdating}
                loadingTodoId={loadingTodoId}
              />
            </section>

            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${unfinishedTodos.length} items left`}
              </span>

              <FilterForTodos filter={filter} onFilterChange={setFilter} />

              { finishedTodos.length > 0 && (
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  onClick={handleAllTodoDeletion}
                >
                  Clear completed
                </button>
              )}
            </footer>
          </>
        )}
      </div>

      <ErrorNotification
        error={error}
        onClear={() => setError('')}
      />
    </div>
  );
};
