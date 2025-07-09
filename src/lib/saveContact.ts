import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

interface ContactData {
    name: string;
    email: string;
    phone?: string;
    rawVCard: string;
}

export const saveScannedContact = async (
    userId: string,
    contact: ContactData
) => {
    const contactId = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}`;
    await setDoc(doc(db, "users", userId, "savedContacts", contactId), {
        ...contact,
        createdAt: new Date().toISOString(),
    });
};
