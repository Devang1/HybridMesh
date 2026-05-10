import * as Contacts from "expo-contacts";
import { Contact } from "@/types/domain";
import { createId } from "@/utils/id";

const registeredDirectory = new Map([
  ["919876543210", { userId: "u2", name: "Rescue Lead" }],
  ["919000011111", { userId: "u3", name: "Medical Tent" }],
  ["919123456789", { userId: "u5", name: "Asha Verma" }]
]);

export function normalizePhoneNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits.replace(/^0+/, "");
}

export async function syncDeviceContacts(): Promise<Contact[]> {
  const permission = await Contacts.requestPermissionsAsync();
  if (!permission.granted) return [];

  const result = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Image],
    sort: Contacts.SortTypes.FirstName
  });

  return result.data
    .filter((contact) => contact.phoneNumbers?.length)
    .map((contact) => {
      const phoneNumbers = contact.phoneNumbers?.map((phone) => phone.number ?? "").filter(Boolean) ?? [];
      const normalizedPhones = phoneNumbers.map(normalizePhoneNumber);
      const registered = normalizedPhones.map((phone) => registeredDirectory.get(phone)).find(Boolean);
      return {
        id: contact.id ?? createId("contact"),
        name: registered?.name ?? contact.name ?? "Unknown contact",
        phoneNumbers,
        normalizedPhones,
        avatarUrl: contact.imageAvailable ? contact.image?.uri : undefined,
        isRegistered: Boolean(registered),
        userId: registered?.userId,
        presence: registered ? "online" : "offline",
        lastSeen: new Date().toISOString()
      } satisfies Contact;
    });
}
