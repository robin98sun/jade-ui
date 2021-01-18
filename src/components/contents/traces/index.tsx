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
import ObjectEditor from '../../gears/object-editor'

import {
  clearTaskCache,
  clearTaskCacheCanceled,
  hasShownClearCacheOrFetchCacheError,
  hasShownClearCacheResult,
  clearTaskCacheConfirmed,
  fetchTraces,
  fetchJobs,
} from './actions'

interface Props {
  // contentName?: string
  style?: any
  node?: TreeNode
  traces?: Message
  jobs?: string[]
  fetchJobs?(node: TreeNode): any
  fetchTraces?(node: TreeNode, jobId?: string): any
  clearTaskCacheConfirmed?(node: TreeNode): any
  hasShownClearCacheOrFetchCacheError?(errTime: number): any
  hasShownClearCacheResult?(dataTime: number): any
  clearTaskCacheCanceled?():any
  clearTaskCache?():any
}

interface State {
  selectedJob: string
}

class ContentTraces extends Component<Props, State>{
  constructor(props: Props) {
    super(props)
    this.state = {
      selectedJob: 'all',
    }
  }
  componentDidMount() {
    if (this.props.fetchJobs) {
      this.props.fetchJobs(this.props.node||{})
    }
  }
  render() {
    const introStyle = Object.assign({}, {}, this.props.style)
    const jobSelectorSchema:any = {
      job: ['all'],
    }
    if (this.props.jobs && this.props.jobs.length) {
      Array.prototype.push.apply(jobSelectorSchema.job, this.props.jobs)
    }

    return (
      <div className="content-intro" style={introStyle}>
      <ModalStatus
        open={(this.props.traces 
          && (this.props.traces.isFetching || this.props.traces.isClearing))
          ||false}
        progressIcon={<ProgressIcon isRunning />}
        message={
          this.props.traces && this.props.traces.isFetching
          ? 'fetching traces...'
          : this.props.traces && this.props.traces.isClearing
          ? 'clearing...'
          : 'loading...'
        }
      />
      <ModalStatus
        open={(this.props.traces && this.props.traces.error 
          && this.props.traces.errTime
          && this.props.traces.errTime !== this.props.traces.hasShownErrTime)||false}
        title="ERROR"
        message={
          (this.props.traces 
          ? this.props.traces.error
          : null) || 'unknown error'
        }
        onClose={()=>{
          if (this.props.traces && this.props.hasShownClearCacheOrFetchCacheError) {
             this.props.hasShownClearCacheOrFetchCacheError(this.props.traces.errTime||0) 
          }
        }}
      />
      <ModalStatus
        open={(this.props.traces && this.props.traces.clearResponse && this.props.traces.clearTime
          && this.props.traces.clearTime !== this.props.traces.hasShownClearTime)||false}
        title="Result of clearing"
        message={
          this.props.traces 
          ? JSON.stringify(this.props.traces.clearResponse, null, 4)
          : 'unknown response'
        }
        onClose={()=>{
          if (this.props.traces && this.props.hasShownClearCacheResult) {
             this.props.hasShownClearCacheResult(this.props.traces.clearTime||0) 
          }
        }}
      />
      <ModalStatus
        open={(this.props.traces && this.props.traces.isConfirming)||false}
        title="ATTENTION"
        message="Are you going to clear the task cache and stat data on this node?"
        onClose={()=>{
          if (this.props.traces && this.props.clearTaskCacheCanceled) {
             this.props.clearTaskCacheCanceled() 
          }
        }}
        onConfirm={()=>{
          if (this.props.traces && this.props.clearTaskCacheConfirmed) {
             this.props.clearTaskCacheConfirmed(this.props.node||{}) 
          }
        }}
      />
      <Grid container>
        <Grid item sm={11} xs={12} >
          <ObjectEditor
            style={{marginBottom: 15}}
            schema={jobSelectorSchema}
            object={{job: this.state.selectedJob}}
            inputMode
            onChange={(newObj:any)=>{
              this.setState({
                selectedJob: newObj.job,
              })
            }}
          />
        </Grid>
        <Grid item sm={5} xs={12}>
          <Button
            variant="contained"
            fullWidth
            style={{
            }}
            onClick={()=> {
              if (this.props.fetchTraces) {
                this.props.fetchTraces(this.props.node||{}, this.state.selectedJob)
              }
            }}
          >
            <AutorenewIcon style={{
              marginRight: 20}}
            /> 
            Fetch Traces
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
            Clear Task Cache
          </Button>

        </Grid>
      </Grid>

      {
        this.props.traces && this.props.traces.data
        ? <Fade in={this.props.traces !== undefined && this.props.traces.data !== undefined} timeout={1500}>
          <Grid container>
            <Grid item xs={12}>
            <Paper>
              <CopyBlock
                text={JSON.stringify(this.props.traces.data||{}, null, 4)}
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
  (state: any)=>state.app.content.traces||{},
  {
    clearTaskCache,
    clearTaskCacheCanceled,
    hasShownClearCacheOrFetchCacheError,
    hasShownClearCacheResult,
    clearTaskCacheConfirmed,
    fetchTraces,
    fetchJobs,
  },
)(ContentTraces);