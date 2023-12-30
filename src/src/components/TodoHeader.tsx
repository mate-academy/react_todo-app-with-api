import {
  useContext,
  useEffect,
  useRef,
} from 'react';
import { TodosContext } from '../context/TodosContext';
import { USER_ID } from '../constants/USER_ID';
import { Errors } from '../types/Errors';
import { TodoToggleAllButton } from './TodoToggleAllButton';

export const TodoHeader = () => {
  const {
    todos,
    title,
    setTitle,
    setErrorMessage,
    isLoading,
    addTodo,
  } = useContext(TodosContext);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim()) {
      addTodo({
        id: +new Date(),
        userId: +USER_ID,
        title,
        completed: false,
      });
    } else {
      setErrorMessage(Errors.TitleEmplyError);
    }
  };

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <TodoToggleAllButton />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChangeTitle}
          ref={inputRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
