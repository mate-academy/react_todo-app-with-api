import React, {
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { getAllTodos } from './api/todos';
import { TodoContext } from './TodoContext/TodoContext';
import { UserWarning } from './UserWarning';
import { TodoError } from './Components/TodoError';
import { TodosFooter } from './Components/TodosFooter';
import { USER_ID } from './utils/globalConst';
import { AddTodoForm } from './Components/AddTodoForm';
import { TodoList } from './Components/TodoList';

export const App: React.FC = () => {
  const {
    setTodos,
    setEditTodoTitle,
    setEditingTodoId,
  } = useContext(TodoContext);

  useEffect(() => {
    getAllTodos(USER_ID)
      .then(setTodos);
  }, []);

  const handleEscKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setEditTodoTitle('');
        setEditingTodoId(null);
      }
    }, [],
  );

  useEffect(() => {
    document.addEventListener('keyup', handleEscKeyUp);

    return () => {
      document.removeEventListener('keyup', handleEscKeyUp);
    };
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <AddTodoForm />

        <TodoList />

        <TodosFooter />
      </div>

      <TodoError />
    </div>
  );
};
