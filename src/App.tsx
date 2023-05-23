import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Todo } from './types/Todo';
import { TodoStatus } from './types/TodoStatus';
import { ErrorMessage } from './types/ErrorMessage';
import { deleteTodos, getTodos, updateTodoOnServer } from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import { Error } from './components/Error';
import { USER_ID } from './types/ConstantTypes';
import { ChangeFunction } from './types/ChangeFunction';

function filterTodos(todos: Todo[], selectedFilter: TodoStatus): Todo[] {
  return todos.filter((todo) => {
    switch (selectedFilter) {
      case TodoStatus.All:
        return true;

      case TodoStatus.Active:
        return !todo.completed;

      case TodoStatus.Completed:
        return todo.completed;

      default:
        return true;
    }
  });
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(TodoStatus.All);
  const [errorType, setErrorType] = useState(ErrorMessage.None);
  const [query, setQuery] = useState('');
  const [isClearCompleted, setIsClearCompleted] = useState(false);
  const [isAllToggled, setIsAllToggled] = useState(false);

  const loadTodos = useCallback(async () => {
    const todosFromServer = await getTodos(USER_ID);

    try {
      setTodos(todosFromServer);
    } catch {
      setErrorType(ErrorMessage.Download);
    }
  }, []);

  const counterActiveTodos = useMemo(
    () => todos.reduce((num, todo) => {
      return todo.completed ? num : num + 1;
    }, 0),
    [todos],
  );

  const counterCompletedTodos = todos.length - counterActiveTodos;

  const filteredTodos = useMemo(() => (
    filterTodos(todos, selectedFilter)
  ), [selectedFilter, todos]);

  const showError = useCallback((error: ErrorMessage) => {
    setErrorType(error);
  }, []);

  const hideError = useCallback(() => {
    setErrorType(ErrorMessage.None);
  }, []);

  const handleAdd = useCallback(
    (newTodo: Todo): void => setTodos((oldTodos) => [...oldTodos, newTodo]),
    [],
  );

  const handleDelete = useCallback((todoId: number) => (
    setTodos((oldTodos) => oldTodos.filter(todo => todo.id !== todoId))
  ), []);

  const handleClearCompleted = useCallback(async () => {
    const completedTodos = filterTodos(todos, TodoStatus.Completed);

    setIsClearCompleted(true);
    hideError();

    try {
      const todosIds = await Promise.all(
        completedTodos.map(({ id }) => deleteTodos(id).then(() => id)),
      );

      setTodos((oldTodos) => {
        return oldTodos.filter(({ id }) => !todosIds.includes(id));
      });
    } catch {
      showError(ErrorMessage.Delete);
    } finally {
      setIsClearCompleted(false);
    }
  }, [todos]);

  const handleChangeTodo: ChangeFunction = useCallback(
    (todoId, propName, newPropValue) => {
      setTodos((oldTodos) => {
        return oldTodos.map((todo) => {
          if (todo.id !== todoId) {
            return todo;
          }

          return {
            ...todo,
            [propName]: newPropValue,
          };
        });
      });
    },
    [],
  );

  const handleToggleTodosStatus = useCallback(async () => {
    const filterType = counterActiveTodos === 0
      ? TodoStatus.All
      : TodoStatus.Active;
    const todosToToggle = filterTodos(todos, filterType);

    setIsAllToggled(true);
    hideError();

    try {
      const todosIds = await Promise.all(
        todosToToggle.map(({ id, completed }) => {
          return updateTodoOnServer(id, { completed: !completed }).then(
            () => id,
          );
        }),
      );

      setTodos((oldTodos) => {
        return oldTodos.map((todo) => {
          if (!todosIds.includes(todo.id)) {
            return todo;
          }

          return {
            ...todo,
            completed: !todo.completed,
          };
        });
      });
    } catch {
      showError(ErrorMessage.Update);
    } finally {
      setIsAllToggled(false);
    }
  }, [todos]);

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          countActiveTodos={counterActiveTodos}
          onShowError={showError}
          onHideError={hideError}
          onChange={setQuery}
          onAddTodo={handleAdd}
          onToggleTodosStatus={handleToggleTodosStatus}
        />

        <TodoList
          todos={filteredTodos}
          query={query}
          counterActiveTodos={counterActiveTodos}
          onShowError={showError}
          onHideError={hideError}
          handleDelete={handleDelete}
          onChangeTodo={handleChangeTodo}
          isClearCompleted={isClearCompleted}
          isAllToggled={isAllToggled}
        />

        {todos.length > 0 && (
          <Filter
            countActiveTodos={counterActiveTodos}
            countCompletedTodos={counterCompletedTodos}
            selectedFilter={selectedFilter}
            onFilterSelect={setSelectedFilter}
            onClear={handleClearCompleted}
          />
        )}

        <Error
          errorMessage={errorType}
          onClose={hideError}
        />
      </div>
    </div>
  );
};
