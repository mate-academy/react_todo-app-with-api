import { useContext, useEffect, useRef } from 'react';
import cn from 'classnames';
import { TodosContext } from '../context/TodoContext';
import { ErrorType } from '../types/Errors';
// import { editTodo } from '../api/todos';

export const Header = () => {
  const {
    todos,
    setNewTodoTitle,
    newTodoTitle,
    handleError,
    addTodo,
    USER_ID,
    disabledInput,
    setDisabledInput,
    activeTodos,
    // completedTodos,
    // setTodos,
    // saveEditedTodo,
    handleToggleAll,
    deleteTodo,
  } = useContext(TodosContext);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabledInput, deleteTodo]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisabledInput(true);

    if (newTodoTitle.trim() === '') {
      handleError(ErrorType.Empty);
      setDisabledInput(false);

      return;
    }

    setNewTodoTitle(newTodoTitle.trim());

    const newTodo = {
      title: newTodoTitle,
      completed: false,
      userId: USER_ID,
    };

    addTodo(newTodo);
  };

  // const handleToggleAll = () => {
  //   if (todos.every(todo => todo.completed)) {
  //     // const updatedTodo = todos.map(todo => ({
  //     //   ...todo,
  //     //   completed: false,
  //     // }));

  //     saveEditedTodo(todos.map(todo => ({ ...todo, completed: false })));

  //     // editTodo(updatedTodo).then(setTodos(updatedTodo));
  //   } else {
  //     const updatedTodos = todos.map(todo => ({ ...todo, completed: true }));

  //     saveEditedTodo(updatedTodos);
  //     // editTodo(updatedTodos).then(setTodos(updatedTodos));
  //   }
  // };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn({
            'todoapp__toggle-all': true,
            active: activeTodos.length === 0,
          })}
          data-cy="ToggleAllButton"
          title="showTodos"
          aria-label="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleFormSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={(event) => setNewTodoTitle(event.target.value)}
          value={newTodoTitle}
          disabled={disabledInput}
        />
      </form>
    </header>
  );
};
