import React from 'react';
import { Todo } from '../../types/Todo';

interface TodoFormProps {
  focusedInput: React.Ref<HTMLInputElement>;
  onTitleChange?: (title: Todo['title']) => void;
  todoTitle: Todo['title'];
  onEnterKeyPressed: (event: React.KeyboardEvent) => void;
  isDisabled: boolean;
  onBlur?: () => void;
  isEditing?: boolean;
}
export const TodoForm: React.FC<TodoFormProps> = ({
  focusedInput,
  onTitleChange = () => {},
  todoTitle,
  onEnterKeyPressed,
  isDisabled,
  onBlur = () => {},
  isEditing = false,
}) => {
  return isEditing ? (
    <form>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        ref={focusedInput}
        value={todoTitle}
        onChange={event => onTitleChange(event.target.value)}
        onKeyDown={onEnterKeyPressed}
        disabled={isDisabled}
        onBlur={onBlur}
      />
    </form>
  ) : (
    <form>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={focusedInput}
        value={todoTitle}
        onChange={event => onTitleChange(event.target.value)}
        onKeyDown={onEnterKeyPressed}
        disabled={isDisabled}
      />
    </form>
  );
};
