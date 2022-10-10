import {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { FilterStatus } from './types/FilterStatus';
import { Header } from './components/NewTodo';
import { Footer } from './components/TodoFilter/TodoFilter';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorMessage } from './types/ErrorMessage';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [
    filterStatus,
    setFilterStatus,
  ] = useState<FilterStatus>(FilterStatus.All);
  const [error, setError] = useState<string | null>(ErrorMessage.None);
  const [title, setTitle] = useState('');
  const [selectedTodo, setSelectedTodo] = useState<number[]>([]);
  const [isAdd, setIsAdd] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    const loadTodos = async (userId: number) => {
      try {
        const receivedTodos = await getTodos(userId);

        setTodos(receivedTodos);
      } catch {
        setError(ErrorMessage.UnableLoad);
      }
    };

    if (user) {
      loadTodos(user.id);
    }
  }, [user]);

  const activeTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filterStatus) {
        case FilterStatus.Active:
          return !todo.completed;
        case FilterStatus.Completed:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [todos, filterStatus]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(ErrorMessage.None);
    setIsAdd(true);

    if (user && title.trim() !== '') {
      await addTodo(user.id, title)
        .then(todo => {
          setTodos([...todos, todo]);
        })
        .catch(() => setError(ErrorMessage.UnableAdd))
        .finally(() => setIsAdd(false));
    }

    setError(ErrorMessage.TitleIsEmpty);
    setIsAdd(false);
    setTitle('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDelete = async (todoId: number) => {
    setSelectedTodo(prevId => [...prevId, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos
        .filter(todo => todo.id !== todoId));
    } catch {
      setError(ErrorMessage.UnableDelete);
    } finally {
      setSelectedTodo(prevId => prevId.filter(id => id !== todoId));
      setIsDelete(false);
    }
  };

  const removeCompletedTodos = async () => {
    setIsDelete(true);
    try {
      completedTodos.forEach(({ id }) => handleDelete(id));
    } catch {
      setError(ErrorMessage.UnableDelete);
    }
  };

  const isUpdateTodo = async (todo: Todo, updatedTitle?: string) => {
    const { id: todoId, title: todoTitle, completed } = todo;
    const currentTodo = todo;

    try {
      if (updatedTitle) {
        await updateTodo(todoId, updatedTitle, completed);
        currentTodo.title = updatedTitle;
      }

      await updateTodo(todoId, todoTitle, !completed);
      currentTodo.completed = !currentTodo.completed;

      setTodos([...todos]);
    } catch {
      setError(ErrorMessage.UnableUpdate);
    } finally {
      setIsUpdate(false);
    }
  };

  const toggleAllTodos = async () => {
    setIsUpdate(true);

    try {
      if (activeTodos.length > 0) {
        activeTodos.forEach(todo => isUpdateTodo(todo));
      } else {
        completedTodos.forEach(todo => isUpdateTodo(todo));
      }
    } catch {
      setError(ErrorMessage.UnableUpdate);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleSubmit={handleSubmit}
          newTodoField={newTodoField}
          title={title}
          handleChange={handleChange}
          isAdd={isAdd}
          toggleAllTodos={toggleAllTodos}
          activeTodos={activeTodos}
        />

        {todos && (
          <>
            <TodoList
              todos={filteredTodos}
              selectedTodo={selectedTodo}
              handleDelete={handleDelete}
              isAdd={isAdd}
              isDelete={isDelete}
              isUpdateTodo={isUpdateTodo}
              isUpdate={isUpdate}
            />

            <Footer
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              activeTodos={activeTodos}
              completedTodos={completedTodos}
              removeCompletedTodos={removeCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
