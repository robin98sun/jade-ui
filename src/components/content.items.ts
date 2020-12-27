import {
  SettingsEthernet as SettingsEthernetIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  SendOutlined as SendOutlinedIcon,
} from '@material-ui/icons'
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import AssignmentIcon from '@material-ui/icons/Assignment';

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
    },
    {
        dispatcher: {
            title: 'Dispatch Task',
            icon: SendOutlinedIcon,
        },
        example: {
          title: 'Example Task',
          icon: AssignmentIcon,
        },
    },
    {
        topo: { 
            title: 'Topology',
            icon: AccountTreeIcon,
        },
        search: {
            title: 'Search Fanout',
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
