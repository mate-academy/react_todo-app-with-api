/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState, useCallback, useMemo,
} from 'react';
import cn from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { AddTodo } from './components/Auth/AddTodo';
import { Todo } from './types/Todo';
import {
  addTodos, getTodos, editTodo, deleteTodo,
} from './api/todos';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoList } from './components/Auth/TodoList';
import { Footer } from './components/Auth/Footer';
import { Error } from './components/Auth/Error';
import { FilterTodos } from './utils/FilterTodos';

const defaultTodo = {
  id: 0,
  userId: 0,
  title: '',
  completed: false,
};

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(FilterTodos.ALL);
  const [queryOfTitle, setQueryOfTitle] = useState('');
  const [hasError, setHasError] = useState(false);
  const [messageError, setMessageError] = useState(ErrorMessage.None);
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo>(defaultTodo);
  const [isLoading, setIsLoading] = useState<number[]>([]);

  const getTodosFromServer = async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      }
    } catch (err) {
      setHasError(true);
      setMessageError(ErrorMessage.LoadError);
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosFromServer();
  }, []);

  const filteredTodos = todos.filter((todo) => {
    switch (filterBy) {
      case FilterTodos.ACTIVE:
        return !todo.completed;
      case FilterTodos.COMLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  const deleteCompleted = () => {
    return todos.map(async (todo) => {
      if (todo.completed === true) {
        await deleteTodo(todo.id);

        await getTodosFromServer();
      }

      return todo;
    });
  };

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setIsAdding(true);

      const trimtitle = queryOfTitle.trim();

      if (!trimtitle) {
        setMessageError(ErrorMessage.TitleError);
        setHasError(true);
        setQueryOfTitle('');

        return;
      }

      if (user && !hasError) {
        await addTodos(user.id, trimtitle);
        await getTodosFromServer();
      }

      setIsAdding(false);
      setQueryOfTitle('');
    } catch (err) {
      setHasError(true);
      setMessageError(ErrorMessage.AddError);
    }
  };

  const handleQueryOfTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const temporaryTodo = {
      id: 0,
      userId: user?.id || 0,
      title: event.target.value,
      completed: false,
    };

    setTempTodo(temporaryTodo);
    setQueryOfTitle(event.target.value);
  };

  const todosWithCompletedStatus = useMemo(
    () => todos.filter(({ completed }) => completed),
    [todos],
  );

  const activeTodos = todos.filter((todo) => todo.completed === false).length;
  const completedTodos = todos.filter((todo) => todo.completed === true).length;

  const editTodoStatusOnServer = useCallback(
    async (todoId: number, status: boolean) => {
      try {
        setIsLoading((currentIds) => [...currentIds, todoId]);

        await editTodo(todoId, { completed: status });

        await getTodosFromServer();

        setIsLoading((currentIds) => currentIds.filter((id) => id !== todoId));
      } catch (error) {
        setHasError(true);
        setMessageError(ErrorMessage.UpdateError);
      }
    },
    [todos],
  );

  const editAllTodos = useCallback(async () => {
    try {
      const couldBeToggled
        = todosWithCompletedStatus.length !== todos.length
          ? todos.filter(({ completed }) => !completed)
          : todos;

      await Promise.all(
        couldBeToggled.map((todo) => editTodoStatusOnServer(
          todo.id, !todo.completed,
        )),
      );
      getTodosFromServer();
    } catch (error) {
      setHasError(true);
      setMessageError(ErrorMessage.UpdateError);
    }
  }, [todos]);

  const isAllTodosCompleted = todos.length === completedTodos;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={cn('todoapp__toggle-all', {
              active: isAllTodosCompleted,
            })}
            onClick={editAllTodos}
          />
          <AddTodo
            newTodoField={newTodoField}
            handleQueryOfTitle={handleQueryOfTitle}
            queryOfTitle={queryOfTitle}
            handleOnSubmit={handleOnSubmit}
            isAdding={isAdding}
          />
        </header>
        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            getTodosFromServer={getTodosFromServer}
            isAdding={isAdding}
            tempTodo={tempTodo}
            setHasError={setHasError}
            setMessageError={setMessageError}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
          />
        )}
        <Footer
          activeTodos={activeTodos}
          completedTodos={completedTodos}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          deleteCompleted={deleteCompleted}
        />
      </div>
      {hasError && (
        <Error
          hasError={hasError}
          setHasError={setHasError}
          messageError={messageError}
        />
      )}
    </div>
  );
};
