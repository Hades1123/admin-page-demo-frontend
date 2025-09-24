import { useRef, useState } from 'react';
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import { PlusOutlined } from '@ant-design/icons';
import { App, Image, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import type { RcFile } from 'antd/es/upload';

interface IProps {
    fileList: UploadFile[];
    setFileList: (v: UploadFile[]) => void;
    numberOfImages?: number;
    title: string;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

export const UploadImg = (props: IProps) => {
    const { fileList, setFileList, numberOfImages = 1, title } = props;
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const { message } = App.useApp();

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        if (beforeUpload(newFileList[newFileList.length - 1].originFileObj as RcFile)) {
            setFileList(newFileList);
        }
    }

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const dummyRequest = ({ file, onSuccess }: UploadRequestOption) => {
        setTimeout(() => {
            if (onSuccess) {
                onSuccess('ok');
            }
        }, 0);
    };

    return (
        <>
            <h1 className='mb-2'>{title}</h1>
            <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                customRequest={dummyRequest}
                multiple={true}
            >
                {fileList.length >= numberOfImages ? null : uploadButton}
            </Upload>
            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </>
    );
};
