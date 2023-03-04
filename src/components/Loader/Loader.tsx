import classNames from 'classnames';
import { Props } from './Props';

export const Loader: React.FC<Props> = ({ id, isProcessing }) => (
  <div className={classNames('modal overlay',
    { 'is-active': isProcessing(id) })}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
);
