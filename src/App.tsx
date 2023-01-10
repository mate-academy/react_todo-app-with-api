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
    isAdding,
    setIsAdding,
    setSelectedTodoIds,
  } = useContext(ErrorContext);

  const loadUserTodos = useCallback(async () => {
    if (user) {
      try {
        setHasError(false);

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
    } catch (error) {
      setHasError(true);
      setCurrentError(Add);
    } finally {
      setIsAdding(false);
      await loadUserTodos();
    }
  }, []);

  const deleteTodo = useCallback(async (todoId: number) => {
    try {
      setHasError(false);
      setSelectedTodoIds(prevIds => [...prevIds, todoId]);

      await removeTodo(todoId);
    } catch (error) {
      setHasError(true);
      setCurrentError(Delete);
    } finally {
      await loadUserTodos();
      setSelectedTodoIds([0]);
    }
  }, []);

  const clearCompleted = useCallback(() => {
    completedTodos
      .forEach((todo) => deleteTodo(todo.id));
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
    } catch (error) {
      setHasError(true);
      setCurrentError(Update);
    } finally {
      await loadUserTodos();
      setSelectedTodoIds([0]);
    }
  }, []);

  const toggleAll = useCallback(() => {
    todoToToggle
      .forEach((todo) => updateStatus(todo));
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
    } catch (error) {
      setHasError(true);
      setCurrentError(Update);
    } finally {
      await loadUserTodos();
      setSelectedTodoIds([0]);
    }
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          activeTodos={activeTodos}
          title={title}
          setTitle={setTitle}
          onSubmit={addNewTodo}
          onToggle={toggleAll}
        />

        <TodoList
          todos={todos}
          status={status}
          newTodoTitle={title}
          onDelete={deleteTodo}
          onUpdate={updateTitle}
          onToggle={updateStatus}
        />

        {(todos.length > 0 || isAdding) && (
          <Footer
            activeTodos={activeTodos}
            status={status}
            setStatus={setStatus}
            completedTodos={completedTodos}
            onDelete={clearCompleted}
          />
        )}
      </div>

      <Error loadUsers={loadUserTodos} />
    </div>
  );
};
