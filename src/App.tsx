import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Errors } from './components/Errors';
import { Footer } from './components/Footer';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import {
  getTodos, addTodo, removeTodo, changeTodo,
} from './api/todos';
import { UserWarning } from './UserWarning';
import { filterTodos } from './utils/prepareTodos';
import { Error } from './types/Error';

const USER_ID = 6405;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState <Error>(Error.NONE);
  const [filterType, setFilterType] = useState<Filter>(Filter.ALL);
  const [todoTitle, setTodoTitle] = useState('');
  const [isAddWaiting, setIsAddWaiting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDeleteWaiting, setIsDeleteWaiting] = useState(false);
  const [onRemoveTodoIds, setOnRemoveTodoIds] = useState<number[]>([]);
  const [todosIdsToUpdate, setTodosIdsToUpdate] = useState<number[]>([]);
  const [isUpdateWaiting, setIsUpdateWaiting] = useState(false);

  const changeRemoveTodoIds = useCallback((value: number[]) => {
    setOnRemoveTodoIds(value);
  }, []);

  const removeError = () => {
    window.setTimeout(() => setError(Error.NONE), 3000);
  };

  const loadTodosFromServer = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setError(Error.ONLOAD);
    }
  };

  useEffect(() => {
    loadTodosFromServer();
  }, []);

  const addNewTodo = async () => {
    try {
      setIsAddWaiting(true);

      const newTodo = {
        userId: USER_ID,
        title: todoTitle.trim(),
        completed: false,
      };

      await addTodo(USER_ID, newTodo);

      const demoTodo = {
        ...newTodo,
        id: 0,
      };

      setTempTodo(demoTodo);

      await loadTodosFromServer();
    } catch {
      setError(Error.ONADD);
    } finally {
      setIsAddWaiting(false);
      setTempTodo(null);
    }
  };

  const deleteTodo = useCallback(async (todoId: number) => {
    try {
      setIsDeleteWaiting(true);

      await removeTodo(USER_ID, todoId);
      await loadTodosFromServer();
    } catch {
      setError(Error.ONDELETE);
    } finally {
      setIsDeleteWaiting(false);
    }
  }, []);

  const changeCompletedStatus = async (todoId: number, status: boolean) => {
    try {
      setIsUpdateWaiting(true);

      const changedData = {
        completed: status,
      };

      await changeTodo(USER_ID, todoId, changedData);
      await loadTodosFromServer();
    } catch {
      setError(Error.ONUPDATE);
    } finally {
      setIsUpdateWaiting(false);
    }
  };

  const changeTodoTitle = async (todoId: number, newTitle: string) => {
    try {
      setIsUpdateWaiting(true);

      const changedData = {
        title: newTitle,
      };

      await changeTodo(USER_ID, todoId, changedData);
      await loadTodosFromServer();
    } catch {
      setError(Error.ONUPDATE);
    } finally {
      setIsUpdateWaiting(false);
    }
  };

  const visibleTodos = useMemo(() => (
    filterTodos(todos, filterType)
  ), [todos, filterType]);

  const completedTodos = useMemo(() => todos
    .filter(todo => todo.completed), [todos]);

  const todosCounter = todos.length - completedTodos.length;
  const isAllTodosCompleted = completedTodos.length === todos.length;
  const haveTodos = todos.length !== 0;

  const setFilterTypeWrapper = useCallback((value: Filter) => {
    setFilterType(value);
  }, []);

  const setTodoTitleWrapper = (value: string) => {
    setTodoTitle(value);
  };

  const setErrorWrapper = (currentError: Error) => {
    setError(currentError);
  };

  const completedTodoIds = completedTodos.map(todo => todo.id);

  const deleteCompletedTodos = () => {
    setOnRemoveTodoIds(completedTodoIds);

    completedTodoIds.map(id => deleteTodo(id));
  };

  const removeDeleteId = (removedId: number) => {
    setOnRemoveTodoIds((currentIds) => currentIds
      .filter(id => id !== removedId));
  };

  const changeTodosIdsToUpdate = (value: number) => {
    setTodosIdsToUpdate((currentIds) => [...currentIds, value]);
  };

  const removeUpdatedId = (idToRemove: number) => {
    setTodosIdsToUpdate((currentIds) => currentIds
      .filter(id => id !== idToRemove));
  };

  const resetTodosIdsToUpdate = () => {
    setTodosIdsToUpdate([]);
  };

  const toggleAllTodosStatus = async (status: boolean) => {
    todos.map(todo => changeTodosIdsToUpdate(todo.id));

    await Promise.all(todos
      .map(todo => changeCompletedStatus(todo.id, status)));

    resetTodosIdsToUpdate();
  };

  const renderTodoList = todos.length > 0 || tempTodo !== null;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todoTitle={todoTitle}
          setTodoTitleWrapper={setTodoTitleWrapper}
          setErrorWrapper={setErrorWrapper}
          addNewTodo={addNewTodo}
          isLoading={isAddWaiting}
          isAllTodosCompleted={isAllTodosCompleted}
          haveTodos={haveTodos}
          toggleAllTodosStatus={toggleAllTodosStatus}
        />

        {(renderTodoList) && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              deleteTodo={deleteTodo}
              isDeleteWaiting={isDeleteWaiting}
              todosIdsToRemove={onRemoveTodoIds}
              changeRemoveTodoIds={changeRemoveTodoIds}
              removeDeleteId={removeDeleteId}
              changeCompletedStatus={changeCompletedStatus}
              isUpdateWaiting={isUpdateWaiting}
              todosIdsToUpdate={todosIdsToUpdate}
              changeTodosIdsToUpdate={changeTodosIdsToUpdate}
              removeUpdatedId={removeUpdatedId}
              changeTodoTitle={changeTodoTitle}
            />

            <Footer
              filterType={filterType}
              setFilterTypeWrapper={setFilterTypeWrapper}
              todos={todos}
              todosCounter={todosCounter}
              deleteCompletedTodos={deleteCompletedTodos}
            />
          </>
        )}

      </div>

      <Errors
        error={error}
        setErrorWrapper={setErrorWrapper}
        removeError={removeError}
      />
    </div>
  );
};
