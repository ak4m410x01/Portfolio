<?php 
$name = $_POST["name"];
$email = $_POST["email"];
$subject = $_POST["subject"];
$message = $_POST["message"];
include '../assets/vendor/swiper/enc.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
require '../vendor/autoload.php';
$mail = new PHPMailer(true);
include '../assets/vendor/enc.php';
$x = returnSomething();
$mail-> isSMTP();
$mail->Host = "smtp.gmail.com";
$mail-> SMTPAuth = true;
$mail->Username = "abdallah10kamal@gmail.com";
$mail->Password = "$x";

$mail->SMTPSecure = 'ssl';
$mail->Port = 465;


$mail->setFrom($email, $name);
$mail->addAddress("abdullah.kamal0x01@gmail.com");
$mail->isHTML(true);
$mail->Subject = $subject;
$mail->Body = $message;
$mail->send();
header("Location: https://ak4m410x01.github.io/Portfolio/index.html");
