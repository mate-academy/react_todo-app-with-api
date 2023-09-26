import { useTodo } from '../../provider/todoProvider';
import { Button } from './Button';

export const CaseOfErrorMessage = () => {
  const { error } = useTodo();

  return (
    <div
      data-cy="ErrorNotification"
      className={error
        ? 'notification is-danger is-light has-text-weight-normal'
        : 'notification is-danger is-light has-text-weight-normal hidden'}
    >
      <Button />

      {error}
    </div>
  );
};
