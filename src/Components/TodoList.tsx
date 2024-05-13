import React from 'react';
import { Todo } from '../Types/Todo';
import { TodoItem } from './TodoItem';
import { Error } from '../Types/Todo';

interface Props {
  todos: Todo[];
  onToggleTodo: (id: number) => void;
  filter: string;
  loading: boolean;
  setError: (setError: boolean) => void;
  setErrorType: (setErrorType: Error | null) => void;
  handleDeleteTodo: (id: number) => void;
  loadingTodoId: number | null;
  loadingAddTodoId: number | null;
  addNewTodo: boolean;
  setFocus: (setFocus: boolean) => void;
  setLoadingTodoId: (setLoadingTodoId: number | null) => void;
  tempTodo: Todo | null;
  setLoading: (setLoading: boolean) => void;
  deleteFewTodo: number[];
  updateTodoTitle: (id: number, newTitle: string) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onToggleTodo,
  filter,
  setError,
  setErrorType,
  handleDeleteTodo,
  loadingTodoId,
  loadingAddTodoId,
  setFocus,
  setLoadingTodoId,
  tempTodo,
  addNewTodo,
  loading,
  setLoading,
  deleteFewTodo,
  updateTodoTitle,
}) => {
  const filteredTodos =
    filter === 'active'
      ? todos.filter(todo => !todo.completed)
      : filter === 'completed'
        ? todos.filter(todo => todo.completed)
        : todos;

  const showLoader = loading && loadingTodoId !== null;

  const renderTodos = filteredTodos.map(todo => (
    <TodoItem
      key={todo.id}
      id={todo.id}
      title={todo.title}
      completed={todo.completed}
      onToggle={() => onToggleTodo(todo.id)}
      setError={setError}
      setErrorType={setErrorType}
      onDelete={() => handleDeleteTodo(todo.id)}
      loadingTodoId={loadingTodoId}
      loadingAddTodoId={loadingAddTodoId}
      setFocus={setFocus}
      setLoadingTodoId={setLoadingTodoId}
      showLoader={showLoader || deleteFewTodo.includes(todo.id)}
      setLoading={setLoading}
      deleteFewTodo={deleteFewTodo}
      updateTodoTitle={updateTodoTitle}
    />
  ));

  const noTodosMessage =
    filter !== 'all' && filteredTodos.length === 0 ? (
      <p className="todoapp__empty-list-message"></p>
    ) : null;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {renderTodos}
      {addNewTodo && tempTodo && (
        <TodoItem
          key={tempTodo.id}
          id={tempTodo.id}
          title={tempTodo.title}
          completed={tempTodo.completed}
          onToggle={() => onToggleTodo(tempTodo.id)}
          setError={setError}
          setErrorType={setErrorType}
          onDelete={() => handleDeleteTodo(tempTodo.id)}
          loadingTodoId={loadingTodoId}
          loadingAddTodoId={loadingAddTodoId}
          setFocus={setFocus}
          setLoadingTodoId={setLoadingTodoId}
          showLoader={true}
          setLoading={setLoading}
          deleteFewTodo={deleteFewTodo}
          updateTodoTitle={updateTodoTitle}
        />
      )}
      {noTodosMessage}
    </section>
  );
};
