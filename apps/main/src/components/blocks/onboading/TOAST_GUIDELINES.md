# Toast Usage Guidelines

## Core Principle

**Ask: "Does the user need to fix something right now?"**
- **Yes** → Use inline errors
- **No** → Use toast (for success/background notifications)

---

## ✅ What Toasts Are Good For

### 1. Success Confirmations (After Navigation)
```tsx
// ✅ Good: After successful action, user is moving forward
navigate('/dashboard');
toast.success('Workspace created');
```

### 2. Non-Blocking Background Actions
```tsx
// ✅ Good: User doesn't need to act
toast.success('Auto-saved');
toast.success('Link copied to clipboard');
```

### 3. Global Notifications
```tsx
// ✅ Good: Applies across the app, not tied to a form
toast.success('Settings updated');
```

---

## ❌ What Toasts Are Bad For

### 1. Form Validation Errors
```tsx
// ❌ Bad: User needs to fix this
toast.error('Workspace name is required');

// ✅ Good: Inline error
setError('Workspace name is required');
// Displayed under the input field
```

### 2. API Errors That Block Progress
```tsx
// ❌ Bad: User needs to fix credentials
toast.error('Invalid email or password');

// ✅ Good: Inline error
setServerError('Invalid email or password');
// Displayed in the form
```

### 3. Onboarding Errors
```tsx
// ❌ Bad: Adds noise during setup
toast.error('Please fill in all fields');

// ✅ Good: Inline validation
// Show errors directly under each field
```

---

## Implementation Pattern

### For Components Using React Hook Form

**Use React Hook Form's `setError` for server errors:**

```tsx
import { useForm } from 'react-hook-form';
import { toast } from '@pacepard/ui';

const {
  handleSubmit,
  setError,
  formState: { errors },
} = useForm<FormValues>({
  resolver: zodResolver(schema),
});

const onSubmit = async (data: FormValues) => {
  try {
    const response = await apiCall(data);
    
    if (response.error) {
      // Use React Hook Form's setError for server errors (inline, not toast)
      setError('root', {
        type: 'server',
        message: response.message || 'Operation failed',
      });
      // Or set error on specific field:
      // setError('email', { type: 'server', message: 'Email already exists' });
    } else {
      // Navigate first
      navigate('/next-step');
      // Then optional success toast (non-blocking)
      toast.success('Success!');
    }
  } catch (error) {
    // Use React Hook Form's setError for unexpected errors
    setError('root', {
      type: 'server',
      message: 'An unexpected error occurred. Please try again.',
    });
  }
};

// In JSX - React Hook Form errors are automatically available
{errors.root && (
  <p className="text-sm text-destructive">{errors.root.message}</p>
)}
{errors.email && (
  <p className="text-sm text-destructive">{errors.email.message}</p>
)}
```

### For Components NOT Using React Hook Form

**Use plain `useState` for simple forms:**

```tsx
import { useState } from 'react';
import { toast } from '@pacepard/ui';

const [error, setError] = useState<string>('');

const handleSubmit = async () => {
  // Validation - inline errors
  if (!workspaceName.trim()) {
    setError('Workspace name is required');
    return;
  }

  try {
    const response = await createWorkspace(data);
    
    if (response.error) {
      // Inline error - user needs to fix
      setError(response.message || 'Failed to create workspace');
    } else {
      // Navigate first
      navigate('/next-step');
      // Then optional success toast (non-blocking)
      toast.success('Workspace created');
    }
  } catch (error) {
    // Inline error for unexpected errors
    setError('An unexpected error occurred. Please try again.');
  }
};

// In JSX
{error && (
  <p className="text-sm text-destructive">{error}</p>
)}
```

---

## Examples in Codebase

### ✅ Correct Usage

**create-workspace.tsx**
- Inline errors for validation and API failures
- Optional success toast after navigation

**invite-teammates.tsx**
- Inline errors for email validation
- Toast for "Link copied" (non-blocking action)

**login-form.tsx**
- Inline errors for authentication failures
- Success toast after navigation

---

## Quick Reference

| Scenario | Use | Example |
|----------|-----|---------|
| Form validation | Inline | `setError('Field required')` |
| API error (user must fix) | Inline | `setServerError('Invalid credentials')` |
| Success after navigation | Toast | `toast.success('Created')` |
| Copy to clipboard | Toast | `toast.success('Copied')` |
| Background sync | Toast | `toast.success('Saved')` |
| Onboarding errors | Inline | Always inline |
| Blocking errors | Inline | Always inline |

---

## Remember

- **Onboarding should be calm** - avoid toast spam
- **Errors should be actionable** - show them where the user can fix them
- **Success toasts are optional** - only after navigation or for background actions
- **When in doubt, use inline errors**
