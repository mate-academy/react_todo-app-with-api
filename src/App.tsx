/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  createTodos,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import classNames from 'classnames';
import { TodoList } from './components/TodoList';

export enum TodoStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState<TodoStatus>(TodoStatus.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  let filteredTodos: Todo[];
  switch (filterStatus) {
    case TodoStatus.Active:
      filteredTodos = todos.filter(todo => !todo.completed);
      break;

    case TodoStatus.Completed:
      filteredTodos = todos.filter(todo => todo.completed);
      break;

    default:
      filteredTodos = todos;
  }

  const handleRequest = async () => {
    try {
      const allTodo = await getTodos();

      setTodos(allTodo);
      setError(null);
    } catch (errors) {
      setError('Unable to load todos');
    }
  };

  useEffect(() => {
    if (USER_ID) {
      handleRequest();
    }

    const errorTimeout = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => {
      clearTimeout(errorTimeout);
    };
  }, []);

  const isLoading = !!loadingTodoIds.length;

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, isInputDisabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title should not be empty');

      return;
    }

    try {
      setIsInputDisabled(true);

      setTempTodo({
        id: 0,
        title: title.trim(),
        completed: false,
        userId: USER_ID,
      });
      const newTodo = await createTodos({
        title: title.trim(),
        completed: false,
        userId: USER_ID,
      });

      setTodos(prevTodos => [...prevTodos, newTodo]);
      setTitle('');
    } catch (errors) {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsInputDisabled(false);
    }
  };

  const deleteSingleTodo = async (todoId: number) => {
    try {
      setIsInputDisabled(true);

      setLoadingTodoIds(prevLoading => [...prevLoading, todoId]); // Set download status for selected todo
      await deleteTodo(todoId);

      setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
    } catch (errors) {
      setError('Unable to delete a todo');
      throw Error('Unable to delete a todo');
    } finally {
      setLoadingTodoIds(prevLoading => prevLoading.filter(id => id !== todoId)); // Clearing the download status after the operation

      setIsInputDisabled(false);
    }
  };

  const toggleTodoCompletion = async (todoId: number) => {
    try {
      setIsInputDisabled(true);
      const updatedTodo = todos.find(todo => todo.id === todoId);

      if (!updatedTodo) {
        throw new Error('Todo not found');
      }

      setLoadingTodoIds(prevLoading => [...prevLoading, todoId]);
      await updateTodo(updatedTodo);

      setTodos(prevTodos => {
        const updatedTodos = prevTodos.map(todo =>
          todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
        );

        return updatedTodos;
      });
    } catch (errors) {
      setTodos(todos);
      setError('Unable to update a todo');
    } finally {
      setLoadingTodoIds(prevLoading => prevLoading.filter(id => id !== todoId));
      setIsInputDisabled(false);
    }
  };

  const clearCompletedTodos = async () => {
    try {
      setIsInputDisabled(true);
      const completedTodosIds = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      await Promise.all(completedTodosIds.map(id => deleteSingleTodo(id)));
    } finally {
      setIsInputDisabled(false);
    }
  };

  const onSave = async (
    todoId: number,
    newTitle: string,
    completed: boolean,
  ) => {
    setLoadingTodoIds(prevLoading => [...prevLoading, todoId]);

    try {
      setIsInputDisabled(true);

      await updateTodo({
        id: todoId,
        title: newTitle.trim(),
        completed: completed,
        userId: USER_ID,
      }).then(updatedTodo =>
        setTodos(prev =>
          prev.map(prevTodo => {
            if (prevTodo.id === todoId) {
              return updatedTodo;
            }
            return prevTodo;
          }),
        ),
      );
    } catch (error) {
      setError('Unable to update a todo');
      throw Error('Unable to update a todo');
    } finally {
      setLoadingTodoIds(prevLoading => prevLoading.filter(id => id !== todoId));
      setIsInputDisabled(false);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onSubmit={handleSubmit}
          onChange={setTitle}
          todos={todos}
          isLoading={isLoading}
          inputRef={inputRef}
          title={title}
          toggleTodoCompletion={toggleTodoCompletion}
          isInputDisabled={isInputDisabled}
        />

        <TodoList
          filteredTodos={filteredTodos}
          toggleTodoCompletion={toggleTodoCompletion}
          loadingTodoIds={loadingTodoIds}
          deleteSingleTodo={deleteSingleTodo}
          tempTodo={tempTodo}
          handleSave={onSave}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            setFilterStatus={setFilterStatus}
            filterStatus={filterStatus}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: isLoading || !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {error}
      </div>
    </div>
  );
};
