import CommanLayout from "src/Layout/CommanLayout";
import "../../Common/styles/dashboard.css";
import { useEffect, useState } from "react";
import { getFamousCourses, getTopLocations, getTopStudents } from "src/Services/dashboard_api";
import famousCourseImg from "../../Assets/Images/famous-course.png"
import categoriesImg from "../../Assets/Images/categories.png"
import coursesImg from "../../Assets/Images/ebook.png"
import userImg from "../../Assets/Images/user-stat.png"
import lessonsImg from "../../Assets/Images/calendar.png"
import { getAllCourses } from "src/Services/course_api";
import { getCategories } from "src/Services/category_api";
import { getUsers } from "src/Services/user_api";
import { getAllWords } from "src/Services/word_api";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

export default function Dashboard() {
    const [famousCourses, setFamousCourses] = useState<any[]>([])
    const [topStudents, setTopStudents] = useState<any[]>([])
    const [topLocations, setTopLocations] = useState<any[]>([])
    const [catCount, setCatCount] = useState<any>()
    const [coursesCount, setCoursesCount] = useState<any>()
    const [usersCount, setUsersCount] = useState<any>()
    const [lessonsCount, setLessonsCount] = useState<any>()

    const token = localStorage.getItem("token")

    const COLORS = ['#1F95F8', '#FFC04D', '#FFA500', '#FF8C00', '#FF6700'];

    useEffect(() => {
        handleGetFamousCourses()
        handleGetCat()
        handleGetCourses()
        handleGetUsers()
        handleGetLessons()
        handleGetTopStudents()
        handleGetLocations()
    }, [])

    const handleGetFamousCourses = async () => {
        try {
            const response = await getFamousCourses()
            setFamousCourses(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    const handleGetCat = async () => {
        try {
            const response = await getCategories()
            const active = response.data.filter((course: any) => course.activeStatus === 1);
            setCatCount(active.length)
        } catch (error) {
            console.error(error);
        }
    }

    const handleGetCourses = async () => {
        try {
            const response = await getAllCourses()
            const active = response.data.filter((course: any) => course.activeStatus === 1);
            setCoursesCount(active.length)
        } catch (error) {
            console.error(error);
        }
    }

    const handleGetUsers = async () => {
        try {
            const response = await getUsers(token)
            const active = response.data.filter((course: any) => course.status === 1);
            setUsersCount(active.length)
        } catch (error) {
            console.error(error);
        }
    }

    const handleGetLessons = async () => {
        try {
            const response = await getAllWords(token)
            const allWords = response.data;

            if (allWords.length === 0) {
                setLessonsCount(0);
                return;
            }

            const baseDate = new Date(allWords[0].createdAt).toISOString().split("T")[0];

            const filteredWords = allWords
                .map((word: any) => ({
                    ...word,
                    createdAtDate: new Date(word.createdAt).toISOString().split("T")[0]
                }))
                .filter((word: any) => word.createdAtDate === baseDate)
                .map((word: any) => ({
                    ...word,
                    active: "Yes"
                }));

            setLessonsCount(filteredWords.length)
        } catch (error) {
            console.error(error);
        }
    }

    const handleGetTopStudents = async () => {
        try {
            const response = await getTopStudents()
            setTopStudents(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    const handleGetLocations = async () => {
        try {
            const response = await getTopLocations();
            const parsed = response.data.map((item: any) => ({
                ...item,
                studentsCount: parseInt(item.studentsCount, 10)
            }));
            setTopLocations(parsed);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <CommanLayout name="Dashboard" path="dashboard">
            <div className="dashboard-outer">
                <div className="dashboard-inner">
                    <div className="d-img-outer">
                        <div className="d-text-outer">
                            <div className="d-title">Welcome Back! Admin,</div>
                            <div className="d-desc">
                                Everything is going great! Your course <span className="focus-text">{famousCourses[0]?.courseName}</span> has become a standout success, earning the title of most popular course with <span className="focus-text">{famousCourses[0]?.studentCount}</span> students enrolled.
                            </div>
                        </div>
                        <div className="d-main-img">
                            <img className="fc-img" src={famousCourseImg} alt="" />
                        </div>
                    </div>

                    <br />

                    <div className="d-stat-card-outer">
                        <div className="d-stat-card">
                            <div className="ds-inner">
                                <div className="d-stat-title d-stat-m">
                                    Categories
                                </div>
                                <div className="d-stat-count d-stat-m">
                                    {catCount ?? 0}
                                </div>
                            </div>
                            <div className="ds-inner1">
                                <img className="stat-img" src={categoriesImg} alt="" />
                            </div>
                        </div>
                        <div className="d-stat-card">
                            <div className="ds-inner">
                                <div className="d-stat-title d-stat-m">
                                    Courses
                                </div>
                                <div className="d-stat-count d-stat-m">
                                    {coursesCount ?? 0}
                                </div>
                            </div>
                            <div className="ds-inner1">
                                <img className="stat-img" src={coursesImg} alt="" />
                            </div>
                        </div>
                        <div className="d-stat-card">
                            <div className="ds-inner">
                                <div className="d-stat-title d-stat-m">
                                    Users
                                </div>
                                <div className="d-stat-count d-stat-m">
                                    {usersCount ?? 0}
                                </div>
                            </div>
                            <div className="ds-inner1">
                                <img className="stat-img" src={userImg} alt="" />
                            </div>
                        </div>
                        <div className="d-stat-card">
                            <div className="ds-inner">
                                <div className="d-stat-title d-stat-m">
                                    Lessons
                                </div>
                                <div className="d-stat-count d-stat-m">
                                    {lessonsCount ?? 0}
                                </div>
                            </div>
                            <div className="ds-inner1">
                                <img className="stat-img" src={lessonsImg} alt="" />
                            </div>
                        </div>
                    </div>

                    <br />

                    <div className="graph-outer">
                        <div className="bar-graph-outer">
                            <h3 style={{ marginBottom: "25px" }}>Top 5 Courses</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={famousCourses}>
                                    <XAxis dataKey="courseName" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="studentCount" fill="#1F95F8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="pie-chart-outer">
                            <h3 style={{ marginBottom: "25px" }}>Top Locations</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={topLocations}
                                        dataKey="studentsCount"
                                        nameKey="locationName"
                                        outerRadius={100}
                                        label
                                    >
                                        {topLocations.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend />
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
                <div className="dashboard-inner1">
                    <div className="top-students-title">
                        Top 5 Students
                    </div>
                    <div className="top-students-container">
                        {topStudents.length > 0 ? (
                            topStudents.slice(0, 5).map((student, index) => (
                                <div key={student.id} className="top-student-card">
                                    <div className="top-student-rank">#{index + 1}</div>
                                    <div className="top-student-details">
                                        <div className="top-student-name">{student.name}</div>
                                        <div className="top-student-count">{student.coursesCount} Courses</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="top-student-empty">No top students found.</div>
                        )}

                    </div>
                </div>
            </div>
        </CommanLayout>
    );
}