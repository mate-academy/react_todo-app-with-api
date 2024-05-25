import { memo, useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import classNames from 'classnames';
import { USER_ID, addTodo } from '../../api/todos';
import { handleAllTodosStatusUpdate } from '../../utils/updUtils';
import { useTodoActions } from '../../hooks/useTodosActions';

export const TodoHeader: React.FC = memo(() => {
  const { state } = useContext(AppContext);
  const actions = useTodoActions();
  const { todos, inputDisabled } = state;
  const allCompleted = todos.every(todo => todo.completed);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && !inputDisabled) {
      inputRef.current.focus();
    }
  }, [todos, inputDisabled]);

  const handleToggleClick = async () => {
    const updIds = state.todos.map(todo => todo.id);

    await handleAllTodosStatusUpdate(updIds, state, actions);

    actions.setFilter(state.filter);
  };

  const [todo, setTodo] = useState('');

  const handleTodoSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = todo.trim();

    if (!trimmedTitle) {
      actions.updateErrorStatus('EmptyTitleError');

      return;
    }

    const newTodo = {
      id:
        state.todos.length > 0
          ? Math.max(...state.todos.map(task => task.id)) + 1
          : 1,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    try {
      actions.setInputDisabled(true);
      actions.createTempTodo({
        id: 0,
        title: trimmedTitle,
        userId: 0,
        completed: false,
      });

      const response = await addTodo(newTodo);

      if (response) {
        actions.addNewTodoLocally(response);
        setTodo('');
      }
    } catch (error) {
      actions.updateErrorStatus('AddTodoError');
    } finally {
      actions.setInputDisabled(false);
      actions.createTempTodo(null);
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleClick}
        />
      )}

      <form onSubmit={handleTodoSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todo}
          onChange={event => setTodo(event.target.value)}
          disabled={inputDisabled}
        />
      </form>
    </header>
  );
});

TodoHeader.displayName = 'TodoHeader';
