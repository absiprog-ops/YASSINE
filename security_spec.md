# Security Specification & Test Definitions

## 1. Data Invariants
1. `orders`: Orders submitted by clients must match `request.auth.uid` as `userId` or have a valid client identity matching the submitter. Only the owner or an admin can view their specific order. Admins can manage all orders.
2. `users`: User profiles can only be created/updated by the profile owner (`request.auth.uid == userId`) or an admin.
3. `reviews`: Approved reviews are publicly readable. Any authenticated or anonymous user can submit a review with `isApproved == false` by default, or liked count increments. Only admins can update `isApproved`.
4. `apartments`, `paintsCatalog`, `partners`, `settings`: Publicly readable by all users. Write operations (create/update/delete) are strictly reserved for verified Admins.

## 2. Dirty Dozen Payloads (Security Attack Vectors)
1. **Self-Promotion to Admin**: Client tries creating a `/users/{uid}` profile setting `role: "ADMIN"`.
2. **Ghost Field Injection**: Client tries updating an apartment document with `fakeAdminField: true`.
3. **Impersonated Order Submission**: User A tries submitting an order with `userId: "user-B-uid"`.
4. **Order State Shortcutting**: Non-admin client attempts to update their pending order to `status: "APPROVED"`.
5. **Auto-Approve Review**: Non-admin user posts a review payload with `isApproved: true`.
6. **Negative or Infinite Price Injection**: Client updates an apartment with `price: -500000`.
7. **Junk Character ID Attack**: Client attempts writing to `/orders/<1000-character-junk-string>`.
8. **PII Data Scrape**: Unauthenticated or non-owner user attempts to list all user profile documents from `/users`.
9. **Settings Overwrite**: Non-admin user attempts writing new phone/contact details into `/settings/config`.
10. **Over-sized Payload Spam**: Client posts a review comment exceeding 2,000 characters.
11. **Partner Hijack**: Non-admin user attempts deleting a partner entry from `/partners/{partnerId}`.
12. **Immutable Field Alteration**: User attempts modifying `createdAt` or `submittedAt` on an existing order.

## 3. Test Runner Definition
All dirty dozen operations must return `PERMISSION_DENIED` in security rules tests.
