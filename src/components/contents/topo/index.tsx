import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'

import ModalStatus from '../../gears/modal-status'
import ProgressIcon from '../../gears/progress-icon'
import TreeView, {TreeNode} from '../../gears/tree-view'
import NodeEditor from './node-editor'

import { 
  getTopology, 
  hasShownErrorOfGetTopology, 
  showEditorForNode,
  fetchNodeConfig,
} from './actions'
import { Message } from './reducer'

interface Props {
  style?: any
  getTopology?(addr: string, port: number, token: string):any
  hasShownErrorOfGetTopology?(errTime: any):any
  fetchNodeConfig?(node: TreeNode):any
  showEditorForNode?(node: TreeNode):any
  currentNode?: {
    addr?: string,
    port?: number,
    token?: string,
    config?: any,
  },
  topology?: Message,
  isShowingEditor?:boolean
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
    if (this.props.hasShownErrorOfGetTopology && this.props.topology) {
      this.props.hasShownErrorOfGetTopology(this.props.topology.errTime)
    }
  }

  onClickNode(node: TreeNode) {
    if (this.props.fetchNodeConfig) {
      this.props.fetchNodeConfig(node)
      if (this.props.showEditorForNode) {
        this.props.showEditorForNode(node)
      }
    }
  }

  render() {
    const introStyle = Object.assign({}, {}, this.props.style)
    return (
      <div className="content-topology" style={introStyle}>
        <ModalStatus 
          open={(this.props.topology && this.props.topology.isFetching) ||false}
          message="getting topology ..."
          progressIcon={<ProgressIcon isRunning />}
        />

        <ModalStatus 
          open={(this.props.topology && this.props.topology.errTime && this.props.topology.errTime !== this.props.topology.hasShownErrTime)||false}
          title="ERROR"
          message={this.props.topology ? this.props.topology.error:''}
          onClose={this.dismissErrorMsg.bind(this)}
        />

        <TreeView 
          root={this.props.topology?this.props.topology.data:null}
          onClick={this.onClickNode.bind(this)}
        />

        <NodeEditor
          open={this.props.isShowingEditor||false}
        />
      </div>
    );
  }
}

export default connect(
  (state: any)=>state.app.content.topo||{},
  { 
    getTopology, hasShownErrorOfGetTopology, 
    fetchNodeConfig, showEditorForNode, 
  },
)(ContentTopo);