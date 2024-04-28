type Props = {
  processingList?: number[];
  todoId: number;
};

export const Loader: React.FC<Props> = ({ processingList, todoId }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={
        'modal overlay' +
        (todoId === 0 || processingList?.includes(todoId) ? ' is-active' : '')
      }
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
