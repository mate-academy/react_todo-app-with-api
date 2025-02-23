import {
  FC,
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
  useState,
} from 'react';
import cn from 'classnames';
import { InputForm } from '../InputForm';
import { Todo } from '../../types/Todo';
import { Errors } from '../../types/Errors';
import { handleError } from '../../utils/handleError';
import { postTodo, USER_ID } from '../../api/todos';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  uncompletedTodosAmount: number;
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  setError: Dispatch<SetStateAction<Errors>>;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  onToggleCompletedAll: () => void;
};

export const Header: FC<Props> = ({
  todos,
  tempTodo,
  uncompletedTodosAmount,
  setTempTodo,
  setError,
  setTodos,
  onToggleCompletedAll,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedInputValues = inputValue.trim();

    if (!trimmedInputValues) {
      handleError(setError, Errors.EmptyTitle);

      return;
    }

    const temporaryTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedInputValues,
      completed: false,
    };

    setTempTodo(temporaryTodo);

    postTodo(temporaryTodo)
      .then(res => {
        setTodos(current => [...current, res]);
        setInputValue('');
        setTempTodo(null);
      })
      .catch(() => {
        setTempTodo(null);
        handleError(setError, Errors.AddTodo);
      });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos, tempTodo]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: uncompletedTodosAmount === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleCompletedAll}
        />
      )}

      <InputForm
        handleSubmit={handleSubmit}
        inputRef={inputRef}
        tempTodo={tempTodo}
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
    </header>
  );
};
