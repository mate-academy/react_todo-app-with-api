import {
  Dispatch, FC, KeyboardEvent, SetStateAction, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { updateTodo } from '../api/todos';
import { ErrorType } from '../types/Error';

type Props = {
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>
  handleDeleteTodo: (x: number) => void,
  toggleTodoStatus: (todoId: number) => void,
  isUpdating: boolean,
  setIsUpdating: Dispatch<SetStateAction<boolean>>,
  setErrorMessage: (x: string) => void,
};
export const TodoList: FC<Props> = ({
  todos,
  setTodos,
  handleDeleteTodo,
  toggleTodoStatus,
  isUpdating,
  setIsUpdating,
  setErrorMessage,
  // updatingTodoId,
  // setUpdatingTodoId,
}) => {
  const [updatingTodoId, setUpdatingTodoId] = useState<number | null>(null);
  const [updatedTitle, setUpdatedTitle] = useState('');

  const handleEditModeOn = (todoId: number, todoTitle: string) => {
    setUpdatingTodoId(todoId);
    setUpdatedTitle(todoTitle);
  };

  const handleEditSubmit = (id: number) => {
    if (!updatedTitle.trim()) {
      handleDeleteTodo(id);
    }

    const todoToUpdate = todos.find(todo => todo.id === id);

    if (todoToUpdate && updatedTitle.trim() !== todoToUpdate.title) {
      setIsUpdating(true);
      updateTodo({ ...todoToUpdate, title: updatedTitle.trim() })
        .then(updatedTodo => {
          setTodos((currentTodos: Todo[]) => (
            currentTodos.map(todo => (todo.id === id ? updatedTodo : todo))));
        })
        .catch(() => setErrorMessage(ErrorType.UPDATE))
        .finally(() => {
          setIsUpdating(false);
          setUpdatingTodoId(null);
          setUpdatedTitle('');
        });
    }

    setUpdatingTodoId(null);
  };

  const handleOnKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setUpdatingTodoId(null);
    }
  };

  return (
    <section className="todoapp__main">

      {todos.map(todo => (
        <div
          key={todo.id}
          className={classNames('todo', {
            completed: todo.completed,
          })}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => toggleTodoStatus(todo.id)}
              disabled={isUpdating}
            />
          </label>
          {updatingTodoId === todo.id ? (
            <form onSubmit={(event) => {
              event.preventDefault();
              handleEditSubmit(todo.id);
            }}
            >
              <input
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={updatedTitle}
                disabled={isUpdating}
                onChange={(event) => setUpdatedTitle(event.target.value)}
                onKeyUp={(event) => handleOnKeyUp(event)}
                onBlur={() => handleEditSubmit(todo.id)}
                autoFocus
              />
            </form>
          )
            : (
              <>
                <span
                  className="todo__title"
                  onDoubleClick={() => handleEditModeOn(todo.id, todo.title)}
                >
                  {todo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  ×
                </button>
              </>
            )}

          <div className={classNames('modal overlay',
            { 'is-active': isUpdating })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
