import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as postService from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { TodoForm } from './components/TodoForm/TodoForm';

export const FILTER = {
  All: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('');
  const [onLoadingTodoList, setOnLoadingTodoList] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>();
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const addTodo = async (todo: Todo): Promise<void> => {
    try {
      await postService
        .addTodos(todo)
        .then(newTodo => setTodos([...todos, newTodo]));
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      throw error;
    }
  };

  const deleteTodo = async (todoId: number) => {
    setOnLoadingTodoList([...onLoadingTodoList, todoId]);
    try {
      await postService.deleteTodo(todoId);
      setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      throw error;
    } finally {
      setOnLoadingTodoList([]);
    }
  };

  const updateTodoStatus = async (todoId: number, completed: boolean) => {
    setOnLoadingTodoList([...onLoadingTodoList, todoId]);
    try {
      await postService.updateTodos(todoId, completed);
      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === todoId ? { ...todo, completed } : todo,
        ),
      );
    } catch (error) {
      setErrorMessage('Unable to update a todo');
      throw error;
    } finally {
      focusInput();
      setOnLoadingTodoList([]);
    }
  };

  const updateTodoTitle = async (todoId: number, newTitle: string) => {
    if (todoId === null) {
      return;
    }

    setOnLoadingTodoList([...onLoadingTodoList, todoId]);
    try {
      await postService.updateTodoTitle(todoId, newTitle);
      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === todoId ? { ...todo, title: newTitle } : todo,
        ),
      );
    } catch (error) {
      setErrorMessage('Unable to update a todo');
      throw error;
    } finally {
      setOnLoadingTodoList([]);
    }
  };

  const bulkDeleteTodo = async (todoList: Todo[]) => {
    setOnLoadingTodoList(todoList.map(todo => todo.id));
    try {
      const deletedTodos = await Promise.allSettled(
        todoList.map(todo => postService.deleteTodo(todo.id)),
      );

      const successDeleted = todoList.filter(
        (_, index) => deletedTodos[index].status === 'fulfilled',
      );

      setTodos(currentTodos =>
        currentTodos.filter(
          todo => !successDeleted.some(t => t.id === todo.id),
        ),
      );

      if (deletedTodos.some(result => result.status === 'rejected')) {
        setErrorMessage('Unable to delete a todo');
      }
    } finally {
      focusInput();
      setOnLoadingTodoList([]);
    }
  };

  const bulkCheckTodo = async (todoList: Todo[], status: boolean) => {
    setOnLoadingTodoList(prevList => [
      ...prevList,
      ...todoList.map(todo => todo.id),
    ]);

    try {
      const results = await Promise.allSettled(
        todoList.map(todo => postService.updateTodos(todo.id, status)),
      );

      const successIds = todoList
        .filter((_, index) => results[index].status === 'fulfilled')
        .map(todo => todo.id);

      setTodos(currentTodos =>
        currentTodos.map(todo =>
          successIds.includes(todo.id) ? { ...todo, completed: status } : todo,
        ),
      );
    } catch {
      setErrorMessage('Unable to update todos');
    } finally {
      focusInput();
      setOnLoadingTodoList([]);
    }
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case FILTER.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FILTER.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  useEffect(() => {
    postService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  if (!postService.USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = getFilteredTodos();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <TodoForm
            inputRef={inputRef}
            focusInput={focusInput}
            todos={todos}
            filteredTodos={filteredTodos}
            onAddTodo={addTodo}
            onTempTodo={setTempTodo}
            onErrorMessage={setErrorMessage}
            onBulkUpdate={bulkCheckTodo}
          />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todos={filteredTodos}
            onDelete={deleteTodo}
            tempTodo={tempTodo ? tempTodo : undefined}
            deleting={onLoadingTodoList}
            onCheck={updateTodoStatus}
            onEdit={updateTodoTitle}
          />
        </section>

        {todos.length > 0 && (
          <Footer
            onFilter={setFilter}
            onDelete={bulkDeleteTodo}
            todos={todos}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        onErrorMessage={setErrorMessage}
      />
    </div>
  );
};
