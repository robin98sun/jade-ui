import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Paper,
  Grid,
  Fade,
} from '@material-ui/core'
import AutorenewIcon from '@material-ui/icons/Autorenew';
import LayersClearIcon from '@material-ui/icons/LayersClear';
// import {
//   Menu as MenuIcon
// } from '@material-ui/icons'
import { CopyBlock, googlecode } from "react-code-blocks"
import { Message } from './reducer'
import { TreeNode } from '../../gears/tree-view'
import ModalStatus from '../../gears/modal-status'
import ProgressIcon from '../../gears/progress-icon'

import {
  clearTaskCache,
  clearTaskCacheCanceled,
  hasShownClearCacheOrFetchCacheError,
  hasShownClearCacheResult,
  clearTaskCacheConfirmed,
  fetchTaskCache,
} from './actions'

interface Props {
  // contentName?: string
  style?: any
  node?: TreeNode
  tasks?: Message
  fetchTaskCache?(node: TreeNode): any
  clearTaskCacheConfirmed?(node: TreeNode): any
  hasShownClearCacheOrFetchCacheError?(errTime: number): any
  hasShownClearCacheResult?(dataTime: number): any
  clearTaskCacheCanceled?():any
  clearTaskCache?():any
}


class ContentTasks extends Component<Props>{
  componentDidMount() {
    console.log('this.props.node:', this.props.node)
    if (this.props.fetchTaskCache) {
      this.props.fetchTaskCache(this.props.node||{})
    }
  }
  render() {
    const introStyle = Object.assign({}, {}, this.props.style)
    return (
      <div className="content-intro" style={introStyle}>
      <ModalStatus
        open={(this.props.tasks 
          && (this.props.tasks.isFetching || this.props.tasks.isClearing))
          ||false}
        progressIcon={<ProgressIcon isRunning />}
        message={
          this.props.tasks && this.props.tasks.isFetching
          ? 'fetching tasks...'
          : this.props.tasks && this.props.tasks.isClearing
          ? 'clearing...'
          : 'loading...'
        }
      />
      <ModalStatus
        open={(this.props.tasks && this.props.tasks.error 
          && this.props.tasks.errTime
          && this.props.tasks.errTime !== this.props.tasks.hasShownErrTime)||false}
        title="ERROR"
        message={
          (this.props.tasks 
          ? this.props.tasks.error
          : null) || 'unknown error'
        }
        onClose={()=>{
          if (this.props.tasks && this.props.hasShownClearCacheOrFetchCacheError) {
             this.props.hasShownClearCacheOrFetchCacheError(this.props.tasks.errTime||0) 
          }
        }}
      />
      <ModalStatus
        open={(this.props.tasks && this.props.tasks.clearResponse && this.props.tasks.clearTime
          && this.props.tasks.clearTime !== this.props.tasks.hasShownClearTime)||false}
        title="Result of clearing"
        message={
          (this.props.tasks 
          ? this.props.tasks.clearResponse
          : null) || 'unknown response'
        }
        onClose={()=>{
          if (this.props.tasks && this.props.hasShownClearCacheResult) {
             this.props.hasShownClearCacheResult(this.props.tasks.clearTime||0) 
          }
        }}
      />
      <ModalStatus
        open={(this.props.tasks && this.props.tasks.isConfirming)||false}
        title="ATTENTION"
        message="Are you going to clear the task cache and stat data on this node?"
        onClose={()=>{
          if (this.props.tasks && this.props.clearTaskCacheCanceled) {
             this.props.clearTaskCacheCanceled() 
          }
        }}
        onConfirm={()=>{
          if (this.props.tasks && this.props.clearTaskCacheConfirmed) {
             this.props.clearTaskCacheConfirmed(this.props.node||{}) 
          }
        }}
      />
      <Grid container>
        <Grid item sm={5} xs={12}>
          <Button
            variant="contained"
            fullWidth
            style={{
            }}
            onClick={()=> {
              if (this.props.fetchTaskCache) {
                this.props.fetchTaskCache(this.props.node||{})
              }
            }}
          >
            <AutorenewIcon style={{
              marginRight: 20}}
            /> 
            Refresh
          </Button>
        </Grid>
        <Grid item sm={2} xs={12}>
          <div style={{height: 10}}/>
        </Grid>
        <Grid item sm={5} xs={12}>
          <Button
            variant="contained"
            fullWidth
            style={{ 
              backgroundColor: "#AC3333"
            }}
            onClick={()=>{
              if (this.props.clearTaskCache) {
                this.props.clearTaskCache()
              }
            }}
          >
            <LayersClearIcon style={{
              marginRight: 20, 
            }}
            /> 
            Clear Task Cache
          </Button>

        </Grid>
      </Grid>

      {
        this.props.tasks && this.props.tasks.data
        ? <Fade in={(this.props.tasks && this.props.tasks.data)||false} timeout={1500}>
          <Grid container>
            <Grid item xs={12}>
            <Paper>
              <CopyBlock
                text={JSON.stringify(this.props.tasks.data||{}, null, 4)}
                language="json"
                showLineNumbers
                theme={googlecode}
                codeBlock
              />
            </Paper>
            </Grid>
          </Grid>
          </Fade>
        : null
      }
      </div>
    );
  }
}

export default connect(
  (state: any)=>state.app.content.tasks||{},
  {
    clearTaskCache,
    clearTaskCacheCanceled,
    hasShownClearCacheOrFetchCacheError,
    hasShownClearCacheResult,
    clearTaskCacheConfirmed,
    fetchTaskCache,
  },
)(ContentTasks);