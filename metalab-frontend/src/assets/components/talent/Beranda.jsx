import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserInfoBeranda from "./UserInfoBeranda";
import api from "../../apiConfig/apiConfig";
import { useState } from "react";
import Loading from "../Loading";
import { Link } from "react-router-dom";
import HiringEmpty from "./HiringEmpty";
import HiringCard from "./HiringCard";
import Cookies from 'js-cookie';



function Beranda() {
  const [user, setUser] = useState();
  const [hiring, setHiring] = useState([]);
  const navigate = useNavigate();
  const token = Cookies.get('token_metalab');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Cookies.get('email_metalab') == null) {
      navigate('/login');
    }
  }, [])

  useEffect(() => {
    const fetchDataUser = async () => {
      setLoading(true);
      if (!user && token) {
        try {
          const response = await api.get(`/profil-beranda`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.status === 200) {
            if(response.data.user.status == 'Disable'){
              navigate('/logout');
            }
            setUser(response.data.user);
          }
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error('Error:', error);
        }
      }
    };

    const fetchHiringUserProgress = async () => {
      setLoading(true);
      if (!user && token) {
        try {
          const response = await api.get(`/hiring/data-user-progress`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.status === 200) {
            setHiring(response.data.hiring)
          } else if (response.status === 204) {
            setHiring(null);
          }
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error('Error:', error);
        }
      }
    }
    fetchDataUser();
    fetchHiringUserProgress();
  }, []);

  return (
    <>
      <UserInfoBeranda user={user} />
      {/* Tampilan untuk ipad dan laptop */}
      <div className="d-none d-lg-block d-md-block">
        <div className="container d-flex flex-column align-items-center">
          <div className="d-flex flex-column col-lg-7 col-md-12">
            <div className="title mt-4 d-flex flex-row justify-content-between">
              <h5>Your Job Application</h5>
              <Link to={'/hiring'}>
                <h6 className="btn bg-orange hover-op6 btn-sm text-light">See All</h6>
              </Link>
            </div>
            {!loading && hiring == null || hiring.length == 0 ? (
              <HiringEmpty />
            ) : (
              hiring
                .map((item) => ({
                  ...item, status: 'Hired'
                }))
                .map((item) => (
                  <HiringCard item={item} mobile={false} key={item.id} />
                )))
            }
          </div>
        </div>
      </div>

      {/* Tampilan untuk mobile */}
      <div className="d-block d-lg-none d-md-none">
        <div className="container d-flex flex-column align-items-center">
          <div className="d-flex flex-column col-12">
            <div className="title my-3 d-flex flex-row justify-content-between px-2">
              <h5>Your Job Application</h5>
              <Link to={'/hiring'}>
                <h6 className="btn btn-warning text-light">See All</h6>
              </Link>
            </div>
            {!loading && hiring == null || hiring.length == 0 ? (
              <HiringEmpty />
            ) : (
              hiring
                .map((item) => ({
                  ...item, status: 'Hired'
                }))
                .map((item) => (
                  <HiringCard item={item} mobile={true} key={item.id} />
                )))
            }
          </div>
        </div>
      </div>
      {loading && (
        <Loading />
      )}
    </>

  );
}

export default Beranda;
