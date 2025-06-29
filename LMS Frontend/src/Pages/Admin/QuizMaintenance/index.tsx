import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CommanLayout from 'src/Layout/CommanLayout';
import CategoryMaintenance from './QuizMaintenance';
import CategoryForm from './QuizForm';
import CourseMaintenance from './QuizMaintenance';
import CourseForm from './QuizForm';
import SectionMaintenance from './QuizMaintenance';
import SectionForm from './QuizForm';
import QuizMaintenance from './QuizMaintenance';
import QuizForm from './QuizForm';

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

export default function Quizes() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <CommanLayout name="Quiz Maintenance" path="quiz-maintenance">
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Quizes" {...a11yProps(0)} />
                        <Tab label="Add Quiz" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <QuizMaintenance />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <QuizForm />
                </CustomTabPanel>
            </Box>
        </CommanLayout>
    );
}