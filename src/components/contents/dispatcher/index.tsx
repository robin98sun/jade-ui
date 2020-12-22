import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'
import { 
  // AppBar,
  // Toolbar,
  // IconButton,
  Typography,
  // Button,
} from '@material-ui/core'
// import {
//   Menu as MenuIcon
// } from '@material-ui/icons'


interface Props {
  // contentName?: string
  style?: any
}


class ContentDispatcher extends Component<Props>{
  componentDidMount() {

  }
  render() {
    const introStyle = Object.assign({}, {}, this.props.style)
    return (
      <div className="content-intro" style={introStyle}>
        <Typography paragraph>
            Under construction...
          </Typography>
      </div>
    );
  }
}

export default connect(
  (state: any)=>state.app.content.distpatcher||{},
  null,
)(ContentDispatcher);