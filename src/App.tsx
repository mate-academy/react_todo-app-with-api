import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { ErrorMessage } from './types/Error';

export const App: React.FC = () => {
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [fileterType, setFilterType] = React.useState(FilterType.All);
  const [title, setTitle] = React.useState('');
  const [selectedId, setSelectedId] = React.useState<number[]>([]);
  const [isAdding, setisAdding] = React.useState(false);
  const user = React.useContext(AuthContext);

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

  const newTodo = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    if (!title || !user) {
      setErrorMessage(ErrorMessage.ErrorTitle);

      return;
    }

    setisAdding(true);

    try {
      const postTodo = await addTodo(title, user.id);

      setTodos([...todos, postTodo]);
    } catch {
      setErrorMessage(ErrorMessage.NotAdd);
    }

    setisAdding(false);
    setTitle('');
  }, [title, user]);

  const removeTodo = useCallback(async (TodoId: number) => {
    setSelectedId([TodoId]);
    try {
      await deleteTodo(TodoId);

      setTodos([...todos.filter(({ id }) => id !== TodoId)]);
    } catch {
      setErrorMessage(ErrorMessage.NotDelete);
    }
  }, [todos, errorMessage]);

  const completedTodos = useMemo(() => todos
    .filter(({ completed }) => completed), [todos]);

  const deleteCompletedTodos = useCallback(() => {
    setSelectedId([...completedTodos].map(({ id }) => id));

    Promise.all(completedTodos.map(({ id }) => removeTodo(id)))
      .then(() => setTodos([...todos.filter(({ completed }) => !completed)]))
      .catch(() => {
        setErrorMessage(ErrorMessage.NotDelete);
        setSelectedId([]);
      });
  }, [todos, selectedId, errorMessage]);

  const handleChange = async (todoId: number, data: Partial<Todo>) => {
    setSelectedId([todoId]);

    try {
      const updateStatus: Todo = await updateTodo(todoId, data);

      setTodos(todos.map(todo => (
        todo.id === todoId
          ? updateStatus
          : todo
      )));
    } catch {
      setErrorMessage(ErrorMessage.NotUpdate);
    }

    setSelectedId([]);
  };

  const handleAllCompleted = () => {
    const isAllCompleted = todos.every(({ completed }) => completed);

    Promise.all(todos.map(({ id }) => handleChange(id, {
      completed: !isAllCompleted,
    })))
      .then(() => setTodos(todos.map(todo => ({
        ...todo,
        completed: !isAllCompleted,
      }))))
      .catch(() => {
        setErrorMessage(ErrorMessage.NotUpdate);
        setSelectedId([]);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          setTitle={setTitle}
          title={title}
          handleAddTodo={newTodo}
          handleAllCompleted={handleAllCompleted}
        />
        {(todos.length > 0 || isAdding) && (
          <>
            <TodoList
              todos={filteredTodos}
              removeTodo={removeTodo}
              selectedId={selectedId}
              isAdding={isAdding}
              title={title}
              handleChange={handleChange}
            />
            <Footer
              filterType={fileterType}
              filterTypes={setFilterType}
              todos={todos}
              deleteCompleted={deleteCompletedTodos}
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
