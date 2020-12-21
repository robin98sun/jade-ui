import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'
import { 
  Grid,
  TextField,
  Button,
} from '@material-ui/core'



interface Props {
  // contentName?: string
  style?: any
  addr?: string
  port?: number
  token?: string
}

interface State {
  addr?: string
  port?: number
  token?: string
}


class ContentConf extends Component<Props, State>{

  constructor(props:any) {
    super(props)
    this.state = {
    }
  }

  render() {
    const confStyle = Object.assign({}, {
      padding: 30,
      flexGrow: 1,
    }, this.props.style)
    return (
      <div className="content-conf" style={confStyle}>
      </div>
    );
  }
}

export default connect(
  (state: any)=>state.app.content.conf||{},
  null,
)(ContentConf);