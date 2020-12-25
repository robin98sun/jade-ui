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
            icon: SettingsIcon,
        },
        dispatcher: {
            title: 'Dispatch Task',
            icon: SendOutlinedIcon,
        },
    },
    {
        topo: { 
            title: 'Topology',
            icon: OpenWithIcon,
        },
    },
    {
        conn: {
            title: 'Connection',
            icon: SettingsEthernetIcon,
        },
        intro: {
            title: 'Introduction',
            icon: InfoIcon,
        },
    }
]

export const defaultItem = 'intro'
