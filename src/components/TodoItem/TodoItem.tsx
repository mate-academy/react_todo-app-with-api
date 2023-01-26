import React, { memo } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo;
  isAdding?: boolean;
  selectedTodoIds: number[];
  removeTodo: (todoId: number) => void;
  toggleTodoStatus: (todoId: number, status: boolean) => void;
};

export const TodoItem: React.FC<Props> = memo((props) => {
  const {
    todo, removeTodo, toggleTodoStatus, selectedTodoIds, isAdding,
  } = props;

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        {
          completed: todo.completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => toggleTodoStatus(todo.id, !todo.completed)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => removeTodo(todo.id)}
      // onDoubleClick={}
      >
        ×
      </button>

      <Loader isLoading={isAdding || (selectedTodoIds.includes(todo.id))} />
    </div>
  );
});
