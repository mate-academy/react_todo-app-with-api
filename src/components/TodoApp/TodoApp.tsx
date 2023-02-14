import {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { FilterType } from '../../types/filterType';
import { Errors } from '../../types/Errors';
import { Header } from '../Header';
import { TodoList } from '../TodoList';
import { Footer } from '../Footer';
import { ErrorNotification } from '../ErrorNotification';
import { useLoadingTodosFromServer } from '../../hooks/hooks';
import { TodosContext, TodosContextType } from '../Context/TodosContext';

export const TodoApp: FunctionComponent = () => {
  const { todos, setTodos } = useContext(TodosContext) as TodosContextType;

  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.All);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.None);
  const [title, setTitle] = useState<string>('');
  const [selectedTodosId, setSelectedTodosId] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const loadingTodosFromServer = useLoadingTodosFromServer(
    setTodos, setErrorMessage,
  );

  useEffect(() => {
    loadingTodosFromServer();
  }, []);

  return (
    <>
      <Header
        title={title}
        setTitle={setTitle}
        isAdding={isAdding}
        setIsAdding={setIsAdding}
        setErrorMessage={setErrorMessage}
        loadingTodosFromServer={loadingTodosFromServer}
        setSelectedTodosId={setSelectedTodosId}
      />

      {!!todos.length && (
        <>
          <TodoList
            title={title}
            filterBy={filterBy}
            selectedTodosId={selectedTodosId}
            isAdding={isAdding}
            setErrorMessage={setErrorMessage}
            setSelectedTodosId={setSelectedTodosId}
            loadingTodosFromServer={loadingTodosFromServer}
          />

          <Footer
            todos={todos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            setErrorMessage={setErrorMessage}
            setSelectedTodosId={setSelectedTodosId}
            loadingTodosFromServer={loadingTodosFromServer}
          />
        </>
      )}

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </>
  );
};
