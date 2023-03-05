/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { NewFormTodo } from './components/NewFormTodo';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { Notifications } from './components/Notificiations';
import { Todo } from './types/Todo';
import {
  getTodos,
  addTodo,
  removeTodo,
  changeTodo,
} from './api/todos';
import { Filter } from './types/FilterBy';
import { filterTodos } from './utils/filterTodos';
import { Error } from './types/Error';

const USER_ID = 6414;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState <Error>(Error.NONE);
  const [filterType, setFilterType] = useState<Filter>(Filter.ALL);
  const [todoTitle, setTodoTitle] = useState('');
  const [isAddWaiting, setIsAddWaiting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDeleteWaiting, setIsDeleteWaiting] = useState(false);
  const [todosIdsToRemove, setTodosIdsToRemove] = useState<number[]>([]);
  const [todosIdsToUpdate, setTodosIdsToUpdate] = useState<number[]>([]);

  const removeError = useCallback(() => {
    window.setTimeout(() => setError(Error.NONE), 3000);
  }, []);

  const loadTodosFromServer = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setError(Error.ONLOAD);
    }
  }, []);

  useEffect(() => {
    loadTodosFromServer();
  }, []);

  const addNewTodo = useCallback(async () => {
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
  }, [todoTitle]);

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
      setIsDeleteWaiting(true);

      const changedData = {
        completed: status,
      };

      await changeTodo(USER_ID, todoId, changedData);
      await loadTodosFromServer();
    } catch {
      setError(Error.ONUPDATE);
    } finally {
      setIsDeleteWaiting(false);
    }
  };

  const changeTodoTitle = async (todoId: number, newTitle: string) => {
    try {
      setIsDeleteWaiting(true);

      const changedData = {
        title: newTitle,
      };

      await changeTodo(USER_ID, todoId, changedData);
      await loadTodosFromServer();
    } catch {
      setError(Error.ONUPDATE);
    } finally {
      setIsDeleteWaiting(false);
    }
  };

  const visibleTodos = filterTodos(todos, filterType);
  const completedTodos = useMemo(() => todos
    .filter(todo => todo.completed), [todos]);
  const activeTodos = todos.length - completedTodos.length;
  const isAllTodosCompleted = completedTodos.length === todos.length;
  const haveTodos = todos.length !== 0;

  const onFilterTypeChange = useCallback((value: Filter) => {
    setFilterType(value);
  }, []);

  const onTodoTitleChange = useCallback((value: string) => {
    setTodoTitle(value);
  }, []);

  const handleErrors = useCallback((currentError: Error) => {
    setError(currentError);
  }, []);

  const completedTodoIds = useMemo(() => completedTodos
    .map(todo => todo.id), [completedTodos]);

  const changeTodosIdsToRemove = useCallback((value: number) => {
    setTodosIdsToRemove((currentIds) => [...currentIds, value]);
  }, []);

  const deleteCompletedTodos = useCallback(() => {
    completedTodoIds.map(id => changeTodosIdsToRemove(id));

    completedTodoIds.map(id => deleteTodo(id));
  }, [completedTodoIds]);

  const removeDeleteId = (removedId: number) => {
    setTodosIdsToRemove((currentIds) => currentIds
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

  const toggleAllTodosStatus = useCallback(async (status: boolean) => {
    todos.forEach(todo => {
      if (todo.completed !== status) {
        changeTodosIdsToUpdate(todo.id);
      }
    });

    await Promise.all(todos
      .map(todo => changeCompletedStatus(todo.id, status)));

    resetTodosIdsToUpdate();
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewFormTodo
          todoTitle={todoTitle}
          onTodoTitleChange={onTodoTitleChange}
          handleErrors={handleErrors}
          addNewTodo={addNewTodo}
          isLoading={isAddWaiting}
          isAllTodosCompleted={isAllTodosCompleted}
          haveTodos={haveTodos}
          toggleAllTodosStatus={toggleAllTodosStatus}
        />

        {(todos.length > 0 || tempTodo !== null) && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              deleteTodo={deleteTodo}
              isDeleteWaiting={isDeleteWaiting}
              todosIdsToRemove={todosIdsToRemove}
              changeTodosIdsToRemove={changeTodosIdsToRemove}
              removeDeleteId={removeDeleteId}
              changeCompletedStatus={changeCompletedStatus}
              todosIdsToUpdate={todosIdsToUpdate}
              changeTodosIdsToUpdate={changeTodosIdsToUpdate}
              removeUpdatedId={removeUpdatedId}
              changeTodoTitle={changeTodoTitle}
            />

            <TodoFilter
              filterType={filterType}
              onFilterTypeChange={onFilterTypeChange}
              completedTodos={completedTodos.length}
              activeTodos={activeTodos}
              deleteCompletedTodos={deleteCompletedTodos}
            />
          </>
        )}

      </div>

      <Notifications
        error={error}
        handleErrors={handleErrors}
        removeError={removeError}
      />
    </div>
  );
};
