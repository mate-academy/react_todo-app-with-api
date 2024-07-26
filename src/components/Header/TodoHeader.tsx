import classNames from 'classnames';
import { useAppContextContainer } from '../../context/AppContext';

const TodoHeader = () => {
  const {
    inputRef,
    addTodo,
    queryText,
    handleChangeQueryText,
    todos,
    toggleAllCompleted,
    toggleAllActive,
  } = useAppContextContainer();
  const isActiveButton = todos?.every(el => el.completed);

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    handleChangeQueryText(value);
  };

  const handleSubmitNewTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addTodo(queryText);
  };

  const handleClickToggleAll = () => {
    if (!isActiveButton) {
      return toggleAllCompleted();
    }

    return toggleAllActive();
  };

  return (
    <header className="todoapp__header">
      {!!todos?.length && (
        <button
          type="button"
          onClick={handleClickToggleAll}
          className={classNames('todoapp__toggle-all', {
            active: isActiveButton,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmitNewTodo}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          value={queryText}
          onChange={handleChangeText}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};

export default TodoHeader;
