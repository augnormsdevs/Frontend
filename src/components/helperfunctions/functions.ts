import { AES, enc } from "crypto-ts";

// const key = "snipersnevermisstheirtarget";
const key = "snipersnevermisstheirtarget";

// encryption
export function Encrypt(text: string | string[]) {
  const encryptedText = AES.encrypt(text as string, key).toString();

  // Replace '/' with another character (e.g., '-')
  const sanitizedText = encryptedText.replace(/\//g, "-");
  return sanitizedText;
}

// decryption
export function Decrypt(text: string | string[]) {
  // Replace the character back to '/'
  const sanitizedText = (text as string).replace(/-/g, "/");
  return AES.decrypt(sanitizedText, key).toString(enc.Utf8);
}

export function getInitials(name?: string): string {
  // Check if name is undefined or null
  if (name == null) {
    return "";
  }

  // Split the name into words
  const words = name.split(" ");

  // Extract the first character from each word
  const initials = words.map((word) => word.charAt(0).toUpperCase());

  // Join the initials to form the result
  return initials.join("");
}

export function formatDate(dateString:string) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); 
  const year = date.getFullYear().toString();
  return `${day}-${month}-${year}`;
}



