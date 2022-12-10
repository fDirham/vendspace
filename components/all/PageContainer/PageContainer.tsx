import { useWindowSize } from 'hooks/useWindowSize';
import React from 'react';
import { breakpointMobile } from 'styles/constants/media';
import styles from './PageContainer.module.scss';

type PageContainerProps = {
  children: any;
};

export default function PageContainer({ children }: PageContainerProps) {
  const windowSize = useWindowSize();

  if (windowSize.width > breakpointMobile)
    return (
      <div className={styles.desktopContainer}>
        <div></div>
        <div className={styles.desktopMain}>{children}</div>
      </div>
    );

  return <main className={styles.mobileMain}>{children}</main>;
}
