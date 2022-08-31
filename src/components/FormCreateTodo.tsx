import React, {
  FormEvent, useEffect, useRef, useState,
} from 'react';

interface Props {
  handelCreateTodo: (title: string) => void;
}
export const FormCreateTodo: React.FC<Props> = React.memo((props) => {
  const { handelCreateTodo } = props;

  const [todoCreateTitle, setTodoCreateTitle] = useState('');
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const handleSubmitNewTodo = (event: FormEvent) => {
    event.preventDefault();
    handelCreateTodo(todoCreateTitle);
    setTodoCreateTitle('');
  };

  return (
    <form onSubmit={handleSubmitNewTodo}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoCreateTitle}
        onChange={(event) => setTodoCreateTitle(event.target.value)}
      />
      <button type="submit" aria-label="Save" style={{ display: 'none' }} />
    </form>
  );
});
