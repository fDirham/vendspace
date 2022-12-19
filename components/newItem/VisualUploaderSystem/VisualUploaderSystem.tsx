import React, { useState } from 'react';
import { MAX_ITEM_VISUALS } from 'utilities/constants';
import { ItemVisual } from 'utilities/types';
import ModalVisualUploader from '../ModalVisualUploader';
import VisualPlaceholder from '../VisualPlaceholder';
import styles from './VisualUploaderSystem.module.scss';
import { UploaderModalOperation } from '../ModalVisualUploader/ModalVisualUploader';

type VisualUploaderSystemProps = {
  visuals: ItemVisual[];
  setVisuals: (newVisuals: ItemVisual[]) => void;
  visualsToDelete: boolean[];
  setVisualsToDelete: (newVal: boolean[]) => void;
};

export default function VisualUploaderSystem({
  visuals,
  setVisuals,
  visualsToDelete,
  setVisualsToDelete,
}: VisualUploaderSystemProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number>(-1);
  const [modalPreviewVisual, setModalPreviewVisual] = useState<
    ItemVisual | undefined
  >();

  function handlePlaceholderClick(index: number) {
    setModalPreviewVisual(visuals[index]);
    setUploadingIndex(index);
  }

  function handleCloseUploaderModal(op: UploaderModalOperation) {
    const newVisuals: (ItemVisual | undefined)[] = [...visuals];
    const currentVisual = newVisuals[uploadingIndex];
    const { operation, file } = op;

    if (operation === 'clear') {
      // Clear placeholder
      // Differentiate between clearing existing and none
      // If none existing then don't change
      // If currentVisual exists, could be that we just added
      // If uri exists, we definitely have an image stored

      if (currentVisual) {
        if (currentVisual.uri) {
          // Add to deleted
          const newDeleted = [...visualsToDelete];
          newDeleted[uploadingIndex] = true;
          setVisualsToDelete(newDeleted);
        }

        // Remove from visuals
        newVisuals[uploadingIndex] = undefined;
      }
    } else if (operation == 'same') {
      // Do nothing
    } else if (operation == 'bump') {
      // Make currentVisual cover
      newVisuals[uploadingIndex] = undefined;
      if (file) {
        newVisuals.unshift({
          uri: currentVisual ? currentVisual.uri : '',
          file: file,
        });
      } else newVisuals.unshift(currentVisual);
    } else if (operation == 'new') {
      // Treat data as a file and set it to upload
      const newVisual = {
        uri: currentVisual ? currentVisual.uri : '',
        file: file,
      };

      newVisuals[uploadingIndex] = newVisual;
    }

    const structuredVisuals = restructureVisuals(newVisuals);

    setVisuals(structuredVisuals);
    setModalPreviewVisual(undefined);
    setUploadingIndex(-1);
  }

  function restructureVisuals(
    unstructured: (ItemVisual | undefined)[]
  ): ItemVisual[] {
    const toReturn: ItemVisual[] = [];
    unstructured.forEach((el) => {
      if (el) toReturn.push(el);
    });

    return toReturn;
  }

  const renderPlaceholders = () => {
    const renderLength = Math.min(visuals.length + 1, MAX_ITEM_VISUALS);
    const toReturn = [];

    for (let i = 0; i < renderLength; i++) {
      let visual: ItemVisual | undefined = undefined;

      if (i < visuals.length) {
        visual = visuals[i];
      }

      toReturn.push(
        <VisualPlaceholder
          visual={visual}
          key={i}
          onClick={() => handlePlaceholderClick(i)}
        />
      );
    }
    return toReturn;
  };

  return (
    <div className={styles.container}>
      <ModalVisualUploader
        uploadingIndex={uploadingIndex}
        onClose={handleCloseUploaderModal}
        modalPreviewVisual={modalPreviewVisual}
      />
      {renderPlaceholders()}
    </div>
  );
}
