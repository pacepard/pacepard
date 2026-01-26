Alright, here’s the **subscription flow exactly as your code implements it**, no idealized version, no assumptions — just what actually happens if we follow the logic path-by-path.

I’ll describe this as a **state machine driven by `SubscriptionIntent.state`**, because that’s how your service behaves.

---

# 1. High-level mental model

You have **three core entities** involved in the flow:

1. **SubscriptionIntent**
   → controls the journey / state machine
2. **Transaction**
   → handles Paystack payments and verification
3. **Subscription**
   → the final persisted billing + access record

Everything revolves around **moving the intent from INITIATED → SUCCEEDED**.

---

# 2. Entry point: `handleSubscriptionIntent(...)`

This is the orchestrator.

```ts
switch (intent.state) {
  INITIATED
  VALIDATING
  AWAITING_PAYMENT
  PAYMENT_PROCESSING
  SUBSCRIPTION_CREATING
  SUCCEEDED
  FAILED / CANCELED / EXPIRED
}
```

Depending on the current state, the request is **resumed**, not restarted.

This allows:

- retries
- page refreshes
- polling after redirects
- webhook-driven continuation

---

# 3. INITIATED state (starting point)

### `handleInitiatingState`

This is the **first real step** after intent creation.

### What happens here:

1. **Email verification**
    - Fetch base user
    - If email not verified → hard stop

2. **Move intent → VALIDATING**

3. **Trial usage check**
    - If user already used trial:
        - Mark `metaData.skipTrial = true`
        - Return message warning trial won’t apply

4. **Active subscription check**
    - If user has ACTIVE or TRIALING subscription → stop

5. **Plan availability check**
    - If plan unavailable → stop
    - If plan has **no trial**:
        - Mark `metaData.proceedWithNoTrial = true`
        - Return message warning that charges will apply

6. **Trial path only**
    - Resolve Paystack plan code
    - Generate subscription reference
    - Initialize **card tokenization transaction**
        - Small charge (₦50 / $1)

    - Move intent → `AWAITING_PAYMENT`
    - Save:
        - transactionReference
        - authUrl
        - mode = `trial`

### Outcome:

- User is redirected to Paystack
- No subscription exists yet

---

# 4. VALIDATING state (user confirms proceeding)

### `handleValidatingState`

This is basically **INITIATED but resumed**, usually after user agrees to proceed without trial.

### What happens:

1. **Trial skip logic**
    - If `skipTrial` not set:
        - Re-check trial usage

2. **Active subscription check**
    - Same as INITIATED

3. **Plan availability check**
    - Same logic
    - If plan hasAlright, here’s the **subscription flow exactly as your code implements it**, no idealized version, no assumptions — just what actually happens if we follow the logic path-by-path.

I’ll describe this as a **state machine driven by `SubscriptionIntent.state`**, because that’s how your service behaves.

---

# 1. High-level mental model

You have **three core entities** involved in the flow:

1. **SubscriptionIntent**
   → controls the journey / state machine
2. **Transaction**
   → handles Paystack payments and verification
3. **Subscription**
   → the final persisted billing + access record

Everything revolves around **moving the intent from INITIATED → SUCCEEDED**.

---

# 2. Entry point: `handleSubscriptionIntent(...)`

This is the orchestrator.

```ts
switch (intent.state) {
  INITIATED
  VALIDATING
  AWAITING_PAYMENT
  PAYMENT_PROCESSING
  SUBSCRIPTION_CREATING
  SUCCEEDED
  FAILED / CANCELED / EXPIRED
}
```

Depending on the current state, the request is **resumed**, not restarted.

This allows:

- retries
- page refreshes
- polling after redirects
- webhook-driven continuation

---

# 3. INITIATED state (starting point)

### `handleInitiatingState`

This is the **first real step** after intent creation.

### What happens here:

1. **Email verification**
    - Fetch base user
    - If email not verified → hard stop

2. **Move intent → VALIDATING**

3. **Trial usage check**
    - If user already used trial:
        - Mark `metaData.skipTrial = true`
        - Return message warning trial won’t apply

4. **Active subscription check**
    - If user has ACTIVE or TRIALING subscription → stop

5. **Plan availability check**
    - If plan unavailable → stop
    - If plan has **no trial**:
        - Mark `metaData.proceedWithNoTrial = true`
        - Return message warning that charges will apply

6. **Trial path only**
    - Resolve Paystack plan code
    - Generate subscription reference
    - Initialize **card tokenization transaction**
        - Small charge (₦50 / $1)

    - Move intent → `AWAITING_PAYMENT`
    - Save:
        - transactionReference
        - authUrl
        - mode = `trial`

### Outcome:

- User is redirected to Paystack
- No subscription exists yet

---

# 4. VALIDATING state (user confirms proceeding)

### `handleValidatingState`

This is basically **INITIATED but resumed**, usually after user agrees to proceed without trial.

### What happens:

1. **Trial skip logic**
    - If `skipTrial` not set:
        - Re-check trial usage

2. **Active subscription check**
    - Same as INITIATED

3. **Plan availability check**
    - Same logic
    - If plan has no trial and user hasn’t confirmed → stop

4. **Direct charge path**
    - Resolve plan code
    - Generate reference
    - Initialize Paystack transaction **with planCode**
    - Move intent → `AWAITING_PAYMENT`
    - Save:
        - authUrl
        - mode = `direct_charge`

### Outcome:

- User goes to Paystack
- Payment will actually activate subscription

---

# 5. AWAITING_PAYMENT state (waiting for checkout)

### `handleAwaitingPayment`

This is hit when:

- User returns from Paystack
- Client polls status

### What happens:

1. **Ensure transactionReference exists**
    - If missing → FAIL intent

2. **Verify transaction status**
    - `verifyTransaction(ref)`

### Branching:

#### a) SUCCESS

- Move intent → `PAYMENT_PROCESSING`
- Immediately call `handlePaymentProcessing`

#### b) FAILED

- Move intent → `FAILED`
- Hard stop

#### c) PENDING / ABANDONED / TIMEOUT

- Return authUrl again
- Ask user to continue checkout

---

# 6. PAYMENT_PROCESSING state (post-payment confirmation)

### `handlePaymentProcessing`

This confirms that **Paystack + webhook + DB agree payment succeeded**.

### What happens:

1. **Verify reference exists**

2. **Verify transaction record**
    - `verifyPaymentForSub(reference)`
    - Must exist in DB
    - Must be `SUCCESS`

3. **If verification fails**
    - Move intent → FAILED

4. **If verification succeeds**
    - Move intent → `SUBSCRIPTION_CREATING`
    - Add `paymentConfirmedAt` timestamp

5. **Call `handleSubscriptionCreating`**

### Outcome:

- Payment is confirmed
- No subscription yet

---

# 7. SUBSCRIPTION_CREATING state (finalization)

### `handleSubscriptionCreating`

This is where **the real subscription is born**.

### Steps:

1. **Ensure payment was confirmed**

2. **Prevent duplicate creation**
    - If `intent.subscriptionId` exists → exit

3. **Build subscription record**
    - Generate code
    - Determine user type (business / talent)
    - Attach transaction ID

4. **Branch by mode**

#### Trial mode

- Status → `TRIALING`
- Save card auth code
- Mark user trial as used
- (Future job scheduled to auto-charge)

#### Direct charge

- Status → `ACTIVE`
- Save card auth code

5. **Build billing object**
    - startAt = now
    - dueAt:
        - trial → trial.days
        - monthly → +1 month
        - yearly → +1 year

    - graceAt = dueAt + 5 days

6. **Persist subscription**

7. **Move intent → SUCCEEDED**

8. **Attach subscription to user profile**

### Outcome:

- Subscription exists
- User now has access

---

# 8. SUCCEEDED state

### `handleSucceededState`

This is idempotent.

- Fetch subscription
- Return it
- No mutations

Used for:

- Refresh
- Duplicate requests
- Post-redirect checks

---

# 9. Terminal states

### FAILED / CANCELED / EXPIRED

### `handleTermninalState`

- Intent is dead
- User must start a new subscription

---

# 10. Cancellation flow

### `cancelSubscription`

1. Fetch user subscription
2. If ACTIVE:
    - Cancel on Paystack

3. If TRIALING:
    - Cancel scheduled job (TODO)

4. Update subscription → `CANCELED`

---

# 11. Webhook flow (Paystack)

### `subscription.create`

- Finds subscription by customer email
- Updates metadata:
    - subscriptionCode
    - emailToken

Used later for cancellation.

---

# TL;DR (one paragraph)

A user creates a `SubscriptionIntent`, which moves through **INITIATED → VALIDATING → AWAITING_PAYMENT → PAYMENT_PROCESSING → SUBSCRIPTION_CREATING → SUCCEEDED**. Along the way, the system checks email verification, trial eligibility, active subscriptions, and plan availability, then initializes a Paystack transaction (either trial card tokenization or direct charge). After Paystack confirms payment (via polling + webhook), a `Subscription` record is created, billing dates are calculated, trial usage is marked if applicable, and the subscription is attached to the user. The intent acts as a resumable state machine that survives redirects and retries.

If you want next, I can:

- draw this as a **state diagram**
- point out **exactly where it can break under concurrency**
- or propose a **cleaner state machine rewrite**
  no trial and user hasn’t confirmed → stop

4. **Direct charge path**
    - Resolve plan code
    - Generate reference
    - Initialize Paystack transaction **with planCode**
    - Move intent → `AWAITING_PAYMENT`
    - Save:
        - authUrl
        - mode = `direct_charge`

### Outcome:

- User goes to Paystack
- Payment will actually activate subscription

---

# 5. AWAITING_PAYMENT state (waiting for checkout)

### `handleAwaitingPayment`

This is hit when:

- User returns from Paystack
- Client polls status

### What happens:

1. **Ensure transactionReference exists**
    - If missing → FAIL intent

2. **Verify transaction status**
    - `verifyTransaction(ref)`

### Branching:

#### a) SUCCESS

- Move intent → `PAYMENT_PROCESSING`
- Immediately call `handlePaymentProcessing`

#### b) FAILED

- Move intent → `FAILED`
- Hard stop

#### c) PENDING / ABANDONED / TIMEOUT

- Return authUrl again
- Ask user to continue checkout

---

# 6. PAYMENT_PROCESSING state (post-payment confirmation)

### `handlePaymentProcessing`

This confirms that **Paystack + webhook + DB agree payment succeeded**.

### What happens:

1. **Verify reference exists**

2. **Verify transaction record**
    - `verifyPaymentForSub(reference)`
    - Must exist in DB
    - Must be `SUCCESS`

3. **If verification fails**
    - Move intent → FAILED

4. **If verification succeeds**
    - Move intent → `SUBSCRIPTION_CREATING`
    - Add `paymentConfirmedAt` timestamp

5. **Call `handleSubscriptionCreating`**

### Outcome:

- Payment is confirmed
- No subscription yet

---

# 7. SUBSCRIPTION_CREATING state (finalization)

### `handleSubscriptionCreating`

This is where **the real subscription is born**.

### Steps:

1. **Ensure payment was confirmed**

2. **Prevent duplicate creation**
    - If `intent.subscriptionId` exists → exit

3. **Build subscription record**
    - Generate code
    - Determine user type (business / talent)
    - Attach transaction ID

4. **Branch by mode**

#### Trial mode

- Status → `TRIALING`
- Save card auth code
- Mark user trial as used
- (Future job scheduled to auto-charge)

#### Direct charge

- Status → `ACTIVE`
- Save card auth code

5. **Build billing object**
    - startAt = now
    - dueAt:
        - trial → trial.days
        - monthly → +1 month
        - yearly → +1 year

    - graceAt = dueAt + 5 days

6. **Persist subscription**

7. **Move intent → SUCCEEDED**

8. **Attach subscription to user profile**

### Outcome:

- Subscription exists
- User now has access

---

# 8. SUCCEEDED state

### `handleSucceededState`

This is idempotent.

- Fetch subscription
- Return it
- No mutations

Used for:

- Refresh
- Duplicate requests
- Post-redirect checks

---

# 9. Terminal states

### FAILED / CANCELED / EXPIRED

### `handleTermninalState`

- Intent is dead
- User must start a new subscription

---

# 10. Cancellation flow

### `cancelSubscription`

1. Fetch user subscription
2. If ACTIVE:
    - Cancel on Paystack

3. If TRIALING:
    - Cancel scheduled job (TODO)

4. Update subscription → `CANCELED`

---

# 11. Webhook flow (Paystack)

### `subscription.create`

- Finds subscription by customer email
- Updates metadata:
    - subscriptionCode
    - emailToken

Used later for cancellation.

---

# TL;DR (one paragraph)

A user creates a `SubscriptionIntent`, which moves through **INITIATED → VALIDATING → AWAITING_PAYMENT → PAYMENT_PROCESSING → SUBSCRIPTION_CREATING → SUCCEEDED**. Along the way, the system checks email verification, trial eligibility, active subscriptions, and plan availability, then initializes a Paystack transaction (either trial card tokenization or direct charge). After Paystack confirms payment (via polling + webhook), a `Subscription` record is created, billing dates are calculated, trial usage is marked if applicable, and the subscription is attached to the user. The intent acts as a resumable state machine that survives redirects and retries.

If you want next, I can:

- draw this as a **state diagram**
- point out **exactly where it can break under concurrency**
- or propose a **cleaner state machine rewrite**
