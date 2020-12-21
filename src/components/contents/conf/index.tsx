import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'
import { 
  Grid,
  TextField,
  Button,
} from '@material-ui/core'



interface Props {
  config?: object
  style?: any
}


class ContentConf extends Component<Props>{

  constructor(props:any) {
    super(props)
  }

  render() {
    const confStyle = Object.assign({}, {
      padding: 30,
      flexGrow: 1,
    }, this.props.style)
    return (
      <div className="content-conf" style={confStyle}>
      </div>
    )
  }
}

export default connect(
  (state: any)=>state.app.content.conf||{},
  null,
)(ContentConf);