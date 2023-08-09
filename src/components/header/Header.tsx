import classNames from 'classnames';
import { CreateNewTodo } from '../CreateNewTodo';
import { ErrorMessage } from '../../types/ErrorMessage';

interface Props {
  isLoading: boolean;
  isToggleActive: boolean;
  handleToggleAll: () => void;
  setErrorMessage: (error: ErrorMessage | null) => void;
  handleAddTodo: (newTitle: string) => void;
}

export const Header: React.FC <Props> = ({
  isLoading,
  isToggleActive,
  handleToggleAll,
  setErrorMessage,
  handleAddTodo,
}) => (
  <header className="todoapp__header">
    <button
      aria-label="togggle"
      type="button"
      className={classNames('todoapp__toggle-all', {
        active: isToggleActive,
      })}
      onClick={handleToggleAll}
    />

    <CreateNewTodo
      setErrorMessage={setErrorMessage}
      onAddTodo={handleAddTodo}
      isLoading={isLoading}
    />

  </header>
);
