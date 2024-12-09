export function parseFilterParams(query, userId) {
  const filter = { userId };

  if (query.contactType) {
    filter.contactType = query.contactType;
  }
  if (query.name) {
    filter.name = { $regex: query.name, $options: 'i' };
  }
  if (query.phoneNumber) {
    filter.phoneNumber = query.phoneNumber;
  }

  return filter;
}
