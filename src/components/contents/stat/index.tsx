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

import { CopyBlock, googlecode } from "react-code-blocks"
import { Message } from '../tasks/reducer'
import { TreeNode } from '../../gears/tree-view'
import ModalStatus from '../../gears/modal-status'
import ProgressIcon from '../../gears/progress-icon'

import LayersClearIcon from '@material-ui/icons/LayersClear';
import {
  clearTaskCache,
  clearTaskCacheCanceled,
  hasShownClearCacheOrFetchCacheError,
  hasShownClearCacheResult,
  clearTaskCacheConfirmed,
} from '../tasks/actions'

import {
  hasShownFetchStatsError,
  fetchStatCache,
} from './actions'

interface Props {
  // contentName?: string
  style?: any
  node?: TreeNode
  stat?: Message
  fetchStatCache?(node: TreeNode): any
  hasShownFetchStatsError?(errTime: number): any
  clearTaskCacheConfirmed?(node: TreeNode): any
  hasShownClearCacheOrFetchCacheError?(errTime: number): any
  hasShownClearCacheResult?(dataTime: number): any
  clearTaskCacheCanceled?():any
  clearTaskCache?():any
}


class ContentStats extends Component<Props>{
  componentDidMount() {
    if (this.props.fetchStatCache) {
      this.props.fetchStatCache(this.props.node||{})
    }
  }
  render() {
    const introStyle = Object.assign({}, {}, this.props.style)
    return (
      <div className="content-intro" style={introStyle}>
      <ModalStatus
        open={(this.props.stat 
          && (this.props.stat.isFetching || this.props.stat.isClearing))
          ||false}
        progressIcon={<ProgressIcon isRunning />}
        message={
          this.props.stat && this.props.stat.isFetching
          ? 'fetching tasks...'
          : this.props.stat && this.props.stat.isClearing
          ? 'clearing...'
          : 'loading...'
        }
      />
      <ModalStatus
        open={
          this.props.stat !== undefined 
          && this.props.stat !== null
          && this.props.stat.error !== undefined
          && this.props.stat.errTime !== undefined
          && this.props.stat.errTime !== this.props.stat.hasShownErrTime
        }
        title="ERROR"
        message={
          (this.props.stat 
          ? this.props.stat.error
          : null) || 'unknown error'
        }
        onClose={()=>{
          if (this.props.stat && this.props.hasShownClearCacheOrFetchCacheError) {
             this.props.hasShownClearCacheOrFetchCacheError(this.props.stat.errTime||0) 
          }
        }}
      />
      <ModalStatus
        open={(this.props.stat && this.props.stat.clearResponse && this.props.stat.clearTime
          && this.props.stat.clearTime !== this.props.stat.hasShownClearTime)||false}
        title="Result of clearing"
        message={
          this.props.stat 
          ? JSON.stringify(this.props.stat.clearResponse, null, 4)
          : 'unknown response'
        }
        onClose={()=>{
          if (this.props.stat && this.props.hasShownClearCacheResult) {
             this.props.hasShownClearCacheResult(this.props.stat.clearTime||0) 
          }
        }}
      />
      <ModalStatus
        open={(this.props.stat && this.props.stat.isConfirming)||false}
        title="ATTENTION"
        message="Are you going to clear the task cache and stat data on this node?"
        onClose={()=>{
          if (this.props.stat && this.props.clearTaskCacheCanceled) {
             this.props.clearTaskCacheCanceled() 
          }
        }}
        onConfirm={()=>{
          if (this.props.stat && this.props.clearTaskCacheConfirmed) {
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
              if (this.props.fetchStatCache) {
                this.props.fetchStatCache(this.props.node||{})
              }
            }}
          >
            <AutorenewIcon style={{
              marginRight: 20}}
            /> 
            Refresh
          </Button>
        </Grid>
        <Grid item sm={1} xs={12}>
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
            Clear Stat
          </Button>

        </Grid>
      </Grid>

      {
        this.props.stat && this.props.stat.data
        ? <Fade in={(this.props.stat !== undefined && this.props.stat.data !== undefined)} timeout={1500}>
          <Grid container>
            <Grid item xs={12}>
            <Paper>
              <CopyBlock
                text={JSON.stringify(this.props.stat.data||{}, null, 4)}
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
  (state: any)=>state.app.content.stat||{},
  {
    hasShownFetchStatsError,
    fetchStatCache,
    clearTaskCache,
    clearTaskCacheCanceled,
    hasShownClearCacheOrFetchCacheError,
    hasShownClearCacheResult,
    clearTaskCacheConfirmed,
  },
)(ContentStats);