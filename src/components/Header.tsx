/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { NewTodo } from './NewTodo';

interface HeaderProps {
  hasActiveTodos: boolean
  todoText: string;
  onTodoTextChange: (event:React.ChangeEvent<HTMLInputElement>) => void;
  onNewTodoSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isInputDisabled: boolean;
  onToggleAllTodos: () => void;
  hasTodos: number;
}

export const Header: React.FC<HeaderProps> = ({
  hasActiveTodos,
  todoText,
  onTodoTextChange,
  onNewTodoSubmit,
  isInputDisabled,
  onToggleAllTodos,
  hasTodos,
}) => {
  return (
    <header className="todoapp__header">
      {hasTodos > 0
          && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: !hasActiveTodos,
              })}
              onClick={onToggleAllTodos}
            />
          )}
      <NewTodo
        onTodoTextChange={onTodoTextChange}
        todoText={todoText}
        onNewTodoSubmit={onNewTodoSubmit}
        isInputDisabled={isInputDisabled}
      />
    </header>
  );
};
