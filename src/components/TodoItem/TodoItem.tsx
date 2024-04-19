import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { useContext, useEffect, useRef, useState } from 'react';
import { TodosContext } from '../todosContext';
import { updateTodo } from '../../api/todos';
import { ErrorStatus } from '../../types/ErrorStatus';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    loadingIds,
    deleteChackedTodo,
    handleUpdateTodo,
    setTodos,
    setErrorMessage,
    setIsSubmit,
    setLoadingIds,
  } = useContext(TodosContext);
  const [isEdit, setIsEdit] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const isActiveLoading = loadingIds.includes(todo.id) || todo.id === 0;
  const titleField = useRef<HTMLInputElement | null>(null);

  const handleDoubleClick = () => {
    setIsEdit(true);
    setNewTitle(todo.title);
  };

  const onClickButtonDelete = (todoId: number) => {
    deleteChackedTodo(todoId);
  };

  const handleTodoCheckbox = () => {
    const todoUpdated = { ...todo, completed: !todo.completed };

    handleUpdateTodo(todoUpdated);
  };

  useEffect(() => {
    if (isEdit) {
      titleField.current?.focus();
    }
  }, [isEdit]);

  const renameTodo = (newTodo: Todo) => {
    setIsSubmit(true);
    setLoadingIds(prev => [...prev, todo.id]);

    updateTodo(newTodo)
      .then(response => {
        setTodos(currentTodos => {
          const responseTodo = response as Todo;
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(item => item.id === newTodo.id);

          newTodos.splice(index, 1, responseTodo);
          setIsEdit(false);

          return newTodos;
        });
      })
      .catch(() => {
        setErrorMessage(ErrorStatus.ErrorUpdateTodo);
        setTimeout(() => setErrorMessage(ErrorStatus.NoError), 3000);
        setIsEdit(true);
        titleField.current?.focus();
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== newTodo.id));
      });

    setIsSubmit(false);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedTitle = newTitle.trim();

    if (normalizedTitle === todo.title) {
      setIsEdit(false);

      return;
    }

    if (!normalizedTitle) {
      onClickButtonDelete(todo.id);

      return;
    }

    const newTodo = { ...todo, title: normalizedTitle };

    renameTodo(newTodo);
  };

  const handleKeyUpEvent = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEdit(false);
    } else if (event.key === 'Enter') {
      handleFormSubmit(event);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id="todoCheckbox"
          checked={todo.completed}
          onChange={handleTodoCheckbox}
        />
      </label>

      {isEdit ? (
        <form onSubmit={handleFormSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="What needs to be done?"
            ref={titleField}
            autoFocus
            value={newTitle}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setNewTitle(event.target.value);
            }}
            onKeyUp={e => handleKeyUpEvent(e)}
            onBlur={handleFormSubmit}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onClickButtonDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isActiveLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
