<?php
require 'vendor/autoload.php'; // Include the Elastic Email PHP library

use ElasticEmailClient\Api\Email;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $apiKey = 'BAF5B4CFE64ED6BF214900DBA6D17DDF6F2F040B4C0C844B29AFD776D3B1322540B9BEBDFC716C91D2D61C6BB0A18859';

    $emailApi = new Email();
    $emailApi->setApiKey($apiKey);

    $recipient = $_POST["recipient"];
    $message = $_POST["message"];

    // Compose your email
    $email = array(
        'from' => 'louayhouimli@engineer.com',
        'fromName' => 'Your Name',
        'subject' => 'Test Email',
        'body' => $message, // Use the message from the form
        'to' => $recipient, // Use the recipient email from the form
        'isTransactional' => false, // Change to true if it's a transactional email
    );

    // Send the email
    $result = $emailApi->send($email);

    if ($result->code === '200') {
        $status_message = "Email sent successfully!";
    } else {
        $status_message = "Email sending failed. Error message: " . $result->body;
    }
} else {
    $status_message = "";
}
?>
