/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  FormEvent,
  useMemo,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import {
  getTodos,
  createTodo,
  removeTodo,
  updateTodo,
} from './api/todos';
import { Filter } from './types/Filter';
import { TodoListItem } from './components/TodoListItem';
import { TodoAppFooter } from './components/TodoAppFooter';
import { Notifications } from './components/Notifications';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [userId, setUserId] = useState(0);
  const [currentError, setCurrentError] = useState('');
  const [filterType, setFilterType] = useState(Filter.All);
  const [toggleAllValue, setToggleAllValue] = useState(true);

  const handleError = useCallback(
    (error: string) => {
      setCurrentError(error);

      setTimeout(() => {
        setCurrentError('');
      }, 3000);
    },
    [],
  );

  useEffect(() => {
    if (user) {
      setUserId(user.id);
      setCurrentError('');

      getTodos(user.id)
        .then(response => setTodos(response))
        .catch(handleError);
    }
  }, [user]);

  const handleAddTodo = (event: FormEvent) => {
    event.preventDefault();

    if (newTodoTitle.trim().length === 0) {
      handleError('Title can\'t be empty');

      return;
    }

    createTodo({
      title: newTodoTitle,
      userId,
      completed: false,
    }).then((newTodo: Todo) => setTodos((prev) => [...prev, newTodo]))
      .catch(() => handleError('Unable to add a todo'))
      .finally(() => {
        setNewTodoTitle('');
        setCurrentError('');
      });
  };

  const deleteHandler = useCallback((todoId: number) => {
    removeTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(({ id }) => id !== todoId));
      })
      .catch(() => {
        handleError('Unable to delete a todo');
      });
  }, []);

  const handleTodoChange = useCallback(
    (todoId: number, data: Partial<Todo>) => {
      updateTodo(todoId, data)
        .then(updatedTodo => {
          setTodos(prev => (
            prev.map(todo => (todo.id === todoId
              ? updatedTodo
              : todo))
          ));
        })
        .catch(() => handleError('Unable to update a todo'));
    },
    [],
  );

  const handleToggleAll = () => {
    todos.forEach(todo => {
      handleTodoChange(todo.id, { completed: toggleAllValue });
    });

    setToggleAllValue(!toggleAllValue);
  };

  const visibleTodos = useMemo(() => {
    switch (filterType) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return [...todos];
    }
  }, [todos, filterType]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <header className="todoapp__header">
        {todos.length > 0 && (
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              {
                active: todos.every(todo => todo.completed),
              },
            )}
            onClick={handleToggleAll}
          />
        )}

        <form onSubmit={(event) => handleAddTodo(event)}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={newTodoTitle}
            onChange={(event) => {
              const { value } = event.target;

              setNewTodoTitle(value);
            }}
          />
        </form>
      </header>

      <div className="todoapp__content">
        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <TodoListItem
              todo={todo}
              deleteHandler={deleteHandler}
              updateHandler={handleTodoChange}
              key={todo.id}
            />
          ))}
        </section>

        <TodoAppFooter
          todos={todos}
          filterType={filterType}
          handleFilter={setFilterType}
          handleRemoveTodo={deleteHandler}
        />
      </div>

      {currentError && (
        <Notifications message={currentError} setMessage={setCurrentError} />
      )}
    </div>
  );
};
