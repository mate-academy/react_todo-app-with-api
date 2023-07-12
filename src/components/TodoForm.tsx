import React, { useState } from 'react';
import classNames from 'classnames';
import { completedTodosCheck } from '../helpers';
import { addTodo, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { EventType } from '../types/types';

interface Props {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
  formLoader: boolean,
  setFormLoader: React.Dispatch<React.SetStateAction<boolean>>,
  setTodosLoader: React.Dispatch<React.SetStateAction<boolean>>,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
}

export const TodoForm:React.FC<Props> = ({
  todos,
  setTodos,
  setErrorMessage,
  formLoader,
  setFormLoader,
  setTodosLoader,
  setTempTodo,
}) => {
  const [todoTitle, setTodoTitle] = useState<string>('');

  const handleToggleAll = async () => {
    try {
      const updatedTodos = todos.map((todo: Todo) => ({
        ...todo,
        completed: !completedTodosCheck(todos),
      }));

      const updateRequests = updatedTodos
        .map((todo) => updateTodo(
          todo.id,
          { completed: todo.completed },
          setTodos,
          setErrorMessage,
        ));

      setTodosLoader(true);

      await Promise.all(updateRequests);

      setTodosLoader(false);

      setTodos(updatedTodos);
    } catch (error) {
      setErrorMessage('Error updating todos');
    }
  };

  const clearForm = () => {
    setTodoTitle('');
  };

  const handleSubmit = async () => {
    if (!todoTitle.trim()) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    setFormLoader(true);

    await addTodo(todoTitle, setTodos, setErrorMessage, setTempTodo);

    setFormLoader(false);

    clearForm();
  };

  const handleTodoTitleChange = (event: EventType) => {
    setTodoTitle(event.target.value);
  };

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: completedTodosCheck(todos) },
        )}
        onClick={handleToggleAll}
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleTodoTitleChange}
          disabled={formLoader}
        />
      </form>
    </>
  );
};
