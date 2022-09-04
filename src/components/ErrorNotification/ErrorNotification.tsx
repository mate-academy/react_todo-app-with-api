import { FC, memo } from 'react';
import { ErrorType } from '../../types/Todo';

interface Props {
  typeError: string;
  handelCloseError: () => void;
}

const typeErrors: ErrorType[] = [
  {
    title: '',
    message: '',
  },
  {
    title: 'ErrorLoadedNewTodo',
    message: 'Unable to add a todo',
  },
  {
    title: 'ErrorDeletedTodo',
    message: 'Unable to delete a todo',
  },
  {
    title: 'ErrorUpdate',
    message: 'Unable to update a todo',
  },
  {
    title: 'EmptyTitle',
    message: "Title can't be empty",
  },
];

export const ErrorNotification: FC<Props> = memo(
  ({ typeError, handelCloseError }) => {
    const errorFinde = typeErrors.find((error) => error.title === typeError);

    return (
      <>
        {typeError !== '' && (
          <div
            data-cy="ErrorNotification"
            className="notification is-danger is-light has-text-weight-normal"
          >
            <button
              data-cy="HideErrorButton"
              aria-label="Mute volume"
              type="button"
              className="delete"
              onClick={handelCloseError}
            />

            {errorFinde && errorFinde.message}
          </div>
        )}
      </>
    );
  },
);
