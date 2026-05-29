import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { Header } from './Header/Header';
import { TodoList } from './TodoList/TodoList';
import { Footer } from './Footer/Footer';
// eslint-disable-next-line max-len
import { ErrorNotification } from './ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState(FilterStatus.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const filteredTodos = todos.filter(todo => {
    if (filter === FilterStatus.Active) {
      return !todo.completed;
    }

    if (filter === FilterStatus.Completed) {
      return todo.completed;
    }

    return true;
  });

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorMessage]);

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    try {
      const createdTodo = await addTodo({
        title: trimmedTitle,
        completed: false,
        userId: USER_ID,
      });

      setTodos(current => [...current, createdTodo]);
      setNewTodoTitle('');
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    setLoadingTodoIds(current => [...current, todo.id]);

    try {
      const updatedTodo = await updateTodo({
        ...todo,
        completed: !todo.completed,
      });

      setTodos(current =>
        current.map(item => (item.id === updatedTodo.id ? updatedTodo : item)),
      );
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setLoadingTodoIds(current => current.filter(id => id !== todo.id));
    }
  };

  const handleRenameTodo = async( todo: Todo, newTitle: string ) => {
    setLoadingTodoIds(current => [ ...current, todo.id ]);

    try {
      const updatedTodo = await updateTodo({
        ...todo,
        title: newTitle,
      });

      setTodos(current =>
        current.map(item => (item.id === updatedTodo.id ? updatedTodo : item)),
      );
    } catch (error) {
      setErrorMessage('Unable to update a todo');
      throw error;
    } finally {
      setLoadingTodoIds(current => current.filter(id => id !==todo.id));
    }
  };

  const handleToggleAll = () => {
    const shouldCompleteAll = todos.some(todo => !todo.completed);
    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldCompleteAll,
    );

    todosToUpdate.forEach(todo => handleToggleTodo(todo));
  };

  const handleDeleteTodo = async (todoId: number) => {
    setLoadingTodoIds(current => [...current, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(current => current.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setLoadingTodoIds(current => current.filter(id => id !== todoId));
    }
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.all(completedTodos.map(todo => handleDeleteTodo(todo.id)));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          newTodoTitle={newTodoTitle}
          onTitleChange={setNewTodoTitle}
          onToggleAll={handleToggleAll}
          onSubmit={handleAddTodo}
          isAdding={tempTodo !== null}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              loadingTodoIds={loadingTodoIds}
              onDelete={handleDeleteTodo}
              onToggle={handleToggleTodo}
              onRename={handleRenameTodo}
            />
            <Footer
              todos={todos}
              filter={filter}
              onFilterChange={setFilter}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
