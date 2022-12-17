import React,
{
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';

import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';

import { Todolist } from './components/TodoList';
import { Filter } from './components/Filter';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>(FilterType.ALL);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [activeTodoId, setActiveTodoId] = useState<number[]>([]);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const getTodosFromServer = async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      }
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to contact server. Please, try later.');
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const visibleTodos: Todo[] = useMemo(() => (
    todos.filter(todo => {
      switch (filter) {
        case FilterType.ACTIVE:
          return !todo.completed;

        case FilterType.COMPLETED:
          return todo.completed;

        default:
          return todo;
      }
    })
  ), [todos, filter]);

  const incompletedTodos: number = useMemo(() => {
    return todos.filter(todo => todo.completed === false).length;
  }, [todos]);

  const allTodosCompleted: boolean = useMemo(() => {
    return todos.every(todo => todo.completed === true);
  }, [todos]);

  const removeTodo = async (todoId: number) => {
    setActiveTodoId([todoId]);

    try {
      await deleteTodo(todoId);
      getTodosFromServer();
      setActiveTodoId([]);
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to delete todo');
    }
  };

  const removeCompletedTodos = async () => {
    try {
      const completedTodos = todos.filter(todo => todo.completed === true);
      const completedTodosId = completedTodos.map(todo => todo.id);

      setActiveTodoId(completedTodosId);

      await Promise.all(completedTodos.map(async ({ id }) => {
        await deleteTodo(id);
      }));

      getTodosFromServer();
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to delete completed todos');
    } finally {
      setActiveTodoId([]);
    }
  };

  const createTodo = async (title: string) => {
    setIsAdding(true);

    try {
      if (user) {
        await addTodo(title, user.id);

        getTodosFromServer();
      }
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to create new todo');
    } finally {
      setIsAdding(false);
    }
  };

  const updateOneTodo = async (todoId: number, todo: Partial<Todo>) => {
    setActiveTodoId([todoId]);

    try {
      await updateTodo(todoId, todo);
      getTodosFromServer();
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to update todo');
    } finally {
      setActiveTodoId([]);
    }
  };

  const updateAllTodoStatus = async () => {
    try {
      if (allTodosCompleted) {
        const todosId = todos.map(todo => todo.id);

        setActiveTodoId(todosId);

        await Promise.all(todos.map(async ({ id }) => {
          await updateTodo(id, { completed: false });
        }));

        getTodosFromServer();
      } else {
        const incompletedTodosArray = todos
          .filter(todo => todo.completed === false);
        const incompletedTodosId = incompletedTodosArray.map(todo => todo.id);

        setActiveTodoId(incompletedTodosId);

        await Promise.all(incompletedTodosArray.map(async ({ id }) => {
          await updateTodo(id, { completed: true });
        }));

        getTodosFromServer();
      }
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to update todos');
    } finally {
      setActiveTodoId([]);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          completedTodos={allTodosCompleted}
          onTodoTitle={createTodo}
          onErrorMessage={setErrorMessage}
          onErrorPresence={setHasError}
          inputDisabled={isAdding}
          onUpdateAllTodoStatus={updateAllTodoStatus}
        />

        <Todolist
          todos={visibleTodos}
          onDelete={removeTodo}
          activeTodoId={activeTodoId}
          onUpdateTodoStatus={updateOneTodo}
          onDeleteTodo={removeTodo}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${incompletedTodos} items left`}
            </span>

            <Filter filter={filter} onSelectFilter={setFilter} />

            {todos.some(todo => todo.completed === true) && (
              <button
                data-cy="ClearCompletedButton"
                type="button"
                className="todoapp__clear-completed"
                onClick={removeCompletedTodos}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      <ErrorNotification
        hasError={hasError}
        onErrorPresence={setHasError}
        errorMessage={errorMessage}
        onErrorMessage={setErrorMessage}
      />
    </div>
  );
};
