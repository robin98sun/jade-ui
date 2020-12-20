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
} from '@material-ui/icons'




// components
import Header from './header'
import DrawerMenu from './drawer-menu'
import Contents from './contents'

import { contentItems } from './content.items'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { lightBlue, blueGrey } from '@material-ui/core/colors'
const defaultTheme = createMuiTheme({
  palette: {
    primary: lightBlue,
    secondary: blueGrey,
  }
})

interface AppProps {
  welcome?(): any
  drawMenuOpen?: boolean
  contentName?: string
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
    const headerHeight = 50
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
            // padding: '10px 0px',
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
  {
    welcome,
  },
)(App);
