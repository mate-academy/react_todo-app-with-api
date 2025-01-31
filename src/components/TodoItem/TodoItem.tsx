/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';
import { filterTodos } from '../../api/todos';
import { useAppContext } from '../../HooksContext';
import { client } from '../../utils/fetchClient';

export const TodoItem: React.FC = () => {
  const {
    selectedFilter,
    allTodos,
    editTodoId,
    setLoading,
    setLoadingTodoId,
    setAllTodos,
    setErrorMessage,
    setOldText,
    setEditTodoId,
    setUpdInputText,
    loadingTodoId,
    loading,
    updInputText,
    oldText,
  } = useAppContext();

  const handleTodo = (todoId: number, todoCompleted: boolean) => {
    return () => {
      setLoading(true);
      setLoadingTodoId(todoId);

      const body = {
        completed: !todoCompleted,
      };

      client
        .patch(`/todos/${todoId}`, body)
        .then(() => {
          const updatedTodos = allTodos.map(todo =>
            todo.id === todoId ? { ...todo, completed: !todoCompleted } : todo,
          );

          setAllTodos(updatedTodos);
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');
        })
        .finally(() => {
          setLoading(false);
        });
    };
  };

  const editTodoTitle = (title: string, id: number) => {
    return () => {
      setOldText(title.trim());
      setEditTodoId(id);
      setUpdInputText(title.trim());
    };
  };

  const deleteTodo = (id: number) => {
    setLoading(true);
    setLoadingTodoId(id);
    client
      .delete(`/todos/${id}`)
      .then(() => {
        const updatedTodos = allTodos.filter(todo => todo.id !== id);

        setAllTodos(updatedTodos);
        filterTodos(selectedFilter, allTodos);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => setLoading(false));
  };

  const updateTodoTitle = async (
    id: number,
    ev: React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>,
  ) => {
    ev.preventDefault();

    if (!updInputText.trim()) {
      deleteTodo(id);

      return;
    }

    if (updInputText.trim() === oldText) {
      setEditTodoId(null);
      setLoading(false);

      return;
    }

    setLoading(true);
    setLoadingTodoId(id);

    const body = {
      title: updInputText.trim(),
    };

    try {
      await client.patch(`/todos/${id}`, body);
      const updatedTodos = allTodos.map(todo =>
        todo.id === id ? { ...todo, title: updInputText.trim() } : todo,
      );

      setAllTodos(updatedTodos);
      setEditTodoId(null);
    } catch (error) {
      setErrorMessage(`Unable to update a todo`);
      setEditTodoId(id);
    } finally {
      setLoading(false);
    }
  };

  const cancelEditing = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Escape') {
      setEditTodoId(null);
      setUpdInputText(oldText);
    }
  };

  const visibleTodos = filterTodos(selectedFilter, allTodos);

  return (
    <>
      {visibleTodos.map(todo => (
        <div
          data-cy="Todo"
          className={classNames('todo', {
            completed: todo.completed,
          })}
          key={todo.id}
        >
          {editTodoId !== todo.id ? (
            <>
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onClick={handleTodo(todo.id, todo.completed)}
                />
              </label>

              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={editTodoTitle(todo.title, todo.id)}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => deleteTodo(todo.id)}
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active': loadingTodoId === todo.id && loading,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </>
          ) : (
            <>
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <form onSubmit={ev => updateTodoTitle(todo.id, ev)}>
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={updInputText}
                  autoFocus
                  onChange={ev => setUpdInputText(ev.target.value)}
                  onBlur={ev => updateTodoTitle(todo.id, ev)}
                  onKeyUp={ev => cancelEditing(ev)}
                />
              </form>

              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active': loadingTodoId === todo.id && loading,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </>
          )}
        </div>
      ))}
    </>
  );
};
