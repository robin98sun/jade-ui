import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'
import { 
  Typography,
  Divider,
  Grid,
  Button,
} from '@material-ui/core'
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';

import SearchPage from '../search'
import ObjectEditor from '../../gears/object-editor'
import ModalStatus from '../../gears/modal-status'

import { 
  dispatchTask,
  dismissErrMsg,
} from './actions'

import {
  connectNode,
} from '../conn/actions'

import {TreeNode} from '../../gears/tree-view'

interface Props {
  style?: any
  node?: TreeNode
  dispatchTask?(application: any, budget: any, options: any, aggregator: any, worker: any, searchCriteria: any):any
  dismissErrMsg?(errTime: number):any
  connectNode?(addr:string, port: number, token: string, targetPage: string, slientFaile: boolean):any
  dispatchResult?: any
}

interface State {
  application: any
  budget: any
  options: any
  aggregator: any
  worker: any
}
const initState = {
  application: {
    name: null,
    version: null,
    owner: null,
  },
  budget: {
    mean: null,
    variance: null,
    target: null,
  },
  options: {
    UpdateNetwork: false,
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
  }
}

class ContentDispatcher extends Component<Props, State>{

  private application: any
  private options: any
  private aggregator: any
  private worker: any
  private budget: any
  private searchCriteria: any

  constructor(props: Props) {
    super(props)
    this.state=initState
    this.application = null
    this.budget = null
    this.options = null
    this.aggregator = null
    this.worker = null
    this.searchCriteria = null
  }

  static getDerivedStateFromProps(props: Props, state: any) {
    return state
  }

  saveOrRestoreState() {
    if (this.application || this.options || this.aggregator || this.worker) {
      this.setState(Object.assign({
        application: this.application || this.state.application,
        options: this.options || this.state.options,
        aggregator: this.aggregator || this.state.aggregator,
        worker: this.worker || this.state.worker,
      }))
    }
  }
  componentDidMount() {
    this.saveOrRestoreState()
    if (!this.props.node && this.props.connectNode) {
      this.props.connectNode('',0,'','',true)
    }
  }

  onApplicationChange(newObj: any) {
    console.log('application changed:', newObj)
    this.application = newObj
  }

  onBudgetChange(newObj: any) {
    console.log('budget changed:', newObj)
    this.budget = newObj
  }

  onOptionsChange(newObj: any) {
    console.log('options changed:', newObj)
    this.options = newObj
  }

  onAggregatorChange(newObj: any) {
    console.log('aggregator changed:', newObj)
    this.aggregator = newObj
  }

  onWorkerChange(newObj: any) {
    console.log('worker changed:', newObj)
    this.worker = newObj
  }

  onDispatch() {

    this.saveOrRestoreState()
    if (this.props.dispatchTask) {
      this.props.dispatchTask(
        this.application, 
        this.budget,
        this.options,
        this.aggregator,
        this.worker,
        this.searchCriteria,
      )
    }
  }

  dismissErrorMsg() {
    if (this.props.dismissErrMsg && this.props.dispatchResult) {
      this.props.dismissErrMsg(this.props.dispatchResult.errTime)
    }
  }

  componentDidUpdate() {
    console.log('should open error modal:', (this.props.dispatchResult && this.props.dispatchResult.error && this.props.dispatchResult.errTime !== this.props.dispatchResult.hasShownErrTime)||false)
  }

  render() {
    const introStyle = Object.assign({}, {}, this.props.style)

    let openModal = (this.props.dispatchResult && this.props.dispatchResult.error && this.props.dispatchResult.errTime !== this.props.dispatchResult.hasShownErrTime)||false

    let modalText = this.props.dispatchResult ? this.props.dispatchResult.error:''

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
              <Grid item md={4} sm={6} xs={12} >
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
                  subtitle='OPTIONS'
                  object={this.state.options}
                  onChange={this.onOptionsChange.bind(this)}
                />
              </Grid>
            </Grid>
            <Divider />
            <SearchPage
              style={{marginTop: 15}}
              onCriteriaChange={(collective: {name: string, value: any}[], exclusive:{name: string, value: any}[]) => {
                this.searchCriteria = {
                  collective,
                  exclusive,
                }

              }}
            />
          </div>
        : null
      }
        
        <ModalStatus 
          open={openModal}
          title="ERROR"
          message={modalText}
          onClose={this.dismissErrorMsg.bind(this)}
        />
      </div>
    );
  }
}

export default connect(
  (state: any)=>state.app.content.dispatcher||{},
  {dispatchTask, dismissErrMsg, connectNode},
)(ContentDispatcher);