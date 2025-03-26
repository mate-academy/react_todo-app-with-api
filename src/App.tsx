/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Todo } from './types/Todo';
import { createTodo, deleteTodo, getTodos, updateTodo } from './api/todo';
import { Filter } from './components/Filter';
import { NewTodo } from './components/NewTodo';
import { TodoList } from './components/TodoList';
import { Error } from './components/Error';

export const App: React.FC = () => {
  const [focused, setFocused] = useState(true);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | undefined>();
  const [isDisabled, setIsDisabled] = useState(false);
  const [todoForDelete, setLoadingMultiplueTodo] = useState<number[]>([]);
  const [renaming, setRenaming] = useState<Todo | undefined>();
  const [focusedForm, setFocusForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLInputElement | null>(null);

  const errorTimeout = useCallback((errorText: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setError(errorText);

    timerRef.current = setTimeout(() => {
      setError('');
    }, 3000);
  }, []);

  useEffect(() => {
    if (focused && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [focused]);

  const handleDelete = async (id: number | undefined) => {
    setError('');
    if (id) {
      setLoadingMultiplueTodo(prev => [...prev, id]);
      try {
        await deleteTodo(id);
        setTodos(prev => prev.filter(todo => todo.id !== id));
      } catch {
        errorTimeout('Unable to delete a todo');
      } finally {
        setLoadingMultiplueTodo(prev => prev.filter(todoId => todoId !== id));
      }
    } else {
      const completedIds = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      setLoadingMultiplueTodo(completedIds);

      const successfulDeletes: number[] = [];

      await Promise.all(
        completedIds.map(async todoId => {
          try {
            await deleteTodo(todoId);
            successfulDeletes.push(todoId);
          } catch {
            errorTimeout('Unable to delete a todo');
          }
        }),
      );

      setTodos(prev =>
        prev.filter(todo => !successfulDeletes.includes(todo.id)),
      );
      setLoadingMultiplueTodo([]);
    }

    setFocused(false);
    setFocused(true);
  };

  const handleRename = useCallback(
    async (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault();

      if (isRenaming) {
        return;
      }

      setIsRenaming(true);
      setError('');
      const trimmedTitle = newTitle.trim();

      const handleRenameDelete = async (id: number) => {
        setError('');
        setLoadingMultiplueTodo(prev => [...prev, id]);
        try {
          await deleteTodo(id);
          setTodos(prev => prev.filter(todo => todo.id !== id));
          setRenaming(undefined); // Закриваємо форму тільки якщо видалення успішне
        } catch {
          errorTimeout('Unable to delete a todo');
        } finally {
          setLoadingMultiplueTodo(prev => prev.filter(todoId => todoId !== id));
          setIsRenaming(false);
        }
      };

      if (!trimmedTitle && renaming) {
        await handleRenameDelete(renaming.id);

        return;
      }

      if (
        !renaming ||
        trimmedTitle === todos.find(t => t.id === renaming.id)?.title
      ) {
        setRenaming(undefined);
        setIsRenaming(false);

        return;
      }

      setLoadingMultiplueTodo(prev => [...prev, renaming.id]);

      try {
        const updatedTodo = await updateTodo({
          ...renaming,
          title: trimmedTitle,
        });

        setTodos(prev =>
          prev.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
        );
        setRenaming(undefined);
      } catch {
        errorTimeout('Unable to update a todo');
      } finally {
        setLoadingMultiplueTodo(prev => prev.filter(id => id !== renaming.id));
        setIsRenaming(false);
      }
    },
    [isRenaming, newTitle, renaming, todos],
  );

  const eventListener = useRef<(key: KeyboardEvent) => void>();

  useEffect(() => {
    if (focusedForm && formRef.current) {
      formRef.current?.focus();
    }

    eventListener.current = (key: KeyboardEvent) => {
      key.preventDefault();

      if (key.code === 'Escape') {
        setRenaming(undefined);
      }
    };

    const handleKey = (key: KeyboardEvent) => {
      eventListener.current?.(key);
    };

    document.addEventListener('keyup', handleKey);

    return () => {
      document.removeEventListener('keyup', handleKey);
    };
  }, [focusedForm, handleRename]);

  useEffect(() => {
    setLoading(true);
    getTodos()
      .then(response => {
        setTodos(response);
      })
      .catch(() => errorTimeout('Unable to load todos'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const handleCreateTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = newTodoTitle.trim();

    if (trimmedTitle === '') {
      errorTimeout('Title should not be empty');

      return;
    }

    setFocused(false);
    setIsDisabled(true);
    setTempTodo({
      userId: 0,
      title: newTodoTitle,
      completed: false,
      id: 0,
    });

    createTodo(trimmedTitle)
      .then(response => {
        setTodos(prev => [...prev, response]);
        setNewTodoTitle('');
        setTempTodo(undefined);
      })
      .catch(() => {
        setIsDisabled(false);
        setFocusForm(true);
        errorTimeout('Unable to add a todo');
        setTempTodo(undefined);
      })
      .finally(() => {
        setIsDisabled(false);
        setFocused(true);
      });
  };

  const handleToggle = async (todo: Todo | undefined) => {
    setError('');

    if (todo) {
      setLoadingMultiplueTodo(prev => [...prev, todo.id]);

      const newTodo: Todo = {
        ...todo,
        completed: !todo.completed,
      };

      updateTodo(newTodo)
        .then(response => {
          setTodos(prev => {
            return prev.map(upd => (upd.id === todo.id ? response : upd));
          });
        })
        .catch(() => {
          errorTimeout(`Unable to update a todo`);
        })
        .finally(() => {
          setLoadingMultiplueTodo(prev =>
            prev.filter(todoId => todoId !== todo.id),
          );
        });
    } else {
      setLoadingMultiplueTodo(todos.map(t => t.id));
      const succesfulTogle: number[] = [];

      const todosRequested = () => {
        if (activeCount !== 0) {
          return todos.filter(t => t.completed === false);
        }

        return todos;
      };

      await Promise.all(
        todosRequested().map(async t => {
          try {
            await updateTodo({ ...t, completed: !t.completed });
            succesfulTogle.push(t.id);
          } catch {
            errorTimeout(`Unable to update a todo`);
          }
        }),
      );

      setTodos(prev =>
        prev.map(newT => {
          if (succesfulTogle.includes(newT.id)) {
            return { ...newT, completed: !newT.completed };
          } else {
            return newT;
          }
        }),
      );

      setLoadingMultiplueTodo([]);
    }
  };

  const getFilteredTodos = useMemo(() => {
    let filteredTodos = todos;

    if (filter === 'all') {
      filteredTodos = todos;
    } else if (filter === 'active') {
      filteredTodos = todos.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      filteredTodos = todos.filter(todo => todo.completed);
    }

    return filteredTodos;
  }, [filter, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          todos={todos}
          loading={loading}
          activeCount={activeCount}
          handleToggle={handleToggle}
          handleCreateTodo={handleCreateTodo}
          setFocused={setFocused}
          inputRef={inputRef}
          newTodoTitle={newTodoTitle}
          isDisabled={isDisabled}
          setNewTodoTitle={setNewTodoTitle}
        />

        <TodoList
          tempTodo={tempTodo}
          todoForDelete={todoForDelete}
          setFocusForm={setFocusForm}
          getFilteredTodos={getFilteredTodos}
          renaming={renaming}
          handleToggle={handleToggle}
          handleRename={handleRename}
          setNewTitle={setNewTitle}
          newTitle={newTitle}
          loading={loading}
          handleDelete={handleDelete}
          formRef={formRef}
          setRenaming={setRenaming}
        />

        {!!todos.length && (
          <Filter
            setFilter={setFilter}
            filter={filter}
            todos={todos}
            handleDelete={handleDelete}
            activeCount={activeCount}
          />
        )}
      </div>

      <Error error={error} setError={setError} />
    </div>
  );
};
