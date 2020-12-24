import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'
import { 
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button
} from '@material-ui/core'
import {
  Menu as MenuIcon
} from '@material-ui/icons'

import {
  toggleDrawerMenu,
} from './actions'

interface Props {
  title?: string
  showClear?: boolean
  style?: object
  toggleDrawerMenu?: any
  drawMenuOpen?: boolean
}

interface State {
  drawMenuOpen?: boolean
}

class Header extends Component<Props, State>{
  constructor(props: Props) {
    super(props)
    this.state = {
      drawMenuOpen: window.innerWidth >=800,
    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (typeof props.drawMenuOpen !== 'undefined') {
      return Object.assign(state, {
        drawMenuOpen: props.drawMenuOpen
      })
    } else {
      return state
    } 
  }

  componentDidMount() {
    this.props.toggleDrawerMenu(!!this.state.drawMenuOpen)
  }
  toggleDrawerMenu() {
    this.props.toggleDrawerMenu(!this.state.drawMenuOpen)
    this.setState({
      drawMenuOpen: !this.state.drawMenuOpen,
    })
  }
  render() {
    const barStyle = Object.assign({}, {bottom:'auto', top: 0, flex: 1, justifyContent: 'center'}, this.props.style)
    return (
      <div className="header">
        <AppBar position="fixed" style={barStyle}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={this.toggleDrawerMenu.bind(this)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" style={{margin: 'auto'}}>
              {this.props.title}
            </Typography>
            {
              this.props.showClear
              ? <Button color="inherit" style={{marginLeft: 'auto', fontSize: 10}} >Clear</Button>
              : null
            }
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default connect(
  (state: any)=>state.app.header||{},
  {
    toggleDrawerMenu,
  },
)(Header);