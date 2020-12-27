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

interface Props {
  style?: any
}

interface State {
  application: any
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

  constructor(props: Props) {
    super(props)
    this.state=initState
    this.application = null
    this.options = null
    this.aggregator = null
    this.worker = null
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
  }

  onApplicationChange(newObj: any) {
    console.log('application changed:', newObj)
    this.application = newObj
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
  }

  render() {
    const introStyle = Object.assign({}, {}, this.props.style)
    return (
      <div className="content-intro" style={introStyle}>
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
              subtitle='OPTIONS'
              object={this.state.options}
              onChange={this.onOptionsChange.bind(this)}
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
        </Grid>
        <Divider />
        <SearchPage
          style={{marginTop: 15}}
          onCriteriaChange={(collective: {name: string, value: any}[], exclusive:{name: string, value: any}[]) => {
            console.log('search criteria changed:', collective, exclusive)
          }}
        />
      </div>
    );
  }
}

export default connect(
  (state: any)=>state.app.content.distpatcher||{},
  null,
)(ContentDispatcher);