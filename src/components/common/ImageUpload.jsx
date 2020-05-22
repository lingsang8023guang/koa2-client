import React from 'react';
import { Modal, Upload, Alert, message } from 'antd';
import Cropper from 'react-cropper';
import axios from'axios'
import ENV from '../../utils/env';
import {
    FILE_TYPE_IMAGE,
    FILE_TYPE_VIDEO,
    FILE_THUMBNAIL,
    getFileTypeByName,
} from './utils';
import styles from './styles.less';

class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: this.getFileListFromValue(props.value),
            previewVisible: false,
            previewImage: '',
            cropperModalVisible: false,
            srcCropper: null,
            loading: false, // 裁剪modal确定按钮loading
        };
        this.srcCropper = null;
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            fileList: this.getFileListFromValue(nextProps.value),
        });
    }

    getFileListFromValue(value = '') {
        let url;
        if (this.props.urlhttp) {
            if (value.indexOf('hualala') === -1) {
                url = `${ENV.FILE_RESOURCE_DOMAIN}/${value}`;
            } else {
                url = `${value}`;
            }
        } else {
            url = typeof (value) === 'object' && value !== null ? `${ENV.FILE_RESOURCE_DOMAIN}/${value.url}` : `${ENV.FILE_RESOURCE_DOMAIN}/${value}`;
        }
        const cropURL = this.getCropURL(url);
        const type = getFileTypeByName(url);
        const thumbUrl = type === FILE_TYPE_IMAGE ? cropURL : FILE_THUMBNAIL[type];
        return value ? [{
            uid: -1,
            status: 'done',
            url,
            thumbUrl,
        }] : [];
    }
    /**
     * 获得裁剪URL
     * @param url
     */
    getCropURL = (url) => {
        let cropURL;
        if (this.props.operationMode === 'onlineShop') { // 微信餐厅轮播图不需要截取出方图
            return url;
        }
        if (url.indexOf('basicdoc') > -1) { // 阿里图片, 直接加裁剪参数
            cropURL = url + this.getCropParam('ali', 100, 100);
        }
        if (url.indexOf('group') > -1) { // 老图片, 需要区分是不是gif
            const temp = url.substr(url.indexOf('group'));
            const arr = temp.split('.');
            const imgType = arr[1] ? arr[1] : 'png';
            if (imgType.toLowerCase() === 'gif') { // 旧gif不裁剪
                cropURL = url;
            } else {
                cropURL = `${ENV.FILE_RESOURCE_DOMAIN}/${arr[0]}${this.getCropParam('hll', 100, 100, 1, 1)}${imgType}`;
            }
        }
        return cropURL;
    }
    /**
     * 获取裁剪参数字符串
     * @param type
     * @param width
     * @param height
     * @param x_offset
     * @param y_offset
     */
    getCropParam = (type, width, heigh, x_offset, y_offset) => {
        let result = null;
        if (type === 'ali') { // 阿里图片服务器裁剪参数
            result = `?x-oss-process=image/resize,limit_0,m_fill,h_${heigh},w_${width}`;
        }
        if (type === 'hll') { // 公司图片服务器裁剪参数
            result = `=C${width}x${heigh}+${x_offset}+${y_offset}.`;
        }
        return result;
    }
    getCustomStyle = (operationMode) => {
        switch (operationMode) {
            case 'addShop':
                return styles.shopuploader;
            case 'onlineShop':
                return styles.onlineShopLoader;
            default:
                return styles.uploader;
        }
    }
    // 获取文件尺寸，判断尺寸在不在规定范围之内
    validateUploadImg = (file) => {
        const { maxWidth, maxHeight } = this.props.dimensions;
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const oImg = new Image();
                oImg.src = e.target.result;
                oImg.onload = () => {
                    if (oImg.width < maxWidth && maxWidth) {
                        message.warn(`上传文件的宽度需大于等于${maxWidth}px`)
                        reject(false)
                    } else if (oImg.height < maxHeight && maxHeight) {
                        message.warn(`上传文件的高度需大于等于${maxHeight}px`)
                        reject(false)
                    } else {
                        resolve(true)
                    }
                }
            }
        })
    }

    beforeUpload = async (file) => {
        if (!file) return true; // in case of browser compatibility
        const { limitType = '', limitSize = 0, crop = false, dimensions = {} } = this.props;
        const types = limitType ? limitType.split(',') : [];
        const sizes = Array.isArray(limitSize) ? limitSize : [limitSize];
        const matchedType = types.find((type) => {
            const regexp = new RegExp(`^.*${type.replace('.', '\\.')}$`);
            return file.name.toLowerCase().match(regexp); // 兼容图片格式大小写
        });
        const matchIndex = types.indexOf(matchedType);
        const matchedSize = sizes[matchIndex] || sizes[0];
        if (types.length && !matchedType) {
            message.error('上传文件格式错误');
            return Promise.reject(false);
        }
        if (matchedSize !== undefined && matchedSize !== 0 && file.size > matchedSize) {
            message.error('上传文件大小超过限制');
            return Promise.reject(false);
        }
        if (Object.keys(dimensions).length) {
            const isValidDimens = await this.validateUploadImg(file);
            if (!isValidDimens) return Promise.reject(false);
        }
        if (crop) { // 需要裁剪
            const reader = new FileReader();
            this.isGif = matchedType === '.gif';
            this.file = matchedType === '.gif' ? file : null;
            this.fileType = matchedType;
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                this.setState({
                    srcCropper: e.target.result,
                    cropperModalVisible: true,
                })
            }
            return Promise.reject(false); // 阻止Upload组件上传
        }
        return Promise.resolve(true);
    }

    handleChange = ({ file, fileList }) => {
        if (file.status !== 'done') return this.setState({ fileList });
        if (this.props.crop) { return false; } // 如果需要裁剪,走自定义上传和设置方法
        const response = file.response || {};
        const { url, imgHWP, imgWidth, imgHeight } = response;
        if (!url) {
            message.error(response.resultMsg || '图片上传失败，请稍后重试');
            return this.setState({ fileList: [] });
        }
        if (this.props.hwpName && !this.props.needWH) {
            this.props.onChange({
                url,
                [this.props.hwpName]: imgHWP,
            });
        } else if (this.props.hwpName && this.props.needWH) {
            this.props.onChange({
                url,
                [this.props.hwpName]: imgHWP,
                imgWidth,
                imgHeight,
            });
        } else {
            this.props.onChange(this.props.urlhttp ? `${ENV.FILE_RESOURCE_DOMAIN}/${url}` : url);
        }
        return this.setState({
            fileList: this.getFileListFromValue(url),
        });
    }

    handlePreview = (file) => {
        this.setState({
            previewVisible: true,
            previewImage: file.url || file.thumbUrl,
        });
    }

    handleRemove = () => {
        this.props.onChange('');
    }

    handleCancelPreview = () => {
        this.setState({
            previewVisible: false,
        });
    }
    /**
     * 上传一个带裁剪参数的url 返回不带参数的url
     * @param tempURL
     * @param cropData
     */
    uploadAliImg = (tempURL, cropData) => {
        const param = new FormData();
        const x = `x_${Math.round(cropData.x)},`; // x 裁剪区域左侧的偏移量
        const y = `y_${Math.round(cropData.y)},`; // y 裁剪区域的偏移顶部
        const w = `w_${Math.round(cropData.width)},`; // 裁剪区域的宽度
        const h = `h_${Math.round(cropData.height)}`; // 裁剪区域的高度
        param.append('url', `${tempURL}?x-oss-process=image/crop,${x}${y}${w}${h}`);
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
        };
        axios.post('/api/v1/upload?service=HTTP_SERVICE_URL_SHOPAPI&method=/imageCj.action', param, config).then((res) => {
            if (res.status === 'success') {
                const { url, imgHWP } = res;
                if (!url) {
                    message.error(res.resultMsg || '图片上传失败，请稍后重试');
                    return this.setState({
                        fileList: [],
                        cropperModalVisible: false,
                        loading: false,
                    });
                }
                if (this.props.hwpName) {
                    this.props.onChange({
                        url,
                        [this.props.hwpName]: imgHWP,
                    });
                } else {
                    this.props.onChange(this.props.urlhttp ? `${ENV.FILE_RESOURCE_DOMAIN}/${url}` : url);
                }
                this.setState({
                    fileList: this.getFileListFromValue(url),
                    cropperModalVisible: false,
                    loading: false,
                });
            } else {
                message.error(res.resultMsg || '图片上传失败，请稍后重试');
                return this.setState({
                    fileList: [],
                    cropperModalVisible: false,
                    loading: false,
                });
            }
        }).catch((e) => {
            message.error('图片上传失败，请稍后重试');
            return this.setState({
                fileList: [],
                cropperModalVisible: false,
                loading: false,
            });
        })
    }
    /**
     * 自定义上传方法(如果图片需要裁剪,走此方法;如果是直接上传,仍然走Upload组件,直接上传)
     */
    uploadImg = () => {
        if (!this.cropper) { return; }
        if (this.isGif) {
            const param = new FormData();
            param.append('myFile', this.file); // 必须写myFile, 否则上传接口报错, 原因未知
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
            };
            this.setState({ loading: true });
            axios.post(ENV.IMAGE_UPLOAD_BASEURL, param, config).then((res) => {
                if (res.status === 'success') {
                    const { url } = res;
                    if (!url) {
                        message.error(res.resultMsg || '图片上传失败，请稍后重试');
                        this.setState({ loading: false });
                    }
                    // 添加裁剪参数再次上传
                    this.uploadAliImg(url, this.cropper.getData());
                } else {
                    message.error(res.resultMsg || '图片上传失败，请稍后重试');
                    this.setState({ loading: false });
                }
            }).catch((e) => {
                message.error('图片上传失败，请稍后重试');
                this.setState({ loading: false });
            })
        } else {
            const targetImgType = this.fileType.indexOf('png') > -1 ? 'image/png' : 'image/jpeg';
            const cropperDataURL = this.cropper.getCroppedCanvas().toDataURL(targetImgType) || ''; // 裁剪区域的base64
            const file = this.dataURLtoFile(cropperDataURL, `file${Date.now()}${this.fileType}`); // fileName需要有后缀
            const param = new FormData();
            param.append('myFile', file); // 必须写myFile, 否则上传接口报错, 原因未知
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
            };
            this.setState({ loading: true });
            axios.post(ENV.IMAGE_UPLOAD_BASEURL, param, config).then((res) => {
                if (res.status === 'success') {
                    const { url, imgHWP } = res;
                    if (!url) {
                        message.error(res.resultMsg || '图片上传失败，请稍后重试');
                        return this.setState({
                            fileList: [],
                            cropperModalVisible: false,
                            loading: false,
                        });
                    }
                    if (this.props.hwpName) {
                        this.props.onChange({
                            url,
                            [this.props.hwpName]: imgHWP,
                        });
                    } else {
                        this.props.onChange(this.props.urlhttp ? `${ENV.FILE_RESOURCE_DOMAIN}/${url}` : url);
                    }
                    this.setState({
                        fileList: this.getFileListFromValue(url),
                        cropperModalVisible: false,
                        loading: false,
                    });
                } else {
                    message.error(res.resultMsg || '图片上传失败，请稍后重试');
                    return this.setState({
                        fileList: [],
                        cropperModalVisible: false,
                        loading: false,
                    });
                }
            }).catch((e) => {
                message.error('图片上传失败，请稍后重试');
                return this.setState({
                    fileList: [],
                    cropperModalVisible: false,
                    loading: false,
                });
            })
        }
    }
    /**
     * 将base64转换为文件
     * @param dataURL
     * @param fileName
     */
    dataURLtoFile = (dataURL, fileName) => {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = window.atob(arr[1])
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new window.File([u8arr], fileName, { type: mime });
    }
    cancelUploadImg = () => {
        this.setState({
            cropperModalVisible: false,
        })
    }
    renderPreviewContent = (url) => {
        const type = getFileTypeByName(url);
        switch (type) {
            case FILE_TYPE_IMAGE:
                return (<img alt="example" style={{ width: '100%' }} src={url} />);
            case FILE_TYPE_VIDEO:
                return (
                    <video src={url} controls={true} style={{ width: '100%' }}>
                        <track kind="captions" />
                        <source src={url} type="video/mp4" />
                        <object>
                            <embed src={url} />
                        </object>
                    </video>
                );
            default:
                return (
                    <Alert
                        type="warning"
                        showIcon={true}
                        message={'抱歉'}
                        description={'该类型文件暂不支持预览'}
                    />
                );
        }
    }

    render() {
        const {
            name = 'myFile',
            action = ENV.IMAGE_UPLOAD_BASEURL,
            tips = '点击上传',
            aspectRatio = 1 / 1,
            uploadTips = '',
            operationMode, // 用来区分加载不同样式的字段,与店铺运营模式无关
            styleCss = {},
            cropParam = {}, // 裁剪框固定的宽和高  传参格式 { width: 100px, height: 100px }
        } = this.props;
        const { fileList, previewVisible, previewImage, cropperModalVisible, srcCropper, loading } = this.state;
        const isFixCrop = Object.keys(cropParam).length > 0; // 是否固定裁剪框宽高
        return (
            <div style={styleCss} className={this.getCustomStyle(operationMode)}>
                <Upload
                    name={name}
                    action={action}
                    listType="picture-card"
                    fileList={fileList}
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleChange}
                    onPreview={this.handlePreview}
                    onRemove={this.handleRemove}
                >
                    {fileList.length < 1 &&
                        <div>
                            <div className="upload-tips">
                                {tips}
                            </div>
                        </div>
                    }
                </Upload>
                {
                    uploadTips && <div className="description">{uploadTips}</div>
                }
                <Modal
                    title={'预览'}
                    footer={null}
                    className={styles.previewModal}
                    visible={previewVisible}
                    onCancel={this.handleCancelPreview}
                >
                    {this.renderPreviewContent(previewImage)}
                </Modal>
                {cropperModalVisible && <Modal
                    visible={cropperModalVisible}
                    okText={'上传'}
                    onOk={this.uploadImg}
                    onCancel={this.cancelUploadImg}
                    confirmLoading={loading}
                >
                    {/* Cropper图片裁剪器 */}
                    <Cropper
                        src={srcCropper} // 图片路径，即是base64的值，在Upload上传的时候获取到的
                        ref={(c) => { this.cropper = c; }}
                        style={{ height: 400 }}
                        preview=".cropper-preview"
                        className={styles.cropperWrapper}
                        autoCropArea={isFixCrop ? false : 1} // 自定义裁剪区域大小（介于0和1之间的数字, 默认0.8）
                        viewMode={1} // 定义cropper的视图模式
                        zoomable={!isFixCrop} // 是否允许放大图像
                        aspectRatio={isFixCrop ? false : aspectRatio} // image的宽高比
                        guides={true} // 显示在裁剪框上方的虚线
                        background={true} // 是否显示背景的马赛克
                        rotatable={false} // 是否旋转
                        cropBoxResizable={!isFixCrop} // 允许通过拖动调整裁剪框的大小
                        data={isFixCrop ? cropParam : false}
                    />
                </Modal>}
            </div>
        );
    }
}
ImageUpload.defaultProps = {
    // 限制图片的最大的宽高
    dimensions: {},
    // 是否需要返回宽高字段
    needWH: false,
}
export default ImageUpload;
