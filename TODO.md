# TODO - Flour Buddy React Native modernization & Firebase-ready setup

## Step 1: Foundation (safe refactor, no major visual changes)
- [ ] Create theme/color/spacing/typography modules under `src/theme/`.
- [ ] Create responsive utility helpers under `src/utils/` (wrap responsive-dimensions + common spacing).
- [ ] Add UI primitives under `src/components/ui/` (Button, TextInputField, Card, SectionHeader, Screen wrapper).

## Step 2: Firebase-ready architecture (incremental)
- [ ] Create `src/services/auth/` (auth service abstraction + Google sign-in config moved out of screens).
- [ ] Create `src/services/notifications/` messaging service wrapper.
- [ ] Create `src/storage/keys.ts` and `src/storage/storageService.ts` (centralize AsyncStorage keys).

## Step 3: State management cleanup
- [ ] Add `src/redux/authSlice.js` for auth/user/profile/token state.
- [ ] Ensure screens use Redux Toolkit patterns (avoid legacy `src/redux/actions.js` where possible).
- [ ] Keep cart as-is via existing `cartSlice`.

## Step 4: Screen-by-screen updates (safe refactor)
- [ ] Update `src/screens/Loginscreen/Loginscreen.js` to use new UI primitives + auth service.
- [ ] Update `src/screens/OTPscreen/OTPscreen.js` to use auth service + centralized storage keys.
- [ ] Update `src/screens/Homescreen/Homescreen.js` to reduce nested scroll usage and improve list virtualization patterns.
- [ ] Update other screens/components that repeat layout patterns (Address, Profile, Terms, Aboutus, Support).

## Step 5: Final validation
- [ ] Run `npm test` and `npm run lint`.
- [ ] Build/run on Android (and iOS if available).
- [ ] Verify login flow works: Login -> OTP -> Main tab.

