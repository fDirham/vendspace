import ModalBase from 'components/all/ModalBase';
import { ModalBaseProps } from 'components/all/ModalBase/ModalBase';
import StyledButton from 'components/all/StyledButton';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { ItemVisual } from 'utilities/types';
import styles from './ModalVisualUploader.module.scss';
import CropImageRepage from 'components/repages/CropImageRepage';
import 'cropperjs/dist/cropper.css';
import { dataURLtoFile } from 'utilities/helpers';

export type UploaderModalOperation = {
  operation: string;
  file?: File;
};

type ModalVisualUploaderProps = {
  uploadingIndex: number;
  onClose: (op: UploaderModalOperation) => void;
  modalPreviewVisual: undefined | ItemVisual;
};

// Need to change operation to an ENUM or smth
export default function ModalVisualUploader(props: ModalVisualUploaderProps) {
  const [localFile, setLocalFile] = useState<File>();
  const [originalImgSrc, setOriginalImageSrc] = useState<string>();
  const [croppedImgSrc, setCroppedImgSrc] = useState<string>();
  const [preview, setPreview] = useState<string>();
  const [cropping, setCropping] = useState<boolean>(false);

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!localFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(localFile);
    setPreview(objectUrl);
    setOriginalImageSrc(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [localFile]);

  // For if preview of file is different
  useEffect(() => {
    if (props.modalPreviewVisual) {
      if (props.modalPreviewVisual.file) {
        setLocalFile(props.modalPreviewVisual.file);
      } else {
        setPreview(props.modalPreviewVisual.uri);
        setOriginalImageSrc(props.modalPreviewVisual.uri);
        setLocalFile(undefined);
      }
    } else {
      setLocalFile(undefined);
      setOriginalImageSrc(undefined);
      setPreview(undefined);
    }
  }, [props.modalPreviewVisual]);

  function closeCleanup() {
    setPreview(undefined);
    setLocalFile(undefined);
  }

  // Normal close
  function overrideClose() {
    // if (!!localFile) {
    //   const res = confirm('Do you really want to close before saving?');
    //   if (!res) return;
    // }

    closeCleanup();
    props.onClose({ operation: 'same' });
  }

  // When save button is pushed
  function updateClose() {
    if (croppedImgSrc) {
      const name = localFile
        ? localFile.name
        : `cropped_${props.uploadingIndex}.png`;
      const newFile = dataURLtoFile(croppedImgSrc, name);
      props.onClose({ operation: 'new', file: newFile });
    } else if (!!localFile)
      props.onClose({ operation: 'new', file: localFile as File });
    else props.onClose({ operation: 'same' });

    closeCleanup();
  }

  // When clear button is pushed
  function clearClose() {
    const res = confirm('Do you really want to delete this picture?');
    if (!res) return;
    props.onClose({ operation: 'clear' });
    closeCleanup();
  }

  function makeCover() {
    props.onClose({ operation: 'bump', file: localFile });
    closeCleanup();
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length) {
      setLocalFile(e.target.files[0]);
      setCropping(true);
    } else setLocalFile(undefined);
  }

  function handleCrop(data: string) {
    setCropping(false);
    setCroppedImgSrc(data);
    setPreview(data);
  }

  const renderContent = (modalProps: ModalBaseProps) => {
    if (cropping) {
      return (
        <div className={styles.cropContainer}>
          <CropImageRepage
            onClose={() => setCropping(false)}
            onCrop={handleCrop}
            srcImage={originalImgSrc!}
          />
        </div>
      );
    }
    return (
      <>
        <div className={styles.previewContainer}>
          {preview && (
            <img
              src={preview}
              className={styles.previewImage}
              onClick={() => setCropping(true)}
            />
          )}
        </div>
        <input
          type='file'
          accept='image/png, image/jpeg, image/gif'
          onChange={handleChange}
        />
        <p className={styles.explainText}>
          Square images recommended. <br />
          <b>Tap image preview to crop.</b>
        </p>
        <div className={styles.buttonsContainer}>
          {!!preview && (
            <>
              <StyledButton mini className={styles.button} onClick={clearClose}>
                clear
              </StyledButton>
            </>
          )}
          {props.uploadingIndex !== 0 && !!preview && (
            <StyledButton mini className={styles.button} onClick={makeCover}>
              make cover
            </StyledButton>
          )}
          <StyledButton mini className={styles.button} onClick={updateClose}>
            save
          </StyledButton>
        </div>
      </>
    );
  };

  return (
    <ModalBase
      open={props.uploadingIndex !== -1}
      onClose={overrideClose}
      renderContent={renderContent}
      containerClassName={styles.container}
      canClose
    />
  );
}
