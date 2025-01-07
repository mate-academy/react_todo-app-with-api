/* eslint-disable max-len */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { FilterStatus, handleError, Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [searchInput, setSearchInput] =
    useState<React.RefObject<HTMLInputElement> | null>(null);
  const [loadTodo, setLoadTodo] = useState<Todo | null>(null);
  const [todoQuery, setTodoQuery] = useState<string>('');
  const [todoError, setTodoError] = useState<string>('');
  const [activeTodoCount, setActiveTodoCount] = useState<number>(0);

  useEffect(() => {
    getTodos()
      .then(todos => {
        setTodosFromServer(todos);
        setActiveTodoCount(todos.filter(todo => !todo.completed).length);
      })
      .catch(error => {
        setTodoError(error.message);
      });
  }, []);

  const filteredTodos = todosFromServer.filter(todo => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return !todo.completed;
      case FilterStatus.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const onRemoveTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      setTodosFromServer(prev => {
        return prev.filter(todo => todo.id !== todoId);
      });
      setActiveTodoCount(
        todosFromServer.filter(todo => !todo.completed).length - 1,
      );
    } catch (err) {
      setTodoError(handleError(err));

      throw err;
    } finally {
      if (searchInput) {
        searchInput.current?.focus();
      }

      setLoadTodo(null);
    }
  };

  const onClearCompleted = async () => {
    const completedTodos = todosFromServer.filter(todo => todo.completed);

    for (const completedTodo of completedTodos) {
      onRemoveTodo(completedTodo.id);
    }
  };

  const addNewTodo = async () => {
    try {
      const trimmedTodoTitle = todoQuery.trim();

      setLoadTodo({
        id: 0,
        title: trimmedTodoTitle,
        userId: USER_ID,
        completed: false,
      });
      const newTodo = await addTodo({ title: todoQuery.trim() });

      setTodosFromServer(prev => [...prev, newTodo]);
      setActiveTodoCount(
        todosFromServer.filter(tod => !tod.completed).length + 1,
      );
    } catch (err: unknown) {
      setTodoError(handleError(err));

      throw err;
    } finally {
      setLoadTodo(null);
    }
  };

  const onUpdateTodo = async (todo: Todo) => {
    try {
      const newTodo = await updateTodo(todo);
      const todoFromServer = todosFromServer.find(tod => tod.id === newTodo.id);

      if (todoFromServer) {
        todoFromServer.completed = newTodo.completed;
      }

      return newTodo;
    } catch (err: unknown) {
      setTodoError(handleError(err));

      throw err;
    } finally {
      setTodosFromServer(prev => [...prev]);
      setActiveTodoCount(todosFromServer.filter(tod => !tod.completed).length);
    }
  };

  const updateCompletedAllToDo = async () => {
    const filteredTodo = todosFromServer.filter(todo => !todo.completed).length
      ? todosFromServer.filter(todo => !todo.completed)
      : todosFromServer;

    try {
      await Promise.all(
        filteredTodo.map(async (todo: Todo) => {
          const todoCopy = todo;

          todoCopy.isLoaded = true;
          try {
            const newTodo = await updateTodo({
              ...todo,
              completed: !todo.completed,
            });

            todoCopy.completed = newTodo.completed;
          } catch (err) {
            throw err;
          }

          todoCopy.isLoaded = false;

          return todo;
        }),
      );
      setTodosFromServer([...todosFromServer]);
    } catch (err: unknown) {
      setTodoError(handleError(err));
    } finally {
      setActiveTodoCount(
        todosFromServer.filter(todo => !todo.completed).length,
      );
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          query={todoQuery}
          changeQuery={setTodoQuery}
          setTodoError={setTodoError}
          addNewTodo={addNewTodo}
          setSearchInput={setSearchInput}
          todos={todosFromServer}
          updateCompletedAllToDo={updateCompletedAllToDo}
        />

        <TodoList
          filteredTodos={
            loadTodo ? [...filteredTodos, loadTodo] : filteredTodos
          }
          onRemoveTodo={onRemoveTodo}
          onUpdateTodo={onUpdateTodo}
        />

        {/* Hide the footer if there are no todos */}
        {todosFromServer.length !== 0 && (
          <TodoFooter
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            onClearCompleted={onClearCompleted}
            isClearButtonDisabled={
              !todosFromServer.some(todo => todo.completed)
            }
            todosLenght={activeTodoCount}
          />
        )}
      </div>
      <ErrorNotification error={todoError} setError={setTodoError} />
    </div>
  );
};
