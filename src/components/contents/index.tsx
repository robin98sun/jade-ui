
import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'

import ContentIntro from './intro'
import ContentConn from './conn'
import ContentConf from './conf'
import ContentTopo from './topo'
import ContentDispatcher from './dispatcher'

interface Props {
  contentName?: string
  style?: any
}


class Contents extends Component<Props>{
  componentDidMount() {

  }

  getContent() {
    switch(this.props.contentName) {
    case 'intro' :
      return <ContentIntro />
    case 'conn' :
      return <ContentConn />
    case 'conf' :
      return <ContentConf />
    case 'topo' :
      return <ContentTopo />
    case 'dispatcher' :
      return <ContentDispatcher />
    default:
      return null
    }
  }

  render() {
    const contentStyle = Object.assign({}, {
      margin:'auto', 
      flex: 1, 
      justifyContent: 'center',
      padding: 10,
    }, this.props.style)

    return (
      <div className="content_intro" style={contentStyle}>
      {
        this.getContent()
      }
      </div>
    );
  }
}

export default connect(
  (state: any)=>state.app.content||{},
  null,
)(Contents);