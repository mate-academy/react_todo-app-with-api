/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorType } from './types/ErrorType';
import { GroupBy } from './types/GroupBy';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [groupBy, setGroupBy] = useState<GroupBy>(GroupBy.ALL);
  const [error, setError] = useState<ErrorType>(ErrorType.NONE);
  const [todoTitle, setTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deletedTodoIds, setDeletedTodoIds] = useState<number[]>([]);
  const [selectedTodoIds, setSelectedTodoIds] = useState<number[]>([]);

  const loadTodos = useCallback(async () => {
    if (user) {
      try {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      } catch {
        setError(ErrorType.LOAD);
      }
    }
  }, []);

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user) {
      setIsAdding(true);

      try {
        if (!todoTitle.trim().length) {
          setError(ErrorType.TITLE);
          setIsAdding(false);

          return;
        }

        await addTodo(todoTitle.trim(), user.id);
        await loadTodos();

        setIsAdding(false);
        setTodoTitle('');
      } catch {
        setError(ErrorType.ADD);
        setIsAdding(false);
      }
    }
  };

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    setDeletedTodoIds(currentTodoIds => [...currentTodoIds, todoId]);

    try {
      await deleteTodo(todoId);
      await loadTodos();
    } catch {
      setError(ErrorType.DELETE);
      setSelectedTodoIds([]);
    }
  }, [todos]);

  const handleDeleteCompletedTodos = useCallback(async () => {
    try {
      const completedTodoIds = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      setDeletedTodoIds(completedTodoIds);

      await Promise.all(todos.map(async (todo) => {
        if (todo.completed) {
          await deleteTodo(todo.id);
        }

        return todo;
      }));

      await loadTodos();
    } catch {
      setError(ErrorType.DELETE);
      setSelectedTodoIds([]);
    }
  }, [todos]);

  const handleToggleTodo = useCallback(
    async (todoId: number, completed: boolean) => {
      setSelectedTodoIds(currentTodoIds => [...currentTodoIds, todoId]);

      try {
        await updateTodo(todoId, { completed: !completed });
        await loadTodos();

        setSelectedTodoIds(currentTodoIds => (
          currentTodoIds.filter(id => id !== todoId)
        ));
      } catch {
        setError(ErrorType.UPDATE);
        setSelectedTodoIds([]);
      }
    }, [todos],
  );

  const isAllTodosCompleted = useMemo(
    () => todos.every(todo => todo.completed), [todos],
  );

  const handleToggleAllTodos = useCallback(async () => {
    try {
      await Promise.all(todos.map(async (todo) => {
        if (isAllTodosCompleted || !todo.completed) {
          setSelectedTodoIds(currentTodoIds => [...currentTodoIds, todo.id]);

          await updateTodo(todo.id, { completed: !todo.completed });
        }
      }));

      await loadTodos();

      setSelectedTodoIds([]);
    } catch {
      setError(ErrorType.UPDATE);
      setSelectedTodoIds([]);
    }
  }, [todos]);

  const handleChangeTodoTitle = useCallback(
    async (todoId: number, title: string) => {
      setSelectedTodoIds([todoId]);

      try {
        await updateTodo(todoId, { title });
        await loadTodos();

        setSelectedTodoIds([]);
      } catch {
        setError(ErrorType.UPDATE);
        setSelectedTodoIds([]);
      }
    }, [],
  );

  const handleGroupBy = useCallback((status: GroupBy) => {
    setGroupBy(status);
  }, []);

  const handleCloseError = useCallback(() => {
    setError(ErrorType.NONE);
  }, []);

  const handleSetTodoTitle = useCallback((title: string) => {
    setTodoTitle(title);
  }, []);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    const filteredTodos = todos.filter(({ completed }) => {
      switch (groupBy) {
        case GroupBy.COMPLETED:
          return completed;

        case GroupBy.ACTIVE:
          return !completed;

        default:
          return true;
      }
    });

    setVisibleTodos(filteredTodos);
  }, [todos, groupBy]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          isAllTodosCompleted={isAllTodosCompleted}
          todoTitle={todoTitle}
          submitNewTodo={handleAddTodo}
          isAdding={isAdding}
          onSetTodoTitle={handleSetTodoTitle}
          onToggleAllTodos={handleToggleAllTodos}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              isAdding={isAdding}
              todoTitle={todoTitle}
              onDeleteTodo={handleDeleteTodo}
              deletedTodoIds={deletedTodoIds}
              onToggleTodo={handleToggleTodo}
              selectedTodoId={selectedTodoIds}
              onChangeTodoTitle={handleChangeTodoTitle}
            />

            <Footer
              groupBy={groupBy}
              onGroup={handleGroupBy}
              onDeleteCompletedTodos={handleDeleteCompletedTodos}
              todos={todos}
            />
          </>
        )}
      </div>

      <ErrorNotification
        error={error}
        onCloseError={handleCloseError}
      />
    </div>
  );
};
