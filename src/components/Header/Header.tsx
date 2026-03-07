import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { USER_ID, postTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessage';

interface Props {
  setTodosFromServer: React.Dispatch<React.SetStateAction<Todo[]>>;
  todosFromServer: Todo[];
  setErrorMessage: (msg: ErrorMessage | null) => void;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  toggleAll: () => void;
  allCompleted: boolean;
}

export interface HeaderRef {
  focusInput: () => void;
}

export const Header = forwardRef<HeaderRef, Props>(
  (
    {
      setTodosFromServer,
      todosFromServer,
      setErrorMessage,
      setTempTodo,
      toggleAll,
      allCompleted,
    },
    ref,
  ) => {
    const [tempTitle, setTempTitle] = useState('');
    const [formDisable, setFormDisable] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focusInput: () => {
        inputRef.current?.focus();
      },
    }));

    useEffect(() => {
      if (!formDisable) {
        inputRef.current?.focus();
      }
    }, [formDisable]);

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();

      const trimmedTitle = tempTitle.trim();
      const tempTodo: Todo = {
        id: 0,
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      };

      if (!trimmedTitle) {
        setErrorMessage(ErrorMessage.TitleError);
        setTimeout(() => setErrorMessage(null), 3000);

        return;
      }

      setFormDisable(true);
      setTempTodo(tempTodo);

      try {
        const newTodoFromServer = await postTodo({
          userId: USER_ID,
          title: trimmedTitle,
          completed: false,
        });

        setTodosFromServer(prev => [...prev, newTodoFromServer]);

        setTempTitle('');
      } catch (error) {
        setErrorMessage(ErrorMessage.AddError);
        setTimeout(() => setErrorMessage(null), 3000);
      } finally {
        setFormDisable(false);
        setTempTodo(null);
        inputRef.current?.focus();
      }
    };

    return (
      <header className="todoapp__header">
        {/* this button should have `active` class only if all todos are completed */}

        {todosFromServer.length > 0 && (
          <button
            type="button"
            className={`todoapp__toggle-all ${allCompleted && `active`}`}
            data-cy="ToggleAllButton"
            onClick={() => toggleAll()}
          />
        )}

        {/* Add a todo on form submit */}

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={tempTitle}
            onChange={e => setTempTitle(e.target.value)}
            disabled={formDisable}
          />
        </form>
      </header>
    );
  },
);

Header.displayName = 'Header';
