/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
import classNames from 'classnames';
import {
  addTodo,
  deleteTodo,
  getTodos,
  patchTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { SortType } from './types/SortType';
import { Error } from './components/Error/Error';
import { ErrorType } from './types/ErrorType';

const USER_ID = 11050;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sort, setSort] = useState(SortType.All);
  const [errorMessage, setErrorMessage] = useState(ErrorType.None);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const completedTodo = todos.filter(todo => todo.completed === true);
  const activeTodosAmount = todos.length - completedTodo.length;

  const setError = (typeOfError: ErrorType) => {
    setErrorMessage(typeOfError);
    setTimeout(() => setErrorMessage(ErrorType.None), 3000);
  };

  const errorMSG = useCallback(() => {
    switch (errorMessage) {
      case ErrorType.Fetch:
        return 'Unable to fetch a todo';

      case ErrorType.Add:
        return 'Unable to add a todo';

      case ErrorType.EmptyString:
        return 'Unable to add an empty todo';

      case ErrorType.Delete:
        return 'Unable to delete a todo';

      case ErrorType.Update:
        return 'Unable to update a todo';

      default:
        return 'Unexpected error';
    }
  }, [errorMessage]);

  const getFiltered = (filter: SortType) => {
    switch (filter) {
      case SortType.Active:
        return todos.filter(todo => !todo.completed);

      case SortType.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  const createTodo = (newTodo: Todo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const loadTodos = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      setError(ErrorType.EmptyString);
      throw error;
    }
  }, []);

  const updateTodoCompleted = useCallback(
    async (todoId: number, completed: boolean) => {
      const todoTemp = [...todos];

      setTodos(prevTodos => prevTodos.map((todo) => {
        if (todo.id !== todoId) {
          return todo;
        }

        return { ...todo, completed };
      }));

      try {
        await patchTodo(todoId, { completed });
      } catch {
        setError(ErrorType.Update);
        setTodos(todoTemp);
      }
    }, [todos],
  );

  const updateTitle = useCallback(
    async (todoId: number, titles: string) => {
      const todoTemp = [...todos];

      setTodos(prevTodos => prevTodos.map((todo) => {
        if (todo.id !== todoId) {
          return todo;
        }

        return { ...todo, title: titles };
      }));

      try {
        await patchTodo(todoId, { title: titles });
      } catch {
        setError(ErrorType.Update);
        setTodos(todoTemp);
      }
    }, [todos],
  );

  const handleUpdateAllTodo = useCallback(() => {
    if (!activeTodosAmount) {
      todos.forEach(todo => {
        updateTodoCompleted(todo.id, !todo.completed);
      });

      return;
    }

    todos.forEach(todo => {
      if (!todo.completed) {
        updateTodoCompleted(todo.id, !todo.completed);
      }
    });
  }, [todos]);

  const onDeleteError = useCallback(
    async () => setError(ErrorType.Update), [errorMessage],
  );

  useEffect(() => {
    loadTodos();
  }, []);

  const filteredTodo = useMemo(() => getFiltered(sort), [todos, sort]);

  const handleFormSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!title.trim()) {
        setError(ErrorType.Fetch);

        return;
      }

      setError(ErrorType.None);

      const todoToAdd: Todo = {
        id: 0,
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({ ...todoToAdd });

      try {
        const newTodo = await addTodo(todoToAdd);

        createTodo(newTodo);
        setTitle('');
      } catch {
        setError(ErrorType.Add);
      }

      setTempTodo(null);
    }, [title],
  );

  const handleDelete = useCallback(async (todoToDelete: Todo) => {
    try {
      onDeleteError();
      setTempTodo(todoToDelete);
      await deleteTodo(todoToDelete.id);
      loadTodos();
    } catch {
      setError(ErrorType.Delete);
    }

    setTempTodo(null);
  }, []);

  const handleAllDelete = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed === true);

    completedTodos.map(todo => handleDelete(todo));
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">

          <button
            type="button"
            className={classNames(
              'todoapp__toggle-all', {
                active: filteredTodo.length === completedTodo.length,
              },
            )}
            onClick={handleUpdateAllTodo}
          />

          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </form>
        </header>

        <TodoList
          todos={filteredTodo}
          onDelete={handleDelete}
          tempTodo={tempTodo}
          updateTodo={updateTodoCompleted}
          handleTitleEdit={updateTitle}
        />

        {todos.length > 0
        && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodosAmount} items left`}
            </span>

            <TodoFilter sort={sort} setSort={setSort} />

            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={handleAllDelete}
              style={
                {
                  opacity: completedTodo.length ? 1 : 0,
                }
              }
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      <Error message={errorMSG()} onDelete={onDeleteError} />
    </div>
  );
};
