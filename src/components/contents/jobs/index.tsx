import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'
import { 
  IconButton,
  Grid,
  Typography,
  LinearProgress,
  Divider,
} from '@material-ui/core'
import TimerOffIcon from '@material-ui/icons/TimerOff';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import CancelScheduleSendIcon from '@material-ui/icons/CancelScheduleSend';

import ModalStatus from '../../gears/modal-status'

import { stopJob } from './actions'

interface Props {
  // contentName?: string
  style?: any
  jobs?: any
  stopJob?(jobId: number, timer: any):any
}

interface State {
  showConfirmModal: boolean
  jobToStop: number
  timer: any
}
class ContentJobs extends Component<Props, State>{
  constructor(props: Props) {
    super(props)
    this.state={
      showConfirmModal: false,
      jobToStop: -1,
      timer: null,
    }
  }
  componentDidMount() {

  }
  render() {
    const thisStyle = Object.assign({}, {}, this.props.style)
    return (
      <div style={thisStyle}>
      <Grid container spacing={1}>
      {
        this.props.jobs && Object.keys(this.props.jobs).length
        ? Object.keys(this.props.jobs).map((jobId: any, idx: number) => {
            const job = this.props.jobs[jobId]
            const progressValue = (job.count.total-job.count.remaining)/job.count.total*100
            const durationSeconds = job.iteration.duration * (job.iteration.time_unit==='second'?1:60)
            const passedSeconds = (Date.now() - job.timer.start)/1000
            const remainingSeconds = (durationSeconds > passedSeconds && !job.isCanceled && !job.isFinished) 
                                    ? Math.round(durationSeconds - passedSeconds) 
                                    : 0
            const runningSeconds = job.timer.end > 0 ? (job.timer.end - job.timer.start)/1000:passedSeconds
            const realArrivalRate = Math.round((job.count.total-job.count.remaining)/runningSeconds*600)/10
            return (

              <Grid item xs={12} key={idx}>
              {
                idx>0
                ? <Divider style={{marginBottom: 25, marginTop: 0}}/>
                : null
              }
              <Grid container alignItems='center' spacing={2}>
                <Grid item md={6} xs={12} style={{marginBottom: -10}}>
                  <Typography
                    variant="subtitle2"
                  >
                  {
                    `Job ID: ${job.id}`
                  }
                  </Typography>
                </Grid>
                <Grid item md={3} xs={6} style={{marginBottom: -10}}>
                  <Typography
                    variant="subtitle2"
                  >
                  {
                    `running time: ${runningSeconds} sec`
                  }
                  </Typography>
                </Grid>
                <Grid item md={3} xs={6} style={{marginBottom: -10}}>
                  <Typography
                    variant="subtitle2"
                  >
                  {
                    `real arrival rate: ${realArrivalRate}/min`
                  }
                  </Typography>
                </Grid>
                <Grid item md={3} xs={6} style={{marginBottom: -10}}>
                  <Typography
                    variant="subtitle2"
                  >
                  {
                    `Estimated in: ${remainingSeconds} sec`
                  }
                  </Typography>
                </Grid>
                <Grid item md={3} xs={6} style={{marginBottom: -10}}>
                  <Typography
                    variant="subtitle2"
                  >
                  {
                    `mode: ${job.iteration.iteration_mode}`
                  }
                  </Typography>
                </Grid>
                <Grid item md={3} xs={6} style={{marginBottom: -10}}>
                  <Typography
                    variant="subtitle2"
                  >
                  {
                    `arrival rate: ${job.iteration.arrival_rate}/${job.iteration.time_unit}`
                  }
                  </Typography>
                </Grid>

                <Grid item md={3} xs={6} style={{marginBottom: -10}}>
                  <Typography
                    variant="subtitle2"
                  >
                  {
                    `Total tasks: ${job.count.total}`
                  }
                  </Typography>
                </Grid>
                <Grid item md={3} xs={6} style={{marginBottom: -10}}>
                  <Typography
                    variant="subtitle2"
                  >
                  {
                    `Remaining: ${job.count.remaining}`
                  }
                  </Typography>
                </Grid>
                <Grid item md={3} xs={6} style={{marginBottom: -10}}>
                  <Typography
                    variant="subtitle2"
                  >
                  {
                    `succeeded: ${job.count.succeeded}`
                  }
                  </Typography>
                </Grid>
                <Grid item md={3} xs={6} style={{marginBottom: -10}}>
                  <Typography
                    variant="subtitle2"
                  >
                  {
                    `failed: ${job.count.failed}`
                  }
                  </Typography>
                </Grid>


                <Grid item sm={10} xs={9}>
                  <LinearProgress 
                    variant="determinate" 
                    color="primary"
                    value={progressValue} 
                  />
                </Grid>
                <Grid item xs={1}>
                  <Typography 
                    variant="body2" 
                    color="textSecondary"
                  >
                  {`${Math.round(progressValue)}%`}
                  </Typography>
                </Grid>
                <Grid item sm={1} xs={2}>
                {
                  job.isFinished
                  ? <DoneAllIcon color="primary"/>
                  : job.isCanceled
                  ? <CancelScheduleSendIcon color="secondary"/>
                  : <IconButton
                      onClick={()=>{
                        this.setState({
                          jobToStop: job.id,
                          showConfirmModal: true,
                          timer: job.timer,
                        })
                      }}
                    >
                      <TimerOffIcon color="primary"/>
                    </IconButton>
                }
                </Grid>

              </Grid>
              </Grid>
            )
          })
        : null
      }  
      </Grid>

      <ModalStatus 
        open={this.state.showConfirmModal}
        title="CAUTION"
        message={`Are you going to stop job {${this.state.jobToStop}}?`}
        onClose={()=>{
          this.setState({
            jobToStop: -1,
            showConfirmModal: false,
            timer: null,
          })
        }}
        onConfirm={()=>{
          const jobToStop = this.state.jobToStop
          const timer = this.state.timer
          this.setState({
            jobToStop: -1,
            showConfirmModal: false,
            timer: null,
          })
          if (this.props.stopJob) {
            this.props.stopJob(jobToStop, timer)
          }
        }}
      />
      </div>
    );
  }
}

export default connect(
  (state: any)=>state.app.content.jobs||{},
  {stopJob},
)(ContentJobs);