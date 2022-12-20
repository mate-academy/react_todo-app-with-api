/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
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

  const getTodosFromServer = async () => {
    if (user) {
      try {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      } catch {
        setHasLoadingError(true);
        setErrorMessage(ErrorTypes.LOADING);
      }
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const completedTodos = todos.filter(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  let visibleTodos = todos;

  switch (filterBy) {
    case Filter.COMPLETED:
      visibleTodos = completedTodos;
      break;

    case Filter.ACTIVE:
      visibleTodos = activeTodos;
      break;

    default: visibleTodos = todos;
  }

  const errorInfo = (errorTitle: ErrorTypes) => {
    setHasLoadingError(true);
    setErrorMessage(errorTitle);
  };

  const clearErrorMessage = () => setHasLoadingError(false);

  const addNewTodo = (newTodo: Todo) => setTodos(
    (prevTodos) => [...prevTodos, newTodo],
  );

  const addTodoToLoadingList = (idToAdd: number) => setLoadingList(
    prevIds => [...prevIds, idToAdd],
  );

  const deleteTodoOfLoadingList = (idToRemove: number) => setLoadingList(
    prevIds => prevIds.filter(id => id !== idToRemove),
  );

  const clearLoadingList = () => setLoadingList([]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {errorMessage === ErrorTypes.LOADING
        ? (
          <>
            <span>Error... Can not load your todos</span>
          </>
        )
        : (
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

            <Footer
              activeTodos={activeTodos}
              filterBy={filterBy}
              selectFilterField={setFilterBy}
              completedTodos={completedTodos}
              addTodoToLoadingList={addTodoToLoadingList}
              clearLoadingList={clearLoadingList}
              loadTodos={getTodosFromServer}
            />
          </div>
        )}

      <Error
        clearErrorMessage={() => setHasLoadingError(false)}
        hasLoadingError={hasLoadingError}
        errorMessage={errorMessage}
      />
    </div>
  );
};
