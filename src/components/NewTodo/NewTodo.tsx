import classNames from 'classnames';
import { useState } from 'react';
import { countTodos } from '../../utils/countTodos';
import { useTodos } from '../Contexts/TodosContext';
import { useErrorMessage } from '../Contexts/ErrorMessageContext';
import { USER_ID } from '../../utils/userToken';
import { useLoadingTodos } from '../Contexts/LoadingTodosContext';
import { addTodo, updateTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  onWaiting: (tempTodo: Todo | null) => void,
};

export const NewTodo: React.FC<Props> = ({ onWaiting }) => {
  const { todos, setTodos } = useTodos();
  const { setLoadingTodos } = useLoadingTodos();

  const [isAdding, setIsAdding] = useState(false);

  const { handleShowError } = useErrorMessage();
  const [newTitle, setNewTitle] = useState('');

  const uncompletedTodos = countTodos(todos, false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTitle.trim()) {
      handleShowError('Title can\'t be empty');

      return;
    }

    const tempTodo = {
      id: 0,
      completed: false,
      title: newTitle.trim(),
      userId: USER_ID,
    };

    onWaiting(tempTodo);

    setIsAdding(true);
    try {
      const newTodo = await addTodo(USER_ID, tempTodo);

      setTodos(prev => [...prev, newTodo]);
      setNewTitle('');
    } catch {
      handleShowError('Unable to add todo');
    }

    onWaiting(null);
    setIsAdding(false);
  };

  const completeAll = async () => {
    const changingTodos = uncompletedTodos.length
      ? uncompletedTodos
      : todos;

    const todosPromises = changingTodos.map(async ({ id, completed }) => {
      return updateTodo(id, { completed: !completed });
    });

    try {
      changingTodos.forEach(({ id }) => {
        setLoadingTodos(prev => [...prev, id]);
      });
      const updatedTodos = await Promise.all(todosPromises);

      updatedTodos.forEach((updatedTodo) => {
        setTodos(prev => prev.map((currentTodo) => {
          if (currentTodo.id === updatedTodo.id) {
            return updatedTodo;
          }

          return currentTodo;
        }));
        setLoadingTodos(prevLoads => (
          prevLoads.filter(id => id !== updatedTodo.id)));
      });
    } catch {
      handleShowError('Something went wrong');
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: !uncompletedTodos.length,
        })}
        aria-label="NewTodo"
        onClick={completeAll}
      />

      <form onSubmit={onSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
