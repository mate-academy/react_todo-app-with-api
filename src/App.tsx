/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import classNames from 'classnames';
import {
  getTodos,
  createTodos,
  deleteTodos,
  updateTodos,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Footer } from './components/Footer/Footer';
import { Errors } from './components/Errors/Errors';
import { TodoForm } from './components/TodoForm/TodoForm';
import { ErrorType } from './types/ErrorType';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<Filter>(Filter.ALL);
  const [errors, setErrors] = useState<ErrorType>(ErrorType.NONE);
  const [query, setQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const getTodosFromServer = async () => {
    if (user) {
      try {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      } catch (error) {
        setErrors(ErrorType.UPDATE);

        setTimeout(() => {
          setErrors(ErrorType.NONE);
        }, 3000);
      }
    }
  };

  useEffect(() => {
    getTodosFromServer();
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    const filteredTodos = todos.filter(todo => {
      switch (filterType) {
        case Filter.ACTIVE:
          return !todo.completed;
        case Filter.COMPLETED:
          return todo.completed;
        default:
          return todo;
      }
    });

    setVisibleTodos(filteredTodos);
  }, [filterType, todos, query]);

  const isEachTodoCompleted = useMemo(
    () => visibleTodos.every(todo => todo.completed), [visibleTodos],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createNewTodo = async (event: any) => {
    event.preventDefault();

    if (query.trim().length === 0) {
      setErrors(ErrorType.EMPTYTITLE);

      return;
    }

    if (user) {
      setIsAdding(true);

      const newTodo = {
        userId: user.id,
        title: query,
        completed: false,
      };

      try {
        await createTodos(newTodo);
      } catch {
        setErrors(ErrorType.ADD);
      }

      setIsAdding(false);
      setQuery('');
      setErrors(ErrorType.NONE);
      await getTodosFromServer();
    }
  };

  const deleteCompletedTodos = async () => {
    try {
      todos.forEach(todo => {
        if (todo.completed) {
          deleteTodos(todo.id);
        }
      });
    } catch {
      setErrors(ErrorType.DELETE);
    }

    await getTodosFromServer();
  };

  const deleteTodo = async (todoId: number) => {
    if (user) {
      try {
        await deleteTodos(todoId);
      } catch {
        setErrors(ErrorType.DELETE);
      }
    }

    await getTodosFromServer();
  };

  const updateTodoTitle = async (todoId: number, newTitle: string) => {
    try {
      await updateTodos(todoId, { title: newTitle });
      await getTodosFromServer();
    } catch {
      setErrors(ErrorType.UPDATE);
    }
  };

  const handleAllToggled = async () => {
    try {
      await todos.forEach(todo => {
        updateTodos(todo.id, { completed: !todo.completed });
      });
      await getTodosFromServer();
    } catch (error) {
      setErrors(ErrorType.UPDATE);
    }
  };

  const updateTodoStatus = async (todo: Todo) => {
    try {
      await updateTodos(todo.id, { completed: !todo.completed });
      await getTodosFromServer;
    } catch (error) {
      setErrors(ErrorType.UPDATE);
    }

    await getTodosFromServer();
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={classNames('todoapp__toggle-all',
              { active: isEachTodoCompleted })}
            onClick={handleAllToggled}
          />

          <TodoForm
            query={query}
            setQuery={setQuery}
            createNewTodo={createNewTodo}
          />
        </header>

        {todos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            deleteTodo={deleteTodo}
            isAdding={isAdding}
            query={query}
            updateTodoTitle={updateTodoTitle}
            updateTodoStatus={updateTodoStatus}
          />
        )}

        <Footer
          setFilterType={setFilterType}
          filterType={filterType}
          todos={visibleTodos}
          deleteCompletedTodos={deleteCompletedTodos}
        />
      </div>

      {errors !== ErrorType.NONE && (
        <Errors
          setErrors={setErrors}
          errors={errors}
        />
      )}
    </div>
  );
};
