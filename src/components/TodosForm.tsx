import { Todo } from '../types/Todo';

interface Props {
  query: string;
  setQuery: (event: string) => void;
  addPost: (newTodo: Omit<Todo, 'id'>) => Promise<void>;
  setErrorMessage: (error: string) => void;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  handleSubmit: (
    event: React.FormEvent,
    query: string,
    setQuery: (event: string) => void,
  ) => void;
}

export const TodosForm: React.FC<Props> = ({
  query,
  setQuery,
  isLoading,
  inputRef,
  handleSubmit,
}) => {
  return (
    <form onSubmit={e => handleSubmit(e, query, setQuery)}>
      <input
        ref={inputRef}
        disabled={isLoading}
        value={query}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        onChange={event => setQuery(event.currentTarget.value)}
      />
    </form>
  );
};
