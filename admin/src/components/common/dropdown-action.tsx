import { PureComponent } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Button, Menu } from 'antd';

export interface IMenuOption {
  key: string;
  name: string;
  onClick?: Function;
  children?: any;
  isDisabled?: boolean
}

interface IProps {
  menuOptions?: IMenuOption[];
  buttonStyle?: any;
  dropdownProps?: any;
  nameButtonMain?: string;
}

export class DropdownAction extends PureComponent<IProps> {
  render() {
    const {
      menuOptions = [],
      buttonStyle,
      dropdownProps,
      nameButtonMain
    } = this.props;
    const menu = menuOptions.map((item) => (
      <Menu.Item key={item.key} onClick={() => item.onClick && item.onClick()} disabled={item.isDisabled}>
        {item.children || item.name}
      </Menu.Item>
    ));
    return (
      <Dropdown overlay={<Menu>{menu}</Menu>} {...dropdownProps}>
        <Button style={{ ...buttonStyle }}>
          {nameButtonMain || 'Action'}
          <DownOutlined />
        </Button>
      </Dropdown>
    );
  }
}
