import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { postTodo } from '../api/todos';
import { Errors } from '../types/Errors';
import { AuthContext } from './Auth/AuthContext';
import { TitleContext } from './Context/TitleContext';

interface Props {
  loadTodos: () => Promise<void>,
  handleError: (errorText: Errors) => void,
  isAdding: boolean,
  setIsAdding: (adding: boolean) => void,
}

export const NewTodo: React.FC<Props> = React.memo(({
  loadTodos,
  handleError,
  isAdding,
  setIsAdding,
}) => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const { todoTitle, setTodoTitle } = useContext(TitleContext);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [loadTodos]);

  const addTodo = useCallback(async (title: string) => {
    if (!title.trim().length) {
      handleError(Errors.TITLE);
    }

    if (user && title.trim().length > 0) {
      setIsAdding(true);

      try {
        await postTodo({
          userId: user.id,
          title: title.trim(),
          completed: false,
        });

        await loadTodos();
      } catch {
        handleError(Errors.ADD);
      }

      setTodoTitle('');
      setIsAdding(false);
    }
  }, []);

  const handleSubmit = useCallback((
    event: React.FormEvent,
    title: string,
  ) => {
    event.preventDefault();
    addTodo(title);
  }, []);

  return (
    <form onSubmit={(event) => handleSubmit(event, todoTitle)}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={isAdding}
        value={todoTitle}
        onChange={event => {
          setTodoTitle(event.target.value);
        }}
      />
    </form>
  );
});
