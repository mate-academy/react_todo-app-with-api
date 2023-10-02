import { useAddTodo } from './useAddTodo';

export const AddTodoForm:React.FC = () => {
  const {
    onAddTodo,
    title,
    onChangeTitle,
    isDisabled,
    inputRef,
  } = useAddTodo();

  return (
    <form onSubmit={onAddTodo}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={inputRef}
        value={title}
        disabled={isDisabled}
        onChange={(e) => onChangeTitle(e.target.value)}
      />
    </form>
  );
};
