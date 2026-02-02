/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';
import { Header, TodoList, Footer, ErrorNotification } from './components';

function getFilteredTodos(todos: Todo[], filterBy: string) {
  switch (filterBy) {
    case Filter.Active:
      return todos.filter(todo => !todo.completed);

    case Filter.Completed:
      return todos.filter(todo => todo.completed);

    case Filter.All:
    default:
      return todos;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorMessage>(ErrorMessage.None);
  const [filterBy, setFilterBy] = useState<Filter>(Filter.All);
  const [title, setTitle] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const todosWithTempTodo = tempTodo ? [...todos, tempTodo] : todos;

  const visibleTodos = getFilteredTodos(todosWithTempTodo, filterBy);

  const field = useRef<HTMLInputElement>(null);
  const editField = useRef<HTMLInputElement>(null);

  const filters = [Filter.All, Filter.Active, Filter.Completed];

  useEffect(() => {
    setIsLoading(true);
    setError(ErrorMessage.None);

    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorMessage.Load))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError(ErrorMessage.None);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (!isAdding && !isLoading && !isDeleting && !isUpdating) {
      field.current?.focus();
    }
  }, [isAdding, isLoading, isDeleting, isUpdating]);

  useEffect(() => {
    if (editingTodoId !== null) {
      editField.current?.focus();
    }
  }, [editingTodoId]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const allTodosCompleted = (incomeTodos: Todo[]) =>
    incomeTodos.length > 0 && incomeTodos.every(todo => todo.completed);

  const activeCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setError(ErrorMessage.EmptyTitle);

      return;
    }

    setError(ErrorMessage.None);
    setIsAdding(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: normalizedTitle,
      completed: false,
    });

    addTodo({
      title: normalizedTitle,
      completed: false,
    })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setError(ErrorMessage.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
      });
  }

  function handleDelete(todoId: number) {
    setIsDeleting(true);
    setDeletingIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError(ErrorMessage.Delete);
      })
      .finally(() => {
        setDeletingIds(prev => prev.filter(id => id !== todoId));
        setIsDeleting(false);
      });
  }

  function handleClearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    setIsDeleting(true);

    completedTodos.forEach(todo => {
      setDeletingIds(prev => [...prev, todo.id]);

      deleteTodo(todo.id)
        .then(() => {
          setTodos(prev =>
            prev.filter(currentTodo => currentTodo.id !== todo.id),
          );
        })
        .catch(() => {
          setError(ErrorMessage.Delete);
        })
        .finally(() => {
          setDeletingIds(prev => prev.filter(id => id !== todo.id));
          setIsDeleting(false);
        });
    });
  }

  function handleChangeStatus(todo: Todo) {
    setIsUpdating(true);
    setUpdatingIds(prev => [...prev, todo.id]);
    const newCompleted = !todo.completed;

    updateTodo({ ...todo, completed: newCompleted })
      .then(() => {
        setTodos(prev =>
          prev.map(t =>
            t.id === todo.id ? { ...t, completed: newCompleted } : t,
          ),
        );
      })
      .catch(() => setError(ErrorMessage.Update))
      .finally(() => {
        setUpdatingIds(prev => prev.filter(id => id !== todo.id));
        setIsUpdating(false);
      });
  }

  function handleToggleAllButton(incomeTodos: Todo[]) {
    const allCompleted = allTodosCompleted(incomeTodos);
    const newStatus = !allCompleted;

    const todoForUpdate = incomeTodos.filter(
      todo => todo.completed !== newStatus,
    );

    setUpdatingIds(todoForUpdate.map(todo => todo.id));
    setIsUpdating(true);

    todoForUpdate.forEach(todo => {
      updateTodo({ ...todo, completed: newStatus })
        .then(() => {
          setTodos(prev =>
            prev.map(t =>
              t.id === todo.id ? { ...t, completed: newStatus } : t,
            ),
          );
        })
        .catch(() => setError(ErrorMessage.Update))
        .finally(() => {
          setUpdatingIds(prev => prev.filter(id => id !== todo.id));
          setIsUpdating(false);
        });
    });
  }

  function handleFinishingEditing() {
    const newTitle = editingTitle.trim();
    const originalTodo = todos.find(t => t.id === editingTodoId);

    if (editingTodoId === null) {
      return;
    }

    if (!originalTodo) {
      setEditingTodoId(null);
      setEditingTitle('');

      return;
    }

    if (newTitle === originalTodo.title) {
      setEditingTodoId(null);
      setEditingTitle('');

      return;
    }

    if (newTitle === '') {
      setEditingTitle('');
      handleDelete(editingTodoId);

      return;
    }

    setUpdatingIds(prev => [...prev, editingTodoId]);

    updateTodo({ ...originalTodo, title: newTitle })
      .then(() => {
        setTodos(prev =>
          prev.map(t =>
            t.id === editingTodoId ? { ...t, title: newTitle } : t,
          ),
        );
        setEditingTodoId(null);
      })
      .catch(() => setError(ErrorMessage.Update))
      .finally(() => {
        setUpdatingIds(prev => prev.filter(id => id !== editingTodoId));
      });
  }

  function handleSubmitEdit(event: React.FormEvent) {
    event.preventDefault();
    handleFinishingEditing();
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isLoading={isLoading}
          todos={todos}
          allTodosCompleted={allTodosCompleted}
          handleToggleAllButton={handleToggleAllButton}
          handleSubmit={handleSubmit}
          field={field}
          isAdding={isAdding}
          updatingIds={updatingIds}
          editingTodoId={editingTodoId}
          title={title}
          setTitle={setTitle}
        />

        <TodoList
          todos={todos}
          visibleTodos={visibleTodos}
          tempTodo={tempTodo}
          deletingIds={deletingIds}
          updatingIds={updatingIds}
          handleChangeStatus={handleChangeStatus}
          editingTodoId={editingTodoId}
          handleSubmitEdit={handleSubmitEdit}
          editingTitle={editingTitle}
          editField={editField}
          setEditingTodoId={setEditingTodoId}
          setEditingTitle={setEditingTitle}
          handleFinishingEditing={handleFinishingEditing}
          handleDelete={handleDelete}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            filters={filters}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            hasCompleted={hasCompleted}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};
