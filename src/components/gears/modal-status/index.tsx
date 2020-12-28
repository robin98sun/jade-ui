import React from 'react';
import { Component } from 'react'

import {
  Modal,
  Backdrop,
  Fade,
  Grid,
  Typography,
  Button,
} from '@material-ui/core'

import {
  grey,
} from '@material-ui/core/colors'

interface Props {
  // contentName?: string
  style?: any
  open:boolean
  onClose?():any
  title?:string
  message?:string
  progressIcon?:any
  onConfirm?():any
  confirmIcon?:any
  cancelIcon?:any
}

class ModalStatus extends Component<Props>{

    render() {
        return (

            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              open={this.props.open}
              onClose={this.props.onClose?this.props.onClose:()=>{}}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={this.props.open}>
                <div style={{
                  backgroundColor: grey[100],
                  border: '1px light #000',
                  borderRadius: 5,
                  boxShadow: 'inherit',
                  padding: this.props.title ? '10px 40px 20px' : '10px 40px 10px',
                }}>
                  {
                    this.props.title && this.props.progressIcon
                    ? <Grid container alignItems="center" style={{marginTop: 20}}>
                        <Grid item xs={7} style={{textAlign: "left"}}>
                          <Typography variant="body2" noWrap display="inline" style={{marginRight: 10}}>
                            {
                              this.props.title
                              ? this.props.title
                              : null
                            }
                          </Typography>
                        </Grid>
                        <Grid item xs style={{textAlign: "right"}}>
                        {
                          this.props.progressIcon
                          ? this.props.progressIcon
                          : null
                        }
                        </Grid>
                      </Grid>
                    : this.props.title
                    ? <h2 id="transition-modal-title">
                        {this.props.title}
                      </h2>
                    : this.props.progressIcon 
                    ? <Grid container alignItems="center" style={{marginTop: 20, marginBottom: 10}}> 
                        <Grid item xs style={{textAlign: "center"}}>
                        {
                          this.props.progressIcon
                          ? this.props.progressIcon
                          : null
                        }
                        </Grid>
                      </Grid>
                    : null
                  }
                  {  
                    this.props.message
                    ? <p id="transition-modal-description">{this.props.message}</p>
                    : null
                  }
                  {
                    (this.props.onConfirm)
                    &&((this.props.onClose))
                    ?  <Grid container alignItems="center" style={{marginTop: 20}}>
                        <Grid item 
                          xs={
                            (this.props.onClose)
                            ? 5
                            : 12
                          } 
                          style={{textAlign: "left"}}
                        >
                          <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={()=>{
                              if (this.props.onConfirm) {
                                this.props.onConfirm()
                              }
                            }}
                          >
                          {
                            this.props.confirmIcon
                            ? this.props.confirmIcon
                            : null
                          }
                          OK
                          </Button>
                        </Grid>

                        {
                          (this.props.onConfirm)
                          &&(this.props.onClose)
                          ? <Grid item xs={2}>
                            </Grid>
                          : null
                        }

                        <Grid item 
                          xs={
                            (this.props.onConfirm)
                            ? 5
                            : 12
                          } 
                          style={{textAlign: "right"}}
                        >
                          <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            onClick={()=>{
                              if (this.props.onClose) {
                                this.props.onClose()
                              }
                            }}
                          >
                          {
                            this.props.cancelIcon
                            ? this.props.cancelIcon
                            : null
                          }
                          Cancel
                          </Button>
                        </Grid>
                      </Grid>
                    :null
                  }
                </div>
              </Fade>
            </Modal>
        )
    }
}

export default ModalStatus
