import { useEffect, useRef, useState } from 'react';
import { useToDoContext } from '../../context/ToDo.context';
import { useAddTodo } from './useAddTodo';
import { ErrorMessage } from '../../types/Error';

export const AddTodoForm:React.FC = () => {
  const { addTodo } = useAddTodo();
  const { showError, todos } = useToDoContext();
  const [toDoName, setToDoName] = useState('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [toDoName, isDisabled, todos.length]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!toDoName.trim()) {
          showError(ErrorMessage.title);

          return;
        }

        setIsDisabled(true);
        addTodo({
          completed: false,
          title: toDoName.trim(),
        }).then(() => setToDoName(''))
          .catch(() => showError(ErrorMessage.add))
          .finally(() => setIsDisabled(false));
      }}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={inputRef}
        value={toDoName}
        disabled={isDisabled}
        onChange={(e) => {
          setToDoName(e.target.value);
        }}
      />
    </form>
  );
};
