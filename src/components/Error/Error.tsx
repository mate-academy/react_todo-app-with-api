import classNames from 'classnames';

interface Props {
  errorMessage: string;
  isHidden: boolean;
}

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  isHidden,
}) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: isHidden },
      )}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {errorMessage}
    </div>
  );
};
