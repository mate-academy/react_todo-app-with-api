import { FormEventHandler, useState } from 'react';
import { createTodo } from '../../api/todos';
import { USER_ID } from '../../configuration';
import { useTodoContext } from '../../context/TodoContext';
import { Todo } from '../../types/Todo';

export const CreateTodoForm: React.FC = () => {
  const { setTodos, setError, setTempTodo } = useTodoContext();

  const [title, setTitle] = useState('');
  const [isTodoCreating, setIsTodoCreating] = useState(false);

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (!title) {
      setError('Title is empty, Why bro?????');

      return;
    }

    setIsTodoCreating(true);

    const todo = {
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo({ ...todo, id: 0 });

    createTodo(todo)
      .then((createdTodo: Todo) => {
        setTodos((prevTodos) => [...prevTodos, createdTodo]);
      })
      .catch(() => {
        setError('Error, todo alredy using');
      })
      .finally(() => {
        setIsTodoCreating(false);

        setTempTodo(null);
      });

    setTitle('');
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="Set a goal? Build a plan here! Do it!"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={isTodoCreating}
      />
    </form>
  );
};
