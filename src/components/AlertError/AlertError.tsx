import cn from 'classnames';

type Props = {
  error: string;
  onClear: () => void;
};
export function AlertError({ error, onClear }: Props) {
  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button
        data-cy="HideErrorButton"
        type="button"
        className="delete"
        onClick={onClear}
      />
      {error}
    </div>
  );
}
