import cn from 'classnames';
import { Error } from '../../types/Error';

interface Props {
  isError: boolean;
  error: Error;
}

export const ErrorNotification: React.FC<Props> = ({ isError, error }) => (
  <div
    data-cy="ErrorNotification"
    className={cn(
      'notification',
      'is-danger',
      'is-light',
      'has-text-weight-normal',
      { hidden: !isError },
    )}
  >
    <button data-cy="HideErrorButton" type="button" className="delete" />
    {error}
  </div>
);
