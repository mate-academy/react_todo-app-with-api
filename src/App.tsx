/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-param-reassign */
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { NewTodoField } from './components/NewTodoField/NewTodoField';
import { TodoFilters } from './components/TodoFilters/TodoFilters';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [isLoadError, setIsLoadError] = useState(false);
  const [isUploadError, setIsUploadError] = useState(false);
  const [isRemoveError, setIsRemoveError] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filtredTodos, setFiltredTodos] = useState<Todo[]>([]);
  const [isEmptyTitle, setIsEmptyTitle] = useState(false);
  const [isTodoLoading, setIsTodoLoading] = useState(false);
  const [isUpdatedError, setIsUpdatedError] = useState(false);
  const [deletedTodosId, setDeletedTodosId] = useState<number[]>([]);
  const [activeTodoId, setActiveTodoId] = useState<number[]>([]);
  const [isUpdatedTodo, setIsUpdatedTodo] = useState(false);

  const user = useContext(AuthContext);

  const loadTodosFromServer = async () => {
    try {
      if (user) {
        const getTodosFromServer = await getTodos(user.id);

        setTodos(getTodosFromServer);
      }
    } catch (error) {
      setIsLoadError(true);
    }
  };

  const uploadTodosOnServer = async (todo: Todo) => {
    if (user) {
      try {
        setIsTodoLoading(true);
        setActiveTodoId([0]);
        setTempTodo(todo);

        const newTodo = await createTodo({
          title: todo.title,
          userId: todo.userId,
          completed: false,
        });

        setTodos(prevTodos => [...prevTodos, newTodo]);
        setIsTodoLoading(false);
        setTempTodo(null);
        setActiveTodoId([]);
      } catch {
        setIsUploadError(true);
        setTodos(todos);
        setTempTodo(null);
        setIsTodoLoading(false);
      }
    }
  };

  const hendleRemoveTodo = async (id: number) => {
    try {
      setDeletedTodosId(prevIds => [...prevIds, id]);
      await deleteTodo(id);
      const visibleTodos = filtredTodos.filter(todo => {
        return todo.id !== id;
      });

      setTodos(visibleTodos);
    } catch {
      setIsRemoveError(true);
    }

    setDeletedTodosId([]);
  };

  const editTodo = async (id: number, newTitle: string) => {
    const updatedTodos = [...todos].map((todo) => {
      if (todo.id === id) {
        todo.title = newTitle;
      }

      return todo;
    });

    setTodos(updatedTodos);

    try {
      await updateTodo(id, { title: newTitle });
      setIsUpdatedTodo(true);
    } catch {
      setIsUpdatedError(true);
    }

    setIsUpdatedTodo(false);
  };

  const clearCompleted = async () => {
    const doneTasks = todos.filter(todo => todo.completed === true);
    const doneIds = doneTasks.map((todo) => {
      return todo.id;
    });

    setDeletedTodosId(doneIds);

    await Promise.all(doneTasks.map((todo) => deleteTodo(todo.id)));

    const visibleTodos = filtredTodos.filter(todo => {
      return todo.completed === false;
    });

    setTodos(visibleTodos);

    setDeletedTodosId([]);
  };

  const hendeleCheckboxChange = async (id: number, completed: boolean) => {
    try {
      setIsUpdatedError(false);

      await updateTodo(id, { completed: !completed });

      const checkedTodoList = todos.map(todo => {
        if (todo.id === id) {
          return { ...todo, completed: !completed };
        }

        return todo;
      });

      setTodos(checkedTodoList);
    } catch {
      setIsUpdatedError(true);
    }
  };

  const completedTodos = useMemo(() => {
    const finishedTodos = todos.filter(todo => todo.completed);

    return finishedTodos.length;
  }, [todos]);

  const toggleAll = async () => {
    const totalTodos = todos.length;
    const are = todos.filter(todo => todo.completed).length === totalTodos;

    setTodos(todos.map(todo => ({ ...todo, completed: !are })));

    try {
      const notCompletedTodos = todos.filter(todo => todo.completed === false);

      if (notCompletedTodos.length > 0) {
        notCompletedTodos.forEach(async todo => {
          updateTodo(todo.id, { completed: !todo.completed });
        });
      } else {
        todos.forEach(async todo => {
          updateTodo(todo.id, { completed: !todo.completed });
        });
      }
    } catch {
      setIsUpdatedError(true);
    }
  };

  useEffect(() => {
    loadTodosFromServer();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadError(false);
      setIsEmptyTitle(false);
    }, 3000);

    clearTimeout(timer);
  }, [isLoadError, isEmptyTitle]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">

        <NewTodoField
          onAdd={uploadTodosOnServer}
          toggleAll={toggleAll}
          isUploadError={isUploadError}
          setIsEmptyTitle={setIsEmptyTitle}
          isTodoLoading={isTodoLoading}
        />
        <TodoList
          filtredTodos={filtredTodos}
          isTodoLoading={isTodoLoading}
          deletedTodosId={deletedTodosId}
          tempTodo={tempTodo}
          activeTodoId={activeTodoId}
          onDelete={hendleRemoveTodo}
          hendeleCheckboxChange={hendeleCheckboxChange}
          editTodo={editTodo}
          isUpdatedTodo={isUpdatedTodo}
        />
        <TodoFilters
          todos={todos}
          setFiltredTodos={setFiltredTodos}
          clearCompleted={clearCompleted}
          completedTodos={completedTodos}
        />
      </div>

      {isLoadError && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setIsLoadError(false)}
          />

          Unable to load a todos
        </div>
      )}

      {isEmptyTitle && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setIsEmptyTitle(false)}
          />

          Title can&apos;t be empty
        </div>
      )}

      {isUploadError && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setIsUploadError(false)}
          />

          Unable to add a todo
        </div>
      )}

      {isRemoveError && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setIsRemoveError(false)}
          />

          Unable to delete a todo
        </div>
      )}

      {isUpdatedError && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setIsUpdatedError(false)}
          />

          Unable to update a todo
        </div>
      )}
    </div>
  );
};
