import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'

import ModalStatus from '../../gears/modal-status'
import ProgressIcon from '../../gears/progress-icon'
import TreeView, {TreeNode} from '../../gears/tree-view'
import DialogForm from '../../gears/dialog-form'
import NodeEditor from '../node-editor'

import { 
  getTopology, 
  hasShownErrorOfGetTopology, 
  showNodeEditor,
  closeNodeEditor,
} from './actions'
import { Message } from './reducer'

interface Props {
  style?: any
  getTopology?(protocol:string, addr: string, port: number, token: string):any
  hasShownErrorOfGetTopology?(errTime: any):any
  showNodeEditor?(node: TreeNode):any
  closeNodeEditor?():any
  currentNode?: {
    addr?: string,
    port?: number,
    token?: string,
    config?: any,
    protocol?: string,
  },
  topology?: Message,
  isShowingEditor?:boolean
  editingNode?: TreeNode
}

class ContentTopo extends Component<Props>{

  componentDidMount() {
    if (this.props.getTopology) {
      const addr = this.props.currentNode ? this.props.currentNode.addr ||'': ''
      const port = this.props.currentNode ? this.props.currentNode.port||0: 0
      const token = this.props.currentNode ? this.props.currentNode.token||'': ''
      const protocol = this.props.currentNode ? this.props.currentNode.protocol||'': ''
      this.props.getTopology(protocol, addr, port, token)
    }
  }

  dismissErrorMsg() {
    if (this.props.hasShownErrorOfGetTopology && this.props.topology) {
      this.props.hasShownErrorOfGetTopology(this.props.topology.errTime)
    }
  }

  onClickNode(node: TreeNode) {
    if (this.props.showNodeEditor) {
      this.props.showNodeEditor(node)
    }
  }

  onCloseEditor() {
    if (this.props.closeNodeEditor) {
      this.props.closeNodeEditor()
    }
  }

  render() {
    const introStyle = Object.assign({}, {}, this.props.style)
    return (
      <div className="content-topology" style={introStyle}>
        <ModalStatus 
          open={(this.props.topology && this.props.topology.isFetching) ||false}
          message="getting topology..."
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

        {
          this.props.isShowingEditor
          ? <DialogForm
              open={this.props.isShowingEditor||false}
              title={this.props.editingNode ? this.props.editingNode.name:''}
              contentView={<NodeEditor />}
              onClose={this.onCloseEditor.bind(this)}
            />
          : null
        }
        
      </div>
    );
  }
}

export default connect(
  (state: any)=>state.app.content.topo||{},
  { 
    getTopology, hasShownErrorOfGetTopology, 
    showNodeEditor, closeNodeEditor,
  },
)(ContentTopo);