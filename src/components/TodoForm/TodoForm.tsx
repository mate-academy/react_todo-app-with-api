import React, {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from 'react';
import { TodoAgregate } from '../../types/TodoAgregate';
import { USER_ID } from '../../api/todos';
import { TodoError, TodoServiceErrors } from '../../types/Errors';

type TodoFormProps = {
  onSubmit: (newTodo: TodoAgregate) => Promise<void>;
  setErrorMessage: React.Dispatch<React.SetStateAction<TodoError | null>>;
  isLoading: boolean;
};

export type TodoFormRef = {
  focus: () => void;
};

export const TodoForm = forwardRef<TodoFormRef, TodoFormProps>(
  ({ onSubmit, setErrorMessage, isLoading }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [todoTitle, setTodoTitle] = useState('');

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
    }));

    useEffect(() => {
      if (!isLoading) {
        inputRef.current?.focus();
      }
    }, [isLoading]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setErrorMessage(null);
      setTodoTitle(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!todoTitle.trim()) {
        setErrorMessage(TodoServiceErrors.TitleShouldNotBeEmpty);
      } else {
        try {
          await onSubmit({
            userId: USER_ID,
            title: todoTitle.trim(),
            completed: false,
          });
          setTodoTitle('');
          setErrorMessage(null);
        } catch {
          setErrorMessage(TodoServiceErrors.UnableToAdd);
        }
      }

      inputRef.current?.focus();
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleInputChange}
          disabled={isLoading}
          data-cy="NewTodoField"
        />
      </form>
    );
  },
);

TodoForm.displayName = 'TodoForm';
