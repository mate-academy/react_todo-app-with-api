import { errorType } from '../../types/ErrorType';
import classNames from 'classnames';
import { useState } from 'react';
import { addTodo, updateCompletedTodo, USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { useTodoContext } from '../../context/TodoProvider';

export const ToDoHeader = () => {
  const {
    tasks,
    setTasks,
    focusInput,
    setErrorMessage,
    setTempTodo,
    setIsUpdating,
    isSubmitting,
    setIsSubmitting,
    inputRef,
    completedTodos,
  } = useTodoContext();
  const [taskTitle, setTaskTitle] = useState('');
  const areTasksDone = tasks.length === completedTodos.length;
  const taskCounter = tasks.length;

  const addNewTodo = (creatNewTodo: Todo) => {
    addTodo(creatNewTodo)
      .then(response => {
        setTasks([...tasks, response]);
        setTaskTitle('');
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage(errorType.add);
        setTempTodo(null);
      })
      .finally(() => {
        setIsSubmitting(false);
        setIsUpdating([]);
        focusInput();
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = taskTitle.trim();

    if (!title) {
      setErrorMessage(errorType.empty);

      return;
    }

    const newTodo = {
      title: title,
      userId: USER_ID,
      completed: false,
      id: 0,
    };

    setIsSubmitting(true);
    setIsUpdating([newTodo.id]);
    setTempTodo({
      title: title,
      userId: USER_ID,
      completed: false,
      id: 0,
    });
    addNewTodo(newTodo);
  };

  const handleAllCompleted = async () => {
    let updateTasksIds: number[] = [];

    if (!areTasksDone) {
      const tasksToUpdate = tasks.filter(task => !task.completed);

      await Promise.all(
        tasksToUpdate.map(task => {
          updateTasksIds = [...updateTasksIds, task.id];
          setIsUpdating(updateTasksIds);
          updateCompletedTodo(task.id, { ...task, completed: true })
            .then(() => {
              setTasks(
                tasks.map(todo => ({
                  ...todo,
                  completed: true,
                })),
              );
            })
            .catch(() => {
              setErrorMessage(errorType.updateTodo);
            })
            .finally(() => {
              setIsUpdating([]);
            });
        }),
      );
    } else {
      await Promise.all(
        tasks.map(task => {
          updateTasksIds = [...updateTasksIds, task.id];
          setIsUpdating(updateTasksIds);
          updateCompletedTodo(task.id, { ...task, completed: false })
            .then(() => {
              setTasks(
                tasks.map(todo => ({
                  ...todo,
                  completed: false,
                })),
              );
            })
            .catch(() => {
              setErrorMessage(errorType.updateTodo);
            })
            .finally(() => {
              setIsUpdating([]);
            });
        }),
      );
    }
  };

  return (
    <header className="todoapp__header">
      {taskCounter > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areTasksDone,
          })}
          data-cy="ToggleAllButton"
          onClick={() => handleAllCompleted()}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          value={taskTitle}
          onChange={event => setTaskTitle(event.target.value)}
          placeholder="What needs to be done?"
          disabled={isSubmitting}
          ref={inputRef}
          autoFocus
        />
      </form>
    </header>
  );
};
