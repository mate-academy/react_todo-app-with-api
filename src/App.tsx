import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer/Footer';
import { FilterValues } from './types/FilterValues';
import { Errors } from './components/Errors';
import { ErrorMessages } from './types/Error';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);
  const [filterValue, setFilterValue] = useState(FilterValues.All);
  const [countActive, setCountActive] = useState(0);
  const [tempTodo, setTempTodo] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [tooggleIds, seTooggleIds] = useState<number[]>([]);
  const [error, setError] = useState({
    isError: false,
    message: ErrorMessages.None,
  });

  const handleError = (isError: boolean, message: ErrorMessages) => {
    setError({ isError, message });

    if (message) {
      setTimeout(() => {
        setError({ isError: false, message: ErrorMessages.None });
      }, 3000);
    }
  };

  async function loadTodos() {
    try {
      const getTodos
        = await client.get<Todo[]>(`/todos?userId=${user?.id}`);

      setTodos(getTodos);
      setVisibleTodos(getTodos);
      setCountActive(
        (getTodos.filter(todo => !todo.completed)).length,
      );
    } catch (e) {
      handleError(true, ErrorMessages.ErrorLoadTodos);
    }
  }

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadTodos();
  }, []);

  const countActiveTodos = () => {
    const count = todos.filter(todo => !todo.completed).length;

    setCountActive(count);
  };

  useMemo(() => countActiveTodos(), [todos]);

  const filterTodos = (value: string) => {
    const { All, Active, Completed } = FilterValues;

    switch (value) {
      case All:
        setFilterValue(All);
        setVisibleTodos(todos);
        break;
      case Active:
        setFilterValue(Active);
        setVisibleTodos(todos.filter(todo => !todo.completed));
        break;
      case Completed:
        setFilterValue(Completed);
        setVisibleTodos(todos.filter(todo => todo.completed));
        break;
      default:
        break;
    }
  };

  useMemo(() => filterTodos(filterValue), [todos]);

  const addTodo = async (value: string) => {
    if (!user) {
      return;
    }

    const data = {
      userId: user.id,
      title: value,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...data,
    });

    try {
      const todoData = await client.post<Todo>('/todos', data);

      setTodos(state => (
        [
          ...state,
          todoData,
        ]
      ));
      setCountActive(countActive + 1);
    } catch (e) {
      handleError(true, ErrorMessages.ErrorAddTodo);
    }

    setTempTodo({});
  };

  const deleteTodo = async (id: number) => {
    setIsDeleting(true);
    try {
      await client.delete(`/todos/${id}`);

      setTodos(state => (
        state.filter(todo => todo.id !== id)
      ));
    } catch (e) {
      handleError(true, ErrorMessages.ErrorRemove);
    }

    setIsDeleting(false);
  };

  const clearCompleted = async () => {
    const removeTodos = todos.filter(todo => todo.completed);

    if (removeTodos.length === 0) {
      return;
    }

    await Promise.all(removeTodos.map(todo => {
      seTooggleIds(removeTodos.map(toDo => toDo.id));

      return deleteTodo(todo.id);
    }));

    seTooggleIds([]);
  };

  const changeStatusTodo = async (id: number) => {
    const updateTodo = todos.find(todo => todo.id === id);

    if (!updateTodo) {
      return;
    }

    const data = { completed: !updateTodo.completed };

    try {
      await client.patch(`/todos/${id}`, data);

      setTodos(state => (
        state.map(todo => {
          if (todo.id === id) {
            return {
              ...todo,
              completed: !todo.completed,
            };
          }

          return todo;
        })
      ));
    } catch (e) {
      handleError(true, ErrorMessages.ErrorUpdate);
    }
  };

  const toggleAllTodos = async () => {
    await Promise.all(todos.map(todo => {
      if (countActive === 0) {
        seTooggleIds(todos.map(toDo => toDo.id));

        return changeStatusTodo(todo.id);
      }

      if (!todo.completed) {
        seTooggleIds(state => (
          [
            ...state,
            todo.id,
          ]
        ));

        return changeStatusTodo(todo.id);
      }

      return todo;
    }));
    seTooggleIds([]);
  };

  const updateTitle = async (newTitle: string, id: number) => {
    const updateTodo = todos.find(todo => todo.id === id);

    if (!updateTodo) {
      return;
    }

    if (!newTitle) {
      await deleteTodo(id);

      return;
    }

    const data = { title: newTitle };

    try {
      await client.patch(`/todos/${id}`, data);

      setTodos(state => (
        state.map(todo => {
          if (todo.id === id) {
            return {
              ...todo,
              title: newTitle,
            };
          }

          return todo;
        })
      ));
    } catch (e) {
      handleError(true, ErrorMessages.ErrorUpdate);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          newTodoField={newTodoField}
          addTodo={addTodo}
          handleError={handleError}
          countActive={countActive}
          toggleAllTodos={toggleAllTodos}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          deleteTodo={deleteTodo}
          isDeleting={isDeleting}
          changeStatusTodo={changeStatusTodo}
          tooggleIds={tooggleIds}
          updateTitle={updateTitle}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            filterTodos={filterTodos}
            countActive={countActive}
            filterValue={filterValue}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <Errors
        error={error}
        handleError={handleError}
      />
    </div>
  );
};
