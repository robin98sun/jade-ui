import React from 'react';
import { Component } from 'react'

import {
  Dialog,
  DialogProps,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Backdrop,
  Fade,
  Grid,
  Typography,
  IconButton,
  PaperProps,
} from '@material-ui/core'
import CancelPresentationOutlinedIcon from '@material-ui/icons/CancelPresentationOutlined';

import {
  grey,
} from '@material-ui/core/colors'

interface Props {
  // contentName?: string
  style?: any
  open:boolean
  onClose?():any
  message?:string
  title?:string
  contentView?: any
}

interface State {
  windowWidth: number
  windowHeight: number
}

class DialogForm extends Component<Props, State>{
  constructor(props: Props) {
    super(props)
    this.state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    }
  }
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  updateWindowDimensions() {
    this.setState({ windowWidth: window.innerWidth, windowHeight: window.innerHeight });
  }

  render() {
    return (

      <Dialog
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 60,
          marginBottom: 20,
          marginLeft:20,
          marginRight: 20,
        }}
        open={this.props.open}
        onClose={this.props.onClose?this.props.onClose:()=>{}}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        fullScreen
        maxWidth={"sm"}
        PaperProps={{
          style: {
            width: this.state.windowWidth-40,
          }
        }}
      >
        <DialogTitle id="scroll-dialog-title">
        <Grid container>
          <Grid item xs={11}>
          {this.props.title?this.props.title:''}
          </Grid>
          <Grid item xs={1} 
            style={{
              textAlign:'right',
              marginTop: -9,
            }}
          >
          {
            this.props.onClose
            ? <IconButton
                style={{
                  alignSelf: 'right',
                }}
                onClick={this.props.onClose?this.props.onClose:()=>{}}
              >
                <CancelPresentationOutlinedIcon />
              </IconButton>
            : null
          }
          </Grid>
        </Grid>
        </DialogTitle>

        <DialogContent>
        {  
          this.props.contentView
          ? this.props.contentView
          : this.props.message
          ? <DialogContentText>
            {this.props.message}
            </DialogContentText>
          : null
        }
          </DialogContent>
      </Dialog>
    )
  }
}

export default DialogForm
