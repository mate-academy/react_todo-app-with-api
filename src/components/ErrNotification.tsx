import classNames from 'classnames';

type Props = {
  err: string;
  onClick: (msg: string) => void;
};

export const ErrNotification: React.FC<Props> = ({ err, onClick }) => {
  return (
    <div
      data-cy="ErrorNotification"
      className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !err },
      )}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={() => onClick('')}
      />
      <div>{err}</div>
    </div>
  );
};
