/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorMessage } from './types/ErrorMessage';
import { StatusTodo } from './types/StatusTodo';
import { Todo } from './types/Todo';
import {
  addTodo,
  deleteTodo,
  editTodo,
  getTodos,
} from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
// eslint-disable-next-line
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [statusTodos, setStatusTodos] = useState<StatusTodo>(StatusTodo.ALL);
  const [title, setTitle] = useState<string>('');
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);
  const [error, setError] = useState(ErrorMessage.None);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);

  const filteringTodos = (statusAllTodos: StatusTodo) => {
    switch (statusAllTodos) {
      case StatusTodo.ACTIVE:
        return todos.filter(todo => todo.completed === false);

      case StatusTodo.COMPLETED:
        return todos.filter(todo => todo.completed === true);

      case StatusTodo.ALL:
      default:
        return todos;
    }
  };

  const filteredTodos = filteringTodos(statusTodos);

  const loadUserTodos = async () => {
    if (!user) {
      return;
    }

    setError(ErrorMessage.None);

    try {
      const todosFromServer = await getTodos(user.id);

      setTodos(todosFromServer);
    } catch {
      setError(ErrorMessage.NoTodos);
    }
  };

  useEffect(() => {
    loadUserTodos();
  }, [user]);

  const activeTodos = filteredTodos.filter(a => !a.completed);
  const completedTodos = filteredTodos.filter(c => c.completed);

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(ErrorMessage.None);

    if (title.trim() && user) {
      try {
        await addTodo({
          userId: user.id,
          title: title.trim(),
          completed: false,
        });

        await loadUserTodos();
        setTitle('');
      } catch {
        setError(ErrorMessage.Add);
      }
    } else {
      setError(ErrorMessage.Title);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setError(ErrorMessage.None);
    setLoadingTodosIds(prevIds => [...prevIds, todoId]);

    try {
      await deleteTodo(todoId);

      await loadUserTodos();
    } catch {
      setError(ErrorMessage.Delete);
    } finally {
      setLoadingTodosIds([]);
    }
  };

  const handleRenameTodo = async (todo: Todo, newTitle: string) => {
    const { title: currTitle, id } = todo;

    if (!newTitle) {
      handleDeleteTodo(id);

      return;
    }

    if (newTitle !== currTitle) {
      setError(ErrorMessage.None);
      setLoadingTodosIds(prevIds => [...prevIds, id]);

      try {
        await editTodo(id, {
          title: newTitle,
        });

        await loadUserTodos();
      } catch {
        setError(ErrorMessage.Update);
      } finally {
        setLoadingTodosIds([]);
      }
    }
  };

  const handleChangeStatus = async (todo: Todo) => {
    const { completed, id } = todo;

    setError(ErrorMessage.None);
    setLoadingTodosIds(prevIds => [...prevIds, id]);

    try {
      await editTodo(id, {
        completed: !completed,
      });

      await loadUserTodos();
    } catch {
      setError(ErrorMessage.Update);
    } finally {
      setLoadingTodosIds([]);
    }
  };

  const handleChangeStatusAll = async () => {
    if (completedTodos.length < todos.length) {
      await Promise.all(activeTodos.map(todo => handleChangeStatus(todo)));
    } else {
      await Promise.all(completedTodos.map(todo => handleChangeStatus(todo)));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={filteredTodos}
          activeTodos={activeTodos}
          title={title}
          setTitle={setTitle}
          onAdd={handleAddTodo}
          onChangeStatusAll={handleChangeStatusAll}
        />

        {filteredTodos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            currTitle={title}
            onDelete={handleDeleteTodo}
            onRename={handleRenameTodo}
            onChangeStatus={handleChangeStatus}
            loadingTodosIds={loadingTodosIds}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            statusTodos={statusTodos}
            setStatusTodos={setStatusTodos}
            onDelete={handleDeleteTodo}
          />
        )}
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
