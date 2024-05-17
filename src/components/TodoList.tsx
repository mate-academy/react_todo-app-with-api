import { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { Status } from '../enums/Status';
import {
  deleteTodoItem,
  updateTodoStatus,
  updateTodoTitle,
} from '../api/todos';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  status: Status;
  tempTodo: Todo | null;
  onError: (error: string) => void;
  mainRef: React.RefObject<HTMLInputElement>;
  isUpdating: boolean;
  isDeletingCompleted: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  status,
  tempTodo,
  onError,
  mainRef,
  isUpdating,
  isDeletingCompleted,
}) => {
  const [editValue, setEditValue] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.focus();
    }
  }, [isDeleting, mainRef]);

  const toggle = (id: number, completed: boolean) => {
    return updateTodoStatus({ id, completed: !completed })
      .then(updatedTodo => {
        setTodos(currentTodos => {
          const todosCopy = [...currentTodos];
          const chosenTodoIndex = currentTodos.findIndex(
            todo => todo.id === id,
          );

          todosCopy.splice(chosenTodoIndex, 1, updatedTodo);

          return todosCopy;
        });
      })
      .catch(error => {
        onError('Unable to update a todo');
        throw error;
      })
      .finally(() => setTimeout(() => onError(''), 3000));
  };

  const deleteTodo = (id: number) => {
    setIsDeleting(true);

    return deleteTodoItem(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(error => {
        onError('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setTimeout(() => onError(''), 3000);
        setIsDeleting(false);
      });
  };

  const saveTodo = (id: number) => {
    if (!editValue) {
      return deleteTodo(id);
    }

    setTodos(currentTodos => {
      const todosCopy = [...currentTodos];
      const chosenTodo = todosCopy.find(todo => todo.id === id) as Todo;

      chosenTodo.title = editValue;

      return todosCopy;
    });

    return updateTodoTitle({ id, title: editValue })
      .catch(error => {
        setTodos(todos);
        onError('Unable to update a todo');
        throw error;
      })
      .finally(() => setTimeout(() => onError(''), 3000));
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos
        .filter(todo => {
          if (status === Status.all) {
            return true;
          }

          if (status === Status.active) {
            return !todo.completed;
          }

          if (status === Status.completed) {
            return todo.completed;
          }

          return true;
        })
        .map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={deleteTodo}
            onToggle={toggle}
            editValue={editValue}
            setEditValue={setEditValue}
            onSave={saveTodo}
            unique={false}
            isUpdatingAll={
              !todo.completed || todos.every(item => item.completed)
                ? isUpdating
                : false
            }
            isDeletingCompleted={todo.completed ? isDeletingCompleted : false}
          />
        ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={deleteTodo}
          onToggle={toggle}
          editValue={editValue}
          setEditValue={setEditValue}
          onSave={saveTodo}
          unique={true}
        />
      )}
    </section>
  );
};
