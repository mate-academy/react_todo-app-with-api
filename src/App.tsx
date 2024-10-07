/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { createTodos, deleteTodo, getTodos, updateTodo } from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Error as ErrorNotification } from './components/Error';
import { ErrorType } from './types/Error';
import { StatusTodos } from './types/Status';


const USER_ID = 0;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusTodos>(StatusTodos.ALL);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [isAddingTodo, setIsAddingTodo] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [updatingTodoId, setUpdatingTodoId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [isDeletingTodo, setIsDeletingTodo] = useState<boolean>(false);


  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(ErrorType.load_todo));
  }, []);

  const handleAddTodo = async (title: string, completed: boolean): Promise<Todo | undefined> => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setError(ErrorType.empty_title);
      return;
    }

    const newTodo: Omit<Todo, 'id'> = { title: trimmedTitle, userId: USER_ID, completed };



    const tempTodoItem: Todo = { id: Date.now(), ...newTodo };
    setTempTodo(tempTodoItem);
    setIsAddingTodo(true);
    setError(null);

    try {
      const createdTodo = await createTodos(newTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
      setTempTodo(null);

      return createdTodo
    } catch (error) {
      setTempTodo(null);
      setError(ErrorType.add_todo);
    } finally {
      setIsAddingTodo(false);
    }
  };

  const handleUpdateTodoStatus = async (id: number, completed: boolean) => {
    setUpdatingTodoId(id);

    const todoToUpdate = todos.find(todo => todo.id === id);
    if (!todoToUpdate) {
      setError(ErrorType.not_found_todo);
      return;
    }

    try {
      const updatedTodo = await updateTodo({ ...todoToUpdate, completed });
      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
      );
    } catch (e) {
      setError(ErrorType.update_todo);
    } finally {
      setUpdatingTodoId(null);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setDeletingTodoId(todoId);
    setIsDeletingTodo(true);
    try {
      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (e) {
      setError(ErrorType.delete_todo);
    } finally {
      setDeletingTodoId(null);
      setIsDeletingTodo(false);
    }
  };

  const handleStatusChange = (newStatus: StatusTodos) => setStatus(newStatus);

  const filteredTodos = todos.filter(todo => {
    if (status === StatusTodos.ACTIVE) return !todo.completed;
    if (status === StatusTodos.COMPLETED) return todo.completed;
    return true;
  });

  const counterOfActiveTodos = todos.filter(todo => !todo.completed).length;

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  const handleToggleAll = async () => {
    const areAllCompleted = todos.every(todo => todo.completed);

    const todosToUpdate = areAllCompleted
    ? todos
    : todos.filter(todo => !todo.completed);

    try {
      const updatedTodos = await Promise.all(
        todosToUpdate.map(todo =>
          updateTodo({ ...todo, completed: !areAllCompleted })
        )
      );

      setTodos(currentTodos =>
        currentTodos.map(todo =>
          updatedTodos.find(updatedTodo => updatedTodo.id === todo.id) || todo
        )
      );
    } catch (e) {
      setError(ErrorType.toggle_todo);
    }
  };

  const areAllCompleted = todos.length > 0 && todos.every(todo => todo.completed);


  const handleUpdateTodoTitle = async (id: number, newTitle: string) => {
    setUpdatingTodoId(id);
    setIsEditing(id);

    const todoToUpdate = todos.find(todo => todo.id === id);
    if (!todoToUpdate) {
      setError(ErrorType.not_found_todo);
      return;
    }

    if (newTitle.trim() === '') {
      setError(ErrorType.empty_title);
      setIsEditing(null);
      setUpdatingTodoId(null);
      return;
    }

    try {
      const updatedTodo = await updateTodo({ ...todoToUpdate, title: newTitle });

      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
      );
    } catch (e) {
      setError(ErrorType.update_todo);
      throw new Error('')
    } finally {
      setUpdatingTodoId(null);
      setIsEditing(null);
    }
  };

  return (
      <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          onAddTodo={handleAddTodo}
          onToggleAll={handleToggleAll}
          areAllCompleted={areAllCompleted}
          todosCount={todos.length}
          isDeletingTodo={isDeletingTodo}
        />
        <TodoList todos={filteredTodos}
          onUpdateStatus={handleUpdateTodoStatus}
          onDeleteTodo={handleDeleteTodo}
          deletingTodoId={deletingTodoId}
          isAddingTodo={isAddingTodo}
          tempTodo={tempTodo}
          updatingTodoId={updatingTodoId}
          onUpdateTitle={handleUpdateTodoTitle}
          isEditing={isEditing}
          setError={setError}
        />
         {!!todos.length && (
          <Footer
            status={status}
            onChangeStatus={handleStatusChange}
            counterOfActiveTodos={counterOfActiveTodos}
            todos={todos}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>
      <ErrorNotification error={error} onClose={() => {
        setError(null)}}/>
    </div>
  );
};

