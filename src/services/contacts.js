import { SORT_ORDER } from '../constants/index.js';
import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find({ userId });

  const contactsCount = await ContactsCollection.countDocuments({ userId });

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, page, perPage);
  return { data: contacts, ...paginationData };
};

export const getContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findOne({ _id: contactId, userId });
  return contact;
};

export const createContact = async (payload, userId) => {
  if (!payload.name || !payload.phoneNumber || !payload.contactType) {
    throw new Error(
      "Обов'язкові поля name, phoneNumber та contactType відсутні",
    );
  }

  payload.userId = userId;
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const updateContact = async (
  contactId,
  userId,
  payload,
  options = {},
) => {
  const contactIdStr = String(contactId);
  const userIdStr = String(userId);

  if (
    !contactIdStr.match(/^[0-9a-fA-F]{24}$/) ||
    !userIdStr.match(/^[0-9a-fA-F]{24}$/)
  ) {
    throw new Error('Invalid ID format');
  }

  const result = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
      ...options,
    },
  );

  if (!result) {
    return null;
  }

  return {
    contact: result,
  };
};

export const deleteContact = async (contactId, userId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return contact;
};
