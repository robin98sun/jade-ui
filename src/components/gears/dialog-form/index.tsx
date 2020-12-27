import React from 'react';
import { Component } from 'react'

import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Backdrop,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core'
import CancelPresentationOutlinedIcon from '@material-ui/icons/CancelPresentationOutlined';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

interface Props {
  // contentName?: string
  style?: any
  open:boolean
  onClose?():any
  message?:string
  title?:string
  contentView?: any
  onSubmit?():any
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
          <Grid item 
            md={10} 
            sm={this.props.onSubmit?9:10} 
            xs={this.props.onSubmit?7:10}
          >
            <Typography
              variant="h6"
              noWrap
            >
            {this.props.title?this.props.title:''}
            </Typography>
          </Grid>
          <Grid item 
            md={2} 
            sm={this.props.onSubmit?3:2} 
            xs={this.props.onSubmit?5:2} 
            style={{
              textAlign:'right',
              marginTop: -10,
            }}
          >
          {
            this.props.onSubmit
            ? <IconButton
                style={{
                  alignSelf: 'right',
                }}
                onClick={this.props.onSubmit?this.props.onSubmit:()=>{}}
              >
                <CheckCircleOutlineIcon color="primary" />
              </IconButton>
            : null
          }
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
