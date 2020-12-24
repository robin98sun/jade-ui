import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'

import { TreeNode } from '../../gears/tree-view'

import ConfigurationsPage from './configurations'
import CapabilitiesPage from './capabilities'
import CapacitiesPage from './capacities'
import TasksPage from './tasks'
import PodsPage from './pods'
import StatsPage from './stats'

import {
  Tab,
  Tabs,
  Fade,
} from '@material-ui/core'

interface Props {
  style?: any
  node?: TreeNode
  forceRefreshWhenSwitching?: boolean
}

interface State {
  currentTab: number
}
class NodeEditor extends Component<Props, State>{
  constructor(props: Props) {
    super(props)
    this.state = {
      currentTab: 0,
    }
  }

  componentDidMount() {
  }

  onChangeTab(e:React.ChangeEvent<{}>, newValue: number) {
    this.setState({
      currentTab: newValue,
    })
  }
  render() {
    const editorStyle = Object.assign({}, {
      marginTop: -20
    }, this.props.style)
    return (
      <div style={editorStyle}>
        <Tabs
          variant='scrollable'
          scrollButtons='auto'
          textColor='primary'
          value={this.state.currentTab}
          onChange={this.onChangeTab.bind(this)}
        >
          <Tab label="Configurations" />
          <Tab label="Capabilities" />
          <Tab label="Capacities" />
          <Tab label="Tasks" />
          <Tab label="Pods" />
          <Tab label="Stats" />
        </Tabs>

        {
          this.state.currentTab===0 || !this.props.forceRefreshWhenSwitching
          ? <Fade in={this.state.currentTab===0}>
            <div >
              <ConfigurationsPage node={this.props.node}/>
            </div>
            </Fade>
          : null
        }

        {
          this.state.currentTab===1 || !this.props.forceRefreshWhenSwitching
          ? <Fade in={this.state.currentTab===1}>
            <div>
              <CapabilitiesPage node={this.props.node}/>
            </div>
            </Fade>
          : null
        }

        {
          this.state.currentTab===2 || !this.props.forceRefreshWhenSwitching
          ? <Fade in={this.state.currentTab===2}>
            <div>
              <CapacitiesPage node={this.props.node}/>
            </div>
            </Fade>
          : null
        }

        {
          this.state.currentTab===3 || !this.props.forceRefreshWhenSwitching
          ? <Fade in={this.state.currentTab===3}>
            <div>
              <TasksPage node={this.props.node}/>
            </div>
            </Fade>
          : null
        }

        {
          this.state.currentTab===4 || !this.props.forceRefreshWhenSwitching
          ? <Fade in={this.state.currentTab===4}>
            <div>
              <PodsPage node={this.props.node}/>
            </div>
            </Fade>
          : null
        }

        {
          this.state.currentTab===5 || !this.props.forceRefreshWhenSwitching
          ? <Fade in={this.state.currentTab===5}>
            <div>
              <StatsPage node={this.props.node}/>
            </div>
            </Fade>
          : null
        }

      </div>
    );
  }
}

export default connect(
  (state: any)=>state.app.content.editor||{},
  {
  },
)(NodeEditor);