import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'
import { 
  Grid,
  TextField,
  Button,
} from '@material-ui/core'

import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';

import {
  connectNode
} from './actions'


interface Props {
  // contentName?: string
  style?: any
  addr?: string
  port?: number
  token?: string
  connectNode?(addr:string, port:number, token: string):any
}

interface State {
  addr?: string
  port?: number
  token?: string
  loadedPreviousAddr?:boolean
}


class ContentConn extends Component<Props, State>{

  constructor(props:any) {
    super(props)
    this.state = {
      loadedPreviousAddr: false,
    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (!props.addr && !props.port) {
      return state
    }
    if (state.loadedPreviousAddr) {
      return state
    }
    const tmpState: State = {}
    if (props.addr) {
      tmpState.addr = props.addr
    }
    if (props.port) {
      tmpState.port = props.port
    }
    if (props.token) {
      tmpState.token = props.token
    }
    tmpState.loadedPreviousAddr = true
    return tmpState
  }

  onAddrChange(e:any) {
    if (e.target.value) {
      this.setState({
        addr: e.target.value,
      })
    } else {
      this.setState({
        addr: undefined,
      })
    }
  }

  onPortChange(e:any) {
    if (e.target.value) {
      const port = Number(e.target.value)
      if (!Number.isNaN(port)) {
        this.setState({port})
      }
    } else {
      this.setState({
        port: undefined,
      })
    }
  }

  onTokenChange(e:any) {
    if (e.target.value) {
      this.setState({
        token: e.target.value,
      })
    } else {
      this.setState({
        token: undefined,
      })
    }
  }

  onConnect() {
    if (this.props.connectNode) {
      this.props.connectNode(this.state.addr!, this.state.port!, this.state.token!)
    }
  }

  render() {
    const connStyle = Object.assign({}, {
      padding: 30,
      flexGrow: 1,
    }, this.props.style)
    return (
      <div className="content-connection" style={connStyle}>
        <Grid container spacing={3}>
          <Grid item lg={9} md={9} xs={12}>
            <TextField
              id="outlined-textarea-node-address"
              label="Node Address"
              placeholder="Hostname or IP address"
              autoFocus
              multiline
              fullWidth
              variant="outlined"
              onChange={this.onAddrChange.bind(this)}
              value={this.state.addr}
            />
          </Grid>

          <Grid item xs >
            <TextField
              id="outlined-textarea-node-port"
              label="Port Number"
              placeholder="Port Number"
              multiline
              fullWidth
              variant="outlined"
              onChange={this.onPortChange.bind(this)}
              value={this.state.port?this.state.port:""}
            />
          </Grid>
        </Grid>

        { /* 
        <Grid container spacing={5} style={{marginTop: 5}}>
          <Grid item xs>
            <TextField
              id="outlined-textarea-node-token"
              label="Token"
              placeholder="Token of target node"
              multiline
              fullWidth
              variant="outlined"
              onChange={this.onTokenChange.bind(this)}
              value={this.state.token?this.state.token:""}
            />
          </Grid>
        </Grid>
        */}

        <Grid container spacing={5} style={{marginTop: 5}}>
          <Grid item xs>
            <Button
              variant="contained"
              disabled={!this.state.addr || !this.state.port}
              style={{
                margin: 'auto',
              }}
              startIcon={<SettingsEthernetIcon />}
              fullWidth
              onClick={this.onConnect.bind(this)}
            >
              connect
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default connect(
  (state: any)=>state.app.content.conn||{},
  {connectNode},
)(ContentConn);