import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { Error } from './types/Error';
import {
  getTodos,
  deleteTodo,
  createTodo,
  updateTodo,
} from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { UserWarning } from './UserWarning';
import { TodoError } from './components/TodoError/TodoError';
import { TodoLoadingItem } from './components/TodoLoadingItem/TodoLoadingItem';
import {
  filterTodos,
  getItemsLeftCountMessage,
  getUpdatedTodos,
} from './utils/functions';

const USER_ID = 11521;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [errorMessage, setErrorMessage] = useState(Error.None);
  const [value, setValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [wasEdited, setWasEdited] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Error.Load));
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (errorMessage) {
      timer = setTimeout(() => {
        setErrorMessage(Error.None);
      }, 3000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [errorMessage]);

  useEffect(() => {
    if (wasEdited) {
      inputRef.current?.focus();
    }
  }, [wasEdited]);

  const visibleTodos = filterTodos(todos, status);

  const activeTodosCount = todos.filter(todo => !todo.completed);
  const completedTodosCount = todos.filter(todo => todo.completed);

  function addTodo({ userId, title, completed }: Todo): Promise<void> {
    setErrorMessage(Error.None);
    setWasEdited(false);

    return createTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage(Error.Add);
      })
      .finally(() => {
        setWasEdited(true);
      });
  }

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);

    const todoTitle = value.trim();

    const newTodo = {
      id: todos.length + 1,
      title: todoTitle,
      completed: false,
      userId: USER_ID,
    };

    if (!todoTitle) {
      setErrorMessage(Error.EmptyTitle);
      setIsSubmitted(false);
    } else {
      addTodo(newTodo)
        .then(() => setValue(''))
        .finally(() => {
          setTempTodo(null);
          setIsSubmitted(false);
        });
    }
  };

  const onDelete = (todoId: number) => {
    setProcessingIds((prevIds) => [...prevIds, todoId]);
    deleteTodo(todoId)
      .then(() => setTodos(
        currentTodos => currentTodos.filter(
          todo => todo.id !== todoId,
        ),
      ))
      .catch(() => setErrorMessage(Error.Delete))
      .finally(() => setProcessingIds(
        (prevIds) => prevIds.filter(id => id !== todoId),
      ));
  };

  const onDeleteCompleted = () => {
    const allCompletedTodos = todos.filter(todo => todo.completed);

    allCompletedTodos.forEach((todo) => {
      onDelete(todo.id);
    });
  };

  const handleChangeCompletedStatus = (
    todoId: number,
    isCompleted: boolean,
  ) => {
    setProcessingIds(prevState => [...prevState, todoId]);

    return updateTodo(todoId, { completed: !isCompleted })
      .then((currentTodo: Todo) => {
        setTodos(prevState => getUpdatedTodos(
          prevState,
          currentTodo,
          'completed',
        ));
      })
      .catch(() => {
        setErrorMessage(Error.Update);
      })
      .finally(() => {
        setProcessingIds(prevState => prevState
          .filter(id => id !== todoId));
      });
  };

  const toggleAll = () => {
    const allTodosAreCompleted = todos.length === completedTodosCount.length;

    const todosToUpdate = allTodosAreCompleted
      ? completedTodosCount
      : activeTodosCount;

    const promiseArray = todosToUpdate.map((todo) => {
      const { id, completed } = todo;
      const updatedCompletedStatus = !completed;

      return updateTodo(id, { completed: updatedCompletedStatus });
    });

    setIsSubmiting(true);

    Promise.all(promiseArray)
      .then(() => {
        setTodos(todos.map(todo => (
          { ...todo, completed: !allTodosAreCompleted }
        )));
      })
      .catch(() => setErrorMessage(Error.Toggle))
      .finally(() => setIsSubmiting(false));
  };

  const updateTodos = (todoId: number, data: Todo) => {
    setIsSubmitted(true);
    setTogglingId(todoId);

    updateTodo(todoId, data)
      .then((receivedTodo) => {
        setTodos((prevTodos) => prevTodos
          .map((todo) => (todo.id === todoId ? receivedTodo : todo)));
        setErrorMessage(Error.None);
      })
      .catch(() => setErrorMessage(Error.Update))
      .finally(() => {
        setTogglingId(null);
        setIsSubmitted(false);
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
              data-cy="ToggleAllButton"
              className={classNames('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              onClick={toggleAll}
              aria-label="Toggle All"
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={value}
              ref={inputRef}
              onChange={(event) => setValue(event.target.value)}
              disabled={isSubmitted}
              onBlur={() => setWasEdited(false)}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </form>
        </header>

        {!!todos.length && (
          <>
            <TodoList
              todos={visibleTodos}
              onDelete={onDelete}
              processingIds={processingIds}
              onToggle={handleChangeCompletedStatus}
              togglingId={togglingId}
              onUpdate={updateTodos}
              isSubmitted={isSubmitted}
              isSubmiting={isSubmiting}
            />

            {tempTodo && (
              <TodoLoadingItem
                tempTodo={tempTodo}
                isSubmitted={isSubmitted}
              />
            )}
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {getItemsLeftCountMessage(activeTodosCount)}
              </span>
              <TodoFilter
                todosFilterStatus={status}
                handleFilterStatus={setStatus}
              />
              <button
                data-cy="ClearCompletedButton"
                type="button"
                className={classNames('todoapp__clear-completed', {
                  hidden: !completedTodosCount.length,
                })}
                disabled={!completedTodosCount}
                onClick={onDeleteCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <TodoError
        errorMessage={errorMessage}
        onErrorChange={() => {
          setErrorMessage(Error.None);
        }}
      />
    </div>
  );
};
