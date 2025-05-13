import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CommanLayout from 'src/Layout/CommanLayout';
import CategoryMaintenance from './KoreanVideoMaintenance';
import CategoryForm from './KoreanVideoForm';
import CourseMaintenance from './KoreanVideoMaintenance';
import CourseForm from './KoreanVideoForm';
import KoreanVideoMaintenance from './KoreanVideoMaintenance';
import KoreanVideoForm from './KoreanVideoForm';

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

export default function KoreanVideos() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <CommanLayout name="Korean Video Maintenance" path="video-maintenance">
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Videos" {...a11yProps(0)} />
                        <Tab label="Add Video" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <KoreanVideoMaintenance />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <KoreanVideoForm />
                </CustomTabPanel>
            </Box>
        </CommanLayout>
    );
}