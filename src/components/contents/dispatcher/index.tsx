import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'
import { 
  Divider,
  Grid,
  Button,
  Paper,
} from '@material-ui/core'
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';

import SearchPage from '../search'
import ObjectEditor from '../../gears/object-editor'
import ModalStatus from '../../gears/modal-status'
import ProgressIcon from '../../gears/progress-icon'
import DialogForm from '../../gears/dialog-form'
import { TreeNode } from '../../gears/tree-view'

import { CopyBlock, googlecode } from "react-code-blocks"

import { 
  dispatchTask,
  dismissErrMsg,
  cancelDispatching,
  confirmDispatching,
  dismissDispatchingResult,
} from './actions'

import {
  connectNode,
} from '../conn/actions'

export interface Props {
  style?: any
  node?: TreeNode
  cancelDispatching?():any,
  confirmDispatching?(node: TreeNode, taskInst: any):any,
  dispatchTask?(node: any, task: {
        application: any, 
        budget: any, 
        options: any, 
        aggregator: any, 
        worker: any, 
        fanout: {
            collective: any,
            exclusive: any
        }, 
        resources: {
          aggregator: any, 
          worker: any,
        }
      }
    ):any
  dismissErrMsg?(errTime: number):any
  dismissDispatchingResult?(dataTime: number):any
  connectNode?(addr:string, port: number, token: string, targetPage: string, slientFaile: boolean):any
  dispatchResult?: any

  application?: any,
  budget?: any,
  options?: any,
  aggregator?: any,
  worker?: any,
  fanout?: any,
  resources?: any,
}

interface State {
  modified: boolean
  application: any
  budget: any
  options: any
  aggregator: any
  worker: any
  fanout: any
  aggregatorResources: any
  workerResources: any
}
const initState = {
  application: {
    name: null,
    version: null,
    owner: null,
  },
  budget: {
    mean: 0,
    variance: 0,
    target: 0,
    fanoutTable: [],
  },
  options: {
    updateNetwork: false,
    queuing: 'ddl',
  },
  aggregator: {
    image: null,
    port: null,
    input: {}
  },
  worker: {
    image: null,
    port: null,
    input: {}
  },
  aggregatorResources: {
    cpu: 0,
    ram: 0,
    disk: 0,
    bandwidth: 0,
  },
  workerResources: {
    cpu: 0,
    ram: 0,
    disk: 0,
    bandwidth: 0,
  },
  fanout: {
    collective: [],
    exclusive: [],
  },
  modified: false,
}

class ContentDispatcher extends Component<Props, State>{

  private application: any
  private options: any
  private aggregator: any
  private worker: any
  private budget: any
  private fanout: any
  private aggregatorResources: any
  private workerResources: any

  constructor(props: Props) {
    super(props)
    this.state=initState
    this.application = null
    this.budget = null
    this.options = null
    this.aggregator = null
    this.worker = null
    this.fanout = null
    this.aggregatorResources = null
    this.workerResources = null
    this.setState(initState)
  }

  static getDerivedStateFromProps(props: Props, state: any) {
    if (state.modified) return state

    return Object.assign({}, state, {
      application: Object.assign({}, initState.application, props.application),
      options: Object.assign({}, initState.options, props.options),
      aggregator: Object.assign({}, initState.aggregator, props.aggregator),
      worker: Object.assign({}, initState.worker, props.worker),
      budget: Object.assign({}, initState.budget, props.budget),
      fanout: Object.assign({}, initState.fanout, props.fanout),
      workerResources: Object.assign({}, initState.workerResources, props.resources&&props.resources.worker?props.resources.worker:{}),
      aggregatorResources: Object.assign({},initState.aggregatorResources,props.resources&&props.resources.aggregator?props.resources.aggregator:{})
    })
  }

  saveOrRestoreState() {
    const getResolvedState=()=>{
      return Object.assign({},initState, {
        application: this.application || this.state.application,
        options: this.options || this.state.options,
        aggregator: this.aggregator || this.state.aggregator,
        worker: this.worker || this.state.worker,
        aggregatorResources: this.aggregatorResources || this.state.aggregatorResources,
        workerResources: this.workerResources || this.state.workerResources,
        budget: this.budget||this.state.budget,
        fanout: this.fanout||this.state.fanout,
        modified: true,
      })
    }
    if (this.application || this.options || this.aggregator || this.worker || this.aggregatorResources || this.workerResources || this.budget || this.fanout) {
      if (this.aggregator){
        let aggregatorInput: any = {}
        if (this.aggregator.input) {
          try {
            aggregatorInput = JSON.parse(this.aggregator.input)
          } catch (e) {

          }
        }
        this.aggregator.input = aggregatorInput
      }

      if (this.worker){
        let workerInput: any = {}
        if (this.worker.input) {
          try {
            workerInput = JSON.parse(this.worker.input)
          } catch (e) {

          }
        }
        this.worker.input = workerInput
      }

      if (this.budget){
        let fanoutTable: any = []
        if (this.budget.fanoutTable) {
          try {
            const tmpTable = JSON.parse(this.budget.fanoutTable)
            console.log(tmpTable)
            if (Array.isArray(tmpTable) && tmpTable.length) {
              fanoutTable = tmpTable.filter(item => (Number.isInteger(item)))
            }
          } catch (e) {

          }
        }
        this.budget.fanoutTable = fanoutTable
      }
      const resolved = getResolvedState()
      this.setState(resolved)
      return resolved
    }
    return getResolvedState()
  }
  componentDidMount() {
    this.saveOrRestoreState()
    if (!this.props.node && this.props.connectNode) {
      this.props.connectNode('',0,'','',true)
    }
  }

  onApplicationChange(newObj: any) {
    this.application = newObj
  }

  onBudgetChange(newObj: any) {
    this.budget = newObj
  }

  onOptionsChange(newObj: any) {
    this.options = newObj
  }

  onAggregatorChange(newObj: any) {
    this.aggregator = newObj
  }

  onWorkerChange(newObj: any) {
    this.worker = newObj
  }

  onAggregatorResourcesChange(newObj: any) {
    this.aggregatorResources = newObj
  }

  onWorkerResourcesChange(newObj: any) {
    this.workerResources = newObj
  }

  onDispatch() {
    const resultState:any = this.saveOrRestoreState()
    if (resultState) {
      if (this.props.dispatchTask) {
        this.props.dispatchTask(
          this.props.node,
          {
            application: resultState.application, 
            budget: resultState.budget,
            options: resultState.options,
            aggregator: resultState.aggregator,
            worker: resultState.worker,
            fanout: resultState.fanout,
            resources: {
              aggregator: resultState.aggregatorResources,
              worker: resultState.workerResources,
            },
          }
        )
      } 
    }
    
  }

  dismissErrorMsg() {
    if (this.props.dismissErrMsg && this.props.dispatchResult) {
      this.props.dismissErrMsg(this.props.dispatchResult.errTime)
    }
  }

  dismissResult() {
    if (this.props.dismissDispatchingResult && this.props.dispatchResult) {
      this.props.dismissDispatchingResult(this.props.dispatchResult.dataTime)
    }
  }

  render() {
    const introStyle = Object.assign({}, {}, this.props.style)

    let openErrorModal = (this.props.dispatchResult && this.props.dispatchResult.error && this.props.dispatchResult.errTime !== this.props.dispatchResult.hasShownErrTime)||false

    let errorModalText = this.props.dispatchResult ? this.props.dispatchResult.error:''

    return (
      <div className="content-intro" style={introStyle}>
        {
          this.props.node && this.props.node.name
          ? <div>
              <Button 
                fullWidth
                variant="contained"
                onClick={this.onDispatch.bind(this)}
              >
                <SendOutlinedIcon style={{marginRight: 20}}/> Dispatch Task
              </Button>
              <Grid container spacing={2} style={{marginTop: 10, marginBottom: 15}}>
                <Grid item md={3} sm={6} xs={12} >
                  <ObjectEditor
                    inputMode
                    subtitle='APPLICATION'
                    object={this.state.application}
                    onChange={this.onApplicationChange.bind(this)}
                  />
                </Grid>
                <Grid item md={3} sm={6} xs={12} >
                  <ObjectEditor
                    inputMode
                    subtitle='BUDGET'
                    object={this.state.budget}
                    onChange={this.onBudgetChange.bind(this)}
                  />
                </Grid>
                <Grid item md={3} sm={6} xs={12} >
                  <ObjectEditor
                    inputMode
                    subtitle='AGGREGATOR'
                    object={this.state.aggregator}
                    onChange={this.onAggregatorChange.bind(this)}
                  />
                </Grid>
                <Grid item md={3} sm={6} xs={12} >
                  <ObjectEditor
                    inputMode
                    subtitle='WORKER'
                    object={this.state.worker}
                    onChange={this.onWorkerChange.bind(this)}
                  />
                </Grid>
                <Grid item md={3} sm={6} xs={12} >
                  <ObjectEditor
                    inputMode
                    subtitle='Resources for Aggregator'
                    object={this.state.aggregatorResources}
                    onChange={this.onAggregatorResourcesChange.bind(this)}
                  />
                </Grid>
                <Grid item md={3} sm={6} xs={12} >
                  <ObjectEditor
                    inputMode
                    subtitle='Resources for Worker'
                    object={this.state.workerResources}
                    onChange={this.onWorkerResourcesChange.bind(this)}
                  />
                </Grid>
                <Grid item md={3} sm={6} xs={12} >
                  <ObjectEditor
                    inputMode
                    subtitle='OPTIONS'
                    object={this.state.options}
                    onChange={this.onOptionsChange.bind(this)}
                  />
                </Grid>
              </Grid>
              <Divider />
              <SearchPage
                style={{marginTop: 15}}
                collectiveCriteria={this.state.fanout.collective||[]}
                exclusiveCriteria={this.state.fanout.exclusive||[]}
                onCriteriaChange={(collective: {name: string, value: any}[], exclusive:{name: string, value: any}[]) => {
                  this.fanout = {
                    collective,
                    exclusive,
                  }
                }}
              />
            </div>
          : null
        }
        <DialogForm
          open={this.props.dispatchResult&&this.props.dispatchResult.isFetching}
          title="Confirm to dispatch this task?"
          contentView={
            <Paper>
              <CopyBlock
                text={JSON.stringify(this.props.dispatchResult?this.props.dispatchResult.data:{}, null, 4)}
                language="json"
                showLineNumbers
                theme={googlecode}
                codeBlock
              />
            </Paper>
          }
          onClose={()=>{
            if(this.props.cancelDispatching) {
              this.props.cancelDispatching()
            }
          }}
          onSubmit={()=>{
            if(this.props.confirmDispatching) {
              this.props.confirmDispatching(this.props.node||{}, this.props.dispatchResult?this.props.dispatchResult.data:{})
            }
          }}
        />

        <ModalStatus 
          open={openErrorModal||false}
          title="ERROR"
          message={errorModalText}
          onClose={this.dismissErrorMsg.bind(this)}
        />
        <ModalStatus 
          open={(this.props.dispatchResult&&this.props.dispatchResult.isUpdating)||false}
          message="dispatching..."
          progressIcon={<ProgressIcon isRunning />}
        />
        <ModalStatus 
          open={
            (this.props.dispatchResult && this.props.dispatchResult.data
            && this.props.dispatchResult.dataTime !== this.props.dispatchResult.hasShownDataTime)||false
          }
          title="RESULT"
          message={JSON.stringify(this.props.dispatchResult.data, null, 4)}
          onClose={this.dismissResult.bind(this)}
        />
      </div>
    );
  }
}

export default connect(
  (state: any)=>state.app.content.dispatcher||{},
  {dispatchTask, dismissErrMsg, connectNode, dismissDispatchingResult, 
  cancelDispatching,
  confirmDispatching,},
)(ContentDispatcher);