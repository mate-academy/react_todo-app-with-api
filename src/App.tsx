import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodos,
  deleteTodos,
  getTodos,
  updateTodos,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoInput } from './components/TodoInput';
import { ErrorNotification } from './components/ErrorNotification';

enum ErrorMassage {
  Load = 'Unable to load todos',
  Empty = 'Title should not be empty',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Update = 'Unable to update a todo',
}

export enum FilterQuery {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [errorMassage, setErrorMassage] = useState('');
  const [query, setQuery] = useState(FilterQuery.All);
  const [title, setTitle] = useState('');
  const [disableInput, setDisableInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [todoToChange, setTodoToChange] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const getFilteredTodos = useCallback(
    (todosToFilter: Todo[], qureyToFilter: string): Todo[] => {
      switch (qureyToFilter) {
        case FilterQuery.Active:
          return todosToFilter.filter(todo => !todo.completed);
        case FilterQuery.Completed:
          return todosToFilter.filter(todo => todo.completed);
        default:
          return todosToFilter;
      }
    },
    [],
  );

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const todos = await getTodos();

        setVisibleTodos(todos);
      } catch (e) {
        setErrorMassage(ErrorMassage.Load);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (errorMassage) {
      const timer = setTimeout(() => {
        setErrorMassage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMassage]);

  const addTodo = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!title.trim()) {
        setErrorMassage(ErrorMassage.Empty);

        return;
      }

      const newTodo = {
        id: 0,
        title: title.trim(),
        completed: false,
        userId: USER_ID,
      };

      setTempTodo(newTodo);
      try {
        setDisableInput(true);
        const addedTodo = await addTodos(newTodo);

        setVisibleTodos(prev => [...prev, addedTodo]);
        setTitle('');
      } catch (e) {
        setVisibleTodos(prev => prev.filter(todo => todo.id !== 0));
        setErrorMassage(ErrorMassage.Add);
      } finally {
        setDisableInput(false);
        setTempTodo(null);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    },
    [title],
  );

  const deleteTodo = useCallback(async (todoId: number): Promise<boolean> => {
    setTodoToChange(prev => [...prev, todoId]);
    try {
      await deleteTodos(todoId);
      setVisibleTodos(prev => prev.filter(todo => todo.id !== todoId));

      return true;
    } catch (error) {
      setErrorMassage(ErrorMassage.Delete);

      return false;
    } finally {
      setTodoToChange(prev => prev.filter(id => id !== todoId));
      inputRef.current?.focus();
    }
  }, []);

  const clearCompleted = useCallback(async () => {
    const completedTodos = visibleTodos.filter(todo => todo.completed);
    const needDelete = completedTodos.map(todo => todo.id);

    if (needDelete.length === 0) {
      return;
    }

    setTodoToChange(prev => [...prev, ...needDelete]);
    try {
      const deleted = await Promise.allSettled(
        completedTodos.map(todo => deleteTodos(todo.id)),
      );
      const deleteComplited = completedTodos
        .filter((todo, index) => deleted[index].status === 'fulfilled')
        .map(todo => todo.id);

      if (deleted.some(result => result.status === 'rejected')) {
        setErrorMassage(ErrorMassage.Delete);
      }

      if (deleteComplited.length > 0) {
        setVisibleTodos(prev =>
          prev.filter(todo => !deleteComplited.includes(todo.id)),
        );
      }
    } catch (error) {
      setErrorMassage(ErrorMassage.Delete);
    } finally {
      setTodoToChange(prev => prev.filter(id => !needDelete.includes(id)));
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [visibleTodos]);

  const handleUpdateTodo = useCallback(
    async (todoId: number, data: Partial<Todo>) => {
      setTodoToChange(prev => [...prev, todoId]);
      try {
        const updateTodo = await updateTodos(todoId, data);

        setVisibleTodos(prev =>
          prev.map(todo => (todo.id === todoId ? updateTodo : todo)),
        );

        return true;
      } catch {
        setErrorMassage(ErrorMassage.Update);

        return false;
      } finally {
        setTodoToChange(prev => prev.filter(id => id !== todoId));
      }
    },
    [],
  );

  const alreadyCompleted = useMemo(
    () => visibleTodos.length > 0 && visibleTodos.every(todo => todo.completed),
    [visibleTodos],
  );

  const handleToggleAll = useCallback(async () => {
    const targetCompleted = !alreadyCompleted;
    const todosToUpdate = visibleTodos.filter(
      todo => todo.completed !== targetCompleted,
    );

    if (!todosToUpdate.length) {
      return;
    }

    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setTodoToChange(prev => [...prev, ...idsToUpdate]);
    try {
      await Promise.all(
        todosToUpdate.map(todo =>
          updateTodos(todo.id, { completed: targetCompleted }),
        ),
      );
      setVisibleTodos(prev =>
        prev.map(todo => ({ ...todo, completed: targetCompleted })),
      );
    } catch {
      setErrorMassage(ErrorMassage.Update);
    } finally {
      setTodoToChange(prev => prev.filter(id => !idsToUpdate.includes(id)));
    }
  }, [alreadyCompleted, visibleTodos]);

  const handleEditTodo = useCallback((todoId: number) => {
    setEditingTodoId(todoId);
    setTimeout(() => {
      editInputRef.current?.focus();
    }, 0);
  }, []);

  const handleSaveTodo = useCallback(
    async (todoId: number, newTitle: string, oldTitle: string) => {
      const trimmed = newTitle.trim();

      if (!trimmed) {
        try {
          const removed = await deleteTodo(todoId);

          if (!removed) {
            return;
          }
        } catch {
          return;
        }
      } else if (trimmed !== oldTitle) {
        const success = await handleUpdateTodo(todoId, { title: trimmed });

        if (!success) {
          return;
        }
      }

      setEditingTodoId(null);
    },
    [deleteTodo, handleUpdateTodo],
  );

  const handleFormSubmit = useCallback(
    async (
      e: React.FormEvent<HTMLFormElement>,
      todoId: number,
      oldTitle: string,
    ) => {
      e.preventDefault();
      const input = e.currentTarget.elements[0] as HTMLInputElement;

      await handleSaveTodo(todoId, input.value, oldTitle);
    },
    [handleSaveTodo],
  );

  const handleEditKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'Escape':
          setEditingTodoId(null);
          break;
        case 'Enter':
          e.preventDefault();
          e.currentTarget.blur();
          break;
      }
    },
    [],
  );

  const todosForRender = useMemo(
    () => (tempTodo ? [...visibleTodos, tempTodo] : visibleTodos),
    [visibleTodos, tempTodo],
  );
  const filteredTodos = useMemo(
    () => getFilteredTodos(todosForRender, query),
    [getFilteredTodos, todosForRender, query],
  );
  const itemsLeft = useMemo(
    () => visibleTodos.filter(todo => !todo.completed),
    [visibleTodos],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {visibleTodos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: alreadyCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}
          <TodoInput
            inputRef={inputRef}
            title={title}
            setTitle={setTitle}
            addTodo={addTodo}
            disableInput={disableInput}
          />
        </header>
        <TodoList
          todos={filteredTodos}
          editingTodoId={editingTodoId}
          todoToChange={todoToChange}
          handleEditTodo={handleEditTodo}
          handleFormSubmit={handleFormSubmit}
          handleSaveTodo={handleSaveTodo}
          handleEditKeyDown={handleEditKeyDown}
          handleUpdateTodo={handleUpdateTodo}
          deleteTodo={deleteTodo}
          editInputRef={editInputRef}
        />
        {visibleTodos.length !== 0 && (
          <TodoFooter
            itemsLeft={itemsLeft}
            query={query}
            setQuery={setQuery}
            clearCompleted={clearCompleted}
            visibleTodos={visibleTodos}
          />
        )}
      </div>
      <ErrorNotification
        errorMassage={errorMassage}
        setErrorMassage={setErrorMassage}
      />
    </div>
  );
};
