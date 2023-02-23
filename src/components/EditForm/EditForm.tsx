import React, {
  useState,
  ChangeEvent,
  FormEvent,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todoForChange: Todo,
  onHandleEditTodo: (todo: Todo) => void,
  onModalClose: (value: boolean) => void,
  onDeleteTodo: (id: number) => void,
};

export const EditForm: React.FC<Props> = ({
  todoForChange,
  onHandleEditTodo,
  onModalClose,
  onDeleteTodo,
}) => {
  const [formTitle, setFormTitile] = useState(todoForChange.title);

  const handleFormTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setFormTitile(value);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    const changedTodo = {
      ...todoForChange,
      title: formTitle,
    };

    if (!formTitle.trim()) {
      onDeleteTodo(todoForChange.id);
    }

    onHandleEditTodo(changedTodo);
    onModalClose(false);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onModalClose(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={formTitle}
        onChange={handleFormTitle}
        onKeyUp={handleKeyUp}
        onBlur={handleFormSubmit}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      />
    </form>
  );
};
