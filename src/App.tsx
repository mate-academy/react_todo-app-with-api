/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getTodos, patchTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Errors } from './types/Errors';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [isError, setIsError] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>(Filter.ALL);
  const [typeError, setTypeError] = useState<string>('');
  const [newTitleTodo, setNewTitleTodo] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isDeletedComplete, setisDeletedComplete]
  = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    if (user) {
      try {
        const inData = await getTodos(user.id);

        setTodos(inData);
      } catch (inError) {
        setIsError(true);
        setTypeError(Errors.ErrGET);
      } finally {
        setIsAdding(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedFilter]);

  const updateTodo = async (id: number, data: Partial<Todo>) => {
    try {
      setisDeletedComplete(true);
      await patchTodo(id, data);
    } catch (inError) {
      setIsError(true);
      setTypeError(Errors.ErrUPD);
    }

    setisDeletedComplete(false);
    fetchData();
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          userId={user?.id || null}
          isAdding={isAdding}
          onSetNewTitleTodo={setNewTitleTodo}
          onSetIsError={setIsError}
          onSetTypeError={setTypeError}
          onSetIsAdding={setIsAdding}
          toUpdateTodo={updateTodo}
          toLoad={fetchData}
        />

        <TodoList
          todos={todos}
          selectedFilter={selectedFilter}
          newTitleTodo={newTitleTodo}
          userId={user?.id || null}
          isAdding={isAdding}
          isDeletedComplete={isDeletedComplete}
          onSetIsError={setIsError}
          onSetTypeError={setTypeError}
          toLoad={fetchData}
        />

        <Footer
          todos={todos}
          onSetFilterGlobal={setSelectedFilter}
          selectedFilter={selectedFilter}
          onSetIsError={setIsError}
          onSetTypeError={setTypeError}
          toLoad={fetchData}
          onSetisDeletedComplete={setisDeletedComplete}
        />
      </div>

      <ErrorNotification
        typeError={typeError}
        isError={isError}
        onSetIsError={setIsError}
      />
    </div>
  );
};
