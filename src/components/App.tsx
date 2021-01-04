// fundamental
import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'
// Actions
import { welcome } from './App.actions'
import { toggleDrawerMenu } from './header/actions'
// 
import {
  Container,
} from '@material-ui/core'  
import { ThemeProvider } from '@material-ui/core/styles'
import { createMuiTheme } from '@material-ui/core/styles'

// components
import Header from './header'
import DrawerMenu from './drawer-menu'
import Contents from './contents'

import { connectNode } from './contents/conn/actions'

import { contentItems } from './content.items'
import { blue, cyan, blueGrey, red, amber, green, grey } from '@material-ui/core/colors'
const defaultTheme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: blueGrey,
    error: red,
    warning: amber,
    info: cyan,
    success: green,
    text: {
      primary: grey[900],
      secondary: grey[600],
      disabled: grey[200],
    },
    grey: grey,
  }
})

interface AppProps {
  welcome?(): any
  drawMenuOpen?: boolean
  contentName?: string
  toggleDrawerMenu?(open: boolean):any
  connectNode?(addr:string, port: number, token: string, targetPage: string, slientFaile: boolean):any
}

interface State {
  width: number
  height: number
}

const contentStyle: any = {
  flowGrow: 1,
  padding: 10,
  marginLeft: -240,
  marginRight: 0,
  transition: 'margin 0.5s',
  trasnitionTimingFunction: 'ease-in-out'
}

const contentStyleShift: any = {
  marginLeft: 0,
  marginRight: 0,
  transition: 'margin 0.25s',
  trasnitionTimingFunction: 'ease-in-out'
}

class App extends Component<AppProps, State>{
  constructor(props: AppProps) {
    super(props)
    this.state = {
      width: window.innerWidth, 
      height: window.innerHeight,
    }
  }
  componentDidMount() {
    this.props.welcome!()
    if (this.props.connectNode) {
      this.props.connectNode('', 0, '', 'conf', true)
    }
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
    if (this.state.width < 800 && this.props.toggleDrawerMenu && this.props.drawMenuOpen) {
      this.props.toggleDrawerMenu(false)
    } else if (this.state.width >= 800 && this.props.toggleDrawerMenu && !this.props.drawMenuOpen) {
      this.props.toggleDrawerMenu(true)
    }
  }

  getDrawMenuItems() {
    return contentItems.map(list => (
      Object.keys(list).map(itemName => {
        const item :any = list[itemName]
        const color = this.props.contentName===itemName? 'primary' : 'secondary'
        const IconClass:any = item.icon
        return {
          name: itemName,
          text: item.title,
          icon: <IconClass color={color} />,
          color,
        }
      })
    ))
  }

  render() {
    const headerHeight = 40
    return (
      <React.Fragment>
      <div className="App" style={{
        display: 'flex',
      }}>
        <ThemeProvider theme={defaultTheme} >
          <Header style={{zIndex: 9999, height: headerHeight}}/>
          <DrawerMenu style={{zIndex: 5}} itemLists={this.getDrawMenuItems()}/>
          <Container style={this.props.drawMenuOpen ? contentStyleShift : contentStyle} maxWidth="lg">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            // necessary for content to be below app bar
            justifyContent: 'flex-start',
            height: headerHeight,
          }} />
          <Contents />
          </Container>
        </ThemeProvider>
      </div>
      </React.Fragment>
    );
  }
}

export default connect(
  (state:any)=>state.app,
  {welcome, connectNode, toggleDrawerMenu},
)(App);
