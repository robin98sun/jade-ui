import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'
import { 
  Toolbar,
  // Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  SwipeableDrawer,
} from '@material-ui/core'

import { onClickDrawerItem } from './actions'


interface Props {
  title?: string
  showClear?: boolean
  style?: object
  open?: boolean
  onClickDrawerItem?(item:string):void
  itemLists?: {
    icon: any
    text: string
    color: any
    name: string
  }[][]
}

interface State {
  open: boolean
}

const drawerWidth = 240

const drawerStyle: any = {
  width: drawerWidth, 
  flexShrink: 0,
  paper: {
    width: drawerWidth,
  }
}


class DrawerMenu extends Component<Props, State>{

  constructor(props: Props) {
    super(props)
    this.state = {
      open: true
    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    return {
      open: props.open || false,
    }
  }

  componentDidMount() {

  }

  closeDrawer() {
    return (event: React.KeyboardEvent|React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }  

      this.setState({open: false})
    }  
  }

  openDrawer() {
    return (event: React.KeyboardEvent|React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }  

      this.setState({open: true})
    }  
  }

  render() { 
    const listLength = this.props.itemLists ? this.props.itemLists.length:0
    return (
      <SwipeableDrawer
        variant='persistent'
        style={drawerStyle}
        anchor="left"
        open={this.state.open}
        onClose={this.closeDrawer.bind(this)}
        onOpen={this.openDrawer.bind(this)}
        PaperProps={{
          style: {width: drawerWidth},
        }}
      >
        <Toolbar />
        <div style={{overflow: 'auto'}}>
        {
          this.props.itemLists && this.props.itemLists.length
          ? this.props.itemLists.map((itemlist,i) => (
              <div key={'draw-menu-list-'+i}>
                <List>
                {
                  itemlist.map((item, j) => (
                    <ListItem button key={item.text+'_'+i+'_'+j} 
                      onClick={()=>{
                        if (this.props.onClickDrawerItem) {
                          this.props.onClickDrawerItem(item.name)
                        }
                      }}
                      color={item.color}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} color={item.color}/>
                    </ListItem>
                  ))
                }
                </List>
                {
                  i < listLength - 1 
                  ? <Divider />
                  : null
                }
              </div>
            ))
          : null
        }
        </div>
      </SwipeableDrawer>
    );
  }
}

export default connect(
  (state: any)=>state.app.drawer||{},
  {onClickDrawerItem},
)(DrawerMenu);