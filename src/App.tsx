/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  getTodos,
  addTodo,
  deleteTodo,
  changeTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { FilterType } from './types/FilterType';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [todoIdsToRemove, setTodoIdsToRemove] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo>({
    id: 0,
    userId: 0,
    title: '',
    completed: false,
  });

  const getTodosFromServer = useCallback(async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      }
    } catch (error) {
      setHasError(true);
      setErrorMessage('Can`t download ToDos from server');
    }
  }, []);

  const addNewTodoToServer = useCallback(async (title: string) => {
    try {
      if (user) {
        setIsAdding(true);

        const currTodo = {
          title,
          userId: user.id,
          completed: false,
        };

        setTempTodo(prev => ({ ...prev, ...currTodo }));

        await addTodo(currTodo);
        await getTodosFromServer();
        setIsAdding(false);
      }
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to add a todo');
    }
  }, []);

  const removeTodoFromServer = useCallback(async (todoId: number) => {
    try {
      if (user) {
        setTodoIdsToRemove(currIds => [...currIds, todoId]);

        await deleteTodo(todoId);
        await getTodosFromServer();
      }
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to remove ToDo');
    }
  }, []);

  const completedTodos = useMemo(() => (
    todos.filter(({ completed }) => completed)
  ), [todos]);

  const filtredTodos = useMemo(() => (
    todos.filter(({ completed }) => {
      switch (filterType) {
        case FilterType.Active:
          return !completed;

        case FilterType.Completed:
          return completed;

        default:
          return true;
      }
    })
  ), [todos, filterType]);

  const removeAllCompletedTodos = useCallback(async () => {
    try {
      await Promise.all(completedTodos.map(async ({ id }) => (
        removeTodoFromServer(id)
      )));
    } catch (error) {
      setErrorMessage('Unable to remove all completed todo');
      setHasError(true);
    }
  }, [completedTodos]);

  const toggleTodoStatus = useCallback(async (
    todoId: number,
    status: boolean,
  ) => {
    try {
      await changeTodo(todoId, { completed: status });
      getTodosFromServer();
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to toggle ToDo status');
    }
  }, []);

  const toggleAllTodosStatus = useCallback(async () => {
    try {
      const todosFilteredByStatus = completedTodos.length !== todos.length
        ? todos.filter(({ completed }) => !completed)
        : todos;

      await Promise.all(todosFilteredByStatus.map(async ({ id, completed }) => (
        changeTodo(id, { completed: !completed })
      )));
      getTodosFromServer();
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to toggle all ToDos status');
    }
  }, [todos]);

  const setNewTodoTitleToServer = useCallback(async (
    todoId: number,
    newTitle: string,
  ) => {
    try {
      setTodoIdsToRemove(currIds => [...currIds, todoId]);

      await changeTodo(todoId, { title: newTitle });
      await getTodosFromServer();

      setTodoIdsToRemove(currIds => (
        currIds.filter((id) => id !== todoId)
      ));
    } catch (error) {
      setHasError(true);
      setErrorMessage('Unable to update a todo');
    }
  }, []);

  const closeNotification = useCallback(() => setHasError(false), []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosFromServer();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setHasError(false);
    }, 3000);
  }, [hasError]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          setHasError={setHasError}
          setErrorMessage={setErrorMessage}
          addNewTodo={addNewTodoToServer}
          isAdding={isAdding}
          toggleAllTodosStatus={toggleAllTodosStatus}
          todosLength={todos.length}
          completedTodosLen={completedTodos.length}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filtredTodos}
              removeTodo={removeTodoFromServer}
              isAdding={isAdding}
              tempTodo={tempTodo}
              todoIdsToRemove={todoIdsToRemove}
              toggleTodoStatus={toggleTodoStatus}
              changeTitle={setNewTodoTitleToServer}
            />

            <Footer
              filterType={filterType}
              setFilterType={setFilterType}
              todosLength={todos.length}
              completedTodos={completedTodos.length}
              onRemove={removeAllCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorNotification
        hasError={hasError}
        onClose={closeNotification}
      >
        {errorMessage}
      </ErrorNotification>
    </div>
  );
};
