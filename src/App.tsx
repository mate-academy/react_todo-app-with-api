import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getTodos, updateTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from
  './components/ErrorNotification/ErrorNotification';
import { getFilteredTodo } from './components/FilteredTodos/getFilteredTodo';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { FilterType } from './types/FilterType';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [toggle, setToggle] = useState<boolean>(true);
  const user = useContext(AuthContext);

  useEffect(() => {
    const getTodosFromServer = async (userId: number) => {
      try {
        const receivedTodos = await getTodos(userId);

        setTodos(receivedTodos);
      } catch (error) {
        setErrorMessage(`${error}`);
      }
    };

    if (!user) {
      return;
    }

    getTodosFromServer(user.id);
  }, []);

  const filterTodoBy = useMemo(
    () => getFilteredTodo(filterType, todos),
    [todos, filterType],
  );

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const handleOnChange = useCallback(
    async (updateId: number, data: Partial<Todo>) => {
      setSelectedIds([updateId]);

      try {
        const changeStatus: Todo = await updateTodo(updateId, data);

        setTodos(prevTodos => prevTodos.map(todo => (
          todo.id === updateId
            ? changeStatus
            : todo
        )));
      } catch {
        setErrorMessage('Unable to update a todo');
      }

      setSelectedIds([]);
    }, [todos],
  );

  const handleClickToggleAll = async () => {
    if (completedTodos.length === todos.length) {
      setSelectedIds(todos.map(todo => todo.id));
    } else {
      setSelectedIds(todos.filter(todo => !todo.completed)
        .map(todo => todo.id));
    }

    try {
      const newTodos = await Promise.all(todos.map(todo => (
        todo.completed !== toggle
          ? updateTodo(todo.id, { completed: toggle })
          : todo
      )));

      setTodos(newTodos);
    } catch {
      setErrorMessage('Unable to update a todo');
    }

    setToggle(!toggle);
    setSelectedIds([]);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setTitle={setTitle}
          title={title}
          isAdding={isAdding}
          todos={todos}
          handleToggleAll={handleClickToggleAll}
          setIsAdding={setIsAdding}
          setErrorMessage={setErrorMessage}
          setTodos={setTodos}
          user={user}
        />
        {
          (isAdding || todos.length > 0) && (
            <>
              <TodoList
                todos={filterTodoBy}
                selectedIds={selectedIds}
                isAdding={isAdding}
                title={title}
                handleOnChange={handleOnChange}
                setErrorMessage={setErrorMessage}
                setSelectedIds={setSelectedIds}
                setTodos={setTodos}
                errorMessage={errorMessage}
              />
              <Footer
                filterTypes={setFilterType}
                filterType={filterType}
                todos={todos}
                completedTodos={completedTodos}
                setTodos={setTodos}
                setErrorMessage={setErrorMessage}
                errorMessage={errorMessage}
                setSelectedIds={setSelectedIds}
                selectedIds={selectedIds}
              />
            </>
          )
        }

      </div>
      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}

    </div>
  );
};
