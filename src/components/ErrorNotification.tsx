import { useState } from 'react';
import classNames from 'classnames';

/* eslint-disable jsx-a11y/control-has-associated-label */
interface Props {
  error: string,
}

export const ErrorNotification: React.FC<Props> = ({ error }) => {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <div className={classNames(
      'notification is-danger is-light has-text-weight-normal',
      { hidden: isHidden },
    )}
    >
      <button
        type="button"
        className="delete"
        onClick={() => setIsHidden(true)}
      />
      {error}
    </div>
  );
};
