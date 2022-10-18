/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { deleteTodo, getTodos, updateTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import ErrorNotification from './components/ErrorNotification';
import TodoFooter from './components/Todos/TodoFooter';
import TodoHeader from './components/Todos/TodoHeader';
import TodoList from './components/Todos/TodoList';
import { ErrorTypes } from './types/ErrorTypes';
import { FilterTypes } from './types/FilterTypes';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorTypes | null>(null);
  const [filterType, setFilterType] = useState<FilterTypes>(FilterTypes.All);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [todosInProcess, setTodosInProcess] = useState<number[]>([]);

  const completedTodosId = useMemo(() => {
    return todos.filter(
      todo => todo.completed,
    ).map(todo => todo.id);
  }, [todos]);

  const activeTodosId = useMemo(() => {
    return todos.filter(
      todo => !todo.completed,
    ).map(todo => todo.id);
  }, [todos]);

  const isAllActive = completedTodosId.length === todos.length;

  if (error) {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }

  const changeError = (value: ErrorTypes | null) => {
    setError(value);
  };

  const addTodoToState = (todo: Todo) => {
    setTodos([todo, ...todos]);
  };

  const deleteTodoFromState = (todoId: number) => {
    setTodos(todos.filter(todo => todo.id !== todoId));
  };

  const changeTodoFromState = (todoId: number, title?: string) => {
    setTodos(prev => prev.map((todo) => {
      if (todoId !== todo.id) {
        return todo;
      }

      if (title) {
        return {
          ...todo,
          title,
        };
      }

      return {
        ...todo,
        completed: !todo.completed,
      };
    }));
  };

  const deleteAllCompletedTodos = () => {
    setTodosInProcess(completedTodosId);

    Promise.all(completedTodosId.map(async (id) => {
      await deleteTodo(id);
    }))
      .then(() => {
        setTodos(todos.filter(todo => !completedTodosId.includes(todo.id)));
      })
      .catch(() => setError(ErrorTypes.Delete))
      .finally(() => setTodosInProcess([]));
  };

  const changeFilterType = (value: FilterTypes) => {
    setFilterType(value);
  };

  const changeIsAdding = (value: boolean) => {
    setIsAdding(value);
  };

  const toggleAll = () => {
    if (isAllActive) {
      setTodosInProcess(completedTodosId);

      Promise.all(completedTodosId.map(async (id) => {
        await updateTodo(id, { completed: false });
      }))
        .then(() => {
          setTodos(prev => prev.map(todo => ({
            ...todo,
            completed: false,
          })));
        })
        .catch(() => setError(ErrorTypes.Update))
        .finally(() => setTodosInProcess([]));
    } else {
      setTodosInProcess(activeTodosId);

      Promise.all(activeTodosId.map(async (id) => {
        await updateTodo(id, { completed: false });
      }))
        .then(() => {
          setTodos(prev => prev.map(todo => {
            if (todo.completed) {
              return todo;
            }

            return {
              ...todo,
              completed: true,
            };
          }));
        })
        .catch(() => setError(ErrorTypes.Update))
        .finally(() => setTodosInProcess([]));
    }
  };

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterType) {
        case FilterTypes.All:
          return true;
        case FilterTypes.Active:
          return !todo.completed;
        case FilterTypes.Completed:
          return todo.completed;
        default:
          return null;
      }
    });
  }, [todos, filterType]);

  useEffect(() => {
    if (!user) {
      return;
    }

    getTodos(user.id)
      .then(setTodos)
      .catch(() => setError(ErrorTypes.Server));
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          changeError={changeError}
          isAdding={isAdding}
          changeIsAdding={changeIsAdding}
          user={user}
          add={addTodoToState}
          allActive={isAllActive}
          toggleAll={toggleAll}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={visibleTodos}
              isAdding={isAdding}
              deleteTodoToState={deleteTodoFromState}
              changeTodoFromState={changeTodoFromState}
              changeError={changeError}
              todosInProcess={todosInProcess}
            />
            <TodoFooter
              filterType={filterType}
              changeFilterType={changeFilterType}
              deleteAllCompletedTodos={deleteAllCompletedTodos}
              activeTodosCount={activeTodosId.length}
              completedTodosCount={completedTodosId.length}
            />
          </>
        )}
      </div>

      <ErrorNotification error={error} changeError={changeError} />

    </div>
  );
};
