/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  addTodo,
  changeTodo,
  deleteTodo,
  getTodos,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Errors } from './components/Errors/Errors';
import { Filter } from './components/Filter/Filter';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorsType } from './types/ErrorsType';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | ErrorsType>('');
  const [filterParam, setFilter] = useState('All');
  const [isAdding, setIsAdding] = useState(false);
  const newTodoField = useRef<HTMLInputElement>(null);

  const complitedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const loadTodos = useCallback(() => {
    if (!user) {
      return;
    }

    getTodos(user.id).then(setTodos);
  }, [user]);

  useEffect(() => {
    loadTodos();
  }, [user]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!title.trim()) {
        setError(ErrorsType.Title);

        return;
      }

      if (user) {
        setIsAdding(true);

        try {
          await addTodo({
            userId: user.id,
            title,
            completed: false,
          });

          loadTodos();
        } catch {
          setError(ErrorsType.Load);
        } finally {
          setIsAdding(false);
        }
      } else {
        setError(ErrorsType.Add);
      }

      setTitle('');
    }, [user, title],
  );

  const handleDelete = useCallback(
    async (deletingTodoId: number) => {
      setIsAdding(true);

      try {
        await deleteTodo(deletingTodoId);
        loadTodos();
      } catch {
        setError(ErrorsType.Delete);
      } finally {
        setIsAdding(false);
      }
    }, [],
  );

  const handleClearCompleted = useCallback(
    async () => {
      setIsAdding(true);

      try {
        await Promise.all(complitedTodos.map(todo => (
          deleteTodo(todo.id)
        )));
        loadTodos();
      } catch {
        setError(ErrorsType.Delete);
      } finally {
        setIsAdding(false);
      }
    }, [complitedTodos],
  );

  const handleTodoSelect = useCallback(
    async (todo: Todo) => {
      setIsAdding(true);
      const { id, completed } = todo;

      try {
        await changeTodo(id, {
          completed: !completed,
        });
        loadTodos();
      } catch {
        setError(ErrorsType.Update);
      } finally {
        setIsAdding(false);
      }
    }, [],
  );

  const handleAllTodoSelect = useCallback(
    async () => {
      setIsAdding(true);
      let selectedTodos = [];

      if (todos.length !== complitedTodos.length) {
        selectedTodos = todos.filter(todo => {
          return !todo.completed;
        });
      } else {
        selectedTodos = todos;
      }

      await Promise.all(selectedTodos.map(todo => {
        return handleTodoSelect(todo);
      }));
      loadTodos();
    }, [complitedTodos],
  );

  const handleChangeTitle = async (todo: Todo, newTitle: string) => {
    if (!newTitle) {
      handleDelete(todo.id);

      return;
    }

    if (newTitle !== todo.title) {
      setIsAdding(true);

      try {
        await changeTodo(todo.id, {
          title: newTitle,
        });
        loadTodos();
      } catch {
        setError(ErrorsType.Update);
      } finally {
        setIsAdding(false);
      }
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filterParam) {
      case 'Active':
        return !todo.completed;

      case 'Completed':
        return todo.completed;

      case 'All':
      default:
        return todo;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames('todoapp__toggle-all',
                {
                  active: todos.length === complitedTodos.length,
                })}
              onClick={handleAllTodoSelect}
            />
          )}

          <form onSubmit={handleSubmit}>
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

        <TodoList
          todos={filteredTodos}
          onDelete={handleDelete}
          isAdding={isAdding}
          onTodoSelect={handleTodoSelect}
          onChangeTitle={handleChangeTitle}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${todos.length - complitedTodos.length} items left`}
            </span>

            <Filter
              filterParam={filterParam}
              onSetFilter={setFilter}
            />

            {complitedTodos.length > 0 && (
              <button
                data-cy="ClearCompletedButton"
                type="button"
                className="todoapp__clear-completed"
                onClick={handleClearCompleted}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      <Errors
        error={error}
        onSetError={setError}
      />
    </div>
  );
};
