<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $recipient = $_POST["recipient"];
    $message = $_POST["message"];
    
    $subject = "Your Subject Here";
    $headers = "From: louayhouimli@engineer.com";

    if (mail($recipient, $subject, $message, $headers)) {
        echo "Email sent successfully!";
    } else {
        echo "Email sending failed.";
    }
}
?>
