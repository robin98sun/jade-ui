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
  Grid,
  Fade,
} from '@material-ui/core'

import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import BackupOutlinedIcon from '@material-ui/icons/BackupOutlined';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import RemoveCircleOutlineOutlinedIcon from '@material-ui/icons/RemoveCircleOutlineOutlined';

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
  inputMode?: boolean
  editable?: boolean
  deletable?: boolean
  canAppendProperties?: boolean
  appendPropButtonText?: string
  title?: string
  subtitle?: string
  spacing?: number
  onUpdate?(object: EditableObject|null|undefined):any
  onDelete?():any
  onChange?(object: EditableObject|null|undefined, propName: string, value: any):any
  onCancel?():any
  theme?: any
  isEditing?: boolean
  editablePropName?:boolean
}

interface State {
  isEditing: boolean
  edition: number
  isAddingProperty: boolean
  object: EditableObject
  modified: boolean
}

class ObjectEditor extends Component<Props, State> {

  private editingObject: EditableObject|null
  private keyMap: EditableObject|null
  constructor(props: Props) {
    super(props)
    this.state={
      isEditing: props.inputMode || false,
      edition: Date.now(),
      isAddingProperty: false,
      object: props.object||{},
      modified: false,
    }
    this.editingObject = null
    this.keyMap = null
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (state.isEditing || props.inputMode) {
      return state
    }
    return Object.assign({}, state, {
      isEditing: false,
      edition: Date.now(),
      isAddingProperty: false,
      object: props.object,
      modified: false,
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

  assembleObject() {
    if (this.editingObject) {
      let newObj: EditableObject = Object.assign({}, this.state.object, this.editingObject)
      if (this.keyMap) {
        for (let key of Object.keys(this.keyMap)) {
          const newKey = this.keyMap[key]
          newObj[newKey] = newObj[key]
          delete newObj[key]
        }
      }
      return newObj
    }
    return null
  }

  onPropValueChange(isKeyChanged: boolean, newObj: any, propName:string, value:any) {
    if (this.state.isEditing||this.props.inputMode) {
      if (this.props.onChange) {
        this.props.onChange(this.assembleObject(), propName, value)
      }
    }
  }

  onStartEditing() {
    this.editingObject = {}
    this.keyMap = {}
    this.setState({
      isEditing: true,
      isAddingProperty: false,
      object: this.props.object||{},
      modified: false,
    })
  }

  onCancelEditing() {
    this.editingObject = null
    this.keyMap = null
    this.setState({
      isEditing: false,
      isAddingProperty: false,
      object: this.props.object||{},
      modified: false,
    })
    if (this.props.onCancel) {
      this.props.onCancel()
    }
  }

  onSubmit() {
    const newObj = this.assembleObject()
    if ((this.editingObject && Object.keys(this.editingObject).length > 0)
      ||(this.keyMap && Object.keys(this.keyMap).length > 0)
      || this.state.modified
      ) {
      if (this.props.onUpdate) {
        this.props.onUpdate(newObj)
      }
    }

    this.editingObject = null
    this.keyMap = null
    this.setState({
      isEditing: false,
      isAddingProperty: false,
      object: newObj||{},
      modified: false,
    })
  }

  onDelete() {
    if (this.props.onDelete) {
      this.props.onDelete()
    }
    this.setState({
      isEditing: false,
      isAddingProperty: false,
      object: {},
      modified: false,
    })
    this.editingObject = null
    this.keyMap = null
  }

  onAddProperty() {
    let newObj: EditableObject = this.assembleObject()||{}
    let newProp = 'prop'
    if (newObj[newProp]!==undefined) {
      for(let i=1;true;i++) {
        newProp = 'prop'+i
        if (newObj[newProp]===undefined) {
          break
        }
      }
    }
    newObj[newProp]=null
    this.editingObject={}
    this.keyMap={}
    this.setState({
      object: newObj,
      modified: true,
    })
    if (this.props.onChange) {
      this.props.onChange(newObj, newProp, undefined)
    }
  }

  onRemoveProperty(propName: string) {
    let removedKey = propName
    if (this.keyMap && this.keyMap[propName]) {
      removedKey = this.keyMap[propName]
    }
    let newObj: EditableObject|null = this.assembleObject()
    if (newObj && newObj[removedKey]!==undefined) {
      delete newObj[removedKey]
    }
    this.editingObject={}
    this.keyMap={}
    this.setState({
      object: newObj||{},
      modified: true,
    })
    if (this.props.onChange) {
      this.props.onChange(newObj, propName, undefined)
    }
  }

  render() {
    const thisStyle = Object.assign({}, {

    }, this.props.style)
    const spaceUnit = 5
    const AlwaysFocusDuringInput = (props: {
                                              i: number, 
                                              propName: string,
                                              label: string,
                                              value: any,
                                              onChange:any,
                                              useKeyMap?: boolean,
                                            }) => {
      const [inputValue, setInputValue] = React.useState(props.value)
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
        const sourceObj: any = props.useKeyMap ? this.keyMap : this.editingObject
        const newObj = Object.assign({},sourceObj, tempObj)
        props.useKeyMap ? this.keyMap = newObj : this.editingObject = newObj
        props.onChange.call(this, newObj, e.target.name, e.target.value)
        setInputValue(newObj[e.target.name]===null?undefined:newObj[e.target.name])
      }
      return (
        <TextField
          id={"outlined-textarea"+this.props.name+'-prop-'+props.i+"-"+props.propName}
          label={props.label}
          placeholder={'null'}
          multiline
          variant="outlined"
          fullWidth
          name={props.propName}
          value={inputValue}
          style={{
            marginTop: (props.i===0?spaceUnit:2*spaceUnit)*(this.props.spacing||1),
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
            className: inputValue === 'null' ? this.props.classes.itemEmpty : this.props.classes.item,
          }}
          onChange={onChange}
        />
      )
    }
    return (
      <div style={thisStyle}>
        <Card>
          {
            <CardHeader
              titleTypographyProps={{
                variant:'h6', 
              }}
              style={{
                backgroundColor: this.state.isEditing && !this.props.inputMode
                    ? this.props.theme.palette.info.main
                    : this.props.theme.palette.grey[200],
                color: this.state.isEditing && !this.props.inputMode
                    ? this.props.theme.palette.grey[50]
                    : this.props.theme.palette.text.primary,
              }}
              title={this.props.title||''}
              subheader={this.props.subtitle}
              action={
                this.state.isEditing && !this.props.inputMode
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
                : this.props.editable && !this.props.inputMode
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
            Object.keys(this.state.object||{}).map((propName,i) => {
              const key = this.props.name+'-prop-'+i+"-"+propName+Date.now()
              let rawValue = (this.state.object)[propName]
              const value = typeof rawValue === 'string'
                    ? rawValue
                    : typeof rawValue === 'number'
                    ? rawValue
                    : (rawValue)
                    ? JSON.stringify(rawValue)
                    : this.state.isEditing
                    ? undefined
                    : 'null'
              if (this.props.editablePropName) {

                return (
                  <Grid container spacing={1} key={key} alignItems="center">
                    <Grid item sm={this.props.inputMode || this.state.isEditing?4:5} xs={5}>
                      <AlwaysFocusDuringInput 
                      i={i} 
                      useKeyMap
                      propName={propName}
                      label='key'
                      value={propName}
                      onChange={(newObj: any, p: string, v: any)=> {
                          this.onPropValueChange.call(this, true, newObj, propName, v)
                      }}
                    />
                    </Grid>
                    <Grid item sm={7} xs={this.props.inputMode || this.state.isEditing?5:7}>
                      <AlwaysFocusDuringInput 
                        i={i} 
                        propName={propName} 
                        label='value'
                        value={value}
                        onChange={(newObj: any, p: string, v: any)=> {
                          this.onPropValueChange.call(this, false, newObj, propName, v)
                        }}
                      />
                    </Grid>
                    {
                      this.props.inputMode || this.state.isEditing
                      ? <Grid item sm={1} xs={2} style={{textAlign: "center"}}>
                          <IconButton 
                            style={{marginTop: 10}}
                            onClick={this.onRemoveProperty.bind(this, propName)}
                          >
                            <RemoveCircleOutlineOutlinedIcon color="error" />
                          </IconButton>
                        </Grid>
                      : null
                    }
                  </Grid>
                )
              } else {
                return (
                  <AlwaysFocusDuringInput 
                    key={key} 
                    i={i} 
                    propName={propName} 
                    label={propName}
                    value={value}
                    onChange={(newObj: any, p: string, v: any)=> {
                          this.onPropValueChange.call(this, false, newObj, propName, v)
                    }}
                  />
                )
              }
            })
          }
          {
            this.props.editablePropName
              && ((this.props.editable && this.props.canAppendProperties && this.state.isEditing) 
                || (this.props.inputMode && this.props.canAppendProperties))
            ? <Button
                fullWidth
                variant='contained'
                style={{
                  marginTop: (Object.keys(this.state.object||{}).length ? spaceUnit*2:spaceUnit)*(this.props.spacing||1)
                }}
                onClick={this.onAddProperty.bind(this)}
              >
                <PlaylistAddIcon style={{marginRight: 20}}/> {this.props.appendPropButtonText || "Add Property"}
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
