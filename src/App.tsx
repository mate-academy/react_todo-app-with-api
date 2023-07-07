import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Todo } from './types/Todo';
import { todosReguest } from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { LoadError } from './types/LoadError';
import { FilterType } from './Enums/FilterType';
import { filterTodos } from './utils/filterTodos';
import { PostTodo } from './types/PostTodo';
import { Header } from './components/Header';
import { checkIfAllTodosCompleted } from './utils/checkIfAllTodosCompleted';
import { getUncompletedTodos } from './utils/getUncompletedTodos';

export const USER_ID = 10895;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(FilterType.ALL);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  const [loadError, setError] = useState<LoadError>({
    status: false,
    message: '',
  });
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const preparedTodos = useMemo(() => (
    filterTodos(todos, filterType)
  ), [filterType, todos]);

  const isTodosExists = todos.length > 0;
  const isDisplayTodos = isTodosExists || tempTodo;

  const fetchTodos = useCallback(async () => {
    try {
      const response = await todosReguest.getTodos(USER_ID);

      setTodos(response);
    } catch (error) {
      setError({
        status: true,
        message: 'Unable to load a todos, retry later',
      });
    }
  }, []);

  const addNewTodo = useCallback(async (title: string) => {
    const newTodo: PostTodo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    try {
      const newSuccesfulTodo = await todosReguest.postTodo(newTodo);

      setTodos(currentTodos => ([
        ...currentTodos,
        newSuccesfulTodo,
      ]));
    } catch (error) {
      throw new Error('Cant add new todo... Try again');
    } finally {
      setTempTodo(null);
    }
  }, []);

  const removeTodoByID = useCallback(async (todoID: number) => {
    try {
      await todosReguest.deleteTodo(todoID);
      setTodos(current => (
        current.filter(todo => todo.id !== todoID)
      ));
    } catch {
      setError({
        status: true,
        message: 'Can\'t delete todo. Try again',
      });
    }
  }, []);

  const replaceTodo = (todoToReplace: Todo) => {
    setTodos((currentTodos) => (
      currentTodos.map(todo => {
        if (todo.id !== todoToReplace.id) {
          return todo;
        }

        return todoToReplace;
      })
    ));
  };

  const editTodoByID = useCallback(async (
    id: number, data: Partial<Todo>,
  ) => {
    try {
      const result = await todosReguest.editTodo(id, { ...data });

      replaceTodo(result);
    } catch (error) {
      setError({
        status: true,
        message: 'Unable to edit todo... Try again',
      });
    }
  }, []);

  const toggleAllHandler = async () => {
    const isAllTodosCompleted = checkIfAllTodosCompleted(todos);
    const todosToChange = !isAllTodosCompleted
      ? getUncompletedTodos(todos)
      : todos;

    setLoadingTodos(todosToChange.map(todo => todo.id));

    await Promise.all(
      todosToChange.map(currentTodo => {
        const { id, completed } = currentTodo;

        if (!completed) {
          return editTodoByID(id, { completed: true });
        }

        if (isAllTodosCompleted) {
          return editTodoByID(id, { completed: !completed });
        }

        return false;
      }),
    );

    setLoadingTodos([]);
  };

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={preparedTodos}
          addNewTodo={addNewTodo}
          setError={setError}
          toggleAllHandler={toggleAllHandler}
        />

        {isDisplayTodos && (
          <TodoList
            todos={preparedTodos}
            tempTodo={tempTodo}
            removeTodoByID={removeTodoByID}
            editTodoByID={editTodoByID}
            loadingTodos={loadingTodos}
          />
        )}

        {isDisplayTodos && (
          <Footer
            todos={todos}
            filterType={filterType}
            setFilterType={setFilterType}
            removeTodoByID={removeTodoByID}
            setLoadingTodos={setLoadingTodos}
          />
        )}
      </div>

      <ErrorNotification
        loadError={loadError}
        setError={setError}
      />
    </div>
  );
};
