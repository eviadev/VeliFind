import type { FC, ReactNode } from 'react';

type AlertMessageProps = {
  children: ReactNode;
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark';
  className?: string;
};

export const AlertMessage: FC<AlertMessageProps> = ({ children, variant = 'danger', className }) => {
  const classes = ['alert', `alert-${variant}`];

  if (className) {
    classes.push(className);
  }

  return (
    <div className={classes.join(' ')} role="alert">
      {children}
    </div>
  );
};
