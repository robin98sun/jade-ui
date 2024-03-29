import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'

import DispatcherView, { Props } from '../dispatcher'
import { plankton, TemplateOptions } from './example-tasks'

import {
  Grid,
  Button,
} from '@material-ui/core'

import AssignmentIcon from '@material-ui/icons/Assignment';

import ObjectEditor from '../../gears/object-editor'

interface State {
  task: any
  options: TemplateOptions
  showDispatcher: boolean
}

const initOptions: any = {
  registry: 'robin98',
  serviceTimeDistribution: 'exponential',
  meanServiceTime: 1000,
  queuing: 'fifo',
  version: '1.0.0',
  cmd: 'none',
  minServiceTime: 10000,
  maxServiceTime: 10000,
  workloadSize: 100,
  aggregatorTime: 0,
  aggregatorFactor: 0,
  budgetMean: 0,
  budgetVariance: 0,
  budgetTarget: 0,
}

const optionsSchema : any = {
  registry: 'robin98',
  serviceTimeDistribution: ['none', 'exponential'],
  meanServiceTime: 1000,
  queuing: ['ddl', 'fifo'],
  cmd: ['none', 'service time', 'gen and merge', 'gen and merge and wait'],
  version: '1.0.0',
  minServiceTime: 10000,
  maxServiceTime: 10000,
  workloadSize: 100,
  aggregatorTime: 0,
  aggregatorFactor: 0,
  budgetMean: 0,
  budgetVariance: 0,
  budgetTarget: 0,
}

const initState: State = {
  task: null, 
  options: initOptions,
  showDispatcher: false,
}

class ContentExample extends Component<Props, State>{
  private templateOptions: any
  constructor(props: Props) {
    super(props)
    this.state = initState
    this.templateOptions = null
  }
  saveOrRestoreState() {
    if (this.templateOptions) {
      const resolvedState : any = Object.assign({}, this.state, {
        options: this.templateOptions,
        showDispatcher: false,
      })
      return resolvedState
    } else {
      return null
    }
  }

  resolveState() {
    const resolvedState = this.saveOrRestoreState()
    if (resolvedState) {
      this.setState(resolvedState)
    }
    this.templateOptions = null
  }
  componentDidMount() {
    this.resolveState()
  }
  render() {
    const introStyle = Object.assign({}, {}, this.props.style||{})
    return (
      <div className="content-example" style={introStyle}>
        <div >
        <Grid container 
          style={{marginBottom: 16}} 
        >
          <Grid item xs={12} hidden={this.state.showDispatcher}>
            <ObjectEditor
              inputMode
              subtitle="TEMPLATE OPTIONS"
              object={this.templateOptions || initState.options}
              schema={optionsSchema}
              onChange={(newObj:any)=>{
                this.templateOptions = newObj
              }}
            />
          </Grid>
          <Grid item xs={12} >
            <Button
              fullWidth
              variant="contained"
              style={{
                marginTop: -3,
                backgroundColor:"#33A033",
              }}
              onClick={()=>{
                if (!this.state.showDispatcher) {
                const resolvedState = Object.assign({}, this.state, this.saveOrRestoreState())
                const task: any = plankton(
                  resolvedState.options,
                )
                this.setState(Object.assign({}, this.state, resolvedState, {
                  task,
                  showDispatcher: true,
                }))
                } else {
                  this.setState(Object.assign({}, this.state, {
                    showDispatcher: false,
                  }))
                }
              }}
            >
              <AssignmentIcon style={{marginRight: 20}}/> 
              {
                this.state.showDispatcher? "Regenerate" :"Generate Task"
              }
            </Button>
          </Grid>
        </Grid>
        </div>
        <div hidden={!this.state.showDispatcher} style={{marginTop: 20}}>
        <DispatcherView 
          {...Object.assign({},this.props, this.state.task)}
          onClose={()=> {
            // this.setState({
            //   showDispatcher: false,
            // })
          }}
        />
        </div>
      </div>
    );
  }
}

export default connect(
  (state: any)=>state.app.content.example||{},
  null,
)(ContentExample);