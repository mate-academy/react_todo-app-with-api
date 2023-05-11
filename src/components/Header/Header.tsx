/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { HeaderProps } from '../../types/HeaderProps';

export const Header: React.FC<HeaderProps> = ({
  query,
  hasTodos,
  isActiveButton,
  isDisabledField,
  onChange,
  onSubmit,
  onToggle,
}) => (
  <header className="todoapp__header">
    {hasTodos && (
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isActiveButton },
        )}
        onClick={onToggle}
      />
    )}

    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={query}
        disabled={isDisabledField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        onChange={e => onChange(e.target.value)}
      />
    </form>
  </header>
);
