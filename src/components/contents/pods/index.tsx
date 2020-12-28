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
import { Message } from './reducer'
import { TreeNode } from '../../gears/tree-view'
import ModalStatus from '../../gears/modal-status'
import ProgressIcon from '../../gears/progress-icon'

import {
  hasShownFetchPodsError,
  fetchPodCache,
} from './actions'

interface Props {
  // contentName?: string
  style?: any
  node?: TreeNode
  pods?: Message
  fetchPodCache?(node: TreeNode): any
  hasShownFetchPodsError?(errTime: number): any
}


class ContentPods extends Component<Props>{
  componentDidMount() {
    if (this.props.fetchPodCache) {
      this.props.fetchPodCache(this.props.node||{})
    }
  }
  render() {
    const introStyle = Object.assign({}, {}, this.props.style)
    return (
      <div className="content-intro" style={introStyle}>
      <ModalStatus
        open={(this.props.pods 
          && this.props.pods.isFetching)
          ||false}
        progressIcon={<ProgressIcon isRunning />}
        message={
          this.props.pods && this.props.pods.isFetching
          ? 'fetching pods...'
          : 'loading...'
        }
      />
      <ModalStatus
        open={(this.props.pods && this.props.pods.error 
          && this.props.pods.errTime
          && this.props.pods.errTime !== this.props.pods.hasShownErrTime)||false}
        title="ERROR"
        message={
          (this.props.pods 
          ? this.props.pods.error
          : null) || 'unknown error'
        }
        onClose={()=>{
          if (this.props.pods && this.props.hasShownFetchPodsError) {
             this.props.hasShownFetchPodsError(this.props.pods.errTime||0) 
          }
        }}
      />
      <Grid container>
        <Grid item xs={12}>
          <Button
            variant="contained"
            fullWidth
            style={{
            }}
            onClick={()=> {
              if (this.props.fetchPodCache) {
                this.props.fetchPodCache(this.props.node||{})
              }
            }}
          >
            <AutorenewIcon style={{
              marginRight: 20}}
            /> 
            Refresh
          </Button>
        </Grid>
      </Grid>

      {
        this.props.pods && this.props.pods.data
        ? <Fade in={(this.props.pods && this.props.pods.data)||false} timeout={1500}>
          <Grid container>
            <Grid item xs={12}>
            <Paper>
              <CopyBlock
                text={JSON.stringify(this.props.pods.data||{}, null, 4)}
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
  (state: any)=>state.app.content.pods||{},
  {
    hasShownFetchPodsError,
    fetchPodCache,
  },
)(ContentPods);