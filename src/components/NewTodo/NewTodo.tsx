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

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTitle) {
      handleShowError('Title can\'t be empty');

      return;
    }

    onWaiting({
      id: 0,
      completed: false,
      title: newTitle,
      userId: USER_ID,
    });

    setIsAdding(true);
    const newTodo = await addTodo(USER_ID, {
      id: 0,
      completed: false,
      title: newTitle.trim(),
      userId: USER_ID,
    });

    try {
      setTodos(prev => [...prev, newTodo]);
    } catch {
      handleShowError('Unable to add todo');
    }

    onWaiting(null);
    setNewTitle('');
    setIsAdding(false);
  };

  const completeAll = () => {
    const changingTodos = countTodos(todos, false).length
      ? countTodos(todos, false)
      : todos;

    changingTodos.forEach(async ({ id, completed }) => {
      setLoadingTodos(prev => [...prev, { todoId: id, isLoading: true }]);
      const updatedTodo = await updateTodo(id, { completed: !completed });

      try {
        setTodos(prev => prev.map((currentTodo) => {
          if (currentTodo.id === id) {
            return updatedTodo;
          }

          return currentTodo;
        }));
      } catch {
        handleShowError('Something went wrong');
      }

      setLoadingTodos(prev => prev.filter(todo => todo.todoId !== id));
    });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: !countTodos(todos, false).length,
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
