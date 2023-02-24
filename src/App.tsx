import React, {
  useState,
  useEffect,
  useCallback,
  FormEvent,
} from 'react';
import classnames from 'classnames';
import {
  addTodo, deleteTodo, editTodo, getTodos,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { FilterType } from './types/FilterTypes';
import { Todo, TodoData } from './types/Todo';
import { Notification } from './components/Notification';
import { FilterTodos } from './utils/filterTodos';
// import { TodoForm } from './components/TodoForm';

const USER_ID = 6418;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [tepmTodo, setTepmTodo] = useState<Todo | null>(null);
  const [todosIdInProcess, setTodosIdInProcess] = useState<number[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(FilterType.ALL);

  const [hasLoadingError, sethasLoadingError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const activeTodos = FilterTodos(todos, FilterType.ACTIVE);
  const visibleTodos = FilterTodos(todos, selectedFilter);
  const completedTodos = FilterTodos(todos, FilterType.COMPLETED);
  const completedTodosId = completedTodos.map(todo => todo.id);

  const notify = (message: string) => {
    sethasLoadingError(true);
    setErrorMessage(message);

    setTimeout(() => {
      sethasLoadingError(false);
    }, 3000);
  };

  const getTodosFromServer = useCallback(async () => {
    sethasLoadingError(false);

    try {
      const fetchTodos = await getTodos(USER_ID);

      setTodos(fetchTodos);
      // setIsTodosLoaded(true);
    } catch {
      notify('Oppps smth went wrong with load todos...');
    } finally {
      // setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const addTodoToServer = useCallback(async (data: Omit<Todo, 'id'>) => {
    try {
      setTepmTodo({
        ...data,
        id: 0,
      });
      await addTodo(data);
      await getTodosFromServer();
    } catch {
      notify('Cant add new todo to the Server ...');
    } finally {
      setTepmTodo(null);
    }
  }, []);

  const deleteTodoFromServer = useCallback(async (id: number) => {
    try {
      setTodosIdInProcess((prevState) => (
        [...prevState, id]
      ));
      await deleteTodo(id);
      await getTodosFromServer();
    } catch {
      notify('Unable to add a todo');
    } finally {
      setTodosIdInProcess((prevState) => (
        prevState.filter(todoId => id !== todoId)
      ));
    }
  }, []);

  const editTodoOnServer = useCallback(
    async (todoId: number, data: TodoData) => {
      try {
        setTodosIdInProcess((prevState) => (
          [...prevState, todoId]
        ));
        await editTodo(todoId, data);
        await getTodosFromServer();
      } catch {
        notify('Unable to update a todo');
      } finally {
        setTodosIdInProcess((prevState) => (
          prevState.filter(id => id !== todoId)
        ));
      }
    }, [],
  );

  const handleFilterSelect = useCallback((filterType: FilterType) => {
    setSelectedFilter(filterType);
  }, []);

  const handleCloseNotification = useCallback(() => {
    sethasLoadingError(false);
  }, []);

  const handleTodoTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      setTodoTitle(value);
    }, [],
  );

  const handleSubmitForm = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      const newTodo = {
        userId: USER_ID,
        title: todoTitle,
        completed: false,
      };

      addTodoToServer(newTodo);
      setTodoTitle('');
    }, [todoTitle],
  );

  const handleDeleteTodo = useCallback(
    (id: number) => {
      deleteTodoFromServer(id);
    }, [],
  );

  const handleClearCompletedTodos = useCallback(async () => {
    try {
      setTodosIdInProcess((prevState) => (
        [...prevState, ...completedTodosId]
      ));
      await Promise.all(
        completedTodos.map(todo => deleteTodo(todo.id)),
      );
      await getTodosFromServer();
    } catch {
      notify('Unable to delete a todo...');
    } finally {
      setTodosIdInProcess((prevState) => (
        prevState.filter(todoId => !completedTodosId.includes(todoId))
      ));
    }
  }, [completedTodos]);

  const handleToggleComplete = useCallback(async (todo: Todo) => {
    await editTodoOnServer(todo.id, { completed: !todo.completed });
  }, []);

  const handleEditTodo = useCallback(async (todo: Todo) => {
    await editTodoOnServer(todo.id, { title: todo.title });
  }, []);

  // const handleToggleAll = useCallback(
  //   () => {
  //     const toggle = activeTodos.length ? activeTodos : todos;

  //     toggle.forEach(todo => {
  //       handleToggleComplete(todo);
  //     });

  //     // toggle.forEach(todo => {
  //     //   editTodoOnServer(todo.id, {
  //     //     ...todo,
  //     //     completed: !todo.completed,
  //     //   });
  //     // });
  //   }, [activeTodos],
  // );

  const handleToggleAll = useCallback(
    async () => {
      const toggle = activeTodos.length ? activeTodos : todos;
      const todoId = toggle.map(todo => todo.id);

      try {
        setTodosIdInProcess((prevState) => (
          [...prevState, ...todoId]
        ));
        await Promise.all(
          toggle.map(todo => (
            editTodo(todo.id, { completed: !todo.completed })
          )),
        );
        getTodosFromServer();
      } catch {
        notify('Unable to update a todo');
      } finally {
        setTodosIdInProcess((prevState) => (
          prevState.filter(id => !todoId.includes(id))
        ));
      }
    }, [activeTodos],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            // className="todoapp__toggle-all active"
            className={classnames(
              'todoapp__toggle-all', {
                active: todos.length === completedTodos.length,
              },
            )}
            aria-label="Toggle all active todos"
            onClick={handleToggleAll}
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmitForm}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={handleTodoTitle}
            />
          </form>
        </header>

        <TodoList
          todos={visibleTodos}
          tempTodo={tepmTodo}
          onDeleteTodo={handleDeleteTodo}
          todosIdInProcess={todosIdInProcess}
          onToggleComplete={handleToggleComplete}
          onHandleEditTodo={handleEditTodo}
        />

        {/* Hide the footer if there are no todos */}
        <footer className="todoapp__footer">
          <span className="todo-count">
            {`${activeTodos.length} items left`}
          </span>

          {/* Active filter should have a 'selected' class */}
          <nav className="filter">
            <a
              href="#/"
              className={classnames('filter__link', {
                selected: selectedFilter === FilterType.ALL,
              })}
              onClick={() => {
                handleFilterSelect(FilterType.ALL);
              }}
            >
              All
            </a>

            <a
              href="#/active"
              className={classnames('filter__link', {
                selected: selectedFilter === FilterType.ACTIVE,
              })}
              onClick={() => {
                handleFilterSelect(FilterType.ACTIVE);
              }}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={classnames('filter__link', {
                selected: selectedFilter === FilterType.COMPLETED,
              })}
              onClick={() => {
                handleFilterSelect(FilterType.COMPLETED);
              }}
            >
              Completed
            </a>
          </nav>

          {/* don't show this button if there are no completed todos */}
          <button
            type="button"
            className={classnames('todoapp__clear-completed', {
              'is-invisible': completedTodos.length === 0,
            })}
            onClick={handleClearCompletedTodos}
          >
            Clear completed
          </button>

        </footer>
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Notification
        message={errorMessage}
        onClose={handleCloseNotification}
        hidden={!hasLoadingError}
      />
    </div>
  );
};
