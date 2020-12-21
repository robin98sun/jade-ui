import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'

import Modal from '../../gears/modal'
import ProgressIcon from '../../gears/progress-icon'
import TreeView from '../../gears/tree-view'

import { getTopology, hasShownError } from './actions'


interface Props {
  style?: any
  getTopology?(addr: string, port: number, token: string):any
  hasShownError?(errTime: any):any
  currentNode?: {
    addr?: string,
    port?: number,
    token?: string,
    config?: any,
  },
  topology?: any,
  isGettingSubnodes?: boolean,
  hasShownErrTime?: any,
  errTime?: any,
  error?: any,
}

class ContentTopo extends Component<Props>{

  componentDidMount() {
    if (this.props.getTopology) {
      const addr = this.props.currentNode ? this.props.currentNode.addr ||'': ''
      const port = this.props.currentNode ? this.props.currentNode.port||0: 0
      const token = this.props.currentNode ? this.props.currentNode.token||'': ''
      this.props.getTopology(addr, port, token)
    }
  }

  dismissErrorMsg() {
    if (this.props.hasShownError) {
      this.props.hasShownError(this.props.errTime)
    }
  }

  render() {
    const introStyle = Object.assign({}, {}, this.props.style)
    return (
      <div className="content-topology" style={introStyle}>
        <Modal 
          open={this.props.isGettingSubnodes||false}
          message="getting topology ..."
          progressIcon={<ProgressIcon isRunning />}
        />

        <Modal 
          open={(this.props.errTime && this.props.errTime !== this.props.hasShownErrTime)||false}
          title="ERROR"
          message={this.props.error}
          onClose={this.dismissErrorMsg.bind(this)}
        />

        <TreeView 
          root={this.props.topology}
        />
      </div>
    );
  }
}

export default connect(
  (state: any)=>state.app.content.topo||{},
  { getTopology, hasShownError },
)(ContentTopo);