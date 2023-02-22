import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getTodos, deleteTodos, updateTodoOnServer } from './api/todos';
import { Header } from './Components/Header';
import { TodoList } from './Components/TodoList';
import { Filter } from './Components/Filter';
import { Error } from './Components/Error';
import { Todo, TodoStatus } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { filterTodos } from './Components/filterTodo';
import { UserIdContext } from './utils/context';
import { ChangeFunction } from './types/ChangeFunction';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(TodoStatus.All);
  const [errorType, setErrorType] = useState(ErrorMessage.None);
  const [creatingTodoTitle, setCreatingTodoTitle] = useState('');
  const [isClearCompleted, setIsClearCompleted] = useState(false);
  const [isAllToggled, setIsAllToggled] = useState(false);

  const userId = useContext(UserIdContext);

  useEffect(() => {
    getTodos(userId)
      .then((userTodos) => setTodos(userTodos))
      .catch(() => {
        setErrorType(ErrorMessage.Download);
      });
  }, [userId]);

  const counterActiveTodos = useMemo(
    () => filterTodos(todos, TodoStatus.Active).length,
    [todos],
  );

  const counterCompletedTodos = todos.length - counterActiveTodos;

  const filteredTodos = useMemo(
    () => filterTodos(todos, selectedFilter),
    [selectedFilter, todos],
  );

  const showError = useCallback((error: ErrorMessage) => {
    setErrorType(error);
  }, []);

  const hideError = useCallback(() => {
    setErrorType(ErrorMessage.None);
  }, []);

  const AddTodo = useCallback(
    (newTodo: Todo) => setTodos((oldTodos) => [...oldTodos, newTodo]),
    [],
  );

  const DeleteTodo = useCallback((todoId: number) => {
    setTodos((oldTodos) => {
      return oldTodos.filter(({ id }) => id !== todoId);
    });
  }, []);

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

  const onClearCompleted = useCallback(async () => {
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

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          counterActiveTodos={counterActiveTodos}
          showError={showError}
          hideError={hideError}
          showCreatingTodo={setCreatingTodoTitle}
          addNewTodo={AddTodo}
          onToggleTodosStatus={handleToggleTodosStatus}
        />

        <TodoList
          todos={filteredTodos}
          creatingTodoTitle={creatingTodoTitle}
          counterActiveTodos={counterActiveTodos}
          showError={showError}
          hideError={hideError}
          DeleteTodo={DeleteTodo}
          ChangeTodo={handleChangeTodo}
          isClearCompleted={isClearCompleted}
          isAllToggled={isAllToggled}
        />

        {todos.length > 0 && (
          <Filter
            counterActiveTodos={counterActiveTodos}
            counterCompletedTodos={counterCompletedTodos}
            selectedFilter={selectedFilter}
            onFilterSelect={setSelectedFilter}
            onClearCompleted={onClearCompleted}
          />
        )}

        <Error
          errorMessage={errorType}
          onErrorClose={hideError}
        />
      </div>
    </div>
  );
};
