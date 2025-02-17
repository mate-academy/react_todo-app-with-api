/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import * as postService from './api/todos';
import { Todo } from './types/Todo';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoFilter } from './enums/TodoFilter';

type Filter = TodoFilter;

export const App: React.FC = () => {
  // eslint-disable-next-line max-len
  const [loadingTodos, setLoadingTodos] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isActive, setIsActive] = useState<number | null>(null);

  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [filter, setFilter] = useState<Filter>(TodoFilter.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const isAnyLoading = Object.values(loadingTodos).some(isLoading => isLoading);

  // #region inputFocus
  const inputRef = useRef<HTMLInputElement>(null);

  const inputfocus = () => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    inputfocus();
  }, []);
  //#endregion

  // #region loadTodos
  const loadTodos = async () => {
    setErrorMessage('');

    postService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  };

  useEffect(() => {
    loadTodos();
  }, []);
  //#endregion

  // #region filter
  const filteredTodos = todos.filter(todo => {
    if (filter === TodoFilter.ACTIVE) {
      return !todo.completed;
    }

    if (filter === TodoFilter.COMPLETED) {
      return todo.completed;
    }

    return true;
  });

  const handleFilterChange = (newFilter: Filter) => {
    setFilter(newFilter);
  };
  //#endregion

  // #region add, delete, update
  const addPost = (title: string) => {
    setIsInputDisabled(true);
    setErrorMessage('');
    setTempTodo({
      id: 0,
      userId: postService.USER_ID,
      title: title.trim(),
      completed: false,
    });

    return postService
      .createTodos(title.trim())
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
      })
      .catch(error => {
        setTempTodo(null);
        setErrorMessage('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        setIsInputDisabled(false);
        inputfocus();
      });
  };

  const deleteTodo = (id: number) => {
    setLoadingTodos(prev => ({ ...prev, [id]: true }));

    return postService
      .deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(error => {
        setErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setLoadingTodos(prev => ({ ...prev, [id]: false }));
        inputfocus();
      });
  };

  const clearCompletedTodos = async () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setLoadingTodos(prev =>
      completedTodoIds.reduce((acc, id) => ({ ...acc, [id]: true }), prev),
    );

    const successfulDeletions: number[] = [];

    await Promise.all(
      completedTodoIds.map(async id => {
        try {
          await postService.deleteTodo(id);
          successfulDeletions.push(id);
        } catch {
          setErrorMessage('Unable to delete a todo');
        }
      }),
    );

    setTodos(currentTodos =>
      currentTodos.filter(todo => !successfulDeletions.includes(todo.id)),
    );

    setLoadingTodos(prev =>
      completedTodoIds.reduce((acc, id) => ({ ...acc, [id]: false }), prev),
    );

    inputfocus();
  };

  const handleToggleTodo = (updatedTodo: Todo) => {
    setLoadingTodos(prev => ({ ...prev, [updatedTodo.id]: true }));

    postService
      .updateTodo(updatedTodo)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setLoadingTodos(prev => ({ ...prev, [updatedTodo.id]: false }));
      });
  };

  const handleToggleAllTodos = () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const todosToUpdate = areAllCompleted
      ? todos
      : todos.filter(todo => !todo.completed);

    const updatedTodos = todosToUpdate.map(todo => ({
      ...todo,
      completed: !areAllCompleted,
    }));

    setLoadingTodos(prev =>
      updatedTodos.reduce((acc, todo) => ({ ...acc, [todo.id]: true }), prev),
    );

    Promise.all(
      updatedTodos.map(updatedTodo => postService.updateTodo(updatedTodo)),
    )
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo => {
            const updatedTodo = updatedTodos.find(
              updated => updated.id === todo.id,
            );

            return updatedTodo
              ? { ...todo, completed: updatedTodo.completed }
              : todo;
          }),
        );
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setLoadingTodos(prev =>
          updatedTodos.reduce(
            (acc, todo) => ({ ...acc, [todo.id]: false }),
            prev,
          ),
        );
      });
  };

  const handleEditTodoTitle = (id: number, newTitle: string) => {
    setLoadingTodos(prev => ({ ...prev, [id]: true }));

    postService
      .updateTodo({
        id,
        title: newTitle,
        completed: todos.find(todo => todo.id === id)?.completed ?? false,
      })
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === id ? { ...todo, title: newTitle } : todo,
          ),
        );
        setIsActive(null);
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setLoadingTodos(prev => ({ ...prev, [id]: false }));
      });
  };

  //#endregion
  // #region errorMessage
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleCloseError = () => {
    setErrorMessage('');
  };
  //#endregion

  const todosLeft = todos.filter(todo => !todo.completed).length;
  const todosLength = todos.length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          loading={isAnyLoading}
          isInputDisabled={isInputDisabled}
          todosLeft={todosLeft}
          onSubmit={addPost}
          setErrorMessage={setErrorMessage}
          inputRef={inputRef}
          onToggleAll={handleToggleAllTodos}
          todosLength={todosLength}
        />

        <TodoList
          filteredTodos={filteredTodos}
          loadingTodos={loadingTodos}
          isActive={isActive}
          setIsActive={setIsActive}
          onDelete={deleteTodo}
          tempTodo={tempTodo}
          onToggle={handleToggleTodo}
          handleEditTodoTitle={handleEditTodoTitle}
        />

        <TodoFooter
          todos={todos}
          todosLeft={todosLeft}
          filter={filter}
          onFilterChange={handleFilterChange}
          loading={isAnyLoading}
          clearCompletedTodos={clearCompletedTodos}
        />
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={handleCloseError}
      />
    </div>
  );
};
