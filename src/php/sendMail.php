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

// Shared data
$name = $_POST['name'];
$message = $_POST['message'];
// Endorse only
$display_name = $_POST['displayName'];
// Contact only
$email_from = $_POST['email'];
$phone = $_POST['phone'];

// Validation
if (!isset($message) || !isset($name)) {
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
if(isset($display_name) && !preg_match($string_exp,$display_name)) {
  died('Your display name does not appear to be valid');
}

// Clean inputs
$name = clean_string($name);
if (isset($email_from)) {
  $email_from = clean_string($email_from);
}
$email_subject = "Message from robertrotberg.com";
if (isset($phone)) {
  $phone = clean_string($phone);
}
if (isset($message)){
  $message = clean_string($message);
}

if (!isset($display_name)) {
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
} else {
  // Endorsement!
  $body = "<p>Hey there! You have a new endorsement through http://robertrotberg.com.</p><br/>";
  $body .= "<p><strong>Full Name: </strong>".$name."</p>";
  $body .= "<p><strong>Name should be displayed on website as: </strong>".$display_name."</p>";
  $body .= "<p><strong>Optional comments: </strong>".$message."</p>";

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
$mailer->isHTML(true);                                  // Set email format to HTML

// Configuration of addresses
if (!isset($email_from)) {
  $email_from = 'dylan.gattey@gmail.com';
}
$mailer->From = $email_from;
$mailer->FromName = $name;
$mailer->addAddress('robert_rotberg@hks.harvard.edu', 'Robert Rotberg');     // Add a recipient
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
