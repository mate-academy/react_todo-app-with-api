/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState, useEffect, useRef,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { ErrorType } from './types/ErrorType';
import { TypeOfFiltering } from './types/TypeOfFiltering';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';

const USER_ID = 9940;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterType, setFilterType] = useState<TypeOfFiltering>(
    TypeOfFiltering.All,
  );
  const [dataError, setError] = useState<string>('');
  const [activeLoader, setActiveLoader] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [shouldFocus, setShouldFocus] = useState<boolean>(true);
  const [allChecked, setAllChecked] = useState<boolean>(false);
  const [toggleActive, setToggleActive] = useState<boolean>(false);
  const [useToggle, setUseToggle] = useState<boolean>(false);
  const [editTodo, setEditTodo] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const getTodos = () => {
    return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
  };

  const deleteTodo = (todoId: number) => {
    return client.delete(`/todos/${todoId}`);
  };

  const changeTodo = (
    todoId: number,
    title: string,
    completed: boolean,
  ) => {
    return client.patch(
      `/todoss/${todoId}`,
      {
        title,
        completed,
      },
    );
  };

  const createTodo = ({
    userId, title, completed,
  }: Omit<Todo, 'id'>) => {
    return client.post<Todo>('/todos', {
      userId, title, completed,
    });
  };

  let timeoutId: ReturnType<typeof setTimeout>;

  const addTodo = async () => {
    try {
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: inputValue,
        completed: false,
      });
      setError('');

      const trimedTitle = inputValue.trim();

      const newTodo = await createTodo({
        userId: USER_ID,
        title: trimedTitle,
        completed: false,
      });

      setTodos(currrentTodos => {
        return ([...currrentTodos, newTodo]);
      });

      setTempTodo(null);
      setInputValue('');
    } catch (error) {
      setTempTodo(null);
      setError(ErrorType.Add);
      timeoutId = setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setShouldFocus(true);
    }
  };

  const deleteData = async (todoId: number) => {
    setActiveLoader(prev => {
      return [...prev, todoId];
    });
    try {
      await deleteTodo(todoId);

      setTodos((prev) => {
        return [...prev].filter(todo => todo.id !== todoId);
      });
    } catch {
      setError(ErrorType.Delete);
      timeoutId = setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setActiveLoader([]);
    }
  };

  const changeData = async (
    todoId: number,
    title: string,
    completed: boolean,
  ) => {
    setActiveLoader(prev => {
      return [...prev, todoId];
    });
    try {
      await changeTodo(todoId, title, completed);

      setTodos((prev) => {
        return prev.map(currentTodo => {
          if (currentTodo.id === todoId) {
            return {
              ...currentTodo,
              title,
              completed,
            };
          }

          return currentTodo;
        });
      });
    } catch {
      setError(ErrorType.Update);
      timeoutId = setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setActiveLoader([]);
      setShouldFocus(false);
    }
  };

  const fetchData = async () => {
    try {
      const todosFromServer = await getTodos();

      setTodos(todosFromServer);
    } catch (error) {
      setError(ErrorType.Load);
      timeoutId = setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    setToggleActive(todos.every(currentTodo => currentTodo.completed));
  }, [todos]);

  useEffect(() => {
    if (shouldFocus) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [dataError, todos]);

  useEffect(() => {
    setToggleActive(todos.every(currentTodo => currentTodo.completed));
    setAllChecked(todos.every(currentTodo => currentTodo.completed));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length !== 0 && (
            <button
              type="button"
              data-cy="ToggleAllButton"
              className={classNames(
                'todoapp__toggle-all',
                { active: toggleActive },
              )}
              onClick={() => {
                setToggleActive(!toggleActive);
                setUseToggle(true);
              }}
            />
          )}

          <form
            onSubmit={(event) => {
              event.preventDefault();

              if (inputValue.trim().length === 0) {
                setError(ErrorType.Empty);
                timeoutId = setTimeout(() => {
                  setError('');
                }, 3000);

                return null;
              }

              return addTodo();
            }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputValue}
              ref={inputRef}
              onChange={(event) => {
                setInputValue(event.target.value);
                // if (inputRef.current) {
                //   inputRef.current.value = event.target.value;
                // }
              }}
              disabled={!!tempTodo}
            />
          </form>
        </header>

        {todos && (
          <TodoList
            todos={todos}
            tempTodo={tempTodo}
            filterType={filterType}
            onDelete={(id: number) => deleteData(id)}
            activeLoader={activeLoader}
            onChange={(
              id: number,
              title: string,
              completed: boolean,
            ) => changeData(id, title, completed)}
            allChecked={allChecked}
            toggleActive={toggleActive}
            useToggle={useToggle}
            setUseToggle={setUseToggle}
            editTodo={editTodo}
            setEditTodo={setEditTodo}
          />
        )}

        {(todos.length !== 0) && (
          <Footer
            todos={todos}
            setFilterType={setFilterType}
            filterType={filterType}
            onDelete={(id: number) => deleteData(id)}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !dataError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {dataError}
      </div>
    </div>
  );
};