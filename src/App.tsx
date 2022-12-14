import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  getTodos,
  addTodo,
  removeTodo,
  patchTodo,
} from './api/todos';

import { Header } from './components/Header/Header';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList/TodoList';
import { Error } from './components/Error/Error';
import { ErrorContext } from './components/Error/ErrorContext';
import { Footer } from './components/Footer/Footer';

import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { Errors } from './types/Errors';

export const App: React.FC = () => {
  const {
    Load,
    Add,
    Delete,
    Update,
  } = Errors;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [title, setTitle] = useState('');

  const user = useContext(AuthContext);
  const {
    setHasError,
    setCurrentError,
    setIsAdding,
    setSelectedTodoIds,
  } = useContext(ErrorContext);

  const loadUserTodos = useCallback(async () => {
    if (user) {
      try {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      } catch (error) {
        setHasError(true);
        setCurrentError(Load);
      }
    }
  }, []);

  useEffect(() => {
    loadUserTodos();
  }, []);

  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed)
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

  const todoToToggle = completedTodos.length !== todos.length
    ? activeTodos
    : todos;

  const addNewTodo = useCallback(async (todoData: Omit<Todo, 'id'>) => {
    try {
      setHasError(false);
      setIsAdding(true);

      const todo = await addTodo(todoData);

      setTitle('');

      setTodos(prevTodos => [...prevTodos, todo]);

      setIsAdding(false);
    } catch (error) {
      setHasError(true);
      setCurrentError(Add);
    }
  }, []);

  const deleteTodo = useCallback(async (todoId: number) => {
    try {
      setHasError(false);
      setSelectedTodoIds(prevIds => [...prevIds, todoId]);

      await removeTodo(todoId);

      await loadUserTodos();

      setSelectedTodoIds([0]);
    } catch (error) {
      setHasError(true);
      setCurrentError(Delete);
    }
  }, []);

  const clearCompleted = useCallback(async () => {
    await Promise.all(completedTodos
      .map((todo) => deleteTodo(todo.id)));
  }, [completedTodos]);

  const updateStatus = useCallback(async (todo: Todo) => {
    try {
      setHasError(false);
      setSelectedTodoIds(prevIds => [...prevIds, todo.id]);

      const updatedTodo = {
        ...todo,
        completed: !todo.completed,
      };

      await patchTodo(todo.id, updatedTodo);

      await loadUserTodos();

      setSelectedTodoIds([0]);
    } catch (error) {
      setHasError(true);
      setCurrentError(Update);
    }
  }, []);

  const toggleAll = useCallback(async () => {
    await Promise.all(todoToToggle
      .map((todo) => updateStatus(todo)));
  }, [todoToToggle]);

  const updateTitle = useCallback(async (todo: Todo, newTitle: string) => {
    try {
      setHasError(false);
      setSelectedTodoIds(prevIds => [...prevIds, todo.id]);

      const updatedTodo = {
        ...todo,
        title: newTitle,
      };

      await patchTodo(todo.id, updatedTodo);

      await loadUserTodos();

      setSelectedTodoIds([0]);
    } catch (error) {
      setHasError(true);
      setCurrentError(Update);
    }
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          activeTodos={activeTodos}
          title={title}
          setTitle={setTitle}
          onSubmit={addNewTodo}
          onToggle={toggleAll}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={todos}
              status={status}
              newTodoTitle={title}
              onDelete={deleteTodo}
              onUpdate={updateTitle}
              onToggle={updateStatus}
            />

            <Footer
              activeTodos={activeTodos}
              status={status}
              setStatus={setStatus}
              completedTodos={completedTodos}
              onDelete={clearCompleted}
            />
          </>
        )}
      </div>

      <Error />
    </div>
  );
};
