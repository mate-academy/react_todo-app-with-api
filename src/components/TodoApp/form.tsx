import { useState } from 'react';
import { addTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/Error';
import { USER_ID } from './consts';

type Props = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  onError: (error: ErrorType) => void,
  setTodoLoadId: (id: number | null) => void,
};

export const Form: React.FC<Props> = ({
  setTodos,
  onError: setErrorType,
  setTodoLoadId,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempNewTodo, setTempNewTodo] = useState<Todo | null>(null);

  const addTodoHandler = () => {
    setTempNewTodo({
      id: 0,
      userId: USER_ID,
      title: newTodoTitle,
      completed: false,
    });

    if (tempNewTodo) {
      setTodoLoadId(tempNewTodo.id);

      addTodo(USER_ID, tempNewTodo)
        .then((addedTodo) => {
          setTodos((prevTodos) => [...prevTodos, addedTodo]);
        })
        .catch(() => {
          setErrorType(ErrorType.ADD);
        })
        .finally(() => {
          setTempNewTodo(null);
          setNewTodoTitle('');
          setTodoLoadId(null);
        });
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      addTodoHandler();
    }}
    >
      <input
        name="title"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={(e) => setNewTodoTitle(e.target.value)}
      />
    </form>
  );
};
