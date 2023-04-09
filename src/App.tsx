import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Todo } from './types/Todo';
import {
  addTodos,
  deleteTodos,
  getTodos,
  updateTodos,
} from './api/todos';
import { Header } from './Components/Header';
import { TodoList } from './Components/Todolist';
import { Footer } from './Components/Footer';
import { Notification } from './Components/Notification';
import { Filters, StringValues } from './types/enums';
import { AppContext } from './AppContext';
import { LoginForm } from './Components/LoginForm';

const initialTempTodo = {
  id: 0,
  userId: 0,
  title: '',
  completed: false,
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(Filters.all);
  const [errorMessage, setErrorMessage] = useState('');
  const hasErrorFromServer = !!errorMessage;
  const [deletedId, setDeletedId] = useState(0);
  const [tempTodo, setTempTodo] = useState<Todo>(initialTempTodo);
  const [added, setAdded] = useState(false);
  const [updatedId, setUpdatedId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(0);

  const { user, setUser } = useContext(AppContext);

  const onLogout = () => {
    setUser(null);
    localStorage.setItem(StringValues.user, '0');
  };

  const userName = user ? user.name : 'No Name';

  const userId = user ? user.id : 0;

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      const { all, active, completed } = Filters;

      switch (selectedStatus) {
        case all:
          return true;
        case active:
          return !todo.completed;
        case completed:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [selectedStatus, todos]);

  const fetchTodos = async () => {
    try {
      const todosFromServer = await getTodos(userId);

      setTodos(todosFromServer);
    } catch {
      setErrorMessage('Unable to fetch a todo');
      setTodos([...todos]);
    }
  };

  const addTodo = async (title: string) => {
    setTempTodo((state) => ({
      ...state,
      title,
    }));
    setAdded(true);
    setSearchQuery('');
    try {
      const addedResultFromServer = await addTodos(userId, {
        title,
        userId,
        completed: false,
      });

      if (addedResultFromServer) {
        fetchTodos();
        setTempTodo((state) => ({
          ...state,
          title: '',
        }));
        setAdded(false);
      }
    } catch {
      setErrorMessage('Unable to add a todo');
      setAdded(false);
      setTodos([...todos]);
    }
  };

  const updateTodo = async (
    todoId: number,
    status: boolean | string,
    by: string,
  ) => {
    setEditingId(0);
    setUpdatedId(todoId);
    setIsLoading(true);

    const updateData = typeof status === 'boolean'
      ? { completed: !status }
      : { title: status };

    try {
      const addedResultFromServer = await updateTodos(todoId, updateData);

      if (addedResultFromServer) {
        setTodos((state) => {
          return state.map(todo => {
            if (by !== 'title' && todo.id === todoId) {
              return {
                ...todo,
                completed: !todo.completed,
              };
            }

            return todo;
          });
        });
        fetchTodos();
      }
    } catch (e) {
      setErrorMessage('Unable to update a todo');
    }

    setUpdatedId(0);
    setIsLoading(false);
  };

  const onEmpty = () => {
    setErrorMessage('Title can\'t be empty');
  };

  const todoDelete = async (todoId: number) => {
    setDeletedId(todoId);
    setIsLoading(true);
    try {
      const deleteResultFromServer = await deleteTodos(todoId);

      if (deleteResultFromServer) {
        setTodos((state) => state.filter(todo => todo.id !== todoId));
        fetchTodos();
      }
    } catch {
      setErrorMessage('Unable to delete a todo');
    }

    setDeletedId(0);
    setEditingId(0);
    setIsLoading(false);
  };

  const completeAllToggle = async () => {
    setUpdatedId(2.0);
    const allToggle = todos.filter(todo => !todo.completed).length !== 0;

    try {
      const changedElements = await Promise.all(
        todos.map(todo => updateTodos(todo.id, { completed: allToggle })),
      );

      if (changedElements) {
        setTodos((state) => {
          return state.map(todo => {
            return {
              ...todo,
              completed: allToggle,
            };
          });
        });
        fetchTodos();
      }
    } catch {
      setErrorMessage('Unable to update a todo');
    }

    setUpdatedId(0);
  };

  const clearAllCompleted = async () => {
    setUpdatedId(1.0);

    const allCompleted = todos.filter(todo => todo.completed);

    try {
      const changedElements = await Promise.all(
        allCompleted.map(todo => deleteTodos(todo.id)),
      );

      if (changedElements) {
        setTodos((state) => state.filter(todo => !todo.completed));
        fetchTodos();
      }
    } catch {
      setErrorMessage('Unable to delete a todo');
    }

    setUpdatedId(0);
  };

  const clearNotification = () => {
    setErrorMessage('');
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (!userId) {
    return <LoginForm />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="my-5">
        <p
          style={{ display: 'inline' }}
        >
          {`Hi, Welcome ${userName}`}
        </p>
        <button
          type="button"
          className="button"
          style={{ float: 'right' }}
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
      <div className="todoapp__content">
        <Header
          todos={todos}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          addTodo={addTodo}
          onEmpty={onEmpty}
          addDisabled={added}
          completeAllToggle={completeAllToggle}
        />
        <TodoList
          todosToShow={filteredTodos}
          todoDelete={todoDelete}
          deletedId={deletedId}
          tempTodo={tempTodo}
          added={added}
          updateTodo={updateTodo}
          updatedId={updatedId}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          editingId={editingId}
          setEditingId={setEditingId}
        />
        {todos.length > 0 && (
          <Footer
            todos={todos}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            clearAllCompleted={clearAllCompleted}
          />
        )}
      </div>
      <Notification
        hasErrorFromServer={hasErrorFromServer}
        clearNotification={clearNotification}
        errorMessage={errorMessage}
      />
    </div>
  );
};
