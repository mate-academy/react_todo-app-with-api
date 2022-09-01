import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

interface Props {
  to: string;
  text: string;
}

export const FilterLink = (props: Props) => {
  const { to, text } = props;

  return (
    <NavLink
      data-cy="FilterLinkAll"
      to={to}
      className={({ isActive }) => classNames(
        'filter__link',
        { selected: isActive },
      )}
    >
      {text}
    </NavLink>
  );
};
