import {
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../types/Todo';

type Props = {
  title: string;
  setTitle: (par: string) => void;
  addTodo: (par: Omit<Todo, 'id'>) => Promise<void>;
  setErrorMessage: (par: string) => void;
  setTempTodo: (par: Todo | null) => void;
  isFocused: boolean;
  setIsFocused: (par: boolean) => void;
  todos: Todo[];
};

export const Header: FC<Props> = ({
  title,
  addTodo,
  setTitle,
  setErrorMessage,
  setTempTodo,
  isFocused,
  setIsFocused,
  todos,
}) => {
  const reset = () => setTitle('');
  const myInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (myInputRef.current && isFocused) {
      myInputRef.current.focus();
    }
  }, [isFocused, setIsFocused]);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {!!todos.length && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
          aria-label="close"
        />
      )}

      {/* Add a todo on form submit */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsFocused(false);
          const trimedTitle = title.trim();

          if (!trimedTitle.length) {
            setErrorMessage('Title should not be empty');
          } else {
            setIsSubmitting(true);
            setTempTodo({
              title: trimedTitle,
              completed: false,
              userId: 11641,
              id: 0,
            });
            addTodo({ title: trimedTitle, completed: false, userId: 11641 })
              .then(() => {
                reset();
              })
              .catch(() => setErrorMessage('Unable to add a todo'))
              .finally(() => {
                setIsSubmitting(false);
                setTempTodo(null);
                setIsFocused(true);
              });
          }
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          disabled={isSubmitting}
          ref={myInputRef}
        />
      </form>
    </header>
  );
};
