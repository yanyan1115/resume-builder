# Resume Schema

This document defines the target resume data contract for the editor, preview, templates, export, local storage, and backend API.

The current MVP has different resume shapes in the frontend and backend. Stage 2 should converge them into one schema before the editor, template system, and export pipeline are deeply refactored.

## 1. Goals

- Use one canonical resume shape across the whole project.
- Support flexible, repeatable resume sections.
- Keep template rendering independent from editor form details.
- Support local-only editing and authenticated backend persistence.
- Make future AI features operate on structured content instead of raw text blobs.

## 2. Current Field Sources

Current frontend MVP fields include:

- Basic fields: `name`, `gender`, `age`, `birthYear`, `birthMonth`, `email`, `mobile`, `address`
- Job intention: `province`, `city`, `industry`, `job`, `salary`
- Content sections: `advantage`, `skills`, `experience`, `projects`, `education`, `certificates`, `honors`, `organizations`
- Display/export fields: `template`, `currentTheme`, `exportType`

Current backend resume fields include:

- `title`
- `template`
- `personalInfo`
- `experience`
- `education`
- `user`

The target schema below keeps the useful concepts but restructures them for real editing.

## 3. Canonical Resume Object

```js
{
  schemaVersion: 1,
  id: "local-or-database-id",
  ownerId: "database-user-id-or-null",
  title: "Frontend Developer Resume",
  language: "en",
  templateId: "classic",
  themeId: "light",
  basics: {
    name: "",
    headline: "",
    gender: "",
    age: null,
    birthDate: {
      year: null,
      month: null
    },
    email: "",
    phone: "",
    location: "",
    links: [
      {
        id: "link-1",
        label: "GitHub",
        url: ""
      }
    ]
  },
  intention: {
    jobTitle: "",
    industry: "",
    location: {
      province: "",
      city: ""
    },
    salaryRange: {
      min: null,
      max: null,
      currency: "CNY"
    },
    jobStatus: ""
  },
  sections: [
    {
      id: "summary",
      type: "summary",
      title: "Personal Strengths",
      visible: true,
      order: 10,
      content: ""
    },
    {
      id: "skills",
      type: "skills",
      title: "Skills",
      visible: true,
      order: 20,
      items: []
    },
    {
      id: "work",
      type: "experience",
      title: "Work Experience",
      visible: true,
      order: 30,
      items: []
    },
    {
      id: "projects",
      type: "projects",
      title: "Project Experience",
      visible: true,
      order: 40,
      items: []
    },
    {
      id: "education",
      type: "education",
      title: "Education",
      visible: true,
      order: 50,
      items: []
    }
  ],
  settings: {
    exportFileName: "",
    pageSize: "A4",
    updatedAt: "2026-05-17T00:00:00.000Z",
    createdAt: "2026-05-17T00:00:00.000Z"
  }
}
```

## 4. Top-Level Fields

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `schemaVersion` | number | yes | Version used for migrations. Start with `1`. |
| `id` | string | no | Local draft ID or database ID. |
| `ownerId` | string/null | no | Backend user ID when saved by a logged-in user. |
| `title` | string | yes | Human-readable draft name. |
| `language` | string | yes | Display language, such as `en` or `zh-CN`. |
| `templateId` | string | yes | Layout template ID. |
| `themeId` | string | yes | Visual theme ID. |
| `basics` | object | yes | Personal and contact information. |
| `intention` | object | no | Job intention and preference fields. |
| `sections` | array | yes | Ordered resume content sections. |
| `settings` | object | no | Export and metadata settings. |

## 5. Basics

`basics` stores information that usually appears in the resume header.

```js
{
  name: "",
  headline: "",
  gender: "",
  age: null,
  birthDate: {
    year: null,
    month: null
  },
  email: "",
  phone: "",
  location: "",
  links: []
}
```

Notes:

- `headline` can store a short professional label such as `Frontend Developer`.
- `birthDate` replaces separate `birthYear` and `birthMonth`.
- `phone` replaces the current frontend field `mobile`.
- `links` supports GitHub, portfolio, LinkedIn, blog, or custom links.

## 6. Intention

`intention` stores job-search preferences. Templates may choose to render or hide it.

```js
{
  jobTitle: "",
  industry: "",
  location: {
    province: "",
    city: ""
  },
  salaryRange: {
    min: null,
    max: null,
    currency: "CNY"
  },
  jobStatus: ""
}
```

Notes:

- `jobTitle` replaces the current frontend field `job`.
- `salaryRange` replaces the current array field `salary`.
- `location` replaces `province` and `city`.

## 7. Section Model

Every resume section shares a common envelope:

```js
{
  id: "section-id",
  type: "section-type",
  title: "Display Title",
  visible: true,
  order: 10
}
```

Common fields:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | yes | Stable section ID. |
| `type` | string | yes | Section renderer type. |
| `title` | string | yes | Display heading. |
| `visible` | boolean | yes | Whether the section appears in preview/export. |
| `order` | number | yes | Sort order. |

Section-specific fields should be stored as `content` or `items` depending on the section type.

## 8. Section Types

### Summary

Maps from current `advantage`.

```js
{
  id: "summary",
  type: "summary",
  title: "Personal Strengths",
  visible: true,
  order: 10,
  content: ""
}
```

### Skills

Maps from current `skills`. Initial migration can split comma, Chinese comma, semicolon, or newline separated text into items.

```js
{
  id: "skills",
  type: "skills",
  title: "Skills",
  visible: true,
  order: 20,
  items: [
    {
      id: "skill-1",
      name: "JavaScript",
      level: "",
      category: ""
    }
  ]
}
```

### Work Experience

Maps from current `experience`. The MVP text can be stored as one legacy item during migration.

```js
{
  id: "work",
  type: "experience",
  title: "Work Experience",
  visible: true,
  order: 30,
  items: [
    {
      id: "work-1",
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      summary: "",
      highlights: []
    }
  ]
}
```

### Project Experience

Maps from current `projects`.

```js
{
  id: "projects",
  type: "projects",
  title: "Project Experience",
  visible: true,
  order: 40,
  items: [
    {
      id: "project-1",
      name: "",
      role: "",
      startDate: "",
      endDate: "",
      url: "",
      summary: "",
      highlights: [],
      technologies: []
    }
  ]
}
```

### Education

Maps from current `education`.

```js
{
  id: "education",
  type: "education",
  title: "Education",
  visible: true,
  order: 50,
  items: [
    {
      id: "education-1",
      school: "",
      degree: "",
      major: "",
      startDate: "",
      endDate: "",
      summary: "",
      highlights: []
    }
  ]
}
```

### Certificates

Maps from current `certificates`.

```js
{
  id: "certificates",
  type: "certificates",
  title: "Certifications",
  visible: true,
  order: 60,
  items: [
    {
      id: "certificate-1",
      name: "",
      issuer: "",
      date: "",
      url: ""
    }
  ]
}
```

### Awards

Maps from current `honors`.

```js
{
  id: "awards",
  type: "awards",
  title: "Awards and Honors",
  visible: true,
  order: 70,
  items: [
    {
      id: "award-1",
      title: "",
      issuer: "",
      date: "",
      summary: ""
    }
  ]
}
```

### Organizations

Maps from current `organizations`.

```js
{
  id: "organizations",
  type: "organizations",
  title: "Club/Organization Experience",
  visible: true,
  order: 80,
  items: [
    {
      id: "organization-1",
      name: "",
      role: "",
      startDate: "",
      endDate: "",
      summary: "",
      highlights: []
    }
  ]
}
```

### Custom Text

Used for sections that do not fit a predefined type.

```js
{
  id: "custom-1",
  type: "customText",
  title: "Custom Section",
  visible: true,
  order: 90,
  content: ""
}
```

## 9. Migration From MVP Fields

The first implementation should provide a compatibility function:

```js
migrateLegacyResume(legacyResume) => canonicalResume
```

Suggested mapping:

| Current field | Target field |
| --- | --- |
| `name` | `basics.name` |
| `gender` | `basics.gender` |
| `age` | `basics.age` |
| `birthYear` | `basics.birthDate.year` |
| `birthMonth` | `basics.birthDate.month` |
| `email` | `basics.email` |
| `mobile` | `basics.phone` |
| `address` | `basics.location` |
| `province` | `intention.location.province` |
| `city` | `intention.location.city` |
| `industry` | `intention.industry` |
| `job` | `intention.jobTitle` |
| `salary[0]` | `intention.salaryRange.min` |
| `salary[1]` | `intention.salaryRange.max` |
| `jobStatus` | `intention.jobStatus` |
| `advantage` | `sections[type=summary].content` |
| `skills` | `sections[type=skills].items` |
| `experience` | `sections[type=experience].items[0].summary` |
| `projects` | `sections[type=projects].items[0].summary` |
| `education` | `sections[type=education].items[0].summary` |
| `certificates` | `sections[type=certificates].items[0].name` or `summary` fallback |
| `honors` | `sections[type=awards].items[0].summary` |
| `organizations` | `sections[type=organizations].items[0].summary` |
| `template` | `templateId` |
| `currentTheme` | `themeId` |

## 10. Backend Persistence

The backend model should store the canonical schema with backend metadata:

- `user`: authenticated user ID.
- `title`: duplicate top-level title for list views and indexing.
- `resume`: canonical resume object, or direct schema fields if using a full Mongoose subdocument.
- `createdAt` and `updatedAt`: managed by Mongoose timestamps.

For the first refactor, storing the canonical object in a flexible `resume` field is acceptable. Stronger validation can be added once the schema stabilizes.

## 11. Local Storage

Local storage should use a namespaced key:

```text
resume-builder:drafts
resume-builder:active-draft-id
```

The stored draft must include `schemaVersion`. Future migrations should run when loading drafts.

## 12. Template Expectations

Templates should receive only canonical resume data plus template settings.

Templates should not:

- Read from localStorage directly.
- Depend on editor-only field names.
- Mutate the resume object.
- Own export logic.

Templates should:

- Render sections by `type`, `visible`, and `order`.
- Use `title` for section headings.
- Handle empty optional fields gracefully.
- Share print/export styles where possible.

## 13. Export Expectations

Export should consume the canonical schema and selected template.

The export layer should not depend on editor internals. This makes it possible to export from:

- The live editor.
- A saved backend resume.
- A local JSON import.
- A future AI-optimized variant.

## 14. Implementation Order

1. Add schema defaults and migration helpers.
2. Add a resume draft store that owns canonical resume state.
3. Update preview/template components to read canonical data.
4. Update editor fields gradually, starting with basic information.
5. Update backend model and API payloads.
6. Update export code to use canonical preview rendering.

