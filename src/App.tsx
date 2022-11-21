/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import {
  addTodo, changeTodo, deleteTodo, getTodos,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Errors } from './components/Errors';
import { ListFooter } from './components/ListFooter';
import { ListHeader } from './components/ListHeader';
import { TodoList } from './components/TodoList';
import { Error } from './types/Error';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState(todos);
  const [filter, setFilter] = useState(Filter.All);
  const [hasError, setHasError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(Error.None);
  const [isDeletedId, setIsDeleted] = useState(0);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [isDoubleClicked, setIsDoubleClicked] = useState(false);
  const [clickedId, setClickedId] = useState(0);

  const user = useContext(AuthContext);

  const getTodosFromsServer = async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      }
    } catch (err) {
      setHasError(true);
      setError(Error.OnLoading);
    }
  };

  useEffect(() => {
    getTodosFromsServer();
  }, []);

  const filterHandler = (filterSelected: Filter) => {
    setFilter(filterSelected);
  };

  const closeErrorHandler = () => {
    setHasError(false);
  };

  useEffect(() => {
    setFilteredTodos(
      todos.filter(todo => {
        switch (filter) {
          case Filter.Active:
            return !todo.completed;

          case Filter.Completed:
            return todo.completed;

          case Filter.All:
          default:
            return todo;
        }
      }),
    );
  }, [filter, todos]);

  const addNewTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const titleTrimmed = title.trim();

    if (user) {
      setIsAdding(true);

      try {
        if (!titleTrimmed.length) {
          setHasError(true);
          setError(Error.OnTitle);
          setIsAdding(false);

          return;
        }

        await addTodo(titleTrimmed, user.id);
        await getTodosFromsServer();

        setIsAdding(false);
        setTitle('');
      } catch {
        setError(Error.OnAdding);
        setIsAdding(false);
      }
    }
  };

  const handleDelete = async (id: number) => {
    setIsDeleted(id);
    try {
      await deleteTodo(id);
      await getTodosFromsServer();
    } catch {
      setError(Error.OnDeleting);
    }
  };

  const deleteCompletedTodos = async () => {
    try {
      const completedTodos = todos.filter(todo => todo.completed);
      const completedIds = completedTodos.map(todo => todo.id);

      setLoadingIds(completedIds);

      await Promise.all(completedTodos.map(async (todo) => {
        await deleteTodo(todo.id);

        return todo;
      }));

      await getTodosFromsServer();
    } catch {
      setError(Error.OnDeleting);
    }
  };

  const allCompleted = todos.every(todo => todo.completed);

  const onToggleAll = async () => {
    try {
      const allIds = todos.map(todo => todo.id);

      setLoadingIds(allIds);
      await Promise.all(todos.map(async (todo) => {
        if (allCompleted || !todo.completed) {
          await changeTodo(todo.id, { completed: !todo.completed });
        }
      }));

      await getTodosFromsServer();
      setLoadingIds([]);
    } catch (err) {
      setError(Error.OnToggleAll);
    }
  };

  const onToggleTodo = async (id: number) => {
    try {
      const todoClicked = todos.find(todo => todo.id === id);

      if (todoClicked) {
        setLoadingIds([todoClicked.id]);
        await changeTodo(id, { completed: !todoClicked.completed });
      }

      await getTodosFromsServer();
      setLoadingIds([]);
    } catch {
      setError(Error.OnToggleAll);
    }
  };

  const onUpdateTodo = async (submittedTitle: string, id: number) => {
    setLoadingIds([id]);
    setIsDoubleClicked(true);
    setClickedId(id);

    try {
      if (submittedTitle.trim().length === 0) {
        await deleteTodo(id);
        await getTodosFromsServer();
        setIsDoubleClicked(false);
        setClickedId(0);
        setLoadingIds([]);
      } else {
        await changeTodo(id, { title: submittedTitle.trim() });
        await getTodosFromsServer();
        setIsDoubleClicked(false);
        setClickedId(0);
        setLoadingIds([]);
      }
    } catch {
      setError(Error.OnUpdating);
      setClickedId(0);
      setIsDoubleClicked(false);
      setLoadingIds([]);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <ListHeader
          isAdding={isAdding}
          addNewTodo={addNewTodo}
          title={title}
          setTitle={setTitle}
          onToggleAll={onToggleAll}
          allCompleted={allCompleted}
        />

        {todos.length !== 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              title={title}
              isAdding={isAdding}
              isDeletedId={isDeletedId}
              handleDelete={handleDelete}
              loadingIds={loadingIds}
              onToggleTodo={onToggleTodo}
              handleSubmit={onUpdateTodo}
              clickedId={clickedId}
              isDoubleClicked={isDoubleClicked}
              setClickedId={setClickedId}
              setIsDoubleClicked={setIsDoubleClicked}
            />
            <ListFooter
              todos={todos}
              filter={filter}
              onFilterSelect={filterHandler}
              deleteCompletedTodos={deleteCompletedTodos}
            />
          </>
        )}
      </div>

      <Errors
        hasError={hasError}
        onCloseError={closeErrorHandler}
        error={error}
      />
    </div>
  );
};
