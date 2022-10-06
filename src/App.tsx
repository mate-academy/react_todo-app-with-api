import React, {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import classNames from 'classnames';
import {
  addTodo, getTodos, removeTodo, updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { ErrorsType } from './types/ErrorsType';
import { Filter } from './types/Filter';
import { Errors } from './components/Errors';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [filter, setFilter] = useState('all');
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTodos, setSelectTodos] = useState<number[]>([]);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );
  const filtredTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.ALL:
        return todos;
      case Filter.ACTIVE:
        return !todo.completed;
      case Filter.COMPLETED:
        return todo.completed;
      default:
        return [];
    }
  });

  if (error) {
    setTimeout(() => {
      setError(false);
    }, 3000);
  }

  useEffect(() => {
    async function getData(userId:number) {
      const todosFromServer = await getTodos(userId);

      setTodos(todosFromServer);
    }

    try {
      if (user) {
        getData(user.id);
      }
    } catch {
      setErrorText(ErrorsType.LOADING);
    }

    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [todos]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorText(ErrorsType.TITLE);
      setError(true);

      return;
    }

    setIsAdding(true);
    setSelectTodos([user?.id || 0]);
    try {
      if (user) {
        const newTodoData = {
          id: 0,
          userId: user.id,
          title,
          completed: false,
        };

        setTodos(state => [...state, newTodoData]);
        const newTodo = await addTodo(user.id, title);

        setTodos(state => [...state, newTodo]
          .filter(todo => todo.id !== 0));
      }
    } catch {
      setErrorText(ErrorsType.ADDING);
    }

    setSelectTodos([]);
    setIsAdding(false);
    setTitle('');
  };

  const handleDelete = async (todoId: number) => {
    setSelectTodos(state => [...state, todoId]);

    try {
      await removeTodo(todoId);

      setTodos(state => [...state.filter(todo => todo.id !== todoId)]);
    } catch {
      setErrorText(ErrorsType.DELETING);
    }

    setSelectTodos([]);
  };

  const handleDeleteComleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDelete(todo.id);
      }
    });
  };

  const handleUpdate = async (todoId: number, data: Partial<Todo>) => {
    setSelectTodos(state => [...state, todoId]);
    try {
      const updatedTodo = await updateTodo(todoId, data);

      setTodos(state => state
        .map(todo => (todo.id === todoId
          ? updatedTodo
          : todo)));
    } catch {
      setErrorText(ErrorsType.UPDATING);
    }

    setSelectTodos([]);
  };

  // rewrite
  const handleToggleAll = () => {
    if (activeTodosCount > 0) {
      todos.map(todo => {
        if (!todo.completed) {
          return handleUpdate(todo.id, { completed: true });
        }

        return todo;
      });
    } else {
      todos.map((todo) => {
        if (todo.completed) {
          return handleUpdate(todo.id, { completed: false });
        }

        return todo;
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
            aria-label="ToggleAllButton"
            type="button"
            className={classNames(
              'todoapp__toggle-all', {
                active: !activeTodosCount,
              },
            )}
            onClick={() => handleToggleAll()}
          />

          <form
            onSubmit={handleSubmit}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>
      </div>

      { todos.length > 0
      && (
        <>
          <TodoList
            todos={filtredTodos}
            handleDelete={handleDelete}
            selectedTodos={selectedTodos}
            setSelectTodos={setSelectTodos}
            handleUpdate={handleUpdate}
          />
          <Footer
            setFilter={setFilter}
            todos={todos}
            filter={filter}
            handleDeleteComleted={handleDeleteComleted}
          />
          { error
          && (
            <Errors
              error={error}
              setError={setError}
              errorText={errorText}
            />
          )}
        </>
      )}
    </div>
  );
};
