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
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [todoIdsLoading, setTodoIdsLoading] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo>({
    id: 0,
    userId: 0,
    title: '',
    completed: false,
  });

  const getTodosFromServer = useCallback(async () => {
    try {
      if (!user) {
        return;
      }

      const todosFromServer = await getTodos(user.id);

      setTodos(todosFromServer);
    } catch {
      setErrorMessage('Can\'t download ToDos from server');
    }
  }, []);

  const addNewTodoToServer = useCallback(async (title: string) => {
    try {
      if (!user) {
        return;
      }

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
    } catch {
      setErrorMessage('Unable to add a todo');
    }
  }, []);

  const removeTodoFromServer = useCallback(async (todoId: number) => {
    try {
      setTodoIdsLoading(currIds => [...currIds, todoId]);

      await deleteTodo(todoId);
      await getTodosFromServer();

      setTodoIdsLoading(currIds => (
        currIds.filter((id) => id !== todoId)
      ));
    } catch {
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
      setTodoIdsLoading(currIds => (
        [...currIds, ...completedTodos.map(todo => todo.id)]
      ));

      await Promise.all(completedTodos.map(async ({ id }) => (
        deleteTodo(id)
      )));

      setTodoIdsLoading([0]);

      await getTodosFromServer();
    } catch (error) {
      setErrorMessage('Unable to remove all completed todo');
    }
  }, [completedTodos]);

  const toggleTodoStatus = useCallback(async (
    todoId: number,
    status: boolean,
  ) => {
    try {
      setTodoIdsLoading(currIds => [...currIds, todoId]);

      await changeTodo(todoId, { completed: status });
      await getTodosFromServer();

      setTodoIdsLoading(currIds => (
        currIds.filter((id) => id !== todoId)
      ));
    } catch {
      setErrorMessage('Unable to toggle ToDo status');
    }
  }, []);

  const toggleAllTodosStatus = useCallback(async () => {
    try {
      const todosFilteredByStatus = completedTodos.length !== todos.length
        ? todos.filter(({ completed }) => !completed)
        : todos;

      setTodoIdsLoading([...todosFilteredByStatus.map(todo => todo.id)]);

      await Promise.all(todosFilteredByStatus.map(async ({ id, completed }) => (
        changeTodo(id, { completed: !completed })
      )));

      await getTodosFromServer();

      setTodoIdsLoading([0]);
    } catch {
      setErrorMessage('Unable to toggle all ToDos status');
    }
  }, [todos]);

  const setNewTodoTitleToServer = useCallback(async (
    todoId: number,
    newTitle: string,
  ) => {
    try {
      setTodoIdsLoading(currIds => [...currIds, todoId]);

      await changeTodo(todoId, { title: newTitle });
      await getTodosFromServer();

      setTodoIdsLoading(currIds => (
        currIds.filter((id) => id !== todoId)
      ));
    } catch {
      setErrorMessage('Unable to update a todo');
    }
  }, []);

  const closeNotification = useCallback(() => setErrorMessage(''), []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosFromServer();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, [errorMessage]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
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
              todoIdsLoading={todoIdsLoading}
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

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          onClose={closeNotification}
        />
      )}
    </div>
  );
};
