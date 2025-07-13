import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onTodoCompleteChange: (todoId: number, completed: boolean) => void;
  onTodoRemove: (todoId: number) => void;
  onTodoTitleChange: (todo: Todo, newTitle: string) => void;
  onTodoSelect: (todoId: number, title: string) => void;
  onTodoDeselect: () => void;
  isSelected: boolean;
  selectedTodoNewValue: string;
  onSelectedTodoNewValueChange: (value: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onTodoCompleteChange,
  onTodoRemove,
  onTodoTitleChange,
  onTodoSelect,
  onTodoDeselect,
  isSelected,
  selectedTodoNewValue,
  onSelectedTodoNewValueChange,
}) => (
  <div
    onDoubleClick={() => onTodoSelect(todo.id, todo.title)}
    data-cy="Todo"
    className={cn('todo', todo.completed && 'completed')}
  >
    <input
      onChange={() => onTodoCompleteChange(todo.id, !todo.completed)}
      data-cy="TodoStatus"
      type="checkbox"
      className="todo__status"
      checked={todo?.completed}
    />

    {isSelected ? (
      <form
        onSubmit={event => {
          event.preventDefault();
          onTodoTitleChange(todo, selectedTodoNewValue);
        }}
      >
        <input
          onChange={event => onSelectedTodoNewValueChange(event.target.value)}
          onBlur={() => onTodoTitleChange(todo, selectedTodoNewValue)}
          onKeyDown={event => {
            if (event.key === 'Escape') {
              onTodoDeselect();
            }
          }}
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={selectedTodoNewValue}
          autoFocus={isSelected}
        />
      </form>
    ) : (
      <>
        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onTodoRemove(todo.id)}
        >
          ×
        </button>
      </>
    )}

    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', {
        'is-active': isLoading,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
