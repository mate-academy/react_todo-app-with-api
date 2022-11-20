import React, {
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';

import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { Loader } from './components/Loader';
import { TodoList } from './components/TodoList';
import { Notification } from './components/Notification';

import {
  createTodo,
  getTodos,
  removeTodo,
  changeTodo,
} from './api/todos';

import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterKind, setFilterKind] = useState<Filter>(Filter.All);
  const [notification, setNotification] = useState<string>('');

  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [temporaryTodoTitle, setTemporaryTodoTitle] = useState('');
  const [loaderForTodo, setLoaderForTodo] = useState<number[]>([]);
  const completedTodos = todos.filter(todo => todo.completed);

  useEffect(() => {
    if (user) {
      getTodos(user.id).then(todosFromServer => {
        setTodos(todosFromServer);
        setIsLoading(false);
      })
        .catch(() => {
          setIsLoading(false);
          setNotification('Cannot load todos from server');
        });
    }
  }, []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos]);

  const filterTodos = (option: Filter) => {
    switch (option) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);

      case Filter.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  const addTodo = async (newTodo: Omit<Todo, 'id'>) => {
    try {
      setTemporaryTodoTitle(title);
      setTitle('');
      const response = await createTodo(newTodo);
      const responseTodo = JSON.parse(JSON.stringify(response));

      const createdTodo = {
        id: responseTodo.id,
        userId: responseTodo.userId,
        title: responseTodo.title,
        completed: responseTodo.completed,
      };

      setTodos(currentTodos => ([...currentTodos, createdTodo]));
      setTemporaryTodoTitle('');
    } catch (e) {
      setNotification('Unable to add a todo');
    }

    setIsAdding(false);
  };

  const loaderOnOff = (isOn: boolean, todoId: number) => {
    if (isOn) {
      setLoaderForTodo(current => ([...current, todoId]));
    } else {
      setLoaderForTodo(current => [...current].filter(id => id !== todoId));
    }
  };

  const onDelete = async (todoId: number) => {
    loaderOnOff(true, todoId);
    try {
      await removeTodo(todoId);
      loaderOnOff(false, todoId);
      setTodos(
        currentTodo => ([...currentTodo.filter(todo => todo.id !== todoId)]),
      );
    } catch (e) {
      setNotification('Unable to delete a todo');
      loaderOnOff(false, todoId);
    }
  };

  const onChangingTitle = async (todo: Todo, newTodoTitle: string) => {
    loaderOnOff(true, todo.id);
    try {
      await changeTodo(todo.id, { title: newTodoTitle });
      loaderOnOff(false, todo.id);
      setTodos(currentTodos => {
        return currentTodos.map(currentTodo => {
          if (currentTodo.id === todo.id) {
            return {
              ...currentTodo,
              title: newTodoTitle,
            };
          }

          return currentTodo;
        });
      });
    } catch (e) {
      setNotification('Unable to update a todo');
      loaderOnOff(false, todo.id);
    }
  };

  const updateTodoStatus = (todoId: number, value: boolean) => {
    setTodos(currentTodos => {
      return currentTodos.map(currentTodo => {
        if (currentTodo.id === todoId) {
          return {
            ...currentTodo,
            completed: value,
          };
        }

        return currentTodo;
      });
    });
  };

  const changeCompleting = async (todo: Todo, value: boolean) => {
    loaderOnOff(true, todo.id);
    try {
      await changeTodo(todo.id, { completed: value });
      loaderOnOff(false, todo.id);
      updateTodoStatus(todo.id, value);
    } catch (e) {
      loaderOnOff(false, todo.id);
      setNotification('Unable to delete a todo');
    }
  };

  const clearCompleted = () => {
    completedTodos.forEach(todo => onDelete(todo.id));
  };

  const toggleAll = () => {
    const uncompletedTodos = todos.filter(todo => !todo.completed);

    if (uncompletedTodos.length > 0) {
      uncompletedTodos.forEach(todo => changeCompleting(todo, true));
    } else {
      todos.forEach(todo => changeCompleting(todo, false));
    }
  };

  const handleSubmitNewTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    setNotification('');
    setIsAdding(true);

    if (!title || !/\S/.test(title)) {
      setNotification('Title can\'t be empty');
      setIsAdding(false);

      return;
    }

    const newTodo = {
      userId: user ? user.id : 0,
      title,
      completed: false,
    };

    addTodo(newTodo);
  };

  const visibleTodos = filterTodos(filterKind);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            aria-label="toggle-all-todos"
            className={classNames(
              'todoapp__toggle-all',
              { active: todos.every(todo => todo.completed) },
            )}
            onClick={toggleAll}
          />

          <form onSubmit={handleSubmitNewTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>

        {isLoading && <Loader />}

        {(todos.length !== 0 || isAdding) && (
          <>
            <TodoList
              todos={visibleTodos}
              onDelete={onDelete}
              loaderForTodo={loaderForTodo}
              isAdding={isAdding}
              temporaryTodoTitle={temporaryTodoTitle}
              onChangeCompleting={changeCompleting}
              onChangingTitle={onChangingTitle}
            />

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="todosCounter">
                {`${todos.filter(todo => !todo.completed).length} items left`}
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  data-cy="FilterLinkAll"
                  href="#/"
                  className={classNames(
                    'filter__link',
                    { selected: filterKind === Filter.All },
                  )}
                  onClick={() => setFilterKind(Filter.All)}
                >
                  All
                </a>

                <a
                  data-cy="FilterLinkActive"
                  href="#/active"
                  className={classNames(
                    'filter__link',
                    { selected: filterKind === Filter.Active },
                  )}
                  onClick={() => setFilterKind(Filter.Active)}
                >
                  Active
                </a>
                <a
                  data-cy="FilterLinkCompleted"
                  href="#/completed"
                  className={classNames(
                    'filter__link',
                    { selected: filterKind === Filter.Completed },
                  )}
                  onClick={() => setFilterKind(Filter.Completed)}
                >
                  Completed
                </a>
              </nav>

              <button
                data-cy="ClearCompletedButton"
                type="button"
                className="todoapp__clear-completed"
                disabled={completedTodos.length === 0}
                onClick={clearCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <Notification
        notification={notification}
        onSetNotification={setNotification}
      />
    </div>
  );
};
