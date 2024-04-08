import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { TodoContext } from '../../context/TodoContext';
import * as todoService from '../../api/todos';
import { USER_ID } from '../../api/todos';
// import { Todo } from '../../types/Todo';
import { Errors } from '../../types/Errors';

// type Props = {
//   todo: Todo;
// };

export const Header: React.FC = () => {
  const { todos, setTodos, setErrorMessage, setTempTodo, titleField } =
    useContext(TodoContext);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allTodosAreCompleted = todos.every(task => task.completed === true);

  useEffect(() => {
    if (titleField && titleField.current) {
      titleField.current.focus();
    }
  }, []);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const addTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const correctTitle = newTodoTitle.trim();
    const emptyTitle = correctTitle.length <= 0;

    if (correctTitle && !emptyTitle) {
      setIsSubmitting(true);
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: correctTitle,
        completed: false,
      });

      todoService
        .createTodo({
          userId: USER_ID,
          title: correctTitle,
          completed: false,
        })
        .then(newTodo => {
          setTodos(currentTodos => [...currentTodos, newTodo]);
          setNewTodoTitle('');
        })
        .catch(() => {
          setErrorMessage(Errors.AddError);
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        })
        .finally(() => {
          setIsSubmitting(false);
          setTempTodo(null);

          setTimeout(() => {
            if (titleField.current) {
              titleField.current.focus();
            }
          }, 0);
        });
    } else {
      setErrorMessage(Errors.EmptyTitle);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  const getTododsToUpdate = tasks => {
    const hasSomeActiveTodos = tasks.some(t => t.completed === false);

    if (hasSomeActiveTodos) {
      return todos.filter(t => t.completed === false);
    }

    return todos;
  };

  const changeAllTodosStatus = () => {
    const todosToUpdate = getTododsToUpdate(todos);

    todosToUpdate.forEach(currentTodo => {
      todoService
        .updateTodo({ ...currentTodo, completed: !currentTodo.completed })
        .then(updatedTodo => {
          setTodos(prevtodos =>
            prevtodos.map(task =>
              task.id === updatedTodo.id ? updatedTodo : task,
            ),
          );
          // eslint-disable-next-line
          console.log(updatedTodo);
        })
        .catch(() => {
          setErrorMessage(Errors.UpdateError);
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        }); // .finally(() => {});
    });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: allTodosAreCompleted,
          })}
          data-cy="ToggleAllButton"
          aria-label="toggleAllButton"
          onClick={changeAllTodosStatus}
          // onClick={getTododsToUpdate}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={addTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleField}
          value={newTodoTitle}
          onChange={handleTitleChange}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};

// if (isDuplicate) {
//   setErrorMessage('This title already exists');
// }

// .catch((error: any) => {
//    setErrorMessage(Errors.AddError);
//    setTimeout(() => {
//       setErrorMessage('');
//    }, 3000);
//    throw error;
// })

// const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//   if (errorMessage) {
//     setErrorMessage('');
//   }

//   setNewTodoTitle(event.target.value);
// };

// eslint-disable-next-line
// console.log('finnaly');

// .catch(() => {
//   setErrorMessage(Errors.AddError);
//   setTimeout(() => {
//     setErrorMessage('');
//   }, 3000);
// })

// const changeStatus = () => {
//   const todosToUpdate = todos.filter(t => t.completed);
//   const notAllCompleted = todos.some(t => !t.completed);

//   if (notAllCompleted) {
//     setTodos(prevTodos =>
//       prevTodos.map(task => ({ ...task, completed: true })),
//     );
//   } else {
//     setTodos(prevTodos =>
//       prevTodos.map(task => ({ ...task, completed: false })),
//     );
//   }

//   changeAllTodosStatus(todosToUpdate);
// };
