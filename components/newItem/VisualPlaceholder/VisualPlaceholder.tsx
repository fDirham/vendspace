import React, { useEffect, useState } from 'react';
import { ItemVisual } from 'utilities/types';
import styles from './VisualPlaceholder.module.scss';

type VisualPlaceholderProps = {
  visual?: ItemVisual;
  onClick: () => void;
};

export default function VisualPlaceholder(props: VisualPlaceholderProps) {
  const [previewSrc, setPreviewSrc] = useState<string>('');

  useEffect(() => {
    if (!props.visual) {
      setPreviewSrc('');
    } else if (props.visual.file) {
      const objectUrl = URL.createObjectURL(props.visual.file);
      setPreviewSrc(objectUrl);

      // free memory when ever this component is unmounted
      // Might not actually work because of structure but who knows
      return () => URL.revokeObjectURL(objectUrl);
    } else if (props.visual.uri) {
      setPreviewSrc(props.visual.uri);
    } else setPreviewSrc('');
  }, [props.visual]);

  const renderContent = () => {
    /*
    TODO: Add plus sign to placeholder
    */
    if (previewSrc) {
      return <img src={previewSrc} className={styles.previewImg} />;
    }
    return <img src={'/icons/add.png'} className={styles.placeholder} />;
  };
  return (
    <div className={styles.container} onClick={props.onClick}>
      {renderContent()}
    </div>
  );
}
