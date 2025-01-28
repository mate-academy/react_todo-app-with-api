import cn from 'classnames';
import { ErrorOptions } from '../types/ErrorOptions';

type Props = {
  errorOption: ErrorOptions;
  setErrorOption: (newErrorOption: ErrorOptions) => void;
};

export default function TodoError({ errorOption, setErrorOption }: Props) {
  return (
    <>
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: errorOption === ErrorOptions.NONE,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorOption(ErrorOptions.NONE)}
        />
        {errorOption}
      </div>
    </>
  );
}
