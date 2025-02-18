// eslint-disable jsx-a11y/label-has-associated-control
// eslint-disable jsx-a11y/control-has-associated-label
// eslint-disable max-len

import React, { useEffect, useState, useRef } from 'react';
import * as todoApi from './api/todos';
import { Todo } from './types/Todo';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import ErrorMessage from './components/ErrorMessage';

export enum TodoFilter {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export enum TodoErrors {
  EmptyTitle = 'Title should not be empty',
  UnableToLoad = 'Unable to load todos',
  UnableToAdd = 'Unable to add a todo',
  UnableToUpdate = 'Unable to update a todo',
  UnableToDelete = 'Unable to delete a todo',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodos, setLoadingTodos] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const todosLeft = todos.filter(todo => !todo.completed).length;
  const [isActiveTodo, setIsActiveTodo] = useState<number | null>(null);
  const isAtLeastOneTodoLoading = Object.values(loadingTodos).some(
    isLoading => isLoading,
  );

  const [isTitleDisabled, setIsTitleDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState<TodoErrors | ''>('');
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.All);

  const inputRef = useRef<HTMLInputElement>(null);

  // ! fetchTodos
  const fetchTodos = async () => {
    setErrorMessage('');

    todoApi
      .fetchTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(TodoErrors.UnableToLoad));
  };

  useEffect(() => {
    fetchTodos();

    setTimeout(() => inputRef.current?.focus());
  }, []);

  // ! filterTodos
  const visibleTodos = todos.filter(todo => {
    if (filter === TodoFilter.Active) return !todo.completed;

    if (filter === TodoFilter.Completed) return todo.completed;

    return true;
  });

  const handleFilterChange = (newFilter: TodoFilter) => setFilter(newFilter);

  // ! errorMessage
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleCloseError = () => setErrorMessage('');

  // ! add, delete, update Todos
  const addTodo = (title: string) => {
    setIsTitleDisabled(true);
    setErrorMessage('');
    setTempTodo({
      id: 0,
      userId: todoApi.USER_ID,
      title: title.trim(),
      completed: false,
    });

    return todoApi
      .addTodo(title.trim())
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
      })
      .catch(error => {
        setTempTodo(null);
        setErrorMessage(TodoErrors.UnableToAdd);
        throw error;
      })
      .finally(() => {
        setIsTitleDisabled(false);
        setTimeout(() => inputRef.current?.focus());
      });
  };

  const deleteTodo = (id: number) => {
    setLoadingTodos(prev => ({ ...prev, [id]: true }));

    return todoApi
      .deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(error => {
        setErrorMessage(TodoErrors.UnableToDelete);
        throw error;
      })
      .finally(() => {
        setLoadingTodos(prev => ({ ...prev, [id]: false }));
        setTimeout(() => inputRef.current?.focus());
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
          await todoApi.deleteTodo(id);
          successfulDeletions.push(id);
        } catch {
          setErrorMessage(TodoErrors.UnableToDelete);
        }
      }),
    );

    setTodos(currentTodos =>
      currentTodos.filter(todo => !successfulDeletions.includes(todo.id)),
    );

    setLoadingTodos(prev =>
      completedTodoIds.reduce((acc, id) => ({ ...acc, [id]: false }), prev),
    );

    setTimeout(() => inputRef.current?.focus());
  };

  const handleToggleTodo = (updatedTodo: Todo) => {
    setLoadingTodos(prev => ({ ...prev, [updatedTodo.id]: true }));

    todoApi
      .updateTodo(updatedTodo)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => setErrorMessage(TodoErrors.UnableToUpdate))
      .finally(() => {
        setLoadingTodos(prev => ({ ...prev, [updatedTodo.id]: false }));
      });
  };

  const toggleAllTodos = () => {
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
      updatedTodos.map(updatedTodo => todoApi.updateTodo(updatedTodo)),
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
      .catch(() => setErrorMessage(TodoErrors.UnableToUpdate))
      .finally(() => {
        setLoadingTodos(prev =>
          updatedTodos.reduce(
            (acc, todo) => ({ ...acc, [todo.id]: false }),
            prev,
          ),
        );
      });
  };

  const handleEditTitle = (id: number, newTitle: string) => {
    setLoadingTodos(prev => ({ ...prev, [id]: true }));

    todoApi
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
        setIsActiveTodo(null);
      })
      .catch(() => setErrorMessage(TodoErrors.UnableToUpdate))
      .finally(() => {
        setLoadingTodos(prev => ({ ...prev, [id]: false }));
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          loading={isAtLeastOneTodoLoading}
          isTitleDisabled={isTitleDisabled}
          itemsLeft={todosLeft}
          onSubmit={addTodo}
          setErrorMessage={setErrorMessage}
          inputRef={inputRef}
          onToggleAll={toggleAllTodos}
          todosLength={todos.length}
        />

        <TodoList
          visibleTodos={visibleTodos}
          loadingTodos={loadingTodos}
          isActiveTodo={isActiveTodo}
          setIsActiveTodo={setIsActiveTodo}
          onDelete={deleteTodo}
          tempTodo={tempTodo}
          onToggle={handleToggleTodo}
          handleEditTitle={handleEditTitle}
        />

        <TodoFooter
          todos={todos}
          itemsLeft={todosLeft}
          filter={filter}
          onFilterChange={handleFilterChange}
          loading={isAtLeastOneTodoLoading}
          clearCompletedTodos={clearCompletedTodos}
        />
      </div>

      <ErrorMessage errorMessage={errorMessage} onClose={handleCloseError} />
    </div>
  );
};
