/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/Auth/TodoList';
import { Errormessage } from './components/Auth/Errormessage';
import { Footer } from './components/Auth/Footer';
import { Todo } from './types/Todo';
import { FilterType } from './types/SortType';
import {
  getTodos,
  createTodos,
  deleteTodos,
  updateTodo,
} from './api/todos';
import { ErrorMessage } from './types/Error';

export const App: React.FC = () => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [filterType, setFilterType] = React.useState('all');
  const [title, setTitle] = React.useState('');
  const [selectedId, setSelectedId] = React.useState<number[]>([]);
  const [isAdding, setIsAdding] = React.useState(false);
  const user = React.useContext(AuthContext);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    const getTodosFromServer = async (userId: number) => {
      try {
        const receivedTodos = await getTodos(userId);

        setTodos(receivedTodos);
      } catch (error) {
        setErrorMessage(`${error}`);
      }
    };

    if (!user) {
      return;
    }

    getTodosFromServer(user.id);
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterType) {
        case FilterType.All:
          return todo;
        case FilterType.Active:
          return !todo.completed;
        case FilterType.Completed:
          return todo.completed;
        default:
          return null;
      }
    });
  }, [todos, filterType]);

  const newTodo = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !user) {
      setErrorMessage(ErrorMessage.ErrorTitle);

      return;
    }

    setIsAdding(true);

    try {
      const postTodo = await createTodos(title, user.id);

      setTodos((prevTodos) => [...prevTodos, postTodo]);
    } catch {
      setErrorMessage(ErrorMessage.NotAdd);
    }

    setIsAdding(false);
    setTitle('');
  }, [title, user]);

  const removeTodo = useCallback(async (TodoId: number) => {
    setSelectedId([TodoId]);
    try {
      await deleteTodos(TodoId);

      setTodos((prevTodos) => prevTodos.filter(({ id }) => id !== TodoId));
    } catch {
      setErrorMessage(ErrorMessage.NotDelete);
    }
  }, [todos, errorMessage]);

  const completedTodos = todos.filter(({ completed }) => completed);

  const deleteCompletedTodos = useCallback(() => {
    setSelectedId([...completedTodos].map(({ id }) => id));

    Promise.all(completedTodos.map(({ id }) => removeTodo(id)))
      .then(() => setTodos((prevTodos) => prevTodos
        .filter(({ completed }) => !completed)))
      .catch(() => {
        setErrorMessage(ErrorMessage.NotDelete);
        setSelectedId([]);
      });
  }, [todos, selectedId, errorMessage]);

  const getValue = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(value);
  };

  const handleChange = async (todoId: number, data: Partial<Todo>) => {
    setSelectedId([todoId]);

    try {
      const updateStatus: any = await updateTodo(todoId, data);

      setTodos(todos.map(todo => (
        todo.id === todoId
          ? updateStatus
          : todo
      )));
    } catch {
      setErrorMessage(ErrorMessage.NotUpdate);
    }

    setSelectedId([]);
  };

  const handleAllCompleted = () => {
    const isAllCompleted = todos.every(({ completed }) => completed);

    Promise.all(todos.map(({ id }) => handleChange(id, {
      completed: !isAllCompleted,
    })))
      .then(() => setTodos(todos.map(todo => ({
        ...todo,
        completed: !isAllCompleted,
      }))))
      .catch(() => {
        setErrorMessage(ErrorMessage.NotUpdate);
        setSelectedId([]);
      });
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
            aria-label="close"
            onClick={handleAllCompleted}
          />

          <form onSubmit={newTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={getValue}
            />
          </form>
        </header>

        {(todos.length > 0 || isAdding) && (
          <>
            <TodoList
              todos={filteredTodos}
              removeTodo={removeTodo}
              selectedId={selectedId}
              isAdded={isAdding}
              title={title}
              handleChange={handleChange}
            />
            <Footer
              filterType={filterType}
              filterTypes={setFilterType}
              todos={todos}
              deleteCompleted={deleteCompletedTodos}
            />
          </>
        )}
      </div>
      {errorMessage && (
        <Errormessage
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
