import { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';
import { addTodos } from '../api/todos';
import { ErroMessage } from '../utils/errorMessages';

type Props = {
  todos: Todo[];
  addTodo: (newTodo: Todo) => void;
  handleErrorMessages: (newErrorMessage: ErroMessage) => void;
  setTempTodo: (value: Todo | null) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: (value: Todo[]) => void;
  completeAllTodos: () => void;
  shouldFocusInput: boolean;
  setShouldFocusInput: (value: boolean) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  addTodo,
  handleErrorMessages,
  setTempTodo,
  setIsLoading,
  completeAllTodos,
  shouldFocusInput,
  setShouldFocusInput,
}) => {
  const [query, setQuery] = useState('');
  const [disableInput, setDisableInput] = useState(false);
  const inputElement = useRef<HTMLInputElement>(null);
  const handleFocusInput = () => {
    if (inputElement.current) {
      inputElement.current.focus();
    }
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) {
      handleErrorMessages(ErroMessage.EMPTY_TITLE);

      return;
    }

    const newTodo = {
      title: query.trim(),
      completed: false,
      userId: USER_ID,
    };

    try {
      setDisableInput(true);

      const tempTodo = {
        title: query,
        completed: false,
        id: 0,
        userId: USER_ID,
      };

      setTempTodo(tempTodo);
      setIsLoading(prev => [...prev, tempTodo.id]);

      const responseTodo = await addTodos(newTodo);

      addTodo(responseTodo);

      setQuery('');
    } catch {
      handleErrorMessages(ErroMessage.ADD);
    } finally {
      setDisableInput(false);
      setTempTodo(null);
      setShouldFocusInput(true);
    }
  };

  useEffect(() => {
    if (shouldFocusInput) {
      handleFocusInput();
    }
  }, [shouldFocusInput]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <Button
          type="button"
          className={
            todos.every(todo => todo?.completed === true)
              ? 'todoapp__toggle-all active'
              : ' todoapp__toggle-all'
          }
          dataCy="ToggleAllButton"
          onClick={() => completeAllTodos()}
        />
      )}
      <form onSubmit={e => handleSubmitForm(e)}>
        <input
          autoFocus
          disabled={disableInput}
          ref={inputElement}
          value={query}
          onChange={e => setQuery(e.target.value.trimStart())}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
