import {
  FC,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import './App.scss';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  removeTodo,
  addTodoToServer,
  changeTodo,
} from './api/todos';
import { TodosList } from './components/TodosList/TodosList';
import { Todo } from './types/Todo';
import { ErrorInfo } from './components/ErrorInfo/ErrorInfo';
import {
  preparedTodos,
  getCompletedTodoIds,
  filteredTodosByCompletion,
} from './utils/todoUtils';
import { StatusValue } from './types/StatusValue';
import { TodoAppHeader } from './components/TodoAppHeader/TodoAppHeader';
import { TodoAppFooter } from './components/TodoAppFooter/TodoAppFooter';

const USER_ID = 10725;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [todoFilter, setTodoFilter] = useState<StatusValue>(StatusValue.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [visibleError, setVisibleError] = useState('');

  const fetchTodosFromServer = async () => {
    try {
      const fetchedTodos = await getTodos(USER_ID);

      setTodos(fetchedTodos as Todo[]);
    } catch (error) {
      if (error instanceof Error) {
        setVisibleError(`Unable to load a todos: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    fetchTodosFromServer();
  }, [tempTodo, loadingTodoIds]);

  const completedTodoIds = useMemo(() => (
    getCompletedTodoIds(todos)
  ), [todos]);

  const visibleTodos = useMemo(() => (
    preparedTodos(todos, todoFilter)
  ), [todos, todoFilter]);

  const removeTodos = useCallback(async (todoIds: number[]) => {
    try {
      setLoadingTodoIds(prevIds => [...prevIds, ...todoIds]);

      await Promise.all(
        todoIds.map(async id => {
          await removeTodo(id);
        }),
      );

      setTodos((previousTodos) => (
        previousTodos.filter(todo => !todoIds.includes(todo.id))
      ));
    } catch (error) {
      if (error instanceof Error) {
        setVisibleError(`Unable to delete a todo: ${error.message}`);
      }
    } finally {
      setLoadingTodoIds([]);
    }
  }, []);

  const handleUpdate = useCallback(async (
    todoIds: number[],
    newTitle?: string,
  ) => {
    try {
      setLoadingTodoIds((prevIds) => [...prevIds, ...todoIds]);

      await Promise.all(
        todoIds.map(async id => {
          const todoToUpdate = todos.find(todo => todo.id === id);

          if (todoToUpdate) {
            const isTodoCompleted = newTitle
              ? todoToUpdate.completed
              : !todoToUpdate.completed;

            const updatedTodo = await changeTodo(id, {
              ...todoToUpdate,
              completed: isTodoCompleted,
              title: newTitle || todoToUpdate.title,
            });

            setTodos(prevTodos => prevTodos.map(todo => (
              todo.id === updatedTodo.id
                ? updatedTodo
                : todo
            )));
          }
        }),
      );
    } catch (error) {
      if (error instanceof Error) {
        setVisibleError(`Unable to update a todo: ${error.message}`);
      }
    } finally {
      setLoadingTodoIds([]);
    }
  }, [todos]);

  const handleUpdateAllStatus = () => (
    handleUpdate(
      filteredTodosByCompletion(todos)
        .map(todo => todo.id),
    )
  );

  const addTodo = useCallback(async (title: string) => {
    try {
      const newTodo = {
        title: title.trim(),
        completed: false,
        userId: USER_ID,
      };

      const tempTodoId = 0;

      setTempTodo({
        ...newTodo,
        id: tempTodoId,
      });

      setLoadingTodoIds([tempTodoId]);

      const addedTodo = await addTodoToServer('/todos', newTodo);

      setTodos((currentTodos) => [...currentTodos, addedTodo]);
    } catch (error) {
      if (error instanceof Error) {
        setVisibleError(`Unable to add a todo: ${error.message}`);
      }
    } finally {
      setTempTodo(null);
      setLoadingTodoIds([]);
      setTodoTitle('');
    }
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const setTitle = (title: string) => {
    setTodoTitle(title);
  };

  const setError = (newError: string) => {
    setVisibleError(newError);
  };

  const handleClearCompleted = () => {
    removeTodos(completedTodoIds);
    setLoadingTodoIds(completedTodoIds);
    setTodoFilter(StatusValue.ALL);
  };

  const isInputDisabled = Boolean(loadingTodoIds.length);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoAppHeader
          todos={todos}
          todoTitle={todoTitle}
          setTitle={setTitle}
          handleUpdateAllStatus={handleUpdateAllStatus}
          isInputDisabled={isInputDisabled}
          setError={setError}
          addTodo={addTodo}
        />

        <TodosList
          todos={visibleTodos}
          tempTodo={tempTodo}
          removeTodos={removeTodos}
          loadingTodoIds={loadingTodoIds}
          handleUpdate={handleUpdate}
        />

        {todos.length > 0 && (
          <TodoAppFooter
            todos={todos}
            completedTodoIds={completedTodoIds}
            todoFilter={todoFilter}
            setTodoFilter={setTodoFilter}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorInfo
        visibleError={visibleError}
        setError={setError}
      />
    </div>
  );
};
