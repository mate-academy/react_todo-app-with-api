import cn from 'classnames';

type Props = {
  isLoading: boolean;
  // isInputProcessing: boolean;
  // processingId: number;
  isProcessing: boolean;
  // todoId: number;
};

export const Loader: React.FC<Props> = ({
  isLoading,
  // isInputProcessing,
  // processingId,
  isProcessing,
  // todoId,
}) => {
  const isActive = isProcessing || isLoading;
  // todoId === processingId && isProcessing && (isLoading || isInputProcessing);

  return (
    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', {
        'is-active': isActive,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
