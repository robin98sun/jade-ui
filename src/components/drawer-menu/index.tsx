import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'
import { 
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  SwipeableDrawer,
} from '@material-ui/core'

import { switchContent } from './actions'
import { toggleDrawerMenu } from '../header/actions'


interface Props {
  title?: string
  showClear?: boolean
  style?: object
  open?: boolean
  switchContent?(item:string):any
  toggleDrawerMenu?(open: boolean):any
  itemLists?: {
    icon: any
    text: string
    color: any
    name: string
  }[][]
}

interface State {
  open: boolean
  windowWidth: number,
  windowHeight: number,
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
      open: true,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    return {
      open: props.open || false,
    }
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  updateWindowDimensions() {
    this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
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
                        if (this.props.switchContent) {
                          this.props.switchContent(item.name)
                        }
                        if (this.props.toggleDrawerMenu && this.state.windowWidth < 800) {
                          this.props.toggleDrawerMenu(false)
                        }
                      }}
                      color={item.color}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={
                        <Typography 
                          display='inline'
                          noWrap
                          color={item.color}
                          style={{
                            textDecoration: item.color === 'primary' ? 'underline': 'none'
                          }}
                        >
                          {item.text}
                        </Typography>
                      } color={item.color}/>
                    </ListItem>
                  ))
                }
                </List>
                {
                  i < listLength - 1 
                  ? <Divider 
                      style={{
                        marginTop: 10, 
                        marginBottom: 10,
                        backgroundColor: "#EEE",
                      }}
                    />
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
  {switchContent, toggleDrawerMenu},
)(DrawerMenu);