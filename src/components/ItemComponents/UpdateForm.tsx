import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../TodosContext';

type Props = {
  todo: Todo
  setIsEdit: (val: boolean) => void
};

export const UpdateForm: React.FC<Props> = ({ todo, setIsEdit }) => {
  const { doUpdate, doDelete } = useContext(TodosContext);
  const [newTitle, setNewTitle] = useState(todo.title);
  const input = useRef<HTMLInputElement>(null);
  const finalSketch = newTitle.trim();

  useEffect(() => (input.current ? input.current.focus() : () => {}));

  const doBlure = () => {
    if (input.current) {
      input.current.blur();
    }

    setIsEdit(false);
  };

  const handleUdate = () => (finalSketch
    ? doUpdate({ ...todo, title: finalSketch })
    : doDelete(todo.id.toString()));

  const handleBlure = () => {
    if (finalSketch !== todo.title) {
      handleUdate();
    }

    doBlure();
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case ('Escape'): doBlure(); break;
      case ('Enter'): handleBlure(); break;
      default: break;
    }
  };

  return (
    <form>
      <input
        type="text"
        data-cy="TodoTitleField"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
        onChange={(e) => setNewTitle(e.target.value)}
        onKeyUp={handleKeyUp}
        onBlur={handleBlure}
        value={newTitle}
        ref={input}
      />
    </form>
  );
};
