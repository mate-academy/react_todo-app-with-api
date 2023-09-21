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

  const { setErrorMessage, setIsErrorHidden } = useErrorMessage();
  const [newTitle, setNewTitle] = useState('');

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTitle) {
      setErrorMessage('Title can\'t be empty');
      setIsErrorHidden(false);

      setTimeout(() => {
        setIsErrorHidden(true);
      }, 3000);

      return;
    }

    onWaiting({
      id: 0,
      completed: false,
      title: newTitle,
      userId: USER_ID,
    });

    const newTodo = await addTodo(USER_ID, {
      id: 0,
      completed: false,
      title: newTitle,
      userId: USER_ID,
    });

    try {
      setTodos(prev => [...prev, newTodo]);
    } catch {
      setErrorMessage('Unable to add todo');
      setIsErrorHidden(false);

      setTimeout(() => {
        setIsErrorHidden(true);
      }, 3000);
    }

    onWaiting(null);
    setNewTitle('');
  };

  const completeAll = () => {
    const uncompletedTodos = countTodos(todos, false);

    if (!uncompletedTodos.length) {
      todos.forEach(async ({ id, completed }) => {
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
          setErrorMessage('Something went wrong');
          setIsErrorHidden(false);

          setTimeout(() => {
            setIsErrorHidden(true);
          }, 3000);
        }

        setLoadingTodos(prev => prev.filter(todo => todo.todoId !== id));
      });

      return;
    }

    uncompletedTodos.forEach(async ({ id, completed }) => {
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
        setErrorMessage('Something went wrong');
        setIsErrorHidden(false);

        setTimeout(() => {
          setIsErrorHidden(true);
        }, 3000);
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
        />
      </form>
    </header>
  );
};
