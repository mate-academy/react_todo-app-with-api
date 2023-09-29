/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';

const USER_ID = 0;

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <section className="section container">
      <p className="title is-4">
        Copy all you need from the prev task:
        <br />
        <a href="https://github.com/mate-academy/react_todo-app-add-and-delete#react-todo-app-add-and-delete">React Todo App - Add and Delete</a>
      </p>

      <p className="subtitle">Styles are already copied</p>
    </section>
  );
};
