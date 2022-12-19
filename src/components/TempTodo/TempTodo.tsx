import { Loader } from '../Loader/Loader';

interface Props {
  currentInput: string,
}

export const TempTodo: React.FC<Props> = (props) => {
  const { currentInput } = props;

  return (
    <div className="todo">
      <Loader />
      <label className="todo__status-label">
        <input type="checkbox" className="todo__status" />
      </label>

      <span className="todo__title">
        {currentInput}
      </span>

      <button type="button" className="todo__remove">
        ×
      </button>
    </div>
  );
};
