/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updatingTodoCompleted,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { Todo } from './types/Todo';
import { Loader } from './components/Loader/Loader';
import { FilterType } from './components/Filter/FilterPropTypes';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [visibleTodos, setVisibleTodos] = useState(todos);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodoId, setloadingTodoId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [countOfItemsLeft, setCountOfItemsLeft] = useState(0);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [isAllSelected, setIsAllSelected] = useState(false);

  // Geting ↓

  const getTodosFromServer = async () => {
    setIsLoading(true);
    try {
      if (user?.id) {
        const todosFromServer = await getTodos(user?.id);

        setVisibleTodos(todosFromServer);
        setTodos(todosFromServer);
      }
    } catch {
      setErrorMessage('upload todos');
    } finally {
      setIsLoading(false);
    }
  };

  // Deleting ↓

  const deleteInLocalTodos = (id: number) => {
    const filteredTodos = todos.filter(todo => todo.id !== id);

    setVisibleTodos(filteredTodos);
    setTodos(filteredTodos);
  };

  const onDeleteTodo = async (id: number) => {
    setloadingTodoId(id);
    try {
      await deleteTodo(id);
      deleteInLocalTodos(id);
    } catch {
      setErrorMessage('delete a todo');
    } finally {
      setloadingTodoId(null);
    }
  };

  const clearCompleted = () => {
    const filteredTodos = todos.filter((todo) => {
      const { completed, id } = todo;

      if (completed) {
        deleteTodo(id);
      }

      return !completed;
    });

    setTodos(filteredTodos);
    setVisibleTodos(filteredTodos);
  };

  // Adding ↓

  const addToLocalTodos = (newTodo: Todo) => {
    setVisibleTodos([...todos, newTodo]);
    setTodos([...todos, newTodo]);
  };

  const addTodo = async (title: string) => {
    setIsAdding(true);
    setloadingTodoId(0);
    try {
      const newTodo: Todo = await createTodo(user?.id, title.trim());

      addToLocalTodos(newTodo);
    } catch {
      setErrorMessage('add a todo');
    } finally {
      setIsAdding(false);
      setloadingTodoId(null);
    }
  };

  // Updating ↓

  const toggleStatus = (todoId: number, comleted: boolean) => {
    const index = visibleTodos.findIndex(todo => todo.id === todoId);

    setVisibleTodos((prevVisibleTodos) => {
      const todosCopy = [...prevVisibleTodos];

      todosCopy[index].completed = !comleted;

      return todosCopy;
    });
  };

  const selectAllTodos = () => {
    const selectedTodos = visibleTodos.map((todo) => {
      const { completed, id } = todo;

      if (isAllSelected) {
        return { ...todo, completed: false };
      }

      if (completed) {
        return todo;
      }

      updatingTodoCompleted(id, true);

      return { ...todo, completed: true };
    });

    setVisibleTodos(selectedTodos);
  };

  const changeTitle = (todoId: number, newTitle: string) => {
    const index = visibleTodos.findIndex(todo => todo.id === todoId);

    setVisibleTodos((prevVisibleTodos) => {
      const todosCopy = [...prevVisibleTodos];

      todosCopy[index].title = newTitle;

      return todosCopy;
    });
  };

  // Hooks ↓

  useEffect(() => {
    const countofLeftItems = visibleTodos
      .filter(({ completed }) => !completed).length;
    const isAllSelectedNow = !countofLeftItems;

    setIsAllSelected(isAllSelectedNow);
    setCountOfItemsLeft(countofLeftItems);
  }, [visibleTodos]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosFromServer();
  }, []);

  useEffect(() => {
    const filteredTodos = todos.filter(todo => {
      switch (filterType) {
        case FilterType.All:
          return true;
        case FilterType.Active:
          return !todo.completed;
        case FilterType.Completed:
          return todo.completed;
        default:
          return true;
      }
    });

    setVisibleTodos(filteredTodos);
  }, [filterType]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          addTodo={addTodo}
          isAdding={isAdding}
          setErrorMessage={setErrorMessage}
          selectAllTodos={selectAllTodos}
          isAllSelected={isAllSelected}
        />
        {isLoading
          ? (<Loader />)
          : (
            <TodoList
              todos={visibleTodos}
              onDeleteTodo={onDeleteTodo}
              loadingTodoId={loadingTodoId}
              toggleStatus={toggleStatus}
              setloadingTodoId={setloadingTodoId}
              setErrorMessage={setErrorMessage}
              changeTitle={changeTitle}
            />
          )}
        <Footer
          setFilterType={setFilterType}
          filterType={filterType}
          clearCompleted={clearCompleted}
          countOfItemsLeft={countOfItemsLeft}
          todosLength={todos.length}
        />
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
