// fundamental
import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'
// Actions
import { welcome } from './App.actions'
// 
import {
  // Grid,
  // Tabs,
  // Tab,
  // Typography,
  Container,
} from '@material-ui/core'  

import {
  SettingsEthernet as SettingsEthernetIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  OpenWith as OpenWithIcon,
} from '@material-ui/icons'




// components
import Header from './header'
import DrawerMenu from './drawer-menu'
import Contents from './contents'

import { connectNode } from './contents/conn/actions'

import { contentItems } from './content.items'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
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
      disabled: grey[300],
    }
  }
})

interface AppProps {
  welcome?(): any
  drawMenuOpen?: boolean
  contentName?: string
  connectNode?(addr:string, port: number, token: string, targetPage: string, slientFaile: boolean):any
}

interface State {
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
    }
  }
  componentDidMount() {
    this.props.welcome!()
    if (this.props.connectNode) {
      this.props.connectNode('', 0, '', 'conf', true)
    }
  }

  getDrawMenuItems() {
    return contentItems.map(list => (
      Object.keys(list).map(itemName => {
        const itemText = list[itemName]
        const color = this.props.contentName===itemName? 'primary' : 'secondary'
        let icon: any = null
        switch (itemName) {
        case 'conn':
          icon = <SettingsEthernetIcon color={color}/>
          break
        case 'intro':
          icon = <InfoIcon color={color}/>
          break
        case 'conf':
          icon = <SettingsIcon color={color}/>
          break
        case 'topo':
          icon = <OpenWithIcon color={color}/>
          break  
        default:
          icon = null
          break
        }
        return {
          name: itemName,
          text: itemText,
          icon,
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
        <MuiThemeProvider theme={defaultTheme} >
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
        </MuiThemeProvider>
      </div>
      </React.Fragment>
    );
  }
}

export default connect(
  (state:any)=>state.app,
  {welcome, connectNode},
)(App);
