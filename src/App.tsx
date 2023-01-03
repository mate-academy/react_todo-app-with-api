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
  // const [isError, setIsError] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.ALL);
  const [typeError, setTypeError] = useState<Errors>(Errors.ErrNone);
  const [newTitleTodo, setNewTitleTodo] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setisDeleting]
  = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    if (user) {
      try {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      } catch (inError) {
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
      setisDeleting(true);
      await patchTodo(id, data);
    } catch (inError) {
      setTypeError(Errors.ErrUPD);
    }

    setisDeleting(false);
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
          isDeleting={isDeleting}
          onSetTypeError={setTypeError}
          toLoad={fetchData}
        />

        { todos.length > 0 && (
          <Footer
            todos={todos}
            onSetFilterGlobal={setSelectedFilter}
            selectedFilter={selectedFilter}
            onSetTypeError={setTypeError}
            toLoad={fetchData}
            onSetisDeleting={setisDeleting}
          />
        )}

      </div>

      <ErrorNotification
        typeError={typeError}
        onSetTypeError={setTypeError}
      />
    </div>
  );
};
