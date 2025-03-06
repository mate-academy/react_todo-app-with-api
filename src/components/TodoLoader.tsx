import classNames from 'classnames';

type Props = {
  todoId: number;
  loadingTodoIds: Set<number>;
};

export const TodoLoader: React.FC<Props> = ({ todoId, loadingTodoIds }) => {
  return (
    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': loadingTodoIds.has(todoId),
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  );
};
