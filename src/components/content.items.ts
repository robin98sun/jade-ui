import {
  SettingsEthernet as SettingsEthernetIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  OpenWith as OpenWithIcon,
  SendOutlined as SendOutlinedIcon,
} from '@material-ui/icons'
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';

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
        search: {
            title: 'Search',
            icon: SearchOutlinedIcon,
        }
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
