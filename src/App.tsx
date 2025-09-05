/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodos,
  deleteTodos,
  getTodos,
  updateTodos,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/header';
import { TodoList } from './components/todoList';
import { Footer } from './components/footer';
import { Sort } from './types/Sort';
import { ErrorMassage } from './components/errorMassage';
import { ErrorMessage } from './types/ErrorMessage';

const normalize = (todos: Todo[]): Todo[] =>
  todos.map(t => ({ ...t, completed: t.completed === true }));

export const App: React.FC = () => {
  const [userTodos, setUserTodos] = useState<Todo[]>([]);
  const [errorMassage, setErrorMassage] = useState<ErrorMessage | null>(null);
  const [errorKey, setErrorKey] = useState(0);
  const [sortTodo, setSortTodo] = useState<Sort>('all');

  const [isLoader, setIsLoader] = useState<string | number | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [focusSignal, setFocusSignal] = useState(0);

  const hideErrorNow = useCallback(() => setErrorMassage(null), []);
  const showError = useCallback((msg: ErrorMessage) => {
    setErrorMassage(msg);
    setErrorKey(k => k + 1);
  }, []);

  useEffect(() => {
    getTodos()
      .then(ts => setUserTodos(normalize(ts)))
      .catch(() => showError(ErrorMessage.Load));
  }, [showError]);

  const isClearCompletedDisabled = useMemo(
    () => !userTodos.some(t => t.completed),
    [userTodos],
  );

  const sortedUserTodo = useMemo(() => {
    switch (sortTodo) {
      case 'active':
        return userTodos.filter(t => !t.completed);
      case 'completed':
        return userTodos.filter(t => t.completed);
      default:
        return userTodos;
    }
  }, [userTodos, sortTodo]);

  const addToDo = useCallback(
    async (title: string): Promise<void> => {
      hideErrorNow();

      const trimmed = title.trim();

      if (!trimmed) {
        showError(ErrorMessage.Empty);

        return;
      }

      setIsLoader('temp');
      setTempTitle(trimmed);

      try {
        const newToDo = await addTodos({
          title: trimmed,
          userId: USER_ID,
          completed: false,
        });

        setUserTodos(curr => [
          ...curr,
          { ...newToDo, completed: newToDo.completed === true },
        ]);
      } catch {
        showError(ErrorMessage.Add);
        throw new Error('create-failed');
      } finally {
        setIsLoader(null);
        setTempTitle('');
      }
    },
    [hideErrorNow, showError],
  );

  const deletePost = useCallback(
    async (postId: number): Promise<void> => {
      hideErrorNow();
      setIsLoader(postId);

      try {
        await deleteTodos(postId);
        setUserTodos(curr => curr.filter(t => t.id !== postId));
        setFocusSignal(s => s + 1);
      } catch {
        showError(ErrorMessage.Delete);
        throw new Error('delete-failed');
      } finally {
        setIsLoader(null);
      }
    },
    [hideErrorNow, showError],
  );

  const updatePost = useCallback(
    async (
      postId: number,
      completed: boolean,
      title: string,
    ): Promise<void> => {
      hideErrorNow();
      setIsLoader(postId);

      try {
        const updatedTodo = await updateTodos({ id: postId, completed, title });

        setUserTodos(prev =>
          prev.map(t =>
            t.id === updatedTodo.id
              ? { ...updatedTodo, completed: updatedTodo.completed === true }
              : t,
          ),
        );
      } catch {
        showError(ErrorMessage.Update);
        throw new Error('update-failed');
      } finally {
        setIsLoader(null);
      }
    },
    [hideErrorNow, showError],
  );

  const clearDelete = useCallback(
    async (completedTodos: Todo[]): Promise<void> => {
      hideErrorNow();

      const completedIds = completedTodos
        .filter(t => t.completed)
        .map(t => t.id);

      const results = await Promise.allSettled(
        completedIds.map(id => deleteTodos(id)),
      );

      const successfulIds = completedIds.filter(
        (_, i) => results[i].status === 'fulfilled',
      );

      if (successfulIds.length !== completedIds.length) {
        showError(ErrorMessage.Delete);
      }

      setUserTodos(curr => curr.filter(t => !successfulIds.includes(t.id)));
      setFocusSignal(s => s + 1);
    },
    [hideErrorNow, showError],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {!USER_ID ? (
        <UserWarning />
      ) : (
        <>
          <div className="todoapp__content">
            <Header
              onSubmit={addToDo}
              userTodos={userTodos}
              setUserTodos={setUserTodos}
              setIsLoader={setIsLoader}
              focusSignal={focusSignal}
            />

            <TodoList
              sortedUserTodo={sortedUserTodo}
              onDelete={deletePost}
              onUpdate={updatePost}
              isLoader={isLoader}
              tempTitle={tempTitle}
            />

            {userTodos.length > 0 && (
              <Footer
                sort={setSortTodo}
                userTodo={userTodos}
                visible={isClearCompletedDisabled}
                clearDelete={clearDelete}
              />
            )}
          </div>

          <ErrorMassage
            key={errorKey}
            message={errorMassage}
            onClose={hideErrorNow}
          />
        </>
      )}
    </div>
  );
};
