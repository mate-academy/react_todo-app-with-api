import classNames from 'classnames';

type Props = {
  active: boolean;
  onToggleAll: () => void;
};

export const ToggleAllButton: React.FC<Props> = ({ active, onToggleAll }) => (
  <button
    type="button"
    aria-label="Toggle All"
    data-cy="ToggleAllButton"
    className={classNames('todoapp__toggle-all', { active })}
    onClick={onToggleAll}
  />
);
