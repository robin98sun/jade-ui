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
} from '@material-ui/core'

interface Props {
  style?: any
  node?: TreeNode
  config?: Message
  fetchNodeConfig?(node: TreeNode|null|undefined):any
  updateNodeConfig?(node: TreeNode|null|undefined, config: any): any
}

interface State {
  currentTab: number
}
class NodeEditor extends Component<Props, State>{
  constructor(props: Props) {
    super(props)
    this.state = {
      currentTab: 0,
    }
  }

  componentDidMount() {
    if (this.props.fetchNodeConfig) {
      this.props.fetchNodeConfig(this.props.node)
    }
  }

  onChangeTab(e:React.ChangeEvent<{}>, newValue: number) {
    this.setState({
      currentTab: newValue,
    })
  }

  onUpdate(type: string, newValue: any) {
    if (this.props.updateNodeConfig && this.props.config && this.props.config.data) {
      let newConfig:{[key:string]:any} = {}
      newConfig[type]=newValue
      newConfig = Object.assign({}, this.props.config.data, newConfig)
      this.props.updateNodeConfig(this.props.node, newConfig)
    }
  }

  render() {
    const thisStyle = Object.assign({}, {
      marginTop: 20,
    }, this.props.style)
    const emptyNode = {
      address: null,
      port: null,
      protocol: null,
      token: null,
      namespace: null,
      podName: null,
      hostname: null,
      serviceExternal: null,
    }

    const nodes = ['selfNode', 'upperNode']
    const selfNodeName = (this.props.config && this.props.config.data && this.props.config.data.selfNode) 
                      && (this.props.config.data.selfNode.address || this.props.config.data.selfNode.hostname)
                        ? (this.props.config.data.selfNode.protocol||'http')+'://' 
                          + (this.props.config.data.selfNode.hostname || this.props.config.data.selfNode.address||'')
                          + ':' + this.props.config.data.selfNode.port 
                        : 'null'
    return (
      <div style={thisStyle}>
        {
          this.props.config && this.props.config.data
          ? <Grid container spacing={3}>
              <Grid item md={4} xs={12} >
              <ObjectEditor
                title='Basic Info'
                subtitle={selfNodeName }
                object={{
                  version: this.props.config.data.version || 'null'
                }}
              />
              </Grid>
            { nodes.map((nodeName, i) => (
                <Grid item md={4} xs={12} key={'node-'+nodeName+'-'+i}>
                  <ObjectEditor
                    title={nodeName==='upperNode'?"Upper Node":"Node Info"}
                    subtitle={(this.props.config && this.props.config.data && this.props.config.data[nodeName]) 
                              && (this.props.config.data[nodeName].address || this.props.config.data[nodeName].hostname)
                                ? (this.props.config.data[nodeName].protocol||'http')+'://' 
                                  + (this.props.config.data[nodeName].hostname || this.props.config.data[nodeName].address||'')
                                  + ':' + this.props.config.data[nodeName].port 
                                : 'null'
                              }
                    editable
                    object={
                      this.props.config && this.props.config.data 
                      && this.props.config.data[nodeName] 
                      && (this.props.config.data[nodeName].address|| this.props.config.data[nodeName].hostname)
                      ? this.props.config.data[nodeName]
                      : emptyNode
                    }
                    spacing={2}
                    name={nodeName}
                    onUpdate={(newValue: any)=>{
                      this.onUpdate.call(this, nodeName, newValue)
                    }}
                  />
                </Grid>
              ))
            }
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