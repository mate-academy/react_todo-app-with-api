/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';

import { getTodos, patchTodos, postTodos } from './api/todos';
import { ShowState } from './types/ShowState';
import { ErrorTypes } from './types/ErrorTypes';
import { ErrorComponent } from './components/ErrorComponent';
import { Loader } from './components/Loader';

import { USER_ID } from './utils/userId';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | []>([]);
  const [showState, setShowState] = useState<ShowState>(ShowState.All);
  const [error, setError] = useState<ErrorTypes | null>(null);
  const [isLoading, setisLoading] = useState(false);
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRefAdd = useRef<HTMLInputElement | null>(null);

  const filteredTodos = useMemo(() => {
    switch (showState) {
      case ShowState.All:
        return todos;

      case ShowState.Active:
        return todos.filter(toddo => !toddo.completed);

      case ShowState.Completed:
        return todos.filter(toddo => toddo.completed);

      default:
        return todos;
    }
  }, [showState, todos]);

  const loadAllTodos = async () => {
    setisLoading(true);
    try {
      const allTodos = await getTodos(USER_ID);

      return allTodos;
    } catch (err) {
      setError(ErrorTypes.LOAD_ALL_TODOS);
      setTimeout(() => {
        setError(null);
      }, 3000);

      return undefined;
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    const updateAllTodos = async () => {
      const todosData = await loadAllTodos();

      if (todosData) {
        setTodos(todosData);
      }
    };

    setError(null);

    updateAllTodos();

    inputRefAdd.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (todoTitle.trim()) {
      const newTodo = {
        id: 0,
        userId: USER_ID,
        title: todoTitle.trim(),
        completed: false,
      };

      if (inputRefAdd.current) {
        inputRefAdd.current.disabled = true;
      }

      try {
        const response = await postTodos(newTodo);

        setTempTodo(newTodo);
        setTimeout(() => {
          setTodos(prevTodos => [...prevTodos, response]);
          setTempTodo(null);
        }, 900);

        setTimeout(() => {
          inputRefAdd.current?.focus();
        }, 0);
        setTodoTitle('');
      } catch (err) {
        setError(ErrorTypes.ADD_TODO);
        setTimeout(() => {
          setError(null);
        }, 3000);
      }

      if (inputRefAdd.current) {
        inputRefAdd.current.disabled = false;
      }
    } else {
      setError(ErrorTypes.TITLE);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const handleTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(e.target.value);
  };

  const fetchToggleAll = async (boolvalue: boolean) => {
    try {
      const toggleAllTodos = todos
        .map(({ id }) => patchTodos(id,
          { completed: boolvalue, userId: USER_ID }));

      await Promise.all(toggleAllTodos);
      const newTodos = todos.map(toddo => ({
        ...toddo,
        completed: boolvalue,
      }));

      setTodos(newTodos);
    } catch (err) {
      setError(ErrorTypes.UPDATE_TODO);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const toggleAll = async () => {
    if (todos.every(tod => tod.completed)) {
      fetchToggleAll(false);
    } else {
      fetchToggleAll(true);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: todos.every(toddd => toddd.completed),
            })}
            onClick={toggleAll}
            data-cy="ToggleAllButton"
          />
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={inputRefAdd}
              onChange={handleTodo}
              value={todoTitle}
            />
          </form>
        </header>

        {filteredTodos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            setTodos={setTodos}
            tempTodo={tempTodo}
            setError={setError}
            inputRefAdd={inputRefAdd.current}
          />
        )}
        {isLoading && <Loader />}
        {todos.length > 0 && (
          <Footer
            todos={filteredTodos}
            setTodos={setTodos}
            showState={showState}
            setShowState={setShowState}
            setError={setError}
          />
        )}
        {error && <ErrorComponent error={error} setError={setError} />}
      </div>
    </div>
  );
};
