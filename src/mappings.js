export const common = [
  'blocks',
  'classification',
  'component',
  'count',
  'creator',
  'deadline',
  'groups',
  'id',
  'keywords',
  'platform',
  'priority',
  'product',
  'resolution',
  'status',
  'summary',
  'text',
  'url',
  'version',
  'whiteboard',
  'tags',
  'duplicates',
];

export const mappings = {
  actualTime: 'actual_time',
  aliases: 'alias',
  apiKey: 'api_key',
  assignedTo: 'assigned_to_detail',
  attachmentId: 'attachment_id',
  bugId: 'bug_id',
  created: 'creation_time',
  dependsOn: 'depends_on',
  duplicateOf: 'dupe_of',
  estimatedTime: 'estimated_time',
  isCcAccessible: 'is_cc_accessible',
  isConfirmed: 'is_confirmed',
  isOpen: 'is_open',
  isCreatorAccessible: 'is_creator_accessible',
  lastChanged: 'last_change_time',
  operatingSystem: 'op_sys',
  remainingTime: 'remaining_time',
  seeAlso: 'see_also',
  targetMilestone: 'target_milestone',
  assignedTos: 'assigned_to',
  components: 'component',
  createdAtOrAfter: 'creation_time',
  creators: 'creator',
  ids: 'id',
  isPrivate: 'is_private',
  modifiedAtOrAfter: 'last_change_time',
  minimumCommentCounts: 'longdescs.count',
  operatingSystems: 'op_sys',
  platforms: 'platform',
  priorities: 'priority',
  products: 'product',
  resolutions: 'resolution',
  severities: 'severity',
  statuses: 'status',
  summaries: 'summary',
  targetMilestones: 'target_milestone',
  qaContacts: 'qa_contact',
  urls: 'url',
  versions: 'version',
  whiteboards: 'whiteboard',
};

export const fieldsToIncludeFields = fields => {
  const inputMappings = Object.keys(mappings);

  return fields
    .map(field => {
      if (common.includes(field)) {
        return field;
      } else if (inputMappings.includes(field)) {
        return mappings[field];
      }

      return undefined;
    })
    .filter(Boolean);
};

export const searchToQuery = args => {
  const inputMappings = Object.keys(mappings);

  return Object.entries(args).reduce((query, [key, value]) => {
    if (!value) {
      return query;
    }

    const queryKey = common.includes(key)
      ? key
      : inputMappings.includes(key) ? mappings[key] : key;

    Object.assign(query, {
      [queryKey]: Array.isArray(value)
        ? [...(query[queryKey] || []), ...value]
        : value,
    });

    return query;
  }, {});
};
