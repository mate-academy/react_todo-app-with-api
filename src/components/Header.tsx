import classNames from 'classnames';
import { NewTodoInput } from './NewTodoInput';
import { useTodosContext } from '../context/TodoContextProvider';

interface Props {
  hasTodos: boolean;
}

export const Header: React.FC<Props> = ({ hasTodos }) => {
  const { allCompleted, handleToggleAll, isAnyTodoProcessing, isLoadingTodos } =
    useTodosContext();

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
      <NewTodoInput />
    </header>
  );
};
