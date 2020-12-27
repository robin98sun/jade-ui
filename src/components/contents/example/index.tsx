import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'

import DispatcherView, { Props } from '../dispatcher'
import { plankton } from './example-tasks'

import {
  Divider,
  Grid,
} from '@material-ui/core'

import ObjectEditor from '../../gears/object-editor'

interface State {
  task: any
  exampleName: string
  version: string
}

const initState: any = {
  task: null,
  exampleName: 'simple-plankton',
  version: '1.4.28.18.6.4'
}

initState.task = plankton(initState.exampleName, initState.version)

class ContentExample extends Component<Props, State>{
  constructor(props: Props) {
    super(props)
    this.state = initState
  }
  componentDidMount() {
  }
  render() {
    const introStyle = Object.assign({}, {}, this.props.style||{})
    return (
      <div className="content-example" style={introStyle}>
        <Grid container style={{marginBottom: 16}}>
          <Grid item xs={12}>
            <ObjectEditor
              inputMode
              subtitle="TEMPLATE OPTIONS"
              object={{version: this.state.version}}
              onChange={(newObj:any)=>{
                const version = newObj.version
                const task = plankton(this.state.exampleName, version)
                this.setState({
                  task,
                  version,
                })
              }}
            />
          </Grid>
        </Grid>
        <Divider style={{marginBottom: 15}}/>
        <DispatcherView 
          {...Object.assign({},this.props, this.state.task)}
        />
      </div>
    );
  }
}

export default connect(
  (state: any)=>state.app.content.example||{},
  null,
)(ContentExample);