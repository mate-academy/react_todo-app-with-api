import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { addTodos } from '../api/todos';
import { TodosContext } from './TodosContext';
import { createTodo } from '../utils/createTodo';
import { keyEventMap } from '../utils/keyEventMap';
import { EventKey } from '../types/EventKey';
import { Error } from '../types/Error';

export const TodosInputForm: React.FC = () => {
  const {
    todos,
    setTodos,
    setTempTodo,
    setErrorMessage,
  } = useContext(TodosContext);
  const [newTitle, setNewTitle] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const todoInput = useRef<HTMLInputElement>(null);
  // const [currentKey, setCurrentKey] = useState('');

  useEffect(() => {
    if (todoInput.current) {
      todoInput.current.focus();
    }
  });

  const handleSubmit = () => {
    if (newTitle.trim()) {
      const newTodo = createTodo(newTitle);
      const { userId, title, completed } = newTodo;

      setIsPosting(true);
      setTempTodo(newTodo);

      addTodos({ userId, title, completed })
        .then((savedTodo) => {
          setTodos([...todos, savedTodo]);
          setNewTitle('');
        }).catch(() => setErrorMessage(Error.post))
        .finally(() => {
          setIsPosting(false);
          setTempTodo(null);
        });

      return;
    }

    setErrorMessage(Error.submit);
  };

  const handleKeyDown = (e:React.KeyboardEvent) => {
    if (keyEventMap[e.key] === EventKey.Enter) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form>
      <input
        type="text"
        data-cy="NewTodoField"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={todoInput}
        value={newTitle}
        disabled={isPosting}
        onChange={(e) => setNewTitle(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e)}
      />
    </form>
  );
};
