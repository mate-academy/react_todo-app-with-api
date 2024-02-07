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
import { USER_ID } from '../../constants/USER_ID';
import { Errors } from '../../types/Errors';

export const Header: React.FC = () => {
  const [titleField, setTitleField] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);

  const {
    todos,
    setErrorMessage,
    tempTodo,
    setTempTodo,
    setLoadingIds,
  } = useContext(TodosContext);
  const { addTodo, toggleTodo } = useContext(TodoUpdateContext);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAllCompleted(todos.every((todo: Todo) => todo.completed));
  }, [todos]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo, todos.length]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const normalizedTitle = titleField.trim();

    if (normalizedTitle) {
      setTempTodo({
        id: 0,
        title: normalizedTitle,
        userId: USER_ID,
        completed: false,
      });

      const newTodo = {
        title: normalizedTitle,
        userId: USER_ID,
        completed: false,
      };

      setIsAddingTodo(true);

      try {
        await addTodo(newTodo);
        setTitleField('');
        setErrorMessage('');
      } catch (error) {
        setErrorMessage(Errors.Add);
      } finally {
        setIsAddingTodo(false);
        setTempTodo(null);
      }
    } else {
      setErrorMessage(Errors.TitleEmpty);
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
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

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
