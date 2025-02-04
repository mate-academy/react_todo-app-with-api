import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Toggle } from '../types/Toggle';

type Props = {
  todos: Todo[];
  newTaskTitle: string;
  setNewTaskTitle: React.Dispatch<React.SetStateAction<string>>;
  addTask: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  toggleAllTodos: (toggle: Toggle) => void;
};

export const TodoHeader: React.FC<Props> = props => {
  const {
    todos: taskList,
    newTaskTitle,
    setNewTaskTitle,
    addTask,
    isLoading,
    inputRef,
    toggleAllTodos,
  } = props;

  const completedTasks = taskList.filter(task => task.completed);
  const activeTasks = taskList.filter(task => !task.completed);
  const pendingTasks = taskList.length - completedTasks.length;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTask(event);
  };

  const onToggle = () => {
    if (activeTasks.length === 0) {
      toggleAllTodos(Toggle.AllActive);
    } else {
      toggleAllTodos(Toggle.AllCompleted);
    }
  };

  return (
    <header className="todoapp__header">
      {taskList.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: pendingTasks === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={() => onToggle()}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTaskTitle}
          onChange={event => setNewTaskTitle(event.target.value)}
          ref={inputRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
