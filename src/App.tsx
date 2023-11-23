/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as TodoService from './api/todos';
import { FilterBy } from './types/FilterBy';
import { ErrorMessage } from './types/ErrorMessage';
import { TodoAppContent } from './TodoAppContent';
import { ErrorNotification } from './ErrorNotification';

const USER_ID = 11836;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [errorMessage, setErrorMessage]
  = useState<ErrorMessage>(ErrorMessage.None);
  const [todoInput, setTodoInput] = useState('');
  const focusRef = useRef<HTMLInputElement>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTodo, setLoadingTodo] = useState<number | null>(null);
  const [isUpdatingAll, setIsUpdatingAll] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todosFromServer = await TodoService.getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch (error) {
        setErrorMessage(ErrorMessage.UnableToLoad);
        setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);
      }
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    switch (filterBy) {
      case FilterBy.Active:
        setFilteredTodos(todos.filter(todo => !todo.completed));
        break;
      case FilterBy.Completed:
        setFilteredTodos(todos.filter(todo => todo.completed));
        break;
      case FilterBy.All:
      default:
        setFilteredTodos(todos);
        break;
    }
  }, [filterBy, todos]);

  useEffect(() => {
    if (!isSubmitting && focusRef.current) {
      focusRef.current.focus();
    }
  }, [isSubmitting]);

  const deleteTodo = async (todoId: number) => {
    setLoadingTodo(todoId);
    setIsSubmitting(true);

    try {
      await TodoService.deleteTodos(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      setFilteredTodos(currentFilteredTodos => currentFilteredTodos
        .filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(ErrorMessage.UnableToDelete);
      setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);
    } finally {
      setIsSubmitting(false);
      setLoadingTodo(null);
    }
  };

  const clearCompletedTodos = async () => {
    setIsSubmitting(true);

    const completedTodos = todos.filter(todo => todo.completed);

    try {
      await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));
    } catch (error) {
      setErrorMessage(ErrorMessage.UnableToDelete);
      setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTodoStatus = async (todoId: number) => {
    setLoadingTodo(todoId);
    const todo = todos.find(t => t.id === todoId);

    if (!todo) {
      setLoadingTodo(null);

      return;
    }

    const updatedTodo = { ...todo, completed: !todo.completed };

    try {
      await TodoService.updateTodo(todoId, updatedTodo);
      setTodos(currentTodos => currentTodos
        .map(t => (t.id === todoId ? updatedTodo : t)));
    } catch (error) {
      setErrorMessage(ErrorMessage.UnableToUpdate);
      setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);
    } finally {
      setLoadingTodo(null);
    }
  };

  const toggleAllTodos = async () => {
    setIsUpdatingAll(true);

    const setCompleted = !todos.every(todo => todo.completed);
    const updatePromises = todos
      .filter(todo => todo.completed !== setCompleted)
      .map(todo => toggleTodoStatus(todo.id));

    try {
      await Promise.all(updatePromises);
      setTodos(todos.map(todo => ({ ...todo, completed: setCompleted })));
    } catch (error) {
      setErrorMessage(ErrorMessage.UnableToUpdate);
      setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);
    } finally {
      setIsUpdatingAll(false);
    }
  };

  const createTodo = async (newTodo: Omit<Todo, 'id'>) => {
    setIsSubmitting(true);

    try {
      const createdTodo = await TodoService.createTodos(newTodo);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      setTodoInput('');
      setTempTodo(null);
    } catch (error) {
      setErrorMessage(ErrorMessage.UnableToAdd);
      setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);
      setTempTodo(null);
    } finally {
      setIsSubmitting(false);
      focusRef.current?.focus();
    }
  };

  const handleEdit = async (todoId: number, newTitle: string) => {
    if (!newTitle.trim()) {
      await deleteTodo(todoId);

      return;
    }

    const updatedTodo = todos.find(t => t.id === todoId);

    if (!updatedTodo || newTitle === updatedTodo.title) {
      setEditingId(null);
      setEditText('');

      return;
    }

    try {
      setLoadingTodo(todoId);
      await TodoService.updateTodo(todoId, { ...updatedTodo, title: newTitle });
      setTodos(todos
        .map(t => (t.id === todoId ? { ...t, title: newTitle.trim() } : t)));
      setEditingId(null);
      setEditText('');
    } catch (error) {
      setErrorMessage(ErrorMessage.UnableToUpdate);
      setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);
    } finally {
      setLoadingTodo(null);
    }
  };

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = todoInput.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.TitleEmpty);
      setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);

      return;
    }

    const newTempTodo = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTempTodo,
    });

    createTodo(newTempTodo);
  };

  const handleFilterClick
  = (filterType: FilterBy) => (event: React.MouseEvent) => {
    event.preventDefault();
    setFilterBy(filterType);
  };

  const handleErrorNotificationClick = () => {
    setErrorMessage(ErrorMessage.None);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <TodoAppContent
        editingId={editingId}
        setEditingId={setEditingId}
        editText={editText}
        setEditText={setEditText}
        handleEdit={handleEdit}
        todos={todos}
        setTodos={setTodos}
        toggleTodoStatus={toggleTodoStatus}
        isUpdatingAll={isUpdatingAll}
        toggleAllTodos={toggleAllTodos}
        filteredTodos={filteredTodos}
        tempTodo={tempTodo}
        filterBy={filterBy}
        todoInput={todoInput}
        loadingTodo={loadingTodo}
        isSubmitting={isSubmitting}
        handleAddTodo={handleAddTodo}
        setTodoInput={setTodoInput}
        deleteTodo={deleteTodo}
        handleFilterClick={handleFilterClick}
        clearCompletedTodos={clearCompletedTodos}
        focusRef={focusRef}
      />
      <ErrorNotification
        errorMessage={errorMessage}
        handleErrorNotificationClick={handleErrorNotificationClick}
      />
    </div>
  );
};
