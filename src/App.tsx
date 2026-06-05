/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { FilterType } from './types/FilterType';
import { ErrorType } from './types/ErrorType';

import { ErrorNotification } from './components/ErrorNotification';
import { TodoFooter } from './components/TodoFooter';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';

import { getVisibleTodos } from './utils/getVisibleTodos';
import { getItemsCounterText } from './utils/getItemsCounterText';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorType>('');
  const [filter, setFilter] = useState<FilterType>('all');

  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [todoIdsInProgress, setTodoIdsInProgress] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');

  const visibleTodos = getVisibleTodos(todos, filter);
  const itemsCounterText = getItemsCounterText(todos);

  const showError = (message: ErrorType) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const loadTodos = async () => {
    try {
      setErrorMessage('');
      const loadedTodos = await getTodos();

      setTodos(loadedTodos);
    } catch {
      showError('Unable to load todos');
    }
  };

  useEffect(() => {
    loadTodos();

    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = newTodoTitle.trim();

    if (!title) {
      showError('Title should not be empty');
      inputRef.current?.focus();

      return;
    }

    setErrorMessage('');
    setIsAdding(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    try {
      const createdTodo = await addTodo(title);

      setTodos(prev => [...prev, createdTodo]);
      setNewTodoTitle('');
    } catch {
      showError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setTodoIdsInProgress(prev => [...prev, id]);
    setErrorMessage('');

    try {
      await deleteTodo(id);

      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      showError('Unable to delete a todo');
    } finally {
      setTodoIdsInProgress(prev => prev.filter(todoId => todoId !== id));

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(completedTodos.map(todo => handleDeleteTodo(todo.id)));
  };

  const handleToggleTodo = async (todo: Todo) => {
    setTodoIdsInProgress(prev => [...prev, todo.id]);

    try {
      const updatedTodo = await updateTodo({
        ...todo,
        completed: !todo.completed,
      });

      setTodos(prev =>
        prev.map(item => (item.id === todo.id ? updatedTodo : item)),
      );
    } catch {
      showError('Unable to update a todo');
    } finally {
      setTodoIdsInProgress(prev => prev.filter(id => id !== todo.id));
    }
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);

    const todosToUpdate = todos.filter(todo => todo.completed === allCompleted);

    await Promise.all(todosToUpdate.map(todo => handleToggleTodo(todo)));
  };

  const handleRenameTodo = async (todo: Todo) => {
    const trimmedTitle = editingTitle.trim();

    if (trimmedTitle === todo.title) {
      setEditingTodoId(null);

      return;
    }

    setTodoIdsInProgress(prev => [...prev, todo.id]);

    try {
      if (!trimmedTitle) {
        try {
          await deleteTodo(todo.id);

          setTodos(prev => prev.filter(item => item.id !== todo.id));
          setEditingTodoId(null);
        } catch {
          showError('Unable to delete a todo');
        }

        return;
      }

      const updatedTodo = await updateTodo({
        ...todo,
        title: trimmedTitle,
      });

      setTodos(prev =>
        prev.map(item => (item.id === todo.id ? updatedTodo : item)),
      );

      setEditingTodoId(null);
    } catch {
      showError('Unable to update a todo');
    } finally {
      setTodoIdsInProgress(prev => prev.filter(id => id !== todo.id));
      inputRef.current?.focus();
    }
  };

  const isAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todosLength={todos.length}
          hasTempTodo={!!tempTodo}
          isAllCompleted={isAllCompleted}
          handleToggleAll={handleToggleAll}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          handleAddTodo={handleAddTodo}
          inputRef={inputRef}
          isAdding={isAdding}
        />

        <TodoList
          todosLength={todos.length}
          tempTodo={tempTodo}
          visibleTodos={visibleTodos}
          editingTodoId={editingTodoId}
          editingTitle={editingTitle}
          setEditingTitle={setEditingTitle}
          setEditingTodoId={setEditingTodoId}
          todoIdsInProgress={todoIdsInProgress}
          handleToggleTodo={handleToggleTodo}
          handleDeleteTodo={handleDeleteTodo}
          handleRenameTodo={handleRenameTodo}
        />

        {/* Hide the footer if there are no todos */}
        {(todos.length > 0 || tempTodo) && (
          <TodoFooter
            itemsCounterText={itemsCounterText}
            filter={filter}
            setFilter={setFilter}
            hasCompletedTodos={todos.some(todo => todo.completed)}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        clearError={() => setErrorMessage('')}
      />
    </div>
  );
};
