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
import { TitleError } from './components/TitleError';

export const App: React.FC = () => {
  const [hasLoadingError, setHasLoadingError] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filterBy, setFilterBy] = useState(Filter.ALL);
  const [titleError, setTitleError] = useState(false);
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
        setErrorMessage('Error... Can not load your todos');
      }
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const completedTodos = todos.filter(todo => todo.completed === true);
  const activeTodos = todos.filter(todo => todo.completed === false);

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

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {errorMessage
        ? (
          <Error
            clearErrorMessage={() => setHasLoadingError(false)}
            hasLoadingError={hasLoadingError}
            errorMessage={errorMessage}
          />
        )
        : (
          <div className="todoapp__content">
            <Header
              user={user}
              titleToAdd={title}
              changeTitle={(value) => setTitle(value)}
              onSetTodo={(newTodo) => setTodos(
                (prevTodos) => [...prevTodos, newTodo],
              )}
              onSetTitleError={(isError) => setTitleError(isError)}
              onSetIsAdding={(isLoading) => setIsAdding(isLoading)}
              isAdding={isAdding}
              completedTodos={completedTodos}
              activeTodos={activeTodos}
              todos={todos}
              loadTodos={getTodosFromServer}
              addTodoToLoadingList={(idToAdd) => setLoadingList(
                prevIds => [...prevIds, idToAdd],
              )}
              clearLoadingList={() => setLoadingList([])}
            />

            <TodoList
              visibleTodos={visibleTodos}
              loadTodos={getTodosFromServer}
              isAdding={isAdding}
              title={title}
              user={user}
              addTodoToLoadingList={(idToAdd) => setLoadingList(
                prevIds => [...prevIds, idToAdd],
              )}
              deleteTodoOfLoadingList={(idToRemove) => setLoadingList(
                prevIds => prevIds.filter(id => id !== idToRemove),
              )}
              loadingList={loadingList}
            />

            <Footer
              activeTodos={activeTodos}
              filterBy={filterBy}
              selectFilterField={(filter) => setFilterBy(filter)}
              completedTodos={completedTodos}
              addTodoToLoadingList={(idToRemove) => setLoadingList(
                prevIds => [...prevIds, idToRemove],
              )}
              clearLoadingList={() => setLoadingList([])}
              loadTodos={getTodosFromServer}
            />
          </div>
        )}

      <TitleError
        titleError={titleError}
        onSetTitleError={(isError) => setTitleError(isError)}
      />
    </div>
  );
};
