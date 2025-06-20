import {
  FormEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

type Props = {
  isLoading: boolean;
  onAddTodo: (todoTitle: string) => Promise<void>;
};

export type AddTodoFormRef = {
  focus: () => void;
};

// eslint-disable-next-line react/display-name
export const AddTodoForm = forwardRef<AddTodoFormRef, Props>(
  ({ isLoading, onAddTodo }, ref) => {
    const [todoTitle, setTodoTitle] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

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

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      onAddTodo(todoTitle.trim())
        .then(() => {
          setTodoTitle('');
        })
        .catch(() => {});
    };

    return (
      <form onSubmit={onSubmit}>
        <input
          autoFocus
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value.trimStart())}
          disabled={isLoading}
        />
      </form>
    );
  },
);
