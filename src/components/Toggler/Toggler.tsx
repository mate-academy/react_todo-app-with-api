import classNames from 'classnames';

type Props = {
  hasAllTodosCompleted: boolean;
  toggleAllTodos: () => void;
};

export const Toggler: React.FC<Props> = ({
  hasAllTodosCompleted,
  toggleAllTodos,
}) => {
  return (
    <button
      type="button"
      className={
        classNames('todoapp__toggle-all', {
          active: hasAllTodosCompleted,
        })
      }
      aria-label="toggle all todos status"
      onClick={toggleAllTodos}
    />
  );
};
