import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { postTodo } from '../../api/todos';
import { TodosContext } from '../TodosContextProvider/TodosContextProvider';
import { USER_ID } from '../../utils/UserId';
import { ErrorContext } from '../ErrorContextProvider/ErrorContextProvider';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  setTempTodo: (todo: Todo | null) => void,
  tempTodo: Todo | null,
};

export const NewTodo: React.FC<Props> = ({
  setTempTodo, tempTodo,
}) => {
  const { onNewError, setErrorMessage } = useContext(ErrorContext);
  const { setTodos, todos } = useContext(TodosContext);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const titleInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (titleInput.current) {
      titleInput.current.focus();
    }
  }, [todos, tempTodo]);

  const handleAddingTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      onNewError(ErrorMessage.EmptyTitleRecieved);

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    setErrorMessage(ErrorMessage.None);

    postTodo(newTodo)
      .then((response) => {
        setNewTodoTitle('');
        setTodos((prevTodos) => [...prevTodos, response]);
      })
      .catch(() => onNewError(ErrorMessage.UnableAdd))
      .finally(() => setTempTodo(null));

    setTempTodo({
      ...newTodo,
      id: 0,
    });
  };

  return (
    <form onSubmit={handleAddingTodo}>
      <input
        data-cy="NewTodoField"
        ref={titleInput}
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={({ target }) => setNewTodoTitle(target.value)}
        disabled={!!tempTodo}
      />
    </form>
  );
};
