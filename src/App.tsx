/* eslint-disable max-len */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, updateTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Filter } from './types/Filter';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState<Filter>('');
  const [errorMessage, setErrorMessage] = useState('');
  // const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [editingTodo, setEditingTodo] = useState<number | null>(null);
  const [editingTodoIds] = useState<number[]>([]);
  const [editedTitle, setEditedTitle] = useState('');

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (!isCreating) {
      inputRef.current?.focus();
    }
  }, [isCreating, deletingTodoIds, todos, updatingTodoIds, editingTodoIds]);

  const handleFilterBy = (status: Filter) => {
    setFilterStatus(status);
  };

  const handleDeleteTodo = (todoId: number) => {
    setDeletingTodoIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodo => prevTodo.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setDeletingTodoIds(prev => prev.filter(id => id !== todoId));
      });
  };

  const handleDeleteCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id))).then(
      results => {
        const failed = results.some(result => result.status === 'rejected');

        if (failed) {
          setErrorMessage('Unable to delete a todo');
        }

        const successfulIds = completedTodos
          .filter((_, index) => results[index].status === 'fulfilled')
          .map(todo => todo.id);

        setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));
      },
    );
  };

  // const handleAddTodo = () => {
  //   const trimmedTitle = newTodoTitle.trim();

  //   if (!trimmedTitle) {
  //     setErrorMessage('Title should not be empty');

  //     return;
  //   }

  //   const newTempTodo: Todo = {
  //     id: 0,
  //     title: trimmedTitle,
  //     completed: false,
  //     userId: USER_ID,
  //   };

  //   setIsCreating(true);
  //   setTempTodo(newTempTodo);

  //   postTodo({
  //     title: trimmedTitle,
  //     completed: false,
  //     userId: USER_ID,
  //   } as Omit<Todo, 'id'>)
  //     .then((createdTodo: Todo) => {
  //       setTodos(prev => [...prev, createdTodo]);
  //       setNewTodoTitle('');
  //     })
  //     .catch(() => {
  //       setErrorMessage('Unable to add a todo');
  //     })
  //     .finally(() => {
  //       setTempTodo(null);
  //       setIsCreating(false);
  //       inputRef.current?.focus();
  //     });
  // };

  const handleStatusTodo = (todo: Todo) => {
    setUpdatingTodoIds(prev => [...prev, todo.id]);

    updateTodo(todo.id, { completed: !todo.completed })
      .then((updatedTodo: Todo) => {
        setTodos(prev =>
          prev.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setUpdatingTodoIds(prev => prev.filter(id => id !== todo.id));
      });
  };

  const handleToggleAll = () => {
    const allCompleted =
      todos.length > 0 && todos.every(todo => todo.completed);
    const newStatus = !allCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    if (todosToUpdate.length === 0) {
      return;
    }

    const updatingIds = todosToUpdate.map(todo => todo.id);

    setUpdatingTodoIds(prev => [...prev, ...updatingIds]);

    Promise.all(
      todosToUpdate.map(todo =>
        updateTodo(todo.id, { completed: newStatus })
          .then(updatedTodo => updatedTodo)
          .catch(() => {
            setErrorMessage('Unable to update a todo');

            return null;
          }),
      ),
    )
      .then(updatedTodos => {
        setTodos(prevTodos =>
          prevTodos.map(todo => {
            const updated = updatedTodos.find(t => t && t.id === todo.id);

            return updated ? updated : todo;
          }),
        );
      })
      .finally(() => {
        setUpdatingTodoIds(prev =>
          prev.filter(id => !updatingIds.includes(id)),
        );
      });
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo.id);
    setEditedTitle(todo.title);
  };

  const handleUpdateEditedTodo = async (todo: Todo) => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === todo.title) {
      setEditingTodo(null);

      return;
    }

    if (!trimmedTitle) {
      setDeletingTodoIds(prev => [...prev, todo.id]);

      try {
        await deleteTodo(todo.id);
        setTodos(prev => prev.filter(t => t.id !== todo.id));
        setEditingTodo(null);
      } catch {
        setErrorMessage('Unable to delete a todo');
      } finally {
        setDeletingTodoIds(prev => prev.filter(id => id !== todo.id));
      }

      return;
    }

    setUpdatingTodoIds(prev => [...prev, todo.id]);

    try {
      const updatedTodo = await updateTodo(todo.id, {
        ...todo,
        title: trimmedTitle,
      });

      setTodos(prev =>
        prev.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
      );
      setEditingTodo(null);
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setUpdatingTodoIds(prev => prev.filter(id => id !== todo.id));
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filterStatus === 'active') {
      return !todo.completed;
    }

    if (filterStatus === 'completed') {
      return todo.completed;
    }

    return true;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isCreating={isCreating}
          inputRef={inputRef}
          allCompleted={todos.length > 0 && todos.every(todo => todo.completed)}
          handleToggleAll={handleToggleAll}
          isLoading={isCreating}
          todos={todos}
          setTempTodo={setTempTodo}
          setIsCreating={setIsCreating}
          setErrorMessage={setErrorMessage}
          setTodos={setTodos}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {/* This is a completed todo */}
          {filteredTodos.map(todo => {
            const isDeleting = deletingTodoIds.includes(todo.id);
            const isUpdating = updatingTodoIds.includes(todo.id);

            return (
              <TodoItem
                key={todo.id}
                todo={todo}
                isDeleting={isDeleting}
                isUpdating={isUpdating}
                handleDeleteTodo={handleDeleteTodo}
                handleStatusTodo={handleStatusTodo}
                handleEditTodo={handleEditTodo}
                editingTodo={editingTodo}
                inputRef={inputRef}
                editedTitle={editedTitle}
                setEditedTitle={setEditedTitle}
                handleUpdateEditedTodo={handleUpdateEditedTodo}
                setEditingTodo={setEditingTodo}
              />
            );
          })}

          {tempTodo && (
            <div data-cy="Todo" className={`todo todo--temp`}>
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={false}
                  disabled
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>

              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                disabled
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being deleted or updated */}
              {isCreating && (
                <div data-cy="TodoLoader" className="overlay modal is-active">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              )}
            </div>
          )}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterStatus={filterStatus}
            handleFilterBy={handleFilterBy}
            handleDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger ${!errorMessage ? 'hidden' : ''}`}
      >
        <button
          type="button"
          className="delete"
          aria-label="Close"
          data-cy="HideErrorButton"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
