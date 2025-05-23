import CommanLayout from "src/Layout/CommanLayout";
import "../../Common/styles/dashboard.css";
import { useEffect, useState } from "react";
import { getFamousCourses } from "src/Services/dashboard_api";
import famousCourseImg from "../../Assets/Images/famous-course.png"

export default function Dashboard() {
    const [famousCourses, setFamousCourses] = useState<any[]>([])

    useEffect(() => {
        handleGetFamousCourses()
    }, [])

    const handleGetFamousCourses = async () => {
        try {
            const response = await getFamousCourses()
            setFamousCourses(response.data)
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
                                <div className="d-stat-title">

                                </div>
                            </div>
                            <div className="ds-inner1"></div>

                        </div>
                        <div className="d-stat-card"></div>
                        <div className="d-stat-card"></div>
                        <div className="d-stat-card"></div>
                    </div>
                </div>
                <div className="dashboard-inner1">

                </div>
            </div>
        </CommanLayout>
    );
}