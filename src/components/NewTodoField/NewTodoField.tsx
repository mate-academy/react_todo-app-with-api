import { ErrorType } from '../../types/ErrorType';

type Props = {
  onError: (errorType: ErrorType) => void;
  onAddTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  isAdding: boolean;
  newTodoField: React.RefObject<HTMLInputElement>;
  newTodoTitle: string;
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: () => void;
};

export const NewTodoFieldInput: React.FC<Props> = ({
  onError,
  onAddTodo,
  isAdding,
  newTodoField,
  newTodoTitle,
  onTitleChange,
}) => {
  return (
    <form onSubmit={onAddTodo}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        disabled={isAdding}
        value={newTodoTitle}
        placeholder="What needs to be done?"
        onFocus={() => onError(ErrorType.NONE)}
        onChange={(event) => onTitleChange(event)}
      />
    </form>
  );
};
