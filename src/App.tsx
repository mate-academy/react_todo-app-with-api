/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header/Header';
import { Error } from './components/Error/Error';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
import { User } from './types/User';
import {
  addTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { FilterType } from './types/Filter';
import { TodoList } from './components/TodoList/TodoList';

const getFilterTodos = (
  todos: Todo[],
  filterType: FilterType,
) => {
  const copy = [...todos];

  switch (filterType) {
    case FilterType.Active:
      return copy.filter(({ completed }) => !completed);
    case FilterType.Completed:
      return copy.filter(({ completed }) => completed);
    default:
      return copy;
  }
};

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext<User | null>(AuthContext);
  const userId = user?.id ? user.id : 0;
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [filterBy, setFilterBy] = useState(FilterType.All);
  const [selectedId, setSelectedId] = useState<number[]>([]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    const todoFromServer = async () => {
      try {
        const todosFromServer = await getTodos(userId);

        setTodos(todosFromServer);
      } catch (error) {
        setErrorMessage(`${error}`);
      } finally {
        setIsLoaded(false);
      }
    };

    todoFromServer();
  }, []);

  const createTodo = useCallback(async (event: FormEvent) => {
    event.preventDefault();

    if (!title || !user) {
      setErrorMessage('Please add valid title');

      return;
    }

    setIsLoaded(true);

    try {
      const newTodo = await addTodo(user.id, title);

      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
    }

    setIsLoaded(false);
    setTitle('');
  }, [user, title]);

  const removeTodo = useCallback(async (todoId: number) => {
    setSelectedId([todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    }
  }, []);

  const handleChange = useCallback(
    async (todoId: number, data: Partial<Todo>) => {
      try {
        const todoWithNewData = await updateTodo(todoId, data);

        setTodos(todos.map(todo => (
          todo.id === todoId
            ? todoWithNewData
            : todo
        )));
      } catch (error) {
        setErrorMessage('Unable to update a todo');
      }
    }, [todos],
  );

  const filteredTodos = getFilterTodos(todos, filterBy);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const activeTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  const handleClickToggleAll = () => {
    if (activeTodos.length) {
      activeTodos.map(({ id }) => updateTodo(id,
        { completed: true })
        .catch(() => (
          setErrorMessage('Unable to update a todo'))));
      setTodos(todos.map(todo => {
        const newItem = todo;

        newItem.completed = true;

        return newItem;
      }));
    } else {
      todos.map(({ id }) => updateTodo(id,
        { completed: false })
        .catch(() => (
          setErrorMessage('Unable to update a todo')
        )));

      setTodos(todos.map(todo => {
        const newItem = todo;

        newItem.completed = false;

        return newItem;
      }));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          todos={todos}
          newTodoField={newTodoField}
          createTodo={createTodo}
          title={title}
          setTitle={setTitle}
          handleChangeAll={handleClickToggleAll}
        />

        {todos
          && (
            <>
              <TodoList
                title={title}
                todos={filteredTodos}
                isLoaded={isLoaded}
                removeTodo={removeTodo}
                handleChange={handleChange}
                selectedId={selectedId}
              />

              <Footer
                getFilteredBy={setFilterBy}
                selectedButtonType={filterBy}
                setTodos={setTodos}
                todos={todos}
                setErrorMessage={setErrorMessage}
                completedTodos={completedTodos}
              />
            </>
          )}

        {errorMessage
          && (
            <Error
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          )}
      </div>
    </div>
  );
};
