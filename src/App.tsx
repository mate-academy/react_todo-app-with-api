import React, {
  useCallback,
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

export function filterTodos(todos: Todo[], value: FilterValues) {
  const { Active, Completed } = FilterValues;
  const filteredTodos = [...todos];

  switch (value) {
    case Active:

      return filteredTodos.filter(todo => !todo.completed);

    case Completed:

      return filteredTodos.filter(todo => todo.completed);
    default:

      return filteredTodos;
  }
}

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterValue, setFilterValue] = useState(FilterValues.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tooggleIds, seTooggleIds] = useState<number[]>([]);
  const [error, setError] = useState({
    isError: false,
    message: ErrorMessages.None,
  });

  const handleError = useCallback(
    (isError: boolean, message: ErrorMessages) => {
      setError({ isError, message });

      if (message) {
        setTimeout(() => {
          setError({ isError: false, message: ErrorMessages.None });
        }, 3000);
      }
    }, [],
  );

  const loadTodos = useCallback(async () => {
    try {
      const getTodos
        = await client.get<Todo[]>(`/todos?userId=${user?.id}`);

      setTodos(getTodos);
    } catch (e) {
      handleError(true, ErrorMessages.ErrorLoadTodos);
    }
  }, []);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadTodos();
  }, []);

  const countActive = useMemo(() => {
    return (todos.filter(todo => !todo.completed)).length;
  }, [todos]);

  const visibleTodos = useMemo(
    () => filterTodos(todos, filterValue),
    [todos, filterValue],
  );

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
    } catch (e) {
      handleError(true, ErrorMessages.ErrorAddTodo);
    }

    setTempTodo(null);
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
            filterTodos={setFilterValue}
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
