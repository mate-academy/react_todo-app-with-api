import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Todo } from '../../types/Todo';
import * as todoService from '../../api/todos';
import { TodoServiceErrors, TodoServiceErrorsValues } from '../../types/Errors';

interface Props {
  onSubmit: (todo: Omit<Todo, 'id'>) => Promise<void>;
  setErrorMessage: (error: TodoServiceErrorsValues | null) => void;
}

export const TodoForm = forwardRef<HTMLInputElement, Props>(
  ({ onSubmit, setErrorMessage }, ref) => {
    const [title, setTitle] = useState('');
    const focusRef = useRef<HTMLInputElement>(null);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value.trimStart());
    };

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();

      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        setErrorMessage(TodoServiceErrors.EmptyTitle);

        return;
      }

      if (focusRef.current) {
        focusRef.current.disabled = true;
      }

      onSubmit({
        userId: todoService.USER_ID,
        title: trimmedTitle,
        completed: false,
      })
        .then(() => {
          setTitle('');
        })
        .catch(() => {
          setErrorMessage(TodoServiceErrors.UnableToAdd);
        })
        .finally(() => {
          if (focusRef.current) {
            focusRef.current.disabled = false;
            focusRef.current.focus();
          }
        });
    };

    useImperativeHandle(ref, () => focusRef.current!);

    return (
      <form onSubmit={handleSubmit}>
        <input
          ref={focusRef}
          autoFocus
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
        />
      </form>
    );
  },
);

TodoForm.displayName = 'TitleForm';
