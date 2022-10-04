import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  createTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from
  './components/Auth/ErrorNotification/ErrorNotification';
import { Footer } from './components/Auth/Footer/Footer';
import { Header } from './components/Auth/Header/Header';
import { TodoList } from './components/Auth/TodoList/TodoList';
import { ErrorMessage } from './types/Error';
import { FilterType } from './types/FilterBy';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  // const [toggle, setToggle] = useState(true);
  const user = useContext(AuthContext);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

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

  const getFilteredTodo = useMemo(() => todos.filter(todo => {
    switch (filterType) {
      case FilterType.Active:
        return !todo.completed;

      case FilterType.Completed:
        return todo.completed;
      default:
        return true;
    }
  }), [todos, filterType]);

  const newTodo = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !user) {
      setErrorMessage(ErrorMessage.ErrorTitle);

      return;
    }

    setIsAdding(true);

    try {
      const postTodo = await createTodo(title, user.id);

      setTodos([...todos, postTodo]);
    } catch {
      setErrorMessage(ErrorMessage.NotAdd);
    }

    setIsAdding(false);
    setTitle('');
  }, [title, user]);

  const removeTodo = useCallback(async (TodoId: number) => {
    setSelectedIds([TodoId]);
    try {
      await deleteTodo(TodoId);

      setTodos([...todos.filter(({ id }) => id !== TodoId)]);
    } catch {
      setErrorMessage(ErrorMessage.NotDelete);
    }
  }, [todos, errorMessage]);

  const completedTodos = todos.filter(({ completed }) => completed);

  const deleteCompletedTodos = useCallback(() => {
    setSelectedIds([...completedTodos].map(({ id }) => id));

    Promise.all(completedTodos.map(({ id }) => removeTodo(id)))
      .then(() => setTodos([...todos.filter(({ completed }) => !completed)]))
      .catch(() => {
        setErrorMessage(ErrorMessage.NotDelete);
        setSelectedIds([]);
      });
  }, [todos, selectedIds, errorMessage]);

  const toggleAll = todos.every(({ completed }) => completed);

  const handleOnChange = useCallback(
    async (updateId: number, data: Partial<Todo>) => {
      try {
        const changeStatus: Todo = await updateTodo(updateId, data);

        setTodos(todos.map(todo => (
          todo.id === updateId
            ? changeStatus
            : todo
        )));
      } catch {
        setErrorMessage(ErrorMessage.NotUpdate);
      }
    }, [todos],
  );

  const activeTodos = todos.filter(({ completed }) => !completed);

  const handleClickToggleAll = () => {
    if (activeTodos.length) {
      activeTodos.map(({ id }) => updateTodo(id,
        { completed: true }).catch(() => (
        setErrorMessage(ErrorMessage.NotUpdate))));
      setTodos(todos.map(todo => {
        const copy = todo;

        copy.completed = true;

        return copy;
      }));
    } else {
      todos.map(({ id }) => updateTodo(id,
        { completed: false }).catch(() => (
        setErrorMessage(ErrorMessage.NotUpdate))));
      setTodos(todos.map(todo => {
        const copy = todo;

        copy.completed = false;

        return copy;
      }));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodosField={newTodoField}
          setTitle={setTitle}
          title={title}
          handleSubmit={newTodo}
          isAdding={isAdding}
          toggleAll={toggleAll}
          handleToggleAll={handleClickToggleAll}
        />
        {
          (isAdding || todos.length > 0) && (
            <>
              <TodoList
                todos={getFilteredTodo}
                removeTodo={removeTodo}
                selectedIds={selectedIds}
                isAdding={isAdding}
                title={title}
                handleOnChange={handleOnChange}

              />
              <Footer
                filterTypes={setFilterType}
                filterType={filterType}
                todos={todos}
                deleteCompleted={deleteCompletedTodos}
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
