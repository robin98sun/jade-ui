import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'
import { 
  Menu,
  MenuItem,
  Button,
} from '@material-ui/core'

interface Props {
  buttonTitle: string
  menuItems: string[]
  selected(item:string):void
  disabled:boolean|undefined
  icon:any
}


function MenuButton(props: Props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (item:string) => {
    setAnchorEl(null);
    if (!item) return
    props.selected(item)
  };

  const menulist = props.menuItems.map((item,i)=>(
    <MenuItem onClick={()=>{handleClose(item)}} key={'menubuttonitem:'+i}>{item}</MenuItem>
  ))

  return (
    <div className="header">
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} disabled={props.disabled}>
        {props.icon}<span style={{marginLeft: 5}}>{props.buttonTitle}</span>
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={()=>{handleClose('')}}
      >
        {
          menulist
        }
      </Menu>
    </div>
  );
}

export default MenuButton