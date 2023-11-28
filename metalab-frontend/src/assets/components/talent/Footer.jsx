// eslint-disable-next-line no-unused-vars
import React from 'react';

const Footer = () => {
    return (
        <>
            <footer className="px-md-4 px-lg-5 px-0 mt-3 pb-lg-0 d-flex justify-content-center w-100">
                <div className="ps-lg-5 ps-md-5 ps-1 pb-4 footer-container bg-image row pt-4 w-100">
                    <div className="col-lg-5 d-flex flex-column mb-md-2 mb-2 mb-lg-0">
                        <a href="#">
                            <picture>
                                <img
                                    className="logo-registered mb-4"
                                    src="/public/images/metalab-logo.png"
                                    style={{ width:'10rem', height:"auto"}}
                                    alt="logo"
                                />
                            </picture>
                        </a>
                        <div className="d-flex flex-column mb-2">
                            <span className="fw-bolder mb-2">PT. Meta Lab Nusantara</span>
                            <span className="fw-bold text-black-50">THE CITY TOWER</span>
                            <span className="fw-semibold text-black-50">
                                <span>Level 12-1N, Jl. MH.Thamrin No. 81, Menteng, Jakarta Pusat</span>
                            </span>
                            <span className="fw-semibold text-black-50">
                                <span>Contact :&nbsp;hello@metalab.co.id</span>
                            </span>
                        </div>
                    </div>
                    <div className="col">
                        <h5 className="fw-semibold mb-2 fs-6 fs-md-5 ">Company</h5>
                        <div className="d-flex flex-column gap-1">
                            <a className="text-decoration-none text-reset" href="#">About us</a>
                            <a className="text-decoration-none text-reset" href="#">Contact us</a>
                            <a className="text-decoration-none text-reset" href="#">Jobs &amp; Opportunity</a>
                        </div>
                    </div>
                    <div className="col">
                        <h5 className="fw-semibold mb-2 fs-6 fs-md-5 ">Support</h5>
                        <div className="d-flex flex-column gap-1">
                            <a className="text-decoration-none text-reset" href="#">Term of service</a>
                            <a className="text-decoration-none text-reset" href="#">Privacy policy</a>
                        </div>
                    </div>
                    <div className="col">
                        <h5 className="fw-semibold mb-2 fs-6 fs-md-5 ">Stay up to date</h5>
                        <div className="d-flex gap-2">
                            <a
                                className="social-icon text-center align-middle rounded-circle p-1"
                                href="#"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="1em"
                                    height="1em"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                    className="icon-footer bi bi-instagram m-1"
                                >
                                    <path
                                        d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.920.599.280.280.453.546.598.920.110.281.240.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.280.280-.546.453-.920.598-.280.110-.704.240-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.780-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.920-.598 2.48 2.48 0 0 1-.600-.920c-.109-.281-.240-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.780.166-1.204.276-1.486.145-.373.319-.640.599-.920.280-.280.546-.453.920-.598.282-.110.705-.240 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"
                                    ></path>
                                </svg>
                            </a>
                            <a
                                className="social-icon text-center align-middle rounded-circle p-1"
                                href="#"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="1em"
                                    width="1em"
                                    fill="currentColor"
                                    className="icon-footer"
                                    viewBox="0 0 448 512"
                                >
                                    <path
                                        d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
