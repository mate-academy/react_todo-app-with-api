import { useState } from 'react';

import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';

import { TodoSpan } from './TodoSpan';
import { TodoForm } from './TodoForm';
import { TodoLoader } from './TodoLoader';

type Props = {
  todo: Todo,
  editedTitle: string,
  setEditedTitle: React.Dispatch<React.SetStateAction<string>>,
  title: string,
  editingTodoId: number,
  setEditingTodoId: React.Dispatch<React.SetStateAction<number>>,
  removeTodo: (todoId: number) => Promise<void>,
  updateTodo: (todoId: number, data: Partial<Todo>) => Promise<void>,
  loadingTodosId: number[],
  filter: Filter,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  editedTitle,
  setEditedTitle,
  title,
  editingTodoId,
  setEditingTodoId,
  removeTodo,
  updateTodo,
  loadingTodosId,
  filter,
}) => {
  const [editing, setEditing] = useState(false);

  const toggleTodoStatus = (currentTodo: Todo) => {
    const data = {
      completed: !currentTodo.completed,
    };

    updateTodo(currentTodo.id, data);
  };

  const getDisplayValue = (currentTodo: Todo) => {
    if (filter === Filter.active && currentTodo.completed) {
      return 'none';
    }

    if (filter === Filter.completed && !currentTodo.completed) {
      return 'none';
    }

    return 'grid';
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
      style={{ display: getDisplayValue(todo) }}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onChange={() => toggleTodoStatus(todo)}
        />
      </label>

      {editing && editingTodoId === todo.id ? (
        <TodoForm
          todo={todo}
          editedTitle={editedTitle}
          setEditedTitle={setEditedTitle}
          title={title}
          setEditing={setEditing}
          setEditingTodoId={setEditingTodoId}
          editingTodoId={editingTodoId}
          removeTodo={removeTodo}
          updateTodo={updateTodo}
        />
      ) : (
        <TodoSpan
          todo={todo}
          removeTodo={removeTodo}
          setEditing={setEditing}
          setEditedTitle={setEditedTitle}
          setEditingTodoId={setEditingTodoId}
        />
      )}

      <TodoLoader
        todo={todo}
        loadingTodosId={loadingTodosId}
      />
    </div>
  );
};
