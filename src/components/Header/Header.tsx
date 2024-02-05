/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { TodoUpdateContext, TodosContext } from '../../context/TodosContext';
import { Todo } from '../../types/Todo';

export const Header: React.FC = () => {
  const [titleField, setTitleField] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);

  const {
    todos,
    errorMessage,
    setErrorMessage,
    setTempTodo,
    setLoadingIds,
  } = useContext(TodosContext);
  const { addTodo, toggleTodo } = useContext(TodoUpdateContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const USER_ID = 91;

  useEffect(() => {
    setAllCompleted(todos.every((todo: Todo) => todo.completed));
  }, [todos]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingTodo, errorMessage]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (titleField.trim()) {
      setTempTodo({
        id: 0,
        title: titleField.trim(),
        userId: USER_ID,
        completed: false,
      });

      const newTodo = {
        title: titleField.trim(),
        userId: USER_ID,
        completed: false,
      };

      setIsAddingTodo(true);

      try {
        await addTodo(newTodo);
        setTitleField('');
      } catch (error) {
        setErrorMessage('Unable to add a todo');
      } finally {
        setIsAddingTodo(false);
        setTempTodo(null);
      }
    } else {
      setErrorMessage('Title should not be empty');
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleField(event.target.value);
  };

  async function handleToggleAll() {
    const newStatus = !allCompleted;

    const todosToUpdate = todos
      .filter((todo: Todo) => todo.completed !== newStatus);

    if (todosToUpdate.length > 0) {
      setLoadingIds(todosToUpdate.map((todo) => todo.id));

      await Promise.all(
        todosToUpdate.map(async (todo: Todo) => {
          const updatedTodo = { ...todo, completed: newStatus };

          await toggleTodo(updatedTodo);

          return updatedTodo;
        }),
      );

      setLoadingIds([]);
    }
  }

  return (
    <header className="todoapp__header">
      {/* this buttons are active only if there are some active todos */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', { active: allCompleted })}
        data-cy="ToggleAllButton"
        onClick={handleToggleAll}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={titleField}
          onChange={handleChange}
          disabled={isAddingTodo}
        />
      </form>
    </header>
  );
};
