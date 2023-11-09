import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { TodoList } from './components/TodoList';
import { TodosFilter } from './components/TodosFilter';
import { Filter, Status } from './types/Filters';

const USER_ID = 11808;

const filters: Filter[] = [
  { href: '/', title: Status.All },
  { href: '/active', title: Status.Active },
  { href: '/completed', title: Status.Completed },
];

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filterBy, setFilterBy] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitDisabling, setSubmitDisabling] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletedIds, setdeletedIds] = useState<number[]>([]);
  const [editedTodo, setEditedTodo] = useState<Todo | null>(null);
  const [toggledTodo, setToggledTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [togglingAll, setTogglingAll] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        handleError('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos.length, tempTodo]);

  const completedTodos = todos.filter(todo => todo.completed);
  const uncompletedTodos = todos.filter(todo => !todo.completed);

  const renderedTodos = {
    [Status.All]: todos,
    [Status.Active]: uncompletedTodos,
    [Status.Completed]: completedTodos,
  };

  const newTodo: Omit<Todo, 'id'> = {
    userId: USER_ID,
    title: title.trim(),
    completed: false,
  };

  const handleUpdateTodos = (receivedTodo: Todo) => (
    (prevTodos: Todo[]) => {
      const updatedTodos = [...prevTodos];
      const index = updatedTodos
        .findIndex(todo => todo.id === receivedTodo.id);

      updatedTodos.splice(index, 1, receivedTodo);

      return updatedTodos;
    }
  );

  const onToggleTodos = (updated: Todo) => {
    setIsLoading(true);
    setToggledTodo(updated);

    return todoService.updateTodo(updated)
      .then(receivedTodo => {
        setTodos(handleUpdateTodos(receivedTodo));
      })
      .catch(() => {
        handleError('Unable to update a todo');
      }).finally(() => {
        setIsLoading(false);
        setToggledTodo(null);
      });
  };

  const onUpdateTodos = (updated: Todo) => {
    setIsLoading(true);

    return todoService.updateTodo(updated)
      .then(receivedTodo => {
        setTodos(handleUpdateTodos(receivedTodo));

        setEditedTodo(null);
      })
      .catch(() => {
        handleError('Unable to update a todo');
      }).finally(() => {
        setIsLoading(false);
      });
  };

  const onAddTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (newTodo.title && !newTodo.title.startsWith(' ')) {
      setErrorMessage('');
      setSubmitDisabling(true);
      setTempTodo({ ...newTodo, id: 0 });

      todoService.createTodo(newTodo)
        .then(receivedTodo => {
          setTodos(prevTodos => [...prevTodos, receivedTodo]);
          setTitle('');
        })
        .catch(() => {
          handleError('Unable to add a todo');
        })
        .finally(() => {
          setTempTodo(null);
          setSubmitDisabling(false);
        });
    } else {
      handleError('Title should not be empty');
    }
  };

  const onDeleteTodo = (todoId: number) => {
    setIsLoading(true);
    setdeletedIds(prevs => [...prevs, todoId]);

    return todoService.deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
        setEditedTodo(null);
      })
      .catch(() => {
        handleError('Unable to delete a todo');
      }).finally(() => {
        setIsLoading(false);
      });
  };

  const onClearCompleted = () => {
    const deletePromises = completedTodos.map((todo) => onDeleteTodo(todo.id));

    Promise.all(deletePromises);
  };

  const onToggleAll = () => {
    setTogglingAll(true);
    setIsLoading(true);

    const needToggle = completedTodos.length > 0
    && completedTodos.length < todos.length
      ? uncompletedTodos
      : todos;

    const togglePromises = needToggle.map(todo => onUpdateTodos({
      ...todo,
      completed: completedTodos.length !== todos.length,
    }));

    Promise.all(togglePromises)
      .then(() => {
        setTogglingAll(false);
        setIsLoading(false);
      });
  };

  const onEditing = (todo: Todo | null) => {
    setEditedTodo(todo);
  };

  const onEditSubmit = (
    currentId: number,
    event?: React.FormEvent<HTMLFormElement>,
  ) => {
    event?.preventDefault();

    const currentTodo = todos.find(todo => todo.id === currentId) as Todo;

    if (currentTodo.title === editedTodo?.title) {
      setEditedTodo(null);

      return;
    }

    if (!editedTodo?.title) {
      onDeleteTodo(currentId);

      return;
    }

    if (editedTodo) {
      onUpdateTodos({
        ...currentTodo,
        title: editedTodo.title.trim(),
      });
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              aria-label="toggle all"
              className={classNames('todoapp__toggle-all', {
                active: todos.length === completedTodos.length,
              })}
              data-cy="ToggleAllButton"
              onClick={onToggleAll}
            />
          )}

          <form onSubmit={onAddTodo}>
            <input
              disabled={submitDisabling}
              value={title}
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={(event) => setTitle(event.target.value)}
            />
          </form>
        </header>

        <TodoList
          todos={renderedTodos[filterBy]}
          onToggleTodos={onToggleTodos}
          tempTodo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          deletedIds={deletedIds}
          toggledTodo={toggledTodo}
          editedTodo={editedTodo}
          togglingAll={togglingAll}
          isLoading={isLoading}
          onEditing={onEditing}
          onEditSubmit={onEditSubmit}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${uncompletedTodos.length} items left`}
            </span>

            <TodosFilter
              filters={filters}
              filterBy={filterBy}
              onFilterBy={setFilterBy}
            />

            <button
              disabled={!completedTodos.length}
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={onClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal', {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          aria-label="hide error"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
