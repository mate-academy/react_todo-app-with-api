/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useState,
} from 'react';
import * as todosServise from './api/todos';
import { Error } from './components/errors/Error';
import { Footer } from './components/footer/Footer';
import { Header } from './components/header/Header';
import { TodoList } from './components/todoList/TodoList';
import { TodosContext } from './TodosContext';
import { ErrorType, USER_ID } from './helpers/helpers';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { actions } from './helpers/reducer';

export const TodoApp: React.FC = () => {
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const {
    todos,
    dispatch,
    setIsSubmitting,
    setErrorMessage,
    setIsLoading,
    setDeletedId,
    setTitle,
  } = useContext(TodosContext);

  const addId = (id: number) => {
    setDeletedId(prev => [...prev, id]);
  };

  const removeId = (id: number) => {
    setDeletedId(prev => prev.filter(prevId => prevId !== id));
  };

  const onAdd = useCallback((newtitle: string) => {
    const temporaryTodo = {
      id: 0,
      title: newtitle,
      userId: USER_ID,
      completed: false,
    };

    const newTodo: Omit<Todo, 'id'> = {
      title: newtitle,
      userId: USER_ID,
      completed: false,
    };

    setErrorMessage('');
    setIsSubmitting(true);
    setTempTodo(temporaryTodo);

    todosServise.createTodos(newTodo)
      .then(todo => dispatch(actions.add(todo)))
      .catch((error) => {
        setErrorMessage(ErrorType.CreateTodo);
        throw error;
      })
      .then(() => setTitle(''))
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  }, []);

  const onDelete = (todoId: number) => {
    addId(todoId);
    setErrorMessage('');
    setIsLoading(true);

    todosServise.deleteTodos(todoId)
      .then(() => {
        dispatch(actions.delete(todoId));
      })
      .catch((error) => {
        setErrorMessage(ErrorType.DeleteTodo);
        throw error;
      })
      .finally(() => {
        setIsLoading(false);
        removeId(todoId);
      });
  };

  const onUpdate = useCallback((updatedTodo: Todo) => {
    addId(updatedTodo.id);
    setErrorMessage('');
    setIsLoading(true);

    return todosServise.updateTodo(updatedTodo)
      .then(item => dispatch(actions.update(item)))
      .catch((error) => {
        setErrorMessage(ErrorType.UpdateTodo);
        throw error;
      })
      .finally(() => {
        setIsLoading(false);
        removeId(updatedTodo.id);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onUpdate={onUpdate}
          onAdd={onAdd}
        />

        <TodoList
          onDelete={onDelete}
          onUpdate={onUpdate}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <Footer onDelete={onDelete} />
        )}
      </div>

      <Error />
    </div>
  );
};
