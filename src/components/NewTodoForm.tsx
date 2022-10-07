import { RefObject, useCallback, useEffect } from 'react';
import { post } from '../api/todos';
import { Todo } from '../types/Todo';
import { User } from '../types/User';

interface Props {
  newTodoField: RefObject<HTMLInputElement>;
  newTodoTitle: string;
  setNewTodoTitle: (value: string) => void;
  setError: (value: string) => void
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setIsLoading: (value: boolean) => void,
  setTempTitle: (value: string) => void,
  user: User | null,
  isLoading: boolean;
}
export const NewTodoForm: React.FC<Props> = ({
  newTodoField,
  newTodoTitle,
  setNewTodoTitle,
  setError,
  setTodos,
  setIsLoading,
  setTempTitle,
  user,
  isLoading,
}) => {
  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const handlerInput = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewTodoTitle(event.target.value);
    setTempTitle(event.target.value);
  }, []);

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (newTodoTitle.trim().length === 0) {
        setError('Title can\'t be empty');

        return;
      }

      setIsLoading(true);
      try {
        if (user) {
          const newTodosFromUser: Todo = await post(newTodoTitle, user?.id);

          setTodos((state: Todo[]) => [...state, newTodosFromUser]);
        }
      } catch (errorFromServer) {
        setError('Unable to add a todo');
      } finally {
        setIsLoading(false);
        setNewTodoTitle('');
      }
    }, []);

  return (
    <form
      onSubmit={onSubmit}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        value={newTodoTitle}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        onChange={handlerInput}
        disabled={isLoading}
      />
    </form>
  );
};
