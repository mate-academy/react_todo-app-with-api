import { FC, useState } from 'react';
import classNames from 'classnames';
import { completedTodosCheck } from '../../helpers';
import { addTodo, updateTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { EventType } from '../../types/types';
import { useTodosContext } from '../../context/useTodosContext';

export const TodoForm:FC = () => {
  const {
    todos,
    setTodos,
    setErrorMessage,
    setTodosLoader,
    formLoader,
    setFormLoader,
    setTempTodo,
  } = useTodosContext();

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

  const onSubmit = async () => {
    if (!todoTitle.trim()) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    setFormLoader(true);

    await addTodo(todoTitle, setTodos, setErrorMessage, setTempTodo);

    setFormLoader(false);

    clearForm();
  };

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  function handleTodoTitleChange(event: EventType) {
    setTodoTitle(event.target.value);
  }

  return (
    <>
      <button
        aria-label=" "
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: completedTodosCheck(todos) },
        )}
        onClick={handleToggleAll}
      />

      <form
        onSubmit={handleSubmit}
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
