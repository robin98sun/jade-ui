import React from 'react';
import { Component } from 'react'
import { withTheme, WithStyles, createStyles, withStyles } from '@material-ui/core/styles'

import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  TextField,
  Button,
  IconButton,
  Theme,
  Fade,
} from '@material-ui/core'

import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import BackupOutlinedIcon from '@material-ui/icons/BackupOutlined';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';

export const styles = ({palette, spacing}: Theme) => createStyles({
  inputLabelEditing: {
    color: palette.info.main,
  },
  inputLabelNotEditing: {
    color: palette.text.primary,
  },
  input: {
    color: palette.info.main,
  },
  notchedOutline: {
    borderWidth: 1,
    borderColor: palette.text.disabled,
  },
  notchedOutlineEditing: {
    borderWidth: 2,
    borderColor: palette.info.main,
  },
  content: {
    backgroundColor: 'white',
  },
  contentEditing: {
    backgroundColor: palette.grey[50],
  },
  item: {
    color: palette.text.primary,
  },
  itemEmpty: {
    color: palette.text.disabled,
  }
})


interface EditableObject {
  [key:string]:any
}

interface Props extends WithStyles<typeof styles>{
  style?: any
  name?: string
  object?: EditableObject
  editable?: boolean
  deletable?: boolean
  canAppendProperties?: boolean
  title?: string
  subtitle?: string
  spacing?: number
  onUpdate?(object: EditableObject):any
  onDelete?():any
  onChange?(object: EditableObject):any
  onCancel?():any
  theme?: any
  isEditing?: boolean
}

interface State {
  isEditing: boolean
  edition: number
  isAddingProperty: boolean
}

class ObjectEditor extends Component<Props, State> {

  private editingObject: EditableObject|null
  constructor(props: Props) {
    super(props)
    this.state={
      isEditing: false,
      edition: Date.now(),
      isAddingProperty: false,
    }
    this.editingObject = null
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (state.isEditing) {
      return state
    }
    return Object.assign({}, state, {
      isEditing: false,
      edition: Date.now(),
      isAddingProperty: false,
    })
  }

  componentDidMount() {
    if (this.props.isEditing) {
      this.setState({
        isEditing: true,
        isAddingProperty: false,
      })
    }
  }

  componentDidUpdate() {
    
  }

  onPropValueChange(e: any, name:string, value:any) {
    if (this.state.isEditing) {
      if (this.props.onChange && this.editingObject) {
        this.props.onChange(this.editingObject)
      }
    }
  }

  onStartEditing() {
    this.editingObject = {}
    this.setState({
      isEditing: true,
      isAddingProperty: false,
    })
  }

  onCancelEditing() {
    this.editingObject = null
    this.setState({
      isEditing: false,
      isAddingProperty: false
    })
    if (this.props.onCancel) {
      this.props.onCancel()
    }
  }

  onSubmit() {
    if (this.editingObject && Object.keys(this.editingObject).length > 0) {
      const newObj = Object.assign({}, this.props.object, this.editingObject)
      if (this.props.onUpdate) {
        this.props.onUpdate(newObj)
      }
    }

    this.editingObject = null
    this.setState({
      isEditing: false,
      isAddingProperty: false,
    })
  }

  onDelete() {
    if (this.props.onDelete) {
      this.props.onDelete()
    }
    this.setState({
      isEditing: false,
      isAddingProperty: false,
    })
    this.editingObject = null
  }

  onAddProperty() {
    this.setState({
      isAddingProperty: true,
    })
  }

  render() {
    const thisStyle = Object.assign({}, {

    }, this.props.style)
    const spaceUnit = 5
    return (
      <div style={thisStyle}>
        <Card>
          {
            <CardHeader
              titleTypographyProps={{
                variant:'h6', 
              }}
              style={{
                backgroundColor: this.state.isEditing 
                    ? this.props.theme.palette.info.main
                    : this.props.theme.palette.grey[200],
                color: this.state.isEditing
                    ? this.props.theme.palette.grey[50]
                    : this.props.theme.palette.text.primary,
              }}
              title={this.props.title||''}
              subheader={this.props.subtitle}
              action={
                this.state.isEditing
                ? <div>
                    {
                      this.props.deletable
                      ? <IconButton
                          onClick={this.onDelete.bind(this)}
                        >
                          <DeleteForeverOutlinedIcon color="error" />
                        </IconButton>
                      : null
                    }
                    <IconButton
                      onClick={this.onSubmit.bind(this)}
                    >
                      <BackupOutlinedIcon color="error"/>
                    </IconButton>

                    <IconButton
                      onClick={this.onCancelEditing.bind(this)}
                    >
                      <ClearOutlinedIcon color="inherit"/>
                    </IconButton>
                  </div> 
                : this.props.editable
                ? <div>
                    <IconButton
                      onClick={this.onStartEditing.bind(this)}
                    >
                      <EditOutlinedIcon />
                    </IconButton>
                  </div>
                : null
              }
            />
          }
          
          <Divider />
          <CardContent className={
            this.state.isEditing
            ? this.props.classes.contentEditing
            : this.props.classes.content
          }>
          {
            Object.keys(this.props.object||{}).map((propName,i) => {

              const key = this.props.name+'-prop-'+i+"-"+propName+Date.now()
              let rawValue = (this.props.object||{})![propName]
              const value = typeof rawValue === 'string'
                    ? rawValue
                    : typeof rawValue === 'number'
                    ? rawValue
                    : (rawValue)
                    ? JSON.stringify(rawValue)
                    : this.state.isEditing
                    ? undefined
                    : 'null'

              const AlwaysFocusDuringInput = (props: any) => {
                const [inputValue, setInputValue] = React.useState(value)
                // setInputValue(value)
                const onChange = (e:any) => {
                  if (!this.state.isEditing) {
                    return
                  }
                  const tempObj:EditableObject = {}
                  tempObj[e.target.name] = e.target.value === '' ? null : e.target.value
                  if (e.target.value) {
                    try {
                      let n = Number(tempObj[e.target.name])
                      if (!Number.isNaN(n)) {
                        tempObj[e.target.name] = n
                      }
                    } catch (e) {

                    }
                  }
                  const newObj = Object.assign({},this.editingObject, tempObj)
                  this.editingObject = newObj
                  this.onPropValueChange.call(this, e, e.target.name, e.target.value)
                  setInputValue(newObj[e.target.name]===null?undefined:newObj[e.target.name])
                }
                return (
                  <TextField
                    id={"outlined-textarea"+this.props.name+'-prop-'+i+"-"+propName}
                    label={propName}
                    placeholder={'null'}
                    multiline
                    variant="outlined"
                    fullWidth
                    name={propName}
                    value={inputValue}
                    style={{
                      marginTop: (i===0?spaceUnit:2*spaceUnit)*(this.props.spacing||1),
                    }}
                    InputLabelProps={{
                      shrink: true,
                      className: (this.state.isEditing)
                            ? this.props.classes.inputLabelEditing
                            : this.props.classes.inputLabelNotEditing
                    }}
                    InputProps={{
                      classes: {
                        notchedOutline: this.state.isEditing
                          ? this.props.classes.notchedOutlineEditing
                          : this.props.classes.notchedOutline
                      },
                      className: value === 'null' ? this.props.classes.itemEmpty : this.props.classes.item,
                    }}
                    onChange={onChange}
                  />
                )
              }
              return (
                <AlwaysFocusDuringInput key={key}/>
              )
            })
          }
          {
            false && this.props.editable && this.props.canAppendProperties && this.state.isEditing 
            ? <Button
                fullWidth
                variant='contained'
                style={{
                  marginTop: (Object.keys(this.props.object||{}).length ? spaceUnit*2:spaceUnit)*(this.props.spacing||1)
                }}
              >
                <PlaylistAddIcon style={{marginRight: 20}}/> Add Property
              </Button>
            : null
          }

          {
            this.state.isAddingProperty
            ? null
            : null
          }
          </CardContent>
        </Card>
      </div>
    )
  }
}

export default withTheme(withStyles(styles)(ObjectEditor))
