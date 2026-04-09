# Client Dashboard Components

Premium, luxury monochrome client-facing dashboard for Sumukh Visuals video editing agency. Built with React + Tailwind CSS.

## Overview

The client dashboard is a read-only interface designed for clients to view their project status, pending actions, billing information, and delivery details. The design is minimal, cinematic, and uses a strict monochrome color palette for a premium look.

## Features

✅ **Luxury Dark Theme** - Pure monochrome (#000000, #131313, #f5f5f5)
✅ **Zero-Friction Status** - Clients understand project status in under 5 seconds
✅ **Read-Only Interface** - Clients cannot edit projects or billing
✅ **Responsive Design** - Works on mobile, tablet, and desktop
✅ **Premium UX** - Smooth animations, clear hierarchy, generous spacing
✅ **Action Alerts** - Prominent display of pending actions
✅ **Visual Progress** - Progress bars for projects and payments
✅ **Quick Contact** - WhatsApp and email contact options

## Components

### 1. **ClientNavbar**
Navigation bar with logo, menu items, and user profile dropdown.

```jsx
import ClientNavbar from './components/ClientNavbar';

<ClientNavbar
  clientName="Alex Studios"
  clientAvatar="https://..."
  onLogout={() => handleLogout()}
/>
```

**Features:**
- Fixed header with logo
- Navigation links (Dashboard, Projects, Billing)
- User profile dropdown with logout
- Mobile responsive

### 2. **ClientComponents** (Component Library)

#### OverviewCard
Stat/metric cards for dashboard overview.

```jsx
import { OverviewCard } from './components/ClientComponents';

<OverviewCard
  label="Active Projects"
  value={3}
  subtext="In progress"
  icon={ProjectIcon}
/>
```

#### ProjectCard
Card display for individual projects (read-only).

```jsx
<ProjectCard
  projectName="Summer Campaign Reel"
  type="Reel"
  packageType="Advance"
  status="In Progress"
  progress={60}
  deadline="2026-04-15"
  pendingAction="Client review needed"
  completedReels={3}
  totalReels={5}
  onClick={() => navigateToProject()}
/>
```

#### PendingActionAlert
Prominent alert for actions requiring client attention.

```jsx
<PendingActionAlert
  title="Summer Campaign Reel"
  message="Client review of first draft is pending"
  actionLabel="View Project"
  onAction={() => navigateToProject()}
  priority="high"
/>
```

#### BillingCycleCard
Shows payment progress and project billing information.

```jsx
<BillingCycleCard
  packageName="Advance Package"
  totalAmount={10000}
  paidAmount={5000}
  amountRemaining={5000}
  completedReels={3}
  totalReels={5}
  nextPaymentDue="2026-04-10"
/>
```

#### InstructionsCard
Displays client instructions, delivery time, and contact options.

```jsx
<InstructionsCard
  deliveryTime="3-5 business days"
  clientInstructions="Focus on vibrant colors and upbeat music"
  adminContact="support@sumukhvisuals.com"
  whatsappNumber="+91 9876543210"
/>
```

#### Other Components
- `StatusBadge` - Displays project status
- `EmptyState` - Shows when no data exists
- `LoadingSpinner` - Loading indicator

### 3. **ClientDashboard**
Main dashboard page showing all overview cards, projects, and billing.

```jsx
import ClientDashboard from './pages/ClientDashboard';

<ClientDashboard
  clientData={{
    name: 'Alex Studios',
    avatar: 'https://...',
  }}
  projectsData={projects}
  billingData={billing}
  isLoading={false}
  onLogout={() => handleLogout()}
/>
```

**Sections:**
1. Welcome message with summary
2. Overview cards (Active Projects, Pending Actions, Next Deadline, Amount Remaining)
3. Pending action alerts
4. Active projects grid
5. Billing & payments
6. Project details & instructions
7. Quick contact section

### 4. **ClientProjectDetail**
Detailed view of a single project with full progress, timeline, and delivery information.

```jsx
import ClientProjectDetail from './pages/ClientProjectDetail';

<ClientProjectDetail
  clientData={clientData}
  projectData={selectedProject}
  onLogout={() => handleLogout()}
/>
```

**Sections:**
1. Project header with status badges
2. Project progress timeline
3. Payment progress
4. Project links (draft and final delivery)
5. Key information sidebar
6. Instructions and contact

## Data Structure

### Project Object
```javascript
{
  id: '1',
  projectName: 'Summer Campaign Reel',
  projectType: 'Reel', // Reel, YouTube, TikTok, etc.
  packageType: 'Advance', // Basic, Standard, Advance, Premium
  deadline: '2026-04-15',
  status: 'In Progress', // Planning, In Progress, First Draft Ready, In Revision, Completed, On Hold
  completedReels: 3,
  totalReels: 5,
  paidAmount: 5000,
  totalAmount: 10000,
  remainingAmount: 5000,
  pendingAction: 'Client review of first draft',
  deliveryTime: '3-5 business days',
  clientInstructions: 'Focus on vibrant colors...',
  draftLink: 'https://drive.google.com/...',
  finalDeliveryLink: 'https://drive.google.com/...',
}
```

### Billing Object
```javascript
{
  id: '1',
  projectId: '1',
  packageName: 'Summer Campaign Reel - Advance',
  totalAmount: 10000,
  paidAmount: 5000,
  remainingAmount: 5000,
  completedReels: 3,
  totalReels: 5,
  nextPaymentDue: '2026-04-10',
}
```

## Color Palette

**Dark Colors:**
- `#000000` - Pure black (navbar, background)
- `#131313` - Primary dark (cards)
- `#0a0a0a` - Darker (nested elements)
- `#1a1a1a` - Subtle dark

**Light Colors:**
- `#ffffff` - Pure white (text)
- `#f9f9f9` - Off white
- `#f5f5f5` - Light gray (backgrounds)

**Accent Grays:**
- `#8b8b8b` - Medium gray
- `gray-300-700` - Tailwind gray scale

## Integration with App

### Example App.jsx Setup

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClientDashboard from './pages/ClientDashboard';
import ClientProjectDetail from './pages/ClientProjectDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/client/dashboard" element={<ClientDashboard projectsData={projects} billingData={billing} />} />
        <Route path="/client/project/:projectId" element={<ClientProjectDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## Responsive Breakpoints

- **Mobile**: 1 column, full-width cards
- **Tablet** (md): 2 columns, optimized spacing
- **Desktop** (lg): 3-4 columns, full layout

## Customization

### Changing Contact Information
Update the WhatsApp number and email in `InstructionsCard`:

```jsx
<InstructionsCard
  whatsappNumber="+91 YOUR_NUMBER"
  adminContact="your@email.com"
/>
```

### Styling
All components use Tailwind CSS with inline `backgroundColor` for the dark #131313 color. To customize:

1. Override `backgroundColor: '#131313'` style
2. Modify Tailwind classes in component
3. Update color palette in global CSS

### Mock Data
Use `mockClientData.js` for testing:

```jsx
import { mockClientData, mockProjects, mockBillingData } from './data/mockClientData';

<ClientDashboard
  clientData={mockClientData}
  projectsData={mockProjects}
  billingData={mockBillingData}
/>
```

## Performance Tips

1. **Lazy load** project details when clicked
2. **Memoize** ProjectCard components if rendering large lists
3. **Use image optimization** for avatars
4. **Implement virtualization** for 50+ projects

## Accessibility

- ✅ Semantic HTML structure
- ✅ ARIA labels for icons
- ✅ Keyboard navigation support
- ✅ High contrast text (white on dark)
- ✅ Clear focus states

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## File Structure

```
visualsFrontend/src/
├── components/
│   ├── ClientNavbar.jsx          # Navigation component
│   └── ClientComponents.jsx      # Reusable component library
├── pages/
│   ├── ClientDashboard.jsx       # Main dashboard page
│   └── ClientProjectDetail.jsx   # Project detail page
├── data/
│   └── mockClientData.js         # Mock data for testing
└── ...
```

## Notes

- All components are **read-only** - clients cannot edit project data
- Components automatically calculate progress percentages and days remaining
- Status badges change styling based on project status
- Responsive design tested on all major devices
- Uses Tailwind CSS utility classes (no external CSS files needed)
- Dark theme optimized for extended viewing (reduces eye strain)

## Future Enhancements

- [ ] Real-time notifications for project updates
- [ ] Download/export project summary
- [ ] Project timeline visualization
- [ ] Chat/messaging with admin team
- [ ] Invoice download
- [ ] Mobile app version
- [ ] Dark/light theme toggle (currently dark only)
