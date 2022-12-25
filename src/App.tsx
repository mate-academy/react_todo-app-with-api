/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Error } from './components/Error';
import { Filter } from './types/Filter';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorTypes } from './types/ErrorTypes';

export const App: React.FC = () => {
  const [hasLoadingError, setHasLoadingError] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState(ErrorTypes.None);
  const [filterBy, setFilterBy] = useState(Filter.ALL);
  const [isAdding, setIsAdding] = useState(false);
  const [loadingList, setLoadingList] = useState<number[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);

  const getTodosFromServer = useCallback(async () => {
    if (user) {
      try {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      } catch {
        setHasLoadingError(true);
        setErrorMessage(ErrorTypes.LOADING);
      }
    }
  }, []);

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const completedTodos = useMemo(() => todos.filter(
    todo => todo.completed,
  ), [todos]);
  const activeTodos = useMemo(() => todos.filter(
    todo => !todo.completed,
  ), [todos]);

  let visibleTodos = todos;

  switch (filterBy) {
    case Filter.COMPLETED:
      visibleTodos = completedTodos;
      break;

    case Filter.ACTIVE:
      visibleTodos = activeTodos;
      break;

    case Filter.ALL:
      visibleTodos = todos;
      break;

    default: visibleTodos = todos;
  }

  const errorInfo = useCallback((errorTitle: ErrorTypes) => {
    setHasLoadingError(true);
    setErrorMessage(errorTitle);
  }, []);

  const clearErrorMessage = useCallback(() => setHasLoadingError(false), []);

  const addNewTodo = useCallback((newTodo: Todo) => setTodos(
    (prevTodos) => [...prevTodos, newTodo],
  ), []);

  const addTodoToLoadingList = useCallback((idToAdd: number) => setLoadingList(
    prevIds => [...prevIds, idToAdd],
  ), []);

  const deleteTodoOfLoadingList = useCallback(
    (idToRemove: number) => setLoadingList(
      prevIds => prevIds.filter(id => id !== idToRemove),
    ), [],
  );

  const clearLoadingList = useCallback(() => setLoadingList([]), []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          user={user}
          titleToAdd={title}
          changeTitle={setTitle}
          onSetTodo={addNewTodo}
          errorInfo={errorInfo}
          onSetIsAdding={setIsAdding}
          isAdding={isAdding}
          completedTodos={completedTodos}
          activeTodos={activeTodos}
          todos={todos}
          loadTodos={getTodosFromServer}
          addTodoToLoadingList={addTodoToLoadingList}
          clearLoadingList={clearLoadingList}
          clearErrorMessage={clearErrorMessage}
        />

        <TodoList
          visibleTodos={visibleTodos}
          loadTodos={getTodosFromServer}
          isAdding={isAdding}
          title={title}
          user={user}
          addTodoToLoadingList={addTodoToLoadingList}
          deleteTodoOfLoadingList={deleteTodoOfLoadingList}
          loadingList={loadingList}
          errorInfo={errorInfo}
        />

        {todos.length > 0 && (
          <Footer
            activeTodos={activeTodos}
            filterBy={filterBy}
            selectFilterField={setFilterBy}
            completedTodos={completedTodos}
            addTodoToLoadingList={addTodoToLoadingList}
            clearLoadingList={clearLoadingList}
            loadTodos={getTodosFromServer}
          />
        )}
      </div>

      <Error
        clearErrorMessage={clearErrorMessage}
        hasLoadingError={hasLoadingError}
        errorMessage={errorMessage}
      />
    </div>
  );
};
