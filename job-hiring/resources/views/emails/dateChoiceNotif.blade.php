<?php
function formatTanggal($tanggal)
{
    $tanggalObj = new DateTime($tanggal);
    $formattedDate = $tanggalObj->format('d-m-Y \a\t H:i \W\I\B');
    return $formattedDate;
}
$data['date'][0] = formatTanggal($data['date'][0]);
$data['date'][1] = formatTanggal($data['date'][1]);
$data['date'][2] = formatTanggal($data['date'][2]);
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
            background-color: #f4f4f4 !important;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff !important;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin-top: 20px;
        }

        .box {
            background: #00A3E1;
            padding: 5px;
            color: white !important;
            text-align: center;
        }

        .content-container,
        .footer,
        .detail-button {
            padding: 0rem 1rem
        }

        .content {
            padding: .5rem 1rem;

        }

        .greet {
            font-weight: 600;
        }

        button {
            background: #FA9370;
            padding: .5rem 1rem;
            color: #fff;
            border: none;
            border-radius: .3rem;
        }

        .button-container {
            text-align: center;
            padding-bottom: 1rem
        }

        .footer-container {
            background: #f7f7f8;
            color: black;
            padding: .5rem 0rem
        }

        table {
            border-collapse: collapse;
            line-height: 2rem;
            width: 100%;
        }

        th {
            background: #f4f4f4
        }

        td,
        th {
            border: 1px solid grey;
            padding: .5rem 1rem;

        }
    </style>
</head>

<body>
    <div class="container">
        <div class="box">
            <h2>{{ $data['subject'] }} Schedule</h2>
        </div>
        <div class="content-container">
            <p class="greet" style="color:#00A3E1">Halo, {{ $data['talentName'] }} !</p>
            <p>We have sent an offer of a schedule for carrying out the <span style="color: #00A3E1">
                    {{ $data['subject'] }}</span>  for <span style="color:#00A3E1">{{ $data['jobName'] }}, please choose one of the three
                dates we have provided.</p>
            <div class="content">
                <table>
                    <thead>
                        <tr>
                            <th>Offer</th>
                            <th>Schedule</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Offer 1</td>
                            <td>{{ $data['date'][0] }}</td>
                        </tr>
                        <tr>
                            <td>Offer 2</td>
                            <td>{{ $data['date'][1] }}</td>
                        </tr>
                        <tr>
                            <td>Offer 3</td>
                            <td>{{ $data['date'][2] }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="detail-button">
            <p>You can see your hiring details by pressing this button:</p>
            <div class="button-container">
                <button><a href={{ $data['link'] }} style="color: #fff; text-decoration:none">Click for
                        Details</a></button>
            </div>
        </div>
        <div class="footer-container">
            <div class="footer">
                <p>Thank You,</p>
                <small>Regards,</small>
                <p>PT Meta Lab Nusantara</p>
            </div>
            <div class="footer" style="margin-top:2rem">
                <small>If the button above does not work, please use the following link <a
                        href={{ $data['link'] }}>{{ $data['link'] }}</a></small>
            </div>
        </div>

    </div>
</body>

</html>
