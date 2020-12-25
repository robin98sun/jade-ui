import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'

import ModalStatus from '../../../gears/modal-status'
import ProgressIcon from '../../../gears/progress-icon'
import ObjectEditor from '../../../gears/object-editor'

import { TreeNode } from '../../../gears/tree-view'
import { Message } from '../reducer'
import { fetchNodeConfig, updateNodeConfig } from '../actions'

import {
  Grid,
  Fade,
} from '@material-ui/core'

interface Props {
  style?: any
  node?: TreeNode
  config?: Message
  fetchNodeConfig?(node: TreeNode|null|undefined):any
  updateNodeConfig?(node: TreeNode|null|undefined, config: any): any
}

interface State {
  // isAdding: boolean
}
class NodeEditor extends Component<Props, State>{
  constructor(props: Props) {
    super(props)
    this.state = {
      // isAdding: false,
    }
  }

  componentDidMount() {
    if (this.props.fetchNodeConfig) {
      this.props.fetchNodeConfig(this.props.node)
    }
  }

  onUpdate(newValue: any) {
    if (this.props.updateNodeConfig && this.props.config && this.props.config.data&& this.props.config.data.capabilities) {
      let newConfig:any = Object.assign({}, this.props.config.data)
      newConfig.capacity = newValue
      this.props.updateNodeConfig(this.props.node, newConfig)
    }
  }

  render() {
    const thisStyle = Object.assign({}, {
      marginTop: 20,
    }, this.props.style)

    const selfNodeName = (this.props.config && this.props.config.data && this.props.config.data.selfNode) 
                      && (this.props.config.data.selfNode.address || this.props.config.data.selfNode.hostname)
                        ? (this.props.config.data.selfNode.protocol||'http')+'://' 
                          + (this.props.config.data.selfNode.hostname || this.props.config.data.selfNode.address||'')
                          + ':' + this.props.config.data.selfNode.port 
                        : 'null'

    const capacitySchema = {
      cpu: null,
      ram: null,
      disk: null,
      bandwidth: null,
    }

    const capacity = this.props.config && this.props.config.data && this.props.config.data.capacity 
                   ? Object.assign({}, capacitySchema, this.props.config.data.capacity)
                   : capacitySchema
    return (
      <div style={thisStyle}>
        {
          this.props.config && this.props.config.data && this.props.config.data.capacity
          ? <Grid container spacing={3}>
              <Fade in={true} timeout={1500} >
                <Grid item  xs={12} >
                  <ObjectEditor
                    title="Capacity"
                    subtitle={selfNodeName}
                    editable
                    object={capacity}
                    spacing={2}
                    name="capacity"
                    canAppendProperties
                    onUpdate={(newValue: any)=>{
                      this.onUpdate.call(this, newValue)
                    }}
                  />
                </Grid>
              </Fade>
            </Grid>
          : null
        }
        <ModalStatus
          open={(this.props.config && (this.props.config.isFetching || this.props.config.isUpdating))||false}
          progressIcon={<ProgressIcon isRunning/>}
          message={this.props.config && this.props.config.isFetching ? 'fetching configurations...' : 'updating...'}
        />
      </div>
    );
  }
}

export default connect(
  (state: any)=>state.app.content.editor.config||{},
  {
    fetchNodeConfig, updateNodeConfig
  },
)(NodeEditor);