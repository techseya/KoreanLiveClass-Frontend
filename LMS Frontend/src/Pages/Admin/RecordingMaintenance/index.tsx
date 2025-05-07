import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CommanLayout from 'src/Layout/CommanLayout';
import CategoryMaintenance from './RecordingMaintenance';
import CategoryForm from './RecordingForm';
import CourseMaintenance from './RecordingMaintenance';
import CourseForm from './RecordingForm';
import SectionMaintenance from './RecordingMaintenance';
import SectionForm from './RecordingForm';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function Recordings() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <CommanLayout name="Recording Maintenance" path="recording-maintenance">
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Recordings" {...a11yProps(0)} />
                        <Tab label="Add Recording" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <SectionMaintenance />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <SectionForm />
                </CustomTabPanel>
            </Box>
        </CommanLayout>
    );
}