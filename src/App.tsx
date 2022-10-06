/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { LoadingError } from './components/LoadingError/LoadingError';
import { Todo } from './types/Todo';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { TodoList } from './components/TodoList/TodoList';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterTodo, setFilterTodo] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [selectedTodoId, setSelectedTodoId] = useState(0);
  const [isToggle, setIsToggle] = useState(false);

  const userId = user?.id || 0;

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (!user) {
      return;
    }

    getTodos(userId)
      .then(setTodos)
      .catch(() => setError('Unable to load data'));
  }, []);

  const filterTodos = todos.filter(item => {
    if (filterTodo === 'active') {
      return !item.completed;
    }

    if (filterTodo === 'completed') {
      return item.completed;
    }

    return item;
  });

  const createTodo = useCallback(async (event: FormEvent) => {
    event.preventDefault();

    if (title.trim().length === 0 || !user) {
      setError('Please add valid title');

      return;
    }

    try {
      const newTodo = await addTodo(user.id, title);

      setSelectedTodoId(newTodo.id);

      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch {
      setError('Unable to add a todo');
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
      setError('Unable to delete a todo');
    }

    setSelectedTodoId(0);
  };

  const updateState = async (todoId: number, property: Partial<Todo>) => {
    setSelectedTodoId(todoId);
    try {
      const changedTodo: Todo = await updateTodo(todoId, property);

      setTodos(todos.map(todo => (
        todo.id === todoId
          ? changedTodo
          : todo
      )));
    } catch {
      setError('Unable to update a todo');
    }

    setSelectedTodoId(0);
    setIsToggle(false);
  };

  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          newTodoField={newTodoField}
          createTodo={createTodo}
          title={title}
          setTitle={setTitle}
          todos={todos}
          updateState={updateState}
          setIsToggle={setIsToggle}
        />

        {(todos.length > 0) && (
          <TodoList
            todos={filterTodos}
            removeTodo={removeTodo}
            updateState={updateState}
            selectedTodoId={selectedTodoId}
            isToggle={isToggle}
          />
        )}

        <TodoFooter
          setError={setError}
          setTodos={setTodos}
          todos={todos}
          filterTodos={filterTodos}
          filterTodo={filterTodo}
          setFilterTodo={setFilterTodo}
          completedTodos={completedTodos}
        />
      </div>

      {error && (
        <LoadingError
          error={error}
          setError={setError}
        />
      )}
    </div>
  );
};
