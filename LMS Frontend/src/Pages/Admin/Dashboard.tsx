import CommanLayout from "src/Layout/CommanLayout";
import "../../Common/styles/dashboard.css";
import { useEffect, useState } from "react";
import { getFamousCourses } from "src/Services/dashboard_api";
import famousCourseImg from "../../Assets/Images/famous-course.png"
import categoriesImg from "../../Assets/Images/categories.png"
import coursesImg from "../../Assets/Images/ebook.png"
import userImg from "../../Assets/Images/user-stat.png"
import lessonsImg from "../../Assets/Images/calendar.png"
import { getAllCourses } from "src/Services/course_api";
import { getCategories } from "src/Services/category_api";
import { getUsers } from "src/Services/user_api";
import { getAllWords } from "src/Services/word_api";

export default function Dashboard() {
    const [famousCourses, setFamousCourses] = useState<any[]>([])
    const [catCount, setCatCount] = useState<any>()
    const [coursesCount, setCoursesCount] = useState<any>()
    const [usersCount, setUsersCount] = useState<any>()
    const [lessonsCount, setLessonsCount] = useState<any>()

    const token = sessionStorage.getItem("token")

    useEffect(() => {
        handleGetFamousCourses()
        handleGetCat()
        handleGetCourses()
        handleGetUsers()
        handleGetLessons()
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
            setLessonsCount(response.data.length)
        } catch (error) {
            console.error(error);            
        }
    }

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
                </div>
                <div className="dashboard-inner1">

                </div>
            </div>
        </CommanLayout>
    );
}