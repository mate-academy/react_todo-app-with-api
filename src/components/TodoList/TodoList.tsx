import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { errorType } from '../../types/ErrorType';
import { useRef, useState } from 'react';
import { deleteTodo, updateCompletedTodo } from '../../api/todos';
import { Status } from '../../types/Status';
import { TempTodo } from '../TempTodo/TempTodo';
import { TodoEditForm } from '../TodoEditForm/TodoEditForm';
import { useTodoContext } from '../../context/TodoProvider';
import { TodoLoader } from '../TodoLoader/TodoLoader';

export const TodoList = () => {
  const {
    focusInput,
    tasks,
    setTasks,
    tempTodo,
    setErrorMessage,
    setIsUpdating,
    status,
    isUpdating,
  } = useTodoContext();
  const [newTitle, setNewTitle] = useState('');
  const [editMode, setEditMode] = useState<number[]>([]);
  const editRef = useRef<HTMLInputElement>(null);

  const deleteTask = (id: number) => {
    setIsUpdating([...isUpdating, id]);
    deleteTodo(id)
      .then(() => {
        if (editMode.length > 0) {
          setEditMode([]);
        }

        setTasks(prevTasks => prevTasks.filter(todo => todo.id !== id));
        setIsUpdating(prevState => prevState.filter(taskId => taskId !== id));
        focusInput();
      })
      .catch(() => {
        if (editMode.length > 0) {
          setEditMode([id]);
        }

        setErrorMessage(errorType.deleteTask);
      });
  };

  const handleDoubleClick = (updateTitle: string, id: number) => {
    setEditMode([id]);
    setNewTitle(updateTitle);
  };

  const filterTodo: (todos: Todo[], mode: Status) => Todo[] = (todos, mode) => {
    switch (mode) {
      case Status.completed:
        return todos.filter(task => task.completed);
      case Status.active:
        return todos.filter(task => !task.completed);
      case Status.all:
      default:
        return tasks;
    }
  };

  const filteredTodos = filterTodo(tasks, status);

  const handleCompleted = (id: number) => {
    setIsUpdating([...isUpdating, id]);
    const todoToUpdate = tasks.find(todo => todo.id === id);

    if (!todoToUpdate) {
      setErrorMessage(errorType.found);

      return;
    }

    updateCompletedTodo(id, {
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
    })
      .then(() => {
        setTasks(prevTasks =>
          prevTasks.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo,
          ),
        );
        setIsUpdating(prevState => prevState.filter(taskId => taskId !== id));
        // setIsUpdating([]);
      })
      .catch(() => {
        setErrorMessage(errorType.updateTodo);
        setIsUpdating([]);
      });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(task => {
        const { title, completed, id } = task;

        return (
          <div
            key={id}
            data-cy="Todo"
            className={classNames('todo', { completed: completed })}
          >
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label
              htmlFor={`Input-task-title#${id}`}
              className="todo__status-label"
            >
              <input
                id={`Input-task-title#${id}`}
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                onChange={() => handleCompleted(id)}
                checked={completed}
              />
            </label>
            {editMode.includes(id) ? (
              <TodoEditForm
                tasks={tasks}
                setCanEdit={setEditMode}
                setNewTitle={setNewTitle}
                newTitle={newTitle}
                deleteTask={deleteTask}
                taskId={id}
                editRef={editRef}
              />
            ) : (
              <>
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => {
                    handleDoubleClick(title, id);
                  }}
                >
                  {title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => deleteTask(id)}
                >
                  ×
                </button>
              </>
            )}
            <TodoLoader taskId={id} />
          </div>
        );
      })}
      {tempTodo && <TempTodo />}
    </section>
  );
};
