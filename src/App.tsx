/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect, useRef, useState, useMemo,
} from 'react';
import { Todo } from './types/Todo';
import { ErrorInfo } from './types/Error';
import {
  createTodos, deleteTodos, getTodos, updateTodos,
} from './api/todos';
import { TodoRow } from './components/TodoRow';
import { Header } from './components/Header';
import { Filters } from './types/Filters';
import { Footer } from './components/Footer';
import { Error } from './components/Error';

const USER_ID = 11857;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const [filterBy, setFilterBy] = useState(Filters.ALL);

  const errorTimerId = useRef(0);

  const loadTodos = async () => {
    try {
      const todosData = await getTodos(USER_ID);

      setTodos(todosData);

      return await Promise.resolve();
    } catch (error) {
      setErrorMessage(ErrorInfo.UNABLED_LOAD_TODOS);

      return Promise.reject(error);
    }
  };

  const showErrorMessage = () => {
    if (errorTimerId) {
      clearTimeout(errorTimerId.current);
    }

    errorTimerId.current = window.setTimeout(() => {
      setErrorMessage(ErrorInfo.DEFAULT);
    }, 3000);
  };

  useEffect(() => {
    showErrorMessage();
  }, [errorMessage]);

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAddTodo = async (todoTitle: string) => {
    setTempTodo({
      id: 0,
      title: todoTitle,
      completed: false,
      userId: USER_ID,
    });
    try {
      const createdTodo = await createTodos(todoTitle);

      setTempTodo(null);

      setTodos(prev => [...prev, createdTodo]);
    } catch (error) {
      setErrorMessage(ErrorInfo.UNABLE_ADD_TODO);
    } finally {
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setProcessingTodoIds(prev => [...prev, id]);

    try {
      const isTodoDelete = await deleteTodos(id);

      if (isTodoDelete) {
        setTodos(prev => prev.filter(t => t.id !== id));
      } else {
        setErrorMessage(ErrorInfo.UNABLE_DELETE_TODO);
      }
    } catch {
      setErrorMessage(ErrorInfo.UNABLE_DELETE_TODO);
    } finally {
      setProcessingTodoIds(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const handleUpdateTodo = async (todo: Todo) => {
    setProcessingTodoIds(prev => [...prev, todo.id]);

    try {
      const updatedTodo = await updateTodos(todo);

      setTodos(prev => prev.map(prevTodo => (
        prevTodo.id === updatedTodo.id
          ? updatedTodo
          : prevTodo
      )));
    } catch (e) {
      setErrorMessage(ErrorInfo.UNABLE_UPDATE_TODO);
    } finally {
      setProcessingTodoIds(prev => prev.filter(id => id !== todo.id));
    }
  };

  const toggleAll = async () => {
    const isAllCompleted = todos.every(t => t.completed);

    const todosToUpdate = todos.filter(todo => (isAllCompleted
      ? todo.completed
      : !todo.completed));

    await Promise.all(todosToUpdate.map(todo => (
      handleUpdateTodo({
        ...todo,
        completed: !isAllCompleted,
      })
    )));
  };

  const clearCompletedAll = async () => {
    const allCompleted = todos.filter(t => t.completed);

    await Promise.allSettled(allCompleted.map(t => handleDeleteTodo(t.id)));
  };

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterBy) {
        case Filters.ACTIVE:
          return !todo.completed;
          break;

        case Filters.COMPLETED:
          return todo.completed;
          break;

        default:
          return true;
      }
    });
  }, [todos, filterBy]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onError={setErrorMessage}
          onTodoAdd={handleAddTodo}
          isActive={todos.every(t => t.completed)}
          onToggleAll={toggleAll}
          showButton={todos.length > 0}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <TodoRow
              key={todo.id}
              todo={todo}
              onTodoDelete={() => handleDeleteTodo(todo.id)}
              onTodoUpdate={handleUpdateTodo}
              isLoading={processingTodoIds.includes(todo.id)}
            />
          ))}

          {tempTodo && (
            <TodoRow
              todo={tempTodo}
              isLoading
            />
          )}
        </section>

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            clearCompletedAll={clearCompletedAll}
          />
        )}
      </div>

      {errorMessage && (
        <Error
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
