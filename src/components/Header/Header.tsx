/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, {
  Dispatch,
  SetStateAction,
} from 'react';
import { Todo } from '../../types/Todo';
import { TodoForm } from '../TodoForm/TodoForm';

interface Props {
  addTodo: (title: string) => void;
  onError: Dispatch<SetStateAction<string | null>>;
  toggleAll: () => void;
  todos: Todo[];
}

export const Header: React.FC<Props> = ({
  addTodo,
  onError,
  toggleAll,
  todos,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        onClick={() => toggleAll()}
      />

      <TodoForm
        addTodo={addTodo}
        onError={onError}
      />
    </header>
  );
};
