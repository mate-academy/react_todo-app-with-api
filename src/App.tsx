/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { FilterBy } from './types/FilterBy';
import { TempTodo } from './types/TempTodo';
import { TodoList } from './components/TodoList';
import { NewTodo } from './components/NewTodo';
import { Filter } from './components/Filter';
import { TodoWarning } from './components/TodoWarning';
import { ErrorMessage } from './types/ErrorMessage';
import { getVisibleTodos } from './utils/visibleTodos';

const USER_ID = 6401;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.all);
  const [title, setTitle] = useState('');
  const [disabledInput, setDisabledInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<TempTodo | null>(null);
  const [errorMessage, setErrorMessage]
    = useState<ErrorMessage>(ErrorMessage.none);
  const [loadingTodoIds, setLoadingTodoIds] = useState([0]);

  const getTodosFromServer = useCallback(
    async () => {
      try {
        const todosList = await getTodos(USER_ID);

        setTodos(todosList);
      } catch (error) {
        setIsError(true);
        setErrorMessage(ErrorMessage.loadTodo);
      }
    }, [todos],
  );

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const allTodosCompleted = useMemo(() => (
    todos.every(todo => todo.completed)), [todos]);

  const visibleTodos
    = useMemo(() => getVisibleTodos(todos, filterBy), [todos, filterBy]);

  if (isError) {
    let timerId;

    clearTimeout(timerId);

    timerId = setTimeout(() => setIsError(false), 3000);
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodoToServer = async () => {
    const newTitle = title.trim();

    try {
      if (newTitle) {
        const newTodo = {
          title: newTitle,
          userId: USER_ID,
          completed: false,
        };

        setDisabledInput(true);
        setTempTodo({ id: 0, ...newTodo });
        const addedTodo = await addTodo(USER_ID, newTodo);

        setTodos((current) => [...current, addedTodo]);
      } else {
        setErrorMessage(ErrorMessage.title);
        setIsError(true);
      }
    } catch {
      setErrorMessage(ErrorMessage.addTodo);
      setIsError(true);
    } finally {
      setTitle('');
      setDisabledInput(false);
      setTempTodo(null);
    }
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addTodoToServer();
  };

  const deleteTodoFromServer = async (todoId: number) => {
    setLoadingTodoIds(current => [...current, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(current => current.filter(todo => todo.id !== todoId));
    } catch {
      setIsError(true);
      setErrorMessage(ErrorMessage.deleteTodo);
    } finally {
      setLoadingTodoIds([0]);
    }
  };

  const onButtonRemove = (todoId: number) => {
    deleteTodoFromServer(todoId);
  };

  const updateCompleteStatus = async (todoId: number, status: boolean) => {
    try {
      const newStatus = { completed: !status };

      setLoadingTodoIds(current => [...current, todoId]);

      await updateTodo(todoId, newStatus);
      await getTodosFromServer();
    } catch {
      setIsError(true);
      setErrorMessage(ErrorMessage.updateTodo);
    } finally {
      setLoadingTodoIds([0]);
    }
  };

  const updateTodoTitle = async (todoId: number, newTitle: string) => {
    try {
      setLoadingTodoIds(current => [...current, todoId]);

      await updateTodo(todoId, { title: newTitle });
      await getTodosFromServer();
    } catch {
      setIsError(true);
      setErrorMessage(ErrorMessage.updateTodo);
    } finally {
      setLoadingTodoIds([0]);
    }
  };

  const updateTitle = (todoId: number, newTitle: string) => {
    updateTodoTitle(todoId, newTitle);
  };

  const toggleStatusCompleted = (todoId: number, completed: boolean) => {
    updateCompleteStatus(todoId, completed);
  };

  const toggleAllStatuses = () => {
    if (allTodosCompleted) {
      todos.forEach(todo => toggleStatusCompleted(todo.id, todo.completed));
    } else {
      const todosToComplete = todos.filter(todo => !todo.completed);

      todosToComplete.forEach(todo => (
        toggleStatusCompleted(todo.id, todo.completed)));
    }
  };

  const removeCompletedTodos = async () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    try {
      setLoadingTodoIds(current => [...current, ...completedTodoIds]);

      await Promise.all(
        completedTodoIds.map(id => deleteTodo(id)),
      );

      setTodos(current => current.filter(todo => !todo.completed));
    } catch {
      setIsError(true);
      setErrorMessage(ErrorMessage.deleteTodo);
    } finally {
      setLoadingTodoIds([0]);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          allTodosCompleted={allTodosCompleted}
          title={title}
          setTitle={setTitle}
          disabledInput={disabledInput}
          onFormSubmit={onFormSubmit}
          toggleAllStatuses={toggleAllStatuses}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              visibleTodos={visibleTodos}
              tempTodo={tempTodo}
              onButtonRemove={onButtonRemove}
              loadingTodoIds={loadingTodoIds}
              ToggleStatusCompleted={toggleStatusCompleted}
              updateTitle={updateTitle}
            />

            <Filter
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              todos={todos}
              removeCompletedTodos={removeCompletedTodos}
            />
          </>
        )}
      </div>
      <TodoWarning
        isError={isError}
        setIsError={setIsError}
        errorMessage={errorMessage}
      />
    </div>
  );
};
