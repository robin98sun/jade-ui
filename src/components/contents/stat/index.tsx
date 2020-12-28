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
          && this.props.stat.isFetching)
          ||false}
        progressIcon={<ProgressIcon isRunning />}
        message={
          this.props.stat && this.props.stat.isFetching
          ? 'fetching stat...'
          : 'loading...'
        }
      />
      <ModalStatus
        open={(this.props.stat && this.props.stat.error 
          && this.props.stat.errTime
          && this.props.stat.errTime !== this.props.stat.hasShownErrTime)||false}
        title="ERROR"
        message={
          (this.props.stat 
          ? this.props.stat.error
          : null) || 'unknown error'
        }
        onClose={()=>{
          if (this.props.stat && this.props.hasShownFetchStatsError) {
             this.props.hasShownFetchStatsError(this.props.stat.errTime||0) 
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
      </Grid>

      {
        this.props.stat && this.props.stat.data
        ? <Fade in={(this.props.stat && this.props.stat.data)||false} timeout={1500}>
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
  },
)(ContentStats);