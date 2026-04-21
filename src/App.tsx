/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodosList } from './components/TodosList';
import { FilterStatus } from './types/FilterStatus';
import { Footer } from './components/Footer';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { USER_ID } from './types/UserId';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [titleInput, setTitleInput] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState('');

  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [editTitleInput, setEditTitleInput] = useState('');

  const [isProssesingId, setIsProssesingId] = useState<number[]>([]);

  const [disabledHeaderInput, setDisabledHeaderInput] = useState(false);

  // #region focus
  const headerInputRef = useRef<HTMLInputElement | null>(null);

  const headerFocus = useCallback(() => {
    headerInputRef.current?.focus();
  }, []);

  useEffect(() => {
    headerFocus();
  }, [headerFocus]);

  useEffect(() => {
    if (!disabledHeaderInput) {
      headerInputRef.current?.focus();
    }
  }, [disabledHeaderInput]);

  const timerId = useRef(0);

  const handleSetError = useCallback((newError: string) => {
    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      setError('');
    }, 3000);

    setError(newError);
  }, []);
  // #endregion

  // #region useMemo variable
  const filteredTodos: Todo[] = useMemo(() => {
    if (filter === FilterStatus.All) {
      return todos;
    }

    return todos.filter(todo =>
      filter === FilterStatus.Active ? !todo.completed : todo.completed,
    );
  }, [todos, filter]);

  const hasCompletedTodo: boolean = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  const hasTodo: boolean = useMemo(() => {
    return todos.length !== 0;
  }, [todos]);

  const isEveryCompletedTodo: boolean = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const itemsLeft: number = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  // #endregion

  const setProssesingTodo = useCallback(
    (todoIds: number[], isProsess: boolean) => {
      if (isProsess) {
        setIsProssesingId(prev => [...prev, ...todoIds]);

        return;
      }

      setIsProssesingId(prev => prev.filter(id => !todoIds.includes(id)));
    },
    [],
  );

  const deleteTodo = useCallback(
    async (todoId: number) => {
      try {
        setProssesingTodo([todoId], true);
        await todoService.deleteTodo(todoId);
        setTodos(current => current.filter(todo => todo.id !== todoId));
      } catch {
        handleSetError('Unable to delete a todo');
        throw new Error('Unable to delete a todo');
      } finally {
        setProssesingTodo([todoId], false);
        headerFocus();
      }
    },
    [headerFocus, setProssesingTodo, handleSetError],
  );

  const updateTodo = useCallback(
    async (todo: Partial<Todo> & Pick<Todo, 'id'>) => {
      const currentTodo = todos.find(todofind => todofind.id === todo.id);

      if (!currentTodo) {
        handleSetError('Unable to update a todo');

        return;
      }

      const isDifferent = (Object.keys(todo) as (keyof Todo)[]).some(
        todoKey => todo[todoKey] !== currentTodo[todoKey],
      );

      if (!isDifferent) {
        return;
      }

      return todoService.updateTodo(todo);
    },
    [todos, handleSetError],
  );

  const handleToggleCompleleTodo = useCallback(
    ({ id, completed }: Pick<Todo, 'id' | 'completed'>) => {
      setProssesingTodo([id], true);

      updateTodo({ id, completed: !completed })
        .then(updatedTodo => {
          if (!updatedTodo) {
            return;
          }

          setTodos(prevTodos => {
            const newTodos = [...prevTodos];
            const index = newTodos.findIndex(
              todo => todo.id === updatedTodo.id,
            );

            newTodos.splice(index, 1, updatedTodo);

            return newTodos;
          });
        })
        .catch(() => {
          handleSetError('Unable to update a todo');
        })
        .finally(() => {
          setProssesingTodo([id], false);
        });
    },
    [setProssesingTodo, updateTodo, handleSetError],
  );

  const handleEditSubmit = useCallback(
    ({ title, id }: Todo) => {
      if (title === editTitleInput) {
        setEditTodo(null);

        return;
      }

      const trimmedTitle = editTitleInput.trim();

      if (trimmedTitle.length === 0) {
        deleteTodo(id);

        return;
      }

      setEditTitleInput(trimmedTitle);
      setProssesingTodo([id], true);

      updateTodo({ title: trimmedTitle, id: id })
        .then(updatedTodo => {
          if (!updatedTodo) {
            return;
          }

          setTodos(prev => {
            const newTodos = [...prev];
            const index = newTodos.findIndex(
              todo => todo.id === updatedTodo.id,
            );

            newTodos[index].title = trimmedTitle;

            return newTodos;
          });
          setEditTodo(null);
        })
        .catch(() => {
          handleSetError('Unable to update a todo');
        })
        .finally(() => {
          setProssesingTodo([id], false);
        });
    },
    [deleteTodo, editTitleInput, setProssesingTodo, updateTodo, handleSetError],
  );

  const toggleAll = useCallback(async () => {
    const needToggleTodos = todos.filter(todo =>
      isEveryCompletedTodo ? true : !todo.completed,
    );

    const ids = needToggleTodos.map(todo => todo.id);

    setProssesingTodo(ids, true);

    try {
      const results = await Promise.allSettled(
        needToggleTodos.map(todo =>
          updateTodo({ id: todo.id, completed: !isEveryCompletedTodo }),
        ),
      );

      const fulfilledTodos = results
        .filter(
          (result): result is PromiseFulfilledResult<Todo> =>
            result.status === 'fulfilled' && result.value !== undefined,
        )
        .map(result => result.value);

      if (results.some(result => result.status === 'rejected')) {
        handleSetError('Unable to update todos');
      }

      setTodos(prevTodos =>
        prevTodos.map(todo => {
          const updatedTodo = fulfilledTodos.find(item => item.id === todo.id);

          return updatedTodo ?? todo;
        }),
      );
    } finally {
      setProssesingTodo(ids, false);
    }
  }, [
    todos,
    isEveryCompletedTodo,
    updateTodo,
    handleSetError,
    setProssesingTodo,
  ]);

  const clearCompletedTodos = useCallback(async () => {
    try {
      const idsComplited = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      setIsProssesingId((currentIsDeleting: number[]) => [
        ...currentIsDeleting,
        ...idsComplited,
      ]);

      const promiseDeletingTodos = await Promise.allSettled(
        idsComplited.map(id => todoService.deleteTodo(id)),
      );

      const succeeded = promiseDeletingTodos
        .map((r, i) => (r.status === 'fulfilled' ? idsComplited[i] : null))
        .filter(Boolean) as number[];

      setTodos(prev => prev.filter(t => !succeeded.includes(t.id)));

      if (promiseDeletingTodos.some(r => r.status === 'rejected')) {
        handleSetError('Unable to delete a todo');
      }

      setIsProssesingId((currentIsDeleting: number[]) =>
        currentIsDeleting.filter(id => !idsComplited.includes(id)),
      );

      headerFocus();
    } catch {
      handleSetError('Unable to delete a todo');
    }
  }, [todos, headerFocus, handleSetError]);

  const addTodo = useCallback(
    async (title: string) => {
      const trimmedTitle = title.trim();

      if (trimmedTitle.length === 0) {
        handleSetError('Title should not be empty');

        return;
      }

      setDisabledHeaderInput(true);
      setTempTodo({
        title: trimmedTitle,
        completed: false,
        userId: USER_ID,
      } as Todo);

      try {
        const newTodo = await todoService.createTodo({
          title: trimmedTitle,
          completed: false,
          userId: USER_ID,
        });

        setTitleInput('');
        setTodos(currentTodos => [...currentTodos, newTodo]);
      } catch {
        handleSetError('Unable to add a todo');
      } finally {
        setTempTodo(null);
        setDisabledHeaderInput(false);
      }
    },
    [handleSetError],
  );

  useEffect(() => {
    todoService
      .getTodos()
      .then(todo => {
        window.clearTimeout(timerId.current);
        setTodos(todo);
      })
      .catch(() => {
        handleSetError('Unable to load todos');
      });
  }, [handleSetError]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasTodo={hasTodo}
          onToggleAll={toggleAll}
          isEveryCompletedTodo={isEveryCompletedTodo}
          headerInputRef={headerInputRef}
          title={titleInput}
          setTitle={setTitleInput}
          addTodo={addTodo}
          disabledInput={disabledHeaderInput}
        />

        <TodosList
          editTitleInput={editTitleInput}
          setEditTitleInput={setEditTitleInput}
          onEditSubmit={handleEditSubmit}
          editTodo={editTodo}
          setEditTodo={setEditTodo}
          handleToggleCompleleTodo={handleToggleCompleleTodo}
          todos={filteredTodos}
          onDelete={deleteTodo}
          tempTodo={tempTodo}
          isProssesingId={isProssesingId}
        />

        {todos.length !== 0 && (
          <Footer
            itemsLeft={itemsLeft}
            setFilter={setFilter}
            filter={filter}
            hasCompletedTodo={hasCompletedTodo}
            onClearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
