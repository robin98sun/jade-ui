import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'

import ModalStatus from '../../../gears/modal-status'
import ProgressIcon from '../../../gears/progress-icon'
import { TreeNode } from '../../../gears/tree-view'
import { Message } from '../reducer'
import { fetchNodeConfig } from './actions'

import {
  Paper,
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
    console.log('config page mounted')
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
    return (
      <div>
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
  (state: any)=>state.app.content.editor.tasks||{},
  {
    fetchNodeConfig,
  },
)(NodeEditor);