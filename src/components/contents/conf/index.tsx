import React from 'react';
import { Component } from 'react'
import { connect } from 'react-redux'
import { 
  Paper,
} from '@material-ui/core'
import { CopyBlock, googlecode } from "react-code-blocks"

interface Props {
  config?: object
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
        this.props.config
        ? <Paper>
          <CopyBlock
            text={JSON.stringify(this.props.config, null, 4)}
            language="json"
            showLineNumbers
            theme={googlecode}
            codeBlock
          />
          </Paper>
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