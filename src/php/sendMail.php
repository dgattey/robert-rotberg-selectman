<?php

require 'PHPMailerAutoload.php';

function died($error) {
  header($_SERVER["SERVER_PROTOCOL"]." 500 Internal Error");
  echo $error;
  die();
  exit();
}

function clean_string($string) {
  $bad = array("content-type","bcc:","to:","cc:","href");
  return str_replace($bad,"",$string);
}

// Get post data
$name = $_POST['name']; // required
$email_from = $_POST['email']; // required
$phone = $_POST['phone']; // not required
$message = $_POST['message']; // required

// Validation
if(!isset($name) || !isset($email_from) || !isset($message) || !isset($phone)) {
    died('One of the required fields was missing');
}

// Clean inputs
$name = clean_string($name);
$email_from = clean_string($email_from);
$email_subject = "Hello from ".$name."! (robertrotberg.com)";
$phone = clean_string($phone);
$message = clean_string($message);

// Create message
$email_message = "Hey there! You have a message from ".$name." through the contact form at http://robertrotberg.com.\n\n";
$email_message .= "Name: ".$name."\n";
$email_message .= "Email: ".$email_from."\n";
$email_message .= "Phone: ".$phone."\n";
$email_message .= "Comments: ".$message."\n";

///////////////////
// PHP MAILER
///////////////////

$mailer = new PHPMailer;

// Settings for mailer
$mailer->isSMTP();                                      // Set mailer to use SMTP
$mailer->Host = 'smtp.gmail.com';                       // Specify main SMTP server
$mailer->Port = 465;                                    // The SSL port
$mailer->SMTPAuth = true;                               // Enable SMTP authentication
$mailer->Username = 'skicrazy27@gmail.com';             // SMTP username
$mailer->Password = 'ajxhjhyjibmtxxpf';                 // SMTP password
$mailer->SMTPSecure = 'ssl';                            // Enable encryption, 'ssl' also accepted
$mailer->WordWrap = 50;                                 // Set word wrap to 50 characters
$mailer->isHTML(true);                                  // Set email format to HTML

// Configuration of addresses
$mailer->From = $email_from;
$mailer->FromName = $name;
$mailer->addAddress('dylan.gattey@gmail.com', 'Webmaster');     // Add a recipient
$mailer->addReplyTo($email_from, $name);

// Configuration of information
$mailer->Subject = $email_subject;
$mailer->Body    = 'This is the HTML message body <b>in bold!</b>';
$mailer->AltBody = 'This is the body in plain text for non-HTML mail clients';

if(!$mailer->send()) {
  header($_SERVER["SERVER_PROTOCOL"]." 500 Internal Error");
  echo 'Message could not be sent.';
  echo 'Mailer Error: ' . $mailer->ErrorInfo;
} else {
  header($_SERVER["SERVER_PROTOCOL"]." 200 Ok");
  echo 'Message has been sent';
}

?>
