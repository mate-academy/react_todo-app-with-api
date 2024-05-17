import { FC, useContext } from 'react';

import { Form } from '..';
import { AppContext } from '../../wrappers/AppProvider';
import { updateTodos } from '../../helpers';
import { Todo } from '../../types';

export const Header: FC = () => {
  const { todos, setTodos, setErrorType, setTodoDeleteId } =
    useContext(AppContext);

  const allCompleted = todos.every(todo => todo.completed === true);

  const toggleCompletion = (todosArr: Todo[], idsArr: number[]) =>
    todosArr.map(todo =>
      idsArr.includes(todo.id) ? { ...todo, completed: !todo.completed } : todo,
    );

  const getTodosToUpdate = () => {
    if (allCompleted) {
      return todos;
    } else {
      return todos.filter(el => !el.completed);
    }
  };

  const updateTodo = async (todo: Todo) => {
    try {
      await updateTodos(todo.id, {
        ...todo,
        completed: !todo.completed,
      });
    } catch (err) {
      setErrorType('update');
      throw new Error();
    }
  };

  const onToggleAllClick = async () => {
    const todosToUpdate = getTodosToUpdate();
    const idToUpdate = todosToUpdate.map(todo => todo.id);

    setTodoDeleteId(idToUpdate);

    try {
      await Promise.all(todosToUpdate.map(updateTodo));

      setTodos(currentTodos => toggleCompletion(currentTodos, idToUpdate));
    } catch (err) {
      setErrorType('update');
    } finally {
      setTodoDeleteId(null);
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all  ${allCompleted && todos.length > 0 ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={onToggleAllClick}
        />
      )}
      <Form />
    </header>
  );
};
