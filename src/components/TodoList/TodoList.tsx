import React, { useContext } from 'react';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';
import { deleteTodo, modifyTodo } from '../../api/todos';
import { LoadDeleteContext } from '../../LoadDeleteContext';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  removeTodo: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  removeTodo,
}) => {
  const { setLoadDelete } = useContext(LoadDeleteContext);

  const updateTodo = (
    event: React.ChangeEvent<HTMLInputElement>,
    todo: Todo,
  ) => {
    const { checked } = event.target;

    setLoadDelete([todo.id]);
    modifyTodo(todo.id, { ...todo, completed: checked })
      .then(() => {
        setTodos((prevState: Todo[]) => {
          return prevState.map(prevTodo => {
            if (prevTodo.id === todo.id) {
              return {
                ...todo,
                completed: checked,
              };
            }

            return prevTodo;
          });
        });
      })
      .catch(() => {
        throw new Error('Unable to update todo');
      })
      .finally(() => setLoadDelete([]));
  };

  const clearTodo = (todo: Todo) => {
    setLoadDelete([todo.id]);
    deleteTodo(todo.id)
      .then(() => removeTodo(todo.id))
      .catch(() => 'Unable to delete todo')
      .finally(
        () => setLoadDelete([]),
      );
  };

  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          updateTodo={updateTodo}
          clearTodo={clearTodo}
        />
      ))}
    </ul>
  );
};
