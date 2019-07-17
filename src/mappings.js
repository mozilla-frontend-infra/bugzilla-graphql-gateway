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

const advancedQuery = {
  fields: 'f',
  operators: 'o',
  values: 'v',
};
const operatorMappings = {
  IS_EQUAL_TO: 'equals',
  IS_NOT_EQUAL_TO: 'notequals',
  IS_EQUAL_TO_ANY_OF_THE_STRING: 'anyexact',
  CONTAINS_THE_STRING: 'substring',
  CONTAINS_THE_STRING_WITH_EXACT_CASE: 'casesubstring',
  DOES_NOT_CONTAIN_IN_THE_STRING: 'notsubstring',
  CONTAINS_ANY_OF_THE_STRING: 'anywordssubstr',
  CONTAINS_ALL_OF_THE_STRING: 'allwordssubstr',
  CONTAINS_NONE_OF_THE_STRING: 'nowordssubstr',
  MATCHES_REGEX: 'regexp',
  DOES_NOT_MATCH_REGEX: 'notregexp',
  IS_LESS_THAN: 'lessthan',
  IS_LESS_THAN_OR_EQUAL_TO: 'lessthaneq',
  IS_GREATER_THAN: 'greaterthan',
  IS_GREATER_THAN_OR_EQUAL_TO: 'greaterthaneq',
  CONTAINS_ANY_OF_THE_WORDS: 'anywords',
  CONTAINS_ALL_OF_THE_WORDS: 'allwords',
  CONTAINS_NONE_OF_THE_WORDS: 'nowords',
  CHANGED_BEFORE: 'changedbefore',
  CHANGED_AFTER: 'changedafter',
  CHANGED_FROM: 'changedfrom',
  CHANGED_TO: 'changedto',
  CHANGED_BY: 'changedby',
  MATCHES: 'matches',
  DOES_NOT_MATCH: 'notmatches',
  IS_NOT_EMPTY: 'isnotempty',
  IS_EMPTY: 'isempty',
};
const fieldMappings = {
  id: 'bug_id',
  assignedTo: 'assigned_to',
  comment: 'longdesc',
  component: 'component',
  content: 'content',
  created: 'creation_ts',
  keywords: 'keywords',
  lastChanged: 'days_elapsed',
  mentor: 'bug_mentor',
  product: 'product',
  reporter: 'reporter',
  resolution: 'resolution',
  status: 'bug_status',
  summary: 'short_desc',
  tag: 'tags',
  whiteboards: 'status_whiteboard',
};

export const fieldsToIncludeFields = fields => {
  const inputMappings = Object.keys(mappings);

  return fields
    .map(field => {
      // Use array destructuring to put the first item in the array
      // in the lastField variable.
      const [lastField] = field.split('.').slice(-1);

      if (common.includes(lastField)) {
        return lastField;
      } else if (inputMappings.includes(lastField)) {
        return mappings[lastField];
      } else if (field.includes('assignedTo')) {
        return mappings.assignedTos;
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
    } else if (value instanceof Date) {
      // When the Date string is sent to the server, the graphql-iso-date
      // package converts this into a JavaScript Date. When this Date object
      // is eventually passed to the query-string stringify() it isn't converted
      // into an ISO-8601 date string, so here we force all dates to be stored
      // back as an ISO-8601 date string to be sent to Bugzilla in a format it
      // recognizes.
      // eslint-disable-next-line no-param-reassign
      value = value.toISOString();
    }

    if (key in advancedQuery) {
      const advQuery = value.reduce((prev, field, idx) => {
        Object.assign(prev, {
          [`${advancedQuery[key]}${idx + 1}`]:
            key === 'operators'
              ? operatorMappings[field]
              : (key === 'fields' && fieldMappings[field]) || field,
        });

        return prev;
      }, {});

      return { ...query, ...advQuery };
    }

    const queryKey = common.includes(key)
      ? key
      : inputMappings.includes(key)
      ? mappings[key]
      : key;

    Object.assign(query, {
      [queryKey]: Array.isArray(value)
        ? [...(query[queryKey] || []), ...value]
        : value,
    });

    return query;
  }, {});
};
