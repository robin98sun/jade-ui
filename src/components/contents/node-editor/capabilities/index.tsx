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
  Button,
} from '@material-ui/core'
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';

interface Props {
  style?: any
  node?: TreeNode
  config?: Message
  fetchNodeConfig?(node: TreeNode|null|undefined):any
  updateNodeConfig?(node: TreeNode|null|undefined, config: any): any
}

interface State {
  isAdding: boolean
}
class NodeEditor extends Component<Props, State>{
  constructor(props: Props) {
    super(props)
    this.state = {
      isAdding: false,
    }
  }

  componentDidMount() {
    if (this.props.fetchNodeConfig) {
      this.props.fetchNodeConfig(this.props.node)
    }
  }

  onUpdate(idx: number, newValue: any) {
    if (this.props.updateNodeConfig && this.props.config && this.props.config.data&& this.props.config.data.capabilities&& this.props.config.data.capabilities.length) {
      let newConfig:any = Object.assign({}, this.props.config.data)
      newConfig.capabilities = []
      for(let i=0;i<this.props.config.data.capabilities.length;i++) {
        if (!this.props.config.data.capabilities[i]) continue
        newConfig.capabilities.push(Object.assign({}, this.props.config.data.capabilities[i]))
      }
      let newItem : any = newValue

      let paramStr = ''
      if (newItem.parameters) {
        try {
          let paramObjs = JSON.parse(newItem.parameters)
          let validParams = []
          if (paramObjs && paramObjs.length) {
            for (let i=0; i<paramObjs.length; i++) {
              const param = paramObjs[i]
              if (param && param.name && param.type && typeof param.name === 'string' && typeof param.type === 'string') {
                validParams.push(param)
                paramStr+= (i===0?'':',') + param.name+'='+param.type
              }
            }
          }
          if (validParams.length) {
            newItem.parameters = validParams
          } else {
            delete newItem.parameters
          }
        } catch (e) {
          delete newItem.parameters
        }
      }

      newItem.api = (newItem.action ? newItem.action:'')+':'
      newItem.api += newItem.url 
                       ? newItem.url + paramStr
                       : newItem.type && (newItem.value !== null && newItem.value !== undefined)
                       ? newItem.type + '://' + newItem.value
                       : ''

      if (idx>=0) {
        newConfig.capabilities[idx] = newItem
      } else {
        newConfig.capabilities.unshift(newItem)
      }
      this.props.updateNodeConfig(this.props.node, newConfig)
      if (idx < 0) {
        this.setState({
          isAdding: false,
        })
      }
    }
  }

  onDelete(idx: number) {
    if (this.props.updateNodeConfig && this.props.config && this.props.config.data&& this.props.config.data.capabilities&& this.props.config.data.capabilities.length) {
      let newConfig:any = Object.assign({}, this.props.config.data)
      newConfig.capabilities = []
      for(let i=0;i<this.props.config.data.capabilities.length;i++) {
        if (i===idx) continue
        if (!this.props.config.data.capabilities[i]) continue
        newConfig.capabilities.push(Object.assign({}, this.props.config.data.capabilities[i]))
      }
      this.props.updateNodeConfig(this.props.node, newConfig)
    }
  }

  onAdd() {
    this.setState({
      isAdding: true
    })
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

    const itemSchema = {
      name: null,
      type: null,
      action: null,
      url: null,
      parameters: null,
      value: null,
    }
    return (
      <div style={thisStyle}>
        {
          this.props.config && this.props.config.data && this.props.config.data.capabilities && this.props.config.data.capabilities.length
          ? <Grid container spacing={3}>
              {
                this.state.isAdding
                ? <Grid item xs={12}>
                    <ObjectEditor
                      editable
                      spacing={2}
                      object={itemSchema}
                      title='New capability'
                      isEditing
                      onCancel={()=>{
                        this.setState({
                          isAdding: false,
                        })
                      }}
                      onUpdate={(newValue: any)=>{
                        this.onUpdate.call(this, -1, newValue)
                      }}
                    />
                  </Grid>
                : <Fade in={!this.state.isAdding} timeout={1500}>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      size = "small"
                      color="primary"
                      onClick={this.onAdd.bind(this)}
                    >
                      <AddCircleOutlineOutlinedIcon style={{marginRight: 20}}/> Add Capability
                    </Button>
                  </Grid>
                  </Fade>
              }
            { this.props.config.data.capabilities.map((rawItem:any, i:number) => {
                if (!rawItem) return null
                const item:{[key:string]:any} = Object.assign({}, itemSchema, rawItem)
                if (item.api) {
                  delete item.api
                }
                return (
                  <Fade in={true} timeout={1500} key={selfNodeName+'-capabilities-'+i}>
                  <Grid item md={6} xs={12} >
                    <ObjectEditor
                      title={item.name}
                      subtitle={rawItem.api}
                      editable
                      deletable
                      object={item}
                      spacing={2}
                      name={item.name}
                      onUpdate={(newValue: any)=>{
                        this.onUpdate.call(this, i, newValue)
                      }}
                      onDelete={()=> {
                        this.onDelete.call(this, i)
                      }}
                    />
                  </Grid>
                  </Fade>
                )
              })
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