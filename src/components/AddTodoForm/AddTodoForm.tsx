import React, {
  FormEvent,
  useCallback,
  useContext,
  useState,
} from 'react';
import { TodosContext } from '../TodosProvider';

export const AddTodoForm: React.FC = React.memo(() => {
  const [todoTitle, setTodoTitle] = useState('');
  const { handleAddTodo, inputDisabled } = useContext(TodosContext);

  const handleInput = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = event.target;

    setTodoTitle(value);
  }, []);

  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();

    handleAddTodo(todoTitle.trim());
    setTodoTitle('');
  }, [todoTitle]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoTitle}
        onChange={handleInput}
        disabled={inputDisabled}
      />
    </form>
  );
});
