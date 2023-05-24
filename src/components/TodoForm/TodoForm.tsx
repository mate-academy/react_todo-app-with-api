import classNames from 'classnames';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

interface Props {
  todoId?: number,
  currentTitle?: string,
  onSubmit: (title: string, id: number) => void,
  onUnfocus?: (focus: boolean) => void,
}

export const TodoForm: React.FC<Props> = ({
  todoId = 0,
  currentTitle = '',
  onSubmit,
  onUnfocus,
}) => {
  const [newTitleTodo, setNewTitleTodo] = useState(currentTitle);
  const [inputDisabled, setInputDisabled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlerCancelEdditing = useCallback(() => {
    onUnfocus?.(false);
  }, []);

  useEffect(() => {
    if (currentTitle) {
      inputRef.current?.focus();
    }

    return () => {
      inputRef.current?.focus();
    };
  }, [inputDisabled]);

  const handlerTitle = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const title = event.target.value;

    setNewTitleTodo(title);
  }, []);

  const handlerSubmit = useCallback(async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (newTitleTodo === currentTitle) {
      handlerCancelEdditing();

      return;
    }

    setInputDisabled(true);
    await onSubmit(newTitleTodo, todoId);

    setInputDisabled(false);
    setNewTitleTodo('');

    handlerCancelEdditing();
  }, [newTitleTodo]);

  const handlerKeyup = useCallback((
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      handlerCancelEdditing();
    }
  }, []);

  return (
    <form
      onSubmit={handlerSubmit}
      onBlur={handlerCancelEdditing}
    >
      <input
        type="text"
        className={classNames({
          'todo__title-field': currentTitle,
          'todoapp__new-todo': !currentTitle,
        })}
        placeholder="What needs to be done?"
        value={newTitleTodo}
        onChange={handlerTitle}
        disabled={inputDisabled}
        ref={inputRef}
        onKeyUp={handlerKeyup}
      />
    </form>
  );
};
