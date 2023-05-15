import React, {
  useEffect,
  useMemo,
  useState,
  Suspense,
  useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';
import 'bulma/css/bulma.css';
import { Todo } from './types/Todo';
// eslint-disable-next-line object-curly-newline
import { addTodo, deleteTodo, getTodos, patchTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { USER_ID } from './constants/userid';
import { FILTERS } from './constants/filters';
import { ErrorMessage } from './components/ErrorMessage';
import { Footer } from './components/Footer';
import { FetchContext } from './context/FetchContext';
import { FooterContext } from './context/FooterContext';
import { Header } from './components/Header';
import { HeaderContext } from './context/HeaderContext';
import { LanguageSelection } from './components/LanguageSelection';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>('');
  const [toggleStatus, setToggleStatus] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDeletingCompleted, setIsDeletingCompleted] = useState(false);
  const [isUpdatingAllTodo, setIsUpdatingAllTodo] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FILTERS>(FILTERS.ALL);
  const { t } = useTranslation();

  useEffect(() => {
    setToggleStatus(todos.every(todo => todo.completed));
  }, [todos]);

  const calculateNotCompletedTodo = () => {
    return todos.filter(todo => !todo.completed).length;
  };

  const notCompletedTodoCount = useMemo(
    calculateNotCompletedTodo,
    [todos],
  );

  const isCompletedExist = todos.length !== notCompletedTodoCount;

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (activeFilter) {
        case FILTERS.ACTIVE:
          return !todo.completed;

        case FILTERS.COMPLETED:
          return todo.completed;

        case FILTERS.ALL:
        default:
          return true;
      }
    });
  }, [todos, activeFilter]);

  // #region Load function
  const loadTodos = async (): Promise<void> => {
    try {
      const todosFromserver = await getTodos(USER_ID);

      setTodos(todosFromserver);
    } catch (error) {
      setErrorMessage(t('Error.download'));
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);
  // #endregion

  // #region Upload function
  const uploadTodo = useCallback(async (
    addedTodo: Omit<Todo, 'id'>,
    temporaryTodo: Todo | null,
  ): Promise<void> => {
    try {
      setTempTodo(temporaryTodo);
      if (addedTodo) {
        const newTodo = await addTodo(addedTodo);

        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTempTodo(null);
      }
    } catch (error) {
      setErrorMessage(t('Error.add'));
    }
  }, []);
  // #endregion

  // #region Delete functions
  const deleteTodos = useCallback(async (id: number): Promise<void> => {
    try {
      await deleteTodo(id);

      setTodos(prevTodos => prevTodos.filter(
        (todo) => todo.id !== id,
      ));
    } catch (error) {
      setErrorMessage(t('Error.delete'));
    }
  }, []);

  const deleteCompletedTodos = useCallback(async (): Promise<void> => {
    setIsDeletingCompleted(true);
    try {
      const completedTodos = todos.filter(todo => todo.completed);

      await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));

      setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    } catch (error) {
      setErrorMessage(t('Error.delete'));
    } finally {
      setIsDeletingCompleted(false);
    }
  }, [todos]);
  // #endregion

  // #region Update functions
  const updateTodo = useCallback(async (
    id: number,
    data: Partial<Todo>,
  ): Promise<void> => {
    try {
      const updetedTodo = await patchTodo(id, data);

      setTodos(prevTodos => prevTodos.map(todo => (
        todo.id !== updetedTodo.id
          ? todo
          : updetedTodo
      )));
    } catch (error) {
      setErrorMessage(t('Error.update'));
    }
  }, []);

  const updateAllTodosComplete = useCallback(async (): Promise<void> => {
    setIsUpdatingAllTodo(true);
    try {
      await Promise.all(todos.map(todo => {
        const updatedTodo = {
          ...todo,
          completed: !toggleStatus,
        };

        return updateTodo(todo.id, updatedTodo);
      }));

      setTodos(prevTodos => prevTodos.map(todo => ({
        ...todo,
        completed: !toggleStatus,
      })));

      setToggleStatus(!toggleStatus);
    } catch (error) {
      setErrorMessage(t('Error.update'));
    } finally {
      setIsUpdatingAllTodo(false);
    }
  }, [todos, toggleStatus]);
  // #endregion

  const headerContextValue = useMemo(() => ({
    setErrorMessage,
    uploadTodo,
  }), [setErrorMessage, uploadTodo]);

  const fetchContextValue = useMemo(() => ({
    deleteTodos,
    updateTodo,
  }), [deleteTodos, updateTodo]);

  const footerContextValue = useMemo(() => ({
    notCompletedTodoCount,
    setActiveFilter,
    activeFilter,
    isCompletedExist,
    deleteCompletedTodos,
  }), [
    notCompletedTodoCount,
    activeFilter,
    isCompletedExist,
  ]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <LanguageSelection />

      <div className="todoapp__content">
        <HeaderContext.Provider value={headerContextValue}>
          <Header
            todos={todos}
            toggleStatus={toggleStatus}
            onUpdateAllTodosComplete={updateAllTodosComplete}
          />
        </HeaderContext.Provider>

        {visibleTodos && (
          <section className="todoapp__main">
            <FetchContext.Provider value={fetchContextValue}>
              <TodoList
                todos={visibleTodos}
                tempTodo={tempTodo}
                isDeletingCompleted={isDeletingCompleted}
                isUpdatingAllTodo={isUpdatingAllTodo}
                toggleStatus={toggleStatus}
              />
            </FetchContext.Provider>
          </section>
        )}

        {todos.length > 0 && (
          <FooterContext.Provider value={footerContextValue}>
            <Footer />
          </FooterContext.Provider>
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        onSetErrorMessage={setErrorMessage}
      />

    </div>
  );
};

export default function WrappedApp() {
  return (
    <Suspense fallback="...loading">
      <App />
    </Suspense>
  );
}
