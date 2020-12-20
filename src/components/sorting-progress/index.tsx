import React from 'react';
import { Component } from 'react'
import { 
  CircularProgress,
  Fab,
} from '@material-ui/core'

import {
  FormatAlignLeft,
  FormatAlignRight,
  FormatAlignCenter,
  Check as CheckIcon,
  Forward as ForwardIcon,
} from '@material-ui/icons'

import { green, grey } from '@material-ui/core/colors'


interface Props {
  isDone?:boolean
  isWaiting?: boolean
  isRunning?: boolean
}

interface State {
  iconIndex?: number
}


class SortingProgress extends Component<Props, State>{
  constructor(props: Props) {
    super(props)
    this.interval = null
    this.state = {
      iconIndex: 0
    }
  }

  private interval: any

  componentDidMount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
    this.interval = setInterval(()=>{
      this.setState({
        iconIndex: (this.state.iconIndex!+1)%4,
      })
    },200)
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }
  render() {
    let isDone = this.props.isDone
    let isRunning = this.props.isRunning
    let isWaiting = this.props.isWaiting
    // const isDone = false
    // const isRunning = true
    // const isWaiting = false
    if (!isDone && !isRunning && !isWaiting) isWaiting = true

    let runningComponent : any = null
    if (isRunning) {
      if (this.state.iconIndex === 0 )  {
        runningComponent = <FormatAlignLeft style={{color: 'fff'}} />
      } else if (this.state.iconIndex === 1 || this.state.iconIndex === 3) {
        runningComponent = <FormatAlignCenter style={{color: 'fff'}} />
      } else {
        runningComponent = <FormatAlignRight style={{color: 'fff'}} />
      }
    }
    return (
      <div>
        <Fab 
          style={{
            marginTop: isRunning ? -32:-1,
            backgroundColor: isDone?green[500]:grey[400],
          }} 
          size='small'
          disabled={false}
        >
          {
            isWaiting
            ? <ForwardIcon style={{color: 'fff'}} />
            : null
          }
          {
            isDone 
            ? <CheckIcon style={{color: 'fff'}}/>
            : null
          }
          { isRunning
            ? runningComponent
            : null
          }
        </Fab>
        { isRunning
          ? <CircularProgress size={40} style={{marginLeft: -40, marginTop: -2}} color='primary'/>
          : null
        }
      </div>
    );
  }
}

export default SortingProgress
