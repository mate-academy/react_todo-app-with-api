import { FC, useState } from 'react';
import classNames from 'classnames';
import { todosApi } from '../api/todos-api';
import { useTodoContext } from '../context/todoContext/useTodoContext';
import { useErrorContext } from '../context/errorContext/useErrorContext';
import { Todo } from '../types/Todo';
import { TextField } from './TextField';

interface TodoContentHeaderProps {
  setTempTodo: (todo: Todo | null) => void
}

export const TodoContentHeader: FC<TodoContentHeaderProps> = (props) => {
  const { setTempTodo } = props;
  const [title, setTitle] = useState('');
  const [isHandleRequest, setIsHandleRequest] = useState(false);
  const {
    addTodo,
    size,
    countCompleted,
    todos,
    setHandlingTodoIds,
    updateTodos,
  } = useTodoContext();
  const { notifyAboutError } = useErrorContext();

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      notifyAboutError("Title can't be empty");
      setTitle('');

      return;
    }

    try {
      setTempTodo({
        id: 0,
        title,
        completed: false,
        userId: 0,
      });
      setIsHandleRequest(true);
      const createdTodo = await todosApi.create({
        title,
        completed: false,
        userId: 10875,
      });

      addTodo(createdTodo);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      notifyAboutError(`Unable to add a todo: ${error.message}`);
    } finally {
      setTitle('');
      setTempTodo(null);
      setIsHandleRequest(false);
    }
  };

  const onChangeStatus = async () => {
    let prepareToUpdate = [];

    if (countCompleted === size) {
      prepareToUpdate = todos.map(todo => ({
        id: todo.id,
        data: { completed: false },
      }));
    } else {
      prepareToUpdate = todos.filter(todo => !todo.completed).map(todo => ({
        id: todo.id,
        data: { completed: true },
      }));
    }

    try {
      const handleTodoIds = prepareToUpdate.map(todo => todo.id);

      setHandlingTodoIds(handleTodoIds);
      const updatedTodos = await todosApi
        .update(prepareToUpdate);

      updateTodos(updatedTodos);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      notifyAboutError(`Unable to update todos: ${error.message}`);
    } finally {
      setHandlingTodoIds([]);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="toggleTodoStatus"
        type="button"
        className={classNames(
          'todoapp__toggle-all', {
            active: countCompleted === size,
          },
        )}
        onClick={onChangeStatus}
      />

      <form onSubmit={submit}>
        <TextField
          value={title}
          onChange={setTitle}
          isDisabled={isHandleRequest}
        />
      </form>
    </header>
  );
};
