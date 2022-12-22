import React,
{
  CSSProperties,
  useCallback,
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
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [activeTodoId, setActiveTodoId] = useState<number[]>([]);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const getTodosFromServer = useCallback(async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      }
    } catch {
      setErrorMessage('Unable to contact server. Please, try later.');
    }
  }, []);

  useEffect(() => {
    getTodosFromServer();
  }, [user]);

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

  const OneAndMoreTodosCompleted: boolean = useMemo(() => {
    return todos.some(todo => todo.completed === true);
  }, [todos]);

  const hiddenClearButonStyle: CSSProperties = {
    opacity: '0%',
    cursor: 'default',
  };

  const removeTodo = useCallback(async (todoId: number) => {
    setActiveTodoId([todoId]);

    try {
      await deleteTodo(todoId);
      getTodosFromServer();
      setActiveTodoId([]);
    } catch {
      setErrorMessage('Unable to delete todo');
    } finally {
      setActiveTodoId([]);
    }
  }, []);

  const removeCompletedTodos = useCallback(async () => {
    try {
      const completedTodos = todos.filter(todo => todo.completed === true);
      const completedTodosId = completedTodos.map(todo => todo.id);

      setActiveTodoId(completedTodosId);

      await Promise.all(completedTodos.map(async ({ id }) => {
        await deleteTodo(id);
      }));

      getTodosFromServer();
    } catch {
      setErrorMessage('Unable to delete completed todos');
    } finally {
      setActiveTodoId([]);
    }
  }, [todos]);

  const createTodo = useCallback(async (title: string) => {
    setIsAdding(true);

    const todosId = todos.map(todo => todo.id);

    setActiveTodoId(todosId);

    try {
      if (user) {
        await addTodo(title, user.id);

        await getTodosFromServer();
      }
    } catch {
      setErrorMessage('Unable to create new todo');
    } finally {
      setTimeout(() => {
        setIsAdding(false);
        setActiveTodoId([]);
      }, 300);
    }
  }, [todos]);

  const updateOneTodo = useCallback(async (
    todoId: number, todo: Partial<Todo>,
  ) => {
    setActiveTodoId([todoId]);

    try {
      await updateTodo(todoId, todo);
      getTodosFromServer();
    } catch {
      setErrorMessage('Unable to update todo');
    } finally {
      setActiveTodoId([]);
    }
  }, []);

  const updateAllTodoStatus = useCallback(async () => {
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
    } catch {
      setErrorMessage('Unable to update todos');
    } finally {
      setActiveTodoId([]);
    }
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          completedTodos={allTodosCompleted}
          onTodoTitle={createTodo}
          onErrorMessage={setErrorMessage}
          inputDisabled={isAdding}
          onUpdateAllTodoStatus={updateAllTodoStatus}
        />

        <Todolist
          todos={visibleTodos}
          onDelete={removeTodo}
          activeTodoId={activeTodoId}
          onUpdateTodoStatus={updateOneTodo}
          onDeleteTodo={removeTodo}
          isAdding={isAdding}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${incompletedTodos} items left`}
            </span>

            <Filter filter={filter} onSelectFilter={setFilter} />

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              style={!OneAndMoreTodosCompleted
                ? hiddenClearButonStyle : undefined}
              disabled={!OneAndMoreTodosCompleted}
              onClick={removeCompletedTodos}
            >
              Clear completed
            </button>

          </footer>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onErrorMessage={setErrorMessage}
      />
    </div>
  );
};
