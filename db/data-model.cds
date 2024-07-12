namespace gallant.notifSender;
using { cuid, managed } from '@sap/cds/common';

type t_vendor: String(60);
type t_docType: String(20);
type t_msgType: String(4); // SMS or EMAIL



entity Configuration: managed {
  key vendor: t_vendor @title : 'Vendor';
  key msgType: t_msgType @title : 'Message Type';
  apihost: String(200) @title : 'API Host';
  port: Int16 @title : 'Port';
  username: String(50) @title : 'User Name';
  password: String(30) @title : 'Password';
  sender: String(50) @title : 'Sender';
  documentType: t_docType @title : 'Document Type';
  active: Boolean default true @title : 'Active Flag';
}


entity Templates : managed {
  key vendor: t_vendor @title : 'Vendor';
  key documentType: t_docType @title : 'Document Type';
  key msgType: t_msgType @title : 'Message Type';
  templateID: String(50) @title : 'Template ID';
  content: String(200) @title : 'Content';
}

entity Log : cuid, managed {
  key vendor: t_vendor @title : 'Vendor';
  key msgType: t_msgType @title : 'Message Type';
  key documentType: t_docType @title : 'Document Type';
  key documentRef: String(100) @title : 'Document Reference';
  status: String(30) @title : 'Status';
  messageContent: LargeString @title : 'Message Content';
}

entity Messages: managed {
  key ID : UUID;
  content : String;
  subject:String;
  templateID: Integer64;
  attachment: Binary;
  document_no: String;
  recipients: many String;
  channel: String;
  isSignRequired: Boolean;
  @nullable placeholders: many String;
  //recipients: Association to many Recipient on recipients.message=$self; 
}

entity Recipient {
  key ID: UUID;
  firstName: String(50);
  lastName: String(50);
  message: Association to Messages;
  channel: String; // WhatsApp, SMS, Email, etc.
  contact: String;
  email: String;
  status: String; // Sent, Failed, Pending, etc.
}
