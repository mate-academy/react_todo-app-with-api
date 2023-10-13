import React, { useEffect, useRef, useState } from 'react';
import {
  addTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer/Footer';
import { FilterCase } from './types/FilterCase';
import { TodoItem } from './components/TodoItem/TodoItem';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { errorMessages } from './constants/constants';
import { ErrorNotification }
  from './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterCase, setFilterCase] = useState(FilterCase.all);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoFieldRef.current) {
      newTodoFieldRef.current.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    setError('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError(errorMessages.load_todos);
      });
  }, []);

  const handleAddTodo = (todoTitle: string) => {
    setTempTodo({
      id: 0,
      title: todoTitle.trim(),
      userId: 0,
      completed: false,
    });

    setIsLoading(true);

    return addTodo(todoTitle)
      .then((newTodo) => {
        setTodos((prevTodos) => [...prevTodos, newTodo]);

        newTodoFieldRef.current?.focus();
      })
      .catch(() => {
        setError(errorMessages.add_todo);
        throw new Error(errorMessages.add_todo);
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodoIds((prevTodoIds) => [...prevTodoIds, todoId]);
    setIsLoading(true);

    deleteTodo(todoId)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));

        newTodoFieldRef.current?.focus();
      })
      .catch(() => {
        setError(errorMessages.delete_todo);
      })
      .finally(() => {
        setLoadingTodoIds((prevTodoIds) => prevTodoIds
          .filter((id) => id !== todoId));
        setIsLoading(false);
      });
  };

  const handleUpdateTodo = (todo: Todo, updatedProperties: Partial<Todo>) => {
    setLoadingTodoIds((prevLoadingTodoIds) => [...prevLoadingTodoIds, todo.id]);

    updateTodo({
      ...todo,
      ...updatedProperties,
    })
      .then((updatedTodo) => {
        setTodos((prevTodos) => prevTodos.map((currentTodo) => (
          currentTodo.id !== updatedTodo.id ? currentTodo : updatedTodo
        )));
      })
      .catch(() => {
        if (updatedProperties.title) {
          setError(errorMessages.update_todo);
        }
      })
      .finally(() => {
        setLoadingTodoIds((prevTodoIds) => prevTodoIds
          .filter((id) => id !== todo.id));
        setIsLoading(false);
      });
  };

  const activeTodos = todos.filter((todo) => !todo.completed);
  const isAllCompleted = todos.every((todo) => todo.completed);

  const toggleAllTodos = async () => {
    if (isAllCompleted) {
      todos.forEach((todo) => handleUpdateTodo(todo,
        { completed: !todo.completed }));
    } else {
      activeTodos.forEach(todo => handleUpdateTodo(todo,
        { completed: !todo.completed }));
    }
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter((todo) => todo.completed);

    completedTodos.forEach((todo) => {
      setLoadingTodoIds((prevTodoIds) => [...prevTodoIds, todo.id]);
      handleDeleteTodo(todo.id);
    });
  };

  const filteredTodos = todos.filter((todo) => {
    switch (filterCase) {
      case FilterCase.active:
        return !todo.completed;
      case FilterCase.completed:
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          newTodoFieldRef={newTodoFieldRef}
          error={error}
          setError={setError}
          onTodoAdd={handleAddTodo}
          isLoading={isLoading}
          onToggleAllTodos={toggleAllTodos}
          isAllCompleted={isAllCompleted}
        />

        {filteredTodos.map((todo) => (
          <TodoItem
            todo={todo}
            key={todo.id}
            onTodoDelete={handleDeleteTodo}
            onTodoUpdate={
              (todoTitle:
              string) => handleUpdateTodo(todo, { title: todoTitle })
            }
            loadingTodoIds={loadingTodoIds}
            onToggleTodo={
              () => handleUpdateTodo(todo, { completed: !todo.completed })
            }
          />
        ))}

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            isLoading
          />
        )}

        {!!todos.length && (
          <Footer
            todos={filteredTodos}
            filterCase={filterCase}
            setFilterCase={setFilterCase}
            activeTodos={activeTodos}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        error={error}
        setError={setError}
      />
    </div>
  );
};
