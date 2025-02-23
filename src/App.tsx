import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { addTodo, delTodo, get, updTodo } from './api/todos';
import { TodoInterface } from './types/Todo';
import { Filter } from './types/filter';
import { TodoList } from './components/todoList/TodoList';
import { FilteredTodoList } from './components/footer/FilteredTodoList';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoInterface[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [value, setValue] = useState('');
  const [tempTodo, setTempTodo] = useState<TodoInterface | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [todosForModify, setTodosForModify] = useState<TodoInterface[]>([]);

  const inputForFocusRef = useRef<HTMLInputElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const hideNotification = useCallback(() => {
    if (notificationRef.current) {
      notificationRef.current.classList.add('hidden');
    }
  }, []);

  const errorHandling = (error: Error) => {
    if (notificationRef.current) {
      notificationRef.current.classList.remove('hidden');
      setErrorMessage(error.message);
      setTimeout(() => {
        if (notificationRef.current) {
          notificationRef.current.classList.add('hidden');
        }
      }, 3000);
    }
  };

  const newId = () => {
    const maxId = Math.max(0, ...todos.map(todo => todo.id));

    return maxId + 1;
  };

  const errorManagement = (er: unknown) => {
    if (er instanceof Error) {
      errorHandling(er);
    }
  };

  const createTodo = (id: number, title: string): TodoInterface => ({
    id,
    userId: 2039,
    title: title.trim(),
    completed: false,
  });

  useEffect(() => {
    if (inputForFocusRef.current) {
      inputForFocusRef.current.focus();
    }

    const fetchTodos = async () => {
      try {
        hideNotification();

        const data = await get();

        setTodos(data);
      } catch (error) {
        if (error instanceof Error) {
          errorHandling(error);
        }
      }
    };

    fetchTodos();
  }, [hideNotification]);

  const allTodosComplited = useMemo(() => {
    return todos.every(item => item.completed);
  }, [todos]);

  const [active, setActive] = useState(allTodosComplited);

  useEffect(() => {
    setActive(allTodosComplited);
  }, [allTodosComplited]);

  useEffect(() => {
    if (inputForFocusRef.current && !tempTodo) {
      inputForFocusRef.current.focus();
    }
  }, [tempTodo]);

  const deleteTodos = async (content: number[], inputEdit?: boolean) => {
    for (const todoId of content) {
      try {
        hideNotification();
        await delTodo(todoId);
        // await new Promise(resolve => setTimeout(resolve, 2000)); for checking delete/save every single todo;

        setTodos(current => current.filter(item => todoId !== item.id));
      } catch (error) {
        errorManagement(error);
      }
    }

    if (inputForFocusRef.current && !inputEdit) {
      inputForFocusRef.current.focus();
    }

    setTodosForModify([]);
  };

  const addTodos = async (data: string) => {
    if (inputForFocusRef.current) {
      inputForFocusRef.current.focus();
    }

    setTempTodo(() => createTodo(0, data));

    try {
      hideNotification();

      await addTodo(data);

      const newTodo = createTodo(newId(), data);

      setTodos(current => [...current, newTodo]);

      setValue('');
    } catch (error) {
      errorManagement(error);
      setValue(value);
    } finally {
      setTempTodo(null);
    }
  };

  const updateTodos = async (updateTodo: TodoInterface[]) => {
    const updatedTodos: TodoInterface[] = [];

    for (const upTodo of updateTodo) {
      try {
        const updatedTodo = (await updTodo(upTodo)) as TodoInterface;

        setTodos(current => {
          const newTodosList = [...current];
          const index = newTodosList.findIndex(todo => todo.id === upTodo.id);

          newTodosList.splice(index, 1, updatedTodo);

          return newTodosList;
        });

        updatedTodos.push(updatedTodo);

        if (inputForFocusRef.current) {
          inputForFocusRef.current.focus();
        }
      } catch (error) {
        errorManagement(error);
      }
    }

    setTodosForModify([]);

    return updatedTodos;
  };

  const handleClose = () => {
    if (notificationRef.current) {
      notificationRef.current.classList.add('hidden');
    }
  };

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case Filter.All:
          return true;
        case Filter.Active:
          return !todo.completed;
        case Filter.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, filter]);

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (notificationRef.current) {
      notificationRef.current.classList.add('hidden');
    }

    setValue(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (value.trim()) {
      addTodos(value);
    } else {
      const empty = new Error('Title should not be empty');

      errorHandling(empty);
      setValue('');
    }
  };

  const handleUpdateStatus = async () => {
    const copyTodos = [...todos];

    let content;

    if (active) {
      content = copyTodos.map(item => ({ ...item, completed: false }));
    } else {
      content = copyTodos
        .filter(todo => !todo.completed)
        .map(item => ({ ...item, completed: true }));
    }

    setTodosForModify(content);

    await Promise.allSettled(content.map(todo => updateTodos([todo]))).then(
      results => {
        const successfulResults = results
          .filter(result => result.status === 'fulfilled')
          .flatMap(result => result.value);

        setTodos(currnet => {
          const newList = [...currnet];

          successfulResults.forEach(updatedTodo => {
            const index = newList.findIndex(todo => todo.id === updatedTodo.id);

            if (index !== -1) {
              newList[index] = updatedTodo;
            }
          });

          return newList;
        });
      },
    );

    setTodosForModify([]);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', { active: active })}
              data-cy="ToggleAllButton"
              onClick={handleUpdateStatus}
            />
          )}

          <form onSubmit={onSubmit}>
            <input
              ref={inputForFocusRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={value}
              onChange={handleChangeValue}
              disabled={tempTodo !== null}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <TodoList
            filteredTodos={filteredTodos}
            deleteTodos={deleteTodos}
            tempTodo={tempTodo}
            setTodosForModify={setTodosForModify}
            todosForModify={todosForModify}
            updateTodos={updateTodos}
          />
        )}

        {todos.length > 0 && (
          <FilteredTodoList
            todos={todos}
            setFilter={setFilter}
            filter={filter}
            deleteTodos={deleteTodos}
            setTodosForModify={setTodosForModify}
          />
        )}
      </div>

      <div
        ref={notificationRef}
        data-cy="ErrorNotification"
        className="notification 
        is-danger is-light has-text-weight-normal hidden"
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleClose}
        />
        {errorMessage}
      </div>
    </div>
  );
};
