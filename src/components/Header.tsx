import classNames from 'classnames';
import { ErrorType } from '../types/ErrorType';
import { NewTodoInput } from './NewTodoInput';

interface Props {
  isAddingTodo: boolean;
  handleAddTodo: (title: string) => Promise<void>;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorType | null>>;
  focusTrigger: number;
  allCompleted: boolean;
  handleToggleAll: () => Promise<void>;
  isAnyTodoProcessing: boolean;
  isLoadingTodos: boolean;
  hasTodos: boolean;
}

export const Header: React.FC<Props> = ({
  isAddingTodo,
  handleAddTodo,
  setErrorMessage,
  focusTrigger,
  allCompleted,
  handleToggleAll,
  isAnyTodoProcessing,
  isLoadingTodos,
  hasTodos,
}) => {
  return (
    <header className="todoapp__header">
      {!isLoadingTodos && hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => handleToggleAll()}
          disabled={isAnyTodoProcessing}
        />
      )}

      {/* Add a todo on form submit */}
      <NewTodoInput
        onSubmit={handleAddTodo}
        isDisabled={isAddingTodo}
        setErrorMessage={setErrorMessage}
        focusTrigger={focusTrigger}
      />
    </header>
  );
};
