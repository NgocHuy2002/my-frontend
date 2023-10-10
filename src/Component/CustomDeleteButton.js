import React from 'react';
import PropTypes from 'prop-types';
import { Popconfirm, Button, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export default function CommonButtonDelete({icon, disabled,okText, cancelText, okButtonProps, titlePopConfirm, titleTooltip, onConfirm, ...props }) {
  return (
    <Popconfirm title={titlePopConfirm} onConfirm={onConfirm}
      okText={okText || "Xoá"}
      cancelText={cancelText || "Huỷ"}
      okButtonProps={okButtonProps}
      disabled={disabled}
    >
      <Tooltip placement="topLeft" title={titleTooltip} color="#f50" >
        <Button icon={icon ? icon :<DeleteOutlined />} type="primary" danger size="small" disabled={disabled}/>
      </Tooltip>
    </Popconfirm>
  );
}


CommonButtonDelete.propTypes = {
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  okButtonProps: PropTypes.object,
  titlePopConfirm: PropTypes.string,
  titleTooltip: PropTypes.string,
  onConfirm: PropTypes.func,
};

CommonButtonDelete.defaultProps = {
  okText: 'Xóa',
  cancelText: 'Hủy',
  okButtonProps: { type: 'primary', danger: 'true' },
  titlePopConfirm: 'Bạn chắc chắn muốn xoá?',
  titleTooltip: 'Xóa dữ liệu',
  onConfirm: null,
};
