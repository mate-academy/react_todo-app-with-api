import React, { useEffect, useRef, useState } from 'react';

import * as todoService from './api/todos';
import {
  ERROR_MESSAGE_DISAPPEARS_AFTER,
  ERROR_MESSAGES,
} from './constants/errorMessages';

import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

import type { FilterBy } from './types/Filter';
import type { TempTodo, Todo } from './types/Todo';

const getVisibleTodos = (todos: Todo[], filterBy: FilterBy) => {
  let visibleTodos = [...todos];

  switch (filterBy) {
    case 'active':
      visibleTodos = visibleTodos.filter(todo => !todo.completed);
      break;

    case 'completed':
      visibleTodos = visibleTodos.filter(todo => todo.completed);
      break;
  }

  return visibleTodos;
};

const validateQuery = (processedQuery: string) => {
  if (!processedQuery) {
    return ERROR_MESSAGES.EMPTY_TITLE;
  }

  return '';
};

export const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [query, setQuery] = useState('');
  const [filterBy, setFilterBy] = useState<FilterBy>('all');

  const [tempTodo, setTempTodo] = useState<TempTodo | null>(null);
  const [pendingTodoIds, setPendingTodoIds] = useState<Set<number>>(new Set());

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    setErrorMessage('');

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ERROR_MESSAGES.LOAD_TODOS));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage('');
    }, ERROR_MESSAGE_DISAPPEARS_AFTER);

    return () => {
      clearTimeout(timer);
    };
  }, [errorMessage]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const visibleTodos = getVisibleTodos(todos, filterBy);

  const handleTodoDelete = (todoId: number) => {
    setPendingTodoIds(prev => {
      const next = new Set(prev);

      next.add(todoId);

      return next;
    });

    return todoService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));

        if (inputRef.current) {
          inputRef.current.focus();
        }

        return true;
      })
      .catch(() => {
        setErrorMessage(ERROR_MESSAGES.DELETE_TODO);

        return false;
      })
      .finally(() => {
        setPendingTodoIds(prev => {
          const next = new Set(prev);

          next.delete(todoId);

          return next;
        });
      });
  };

  const handleDeleteCompleted = () => {
    const completedIds = completedTodos.map(todo => todo.id);

    setPendingTodoIds(prev => {
      const next = new Set(prev);

      completedIds.forEach(id => next.add(id));

      return next;
    });

    completedIds.forEach(id => {
      todoService
        .deleteTodo(id)
        .then(() => {
          setTodos(prev => prev.filter(todo => todo.id !== id));

          if (inputRef.current) {
            inputRef.current.focus();
          }
        })
        .catch(() => setErrorMessage(ERROR_MESSAGES.DELETE_TODO))
        .finally(() => {
          setPendingTodoIds(prev => {
            const next = new Set(prev);

            next.delete(id);

            return next;
          });
        });
    });
  };

  const handleTodoToggle = (todoId: number, completed: boolean) => {
    setPendingTodoIds(prev => {
      const next = new Set(prev);

      next.add(todoId);

      return next;
    });

    todoService
      .updateTodo(todoId, 'completed', completed)
      .then(() => {
        setTodos(prev =>
          prev.map(todo =>
            todo.id === todoId ? { ...todo, completed } : todo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage(ERROR_MESSAGES.UPDATE_TODO);
      })
      .finally(() => {
        setPendingTodoIds(prev => {
          const next = new Set(prev);

          next.delete(todoId);

          return next;
        });
      });
  };

  const handleToggleAll = () => {
    const currentCompleted = completedTodos.length !== todos.length;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== currentCompleted,
    );

    setPendingTodoIds(prev => {
      const next = new Set(prev);

      todosToUpdate.forEach(todo => next.add(todo.id));

      return next;
    });

    todosToUpdate.forEach(({ id }) => {
      todoService
        .updateTodo(id, 'completed', currentCompleted)
        .then(() => {
          setTodos(prev =>
            prev.map(todo => {
              return todo.id === id
                ? { ...todo, completed: currentCompleted }
                : todo;
            }),
          );
        })
        .catch(() => setErrorMessage(ERROR_MESSAGES.UPDATE_TODO))
        .finally(() => {
          setPendingTodoIds(prev => {
            const next = new Set(prev);

            next.delete(id);

            return next;
          });
        });
    });
  };

  const handleTodoUpdate = (todoId: number, title: string) => {
    if (!title) {
      return handleTodoDelete(todoId);
    }

    setPendingTodoIds(prev => {
      const next = new Set(prev);

      next.add(todoId);

      return next;
    });

    return todoService
      .updateTodo(todoId, 'title', title)
      .then(() => {
        setTodos(prev =>
          prev.map(todo =>
            todo.id === todoId ? { ...todo, title: title.trim() } : todo,
          ),
        );

        return true;
      })
      .catch(() => {
        setErrorMessage(ERROR_MESSAGES.UPDATE_TODO);

        return false;
      })
      .finally(() => {
        setPendingTodoIds(prev => {
          const next = new Set(prev);

          next.delete(todoId);

          return next;
        });
      });
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const processedQuery = query.trim();

    const newErrorMessage = validateQuery(processedQuery);

    setErrorMessage(newErrorMessage);

    if (newErrorMessage) {
      return;
    }

    const newTodoData = {
      userId: todoService.USER_ID,
      title: processedQuery,
      completed: false,
    };

    setIsLoading(true);
    setTempTodo({ id: 0, title: processedQuery });

    todoService
      .createTodo(newTodoData)
      .then(response => {
        setTodos(prev => [...prev, response]);
        setQuery('');
      })
      .catch(() => setErrorMessage(ERROR_MESSAGES.ADD_TODO))
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          completedTodos={completedTodos}
          onFormSubmit={handleFormSubmit}
          query={query}
          onQueryChange={setQuery}
          isLoading={isLoading}
          inputRef={inputRef}
          onToggleAll={handleToggleAll}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              pendingTodoIds={pendingTodoIds}
              onTodoDelete={handleTodoDelete}
              onTodoToggle={handleTodoToggle}
              onTodoUpdate={handleTodoUpdate}
            />

            <Footer
              filterBy={filterBy}
              onFilterSelect={setFilterBy}
              activeTodos={activeTodos}
              completedTodos={completedTodos}
              onDeleteCompleted={handleDeleteCompleted}
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
