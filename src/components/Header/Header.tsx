import cn from 'classnames';
import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TodoContext } from '../../TodoContext';
import { patchTodos, postTodos } from '../../api/todos';
import { ErrorsType } from '../../types/ErrorsType';
import { TodoType } from '../../types/TodoType';

export const Header = () => {
  const {
    todos,
    setErrorMessage,
    setTodos,
    USER_ID,
    setTempTodo,
  } = useContext(TodoContext);
  const [title, setTitle] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isAllCompleted = todos.every(({ completed }) => completed);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title) {
      setErrorMessage(ErrorsType.Title);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    const tempTodo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(tempTodo);
    setIsSubmitting(true);

    try {
      const newTodo = await postTodos({
        userId: USER_ID,
        title,
        completed: false,
      });

      setTodos(currentTodos => [...currentTodos, newTodo]);
      setTitle('');
    } catch {
      setErrorMessage(ErrorsType.Add);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setIsSubmitting(false);
      setTempTodo(null);
    }
  };

  const toggleAll = async () => {
    const isAnySelected = todos.some(({ completed }) => completed);
    let preparedList: TodoType[] = [];

    if (isAnySelected) {
      const sortAllInSelect = todos.filter(({ completed }) => !completed);

      preparedList = sortAllInSelect.map(item => {
        return { ...item, completed: true };
      });
    }

    if (isAllCompleted) {
      preparedList = todos.map(item => {
        return { ...item, completed: false };
      });
    }

    if (!isAllCompleted && !isAnySelected) {
      preparedList = todos.map(item => {
        return { ...item, completed: true };
      });
    }

    if (preparedList) {
      try {
        const requestList = preparedList.map(item => patchTodos(item));

        await Promise.all(requestList);
        if (isAllCompleted) {
          setTodos(preparedList);
        }

        if (!isAnySelected && !isAllCompleted) {
          setTodos(preparedList);
        }

        if (isAnySelected) {
          setTodos(currentTodos => {
            const updatedTodos = [...currentTodos];

            preparedList.forEach((newTodo) => {
              const index = updatedTodos
                .findIndex(item => item.id === newTodo.id);

              updatedTodos.splice(index, 1, newTodo);
            });

            return updatedTodos;
          });
        }
      } catch {
        setErrorMessage(ErrorsType.Update);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      }
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos]);

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: isAllCompleted,
          hidden: !todos.length,
        })}
        onClick={toggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.currentTarget.value)}
          disabled={isSubmitting}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
