import {
  Button,
  Divider,
  Image,
  message,
  Row,
  Col,
  Dropdown,
  Menu,
  Spin
} from 'antd';
import Dragger from 'antd/lib/upload/Dragger';
import { useState, useEffect } from 'react';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { getGlobalConfig } from '@services/config';
import { performerService } from '@services/performer.service';
import storeHolder from '@lib/storeHolder';
import { updateCurrentUserAvatar } from '@redux/user/actions';

export default function ProfileImagesUploads() {
  const config = getGlobalConfig();
  const [photos, setPhotos] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const findPhotos = async () => {
    setLoading(true);
    const resp = await performerService.allProfileImages();
    setPhotos(resp.data);
    setLoading(false);

    // check main image and change avatar
    const mainImage = resp.data.find((i) => i.isMainImage);
    if (mainImage) {
      const store = storeHolder.getStore();
      store.dispatch(updateCurrentUserAvatar(mainImage.file?.fileUrl));
    }
  };

  const beforeUpload = (file, fileL) => {
    if (photos.length + fileL.length > 20) {
      message.error('You can only upload up to 20 photos to your profile');
      return false;
    }
    if (file.size / 1024 / 1024 > (config.NEXT_PUBLIC_MAX_SIZE_IMAGE || 5)) {
      message.error(
        `${file.name} is over ${config.NEXT_PUBLIC_MAX_SIZE_IMAGE || 5}MB`
      );
      return false;
    }

    setFileList([
      ...fileList,
      ...fileL.filter(
        (f) => f.size / 1024 / 1024 < (config.NEXT_PUBLIC_MAX_SIZE_IMAGE || 5)
      )
    ]);
    return false;
  };

  const onRemove = (file) => {
    const newList = fileList.filter((f) => f.uid !== file.uid);
    setFileList(newList);
  };

  const bunkUpload = async () => {
    try {
      setUploading(true);
      await fileList.reduce(async (lastPromise, file) => {
        await lastPromise;

        // TODO - should change with profile images service and payload data
        return performerService.imageUpload(file, {}, () => {});
      }, Promise.resolve());

      message.success('upload successfully');

      // reload photo list
      findPhotos();
      // reset default file list
      setFileList([]);
      setUploading(false);
    } catch (e) {
      const err = (await Promise.resolve(e)) || {};
      message.error(err.message || 'An error occurred, please try again!');
      setUploading(false);
    }
  };

  // component did mount / did update
  useEffect(() => {
    findPhotos();
  }, []);

  const deleteImage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) {
      return false;
    }
    // const { isMainImage } = photos.find((item) => item._id === id);
    try {
      await performerService.deleteProfileImage(id);
      message.success('Deleted successfully');
      await findPhotos();
    } catch (e) {
      const err = (await Promise.resolve(e)) || {};
      message.error(err.message || 'An error occurred, please try again!');
    }
    return undefined;
  };

  const setAvatar = async (id) => {
    try {
      await performerService.setAvatar(id);
      message.success('Set avatar successfully');
      await findPhotos();
    } catch (e) {
      const err = (await Promise.resolve(e)) || {};
      message.error(err.message || 'An error occurred, please try again!');
    }
    return undefined;
  };
  return (
    <div className="form-container">
      <div>You can upload a maximum of 20 photos to your profile</div>
      <Row gutter={[16, 24]}>
        {photos && !loading
          ? photos?.map((photo) => (
            <Col className="img-item" span={6}>
              <Dropdown
                overlay={(
                  <Menu className="edit-img-menu">
                    {!photo.isMainImage && (
                      <Menu.Item onClick={() => setAvatar(photo._id)}>
                        Choose as main image/avatar
                      </Menu.Item>
                    )}
                  </Menu>
                )}
              >
                <div className="img-container">
                  <Image
                    src={photo.file?.fileUrl}
                    className={`${photo.isMainImage && 'main-img'}`}
                  />
                  <DeleteOutlined onClick={() => deleteImage(photo._id)} alt="Delete Image" />
                </div>
              </Dropdown>
            </Col>
          )) : <Spin size="large" className="spin-loading" />}
      </Row>
      <Divider />
      <Dragger
        accept="image/*"
        beforeUpload={beforeUpload}
        maxCount={2}
        multiple
        showUploadList
        disabled={uploading}
        listType="text"
        onRemove={onRemove}
        fileList={fileList}
      >
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag files to this area to upload
        </p>
        <p className="ant-upload-hint">
          Image must be
          {' '}
          {config.NEXT_PUBLIC_MAX_SIZE_IMAGE || 5}
          MB or below
        </p>
      </Dragger>

      <Divider />

      <Button
        className="btn-submit"
        type="primary"
        htmlType="submit"
        loading={uploading}
        disabled={uploading || !fileList?.length}
        onClick={bunkUpload}
      >
        Upload All
      </Button>
    </div>
  );
}
