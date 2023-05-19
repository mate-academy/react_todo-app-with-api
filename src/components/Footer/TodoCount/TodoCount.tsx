import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FooterContext } from '../../../context/FooterContext';

export const TodoCount: React.FC = React.memo(() => {
  const { notCompletedTodoCount } = useContext(FooterContext);
  const { t } = useTranslation();

  return (
    <span className="todo-count">
      {t(notCompletedTodoCount === 1
        ? 'Footer.count_one'
        : 'Footer.count_other', { count: notCompletedTodoCount })}
    </span>
  );
});
