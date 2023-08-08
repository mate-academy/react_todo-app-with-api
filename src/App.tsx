import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodoStatus,
  updateTodoTitle,
} from './api/todos';
import { Footer } from './components/Footer/Footer';
import { Notification } from './components/Notification/Notification';
import { ErrorMessage } from './types/ErrorMessage';
import { FilterType } from './types/FilterType';

const USER_ID = 11085;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [
    errorMessage,
    setErrorMessage,
  ] = useState<ErrorMessage>(ErrorMessage.NoError);

  const updateCompletedCount = (todosList: Todo[]) => {
    const count = todosList.filter((todo) => todo.completed).length;

    setCompletedCount(count);
  };

  const fetchTodos = async () => {
    try {
      const fetchedTodos = await getTodos(USER_ID);

      setTodos(fetchedTodos);
      updateCompletedCount(fetchedTodos);
    } catch (error) {
      setErrorMessage(ErrorMessage.FetchTodos);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (title: string) => {
    if (!title.trim()) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    try {
      const newTempTodo: Todo = {
        id: 0,
        userId: USER_ID,
        title,
        completed: false,
      };

      setTempTodo(newTempTodo);

      const newTodo = await createTodo({
        userId: USER_ID,
        title,
        completed: false,
      });

      setTodos([...todos, newTodo]);
      updateCompletedCount([...todos, newTodo]);

      setErrorMessage(ErrorMessage.NoError);
    } catch (error) {
      setErrorMessage(ErrorMessage.AddTodo);
    } finally {
      setTempTodo(null);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case 'all':
        return true;

      case 'active':
        return !todo.completed;

      case 'completed':
        return todo.completed;

      default:
        return false;
    }
  });

  const handleDeleteTodo = async (todoId: number) => {
    try {
      setLoadingTodoIds([todoId]);
      await deleteTodo(todoId);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
      updateCompletedCount(todos.filter((todo) => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(ErrorMessage.DeleteTodo);
    } finally {
      setLoadingTodoIds([]);
    }
  };

  const toggleTodoStatus = async (todoId: number, completed: boolean) => {
    try {
      setLoadingTodoIds([todoId]);
      await updateTodoStatus(todoId, completed);

      setTodos(
        (prevTodos) => prevTodos.map(
          (todo) => (todo.id === todoId ? { ...todo, completed } : todo),
        ),
      );
      updateCompletedCount(
        todos.map(
          (todo) => (todo.id === todoId ? { ...todo, completed } : todo),
        ),
      );

      setErrorMessage(ErrorMessage.NoError);
    } catch (error) {
      setErrorMessage(ErrorMessage.UpdateTodo);
    } finally {
      setLoadingTodoIds([]);
    }
  };

  const clearCompletedTodos = async () => {
    const completedTodoIds = todos
      .filter((todo) => todo.completed)
      .map((todo) => todo.id);

    if (completedTodoIds.length === 0) {
      return;
    }

    try {
      setLoadingTodoIds(completedTodoIds);
      await Promise.all(completedTodoIds.map((id) => deleteTodo(id)));
      setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
      setCompletedCount(0);
    } catch (error) {
      setErrorMessage(ErrorMessage.DeleteTodo);
    } finally {
      setLoadingTodoIds([]);
    }
  };

  const handleToggleAll = async (completed: boolean) => {
    const activeTodos = todos.filter((todo) => todo.completed !== completed);
    const todoIdsToUpdate = activeTodos.map((todo) => todo.id);

    try {
      setLoadingTodoIds(todoIdsToUpdate);

      const updatedTodos = todos.map((todo) => ({
        ...todo,
        completed,
      }));

      setTodos(updatedTodos);

      await Promise.all(
        activeTodos.map((todo) => updateTodoStatus(todo.id, completed)),
      );

      const newCompletedCount = completed ? todos.length : 0;

      setCompletedCount(newCompletedCount);
    } catch (error) {
      setErrorMessage(ErrorMessage.UpdateTodo);
    } finally {
      setLoadingTodoIds([]);
    }
  };

  const handleEditTodo = async (todoId: number, newTitle: string) => {
    if (!newTitle.trim()) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    try {
      setLoadingTodoIds([todoId]);
      const updatedTodo = await updateTodoTitle(todoId, newTitle);

      setTodos(
        (prevTodos) => prevTodos.map(
          (todo) => (todo.id === todoId ? updatedTodo : todo),
        ),
      );

      setErrorMessage(ErrorMessage.NoError);
    } catch (error) {
      setErrorMessage(ErrorMessage.UpdateTodo);
    } finally {
      setLoadingTodoIds([]);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const clearErrorMessage = () => {
    setErrorMessage(ErrorMessage.NoError);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          addTodo={addTodo}
          setEmptyTitleError={setErrorMessage}
          allTodosCompleted={todos.length === completedCount}
          onToggleAll={handleToggleAll}
        />
        <TodoList
          todos={filteredTodos}
          onDeleteTodo={handleDeleteTodo}
          loadingTodoIds={loadingTodoIds}
          tempTodo={tempTodo}
          onToggleTodo={toggleTodoStatus}
          onEditTodo={handleEditTodo}
        />

        {todos.length > 0 && (
          <Footer
            todosCount={todos.length}
            completedCount={completedCount}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={clearCompletedTodos}
          />
        )}
      </div>

      {errorMessage && (
        <Notification
          errorMessage={errorMessage}
          onClose={clearErrorMessage}
        />
      )}
    </div>
  );
};
