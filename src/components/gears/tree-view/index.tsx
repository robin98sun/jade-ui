import React from 'react';
import { Component } from 'react'
import { 
  // AppBar,
  // Toolbar,
  // IconButton,
  Typography,
  Grid,
  IconButton,
  Link,
  // Button,
} from '@material-ui/core'

import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@material-ui/icons/IndeterminateCheckBoxOutlined';
import AdjustOutlinedIcon from '@material-ui/icons/AdjustOutlined';

export interface TreeNode {
  unfolded?: boolean
  icon?: Component
  name?: string
  subnodes?: {
    [subNode: string]: TreeNode
  }
  attributes?: {
    [attr: string]: any
  }
}


interface TreeNodeItemProps {
  node: TreeNode
  level: number
  id: number
  spacing?: number
  onClick?(node: TreeNode):any
}

interface TreeNodeItemState {
  unfolded: boolean
  hasLocalSettings: boolean
}
class TreeViewItem extends Component<TreeNodeItemProps, TreeNodeItemState> {

  constructor(props: TreeNodeItemProps) {
    super(props)
    this.state = {
      unfolded: false,
      hasLocalSettings: false
    }
  }

  static getDerivedStateFromProps(props: TreeNodeItemProps, state: TreeNodeItemState) {
    if (state.hasLocalSettings) {
      return state
    }
    return Object.assign({}, state, {
      unfolded: props.node.unfolded || false,
    })
  }

  onClickNode(node: TreeNode) {
    if (this.props.onClick) {
      this.props.onClick(node)
    } 
  }

  onToggleFold(e: any) {
    this.setState({
      unfolded: !this.state.unfolded,
      hasLocalSettings: true,
    })
  }

  render(){
    if (!this.props.node) {
      return null
    }
    const indentSpacing = 40
    return (
      <div 
        style={{
          marginLeft: this.props.level*indentSpacing,
          marginTop: (this.props.spacing||0),
        }}
        key={`tree-node-[${this.props.level}][${this.props.id}]`}
      >
        <Grid container alignItems="center">
          <Grid item sm={2} md={1} lg={1} style={{textAlign: "center", marginTop: 0}}>
          <IconButton 
            onClick={this.onToggleFold.bind(this)} 
            disabled={!this.props.node.subnodes || Object.keys(this.props.node.subnodes).length===0}
          >
          {
            this.props.node.subnodes && Object.keys(this.props.node.subnodes) && this.state.unfolded
            ? <IndeterminateCheckBoxOutlinedIcon color="primary"/>
            : this.props.node.subnodes && Object.keys(this.props.node.subnodes)
            ? <AddBoxOutlinedIcon color="primary" />
            : <AdjustOutlinedIcon color="secondary"/>
          }
          </IconButton>
          </Grid>
          <Grid item sm md lg style={{textAlign: "left"}}>
            <Typography variant="body1">
              <Link component="button" variant="body1" onClick={this.onClickNode.bind(this, this.props.node)}>
              {this.props.node.name}
              </Link>
            </Typography>
          </Grid>
        </Grid>
        {
          this.state.unfolded && this.props.node.subnodes && Object.keys(this.props.node.subnodes)
          ? Object.keys(this.props.node.subnodes!).map((nodeKey, i) => {
              const node = this.props.node.subnodes![nodeKey]
              return (
                <TreeViewItem 
                  node={node} 
                  level={this.props.level+1} id={i} 
                  key={`tree-node-item-${this.props.level+1}+${i}`}
                  spacing={this.props.spacing||0}
                  onClick={this.onClickNode.bind(this)}
                />
              )
            })
          : null
        }
      </div>
    )
  }
}


interface Props {
  // contentName?: string
  style?: any
  root?: TreeNode
  spacing?:number
  onClick?(node: TreeNode):any
}

class TreeView extends Component<Props>{

  componentDidMount() {
  }

  render() {
    const treeStyle = Object.assign({}, {}, this.props.style)
    return (
      <div className="tree-view" style={treeStyle}>
      {
        this.props.root 
        ? <TreeViewItem 
            node={this.props.root} 
            level={0} 
            id={0} 
            spacing={this.props.spacing||0}
            onClick={this.props.onClick?this.props.onClick:()=>{}}
          />
        : null
      }
      </div>
    );
  }
}

export default TreeView