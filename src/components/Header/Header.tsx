import classNames from 'classnames';

type Props = {
  changeTitle: (value: string) => void;
  onAddTodo: (value: string) => void;
  onChangeTodoAllCompleted: () => void;
  titleTodo: string;
  isCompleted: boolean;
};

export const Header: React.FC<Props> = ({
  onAddTodo,
  changeTitle,
  onChangeTodoAllCompleted,
  titleTodo,
  isCompleted,
}) => {
  const onSubmitTodo = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAddTodo(titleTodo);
  };

  return (
    <div>
      <header className="todoapp__header">

        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isCompleted,
          })}
          aria-label="toggle-all"
          onClick={onChangeTodoAllCompleted}
        />

        <form onSubmit={onSubmitTodo}>
          <input
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={titleTodo}
            onChange={(e) => changeTitle(e.target.value)}
          />
        </form>
      </header>
    </div>
  );
};
