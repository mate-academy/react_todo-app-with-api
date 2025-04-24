import React, { useCallback, useEffect } from 'react';
import { TodoListTypes } from './todo-list.types';
import { TodoItemComponent } from '../todo-Item/todo-item.component';
import { Todo } from '../../types/Todo';
import { updateTodo } from '../../api/todos';
import { text } from '../../constants/text';
import { deleteTodoWithUI } from '../../utils/deleteTodo';

export const TodoListComponent: React.FC<TodoListTypes> = ({
  todos,
  setTodos,
  setCustomError,
  customError,
  loadingId,
  handleLoaderId,
  titleField,
}) => {
  const deleteTodoHandler = (todo: Todo) => {
    handleLoaderId(todo);

    deleteTodoWithUI({
      todo,
      setTodos,
      setCustomError,
      handleLoaderId,
      titleField,
    });
  };

  const handleChange = useCallback(
    (todo: Todo) => {
      setCustomError('');
      handleLoaderId(todo);
      const newTodo = { ...todo, completed: !todo.completed };

      updateTodo(todo.id, newTodo)
        .then(updatedTodoFromServer => {
          setTodos(prevState =>
            prevState.map(currentTodo =>
              currentTodo.id === updatedTodoFromServer.id
                ? updatedTodoFromServer
                : currentTodo,
            ),
          );
          handleLoaderId(todo);
        })
        .catch(err => {
          setCustomError(text.unableToUpdateTodo);
          handleLoaderId(todo);
          throw err;
        });
    },
    [setCustomError, handleLoaderId, setTodos],
  );

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;

    if (customError) {
      timerId = setTimeout(() => setCustomError(''), 3000);
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [customError, setCustomError]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.length > 0 &&
        todos.map(todo => (
          <TodoItemComponent
            handleLoaderId={handleLoaderId}
            titleField={titleField}
            setTodos={setTodos}
            handleChange={handleChange}
            loadingId={loadingId}
            key={todo.id}
            todo={todo}
            deleteTodoHandler={deleteTodoHandler}
            setCustomError={setCustomError}
          />
        ))}
    </section>
  );
};
