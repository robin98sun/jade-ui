import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'

import {
  Grid,
  Fade,
  Button,
} from '@material-ui/core'
import PageviewOutlinedIcon from '@material-ui/icons/PageviewOutlined';

import ModalStatus from '../../gears/modal-status'
import ProgressIcon from '../../gears/progress-icon'
import TreeView, {TreeNode} from '../../gears/tree-view'
import DialogForm from '../../gears/dialog-form'
import NodeEditor from '../node-editor'
import ObjectEditor from '../../gears/object-editor'

import { 
  hasShownErrorOfSearchFanout, 
  showNodeEditor,
  closeNodeEditor,
  searchFanout,
} from './actions'
import { Message } from './reducer'

interface Props {
  style?: any
  node?: TreeNode
  isShowingNodeEditor?:boolean
  isShowingSearchResult?: boolean
  searchResult?: Message
  editingNode?: TreeNode
  hasShownErrorOfSearchFanout?(errTime: number): any
  showNodeEditor?(node: TreeNode): any
  closeNodeEditor?(): any
  searchFanout?(node: TreeNode|undefined, collectiveCriteria: any, exclusiveCriteria: any):any
}

interface State {
  collectiveCriteria: any
  exclusiveCriteria: any
}
class ContentTopo extends Component<Props>{

  private collectiveCriteria: any
  private exclusiveCriteria: any
  componentDidMount() {
  }

  dismissErrorMsg() {
    if (this.props.hasShownErrorOfSearchFanout && this.props.searchResult && this.props.searchResult.errTime) {
      this.props.hasShownErrorOfSearchFanout(this.props.searchResult.errTime)
    }
  }

  onClickNode(node: TreeNode) {
    if (this.props.showNodeEditor) {
      this.props.showNodeEditor(node)
    }
  }

  onCloseEditor() {
    if (this.props.closeNodeEditor) {
      this.props.closeNodeEditor()
    }
  }

  onCriteriaChange(type: string, criteria: any) {
    if (type === 'collective') {
      this.collectiveCriteria = criteria
    } else if (type === 'exclusive') {
      this.exclusiveCriteria = criteria
    }
  }

  onSearch() {
    console.log('search: collective:', this.collectiveCriteria, 'exclusive:', this.exclusiveCriteria)
    if (this.props.searchFanout) {
      this.props.searchFanout(this.props.node, this.collectiveCriteria, this.exclusiveCriteria)
    }
  }

  render() {
    const introStyle = Object.assign({}, {}, this.props.style)

    const requirementTypes = ['collective', 'exclusive']
    return (
      <div className="content-search" style={introStyle}>
        <ModalStatus 
          open={(this.props.searchResult && this.props.searchResult.isFetching) ||false}
          message={this.props.searchResult && this.props.searchResult.isFetching ? "searching...": "loading..."}
          progressIcon={<ProgressIcon isRunning />}
        />

        <ModalStatus 
          open={(this.props.searchResult && this.props.searchResult.errTime && this.props.searchResult.errTime !== this.props.searchResult.hasShownErrTime)||false}
          title="ERROR"
          message={this.props.searchResult ? this.props.searchResult.error:''}
          onClose={this.dismissErrorMsg.bind(this)}
        />

        <Grid container spacing={2}>
        {
          !this.props.isShowingNodeEditor && !this.props.isShowingSearchResult 
          ? <Grid item xs={12} >
              <Button
                fullWidth
                variant="contained"
                onClick={this.onSearch.bind(this)}
              >
                <PageviewOutlinedIcon />
              </Button>
            </Grid> 
          : null
        }

        {
          !this.props.isShowingNodeEditor && !this.props.isShowingSearchResult
          ? requirementTypes.map((reqType, i)=>{
              return (
                <Grid item sm={6} xs={12} key={reqType+'-'+i}>
                  <ObjectEditor 
                    subtitle={reqType.toUpperCase()}
                    inputMode
                    canAppendProperties
                    editablePropName
                    arrayOfkeyValuePairs
                    appendPropButtonText="Add Criteria"
                    // keyValuePairs={[]}
                    onChange={(newData: {key: string, value: any}[], propName: string, value: any) => {
                      this.onCriteriaChange.call(this, reqType, newData.map(item=>({
                        name: item.key,
                        value: item.value,
                      })))
                    }}
                  />
                </Grid>
              )
            })
            
          : null
        }
        {
          this.props.isShowingSearchResult
          ? <TreeView
              root={this.props.searchResult?this.props.searchResult.data:null}
              onClick={this.onClickNode.bind(this)}
            />
          : null
        }
        </Grid>
        {
          this.props.isShowingNodeEditor
          ? <Fade in={this.props.isShowingNodeEditor} timeout={1500}>
            <DialogForm
              open={this.props.isShowingNodeEditor||false}
              title={this.props.editingNode ? this.props.editingNode.name:''}
              contentView={<NodeEditor node={this.props.editingNode} forceRefreshWhenSwitching />}
              onClose={this.onCloseEditor.bind(this)}
            />
            </Fade>
          : null
        }
        
      </div>
    );
  }
}

export default connect(
  (state: any)=>state.app.content.search||{},
  { 
    hasShownErrorOfSearchFanout, 
    showNodeEditor, closeNodeEditor,
    searchFanout,
  },
)(ContentTopo);