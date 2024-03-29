import {
  SettingsEthernet as SettingsEthernetIcon,
  Info as InfoIcon,
  Settings as SettingsIcon,
  SendOutlined as SendOutlinedIcon,
} from '@material-ui/icons'
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import AssignmentIcon from '@material-ui/icons/Assignment';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import ViewComfyIcon from '@material-ui/icons/ViewComfy';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';

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
        example: {
          title: 'Batch Test',
          icon: AssignmentIcon,
        },
        jobStatus: {
          title: 'Test Status',
          icon: DoubleArrowIcon,
        },
        showTraces: {
          title: 'Show Traces',
          icon: FormatListNumberedIcon,
        },
        showStat: {
          title: 'Show Stat',
          icon: EqualizerIcon,
        },
        showPods: {
          title: 'Show Pods',
          icon: ViewComfyIcon,
        },
    },
    {  
        dispatcher: {
          title: 'Dispatch Task',
          icon: SendOutlinedIcon,
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
