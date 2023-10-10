import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

function AddNewButton({ onClick, linkTo, label, disabled, loading, className, style, permission, type }) {
  const permissionCreate = permission.create;
  return <React.Fragment>
    <div className={className}>
      {onClick && permissionCreate && <Button
        disabled={disabled}
        loading={loading}
        type={type}
        className="float-right"
        size="small"
        icon={<i className="fa fa-plus mr-1"/>}
        onClick={onClick}
        style={style}
      >
        {label}
      </Button>}

      {linkTo && permissionCreate && <Link to={linkTo}>
        <Button
          // size="small"
          disabled={disabled}
          type={type}
          className="float-right"
          icon={<i className="fa fa-plus mr-1"/>}
          style={style}
        >
          {label}
        </Button>
      </Link>}
    </div>
  </React.Fragment>;

}

export default withTranslation()(AddNewButton);

AddNewButton.propTypes = {
  onClick: PropTypes.func,
  linkTo: PropTypes.string,
  disabled: PropTypes.bool,
  permission: PropTypes.object,
  loading: PropTypes.bool,
  label: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  type: PropTypes.string,
};

AddNewButton.defaultProps = {
  onClick: null,
  linkTo: '',
  disabled: false,
  permission: { create: true },
  loading: false,
  label: 'Thêm mới',
  className: 'clearfix mb-3',
  style: null,
  type: 'primary'
};