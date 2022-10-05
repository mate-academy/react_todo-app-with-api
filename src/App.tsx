/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  // useContext,
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
} from 'react';
// eslint-disable-next-line
import { ErrorNotification, TextError } from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
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
  const [typeOfFilter, setTypeOfFilter] = useState('all');
  const [error, setError] = useState<TextError | null>(null);
  const [title, setTitle] = useState('');
  const [selectedTodoId, setSelectedTodoId] = useState(0);
  const [isToggling, setIsToggling] = useState(false);
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const userId = user?.id || 0;

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodos(userId)
      .then(setTodos)
      .catch(() => setError(TextError.Data));
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

    if (title.trim().length === 0 || !user) {
      setError(TextError.Title);

      return;
    }

    try {
      const newTodo = await addTodo(user.id, title);

      setSelectedTodoId(newTodo.id);

      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch {
      setError(TextError.Add);
    }

    setTitle('');
    setSelectedTodoId(0);
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

  const completedTodoList = todos.filter(todo => todo.completed);

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
          />
        )}
        <Footer
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
