import { useTodo } from '../../../provider/todoProvider';

export const Input = () => {
  const {
    addNewTodo,
    newTodo,
    setNewTodo,
    temptTodo,
    isFocusedOnTask,
  } = useTodo();

  return (
    <form onSubmit={addNewTodo}>
      <input
        data-cy="NewTodoField"
        ref={input => !isFocusedOnTask && input && input.focus()}
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodo?.trimStart() || ''}
        onChange={(e) => setNewTodo(e.target.value)}
        disabled={!!temptTodo}
      />
    </form>
  );
};
