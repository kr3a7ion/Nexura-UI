export type GuestCareQueueItem = {
  id: string;
  type: "Message" | "Complaint";
  branch: "Abuja" | "Lagos";
  guest: string;
  room: string;
  subject: string;
  department: string;
  age: string;
  severity: "Critical" | "High" | "Normal";
  status: "Unread" | "Assigned" | "In progress" | "Waiting guest";
};

export type CommunicationsException = {
  id: string;
  title: string;
  detail: string;
  severity: "Critical" | "Warning" | "Info";
  screen: "guest-messaging" | "complaint-management" | "shift-handover";
  screenLabel: string;
};

export const COMMUNICATIONS_KPIS = [
  { label: "Unread guest messages", value: "9", sub: "6 Abuja · 3 Lagos", delta: "2 urgent", deltaPositive: false },
  { label: "Open complaints", value: "14", sub: "3 high severity", delta: "-4 today", deltaPositive: true },
  { label: "Average response time", value: "6m 42s", sub: "Target under 10 minutes", delta: "-1m 18s", deltaPositive: true },
  { label: "Pending handover items", value: "7", sub: "3 require acknowledgement", delta: "Shift ends 15:00", deltaPositive: false },
] as const;

export const GUEST_CARE_QUEUE: GuestCareQueueItem[] = [
  { id: "CMP-2608-041", type: "Complaint", branch: "Abuja", guest: "Chinedu Okafor", room: "304", subject: "Airport pickup arrived 35 minutes late", department: "Front Office", age: "28 min", severity: "Critical", status: "In progress" },
  { id: "MSG-2608-188", type: "Message", branch: "Abuja", guest: "Aisha Bello", room: "218", subject: "Requests an extra duvet before 12:30", department: "Housekeeping", age: "17 min", severity: "High", status: "Unread" },
  { id: "CMP-2608-044", type: "Complaint", branch: "Lagos", guest: "Tunde Afolabi", room: "508", subject: "Air conditioner stopped cooling overnight", department: "Maintenance", age: "14 min", severity: "High", status: "Assigned" },
  { id: "MSG-2608-191", type: "Message", branch: "Abuja", guest: "Ngozi Eze", room: "412", subject: "Asks whether breakfast is included", department: "Restaurant", age: "8 min", severity: "Normal", status: "Unread" },
  { id: "CMP-2608-047", type: "Complaint", branch: "Abuja", guest: "Musa Ibrahim", room: "126", subject: "Duplicate minibar charge of ₦18,500", department: "Finance", age: "6 min", severity: "High", status: "Waiting guest" },
  { id: "MSG-2608-194", type: "Message", branch: "Lagos", guest: "Yetunde Balogun", room: "507", subject: "Requests late check-out at 14:00", department: "Front Office", age: "3 min", severity: "Normal", status: "Assigned" },
];

export const COMMUNICATIONS_EXCEPTIONS: CommunicationsException[] = [
  { id: "COM-01", title: "Complaint breaching target response time", detail: "CMP-2608-041 has been open for 28 minutes against a 15-minute target.", severity: "Critical", screen: "complaint-management", screenLabel: "Complaint Management" },
  { id: "COM-02", title: "Guest message unanswered over 15 minutes", detail: "Aisha Bello’s duvet request has remained unread for 17 minutes.", severity: "Warning", screen: "guest-messaging", screenLabel: "Guest Messaging" },
  { id: "COM-03", title: "Handover not signed", detail: "Abuja Front Office morning handover is still unsigned by the incoming supervisor.", severity: "Warning", screen: "shift-handover", screenLabel: "Shift Handover" },
];
