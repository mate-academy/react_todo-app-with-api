import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { FilterType } from './types/Filter';
import {
  getTodos,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { ErrorMessage } from './types/Error';

export const App: React.FC = () => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [fileterType, setFilterType] = useState(FilterType.All);
  const [title, setTitle] = useState('');
  const [selectedId, setSelectedId] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [selectedTodo, setSelectedTodo] = useState(0);
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

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (fileterType) {
        case FilterType.Active:
          return !todo.completed;
        case FilterType.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, fileterType]);

  const removeTodo = useCallback(async (TodoId: number) => {
    setSelectedId([TodoId]);
    try {
      await deleteTodo(TodoId);

      setTodos((prevTodos) => prevTodos.filter(({ id }) => id !== TodoId));
    } catch {
      setErrorMessage(ErrorMessage.NotDelete);
    }
  }, [todos, errorMessage]);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const handleChange = useCallback(
    async (updateId: number, data: Partial<Todo>) => {
      setSelectedId([updateId]);

      try {
        const changeStatus: Todo = await updateTodo(updateId, data);

        setTodos(prevTodos => prevTodos.map(todo => (
          todo.id === updateId
            ? changeStatus
            : todo
        )));
      } catch {
        setErrorMessage(ErrorMessage.NotUpdate);
      }

      setSelectedId([]);
    }, [todos],
  );

  const handleAllCompleted = async () => {
    if (completedTodos.length === todos.length) {
      setSelectedId(todos.map(todo => todo.id));
    } else {
      setSelectedId(todos.filter(todo => !todo.completed)
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
      setErrorMessage(ErrorMessage.NotUpdate);
    }

    setToggle(!toggle);
    setSelectedId([]);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          setTitle={setTitle}
          title={title}
          setIsAdding={setIsAdding}
          handleAllCompleted={handleAllCompleted}
          todos={todos}
          isAdding={isAdding}
          user={user}
          setErrorMessage={setErrorMessage}
          setTodos={setTodos}
        />
        {(isAdding || todos.length > 0) && (
          <>
            <TodoList
              todos={filteredTodos}
              removeTodo={removeTodo}
              selectedId={selectedId}
              isAdding={isAdding}
              title={title}
              handleChange={handleChange}
              selectedTodo={selectedTodo}
              setSelectedTodo={setSelectedTodo}
            />
            <Footer
              filterType={fileterType}
              filterTypes={setFilterType}
              todos={todos}
              completedTodos={completedTodos}
              setTodos={setTodos}
              setErrorMessage={setErrorMessage}
              errorMessage={errorMessage}
              setSelectedId={setSelectedId}
              selectedId={selectedId}
            />
          </>
        )}
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
