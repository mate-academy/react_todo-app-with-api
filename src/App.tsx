/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Todo } from './types/Todo';
import { User } from './types/User';
import { Error } from './types/Error';
import { AuthContext } from './components/Auth/AuthContext';
import {
  getTodos,
  addTodo,
  deleteTodo,
  changeTodo,
} from './api/todos';

import { TodoList } from './components/TodoList/TodoList';
import { NewTodo } from './components/NewTodo/NewTodo';
import { TodoError } from './components/TodoError/TodoError';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const [userTodos, setUserTodos] = useState<Todo[]>([]);
  const [hasTodos, setHasTodos] = useState(false);
  const [hasError, setHasError] = useState<Error>({ status: false });
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [changingIds, setChangingIds] = useState<number[]>([0]);

  const handleSetError = useCallback((error: Error) => {
    setHasError(error);
    setTimeout(() => {
      setHasError({ status: false });
    }, 3000);
  }, []);

  const handleLoadTodos = useCallback(async () => {
    try {
      setHasError({ status: false });

      const todosFromServer = await getTodos((user as User).id);

      setUserTodos(todosFromServer);
    } catch {
      handleSetError({ status: true });
    }
  }, []);

  useEffect(() => {
    handleLoadTodos();
  }, []);

  useEffect(() => {
    if (userTodos.length !== 0) {
      setHasTodos(true);
    } else {
      setHasTodos(false);
    }
  }, [userTodos]);

  const handleCloseError = useCallback(() => {
    handleSetError({ status: false });
  }, []);

  const handleAddTodo = useCallback(async (title: string) => {
    handleSetError({ status: false });

    try {
      const preparedData = {
        title,
        userId: (user as User).id,
        completed: false,
      };

      setTempTodo({ ...preparedData, id: 0 });
      setIsAdding(true);

      await addTodo(preparedData);
      await handleLoadTodos();

      setIsAdding(false);
    } catch {
      handleSetError({ status: true, message: 'Unable to add a todo' });
      setIsAdding(false);
    }
  }, []);

  const handleDeleteTodo = useCallback(async (id: number) => {
    handleSetError({ status: false });

    try {
      setChangingIds(currValue => [...currValue, id]);

      await deleteTodo(id);
      await handleLoadTodos();

      setChangingIds(currValue => currValue.filter(currId => currId !== id));
    } catch {
      handleSetError({ status: true, message: 'Unable to delete a todo' });
      setChangingIds(currValue => currValue.filter(currId => currId !== id));
    }
  }, []);

  const handleChangeTodoStatus = useCallback(async (todo: Todo) => {
    const { id, completed } = todo;

    handleSetError({ status: false });

    try {
      setChangingIds(currValue => [...currValue, id]);

      await changeTodo(id, { completed: !completed });
      await handleLoadTodos();

      setChangingIds(currValue => currValue.filter(currId => currId !== id));
    } catch {
      handleSetError({ status: true, message: 'Unable to update a todo' });
      setChangingIds(currValue => currValue.filter(currId => currId !== id));
    }
  }, []);

  const handleChangeTodoTitle = useCallback(async (
    id: number,
    newTitle: string,
  ) => {
    handleSetError({ status: false });

    try {
      setChangingIds(currValue => [...currValue, id]);

      await changeTodo(id, { title: newTitle });
      await handleLoadTodos();

      setChangingIds(currValue => currValue.filter(currId => currId !== id));
    } catch {
      handleSetError({ status: true, message: 'Unable to update a todo' });
      setChangingIds(currValue => currValue.filter(currId => currId !== id));
    }
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <NewTodo
            todos={userTodos}
            hasTodos={hasTodos}
            onAdd={handleAddTodo}
            onError={handleSetError}
            onChangeStatus={handleChangeTodoStatus}
          />
        </header>

        {hasTodos && (
          <TodoList
            todos={userTodos}
            tempTodo={tempTodo}
            isAdding={isAdding}
            onDelete={handleDeleteTodo}
            deletingIds={changingIds}
            onChangeStatus={handleChangeTodoStatus}
            onChangeTitle={handleChangeTodoTitle}
          />
        )}

        {hasError.status && (
          <TodoError
            message={hasError.message}
            onCloseError={handleCloseError}
          />
        )}
      </div>
    </div>
  );
};
