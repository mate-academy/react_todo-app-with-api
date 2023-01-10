import { FC } from 'react';
import cn from 'classnames';

interface Props {
  isLoading: number[],
  id: number,
}

export const TodoLoader: FC<Props> = ({ isLoading, id }) => (
  <div
    data-cy="TodoLoader"
    className={cn(
      'modal overlay',
      { 'is-active': isLoading.includes(id) },
    )}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
