# 🎮 CDF Tournament Manager - Product Roadmap

## 📌 Version Overview

- **V0 (Current)**: Basic tournament management with manual game assignment
- **V1**: Swiss tournament system foundation
- **V2**: Advanced features & real-time capabilities
- **V3**: Multi-tournament & enterprise features

---

## ✅ V0 - Current Version (Completed)

### Core Features

#### Player Management
- ✅ Player registration with name input
- ✅ QR code generation for each player
- ✅ Player list view with registration timestamps
- ✅ Individual player deletion
- ✅ Bulk player deletion (Clear All)
- ✅ Player export to JSON
- ✅ Automatic player refresh

#### Game Management
- ✅ Manual game creation
- ✅ Drag-and-drop player assignment to games
- ✅ 4-player game support
- ✅ Game capacity indicator (X/4 players)
- ✅ Visual feedback for full games
- ✅ Remove players from games
- ✅ Delete individual games
- ✅ Clear all games
- ✅ Unassigned players tracking
- ✅ Auto-assign games feature (random distribution)

#### Scorecard System
- ✅ Game selection dropdown
- ✅ Score entry table for 4 players
- ✅ Corporation selection (12 corporations available)
- ✅ Corporation uniqueness validation (no duplicates per game)
- ✅ Score categories:
  - NT (Terraforming Rating)
  - Objectifs (Objectives)
  - Récompenses (Rewards)
  - Forêts (Forests)
  - Villes (Cities)
  - Cartes (Cards)
- ✅ Automatic total calculation
- ✅ Automatic ranking calculation (1st-4th)
- ✅ Real-time score updates
- ✅ Save scorecard functionality
- ✅ Number-only input validation

#### Admin Panel
- ✅ Admin authentication (username/password)
- ✅ Tab-based navigation:
  - Players tab
  - Games tab
  - Scorecards tab
- ✅ Scorecard viewing with game details
- ✅ Overall rankings table
- ✅ Rankings export to JSON
- ✅ Delete all scorecards
- ✅ Refresh data functionality

#### UI/UX
- ✅ Responsive design (mobile-friendly)
- ✅ Tailwind CSS styling
- ✅ Gradient purple/violet theme
- ✅ Success/error message notifications
- ✅ Loading states
- ✅ Hover effects and transitions
- ✅ QR code display for scorecard access

#### Technical Stack
- ✅ Vue 3 with Composition API
- ✅ Vite build tool
- ✅ Pinia state management
- ✅ Vue Router
- ✅ LocalStorage for data persistence
- ✅ Tailwind CSS v3
- ✅ GitHub Pages deployment
- ✅ QR code generation library

---

## 🚀 V1 - Swiss Tournament Foundation

**Goal**: Implement core Swiss tournament system with 5-3-2-1 scoring

### Priority Features

#### 1. Swiss Scoring System ⭐ Critical
- [ ] **Placement Points System**
  - 1st place = 5 points
  - 2nd place = 3 points
  - 3rd place = 2 points
  - 4th place = 1 point
- [ ] **Automatic Placement Calculation**
  - Auto-rank players by game score
  - Manual override capability for admins
- [ ] **Tiebreaker System**
  - Sum of all game scores
  - Display format: "15 pts (238)"
- [ ] **Placement History Tracking**
  - Show per-round placements (e.g., "5-5-5")
  - Track opponents per round

#### 2. Tournament Standings & Bracket
- [ ] **Live Standings Display**
  - Real-time ranking updates
  - Placement points column
  - Tiebreaker score column
  - Placement history column (5-3-2-1 sequence)
  - Visual indicators for qualified players
- [ ] **Sorting & Filtering**
  - Primary sort: Placement points (desc)
  - Secondary sort: Tiebreaker score (desc)
  - Filter by qualification status

#### 3. Phase Management System
- [ ] **Phase 1: Qualification (108 players)**
  - 3 rounds
  - Top 32 advance
  - Phase completion workflow
- [ ] **Phase 2: Finals (32 players)**
  - 3 rounds
  - Crown champion
  - Score reset on phase transition
- [ ] **Phase Transition UI**
  - "Finalize Round 3 & Advance Top 32" button
  - Preview qualified players
  - Confirmation dialog
  - Lock previous phase rounds

#### 4. Round Management
- [ ] **Round Tracking**
  - Current round indicator
  - Round status (In Progress, Completed, Locked)
  - Round completion validation
- [ ] **Round Progression**
  - "Complete Round" button
  - Verify all scorecards submitted
  - Lock round after completion
  - Unlock for corrections (admin only)

#### 5. Enhanced Scorecard
- [ ] **Placement Input**
  - Dropdown for each player (1st/2nd/3rd/4th)
  - Validation: Each placement used exactly once
  - Auto-calculate from scores (with override)
- [ ] **Placement Points Display**
  - Show points earned per placement
  - Visual feedback (medals for 1st/2nd/3rd)
- [ ] **Round Context**
  - Display current round number
  - Show phase (Qualification/Finals)

#### 6. Data Model Updates
- [ ] **Player Model Extensions**
  ```javascript
  {
    // Existing fields...
    placementPoints: number,
    totalGameScore: number,
    phase1Score: number,
    phase1Rank: number,
    phase1Qualified: boolean,
    phase2Score: number,
    phase2Rank: number,
    rounds: [
      {
        roundNumber: number,
        phase: number,
        gameId: string,
        placement: number,
        placementPoints: number,
        gameScore: number,
        opponents: [playerIds]
      }
    ]
  }
  ```
- [ ] **Game Model Extensions**
  ```javascript
  {
    // Existing fields...
    roundNumber: number,
    phase: number,
    status: 'pending' | 'completed' | 'locked',
    results: [
      {
        playerId: number,
        placement: number,
        placementPoints: number,
        gameScore: number
      }
    ]
  }
  ```

#### 7. Admin Dashboard Enhancements
- [ ] **Tournament Overview**
  - Current phase indicator
  - Current round indicator
  - Games completed / total
  - Pending scorecards count
- [ ] **Quick Actions**
  - Complete current round
  - Advance to next phase
  - Export standings
- [ ] **Dual Leaderboards**
  - Phase 1 standings (all 108)
  - Phase 2 standings (top 32 only)

### Nice-to-Have (V1.x)
- [ ] Player performance graphs
- [ ] Head-to-head records
- [ ] Corporation win rate statistics
- [ ] Print-friendly standings view

---

## 🎯 V2 - Swiss Pairing & Advanced Features

**Goal**: Automated Swiss pairing algorithm and enhanced user experience

### Core Features

#### 1. Swiss Pairing Algorithm ⭐ Critical
- [ ] **Round 1 Pairing**
  - Random pairing option
  - Seeded pairing option
  - Manual seeding interface
- [ ] **Rounds 2+ Pairing**
  - Automatic Swiss pairing
  - Group by similar placement points
  - Avoid rematch logic
  - Handle odd player counts (byes)
- [ ] **Pairing Preview**
  - Show proposed pairings before confirmation
  - Manual adjustments allowed
  - Conflict warnings (rematches, etc.)
- [ ] **Generate Next Round Button**
  - One-click pairing generation
  - Validation checks
  - Confirmation dialog

#### 2. Player Experience
- [ ] **Personal Dashboard**
  - My current standing
  - My placement history
  - Next opponent notification
  - Round schedule
- [ ] **Mobile Scorecard Optimization**
  - Simplified mobile layout
  - Touch-optimized inputs
  - Offline support (PWA)
- [ ] **Notifications**
  - Round start alerts
  - Pairing announcements
  - Results posted notifications

#### 3. Real-Time Updates
- [ ] **Live Standings**
  - Auto-refresh on scorecard submission
  - WebSocket/SSE integration
  - Animated rank changes
- [ ] **Admin Broadcast**
  - Send messages to all players
  - Announcements system
  - Important alerts

#### 4. Data & Analytics
- [ ] **Tournament Statistics**
  - Average scores per round
  - Score distribution graphs
  - Corporation usage stats
  - Win rate by corporation
- [ ] **Player Analytics**
  - Performance trends
  - Consistency metrics
  - Improvement tracking
- [ ] **Export Options**
  - PDF standings report
  - CSV data export
  - Printable brackets

#### 5. Enhanced Admin Tools
- [ ] **Bulk Operations**
  - CSV player import
  - Bulk player check-in
  - Mass scorecard validation
- [ ] **Tournament Templates**
  - Save tournament configurations
  - Reuse settings
  - Quick tournament setup
- [ ] **Audit Log**
  - Track all admin actions
  - Scorecard edit history
  - Rollback capability

#### 6. UI/UX Improvements
- [ ] **Bracket Visualization**
  - Interactive tournament tree
  - Game flow diagram
  - Animated transitions
- [ ] **Dark Mode**
  - Toggle dark/light theme
  - Persist user preference
- [ ] **Accessibility**
  - Keyboard navigation
  - Screen reader support
  - High contrast mode

---

## 🌟 V3 - Multi-Tournament & Enterprise

**Goal**: Support multiple tournaments and advanced organizational features

### Core Features

#### 1. Multi-Tournament Support
- [ ] **Tournament Management**
  - Create multiple tournaments
  - Archive completed tournaments
  - Clone tournament settings
- [ ] **Tournament Types**
  - Swiss system
  - Round robin
  - Single/double elimination
  - Custom formats
- [ ] **Tournament Dashboard**
  - Overview of all tournaments
  - Quick access to active tournaments
  - Historical data

#### 2. User Authentication & Roles
- [ ] **User Accounts**
  - Player profiles
  - Email/password authentication
  - OAuth (Google, Discord)
- [ ] **Role-Based Access**
  - Admin: Full control
  - Judge: Scorecard validation only
  - Player: View & submit scores
  - Spectator: Read-only access
- [ ] **Permissions System**
  - Multiple admins per tournament
  - Delegate responsibilities
  - Audit trail

#### 3. Backend & Database
- [ ] **Real Database**
  - Supabase/Firebase integration
  - Data persistence
  - Automatic backups
  - Multi-device sync
- [ ] **API Layer**
  - RESTful API
  - GraphQL option
  - Rate limiting
  - API documentation
- [ ] **Security**
  - JWT authentication
  - Data encryption
  - Input validation
  - CSRF protection

#### 4. Advanced Pairing
- [ ] **Seeding Options**
  - Import from previous tournament
  - Elo-based seeding
  - Regional balancing
- [ ] **Pairing Constraints**
  - Never pair specific players
  - Preferred opponents
  - Skill-based matchmaking
  - Geographic considerations

#### 5. Integration & Export
- [ ] **External Services**
  - Discord bot integration
  - Email notifications
  - Twitch/YouTube streaming integration
  - Calendar sync (Google Calendar, iCal)
- [ ] **Data Export**
  - Challonge-compatible format
  - JSON API for external tools
  - Webhook support
  - Custom report generation

#### 6. Performance & Scalability
- [ ] **Optimization**
  - Virtual scrolling for large lists
  - Lazy loading
  - Image optimization
  - Caching strategy
- [ ] **Scalability**
  - Support 500+ players
  - Multiple concurrent tournaments
  - Load balancing
  - CDN integration

---

## 🧪 Testing & Quality (Ongoing)

### V1
- [ ] Unit tests for scoring calculations
- [ ] E2E tests for critical flows
- [ ] Manual testing checklist

### V2
- [ ] Unit tests for pairing algorithm
- [ ] Integration tests for real-time updates
- [ ] Performance testing (100+ players)

### V3
- [ ] Load testing (500+ players)
- [ ] Security audit
- [ ] Accessibility audit
- [ ] Cross-browser testing

---

## 📅 Estimated Timeline

### V1 - Swiss Foundation (4-6 weeks)
- Week 1-2: Scoring system & data models
- Week 3-4: Standings & phase management
- Week 5-6: Testing & polish

### V2 - Pairing & UX (6-8 weeks)
- Week 1-3: Swiss pairing algorithm
- Week 4-5: Player experience & real-time
- Week 6-7: Analytics & admin tools
- Week 8: Testing & refinement

### V3 - Enterprise (8-12 weeks)
- Week 1-4: Multi-tournament & auth
- Week 5-8: Backend & database migration
- Week 9-10: Integrations
- Week 11-12: Performance & security

---

## 🎯 Success Metrics

### V1
- ✅ Successfully run a 108-player, 3-round tournament
- ✅ Automatic standings calculation with 100% accuracy
- ✅ Phase transition without data loss
- ✅ Admin can complete full tournament in < 4 hours

### V2
- ✅ Pairing generation in < 5 seconds for 108 players
- ✅ Zero pairing conflicts
- ✅ 90%+ player satisfaction with mobile experience
- ✅ Real-time updates with < 2 second latency

### V3
- ✅ Support 5+ concurrent tournaments
- ✅ 500+ player capacity
- ✅ 99.9% uptime
- ✅ < 3 second page load time

---

## 📝 Notes

### Technical Debt to Address
- Migrate from localStorage to real database (V3)
- Add comprehensive error handling (V1)
- Implement proper state management patterns (V2)
- Add TypeScript for type safety (V2/V3)

### Community Feedback
- Collect user feedback after V1 launch
- Prioritize V2 features based on usage data
- Beta testing program for V3

### Documentation
- User guide for players (V1)
- Admin manual (V1)
- API documentation (V3)
- Video tutorials (V2)

---

**Last Updated**: October 27, 2025  
**Current Version**: V0 (Completed)  
**Next Milestone**: V1 - Swiss Foundation
