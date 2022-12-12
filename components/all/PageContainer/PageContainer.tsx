import useWindowSize from 'hooks/useWindowSize';
import React from 'react';
import { breakpointMobile } from 'styles/constants/media';
import styles from './PageContainer.module.scss';

type PageContainerProps = {
  children: any;
  className?: string;
};

export default function PageContainer({
  children,
  className,
}: PageContainerProps) {
  const windowSize = useWindowSize();

  if (windowSize.width > breakpointMobile)
    return (
      <div className={styles.desktopContainer}>
        <div></div>
        <div className={styles.desktopMain + ' ' + className}>{children}</div>
      </div>
    );

  return (
    <main className={styles.mobileMain + ' ' + className}>{children}</main>
  );
}
