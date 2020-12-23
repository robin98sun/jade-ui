import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'

import NodeEditor from '../node-editor'



interface Props {
  currentNode?: object
  style?: any
  drawMenuOpen?:boolean
}


class ContentConf extends Component<Props>{

  render() {
    const confStyle = Object.assign({}, {
      marginRight: this.props.drawMenuOpen ? 230:-5,
      transition: 'marginRight 0.4s',
      transitionTimingFunction: 'ease-in-out',
    }, this.props.style)
    return (
      <div className="content-conf" style={confStyle}>
      {
        this.props.currentNode
        ? <NodeEditor 
            node={this.props.currentNode}
            style={{
              marginTop: 10,
            }}
          />
        : null
      }
      </div>
    )
  }
}

export default connect(
  (state: any)=>state.app.content.conf||{},
  null,
)(ContentConf);