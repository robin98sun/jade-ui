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
  Select,
  MenuItem,
} from '@material-ui/core'

import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import BackupOutlinedIcon from '@material-ui/icons/BackupOutlined';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import RemoveCircleOutlineOutlinedIcon from '@material-ui/icons/RemoveCircleOutlineOutlined';

export const styles = ({palette, spacing}: Theme) => createStyles({
  inputLabelEditing: {
    color: palette.primary.main,
  },
  inputLabelNotEditing: {
    color: palette.text.secondary,
  },
  input: {
    color: palette.primary.main,
  },
  notchedOutline: {
    borderWidth: 1,
    borderColor: palette.text.disabled,
  },
  notchedOutlineEditing: {
    borderWidth: 1,
    borderColor: palette.primary.main,
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
  schema?: EditableObject
  keyValuePairs?: {key: string, value: any}[]
  inputMode?: boolean
  editable?: boolean
  deletable?: boolean
  canAppendProperties?: boolean
  appendPropButtonText?: string
  title?: string
  subtitle?: string
  spacing?: number
  onUpdate?(object: EditableObject|{key: string, value: any}[]|null|undefined):any
  onDelete?():any
  onChange?(object: EditableObject|{key: string, value: any}[]|null|undefined, propName: string, value: any):any
  onCancel?():any
  theme?: any
  isEditing?: boolean
  editablePropName?:boolean
  arrayOfkeyValuePairs?:boolean
}

interface State {
  isEditing: boolean
  edition: number
  isAddingProperty: boolean
  object: EditableObject
  keyValuePairs: {key: string, value: any}[]
  modified: boolean
}

class ObjectEditor extends Component<Props, State> {

  private editingObject: EditableObject|null
  private keyMap: EditableObject|null
  private keyValuePairs: {key: string, value: any}[]|null
  constructor(props: Props) {
    super(props)
    this.state={
      isEditing: props.inputMode || false,
      edition: Date.now(),
      isAddingProperty: false,
      object: props.object||{},
      keyValuePairs: props.keyValuePairs||[],
      modified: false,
    }
    this.editingObject = null
    this.keyMap = null
    this.keyValuePairs = null
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (state.isEditing || props.inputMode) {
      return state
    }
    const newState: State = Object.assign({}, state, {
      isEditing: false,
      edition: Date.now(),
      isAddingProperty: false,
      object: props.object||{},
      keyValuePairs: props.keyValuePairs||[],
      modified: false,
    })
    for (let key of Object.keys(newState.object)) {
      if (Array.isArray(newState.object[key]) && newState.object[key].length) {
        newState.object[key] = newState.object[key][0]
      }
    }
    return newState
  }

  componentDidMount() {
    if (this.props.isEditing) {
      this.setState({
        isEditing: this.props.isEditing||false,
        isAddingProperty: false,
      })
    }
  }

  componentDidUpdate() {
    const obj = Object.assign({}, this.props.object, this.editingObject||this.keyMap ? this.assembleObject() : {}, this.props.object)

    for (let key of Object.keys(obj)) {
      if (Array.isArray(obj[key]) && obj[key].length) {
        obj[key] = obj[key][0]
      }
    }
    const kvp = this.keyValuePairs || this.props.keyValuePairs || []
    if (JSON.stringify(obj) !== JSON.stringify(this.state.object)
      || JSON.stringify(kvp) !== JSON.stringify(this.state.keyValuePairs)) {
      this.setState({
        object: obj,
        keyValuePairs: kvp
      })
    }
  }

  assembleObject() {
    if (this.editingObject) {
      let newObj: EditableObject = Object.assign({}, this.state.object, this.editingObject)
      if (this.keyMap) {
        for (let key of Object.keys(this.keyMap)) {
          const newKey = this.keyMap[key]
          const value = newObj[key]
          delete newObj[key]
          if (!newKey) continue
          newObj[newKey] = value
        }
      }
      return newObj
    }
    return null
  }

  onPropValueChange(isKeyChanged: boolean, newObj: any, propName:string, value:any) {
    if (this.state.isEditing||this.props.inputMode) {
      if (this.props.arrayOfkeyValuePairs) {
        if (this.props.onChange && this.keyValuePairs) {
          this.props.onChange(this.keyValuePairs, propName, value)
        }
      } else {
        if (this.props.onChange) {
          this.props.onChange(this.assembleObject(), propName, value)
        }
      }
    }
  }

  onStartEditing() {
    this.editingObject = {}
    this.keyMap = {}
    this.keyValuePairs = this.copyKeyValuePaires(this.state.keyValuePairs)
    this.setState({
      isEditing: true,
      isAddingProperty: false,
      object: this.props.object||{},
      keyValuePairs: this.props.keyValuePairs||[],
      modified: false,
    })
  }

  onCancelEditing() {
    this.editingObject = null
    this.keyMap = null
    this.keyValuePairs = null
    this.setState({
      isEditing: false,
      isAddingProperty: false,
      object: this.props.object||{},
      keyValuePairs: this.props.keyValuePairs||[],
      modified: false,
    })
    if (this.props.onCancel) {
      this.props.onCancel()
    }
  }

  onSubmit() {
    let newObj :EditableObject|null= this.state.object
    let kvp = this.state.keyValuePairs
    if (this.props.arrayOfkeyValuePairs) {
      if (this.keyValuePairs) {
        kvp = this.keyValuePairs
        if (this.props.onUpdate) {
          this.props.onUpdate(this.keyValuePairs)
        }
      }
    } else { 
      newObj = this.assembleObject()
      if ((this.editingObject && Object.keys(this.editingObject).length > 0)
        ||(this.keyMap && Object.keys(this.keyMap).length > 0)
        || this.state.modified
        ) {
        if (this.props.onUpdate) {
          this.props.onUpdate(newObj)
        }
      }
    }

    this.editingObject = null
    this.keyMap = null
    this.keyValuePairs = null
    this.setState({
      isEditing: false,
      isAddingProperty: false,
      object: newObj||{},
      keyValuePairs: kvp||[],
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
      keyValuePairs: [],
      modified: false,
    })
    this.editingObject = null
    this.keyMap = null
    this.keyValuePairs = null
  }

  copyKeyValuePaires(sourceKvp: {key:string, value:any}[]) {
    const kvp :{key:string, value: any}[] = []
    for(let i=0;i<sourceKvp.length;i++){
      kvp.push(Object.assign({},sourceKvp[i]))
    }
    return kvp
  }

  onAddProperty() {
    if (this.props.arrayOfkeyValuePairs) {
      let kvp = this.keyValuePairs || this.state.keyValuePairs
      kvp.push({key: '', value: null})
      this.keyValuePairs = this.copyKeyValuePaires(kvp)
      this.setState({
        keyValuePairs: kvp,
      })
    } else {
      let newObj: EditableObject = this.assembleObject() || {}
      let newProp = 'prop'
      let existingProps = Object.keys(newObj)
      if (existingProps.indexOf(newProp)>=0) {
        for(let i=1;true;i++) {
          newProp = 'prop'+i
          if (existingProps.indexOf(newProp)<0){
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
  }

  onRemoveProperty(propName: string, idx: number) {
    if (this.props.arrayOfkeyValuePairs) {
      console.log('removing, prop:',propName,'idx:',idx, 'state pairs:', this.state.keyValuePairs)
      const kvp = this.keyValuePairs || this.state.keyValuePairs
      if (idx < kvp.length) {
        kvp.splice(idx,1)
        this.keyValuePairs=this.copyKeyValuePaires(kvp)
        this.setState({
          keyValuePairs: kvp,
          modified: true,
        })

        if (this.props.onChange) {
          this.props.onChange(kvp, propName, undefined)
        }
      }
    } else {
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
      this.keyValuePairs = []
      this.setState({
        object: newObj||{},
        modified: true,
      })
      if (this.props.onChange) {
        this.props.onChange(newObj, propName, undefined)
      }
    }
  }

  render() {
    const thisStyle = Object.assign({}, {

    }, this.props.style)
    const spaceUnit = 5

    let keyValuePairs: {key: string, value: any}[] = []
    if (this.props.arrayOfkeyValuePairs) {
      keyValuePairs = this.state.keyValuePairs
    } else {
      for (let key of Object.keys(this.state.object)) {
        keyValuePairs.push({key, value: this.state.object[key]})
      }
    }

    const updateObject = (
            newValue: any, 
            propName: string,
            propIdx: number,
            isKey: boolean,
            onChange:any,
          ) => {

      if (this.props.arrayOfkeyValuePairs) {
        if (this.keyValuePairs && propIdx < this.keyValuePairs.length) {
          if (isKey) {
            this.keyValuePairs[propIdx].key = newValue
          } else {
            this.keyValuePairs[propIdx].value = newValue
          }
        }
        onChange.call(this, this.keyValuePairs, propName, newValue)
      } else {
        const tempObj:EditableObject = {}
        tempObj[propName] = newValue
        
        const sourceObj: any = isKey ? this.keyMap : this.editingObject
        const newObj = Object.assign({},sourceObj, tempObj)
        isKey ? this.keyMap = newObj : this.editingObject = newObj
        onChange.call(this, newObj, propName, newValue)
      }
    }

    const AlwaysFocusDuringInput = (props: {
                                              i: number, 
                                              propName: string,
                                              label: string,
                                              value: any,
                                              onChange:any,
                                              forKey?: boolean,
                                            }) => {
      const [inputValue, setInputValue] = React.useState(props.value)
      // setInputValue(value)
      const onChange = (e:any) => {
        if (!this.state.isEditing) {
          return
        }
        let v : any= e.target.value 
        if (!props.forKey) {
          if (v==='') {
            v = null
          } else {
            try {
              let n = Number(v)
              if (!Number.isNaN(n)) {
                if (v.length>0 && v[v.length-1]==='.') {
                  // v = v
                } else {
                  v = n
                }
              }
            } catch (e) {

            }
          }
        }
        updateObject(v, e.target.name, props.i, props.forKey||false, props.onChange)
        setInputValue(v===null?undefined:v)
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
            this.props.title || this.props.subtitle
            ? <CardHeader
                titleTypographyProps={{
                  variant:'h6', 
                }}
                style={{
                  backgroundColor: this.state.isEditing && !this.props.inputMode
                      ? this.props.theme.palette.primary.main
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
                        <ClearOutlinedIcon color="secondary"/>
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
            : null
            
          }
          
          <Divider />
          <CardContent className={
            this.state.isEditing
            ? this.props.classes.contentEditing
            : this.props.classes.content
          }>
          {
            keyValuePairs.map((item,i) => {
              const propName = item.key
              const rjKey = this.props.name+'-prop-'+i+"-"+propName+Date.now()
              let rawValue = item.value
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
                  <Grid container spacing={1} key={rjKey} alignItems="center">
                    <Grid item 
                      md={this.props.inputMode || this.state.isEditing?4:5}
                      sm={this.props.inputMode || this.state.isEditing?4:6} xs={5}>
                      <AlwaysFocusDuringInput 
                      i={i} 
                      forKey
                      propName={this.props.arrayOfkeyValuePairs?'key':propName}
                      label='key'
                      value={propName}
                      onChange={(newObj: any, p: string, v: any)=> {
                          this.onPropValueChange.call(this, true, newObj, propName, v)
                      }}
                    />
                    </Grid>
                    <Grid item md={7} sm={6} xs={this.props.inputMode || this.state.isEditing?5:7}>
                      <AlwaysFocusDuringInput 
                        i={i} 
                        propName={this.props.arrayOfkeyValuePairs?'key':propName} 
                        label='value'
                        value={value}
                        onChange={(newObj: any, p: string, v: any)=> {
                          this.onPropValueChange.call(this, false, newObj, propName, v)
                        }}
                      />
                    </Grid>
                    {
                      this.props.inputMode || this.state.isEditing
                      ? <Grid item md={1} sm={2} xs={2} style={{textAlign: "center"}}>
                          <IconButton 
                            style={{marginTop: 10}}
                            onClick={this.onRemoveProperty.bind(this, propName, i)}
                          >
                            <RemoveCircleOutlineOutlinedIcon color="error" />
                          </IconButton>
                        </Grid>
                      : null
                    }
                  </Grid>
                )
              } else if (
                (this.state.isEditing || this.props.inputMode)
                && this.props.schema
                && Array.isArray(this.props.schema[propName]) 
                && this.props.schema[propName].length > 0
                && this.props.schema[propName].reduce((a:any,b:any, idx:number) => {
                    if (idx === 1) {
                      return typeof a === 'string' && typeof b === 'string'
                    } else {
                      return a && typeof b === 'string'
                    }
                   })
                ) {
                const Selector = function (props: {
                                             propIdx: number,
                                             propName: string,
                                             values: string[]
                                             onChange:any
                                             selectedIdx: number,
                                           }) {

                  const [inputValue, setInputValue] = React.useState(props.selectedIdx)
                  return (
                    <Select
                      value={inputValue}
                      onChange={(e)=>{
                        e.preventDefault()
                        setInputValue(e.target.value)

                        updateObject(
                          props.values[Number(e.target.value)], 
                          props.propName, 
                          props.propIdx,
                          false, 
                          props.onChange,
                         )
                      }}
                    >
                      {
                        props.values.map((item,k)=>{
                          return (
                            <MenuItem 
                              value={k} 
                              key={rjKey+':selector:'+k}
                            >
                              {item}
                            </MenuItem>
                          )
                        })
                      }
                    </Select>
                  )
                }
                return (
                  <div 
                    style={{
                      marginTop: (i===0?spaceUnit:2*spaceUnit)*(this.props.spacing||1)
                    }}
                    key={rjKey}
                  >
                    <TextField
                      multiline
                      label={propName}
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                        className: (this.state.isEditing)
                              ? this.props.classes.inputLabelEditing
                              : this.props.classes.inputLabelNotEditing
                      }}

                      InputProps={{
                        classes: {
                          notchedOutline: this.props.classes.notchedOutlineEditing
                        },
                        className: this.props.classes.item,
                      }}
                      value=""
                    />
                    <div style={{
                      position: 'absolute',
                      marginLeft: 15,
                      marginTop: -45,
                    }}>
                    <Selector 
                      propName={propName}
                      propIdx={i}
                      values={this.props.schema[propName]}
                      onChange={this.onPropValueChange}
                      selectedIdx={this.props.schema[propName].indexOf(value)}
                    />
                    </div>
                  </div>
                )
              } else {
                return (
                  <AlwaysFocusDuringInput 
                    key={rjKey} 
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
