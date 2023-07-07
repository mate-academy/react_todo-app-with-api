/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  memo,
  useEffect,
  useRef,
} from 'react';
import cn from 'classnames';
import { filterTodosByCompletion } from '../../utils/todoUtils';
import { TodoAppHeaderProps } from './TodoAppHeaderProps';

export const TodoAppHeader: FC<TodoAppHeaderProps> = memo(({
  todos,
  handleUpdate,
  handleSubmit,
  todoTitle,
  handleQueryChange,
  isInputDisabled,
}) => {
  const formRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.focus();
    }
  }, [todos]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        onClick={() => (
          handleUpdate(
            filterTodosByCompletion(todos)
              .map(todo => todo.id),
          ))}
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleQueryChange}
          disabled={isInputDisabled}
          ref={formRef}
        />
      </form>
    </header>
  );
});
