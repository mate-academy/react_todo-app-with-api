import { useContext, useState } from 'react';
import cn from 'classnames';
import { TodosContext } from './TodoProvider';
import * as postServise from '../api/todos';
import { Errors } from '../types/Errors';

export const TodoList: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const {
    todos,
    setTodos,
    setError,
    removeTodo,
    filteredTodo,
  } = useContext(TodosContext);

  const toggleTodo = async (todoId: number) => {
    const completedTodo = todos.map(todo => (
      todo.id === todoId
        ? { ...todo, completed: !todo.completed }
        : { ...todo }
    ));
    const currentTodo = completedTodo.find(complted => complted.id === todoId);

    try {
      await postServise.updateTodo({
        todo: currentTodo,
        todoId,
      });
    } catch {
      setError(Errors.UNABLE_UPDATE);
    }

    setTodos(completedTodo);
  };

  const handleDoubleClick = (id: number) => {
    setEditId(id);
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>,
    editingId: number,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setIsEditing(false);

      const currentTodo = todos.find(todo => todo.id === editingId);

      if (currentTodo) {
        try {
          const updatedTitle = event.currentTarget.value;
          const updatedTodos = todos.map(todo => {
            if (todo.id === editingId) {
              return { ...todo, title: updatedTitle };
            }

            return todo;
          });

          await postServise.updateTodo({
            todo: { ...currentTodo, title: updatedTitle },
            todoId: editingId,
          });

          setTodos(updatedTodos);
        } catch (updateError) {
          setError(Errors.UNABLE_UPDATE);
        }
      }
    }
  };

  const handleEditingChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    editingId: number,
  ) => {
    const completedTodo = todos.map(todo => {
      if (todo.id === editingId) {
        return { ...todo, title: event.target.value };
      }

      return todo;
    });

    setTodos(completedTodo);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodo.map((todo) => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={cn('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              onClick={() => toggleTodo(todo.id)}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          {isEditing && editId === todo.id ? (
            <input
              type="text"
              value={todo.title}
              className="todo__title-field"
              onBlur={handleBlur}
              onChange={(e) => handleEditingChange(e, todo.id)}
              onKeyPress={(e) => handleKeyPress(e, todo.id)}
            />
          ) : (
            <>
              <span
                onDoubleClick={() => handleDoubleClick(todo.id)}
                data-cy="TodoTitle"
                className="todo__title"
              >
                {todo.title}

              </span>
            </>
          )}

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => removeTodo(todo.id)}
          >
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
