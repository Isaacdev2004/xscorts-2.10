# Age Verification & Consent Modal Feature

## Overview

This feature implements a comprehensive age verification and consent modal that appears when visitors first open the website, similar to the Kinky.nl implementation. The modal requires users to confirm:

1. **Age Verification** - User declares to be 18 years or older
2. **Terms & Conditions** - User agrees to General Terms and Conditions
3. **Privacy Policy** - User agrees to Privacy Policy
4. **Cookie Consent** - User agrees to Cookie statement and accepts cookies

## Features

- ✅ **Modal appears on first visit** - Shows when user hasn't confirmed all requirements
- ✅ **All checkboxes required** - User must accept all to proceed
- ✅ **Cookie-based storage** - Preferences saved for 30 days
- ✅ **Responsive design** - Works on desktop and mobile
- ✅ **Language selector** - Ready for multi-language support
- ✅ **Cannot be bypassed** - Modal is non-dismissible until all items are accepted

## Files Created/Modified

### New Files:
1. `user/src/components/common/age-verification-modal.tsx` - Main modal component
2. `user/src/components/common/age-verification-modal.less` - Styling for the modal

### Modified Files:
1. `user/src/layouts/primary-layout.tsx` - Updated to check for cookie consent as well

## How It Works

1. **On Page Load**: The `PrimaryLayout` component checks for consent cookies
2. **If Missing**: The modal appears and blocks access to the site
3. **User Interaction**: User must toggle all 4 switches to enable the "Continue" button
4. **On Confirm**: Cookies are set for 30 days and modal closes
5. **Subsequent Visits**: Modal won't show if all cookies are present

## Cookie Storage

The following cookies are set (expires in 30 days):
- `confirm_adult` - Age verification
- `confirm_privacy` - Privacy policy acceptance
- `confirm_terms` - Terms and conditions acceptance
- `confirm_cookies` - Cookie consent

## Customization

### Text Content
Edit the text in `age-verification-modal.tsx`:
- Header text: "Important Before You Start!"
- Info paragraphs
- Consent labels

### Styling
Edit `age-verification-modal.less`:
- Colors (currently uses red theme: #d32f2f)
- Spacing and padding
- Responsive breakpoints

### Cookie Duration
Change the expiration time in `age-verification-modal.tsx`:
```typescript
cookieService.setCookie('confirm_adult', 'true', 30 * 24 * 60); // 30 days
```

## Testing

1. Clear browser cookies
2. Visit the website
3. Modal should appear
4. Try to proceed without checking all boxes (button should be disabled)
5. Check all boxes and proceed
6. Refresh page - modal should not appear
7. Clear cookies and repeat

## Future Enhancements

- [ ] Multi-language support (currently has selector but no translation)
- [ ] Cookie preferences management page ("My Settings")
- [ ] Different cookie types (functional, analytical, marketing)
- [ ] Analytics tracking for consent acceptance
- [ ] Remember language preference

## Notes

- The modal uses Ant Design's `Modal` and `Switch` components
- Cookies are managed through the existing `cookieService`
- The modal is non-dismissible (no X button) to ensure compliance
- All consent must be given before proceeding

