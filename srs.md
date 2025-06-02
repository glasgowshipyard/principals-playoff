# Software Requirements Specification: Principals Playoff

## 1. Introduction

### 1.1 Purpose
This document specifies the functional and non-functional requirements for Principals Playoff, a web application that helps users discover their core guiding principles through tournament-style elimination.

### 1.2 Scope
- Single-page web application (SPA)
- Client-side only processing (no backend data storage)
- Whitelabel capability for organizational deployment
- PDF export functionality with branding
- Privacy-first design with no user tracking
- Cross-platform compatibility (desktop, tablet, mobile)

### 1.3 Definitions
- **Principle**: A fundamental truth or proposition that serves as a guide for behavior
- **Tournament Bracket**: Single-elimination competition format familiar from sports
- **Whitelabeling**: Customization with organization's branding and context
- **Organizational Alignment**: Analysis comparing personal principles with organization's stated values

## 2. Functional Requirements

### 2.1 Application Setup and Configuration (FR-001)

**2.1.1 Branding Configuration**
- **FR-001.1**: User shall be able to upload organization logo (PNG, JPG, SVG formats, max 2MB)
- **FR-001.2**: User shall be able to set primary brand color via color picker or hex input
- **FR-001.3**: User shall be able to set secondary brand color via color picker or hex input
- **FR-001.4**: User shall be able to enter organization name (max 100 characters)
- **FR-001.5**: System shall validate image formats and file sizes before acceptance
- **FR-001.6**: System shall provide sensible defaults for users who skip branding setup

**2.1.2 Organizational Context**
- **FR-001.7**: User shall be able to input up to 10 organizational principles
- **FR-001.8**: User shall be able to add organizational context description (max 500 characters)
- **FR-001.9**: Organizational principles shall remain hidden from user during principle selection
- **FR-001.10**: All configuration data shall be stored in browser session only

### 2.2 Principle Selection (FR-002)

**2.2.1 Predefined Principles**
- **FR-002.1**: System shall present 30 predefined principles organized into 6 categories:
  - Achievement/Mastery (5 principles)
  - Autonomy (5 principles)
  - Security (5 principles)
  - Service/Contribution (5 principles)
  - Relationships/Connection (5 principles)
  - Health/Vitality (5 principles)
- **FR-002.2**: Each principle shall include title and brief description (max 100 characters)
- **FR-002.3**: Principles shall be displayed with category headers for organization
- **FR-002.4**: User shall be able to select/deselect principles via checkbox interface

**2.2.2 Custom Principles**
- **FR-002.5**: User shall be able to add custom principles under any category
- **FR-002.6**: Custom principle titles shall be limited to 50 characters
- **FR-002.7**: Custom principle descriptions shall be limited to 100 characters
- **FR-002.8**: System shall validate custom principles are not duplicates of existing ones
- **FR-002.9**: System shall provide guidance on principle vs outcome formatting

**2.2.3 Selection Validation**
- **FR-002.10**: User must select exactly 16 principles to proceed to tournament
- **FR-002.11**: System shall display selection counter (X of 16 selected)
- **FR-002.12**: System shall disable tournament button until exactly 16 principles selected
- **FR-002.13**: System shall allow user to modify selection before proceeding

### 2.3 Tournament Bracket (FR-003)

**2.3.1 Bracket Generation**
- **FR-003.1**: System shall generate single-elimination tournament bracket from 16 selected principles
- **FR-003.2**: System shall randomize principle seeding to avoid position bias
- **FR-003.3**: System shall create 4 rounds: Round of 16, Quarterfinals, Semifinals, Finals
- **FR-003.4**: System shall display complete bracket structure to user

**2.3.2 Tournament Progression**
- **FR-003.5**: User shall choose between two principles in each matchup
- **FR-003.6**: System shall advance winner to next round automatically
- **FR-003.7**: System shall track complete elimination path for each principle
- **FR-003.8**: System shall maintain bracket state throughout session
- **FR-003.9**: System shall display visual progress indicator showing current round
- **FR-003.10**: Eliminated principles shall remain visible but clearly marked as eliminated

**2.3.3 User Interface**
- **FR-003.11**: Each matchup shall present two principles with descriptions
- **FR-003.12**: User shall be able to select winner via click/tap interface
- **FR-003.13**: System shall provide clear visual feedback for selections
- **FR-003.14**: User shall be able to navigate back to review previous choices (read-only)
- **FR-003.15**: Tournament shall continue until single winner emerges

### 2.4 Results and Analysis (FR-004)

**2.4.1 Personal Results**
- **FR-004.1**: System shall display complete principle hierarchy (1st through 16th place)
- **FR-004.2**: System shall generate personal profile analysis based on results including:
  - Top 5 principles summary
  - Decision-making style implications
  - Potential internal conflicts between selected principles
  - Recommended areas for reflection
- **FR-004.3**: System shall categorize user's principle profile (e.g., "Achievement-Focused," "Relationship-Centered")
- **FR-004.4**: System shall provide actionable insights for personal development

**2.4.2 Organizational Alignment Analysis**
- **FR-004.5**: If organizational context provided, system shall display alignment analysis ONLY after personal results shown
- **FR-004.6**: Alignment analysis shall include:
  - Direct matches between personal and organizational principles
  - Potential friction points and conflicts
  - Strategies for navigating differences
  - Discussion questions for team/leadership conversations
- **FR-004.7**: System shall calculate and display alignment percentage
- **FR-004.8**: System shall provide specific recommendations for organizational integration

**2.4.3 Principle Evolution Guidance**
- **FR-004.9**: System shall include guidance that principles evolve over time
- **FR-004.10**: System shall suggest reassessment intervals (annual, after major life events)
- **FR-004.11**: System shall provide context on how life circumstances influence principle priorities

### 2.5 Export and Sharing (FR-005)

**2.5.1 PDF Generation**
- **FR-005.1**: System shall generate comprehensive PDF report containing:
  - Complete principle hierarchy
  - Personal profile analysis
  - Organizational alignment analysis (if applicable)
  - Organizational branding (if configured)
- **FR-005.2**: PDF shall be professionally formatted and print-ready
- **FR-005.3**: PDF generation shall complete within 10 seconds
- **FR-005.4**: PDF shall include generation timestamp and version info

**2.5.2 Sharing Options**
- **FR-005.5**: System shall generate shareable URL with results encoded in parameters
- **FR-005.6**: Shared URLs shall work without requiring original session data
- **FR-005.7**: User shall be able to download PDF to local device
- **FR-005.8**: System shall provide option to restart assessment with same configuration

## 3. Non-Functional Requirements

### 3.1 Performance (NFR-001)
- **NFR-001.1**: Application initial load shall complete within 3 seconds on standard broadband (10 Mbps)
- **NFR-001.2**: Bracket interactions shall respond within 200ms
- **NFR-001.3**: PDF generation shall complete within 10 seconds for standard reports
- **NFR-001.4**: Application shall function offline after initial load
- **NFR-001.5**: Application shall support concurrent usage by 10,000+ users

### 3.2 Usability (NFR-002)
- **NFR-002.1**: Application shall be fully responsive across desktop (1920x1080), tablet (768x1024), and mobile (375x667) viewports
- **NFR-002.2**: Tournament bracket interface shall be immediately recognizable to users familiar with sports tournaments
- **NFR-002.3**: Application shall require no user manual or instructions beyond interface labels
- **NFR-002.4**: Application shall be accessible to screen readers (WCAG 2.1 AA compliance)
- **NFR-002.5**: Application shall support keyboard navigation throughout
- **NFR-002.6**: Application shall accommodate color-blind users with non-color-dependent interfaces

### 3.3 Privacy and Security (NFR-003)
- **NFR-003.1**: No user data shall be transmitted to servers during normal operation
- **NFR-003.2**: No tracking cookies, analytics, or third-party scripts shall be implemented
- **NFR-003.3**: All processing shall occur client-side only
- **NFR-003.4**: User data shall be purged from browser memory on tab/window close
- **NFR-003.5**: Application shall be GDPR compliant by design (no data collection)
- **NFR-003.6**: Shareable URLs shall not contain personally identifiable information

### 3.4 Compatibility (NFR-004)
- **NFR-004.1**: Application shall support modern browsers:
  - Chrome 90+
  - Firefox 88+
  - Safari 14+
  - Edge 90+
- **NFR-004.2**: Application shall support mobile browsers:
  - iOS Safari 14+
  - Android Chrome 90+
- **NFR-004.3**: PDF export shall function correctly across all supported browsers
- **NFR-004.4**: Application shall gracefully degrade on unsupported browsers with clear messaging

### 3.5 Maintainability (NFR-005)
- **NFR-005.1**: Code shall be modular with clear separation of concerns
- **NFR-005.2**: Components shall be reusable and independently testable
- **NFR-005.3**: Application shall include comprehensive error handling and user feedback
- **NFR-005.4**: Principles data shall be easily updatable without code changes
- **NFR-005.5**: Whitelabel configuration shall be externally configurable

## 4. Technical Constraints

### 4.1 Architecture Constraints
- **TC-001**: Static site deployment only (no backend servers)
- **TC-002**: Client-side state management exclusively
- **TC-003**: No database or persistent storage requirements
- **TC-004**: Progressive Web App (PWA) capabilities preferred
- **TC-005**: Mobile-first responsive design approach

### 4.2 Technology Constraints
- **TC-006**: React 18+ for UI framework
- **TC-007**: Modern JavaScript (ES2020+) features
- **TC-008**: CSS Grid/Flexbox for layout (no CSS frameworks required)
- **TC-009**: jsPDF or similar for client-side PDF generation
- **TC-010**: Web API compatibility for file handling and downloads

### 4.3 Deployment Constraints
- **TC-011**: Cloudflare Pages or similar static hosting platform
- **TC-012**: CDN distribution for global performance
- **TC-013**: HTTPS required for all deployments
- **TC-014**: Domain customization support for whitelabel deployments

## 5. Data Requirements

### 5.1 Principle Data Structure
```javascript
interface Principle {
  id: string;                    // Unique identifier
  category: string;              // One of 6 predefined categories
  title: string;                 // Display name (max 50 chars)
  description: string;           // Brief explanation (max 100 chars)
  isCustom: boolean;            // User-generated vs predefined
  customCategory?: string;       // For custom principles
}
```

### 5.2 Configuration Data Structure
```javascript
interface Configuration {
  branding: {
    logo: File | null;           // Uploaded image file
    logoUrl?: string;            // Data URL for display
    primaryColor: string;        // Hex color code
    secondaryColor: string;      // Hex color code  
    orgName: string;            // Organization name
  };
  orgPrinciples: string[];       // Array of org principle titles
  orgContext: string;            // Organizational description
  timestamp: number;             // Configuration creation time
}
```

### 5.3 Bracket State Structure
```javascript
interface BracketState {
  rounds: Round[];              // Array of tournament rounds
  currentRound: number;         // Active round index
  currentMatchup: number;       // Active matchup index
  winners: Principle[];         // Advancing principles by round
  eliminated: Principle[];      // Eliminated principles with round info
  isComplete: boolean;          // Tournament completion status
  finalRanking: Principle[];    // Complete 1-16 ranking
}

interface Round {
  name: string;                 // "Round of 16", "Quarterfinals", etc.
  matchups: Matchup[];         // Array of head-to-head matchups
  isComplete: boolean;         // Round completion status
}

interface Matchup {
  id: string;                  // Unique matchup identifier
  principle1: Principle;       // First competing principle
  principle2: Principle;       // Second competing principle
  winner?: Principle;          // Selected winner
  isComplete: boolean;         // Matchup completion status
}
```

### 5.4 Results Data Structure
```javascript
interface Results {
  personalHierarchy: Principle[];     // 1-16 ranking
  profile: {
    primaryCategory: string;          // Dominant category
    style: string;                    // Decision-making style
    strengths: string[];              // Key characteristics
    tensions: string[];               // Potential conflicts
    recommendations: string[];        // Development suggestions
  };
  organizationalAlignment?: {
    matches: string[];                // Direct principle matches
    conflicts: string[];              // Potential friction points
    strategies: string[];             // Navigation recommendations
    alignmentScore: number;           // 0-100 percentage
    discussionPoints: string[];       // Team conversation starters
  };
  metadata: {
    completionTime: number;           // Duration in milliseconds
    timestamp: number;                // Completion timestamp
    version: string;                  // Application version
  };
}
```

## 6. Interface Requirements

### 6.1 User Interface Components

**6.1.1 Setup Page**
- Logo upload with drag-drop and file picker
- Color picker with hex input validation
- Text inputs for organization name and context
- Preview of branding application
- Progress indicator and navigation controls

**6.1.2 Principle Selection Page**
- Six category sections with principle checkboxes
- Principle descriptions on hover/tap
- Custom principle addition modal
- Selection counter with visual progress
- Category filtering and search functionality

**6.1.3 Tournament Bracket Page**
- Visual bracket display with round progression
- Matchup cards with principle details
- Winner selection interface
- Progress tracking and round indicators
- Navigation to review completed matchups

**6.1.4 Results Page**
- Hierarchical principle display (1-16 ranking)
- Profile analysis with visual elements
- Organizational alignment section (if applicable)
- Export controls for PDF and sharing
- Options to restart or modify assessment

### 6.2 Visual Design Requirements

**6.2.1 Design System**
- Consistent color palette with primary/secondary brand colors
- Typography hierarchy for readability across devices
- Icon system for navigation and status indicators
- Spacing and layout grid for visual consistency
- Interactive states for all clickable elements

**6.2.2 Responsive Behavior**
- Mobile-first design approach
- Flexible bracket visualization across screen sizes
- Touch-friendly interaction targets (min 44px)
- Optimized content hierarchy for small screens
- Horizontal scroll prevention

**6.2.3 Accessibility Features**
- High contrast color combinations (4.5:1 minimum)
- Focus indicators for keyboard navigation
- Screen reader compatible markup and labels
- Alternative text for all images and icons
- Logical tab order throughout application

## 7. Quality Attributes

### 7.1 Reliability
- Application shall recover gracefully from browser refresh
- State persistence during active sessions
- Error boundaries to prevent complete application crashes
- Validation and error messaging for all user inputs

### 7.2 Scalability
- Efficient rendering for large principle sets
- Optimized PDF generation for complex reports
- Minimal memory footprint for mobile devices
- CDN distribution for global performance

### 7.3 Maintainability
- Modular component architecture
- Clear code documentation and comments
- Consistent naming conventions and file structure
- Automated testing coverage for critical paths

## 8. Acceptance Criteria

### 8.1 Functional Acceptance
- All 30 predefined principles display correctly with descriptions
- Tournament bracket advances properly through all rounds
- PDF export generates with correct branding and content
- Organizational alignment analysis appears only after personal results
- Custom principles integrate seamlessly with predefined ones

### 8.2 Performance Acceptance
- Page load time under 3 seconds on 10 Mbps connection
- Bracket interactions respond within 200ms
- PDF generation completes within 10 seconds
- Application functions offline after initial load

### 8.3 Usability Acceptance
- Users complete tournament without external instructions
- Application works identically across supported browsers
- Touch interactions work properly on mobile devices
- Screen reader navigation provides complete functionality

### 8.4 Privacy Acceptance
- No network requests after initial application load
- No data persistence beyond active session
- Shareable URLs contain no personal information
- Application functions with all tracking protection enabled

---

*This specification provides the complete technical foundation for building Principals Playoff as a robust, privacy-first web application that delivers authentic insights into human decision-making priorities.*