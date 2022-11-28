/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import {
  addTodo,
  changeTodo,
  getTodos,
  removeTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Types } from './types/Types';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { NewTodo } from './components/NewTodo/NewTodo';
import { ErrorNote } from './components/ErrorNote/ErrorNote';

const FILTERS: Types = {
  all: 'all',
  completed: 'completed',
  active: 'active',
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FILTERS.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorStatus, setErrorStatus] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [todosOnChange, setTodosOnChange] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo>({
    id: 0,
    title: '',
    userId: 0,
    completed: false,
  });

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const changeErrorStatus = () => setErrorStatus(false);

  async function loadTodos() {
    if (user) {
      const todosFromServer = await getTodos(user.id);

      setTodos(todosFromServer);
    }
  }

  const addTodoOnServer = async (todoTitle: string) => {
    if (user) {
      try {
        setTempTodo({
          id: 0,
          title: todoTitle,
          userId: user.id,
          completed: false,
        });
        setIsAdding(true);

        await addTodo({
          title: todoTitle,
          userId: user.id,
          completed: false,
        });

        loadTodos();
        setIsAdding(false);
      } catch {
        setErrorMessage('Unable to add a todo');
        setErrorStatus(true);
        setIsAdding(false);
        setTempTodo({
          id: 0,
          title: '',
          userId: 0,
          completed: false,
        });
      }
    }
  };

  const removeTodoFromServer = async (todoId: number) => {
    try {
      setTodosOnChange(prevIds => [...prevIds, todoId]);
      await removeTodo(todoId);

      loadTodos();
      setTodosOnChange(prevIds => prevIds.filter(id => id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
      setErrorStatus(true);
    }
  };

  const removeCompletedTodos = async () => {
    try {
      await Promise.all(todos.map(todo => {
        if (todo.completed) {
          setTodosOnChange(prevIds => [...prevIds, todo.id]);
          removeTodo(todo.id);
        }

        return todo;
      }));

      setTimeout(() => {
        setTodos(currTodos => currTodos.filter(todo => !todo.completed));
      }, 500);
    } catch {
      setErrorMessage('Unable to delete todos');
      setErrorStatus(true);
    }
  };

  const changeTodoOnServer = async (todoId: number, completed: boolean) => {
    try {
      setTodosOnChange(prevIds => [...prevIds, todoId]);
      await changeTodo({ completed }, todoId);

      setTodos(currTodos => currTodos.map((todo: Todo) => {
        if (todo.id === todoId) {
          const changedTodo = todo;

          changedTodo.completed = completed;

          return changedTodo;
        }

        return todo;
      }));
      setTodosOnChange([]);
    } catch {
      setErrorMessage('Unable to update a todo');
      setErrorStatus(true);
    }
  };

  const changeTitleOnServer = async (todoId: number, title: string) => {
    try {
      setTodosOnChange(prevIds => [...prevIds, todoId]);
      await changeTodo({ title }, todoId);

      loadTodos();
      setTodosOnChange([]);
    } catch {
      setErrorMessage('Unable to update a todo');
      setErrorStatus(true);
    }
  };

  const changeAllTodos = async () => {
    try {
      const isAllCompleted = todos.every(todoItem => todoItem.completed);

      await Promise.all(todos.map(todo => {
        if (isAllCompleted) {
          changeTodoOnServer(todo.id, !todo.completed);
        } else if (!todo.completed) {
          changeTodoOnServer(todo.id, !todo.completed);
        }

        return todo;
      }));
    } catch {
      setErrorMessage('Unable to update todos');
      setErrorStatus(true);
    }
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadTodos();

    setTimeout(() => {
      setErrorStatus(false);
    }, 3000);
  }, [errorStatus]);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case FILTERS.active:
        return !todo.completed;

      case FILTERS.completed:
        return todo.completed;

      default:
        return todo;
    }
  });

  const activeTodosLength = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: filteredTodos.some(todo => todo.completed),
              })}
              onClick={changeAllTodos}
            />
          )}

          <NewTodo
            newTodoField={newTodoField}
            setErrorMessage={setErrorMessage}
            setErrorStatus={setErrorStatus}
            addTodoOnServer={addTodoOnServer}
            isAdding={isAdding}
          />
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              isAdding={isAdding}
              todosOnChange={todosOnChange}
              tempTodo={tempTodo}
              removeTodoFromServer={removeTodoFromServer}
              changeTodoOnServer={changeTodoOnServer}
              changeTitleOnServer={changeTitleOnServer}
            />
            <TodoFilter
              setFilter={setFilter}
              filters={FILTERS}
              filter={filter}
              activeTodosLength={activeTodosLength}
              haveCompleted={filteredTodos.some(todo => todo.completed)}
              removeCompletedTodos={removeCompletedTodos}
            />
          </>
        )}
      </div>

      {errorStatus && (
        <ErrorNote
          errorMessage={errorMessage}
          setErrorStatus={changeErrorStatus}
        />
      )}
    </div>
  );
};
