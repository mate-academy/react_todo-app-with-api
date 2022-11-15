import React, {
  useContext,
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import { NewTodo } from './components/NewTodo';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { ErrorNotice } from './components/ErrorNotice';

import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';

import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';

import { ErrorNoticeType } from './types/ErrorNoticeType';

const defaultTodo = {
  id: 0,
  userId: 0,
  title: '',
  completed: false,
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [temporaryTodo, setTemporaryTodo] = useState(defaultTodo);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const [isAdding, setIsAdding] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [errorNotice, setErrorNotice]
    = useState<ErrorNoticeType>(ErrorNoticeType.None);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const getTodosFromServer = useCallback(
    async () => {
      if (!user) {
        return;
      }

      try {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      } catch {
        setErrorNotice(ErrorNoticeType.LoadError);
      }
    }, [],
  );

  const filteredTodos = useMemo(() => (
    todos.filter(({ completed }) => {
      switch (filterType) {
        case FilterType.ACTIVE:
          return !completed;

        case FilterType.COMPLETED:
          return completed;

        default:
          return todos;
      }
    })
  ), [todos, filterType]);

  const completedTodos = useMemo(() => (
    todos.filter(({ completed }) => completed)
  ), [todos]);

  const postTodoToServer = useCallback(
    async (title: string) => {
      if (!user) {
        return;
      }

      try {
        setIsAdding(true);
        setTemporaryTodo(currentTodo => ({
          ...currentTodo,
          title,
          userId: user.id,
        }));

        await createTodo({
          title,
          userId: user.id,
          completed: false,
        });

        await getTodosFromServer();
      } catch {
        setErrorNotice(ErrorNoticeType.AddError);
      } finally {
        setIsAdding(false);
      }
    }, [],
  );

  const deleteTodoFromServer = useCallback(
    async (todoId: number) => {
      try {
        setLoadingIds(currentsIds => [...currentsIds, todoId]);

        await deleteTodo(todoId);

        await getTodosFromServer();

        setLoadingIds(currentsIds => (
          currentsIds.filter(id => id !== todoId)
        ));
      } catch {
        setErrorNotice(ErrorNoticeType.DeleteError);
      }
    }, [],
  );

  const clearAllCompletedTodos = useCallback(
    async () => {
      try {
        await Promise.all(completedTodos.map(({ id }) => (
          deleteTodoFromServer(id)
        )));
      } catch {
        setErrorNotice(ErrorNoticeType.DeleteError);
      }
    }, [completedTodos],
  );

  const patchTodoStatusOnServer = useCallback(
    async (todoId: number, status: boolean) => {
      try {
        setLoadingIds(currentIds => [...currentIds, todoId]);

        await updateTodo(todoId, { completed: status });

        await getTodosFromServer();

        setLoadingIds(currentIds => (
          currentIds.filter(id => id !== todoId)
        ));
      } catch {
        setErrorNotice(ErrorNoticeType.UpdateError);
      }
    }, [todos],
  );

  const toggleAllTodosStatus = useCallback(
    async () => {
      try {
        const couldBeToggled = completedTodos.length !== todos.length
          ? todos.filter(({ completed }) => !completed)
          : todos;

        await Promise.all(couldBeToggled.map(({ id, completed }) => (
          patchTodoStatusOnServer(id, !completed)
        )));
      } catch {
        setErrorNotice(ErrorNoticeType.UpdateError);
      }
    }, [todos],
  );

  const patchTodoTitleOnServer = useCallback(
    async (todoId: number, title: string) => {
      try {
        setLoadingIds(currentIds => [...currentIds, todoId]);

        await updateTodo(todoId, { title });

        await getTodosFromServer();

        setLoadingIds(currentIds => (
          currentIds.filter(id => id !== todoId)
        ));
      } catch {
        setErrorNotice(ErrorNoticeType.UpdateError);
      }
    }, [todos],
  );

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosFromServer();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">
        todos
      </h1>

      <div className="todoapp__content">
        <NewTodo
          newTodoField={newTodoField}
          isAdding={isAdding}
          isToggleVisible={todos.length !== 0}
          isAllTodosCompleted={todos.length === completedTodos.length}
          setErrorNotice={setErrorNotice}
          postTodoToServer={postTodoToServer}
          toggleAllTodosStatus={toggleAllTodosStatus}
        />

        {todos.length !== 0 && (
          <>
            <TodoList
              filteredTodos={filteredTodos}
              temporaryTodo={temporaryTodo}
              isAdding={isAdding}
              loadingIds={loadingIds}
              deleteTodoFromServer={deleteTodoFromServer}
              patchTodoStatusOnServer={patchTodoStatusOnServer}
              patchTodoTitleOnServer={patchTodoTitleOnServer}
            />

            <TodoFilter
              todos={todos}
              completedTodos={completedTodos}
              filterType={filterType}
              setFilterType={setFilterType}
              clearAllCompletedTodos={clearAllCompletedTodos}
            />
          </>
        )}
      </div>

      {errorNotice !== ErrorNoticeType.None && (
        <ErrorNotice
          errorNotice={errorNotice}
          setErrorNotice={setErrorNotice}
        />
      )}
    </div>
  );
};
