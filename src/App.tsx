import React, {
  FormEvent,
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import { TextError } from './types/TextError';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { Filter } from './components/Filter/Filter';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { AuthContext } from './components/Auth/AuthContext';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [typeOfFilter, setTypeOfFilter] = useState(FilterType.All);
  const [error, setError] = useState<TextError | null>(null);
  const [title, setTitle] = useState('');
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [isToggling, setIsToggling] = useState(false);
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [isAdding, setIsAdding] = useState(false);

  const userId = user?.id || 0;

  const getTodoList = async () => {
    try {
      setTodos(await getTodos(userId));
    } catch {
      setError(TextError.Data);
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodoList();
  }, []);

  const filteredTodos = todos.filter(todo => {
    switch (typeOfFilter) {
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      default:
        return todo;
    }
  });

  const createTodo = useCallback(async (event: FormEvent) => {
    event.preventDefault();
    setIsAdding(true);

    if (title.trim().length === 0 || !user) {
      setError(TextError.Title);
      setIsToggling(false);

      return;
    }

    try {
      const newTodo = await addTodo(user.id, title);

      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch {
      setError(TextError.Add);
    }

    setTitle('');
    setIsAdding(false);
  }, [title, user]);

  const removeTodo = async (todoId: number) => {
    setSelectedTodoId(todoId);
    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos
        .filter(todo => todo.id !== todoId));
    } catch {
      setError(TextError.Delete);
    }

    setSelectedTodoId(0);
  };

  const changeProperty = async (todoId: number, property: Partial<Todo>) => {
    setSelectedTodoId(todoId);
    try {
      const changedTodo: Todo = await updateTodo(todoId, property);

      setTodos(prev => prev.map(todo => (
        todo.id === todoId
          ? changedTodo
          : todo
      )));
    } catch {
      setError(TextError.Update);
    }

    setSelectedTodoId(0);
    setIsToggling(false);
  };

  const completedTodoList = useMemo(() => todos
    .filter(todo => todo.completed), [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          createTodo={createTodo}
          title={title}
          setTitle={setTitle}
          todos={todos}
          changeProperty={changeProperty}
          setIsToggling={setIsToggling}

        />
        {(todos.length > 0) && (
          <TodoList
            todos={filteredTodos}
            removeTodo={removeTodo}
            changeProperty={changeProperty}
            selectedTodoId={selectedTodoId}
            isToggling={isToggling}
            title={title}
            isAdding={isAdding}

          />
        )}
        <Filter
          typeOfFilter={typeOfFilter}
          setTypeOfFilter={setTypeOfFilter}
          todos={todos}
          completedTodoList={completedTodoList}
          setError={setError}
          setTodos={setTodos}
        />
      </div>

      {error && (
        <ErrorNotification
          error={error}
          setError={setError}
        />
      )}
    </div>
  );
};
