# Admin Panel Documentation

## Overview

The admin panel is a premium, minimal client portal management system built with React and Tailwind CSS. It features a luxury dark monochrome design and allows admins/editors to manage client projects, track progress, handle payments, and communicate with clients.

## Architecture

```
admin/src/
├── App.jsx                          # Main app with auth flow
├── pages/
│   ├── Admin.jsx                    # Main admin layout wrapper
│   ├── Dashboard.jsx                # Dashboard with overview stats
│   ├── ProjectsList.jsx             # Projects table with search/filter
│   └── ProjectForm.jsx              # Add/Edit project form
├── components/
│   ├── StatCard.jsx                 # Stats card component
│   ├── ProjectTable.jsx             # Reusable projects table
│   ├── UIComponents.jsx             # Button, FormInput, FormSelect, etc.
│   ├── Navbar.jsx                   # Top navigation (existing)
│   ├── Sidebar.jsx                  # Sidebar navigation (existing)
│   └── ... (other existing components)
├── context/
│   ├── ProjectContext.jsx           # Project state management
│   └── NotificationContext.jsx      # Notifications (existing)
└── index.css                        # Global dark theme styles

tailwind.config.js                       # Tailwind configuration
index.html                               # Entry point
```

## Color Palette

**Dark Theme (Monochrome Luxury):**
- `#000000` - Pure black
- `#0a0a0a` - Almost black
- `#0b0b0b` - Almost black
- `#131313` - Deep dark
- `#1a1a1a` - Dark (used for cards)
- `#ffffff` - Pure white (text)
- `#f9f9f9` - Off-white
- `#f5f5f5` - Light gray

Tailwind classes used:
- `bg-gray-900` - Page background (#111111)
- `bg-gray-800` - Card backgrounds (#1a1a1a)
- `bg-black` - Sidebar (#000000)
- `text-white` - Main text
- `text-gray-300` - Secondary text
- `text-gray-400` - Tertiary text
- `border-gray-700` - Borders

## Pages

### 1. **Dashboard** (`/`)
- Overview statistics with 4 main stat cards:
  - Total Clients
  - Active Projects
  - Pending Approvals
  - Delivered Projects
- Revenue statistics
- Recent projects preview
- Quick navigation to create projects

### 2. **Projects List** (`/projects`)
- Table view of all projects
- **Search** by project name or client name
- **Filter** by status (Not Started, In Progress, First Draft Ready, etc.)
- Edit/Delete actions from the table
- Quick access to create new projects

### 3. **Add/Edit Project Form** (`/projects/new` and `/projects/:id/edit`)

**Sections:**

#### Client Information
- Client Name (required)
- Project Name (required)

#### Project Details
- Project Type (required) - Reel, YouTube, Ad, Montage
- Package Type (required) - Basic, Advance, Montage, Custom
- Deadline (required) - Date picker
- Status - Not Started, In Progress, First Draft Ready, Revision Phase, Delivered

#### Reel Cycle Progress
- Completed Reels - Number input
- Total Reels in Cycle - Number input
- Visual progress bar showing % complete

#### Payment Information
- Paid Amount (₹) - Number input
- Remaining Amount (₹) - Number input
- Automatic calculation of payment status

#### Actions & Communication
- Pending Action Text - Textarea for actions like "Client review", "Payment pending", etc.
- Delivery Time - Text field (e.g., "3-5 business days")
- Client Instructions - Rich textarea visible to client

#### Additional Information
- Admin Notes - Internal notes (not visible to client)
- Project Links - URLs for references/assets

## Data Schema

Each project object contains:

```javascript
{
  id: String,
  clientName: String,
  projectName: String,
  projectType: String,        // Reel | YouTube | Ad | Montage
  packageType: String,        // Basic | Advance | Montage | Custom
  deadline: String,           // ISO date
  status: String,             // Not Started | In Progress | First Draft Ready | Revision Phase | Delivered
  completedReels: Number,
  totalReels: Number,
  paidAmount: Number,
  remainingAmount: Number,
  pendingAction: String,
  deliveryTime: String,
  clientInstructions: String,
  note: String,
  projectLinks: String,
}
```

## Components Reference

### Reusable Components (UIComponents.jsx)

```jsx
// Button with variants: primary | secondary | danger | ghost
<Button variant="primary" size="lg">Save</Button>

// Form inputs
<FormInput label="Name" placeholder="..." value={} onChange={} required />
<FormTextarea label="Instructions" rows={5} {...} />
<FormSelect label="Status" options={[...]} {...} />

// Badge for status/type display
<Badge variant="success">Delivered</Badge>

// Card wrapper for grouped content
<Card className="">Content here</Card>
```

### StatCard
```jsx
<StatCard 
  label="Active Projects"
  value={5}
  icon="⚙️"
  trend={{ positive: true, text: 'In progress' }}
/>
```

### ProjectTable
```jsx
<ProjectTable 
  projects={projects}
  onEdit={(id) => {...}}
  onDelete={(id) => {...}}
/>
```

## State Management

Uses React Context API (ProjectContext.jsx) for project data management:

```javascript
// Context methods:
- projects              // Array of all projects
- addProject(data)      // Create new project
- updateProject(id, data) // Update existing project
- deleteProject(id)     // Delete project
- getProject(id)        // Get single project
```

## Styling Guidelines

- **No bright colors** - Stick to the monochrome palette
- **No heavy gradients** - Use flat colors with subtle borders
- **Rounded corners** - Use `rounded-lg` for most elements
- **Spacing** - Use Tailwind's spacing scale (p-6, mb-8, etc.)
- **Typography** - Use `font-light` for premium feel, `font-medium` for emphasis
- **Borders** - Use `border-gray-700` for most borders
- **Hover states** - Use `hover:border-gray-600` or `hover:bg-gray-750`

## Authentication

- Uses existing Login component
- Token stored in localStorage
- Routes protected by token check in App.jsx

## Building & Running

```bash
# Development
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## Integration Notes

When connecting to backend:
1. Replace mock data in `ProjectContext.jsx` with API calls
2. Update `addProject`, `updateProject`, `deleteProject` methods with API endpoints
3. Add error handling and loading states
4. Implement real authentication with JWT or similar

## Future Enhancements

- Real-time notifications
- File upload for project assets
- Client communication/messaging
- Advanced analytics
- Bulk project operations
- Email notifications
- Integration with payment systems
