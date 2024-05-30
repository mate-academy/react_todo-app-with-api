/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, createTodos, deleteTodo, getTodos, updateTodo } from './api/todos';
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

  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case TodoStatus.Active:
        return !todo.completed;

      case TodoStatus.Completed:
        return todo.completed;

      default:
        return true;
    }
  });

  // Sends a request to the server to get a list (todos).
  const handleRequest = async () => {
    try {
      const allTodo = await getTodos();

      setTodos(allTodo);
      setError(null);
    } catch (errors) {
      setError('Unable to load todos');
    } finally {
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
  // adds focus to the input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, isInputDisabled]);

  // form event handling
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
      // function 'createTodos', sends a request to the server and creates a new 'todo'
      const newTodo = await createTodos({
        title: title.trim(),
        completed: false,
        userId: USER_ID,
      });

      // adds a new element to the todos array and updates its state
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
      // setTodos(todos);
      setError('Unable to delete a todo');
      throw Error('Unable to delete a todo');
    } finally {
        setLoadingTodoIds(prevLoading =>
          prevLoading.filter(id => id !== todoId),
        );  // Clearing the download status after the operation

      setIsInputDisabled(false);
    }
  };

  // The function is responsible for changing the task status
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
          todo.id === todoId
            ? { ...todo, completed: !todo.completed }
            : todo,
        );

        return updatedTodos;
      });
    } catch (errors) {
      setTodos(todos);
      setError('Unable to update a todo');
    } finally {
      setLoadingTodoIds(prevLoading =>
        prevLoading.filter(id => id !== todoId),
      );
      // setError(null);
      setIsInputDisabled(false);
    }
  };

  const clearCompletedTodos = async () => {
    try {
      setIsInputDisabled(true);
      // Selection of completed todos
      const completedTodosIds = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      await Promise.all(completedTodosIds.map(id => deleteSingleTodo(id)));
    } finally {
      setIsInputDisabled(false);
    }
  };


  const onSave = async (todoId: number, newTitle: string, completed: boolean) => {
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

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
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
        {/* show only one message at a time */}
        {error}
      </div>
    </div>
  );
}
