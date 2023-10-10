import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';

export default function CommonButtonEdit({ icon, titleTooltip, color, onClick, disabled, ...props }) {
  return (
    <Tooltip placement="topLeft" title={titleTooltip} color={color}>
      <Button icon={icon ? icon : <EditOutlined />} size="small" type="primary" disabled={disabled}
        onClick={onClick}
      />
    </Tooltip>
  );
}


CommonButtonEdit.propTypes = {
  titleTooltip: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
};

CommonButtonEdit.defaultProps = {
  titleTooltip: 'Cập nhật thông tin',
  color: '#2db7f5',
  onClick: null,
};
