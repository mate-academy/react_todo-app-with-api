import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  changeTodo: (id: number, data: Partial<Todo>) => Promise<void>,
  setSelectId: React.Dispatch<React.SetStateAction<number>>,
};

export const TodoStatus: React.FC<Props> = ({
  todo, changeTodo, setSelectId,
}) => {
  const { id, completed } = todo;

  return (
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        defaultChecked
        onChange={() => {
          changeTodo(id, { completed: !completed });
          setSelectId(id);
        }}
      />
    </label>
  );
};
