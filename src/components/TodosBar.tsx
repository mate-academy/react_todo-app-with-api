import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  delTodo: (todoId: number) => Promise<void>;
  isDeleted: Set<number>;
  isUpdated: Set<number>;
  toggleTodo: (oldTodo: Todo) => void;
  changeTodoTitle: (oldTodo: Todo, newTitle: string) => Promise<void>;
  onInnerSubmitChange: (value: boolean) => void;
};

export const TodosBar = ({
  todos,
  tempTodo,
  delTodo,
  isDeleted,
  isUpdated,
  toggleTodo,
  changeTodoTitle,
  onInnerSubmitChange,
}: Props) => {
  const [changeTitle, setChangeTitle] = useState<string>('');
  const [isChange, setIschange] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isChange]);

  const isSubmiting = useRef<boolean>(false);

  const handlerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChangeTitle(e.target.value);
  };

  const hadleDoubleClick = (id: number, currtitle: string) => {
    setIschange(id);
    setChangeTitle(currtitle);
  };

  const resetState = () => {
    setIschange(-1);
    setChangeTitle('');
  };

  const handleSubmit = (todo: Todo) => {
    if (isSubmiting.current) {
      return;
    }

    isSubmiting.current = true;
    onInnerSubmitChange(true);

    const newTitle = changeTitle.trim();

    if (newTitle === todo.title) {
      resetState();
      isSubmiting.current = false;
      onInnerSubmitChange(false);

      return;
    }

    const action = !newTitle
      ? delTodo(todo.id)
      : changeTodoTitle(todo, newTitle);

    action
      .then(() => {
        resetState();
        isSubmiting.current = false;
        onInnerSubmitChange(false);
      })
      .catch(() => {
        inputRef.current?.focus();
        isSubmiting.current = false;
      });
  };

  const onSumbitChange = (
    e: React.FormEvent<HTMLFormElement>,
    todoForChange: Todo,
  ) => {
    e.preventDefault();

    handleSubmit(todoForChange);
  };

  const onEsc = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIschange(-1);
      setChangeTitle('');
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          className={cn('todo', { completed: todo.completed })}
          key={todo.id}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => toggleTodo(todo)}
            />
          </label>

          {todo.id === isChange ? (
            <form onSubmit={e => onSumbitChange(e, todo)}>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={changeTitle}
                onChange={handlerInputChange}
                onBlur={() => handleSubmit(todo)}
                ref={inputRef}
                onKeyDown={onEsc}
              />
            </form>
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => hadleDoubleClick(todo.id, todo.title)}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => delTodo(todo.id)}
              >
                ×
              </button>
            </>
          )}

          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', {
              'is-active': isDeleted.has(todo.id) || isUpdated.has(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
      {tempTodo && (
        <div data-cy="Todo" className="todo">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>
          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
