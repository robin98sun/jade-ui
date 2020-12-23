import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'

import ModalStatus from '../../gears/modal-status'
import ProgressIcon from '../../gears/progress-icon'
import { TreeNode } from '../../gears/tree-view'
import { Message } from './reducer'
import { fetchNodeConfig } from './actions'

import {
  Tab,
  Tabs,
  Paper,
  Fade,
  Typography,
} from '@material-ui/core'

import { CopyBlock, googlecode } from "react-code-blocks"

interface Props {
  style?: any
  node?: TreeNode
  config?: Message
  fetchNodeConfig?(node: TreeNode|null|undefined):any
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
    if (this.props.fetchNodeConfig) {
      this.props.fetchNodeConfig(this.props.node)
    }
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
          <Tab label="Stat" />
        </Tabs>

        <div hidden={this.state.currentTab!==0}>
        <Fade in={this.state.currentTab===0}>
        <div >
        {
            this.props.config && this.props.config.data
            ? <Paper>
              <CopyBlock
                text={JSON.stringify(this.props.config.data, null, 4)}
                language="json"
                showLineNumbers
                theme={googlecode}
                codeBlock
              />
              </Paper>
            : null
        }
        </div>
        </Fade>
        </div>

        <div hidden={this.state.currentTab!==1}>
        <Fade in={this.state.currentTab===1}>
        <div>
          <Typography>
          Capabilities is under construction...
          </Typography>
        </div>
        </Fade>
        </div>

        <div hidden={this.state.currentTab!==2}>
        <Fade in={this.state.currentTab===2}>
        <div>
          <Typography>
          Capacities is under construction...
          </Typography>
        </div>
        </Fade>
        </div>

        <div hidden={this.state.currentTab!==3}>
        <Fade in={this.state.currentTab===3}>
        <div>
          <Typography>
          Tasks is under construction...
          </Typography>
        </div>
        </Fade>
        </div>

        <div hidden={this.state.currentTab!==4}>
        <Fade in={this.state.currentTab===4}>
        <div>
          <Typography>
          Pods is under construction...
          </Typography>
        </div>
        </Fade>
        </div>

        <div hidden={this.state.currentTab!==5}>
        <Fade in={this.state.currentTab===5}>
        <div>
          <Typography>
          Stat is under construction...
          </Typography>
        </div>
        </Fade>
        </div>


        <ModalStatus
          open={(this.props.config && this.props.config.isFetching)||false}
          progressIcon={<ProgressIcon isRunning/>}
          message={'fetching configurations...'}
        />
      </div>
    );
  }
}

export default connect(
  (state: any)=>state.app.content.editor||{},
  {
    fetchNodeConfig,
  },
)(NodeEditor);