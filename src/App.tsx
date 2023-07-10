import {
  FC,
  ChangeEvent,
  FormEvent,
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
import { preparedTodos, getcompletedTodoIds } from './utils/todoUtils';
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
      setVisibleError('Unable to load a todos');
    }
  };

  useEffect(() => {
    fetchTodosFromServer();
  }, [tempTodo, loadingTodoIds, visibleError]);

  const completedTodoIds = useMemo(() => (
    getcompletedTodoIds(todos)
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
      setVisibleError('Unable to delete a todo');
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
            const updatedTodo = await changeTodo(id, {
              ...todoToUpdate,
              completed: newTitle
                ? todoToUpdate.completed
                : !todoToUpdate.completed,
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
      setVisibleError('Unable to update a todo');
    } finally {
      setLoadingTodoIds([]);
    }
  }, [todos]);

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
      setVisibleError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setLoadingTodoIds([]);
      setTodoTitle('');
    }
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      setTodoTitle('');
      setVisibleError('Title can\'t be empty');

      return;
    }

    addTodo(todoTitle);
  };

  const handleQueryChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
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
          handleQueryChange={handleQueryChange}
          handleSubmit={handleSubmit}
          handleUpdate={handleUpdate}
          isInputDisabled={isInputDisabled}
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
        setVisibleError={setVisibleError}
      />
    </div>
  );
};
