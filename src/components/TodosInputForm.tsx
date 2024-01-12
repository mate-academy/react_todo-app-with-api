import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { addTodos } from '../api/todos';
import { Error } from '../types/Error';
import { createTodo } from '../utils/createTodo';
import { TodosContext } from './TodosContext';

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
        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
        onKeyUp={(e) => e.key === 'Enter' && handleSubmit()}
      />
    </form>
  );
};
