import { Props } from './Props';

export const TodoForm: React.FC<Props> = ({
  handleSubmit,
  isCreated,
  value,
  inputHandler,
}) => (
  <form onSubmit={handleSubmit}>
    <input
      type="text"
      className="todoapp__new-todo"
      placeholder="What needs to be done?"
      disabled={isCreated}
      value={value}
      onChange={inputHandler}
    />
  </form>
);
