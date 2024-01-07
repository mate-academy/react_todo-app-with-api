import classNames from 'classnames';
import React, { useState, useEffect } from 'react';
import { Todo } from '../types/Todo';
import { TabsFooter } from '../enums/TabsFooter';
import { deleteTodos, updateTodos } from '../api/todos';

type Props = {
  todos: Todo[],
  activeTab: TabsFooter,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  loading: boolean,
  setLoading: (v: boolean) => void,
  setErrorMessage: (v: string) => void,
  setHiddenError: (v: boolean) => void,
  setItemId: React.Dispatch<React.SetStateAction<number[]>>,
  itemId: number[],
  tempTodo: null | Todo,
};

export const ShowTodos: React.FC<Props> = ({
  todos,
  activeTab,
  setTodos,
  loading,
  setLoading,
  setErrorMessage,
  setHiddenError,
  setItemId,
  itemId,
  tempTodo,
}) => {
  const [renameTodo, setRenameTodo] = useState<null | Todo>(null);
  const [prevRenameTitle, setPrevRenameTitle] = useState('');

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setRenameTodo(null);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);
  const getVisibleTodos = (t: Todo[], at: TabsFooter) => {
    switch (at) {
      case TabsFooter.Active:
        return t.filter((el) => !el.completed);
      case TabsFooter.Completed:
        return t.filter((el) => el.completed);
      default:
        return t;
    }
  };

  const handleError = (message: string) => {
    setHiddenError(false);
    setTimeout(() => setHiddenError(true), 3000);
    setErrorMessage(message);
  };

  const resetLoadingState = () => {
    setItemId([0]);
    setLoading(false);
  };

  const visibleTodos = getVisibleTodos(todos, activeTab);

  const handleDelete = (postId: number) => {
    setItemId((prev) => [...prev, postId]);
    setLoading(true);

    deleteTodos(postId).then(() => {
      setTodos(prev => (
        prev.filter(todo => todo.id !== postId)
      ));
    })
      .catch(() => handleError('Unable to delete a todo'))
      .finally(resetLoadingState);
  };

  const handleUpdate = (todo: Todo) => {
    setItemId((prev) => [...prev, todo.id]);
    setLoading(true);

    updateTodos({ ...todo, completed: !todo.completed }).then((res) => {
      setTodos(prev => {
        const updateTodo = [...prev];
        const indexTodo = updateTodo.findIndex(el => el.id === todo.id);

        updateTodo.splice(indexTodo, 1, res);

        return updateTodo;
      });
    })
      .catch(() => handleError('Unable to update a todo'))
      .finally(resetLoadingState);
  };

  const getRenameElement = (todo: Todo) => {
    setRenameTodo(todo);
    setPrevRenameTitle(todo.title);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (renameTodo) {
      const { value } = e.target;

      setRenameTodo({ ...renameTodo, title: value });
    }
  };

  const handleRename = (todo: Todo) => {
    setItemId((prev) => [...prev, todo.id]);
    setLoading(true);

    updateTodos({ ...todo }).then((res) => {
      setTodos(prev => {
        const updateTodo = [...prev];
        const indexTodo = updateTodo.findIndex(el => el.id === todo.id);

        updateTodo.splice(indexTodo, 1, res);

        return updateTodo;
      });
    })
      .catch(() => handleError('Unable to update a todo'))
      .finally(resetLoadingState);
  };

  const baseSubmit = () => {
    if (renameTodo
      && renameTodo.title !== prevRenameTitle
      && renameTodo.title.trim() !== '') {
      handleRename(renameTodo);
    } else if (renameTodo && renameTodo.title.trim() === '') {
      handleDelete(renameTodo.id);
    }

    setRenameTodo(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    baseSubmit();
  };

  return (
    <section className="todoapp__main">
      {visibleTodos.map((todo) => (
        <div
          className={classNames('todo', { completed: todo.completed })}
          key={todo.id}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onClick={() => handleUpdate(todo)}
            />
          </label>

          {renameTodo && renameTodo.id === todo.id
            ? (
              <div className="todo">
                <form onSubmit={e => handleSubmit(e)}>
                  <input
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    onChange={e => handleChange(e)}
                    onBlur={baseSubmit}
                    value={renameTodo.title}
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                  />
                </form>

                <div className="modal overlay">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            )
            : (
              <>
                <span
                  className="todo__title"
                  onDoubleClick={() => getRenameElement(todo)}
                >
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => handleDelete(todo.id)}
                >
                  ×
                </button>
              </>
            )}

          {loading && itemId.some((el) => el === todo.id) && (
            <div className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
        </div>
      ))}

      {tempTodo && (
        <div className="todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">{tempTodo.title}</span>

          <button type="button" className="todo__remove">
            ×
          </button>

          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
