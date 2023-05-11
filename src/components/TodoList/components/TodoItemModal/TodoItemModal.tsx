import classNames from 'classnames';
import { memo, FC } from 'react';

interface Props {
  loading: boolean;
}

export const TodoItemModal: FC<Props> = memo(({ loading }) => (
  <div className={classNames(
    'modal overlay',
    { 'is-active': loading },
  )}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
));
