import { useTodosProvider } from '../../../providers/TodosContext';

export const Form: React.FC
  = () => {
    const {
      handleTitleChange, onSubmit, title, tempTodo, isFocused,
    } = useTodosProvider();

    const handleSubmit: React.FormEventHandler = (event) => {
      event.preventDefault();

      onSubmit();
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          onChange={(event) => handleTitleChange(event.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          ref={input => isFocused && input && input.focus()}
          disabled={tempTodo !== null}
        />
      </form>
    );
  };
