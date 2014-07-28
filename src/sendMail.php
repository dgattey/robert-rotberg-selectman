<?php

if(isset($_POST['email'])) {

    // EDIT THE 2 LINES BELOW AS REQUIRED
  $email_to = "dylan.gattey@gmail.com";
  $email_subject = "Contact from robertrotberg.com";

  function died($error) {
    echo "We are very sorry, but there were error(s) found with the form you submitted. ";
    echo "These errors appear below.<br /><br />";
    echo $error."<br /><br />";
    echo "Please go back and fix these errors.<br /><br />";
    die();
  }

    // Validation
  if(!isset($_POST['name']) || !isset($_POST['email']) || !isset($_POST['message'])) {
      died('We are sorry, but there appears to be a problem with the form you submitted.');
  }

  $name = $_POST['name']; // required
  $email_from = $_POST['email']; // required
  $phone = $_POST['phone']; // not required
  $message = $_POST['message']; // required

  $error_message = "";


  $email_message = "Message from ".clean_string($name)."\n\n";
  function clean_string($string) {
    $bad = array("content-type","bcc:","to:","cc:","href");
    return str_replace($bad,"",$string);
  }
  $email_message .= "Name: ".clean_string($name)."\n";
  $email_message .= "Email: ".clean_string($email_from)."\n";
  $email_message .= "Phone: ".clean_string($phone)."\n";
  $email_message .= "Comments: ".clean_string($message)."\n";

  // create email headers
  $headers = 'From: '.$email_from."\r\n".
  'Reply-To: '.$email_from."\r\n" .
  'X-Mailer: PHP/' . phpversion();
  @mail($email_to, $email_subject, $email_message, $headers);

  echo "Success, thank you for contacting us. We will be in touch with you very soon.";

} else {
  http_response_code(404); echo "Error, couldn't get data: ".$name.", ".$email.", ".$phone.", ".$message;
}

?>
