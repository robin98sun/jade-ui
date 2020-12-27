import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'

import {
  Grid,
  Button,
} from '@material-ui/core'
import PageviewOutlinedIcon from '@material-ui/icons/PageviewOutlined';

import ModalStatus from '../../gears/modal-status'
import ProgressIcon from '../../gears/progress-icon'
import {TreeNode} from '../../gears/tree-view'
import DialogForm from '../../gears/dialog-form'
import ObjectEditor from '../../gears/object-editor'

import TopoPage from '../topo'


import { 
  hasShownErrorOfSearchFanout, 
  closeSearchResult,
  searchFanout,
} from './actions'
import { Message } from './reducer'

interface Props {
  style?: any
  node?: TreeNode
  isShowingSearchResult?: boolean
  searchResult?: Message
  hasShownErrorOfSearchFanout?(errTime: number): any
  closeSearchResult?(): any
  searchFanout?(node: TreeNode|undefined, collectiveCriteria: any, exclusiveCriteria: any):any
  onCriteriaChange?(collective:{name: string, value: any}[], exclusive:{name: string, value: any}[]): any
  collectiveCriteria?: {name: string, value: any}[]
  exclusiveCriteria?: {name: string, value: any}[]
}

interface State {
  collectiveCriteria: {name: string, value: any}[]
  exclusiveCriteria: {name: string, value: any}[]
  modified: boolean
}
class ContentTopo extends Component<Props, State>{

  private collectiveCriteria: {name: string, value: any}[]
  private exclusiveCriteria: {name: string, value: any}[]

  constructor(props: Props) {
    super(props)
    this.collectiveCriteria=[]
    this.exclusiveCriteria=[]
    this.state={
      collectiveCriteria: [],
      exclusiveCriteria: [],
      modified: false
    }
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (state.modified) return state

    return Object.assign({},state,{
      collectiveCriteria: props.collectiveCriteria,
      exclusiveCriteria: props.exclusiveCriteria,
    })
  }

  componentDidMount() {
    if (this.collectiveCriteria.length || this.exclusiveCriteria.length) {
      this.collectiveCriteria = []
      this.exclusiveCriteria = []
      this.setState({
        collectiveCriteria: [],
        exclusiveCriteria: [],
      })
    }
  }

  componentDidUpdate() {
  }


  dismissErrorMsg() {
    if (this.props.hasShownErrorOfSearchFanout && this.props.searchResult && this.props.searchResult.errTime) {
      this.props.hasShownErrorOfSearchFanout(this.props.searchResult.errTime)
    }
  }

  onCloseSearchResult() {
    if (this.props.closeSearchResult) {
      this.props.closeSearchResult()
    }
  }

  onCriteriaChange(type: string, criteria: any) {
    if (type === 'collective') {
      this.collectiveCriteria = criteria
    } else if (type === 'exclusive') {
      this.exclusiveCriteria = criteria
    }
    if (this.props.onCriteriaChange) {
      this.props.onCriteriaChange(this.collectiveCriteria, this.exclusiveCriteria)
    }
  }

  onSearch() {
    if (this.props.searchFanout) {
      this.setState({
        collectiveCriteria: this.collectiveCriteria,
        exclusiveCriteria: this.exclusiveCriteria,
        modified: true,
      })
      this.props.searchFanout(this.props.node, this.collectiveCriteria, this.exclusiveCriteria)
    }
  }

  render() {
    const introStyle = Object.assign({}, {}, this.props.style)

    const requirementTypes = ['collective', 'exclusive']
    return (
      <div className="content-search" style={introStyle}>
      {
        this.props.node && this.props.node.name
        ? <div>
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
              !this.props.isShowingSearchResult 
              ? <Grid item xs={12} >
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={this.onSearch.bind(this)}
                  >
                    <PageviewOutlinedIcon style={{marginRight:20}}/> Fanout
                  </Button>
                </Grid> 
              : null
            }

            {
              !this.props.isShowingSearchResult
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
                        keyValuePairs={
                          ((reqType === 'collective'?this.state.collectiveCriteria: this.state.exclusiveCriteria)||[]).map(item=>({
                            key: item.name,
                            value: item.value,
                          }))
                        }
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
              this.props.isShowingSearchResult && this.props.searchResult && this.props.searchResult.data
              ? <DialogForm
                  open={this.props.isShowingSearchResult||false}
                  title="Fanout subnodes"
                  contentView={
                    <TopoPage disableAutoRefresh />
                  }
                  onClose={this.onCloseSearchResult.bind(this)}
                />
              : null
            }
            </Grid>
          </div>
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
    searchFanout, closeSearchResult,
  },
)(ContentTopo);