import React from 'react';
import { 
  Menu,
  MenuItem,
  Button,
} from '@material-ui/core'

interface Props {
  buttonTitle: string
  menuItems: string[]
  onSelected(item:string):void
  disabled?:boolean
  icon:any
  fullWidth?:boolean
  variant?:"text"|"outlined"|"contained"|undefined
  color?:"inherit"|"primary"|"secondary"|undefined
}


function MenuButton(props: Props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (item:string) => {
    setAnchorEl(null);
    if (!item) return
    props.onSelected(item)
  };

  const menulist = props.menuItems.map((item,i)=>(
    <MenuItem 
      onClick={()=>{handleClose(item)}} 
      key={'menubuttonitem:'+i
    }>
      {
        item
      }
    </MenuItem>
  ))

  return (
    <div className="header">
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} disabled={props.disabled}
        fullWidth={props.fullWidth||false}
        variant={props.variant||"outlined"}
        color={props.color||"primary"}
      >
        {props.icon}<span style={{marginLeft: 5}}>{props.buttonTitle}</span>
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
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