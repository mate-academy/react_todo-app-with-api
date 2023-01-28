/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import { deleteTodo, getTodos, updateTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorMessage } from './components/ErrorMessage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { ErrorType } from './types/ErrorType';
import { FilterStatus } from './types/FilterStatus';
import { TempTodo, Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [error, setError] = useState(ErrorType.None);
  const [filterStatus, setFilterStatus] = useState(FilterStatus.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<TempTodo | null>(null);
  const [isAllCompleted, setIsAllCompleted] = useState(false);

  const getTodosFromServer = async () => {
    if (!user) {
      return;
    }

    try {
      const receivedTodos = await getTodos(user.id);

      setTodos(receivedTodos);
    } catch (err) {
      setError(ErrorType.LoadingError);
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  useEffect(() => {
    setIsAllCompleted(todos.every(todo => todo.completed));
  }, [todos]);

  const handleDelete = async (id: number) => {
    try {
      setUpdatingTodoIds([id]);
      await deleteTodo(id);
      setTodos(current => current.filter(
        item => item.id !== id,
      ));
    } catch {
      setError(ErrorType.RemovalError);
    } finally {
      setUpdatingTodoIds([]);
    }
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const activeTodosCount = activeTodos.length;
  const completedTodos = todos.filter(todo => todo.completed);
  const completedTodosCount = completedTodos.length;

  const deleteCompletedTodos = async () => {
    try {
      setUpdatingTodoIds(completedTodos.map(({ id }) => id));
      await Promise.all(
        completedTodos.map(todo => deleteTodo(todo.id)),
      );
      setTodos(activeTodos);
      setUpdatingTodoIds([]);
    } catch (err) {
      setError(ErrorType.RemovalError);
    }
  };

  const handleStatusChange = async (todo: Todo) => {
    try {
      const updatedTodo = { ...todo, completed: !todo.completed };

      setUpdatingTodoIds([todo.id]);
      await updateTodo(todo.id, { completed: !todo.completed });
      setTodos(current => {
        return current
          .map(el => (
            el.id === todo.id
              ? updatedTodo
              : el));
      });
    } catch {
      setError(ErrorType.ModificationError);
    } finally {
      setUpdatingTodoIds([]);
    }
  };

  const handleToggleAll = async () => {
    try {
      const newStatus = !isAllCompleted;
      const updatedTodos = todos.filter(
        ({ completed }) => completed !== newStatus,
      );

      setUpdatingTodoIds(updatedTodos.map(({ id }) => id));

      await Promise.all(
        updatedTodos.map(todo => updateTodo(todo.id, { completed: newStatus })),
      );

      setTodos(current => current.map(
        todo => ({ ...todo, completed: newStatus }),
      ));
    } catch (err) {
      setError(ErrorType.ModificationError);
    } finally {
      setUpdatingTodoIds([]);
    }
  };

  const editTodo = async (todoToEdit: Todo, newTitle: string) => {
    try {
      setUpdatingTodoIds([todoToEdit.id]);
      await updateTodo(todoToEdit.id, { title: newTitle });
    } catch (err) {
      setError(ErrorType.ModificationError);
    } finally {
      setUpdatingTodoIds([]);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setError={setError}
          setTempTodo={setTempTodo}
          setTodos={setTodos}
          isAllCompleted={isAllCompleted}
          handleToggleAll={handleToggleAll}
        />
        <TodoList
          todos={todos}
          filterStatus={filterStatus}
          tempTodo={tempTodo}
          handleDelete={handleDelete}
          handleStatusChange={handleStatusChange}
          updatingTodoIds={updatingTodoIds}
          editTodo={editTodo}
        />
        <Footer
          activeTodosCount={activeTodosCount}
          setFilterStatus={setFilterStatus}
          filterStatus={filterStatus}
          deleteCompletedTodos={deleteCompletedTodos}
          completedTodosCount={completedTodosCount}
        />
      </div>

      <ErrorMessage
        error={error}
        setError={setError}
      />
    </div>
  );
};
