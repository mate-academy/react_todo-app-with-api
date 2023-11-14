/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { TodosContext } from '../../TodosContext';
import * as todoService from '../../api/todos';
import { Filter } from '../../types/Filter';
import { UserWarning } from '../../UserWarning';
import { TodosList } from '../TodosList';
import { TodosFilter } from '../TododsFilter';
import { TempTodoContext } from '../../TempTodoContext';
import { ErrorContext } from '../../ErrorContext';
import { Error } from '../../types/ErrorMessage';

const USER_ID = 11903;
const ERROR_DELAY = 3000;

export const TodoApp: React.FC = () => {
  const { todos, setTodos } = useContext(TodosContext);
  const { tempTodo, setTempTodo } = useContext(TempTodoContext);
  const [todoTitle, setTodoTitle] = useState('');
  const [status, setStatus] = useState('all');
  const { errorMessage, setErrorMessage } = useContext(ErrorContext);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const refInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Error.LOAD_TODOS);
      })
      .finally(() => {
        setTimeout(() => setErrorMessage(''), ERROR_DELAY);
      });
  }, []);

  const filteredTodos = todos.filter(todo => {
    switch (status) {
      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      default:
        return todo;
    }
  });

  const completedTodo = todos.some(todo => todo.completed);

  const addTodo = () => {
    todoService.createTodo({
      userId: USER_ID,
      title: todoTitle.trim(),
      completed: false,
    })
      .then(newTodo => {
        setTodos([...todos, newTodo]);
        setTodoTitle('');
        setTempTodo(null);
      })
      .catch((error) => {
        setErrorMessage(Error.ADD_TODO);
        setTempTodo(null);
        setTimeout(() => setErrorMessage(''), ERROR_DELAY);
        throw error;
      });
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!tempTodo) {
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: todoTitle.trim(),
        completed: false,
      });
    }

    if (!todoTitle.trim()) {
      setErrorMessage(Error.EMPTY_TITLE);
      setTempTodo(null);

      setTimeout(() => {
        setErrorMessage('');
      }, ERROR_DELAY);
    } else {
      addTodo();
    }
  };

  useEffect(() => {
    if (refInput.current) {
      refInput.current.focus();
    }
  }, [tempTodo, todos.length]);

  const count = todos.filter(todo => !todo.completed).length;
  const isCompleted = todos.every(todo => todo.completed);

  const handleToggleAll = () => {
    const updateTodos = todos
      .map(todo => ({ ...todo, completed: !isCompleted }));

    const updatePromises = todos.filter(t => t.completed === isCompleted);

    setLoadingIds(updatePromises.map(t => t.id));

    updatePromises.forEach(todo => {
      todoService.updateTodo(todo)
        .then(() => {
          setTodos(updateTodos);
          setLoadingIds([]);
        })
        .catch(() => {
          setErrorMessage(Error.UPDATE_TODO);
          setLoadingIds([]);

          setTimeout(() => setErrorMessage(''), ERROR_DELAY);
        });
    });
  };

  const clearAllCompleted = () => {
    const updatedTodos = todos.filter(t => !t.completed);
    const Ids = todos.filter(t => t.completed).map(t => t.id);

    setLoadingIds(Ids);

    Ids.forEach(id => {
      todoService.deleteTodo(id)
        .then(() => {
          setTodos(updatedTodos);
          setLoadingIds([]);
        })
        .catch((error) => {
          setErrorMessage(Error.DELETE);
          setLoadingIds([]);
          setTimeout(() => setErrorMessage(''), ERROR_DELAY);
          throw error;
        });
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                { active: isCompleted },
              )}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />

          )}
          <form
            onSubmit={handleOnSubmit}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={event => setTodoTitle(event.target.value)}
              ref={refInput}
              disabled={!!tempTodo}
            />
          </form>
        </header>

        {todos && (
          <TodosList
            todos={filteredTodos}
            loadingIds={loadingIds}
          />
        )}
        {!!todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${count} items left`}
            </span>

            <TodosFilter
              status={status}
              setStatus={setStatus}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!completedTodo}
              onClick={clearAllCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
