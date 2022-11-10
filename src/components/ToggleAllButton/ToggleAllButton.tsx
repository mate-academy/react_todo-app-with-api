import classNames from 'classnames';

type Props = {
  handleToggleAllTodos: () => void;
  counterActiveTodos: number;
};

export const ToggleAllButton: React.FC<Props> = ({
  handleToggleAllTodos,
  counterActiveTodos,
}) => {
  return (
    <button
      data-cy="ToggleAllButton"
      type="button"
      className={classNames(
        'todoapp__toggle-all',
        { active: counterActiveTodos === 0 },
      )}
      aria-label="Toggle Button"
      onClick={() => handleToggleAllTodos()}
    />
  );
};
