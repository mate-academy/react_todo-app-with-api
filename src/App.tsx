import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from './api/todos';
import { Footer } from './components/Footer/Footer';
import { ErrorType } from './types/ErrorType';
import { SortType } from './types/SortType';
import { Header } from './components/Header';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { TodoList } from './components/TodoList';

const USER_ID = 11229;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [sort, setSort] = useState(SortType.ALL);
  const [error, setError] = useState(ErrorType.NONE);
  const [onChangeIds, setOnChangeIds] = useState<number[] | null>(null);

  useEffect(() => {
    setError(ErrorType.NONE);
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError(ErrorType.LOAD);
      });
  }, []);

  const preparedTodos = useMemo(() => {
    let sortedTodos = [];

    switch (sort) {
      case SortType.ALL:
        sortedTodos = [...todos];
        break;

      case SortType.ACTIVE:
        sortedTodos = todos.filter(todo => !todo.completed);
        break;

      case SortType.COMPLETED:
        sortedTodos = todos.filter(todo => todo.completed);
        break;

      default:
        throw new Error('Wrong sort type');
    }

    return sortedTodos;
  }, [todos, sort]);

  const addNewTodo = useCallback(async (
    title: string,
  ) => {
    const addedTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...addedTodo,
    });

    try {
      const todo = await addTodo(USER_ID, {
        ...addedTodo,
      });

      setTodos(prevTodos => [...prevTodos, todo]);
    } catch {
      setError(ErrorType.ADD);
    }
  }, []);

  const deleteCurrentTodo = useCallback(async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setError(ErrorType.DELETE);
    }
  }, []);

  const updateCurrentTodo = useCallback(async (
    todo: Todo,
    title: string,
    completed: boolean = todo.completed,
  ) => {
    const newTodo = {
      ...todo,
      title,
      completed,
    };

    try {
      const updatedTodo = await updateTodo(newTodo);

      setTodos(prevTodos => prevTodos.map(prevTodo => (
        prevTodo.id === todo.id
          ? updatedTodo
          : prevTodo
      )));
    } catch {
      setError(ErrorType.UPDATE);
    }
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          preparedTodos={preparedTodos}
          setError={setError}
          addNewTodo={addNewTodo}
          setTempTodo={setTempTodo}
          updateCurrentTodo={updateCurrentTodo}
          setOnChangeIds={setOnChangeIds}
        />

        <TodoList
          preparedTodos={preparedTodos}
          tempTodo={tempTodo}
          deleteCurrentTodo={deleteCurrentTodo}
          onChangeIds={onChangeIds}
          setOnChangeIds={setOnChangeIds}
          updateCurrentTodo={updateCurrentTodo}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            preparedTodos={preparedTodos}
            sort={sort}
            setSort={setSort}
            setOnChangeIds={setOnChangeIds}
            deleteTodo={deleteCurrentTodo}
          />
        )}
      </div>

      <ErrorMessage error={error} setError={setError} />
    </div>
  );
};
