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
$message = $_POST['message']; // required, or below
$endorse = $_POST['endorsement']; // required, or above

// Validation
if (!isset($endorse) && !isset($message)) {
    died('One of the required fields was missing');
} else if (isset($message) &&  (!isset($name) || !isset($email_from) || !isset($message) || !isset($phone))) {
  died('One of the required fields was missing');
} else if (isset($endorse) && !isset($name)) {
  died('One of the required fields was missing');
}
$email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';
if(isset($email_from) && !preg_match($email_exp,$email_from)) {
  died('Your email address does not appear to be valid');
}
$string_exp = "/^[A-Za-z .'-]+$/";
if(!preg_match($string_exp,$name)) {
  died('Your name does not appear to be valid');
}
if((isset($message) && strlen($message) < 2) || (isset($endorse) && strlen($endorse) < 2)) {
  died('Your message is invalid');
}

// Clean inputs
$name = clean_string($name);
if (isset($email_from)) {
  $email_from = clean_string($email_from);
}
$email_subject = "Hello from ".$name."! (robertrotberg.com)";
if (isset($phone)) {
  $phone = clean_string($phone);
}
if (isset($message)){
  $message = clean_string($message);
} else if (isset($endorse)) {
  $endorse = clean_string($endorse);
}

if (isset($message)) {
  // HTML body
  $body = file_get_contents('../app/views/email-template/basic.html');
  $body = str_replace('$name', $name, $body);
  $body = str_replace('$phone', $phone, $body);
  $body = str_replace('$email', $email_from, $body);
  $body = str_replace('$message', $message, $body);
  $body = preg_replace('/\\\\/','', $body); // strip backslashes

  // Plaintext body
  $body_plain = "Hey there! You have a message from ".$name." through the contact form at http://robertrotberg.com.\n\n";
  $body_plain .= "Name: ".$name."\n";
  $body_plain .= "Email: ".$email_from."\n";
  $body_plain .= "Phone: ".$phone."\n";
  $body_plain .= "Comments: ".$message."\n";
} else if (isset($endorse)) {
  // Plaintext body
  $body = "Hey there! You have a new endorsement from ".$name." through http://robertrotberg.com.\n\n";
  $body .= "Their message: ".$endorse."\n";

  $body_plain = $body;
}

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
$mailer->isHTML(isset($message));                                  // Set email format to HTML

// Configuration of addresses
if (!isset($email_from)) {
  $email_from = 'dylan.gattey@gmail.com';
}
$mailer->From = $email_from;
$mailer->FromName = $name;
$mailer->addAddress('dylan.gattey@gmail.com', 'Webmaster');     // Add a recipient
$mailer->addReplyTo($email_from, $name);

// Configuration of information
$mailer->Subject = $email_subject;
$mailer->Body    = $body;
$mailer->AltBody = $body_plain;

if(!$mailer->send()) {
  header($_SERVER["SERVER_PROTOCOL"]." 500 Internal Error");
  died('Message could not be sent.\nMailer Error: ' . $mailer->ErrorInfo);
} else {
  header($_SERVER["SERVER_PROTOCOL"]." 200 Ok");
  echo 'Message has been sent';
}

?>
