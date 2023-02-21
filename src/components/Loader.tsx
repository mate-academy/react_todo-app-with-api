import cn from 'classnames';
import { FC } from 'react';


type Props = {
  isLoading: boolean;
}

export const Loader: FC<Props> = ({ isLoading }) => {
  return (
    <div
    data-cy="TodoLoader"
    className={cn(
      'modal',
      'overlay',
      { 'is-active': isLoading },
    )}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
  );
};
