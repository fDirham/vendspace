import React, { useState } from 'react';
import styles from './CropImageRepage.module.scss';
import PageContainer from 'components/all/PageContainer';
import PageHeader from 'components/all/PageHeader';
import StyledButton from 'components/all/StyledButton';
import { Cropper } from 'react-cropper';

type CropImageRepageProps = {
  onClose: () => void;
  srcImage: string;
  onCrop: (data: string) => void;
};

export default function CropImageRepage(props: CropImageRepageProps) {
  const [cropper, setCropper] = useState<any>();
  const getCropData = () => {
    if (typeof cropper !== 'undefined') {
      const data = cropper.getCroppedCanvas().toDataURL();
      if (data) props.onCrop(data);
      else alert('crop failed!');
    }
  };

  return (
    <PageContainer className={styles.container}>
      <PageHeader title={'crop'} />
      <div className={styles.cropContainer}>
        <Cropper
          className={styles.cropper}
          aspectRatio={1}
          src={props.srcImage}
          viewMode={1}
          minCropBoxHeight={100}
          minCropBoxWidth={100}
          background={false}
          responsive={true}
          autoCropArea={1}
          checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
          onInitialized={(instance) => {
            setCropper(instance);
          }}
          guides={true}
          crossOrigin='anonymous'
          checkCrossOrigin
        />
      </div>
      <StyledButton
        className={styles.cropButton}
        type='button'
        onClick={getCropData}
      >
        crop
      </StyledButton>
      <StyledButton
        className={styles.cropButton}
        type='button'
        onClick={props.onClose}
      >
        cancel crop
      </StyledButton>
    </PageContainer>
  );
}
