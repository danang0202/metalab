import Cookies from 'js-cookie';


export const apiURL = 'http://127.0.0.1:8000/api';
export function formatDateTimeFunc(inputDateTime) {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dateTime = new Date(inputDateTime);

    const dayOfWeek = daysOfWeek[dateTime.getDay()];
    const day = dateTime.getDate();
    const month = months[dateTime.getMonth()];
    const year = dateTime.getFullYear();

    let hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();

    const formattedFullDateTime = `${dayOfWeek}, ${day} ${month} ${year} at ${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

    return formattedFullDateTime;
}

export function formatDateChat(timestamp) {
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const dateObject = new Date(timestamp);
    const currentDate = new Date();

    // Jika tanggal hari ini
    if (dateObject.toDateString() === currentDate.toDateString()) {
        return 'Today';
    }

    // Jika tanggal kemarin
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);
    if (dateObject.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }

    // Jika lebih dari kemarin
    const monthIndex = dateObject.getMonth();
    const day = dateObject.getDate();
    const formattedDate = `${months[monthIndex]} ${day}`;
}

export function formatDateContract(inputDate) {
    const date = new Date(inputDate);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    const formattedDate = `${day < 10 ? '0' : ''}${day} ${month} ${year}`;

    return formattedDate;
}


export const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Months are zero-based
    const day = now.getDate();

    return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
};

export const shouldUpdate = () => {
    const lastUpdateDate = Cookies.get('crone-job');
    const currentDate = getCurrentDate();

    return !lastUpdateDate || lastUpdateDate !== currentDate;
};

export function dateCheckFromHiring(inputDate, hiring) {
    if (hiring.second_stage) {
        return dateCheckAdmin(inputDate, hiring.second_stage.dateAdminFirst, hiring.second_stage.dateAdminSecond, hiring.second_stage.dateAdminThird, hiring.second_stage.dateUser);
    } else {
        return dateCheckAdmin(inputDate, hiring.third_stage.dateAdminFirst, hiring.third_stage.dateAdminSecond, hiring.third_stage.dateAdminThird, hiring.third_stage.dateUser);
    }
}

export function dateCheckAdmin(inputDate, dateAdminFirst, dateAdminSecond, dateAdminThird, dateUser) {

    const formattedInputDate = new Date(inputDate);

    const formattedDateAdminFirst = new Date(dateAdminFirst);
    const formattedDateAdminSecond = new Date(dateAdminSecond);
    const formattedDateAdminThird = new Date(dateAdminThird);

    if (dateUser != null) {
        return dateUser;
    } else if (isSameDate(formattedDateAdminFirst, formattedInputDate)) {
        return dateAdminFirst
    } else if (isSameDate(formattedDateAdminSecond, formattedInputDate)) {
        return dateAdminSecond;
    } else if (isSameDate(formattedDateAdminThird, formattedInputDate)) {
        return dateAdminThird;
    }
}

// Fungsi bantuan untuk memeriksa apakah dua tanggal cocok
function isSameDate(date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

export function takeHoursAndMinute(inputDateTime) {
    const dateTime = new Date(inputDateTime);

    let hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();

    const formattedFullDateTime = ` ${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

    return formattedFullDateTime;
}

export function isFutureDatetime(inputDatetime) {
    const currentDatetime = new Date();
    const inputDatetimeObj = new Date(inputDatetime);

    return inputDatetimeObj > currentDatetime;
}

export function formattedSalary(inputSalary) {
    return inputSalary.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR'
    });
}

export function isMinimumAge(dateOfBirth) {
    const currentDate = new Date();
    const birthDate = new Date(dateOfBirth);

    const ageDifference = currentDate.getFullYear() - birthDate.getFullYear();

    if (ageDifference < 17) {
        return false;
    }

    if (ageDifference === 17) {
        // Periksa bulan dan tanggal jika tahunnya sama
        if (currentDate.getMonth() < birthDate.getMonth()) {
            return false;
        }

        if (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate()) {
            return false;
        }
    }
    return true;
}

export function validateStartAndEndDate(dateStart, dateEnd) {
    const dateDateStart = new Date(dateStart);
    const dateDateEnd = new Date(dateEnd);

    if (dateDateStart > dateDateEnd || dateDateStart == dateDateEnd) {
        return false
    } else {
        return true;
    }
}

export function getEndDateCalenderEvents(inputDate) {
    const dateObj = new Date(inputDate);

    if (isNaN(dateObj.getTime())) {
        console.error("Invalid date");
        return null;
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Tambahkan nol di depan jika bulan < 10
    const day = String(dateObj.getDate()).padStart(2, '0'); // Tambahkan nol di depan jika tanggal < 10
    const hours = String(dateObj.getHours() + 2).padStart(2, '0'); // Tambahkan nol di depan jika jam < 10
    const minutes = String(dateObj.getMinutes()).padStart(2, '0'); // Tambahkan nol di depan jika menit < 10

    const resultString = `${year}-${month}-${day}T${hours}:${minutes}`;

    return resultString;
}

export function validateDateWeekdaysAndTime(inputDate) {
    const dateObj = new Date(inputDate);

    if (isNaN(dateObj.getTime())) {
        console.error("Invalid date");
        return false;
    }

    const dayOfWeek = dateObj.getDay();
    if (dayOfWeek < 1 || dayOfWeek > 5) {
        return false; //date tidak termasuk dalam weekdays
    }

    const hours = dateObj.getHours();
    if (hours < 7 || hours >= 18) {
        return false; //data tidak termausk jam 7 pagi - 6 sore
    }
    return true;
}

export function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
    }
    return text;
}