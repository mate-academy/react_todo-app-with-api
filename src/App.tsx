/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deleteTodo, getTodos, updateTodo } from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
import { Todo } from './types/Todo';
import { filterTodos } from './utils/filterTodos';
import { Status } from './types/Status';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<Status>(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [addingTodoId, setAddingTodoId] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos, tempTodo]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  }, []);

  const handleDelete = useCallback((id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = filterTodos(todos, filter);
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const isCompletedTodos = todos.some(todo => todo.completed);
  const allTodosAreCompleted = todos.every(todo => todo.completed);

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed && todo.id);

    completedTodos.forEach(todo => {
      deleteTodo(todo.id!)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
        })
        .catch(() => {
          setError('Unable to delete a todo');
        });
    });
  };

  const handleToggle = (id: number) => {
    const todoToUpdate = todos.find(todo => todo.id === id);

    if (todoToUpdate) {
      const updatedTodo = {
        ...todoToUpdate,
        completed: !todoToUpdate.completed,
      };

      setIsUpdating(true);

      updateTodo(updatedTodo)
        .then(() => {
          setTodos(prevTodos =>
            prevTodos.map(todo => (todo.id === id ? updatedTodo : todo)),
          );
        })
        .catch(() => {
          setError('Unable to update a todo');
        })
        .finally(() => {
          setIsUpdating(false);
        });
    }
  };

  const handleToggleAll = () => {
    todos.forEach(todo => {
      if (todo.completed === allTodosAreCompleted) {
        const updatedTodo = { ...todo, completed: !allTodosAreCompleted };

        updateTodo(updatedTodo)
          .then(() => {
            setTodos(prevTodos =>
              prevTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
            );
          })
          .catch(() => {
            setError('Unable to update a todo');
          });
      }
    });
  };

  const handleUpdate = (updatedTodo: Todo) => {
    const currentTodos = [...todos];

    setTodos(prevTodos =>
      prevTodos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
    );

    updateTodo(updatedTodo).catch(() => {
      setTodos(currentTodos);
      setError('Unable to update a todo');
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputRef={inputRef}
          todos={todos}
          setTodos={setTodos}
          setError={setError}
          setTempTodo={setTempTodo}
          setAddingTodoId={setAddingTodoId}
          handleToggleAll={handleToggleAll}
          allTodosAreCompleted={allTodosAreCompleted}
          isUpdating={isUpdating}
        />

        <TodoList
          todos={filteredTodos}
          addingTodoId={addingTodoId}
          setAddingTodoId={setAddingTodoId}
          handleDelete={handleDelete}
          handleToggle={handleToggle}
          handleUpdate={handleUpdate}
          setError={setError}
          isUpdating={isUpdating}
          setIsUpdating={setIsUpdating}
        />
        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            addingTodoId={addingTodoId}
            handleDelete={handleDelete}
            handleToggle={handleToggle}
            handleUpdate={handleUpdate}
            setAddingTodoId={setAddingTodoId}
            setError={setError}
            isUpdating={isUpdating}
            setIsUpdating={setIsUpdating}
          />
        )}

        {!!todos.length && (
          <Footer
            filter={filter}
            setFilter={setFilter}
            activeTodosCount={activeTodosCount}
            isCompletedTodos={isCompletedTodos}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <Error error={error} setError={setError} />
    </div>
  );
};
