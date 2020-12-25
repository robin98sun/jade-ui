import React, { Component } from 'react'
import {
  SettingsEthernet as SettingsEthernetIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  OpenWith as OpenWithIcon,
  SendOutlined as SendOutlinedIcon,
} from '@material-ui/icons'

export const contentItems: {
                             [key:string]:{
                               title: string
                               icon: any
                             }
                           }[] = [
    {
        conf: {
            title: 'Node Info',
        },
        dispatcher: {
            title: 'Dispatch Task',
        },
    },
    {
        topo: { 
            title: 'Topology',
        },
    },
    {
        conn: {
            title: 'Connection',
        },
        intro: {
            title: 'Introduction',
        },
    }
]

export const getContentIcon = (name: string, color: string) => {
    switch(name) {
    case 'conf':
        return <SettingsIcon color={color} />
    case 'dispatcher':
        return <SendOutlinedIcon color={color} />
    case 'topo':
        return <OpenWithIcon color={color} />
    case 'conn':
        return <SettingsEthernetIcon color={color} />
    case 'intro':
        return <InfoIcon color={color} />
    default:
        return null
    }
}

export const defaultItem = 'intro'
