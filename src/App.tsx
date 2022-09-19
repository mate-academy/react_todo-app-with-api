/* eslint-disable no-console */
/* eslint-disable object-curly-newline */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React,
{
  useCallback, useContext, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import {
  addTodo,
  deleteTodo,
  getTodos,
  patchTodo,
  TodoComplete,
  TodoTitle,
} from './api/todos';
import { TodosList } from './components/TodosList';
import { Form } from './components/Form';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodoId, setSelectedTodoId] = useState<number>(0);
  const [loadedTodosIds, setLoadedTodosIds] = useState<number[]>([]);
  const [errorType, setErrorType] = useState('');
  const [filterOption, setFilterOption] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(gotTodos => {
          setTodos(gotTodos);
        });
    }
  }, []);

  const completedTodos = useMemo(() => todos.filter(
    todo => todo.completed,
  ), [todos]);

  const activeTodos = useMemo(() => todos.filter(
    todo => !todo.completed,
  ), [todos]);

  const handleNoError = useCallback(() => {
    setErrorType('');
  }, []);

  const onChangeComplition = useCallback((
    todoId: number, isCompleted: boolean,
  ) => {
    const newStatus: TodoComplete = {
      completed: !isCompleted,
    };

    handleNoError();
    setIsLoading(true);
    setSelectedTodoId(todoId);

    patchTodo(todoId, newStatus)
      .then(() => {
        setTodos(prevTodos => prevTodos.map(todo => {
          if (todo.id === todoId) {
            return ({
              ...todo,
              completed: !todo.completed,
            });
          }

          return todo;
        }));
      })
      .catch(() => {
        setErrorType('');
        setTimeout(handleNoError, 3000);
      })
      .finally(() => {
        setLoadedTodosIds([]);
        setSelectedTodoId(0);
        setIsLoading(false);
      });
  }, [todos]);

  const onAdd = useCallback((newTitle: string) => {
    if (!user) {
      return;
    }

    handleNoError();

    if (newTitle.trim() === '') {
      setErrorType('add');

      return;
    }

    addTodo(newTitle, user.id)
      .then((todo) => {
        getTodos(user.id)
          .then(res => console.log(res));

        setTodos(prevTodos => [...prevTodos, todo]);
      })
      .catch(() => {
        setErrorType('add');
        setTimeout(handleNoError, 3000);
      });

    console.log(todos);
  }, [todos]);

  const onDelete = useCallback((todoId: number) => {
    setIsLoading(true);
    setSelectedTodoId(todoId);
    handleNoError();

    return deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorType('delete');
        setTimeout(handleNoError, 3000);
      })
      .finally(() => {
        setLoadedTodosIds([]);
        setIsLoading(false);
      });
  }, [todos]);

  const getFilteredTodos = (option: string) => {
    switch (option) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      case 'all':
      default:
        return todos;
    }
  };

  const handleClearAllCompleted = () => {
    setLoadedTodosIds(completedTodos.map(todo => todo.id));
    completedTodos.forEach(todo => {
      onDelete(todo.id);
    });
  };

  const handleDoubleClick = (todoId: number) => {
    handleNoError();
    setOpenForm(true);
    setSelectedTodoId(todoId);
  };

  const closeInput = useCallback(() => {
    setOpenForm(false);
  }, []);

  const handleChangeTitle = (newTitle: string, oldTitle: string) => {
    if (newTitle.length === 0) {
      onDelete(selectedTodoId || 0);
      setOpenForm(false);
    }

    if (newTitle === oldTitle) {
      setOpenForm(false);

      return;
    }

    if (newTitle) {
      setIsLoading(true);

      const updateTitle: TodoTitle = {
        title: newTitle,
      };

      patchTodo(selectedTodoId, updateTitle)
        .then(() => {
          const updatedTodos = todos.map(todo => {
            if (todo.id === selectedTodoId) {
              return ({
                ...todo,
                title: updateTitle.title,
              });
            }

            return todo;
          });

          setTodos(updatedTodos);
        })
        .catch(() => {
          setErrorType('update');
          setTimeout(handleNoError, 3000);
        })
        .finally(() => {
          setSelectedTodoId(0);
          setIsLoading(false);
        });
    }

    setOpenForm(false);
  };

  const fiteredTodos = getFilteredTodos(filterOption);

  const onChangeAllCompitions = () => {
    if (completedTodos.length > 0 || completedTodos.length !== todos.length) {
      setLoadedTodosIds(activeTodos.map(todo => todo.id));
      activeTodos.forEach(todo => {
        if (!todo.completed) {
          onChangeComplition(todo.id, todo.completed);
        }
      });
    }

    if (completedTodos.length === 0 || completedTodos.length === todos.length) {
      setLoadedTodosIds(completedTodos.map(todo => todo.id));
      completedTodos.forEach(notCompletedTodo => {
        onChangeComplition(notCompletedTodo.id, notCompletedTodo.completed);
      });
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
            onClick={onChangeAllCompitions}
          />

          <Form onAdd={onAdd} />
        </header>

        <TodosList
          todos={fiteredTodos}
          selectedTodoId={selectedTodoId}
          isLoading={isLoading}
          openForm={openForm}
          handleChangeTodoTitle={handleChangeTitle}
          closeInput={closeInput}
          handleChangeComplition={onChangeComplition}
          handleDoubleClick={handleDoubleClick}
          loadedTodosIds={loadedTodosIds}
          onDelete={onDelete}
        />

        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="todosCounter">
            {`${todos.length} items left`}
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              data-cy="FilterLinkAll"
              href="#/"
              className={classNames(
                'filter__link',
                { selected: filterOption === 'all' },
              )}
              onClick={() => setFilterOption('all')}
            >
              All
            </a>

            <a
              data-cy="FilterLinkActive"
              href="#/active"
              className={classNames(
                'filter__link',
                { selected: filterOption === 'active' },
              )}
              onClick={() => setFilterOption('active')}
            >
              Active
            </a>
            <a
              data-cy="FilterLinkCompleted"
              href="#/completed"
              className={classNames(
                'filter__link',
                { selected: filterOption === 'completed' },
              )}
              onClick={() => setFilterOption('completed')}
            >
              Completed
            </a>
          </nav>

          <button
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
            disabled={!todos.some(todo => todo.completed)}
            onClick={handleClearAllCompleted}
          >
            Clear completed
          </button>
        </footer>
      </div>

      { errorType !== '' && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => {
            }}
          />

          {errorType === 'add' && 'Unable to add a todo'}
          <br />
          {errorType === 'delete' && 'Unable to delete a todo'}
          <br />
          {errorType === 'update' && 'Unable to update a todo'}
        </div>
      )}
    </div>
  );
};
